#!/usr/bin/env node

/**
 * THE LINKER - Comprehensive Link Checker for Toronto Guide
 * 
 * Scans all CSV data files and validates every URL with:
 * - HTTP status code checking
 * - Response time monitoring  
 * - Retry logic for failures
 * - Rate limiting to be respectful
 * - Comprehensive reporting
 * - Auto-fix suggestions
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');
const Papa = require('papaparse');

class TheLinker {
  constructor(options = {}) {
    this.options = {
      timeout: options.timeout || 10000,        // 10 second timeout
      retries: options.retries || 3,            // Retry failed requests 3 times
      rateLimit: options.rateLimit || 100,      // Max 100ms between requests
      maxConcurrent: options.maxConcurrent || 5, // Check 5 links at once
      userAgent: 'Toronto-Guide-Link-Checker/1.0',
      cleanup: options.cleanup || false,       // Enable cleanup mode
      backupOriginals: options.backupOriginals !== false, // Backup original files
      dryRun: options.dryRun || false,         // Show what would be fixed without doing it
      ...options
    };

    this.results = {
      totalLinks: 0,
      checkedLinks: 0,
      workingLinks: 0,
      brokenLinks: 0,
      warnings: 0,
      byFile: {},
      issues: [],
      summary: {}
    };

    this.cache = new Map(); // Cache results to avoid duplicate checks
    this.queue = [];        // Queue for rate-limited processing
    this.isRunning = false;
    
    // Cleanup tracking
    this.cleanupActions = [];
    this.fixedFiles = new Map();
    this.cleanupStats = {
      fakeGoogleMaps: 0,
      redirectUpdates: 0,
      brokenLinksRemoved: 0,
      totalFixes: 0
    };
  }

  /**
   * Main entry point - check all data files
   */
  async checkAllLinks() {
    console.log('🔗 THE LINKER - Comprehensive Link Checker Starting...\n');
    
    const startTime = Date.now();
    const dataFiles = this.getDataFiles();
    
    console.log(`📁 Found ${dataFiles.length} data files to check:`);
    dataFiles.forEach(file => console.log(`   - ${file}`));
    console.log('');

    // Process each data file
    for (const file of dataFiles) {
      await this.processDataFile(file);
    }

    // Process the queue
    await this.processQueue();

    // Generate reports
    const duration = Date.now() - startTime;
    await this.generateReports(duration);

    console.log('\n🎉 THE LINKER scan complete!');
    return this.results;
  }

  /**
   * Get all CSV data files that contain URLs
   */
  getDataFiles() {
    const dataDir = 'public/data';
    const files = fs.readdirSync(dataDir)
      .filter(file => file.endsWith('.csv') && !file.includes('backup') && !file.includes('.bak'))
      .map(file => path.join(dataDir, file));

    return files;
  }

  /**
   * Process a single CSV data file
   */
  async processDataFile(filePath) {
    const fileName = path.basename(filePath);
    console.log(`📄 Processing ${fileName}...`);

    try {
      const csvData = fs.readFileSync(filePath, 'utf8');
      const { data, errors } = Papa.parse(csvData, {
        header: true,
        delimiter: '|',
        skipEmptyLines: true
      });

      if (errors.length > 0) {
        console.log(`   ⚠️  CSV parsing errors: ${errors.length}`);
      }

      this.results.byFile[fileName] = {
        totalRows: data.length,
        linksFound: 0,
        workingLinks: 0,
        brokenLinks: 0,
        warnings: 0,
        issues: []
      };

      // Extract URLs from each row
      data.forEach((row, index) => {
        this.extractURLsFromRow(row, fileName, index + 2); // +2 for header line
      });

      console.log(`   📊 Found ${this.results.byFile[fileName].linksFound} links`);

    } catch (error) {
      console.error(`   ❌ Error processing ${fileName}: ${error.message}`);
      this.results.issues.push({
        type: 'file_error',
        file: fileName,
        message: `Failed to process file: ${error.message}`,
        severity: 'high'
      });
    }
  }

  /**
   * Extract URLs from a data row
   */
  extractURLsFromRow(row, fileName, lineNumber) {
    const urlFields = ['website', 'googleMapLink', 'googleMapsLink', 'booking_url', 'socialMedia'];
    
    urlFields.forEach(field => {
      const url = row[field];
      if (this.isValidURL(url)) {
        this.queueURLCheck(url, {
          file: fileName,
          line: lineNumber,
          field: field,
          id: row.id || `line-${lineNumber}`,
          title: row.title || row.name || 'Unknown'
        });
        
        this.results.byFile[fileName].linksFound++;
        this.results.totalLinks++;
      }
    });
  }

  /**
   * Check if a string is a valid URL worth checking
   */
  isValidURL(url) {
    if (!url || typeof url !== 'string') return false;
    
    const cleaned = url.trim();
    if (cleaned === '' || cleaned === 'N/A' || cleaned === 'Not provided' || cleaned === '#') return false;
    
    try {
      new URL(cleaned);
      return cleaned.startsWith('http://') || cleaned.startsWith('https://');
    } catch {
      return false;
    }
  }

  /**
   * Add URL to checking queue
   */
  queueURLCheck(url, context) {
    // Skip if already queued/checked
    if (this.cache.has(url)) {
      const cachedResult = this.cache.get(url);
      this.updateResultsFromCache(cachedResult, context);
      return;
    }

    this.queue.push({ url, context });
  }

  /**
   * Process the queue of URLs to check
   */
  async processQueue() {
    if (this.queue.length === 0) {
      console.log('\n📋 No URLs to check.');
      return;
    }

    console.log(`\n🔍 Checking ${this.queue.length} unique URLs...`);
    this.isRunning = true;

    // Process in batches to respect rate limits
    const batches = this.createBatches(this.queue, this.options.maxConcurrent);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`   Batch ${i + 1}/${batches.length} (${batch.length} URLs)`);
      
      const promises = batch.map(item => this.checkURL(item.url, item.context));
      await Promise.all(promises);
      
      // Rate limiting between batches
      if (i < batches.length - 1) {
        await this.sleep(this.options.rateLimit);
      }
    }

    this.isRunning = false;
  }

  /**
   * Create batches for concurrent processing
   */
  createBatches(array, batchSize) {
    const batches = [];
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * Check a single URL with strict timeout handling
   */
  async checkURL(url, context) {
    let result = {
      url,
      context,
      status: 'unknown',
      statusCode: null,
      responseTime: null,
      error: null,
      finalURL: url,
      suggestions: []
    };

    try {
      const startTime = Date.now();
      
      // Create a timeout promise that rejects after 10 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timeout - exceeded 10 second limit'));
        }, 10000);
      });

      // Race between the request and timeout
      const response = await Promise.race([
        this.makeRequest(url),
        timeoutPromise
      ]);

      const responseTime = Date.now() - startTime;

      result = {
        ...result,
        status: this.getStatusFromCode(response.statusCode),
        statusCode: response.statusCode,
        responseTime,
        finalURL: response.finalURL || url
      };

      // Check for redirects
      if (response.redirected) {
        result.suggestions.push(`Consider updating URL to final destination: ${response.finalURL}`);
      }

      // Check response time warnings
      if (responseTime > 8000) {
        result.suggestions.push('Very slow response time (>8s) - consider finding alternative');
      } else if (responseTime > 5000) {
        result.suggestions.push('Slow response time (>5s) - consider finding alternative');
      }

    } catch (error) {
      const responseTime = Date.now() - (Date.now() - 10000); // Approximate time for timeout
      result.status = 'broken';
      result.error = error.message;
      result.responseTime = error.message.includes('timeout') ? 10000 : null;
      
      // Enhanced error categorization with timeout handling
      if (error.message.includes('timeout') || error.message.includes('Request timeout')) {
        result.suggestions.push('Request timed out after 10 seconds - server may be overloaded or unreachable');
        result.suggestions.push('Consider checking if this is a valid, active website');
      } else if (error.code === 'ENOTFOUND') {
        result.suggestions.push('Domain not found - check spelling or find new URL');
      } else if (error.code === 'ECONNREFUSED') {
        result.suggestions.push('Connection refused - server may be down');
      } else if (error.code === 'CERT_INVALID') {
        result.suggestions.push('SSL certificate issue - check if site is secure');
      } else if (error.code === 'ETIMEDOUT') {
        result.suggestions.push('Connection timed out - network or server issues');
      } else if (error.code === 'ECONNRESET') {
        result.suggestions.push('Connection reset by server - try again later');
      }
    }

    // Cache result and update counters
    this.cache.set(url, result);
    this.updateCounters(result);
    this.logResult(result);

    return result;
  }

  /**
   * Make HTTP/HTTPS request with retries (internal timeout handling)
   */
  async makeRequest(url, attempt = 1) {
    return new Promise((resolve, reject) => {
      const parsedURL = new URL(url);
      const isHTTPS = parsedURL.protocol === 'https:';
      const client = isHTTPS ? https : http;

      const options = {
        hostname: parsedURL.hostname,
        port: parsedURL.port || (isHTTPS ? 443 : 80),
        path: parsedURL.pathname + parsedURL.search,
        method: 'HEAD', // Use HEAD to avoid downloading content
        timeout: 9000, // Slightly less than 10s to allow outer timeout to handle
        headers: {
          'User-Agent': this.options.userAgent
        }
      };

      const req = client.request(options, (res) => {
        // Handle redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectURL = new URL(res.headers.location, url).toString();
          resolve({
            statusCode: res.statusCode,
            redirected: true,
            finalURL: redirectURL
          });
        } else {
          resolve({
            statusCode: res.statusCode,
            redirected: false,
            finalURL: url
          });
        }
      });

      req.on('error', async (error) => {
        // Don't retry on timeout errors to ensure we respect the 10s limit
        if (error.message.includes('timeout') || error.code === 'ETIMEDOUT') {
          reject(error);
          return;
        }
        
        if (attempt < this.options.retries) {
          await this.sleep(1000 * attempt); // Exponential backoff
          try {
            const result = await this.makeRequest(url, attempt + 1);
            resolve(result);
          } catch (retryError) {
            reject(retryError);
          }
        } else {
          reject(error);
        }
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Internal request timeout after 9 seconds'));
      });

      req.end();
    });
  }

  /**
   * Get status from HTTP status code
   */
  getStatusFromCode(code) {
    if (code >= 200 && code < 300) return 'healthy';
    if (code >= 300 && code < 400) return 'warning';
    if (code >= 400) return 'broken';
    return 'unknown';
  }

  /**
   * Update counters based on result
   */
  updateCounters(result) {
    const fileName = result.context.file;
    
    this.results.checkedLinks++;
    this.results.byFile[fileName] = this.results.byFile[fileName] || {};

    // Initialize timeout counter if needed
    if (!this.results.timeoutLinks) {
      this.results.timeoutLinks = 0;
    }

    switch (result.status) {
      case 'healthy':
        this.results.workingLinks++;
        this.results.byFile[fileName].workingLinks++;
        break;
      case 'warning':
        this.results.warnings++;
        this.results.byFile[fileName].warnings++;
        break;
      case 'broken':
        this.results.brokenLinks++;
        this.results.byFile[fileName].brokenLinks++;
        
        // Track timeout links separately
        const isTimeout = result.error && result.error.includes('timeout');
        if (isTimeout) {
          this.results.timeoutLinks++;
        }
        
        this.results.issues.push({
          type: 'broken_link',
          ...result.context,
          url: result.url,
          error: result.error,
          statusCode: result.statusCode,
          suggestions: result.suggestions,
          severity: isTimeout ? 'medium' : 'high',
          isTimeout: isTimeout
        });
        break;
    }
  }

  /**
   * Update results from cached data
   */
  updateResultsFromCache(cachedResult, context) {
    const result = { ...cachedResult, context };
    this.updateCounters(result);
  }

  /**
   * Log individual result with enhanced timeout reporting
   */
  logResult(result) {
    const status = result.status;
    const emoji = status === 'healthy' ? '✅' : status === 'warning' ? '⚠️' : '❌';
    const code = result.statusCode ? `[${result.statusCode}]` : '';
    const time = result.responseTime ? `(${result.responseTime}ms)` : '';
    
    // Special handling for timeout display
    let timeoutIndicator = '';
    if (result.error && result.error.includes('timeout')) {
      timeoutIndicator = ' ⏱️ TIMEOUT';
    } else if (result.responseTime && result.responseTime >= 10000) {
      timeoutIndicator = ' ⏱️ SLOW';
    }
    
    console.log(`   ${emoji} ${result.url} ${code} ${time}${timeoutIndicator}`);
    
    if (result.suggestions.length > 0) {
      result.suggestions.forEach(suggestion => {
        console.log(`      💡 ${suggestion}`);
      });
    }
  }

  /**
   * Generate comprehensive reports
   */
  async generateReports(duration) {
    console.log('\n📊 Generating reports...');

    // Calculate health score
    const healthScore = this.results.totalLinks > 0 
      ? ((this.results.workingLinks / this.results.totalLinks) * 100).toFixed(1)
      : 0;

    this.results.summary = {
      healthScore: parseFloat(healthScore),
      duration: duration,
      timestamp: new Date().toISOString(),
      rateLimit: this.options.rateLimit,
      retries: this.options.retries
    };

    // Generate JSON report
    const jsonReport = {
      ...this.results,
      generatedAt: new Date().toISOString(),
      version: '1.0.0'
    };

    // Save JSON report
    const reportsDir = 'reports';
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const jsonFile = path.join(reportsDir, `linker-report-${timestamp}.json`);
    fs.writeFileSync(jsonFile, JSON.stringify(jsonReport, null, 2));

    // Generate markdown report
    const markdownReport = this.generateMarkdownReport();
    const mdFile = path.join(reportsDir, `linker-report-${timestamp}.md`);
    fs.writeFileSync(mdFile, markdownReport);

    // Print summary
    this.printSummary();

    console.log(`\n📄 Reports saved:`);
    console.log(`   📋 JSON: ${jsonFile}`);
    console.log(`   📝 Markdown: ${mdFile}`);
  }

  /**
   * Generate markdown report
   */
  generateMarkdownReport() {
    const { summary, byFile, issues } = this.results;
    const date = new Date().toLocaleDateString();
    
    let md = `# 🔗 THE LINKER - Link Health Report\n\n`;
    md += `**Generated:** ${date}\n`;
    md += `**Duration:** ${(summary.duration / 1000).toFixed(1)}s\n`;
    md += `**Health Score:** ${summary.healthScore}%\n\n`;

    // Overall summary
    md += `## 📊 Overall Summary\n\n`;
    md += `- **Total Links:** ${this.results.totalLinks}\n`;
    md += `- **Working Links:** ${this.results.workingLinks} ✅\n`;
    md += `- **Broken Links:** ${this.results.brokenLinks} ❌\n`;
    md += `- **Warnings:** ${this.results.warnings} ⚠️\n`;
    
    // Add timeout information if any
    if (this.results.timeoutLinks > 0) {
      md += `- **Timeout Links:** ${this.results.timeoutLinks} ⏱️ (exceeded 10s limit)\n`;
    }
    md += `\n`;

    // By file breakdown
    md += `## 📁 By File Breakdown\n\n`;
    Object.entries(byFile).forEach(([file, stats]) => {
      const fileHealth = stats.linksFound > 0 
        ? ((stats.workingLinks / stats.linksFound) * 100).toFixed(1)
        : 0;
      md += `### ${file}\n`;
      md += `- Links Found: ${stats.linksFound}\n`;
      md += `- Working: ${stats.workingLinks} ✅\n`;
      md += `- Broken: ${stats.brokenLinks} ❌\n`;
      md += `- Warnings: ${stats.warnings} ⚠️\n`;
      md += `- Health: ${fileHealth}%\n\n`;
    });

    // Issues that need attention
    if (issues.length > 0) {
      md += `## 🚨 Issues Requiring Attention\n\n`;
      
      // Separate timeout issues from other issues
      const timeoutIssues = issues.filter(issue => issue.isTimeout);
      const otherIssues = issues.filter(issue => !issue.isTimeout);
      
      if (timeoutIssues.length > 0) {
        md += `### ⏱️ Timeout Issues (${timeoutIssues.length})\n`;
        md += `These links exceeded the 10-second timeout limit and were skipped:\n\n`;
        timeoutIssues.forEach((issue, index) => {
          md += `#### ${index + 1}. Timeout - ${issue.title || 'Unknown'}\n`;
          md += `- **File:** ${issue.file}\n`;
          if (issue.line) md += `- **Line:** ${issue.line}\n`;
          if (issue.id) md += `- **ID:** ${issue.id}\n`;
          if (issue.url) md += `- **URL:** ${issue.url}\n`;
          md += `- **Error:** ${issue.error}\n`;
          if (issue.suggestions && issue.suggestions.length > 0) {
            md += `- **Suggestions:**\n`;
            issue.suggestions.forEach(suggestion => {
              md += `  - ${suggestion}\n`;
            });
          }
          md += `\n`;
        });
      }
      
      if (otherIssues.length > 0) {
        md += `### 🔗 Other Broken Links (${otherIssues.length})\n\n`;
        otherIssues.forEach((issue, index) => {
          md += `#### ${index + 1}. ${issue.type === 'broken_link' ? 'Broken Link' : 'File Error'}\n`;
          md += `- **File:** ${issue.file}\n`;
          if (issue.line) md += `- **Line:** ${issue.line}\n`;
          if (issue.id) md += `- **ID:** ${issue.id}\n`;
          if (issue.title) md += `- **Title:** ${issue.title}\n`;
          if (issue.url) md += `- **URL:** ${issue.url}\n`;
          if (issue.error) md += `- **Error:** ${issue.error}\n`;
          if (issue.statusCode) md += `- **Status Code:** ${issue.statusCode}\n`;
          if (issue.suggestions && issue.suggestions.length > 0) {
            md += `- **Suggestions:**\n`;
            issue.suggestions.forEach(suggestion => {
              md += `  - ${suggestion}\n`;
            });
          }
          md += `\n`;
        });
      }
    }

    return md;
  }

  /**
   * Print console summary with timeout information
   */
  printSummary() {
    const { summary } = this.results;
    
    console.log('\n🎯 THE LINKER SUMMARY');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`📊 Health Score: ${summary.healthScore}% ${this.getHealthEmoji(summary.healthScore)}`);
    console.log(`🔗 Total Links: ${this.results.totalLinks}`);
    console.log(`✅ Working: ${this.results.workingLinks}`);
    console.log(`❌ Broken: ${this.results.brokenLinks}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    
    // Show timeout information if any
    if (this.results.timeoutLinks > 0) {
      console.log(`⏱️  Timeouts: ${this.results.timeoutLinks} (links that exceeded 10s limit)`);
    }
    
    console.log(`⏱️  Duration: ${(summary.duration / 1000).toFixed(1)}s`);
    
    if (this.results.brokenLinks > 0) {
      console.log(`\n🚨 ${this.results.brokenLinks} broken links need immediate attention!`);
      if (this.results.timeoutLinks > 0) {
        console.log(`⏱️  ${this.results.timeoutLinks} of these failed due to 10+ second timeouts`);
      }
    } else {
      console.log('\n🎉 All links are healthy!');
    }
    
    // Show cleanup summary if cleanup mode was enabled
    if (this.options.cleanup) {
      this.printCleanupSummary();
    }
  }

  /**
   * Get emoji based on health score
   */
  getHealthEmoji(score) {
    if (score >= 98) return '🎉';
    if (score >= 95) return '😊';
    if (score >= 90) return '👍';
    if (score >= 80) return '⚠️';
    return '🚨';
  }

  /**
   * Utility: Sleep for specified milliseconds
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ====================================================
  // CLEANUP FUNCTIONALITY
  // ====================================================

  /**
   * Run cleanup process to fix common issues
   */
  async runCleanup() {
    console.log('🛠️  THE LINKER - CLEANUP MODE ACTIVATED');
    console.log('════════════════════════════════════════════════════════════════');
    
    if (this.options.dryRun) {
      console.log('🧪 DRY RUN: Showing what would be fixed without making changes');
    }

    // First, check all links to identify issues
    await this.checkAllLinks();

    // Then run cleanup based on findings
    await this.performCleanup();

    // Generate cleanup report
    this.generateCleanupReport();
    
    return this.results;
  }

  /**
   * Perform actual cleanup actions
   */
  async performCleanup() {
    console.log('\n🔧 Starting cleanup process...');
    
    const dataFiles = this.getDataFiles();
    
    for (const filePath of dataFiles) {
      await this.cleanupFile(filePath);
    }
    
    console.log(`\n✅ Cleanup complete! ${this.cleanupStats.totalFixes} fixes applied.`);
  }

  /**
   * Clean up a single file
   */
  async cleanupFile(filePath) {
    const fileName = path.basename(filePath);
    console.log(`🔧 Cleaning up ${fileName}...`);
    
    try {
      const csvData = fs.readFileSync(filePath, 'utf8');
      const { data, errors } = Papa.parse(csvData, {
        header: true,
        delimiter: '|',
        skipEmptyLines: true
      });

      if (errors.length > 0) {
        console.log(`   ⚠️  CSV parsing errors: ${errors.length} (skipping cleanup)`);
        return;
      }

      let modified = false;
      const fixedData = [...data];

      // Apply fixes to each row
      for (let i = 0; i < fixedData.length; i++) {
        const originalRow = { ...fixedData[i] };
        const fixedRow = this.cleanupRow(fixedData[i], fileName, i + 2);
        
        if (JSON.stringify(originalRow) !== JSON.stringify(fixedRow)) {
          fixedData[i] = fixedRow;
          modified = true;
        }
      }

      // Save the cleaned file if changes were made
      if (modified && !this.options.dryRun) {
        // Backup original file
        if (this.options.backupOriginals) {
          const backupPath = `${filePath}.backup-${this.getDateString()}`;
          fs.copyFileSync(filePath, backupPath);
          console.log(`   📋 Backup created: ${path.basename(backupPath)}`);
        }

        // Write the cleaned data
        const csvOutput = Papa.unparse(fixedData, { delimiter: '|' });
        fs.writeFileSync(filePath, csvOutput);
        
        this.fixedFiles.set(fileName, {
          originalPath: filePath,
          backupPath: this.options.backupOriginals ? `${filePath}.backup-${this.getDateString()}` : null,
          fixesApplied: this.cleanupActions.filter(action => action.file === fileName).length
        });
        
        console.log(`   ✅ Fixed and saved ${fileName}`);
      } else if (modified && this.options.dryRun) {
        console.log(`   🧪 Would fix ${fileName} (dry run)`);
      } else {
        console.log(`   ✨ No fixes needed for ${fileName}`);
      }

    } catch (error) {
      console.error(`   ❌ Error cleaning ${fileName}: ${error.message}`);
    }
  }

  /**
   * Clean up a single row
   */
  cleanupRow(row, fileName, lineNumber) {
    const urlFields = ['website', 'googleMapLink', 'googleMapsLink', 'booking_url', 'socialMedia'];
    const cleanedRow = { ...row };
    
    urlFields.forEach(field => {
      const url = row[field];
      if (this.isValidURL(url)) {
        const cleanedUrl = this.cleanupURL(url, {
          file: fileName,
          line: lineNumber,
          field: field,
          id: row.id || `line-${lineNumber}`,
          title: row.title || row.name || 'Unknown'
        });
        
        if (cleanedUrl !== url) {
          cleanedRow[field] = cleanedUrl;
        }
      }
    });
    
    return cleanedRow;
  }

  /**
   * Clean up a single URL
   */
  cleanupURL(url, context) {
    let cleaned = url;
    
    // Fix 1: Replace fake Google Maps URLs
    if (this.isFakeGoogleMapsURL(url)) {
      cleaned = this.fixFakeGoogleMapsURL(url, context);
      if (cleaned !== url) {
        this.cleanupActions.push({
          type: 'fake_google_maps',
          file: context.file,
          line: context.line,
          original: url,
          fixed: cleaned,
          reason: 'Replaced fake goo.gl/maps URL with proper Google Maps search'
        });
        this.cleanupStats.fakeGoogleMaps++;
        this.cleanupStats.totalFixes++;
      }
    }
    
    // Fix 2: Update redirect URLs (if we have cached result)
    if (this.cache.has(url)) {
      const cachedResult = this.cache.get(url);
      if (cachedResult.status === 'warning' && cachedResult.finalURL && cachedResult.finalURL !== url) {
        cleaned = cachedResult.finalURL;
        this.cleanupActions.push({
          type: 'redirect_update',
          file: context.file,
          line: context.line,
          original: url,
          fixed: cleaned,
          reason: 'Updated URL to final destination (was redirecting)'
        });
        this.cleanupStats.redirectUpdates++;
        this.cleanupStats.totalFixes++;
      }
    }
    
    // Fix 3: Remove or flag broken links
    if (this.cache.has(url)) {
      const cachedResult = this.cache.get(url);
      if (cachedResult.status === 'broken' && this.shouldRemoveBrokenLink(cachedResult)) {
        cleaned = 'N/A'; // Remove broken link
        this.cleanupActions.push({
          type: 'broken_link_removed',
          file: context.file,
          line: context.line,
          original: url,
          fixed: cleaned,
          reason: `Removed broken link: ${cachedResult.error}`
        });
        this.cleanupStats.brokenLinksRemoved++;
        this.cleanupStats.totalFixes++;
      }
    }
    
    return cleaned;
  }

  /**
   * Check if URL is a fake Google Maps URL
   */
  isFakeGoogleMapsURL(url) {
    return url.includes('goo.gl/maps/') && !url.includes('goo.gl/maps/search');
  }

  /**
   * Fix fake Google Maps URLs
   */
  fixFakeGoogleMapsURL(url, context) {
    // Extract the location identifier from the fake URL
    const match = url.match(/goo\.gl\/maps\/([^?\s]+)/);
    if (match) {
      const locationId = match[1];
      // Convert to proper Google Maps search URL
      const searchTerm = this.convertLocationIdToSearchTerm(locationId, context);
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchTerm)}`;
    }
    return url;
  }

  /**
   * Convert location ID to search term
   */
  convertLocationIdToSearchTerm(locationId, context) {
    // Map common fake IDs to real search terms
    const locationMap = {
      'harbourfront': 'Toronto Harbourfront',
      'highpark': 'High Park Toronto',
      'islands': 'Toronto Islands',
      'woodbine': 'Woodbine Beach Toronto',
      'boxing': 'Boxing Toronto',
      '519ChurchSt': '519 Church Street Toronto',
      'the519': 'The 519 Community Centre Toronto',
      'gladday': 'Glad Day Bookshop Toronto',
      'church-wellesley': 'Church-Wellesley Village Toronto',
      'tiff': 'Toronto International Film Festival',
      'cbc': 'CBC Toronto',
      'buddies': 'Buddies in Bad Times Theatre Toronto',
      'ymca': 'YMCA Toronto',
      'tpl': 'Toronto Public Library',
      'woodys': 'Woodys Bar Toronto',
      'depanneur': 'Depanneur Toronto',
      'snakeslattes': 'Snakes and Lattes Toronto',
      'crews': 'Crews Toronto',
      'gallery1313': 'Gallery 1313 Toronto',
      'mosspark': 'Moss Park Toronto',
      'secondcity': 'Second City Toronto',
      'ryerson': 'Toronto Metropolitan University',
      'sherbourne': 'Sherbourne Health Centre Toronto',
      'eechc': 'East End Community Health Centre Toronto',
      'winebar': 'Wine Bar Toronto',
      'georgebrown': 'George Brown College Toronto',
      'regentpark': 'Regent Park Toronto',
      'buddies': 'Buddies in Bad Times Theatre Toronto',
      'mtcc': 'Metro Toronto Convention Centre',
      'phoenix': 'Phoenix Concert Theatre Toronto',
      'annexchess': 'Annex Chess Club Toronto',
      'playtime': 'Playtime Bowl Toronto',
      'rcm': 'Royal Conservatory of Music Toronto',
      'comedybar': 'Comedy Bar Toronto',
      'camh': 'CAMH Toronto',
      'danforth': 'Danforth Music Hall Toronto',
      'tbot': 'Toronto Board of Trade',
      'baddog': 'Bad Dog Theatre Toronto',
      'BMO': 'BMO Field Toronto',
      'SBA': 'Scotiabank Arena Toronto',
      'RC': 'Rogers Centre Toronto',
      'JL': 'Lamport Stadium Toronto',
      'SS': 'Varsity Stadium Toronto',
      'BP': 'Bixi Park Toronto',
      'EP': 'Exhibition Place Toronto',
      'TW': 'Trinity Bellwoods Park Toronto',
      'ScotiabankArena': 'Scotiabank Arena Toronto',
      'RogersCentre': 'Rogers Centre Toronto',
      'BMOField': 'BMO Field Toronto',
      'CocaColaColiseum': 'Coca-Cola Coliseum Toronto',
      'FirstOntarioCentreHamilton': 'FirstOntario Centre Hamilton',
      'YorkLionsStadium': 'York Lions Stadium Toronto',
      'SobeysStadium': 'Sobeys Stadium Toronto',
      'DistilleryDistrict': 'Distillery District Toronto',
      'StLawrenceMarket': 'St. Lawrence Market Toronto',
      'EvergreenBrickWorks': 'Evergreen Brick Works Toronto'
    };
    
    // Try to find a match in our map
    const mappedLocation = locationMap[locationId];
    if (mappedLocation) {
      return mappedLocation;
    }
    
    // If no specific mapping, try to make a reasonable guess
    const cleaned = locationId
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Split camelCase
      .replace(/([a-z])([0-9])/g, '$1 $2') // Split letterNumber
      .replace(/([0-9])([a-z])/g, '$1 $2') // Split numberLetter
      .toLowerCase();
    
    return `${cleaned} Toronto`;
  }

  /**
   * Determine if a broken link should be removed
   */
  shouldRemoveBrokenLink(result) {
    // Remove if it's clearly a fake/placeholder URL
    if (result.url.includes('goo.gl/maps/') || 
        result.url.includes('example.com') ||
        result.url.includes('placeholder') ||
        result.statusCode === 404) {
      return true;
    }
    
    // Don't remove if it's just a temporary issue (5xx errors, timeouts)
    if (result.statusCode >= 500 || result.isTimeout) {
      return false;
    }
    
    return false;
  }

  /**
   * Print cleanup summary
   */
  printCleanupSummary() {
    console.log('\n🛠️  CLEANUP SUMMARY');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`🔧 Total Fixes Applied: ${this.cleanupStats.totalFixes}`);
    console.log(`🗺️  Fake Google Maps URLs Fixed: ${this.cleanupStats.fakeGoogleMaps}`);
    console.log(`↩️  Redirect URLs Updated: ${this.cleanupStats.redirectUpdates}`);
    console.log(`🗑️  Broken Links Removed: ${this.cleanupStats.brokenLinksRemoved}`);
    console.log(`📁 Files Modified: ${this.fixedFiles.size}`);
    
    if (this.options.dryRun) {
      console.log('\n🧪 DRY RUN: No actual changes were made');
    } else if (this.fixedFiles.size > 0) {
      console.log('\n📋 Modified Files:');
      this.fixedFiles.forEach((info, fileName) => {
        console.log(`   • ${fileName} (${info.fixesApplied} fixes)`);
        if (info.backupPath) {
          console.log(`     📋 Backup: ${path.basename(info.backupPath)}`);
        }
      });
    }
  }

  /**
   * Generate cleanup report
   */
  generateCleanupReport() {
    if (!this.options.cleanup) return;
    
    const report = {
      timestamp: new Date().toISOString(),
      mode: this.options.dryRun ? 'dry-run' : 'actual',
      statistics: this.cleanupStats,
      actions: this.cleanupActions,
      modifiedFiles: Object.fromEntries(this.fixedFiles)
    };
    
    const reportsDir = 'reports';
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().split('T')[0];
    const cleanupFile = path.join(reportsDir, `cleanup-report-${timestamp}.json`);
    fs.writeFileSync(cleanupFile, JSON.stringify(report, null, 2));
    
    console.log(`📄 Cleanup report saved: ${cleanupFile}`);
  }

  /**
   * Get date string for filenames
   */
  getDateString() {
    return new Date().toISOString().split('T')[0];
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--')) {
      const key = arg.replace('--', '');
      const value = args[i + 1];
      
      if (key === 'timeout') options.timeout = parseInt(value);
      else if (key === 'retries') options.retries = parseInt(value);
      else if (key === 'rate-limit') options.rateLimit = parseInt(value);
      else if (key === 'concurrent') options.maxConcurrent = parseInt(value);
      else if (key === 'cleanup') options.cleanup = true;
      else if (key === 'dry-run') options.dryRun = true;
      else if (key === 'no-backup') options.backupOriginals = false;
      else if (key === 'verbose') options.verbose = true;
      
      // Skip next arg if it's a value for the current option
      if (value && !value.startsWith('--')) {
        i++;
      }
    }
  }

  const linker = new TheLinker(options);
  
  // Show help if requested
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🔗 THE LINKER - Comprehensive Link Checker & Cleanup Tool

USAGE:
  node scripts/the-linker.js [options]

OPTIONS:
  --timeout <ms>       Request timeout in milliseconds (default: 10000)
  --retries <n>        Number of retries for failed requests (default: 3)
  --rate-limit <ms>    Delay between requests in milliseconds (default: 100)
  --concurrent <n>     Number of concurrent requests (default: 5)
  --cleanup            Enable cleanup mode to fix common issues
  --dry-run            Show what would be fixed without making changes
  --no-backup          Don't create backup files when cleaning up
  --verbose            Enable verbose logging
  --help, -h           Show this help message

EXAMPLES:
  # Basic link checking
  npm run linker

  # Fast scan with reduced timeouts
  npm run linker:fast

  # Thorough scan with more retries
  npm run linker:thorough

  # Check links and fix issues (with backup)
  node scripts/the-linker.js --cleanup

  # Preview fixes without applying them
  node scripts/the-linker.js --cleanup --dry-run

  # Cleanup without creating backups
  node scripts/the-linker.js --cleanup --no-backup

EXIT CODES:
  0 - All links are healthy
  1 - Some links are broken (need attention)
`);
    process.exit(0);
  }
  
  // Run the appropriate mode
  const runMode = options.cleanup ? 'runCleanup' : 'checkAllLinks';
  
  linker[runMode]()
    .then(() => {
      const exitCode = linker.results.brokenLinks > 0 ? 1 : 0;
      process.exit(exitCode);
    })
    .catch(error => {
      console.error('❌ THE LINKER failed:', error.message);
      process.exit(1);
    });
}

module.exports = TheLinker; 