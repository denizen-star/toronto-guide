#!/usr/bin/env node

/**
 * Apply CSV Updates Script
 * This Node.js script directly updates CSV files based on curator decisions
 * Run with: node scripts/apply-csv-updates.js
 */

const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

class CSVUpdateScript {
  constructor() {
    this.dataDir = path.join(process.cwd(), 'public', 'data');
    this.backupDir = path.join(process.cwd(), 'public', 'data_backups');
    this.quarantineFile = path.join(process.cwd(), 'quarantine-export.json');
  }

  /**
   * Load quarantine data from exported file
   */
  loadQuarantineData() {
    if (!fs.existsSync(this.quarantineFile)) {
      log('red', '❌ Quarantine export file not found!');
      log('yellow', '📋 Steps to create it:');
      log('cyan', '   1. Go to http://localhost:3000/admin/content-review');
      log('cyan', '   2. Review and approve/reject items');
      log('cyan', '   3. Click "Export Data" button');
      log('cyan', '   4. Save as "quarantine-export.json" in project root');
      process.exit(1);
    }

    try {
      const data = JSON.parse(fs.readFileSync(this.quarantineFile, 'utf8'));
      return data.items || [];
    } catch (error) {
      log('red', `❌ Failed to parse quarantine file: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Create backup of original files
   */
  createBackup() {
    const timestamp = new Date().toISOString().slice(0, 10);
    const backupPath = path.join(this.backupDir, `backup_${timestamp}`);
    
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }

    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
    }

    const csvFiles = [
      'activities.csv',
      'day_trips_standardized.csv',
      'amateur_sports_standardized.csv',
      'sporting_events_standardized.csv',
      'special_events_standardized.csv',
      'happy_hours.csv'
    ];

    csvFiles.forEach(file => {
      const sourcePath = path.join(this.dataDir, file);
      const backupFilePath = path.join(backupPath, file);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, backupFilePath);
        log('green', `✅ Backed up: ${file}`);
      }
    });

    log('cyan', `📁 Backup created at: ${backupPath}`);
    return backupPath;
  }

  /**
   * Apply updates to CSV files
   */
  async applyUpdates() {
    log('cyan', '🤵 CSV Update Script Starting...\n');

    // Load quarantine data
    const quarantineItems = this.loadQuarantineData();
    const approvedItems = quarantineItems.filter(item => item.reviewStatus === 'approved');
    const rejectedItems = quarantineItems.filter(item => item.reviewStatus === 'rejected');

    log('blue', `📊 Quarantine Summary:`);
    log('green', `   ✅ Approved: ${approvedItems.length}`);
    log('red', `   ❌ Rejected: ${rejectedItems.length}`);
    log('yellow', `   ⏳ Pending: ${quarantineItems.filter(item => item.reviewStatus === 'pending').length}\n`);

    if (approvedItems.length === 0 && rejectedItems.length === 0) {
      log('yellow', '⚠️  No approved or rejected items to process.');
      return;
    }

    // Create backup
    const backupPath = this.createBackup();

    // Process each CSV file
    const csvFiles = [
      { filename: 'activities.csv', category: 'activities' },
      { filename: 'day_trips_standardized.csv', category: 'day-trips' },
      { filename: 'amateur_sports_standardized.csv', category: 'amateur-sports' },
      { filename: 'sporting_events_standardized.csv', category: 'sporting-events' },
      { filename: 'special_events_standardized.csv', category: 'special-events' },
      { filename: 'happy_hours.csv', category: 'happy-hours' }
    ];

    let totalProcessed = 0;
    let totalRemoved = 0;
    let totalMoved = 0;

    for (const file of csvFiles) {
      const result = await this.updateCSVFile(file.filename, file.category, approvedItems, rejectedItems);
      totalProcessed += result.originalCount;
      totalRemoved += result.removedCount;
      totalMoved += result.movedCount;

      log('cyan', `📄 ${file.filename}:`);
      log('blue', `   Original: ${result.originalCount} items`);
      log('green', `   Updated: ${result.updatedCount} items`);
      if (result.removedCount > 0) log('red', `   Removed: ${result.removedCount} items`);
      if (result.movedCount > 0) log('yellow', `   Moved: ${result.movedCount} items`);
      console.log('');
    }

    // Summary
    log('magenta', '🎉 Update Complete!');
    log('blue', `📊 Final Summary:`);
    log('cyan', `   Total items processed: ${totalProcessed}`);
    log('red', `   Total items removed: ${totalRemoved}`);
    log('yellow', `   Total items moved: ${totalMoved}`);
    log('green', `   Backup location: ${backupPath}`);

    // Generate report
    this.generateUpdateReport(approvedItems, rejectedItems, backupPath);
  }

  /**
   * Update a specific CSV file
   */
  async updateCSVFile(filename, category, approvedItems, rejectedItems) {
    const filePath = path.join(this.dataDir, filename);
    
    if (!fs.existsSync(filePath)) {
      log('yellow', `⚠️  File not found: ${filename}`);
      return { originalCount: 0, updatedCount: 0, removedCount: 0, movedCount: 0 };
    }

    // Read original file
    const csvContent = fs.readFileSync(filePath, 'utf8');
    const { data: originalData } = Papa.parse(csvContent, { header: true, delimiter: '|' });

    const originalCount = originalData.length;
    let removedCount = 0;
    let movedCount = 0;

    // Get items to remove (rejected items from this category)
    const itemsToRemove = rejectedItems
      .filter(item => item.itemType === category)
      .map(item => item.id);

    // Get items to move out (approved items moved to different category)
    const itemsToMoveOut = approvedItems
      .filter(item => item.itemType === category && item.suggestedCategory && item.suggestedCategory !== category)
      .map(item => item.id);

    // Get items to move in (approved items moved to this category from other categories)
    const itemsToMoveIn = approvedItems
      .filter(item => item.suggestedCategory === category && item.itemType !== category);

    // Filter out removed and moved items
    let updatedData = originalData.filter(row => {
      if (itemsToRemove.includes(row.id)) {
        removedCount++;
        return false;
      }
      if (itemsToMoveOut.includes(row.id)) {
        movedCount++;
        return false;
      }
      return true;
    });

    // Add moved-in items
    itemsToMoveIn.forEach(item => {
      const newRow = { ...item.originalData };
      // Update any category-specific fields if needed
      if (category === 'happy-hours') {
        newRow.venueType = newRow.venueType || 'Bars & Lounges';
        newRow.specialType = newRow.specialType || 'Food & Drink Combos';
      }
      updatedData.push(newRow);
      movedCount++;
    });

    // Generate updated CSV content and write back to file
    const updatedCsvContent = Papa.unparse(updatedData, { delimiter: '|' });
    fs.writeFileSync(filePath, updatedCsvContent, 'utf8');

    return {
      originalCount,
      updatedCount: updatedData.length,
      removedCount,
      movedCount
    };
  }

  /**
   * Generate update report
   */
  generateUpdateReport(approvedItems, rejectedItems, backupPath) {
    const reportPath = path.join(process.cwd(), 'csv-update-report.md');
    
    let report = '# CSV Update Report\n\n';
    report += `Generated: ${new Date().toISOString()}\n`;
    report += `Backup Location: ${backupPath}\n\n`;
    
    report += '## Summary\n';
    report += `- Items removed: ${rejectedItems.length}\n`;
    report += `- Items moved: ${approvedItems.filter(item => item.suggestedCategory && item.suggestedCategory !== item.itemType).length}\n\n`;
    
    if (rejectedItems.length > 0) {
      report += '## Removed Items\n';
      rejectedItems.forEach(item => {
        report += `- **${item.originalData.title}** (${item.itemType})\n`;
        report += `  - ID: ${item.id}\n`;
        report += `  - Reason: ${item.reviewNotes || item.quarantineReason}\n\n`;
      });
    }
    
    if (approvedItems.length > 0) {
      report += '## Moved Items\n';
      approvedItems
        .filter(item => item.suggestedCategory && item.suggestedCategory !== item.itemType)
        .forEach(item => {
          report += `- **${item.originalData.title}**\n`;
          report += `  - From: ${item.itemType}\n`;
          report += `  - To: ${item.suggestedCategory}\n`;
          report += `  - Notes: ${item.reviewNotes || 'Category reassignment'}\n\n`;
        });
    }
    
    fs.writeFileSync(reportPath, report, 'utf8');
    log('green', `📄 Report saved: ${reportPath}`);
  }
}

// Run the script
if (require.main === module) {
  const updater = new CSVUpdateScript();
  updater.applyUpdates().catch(error => {
    log('red', `❌ Script failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { CSVUpdateScript }; 