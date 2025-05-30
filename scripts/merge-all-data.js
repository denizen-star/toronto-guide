const path = require('path');
const fs = require('fs');

class DatarianJS {
  constructor() {
    this.Papa = require('papaparse');
    
    // Define mapping between file types and their target CSV files
    this.fileMapping = {
      'daytrips.txt': { 
        target: 'day_trips_standardized.csv', 
        type: 'trips',
        prefix: 'dt'
      },
      'sports.txt': { 
        target: 'sporting_events_standardized.csv', 
        type: 'events',
        prefix: 'se'
      },
      'amateursports.txt': { 
        target: 'amateur_sports_standardized.csv', 
        type: 'sports',
        prefix: 'as'
      },
      'culture.txt': { 
        target: 'special_events_standardized.csv', 
        type: 'events',
        prefix: 'sp'
      }
    };
  }

  async readFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  parseTextFile(content) {
    // Check if the text file is actually a pipe-delimited CSV
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length > 0 && lines[0].includes('|')) {
      // This is a pipe-delimited CSV file
      console.log('📋 Detected pipe-delimited CSV format');
      const result = this.Papa.parse(content, { 
        header: true, 
        delimiter: '|',
        skipEmptyLines: true
      });
      return result.data;
    }

    // Otherwise, parse as unstructured text
    const records = [];
    let currentRecord = {};
    
    lines.forEach((line, index) => {
      line = line.trim();
      if (!line) {
        // Empty line might indicate end of record
        if (Object.keys(currentRecord).length > 0) {
          records.push({ ...currentRecord });
          currentRecord = {};
        }
        return;
      }

      // Look for patterns like "Name: Value" or "Title: Value"
      const keyValueMatch = line.match(/^([^:]+):\s*(.+)$/);
      if (keyValueMatch) {
        const [, key, value] = keyValueMatch;
        currentRecord[key.trim().toLowerCase()] = value.trim();
      } else if (line.includes(' - ')) {
        // Handle "Title - Description" format
        const [title, ...rest] = line.split(' - ');
        currentRecord.title = title.trim();
        currentRecord.description = rest.join(' - ').trim();
      } else {
        // If it's a standalone line, treat as title if we don't have one
        if (!currentRecord.title) {
          currentRecord.title = line;
        } else if (!currentRecord.description) {
          currentRecord.description = line;
        }
      }

      // Check if next line indicates new record
      const nextLine = index + 1 < lines.length ? lines[index + 1] : null;
      if (!nextLine || nextLine.match(/^[A-Z]/) || nextLine.includes(':')) {
        if (Object.keys(currentRecord).length > 0) {
          records.push({ ...currentRecord });
          currentRecord = {};
        }
      }
    });

    // Add final record if exists
    if (Object.keys(currentRecord).length > 0) {
      records.push(currentRecord);
    }

    return records;
  }

  convertRecord(record, contentType, prefix) {
    // If record already has proper structure (from CSV), use it with minimal conversion
    if (record.title && record.description && Object.keys(record).length > 5) {
      return {
        ...record,
        id: record.id || this.generateId(record, prefix),
        lastUpdated: record.lastUpdated || new Date().toISOString()
      };
    }

    // Convert from simpler structure based on content type
    const converted = {
      id: this.generateId(record, prefix),
      title: record.title || record.name || 'Untitled',
      description: record.description || record.desc || 'No description available',
      image: record.image || `https://source.unsplash.com/random/?${contentType}`,
      location: record.location || record.venue || record.place || 'Location TBD',
      type: record.type || contentType,
      startDate: record.startDate || record.start || new Date().toISOString().split('T')[0],
      endDate: record.endDate || record.end || record.startDate || new Date().toISOString().split('T')[0],
      registrationDeadline: record.registrationDeadline || record.deadline || 'Check website',
      duration: record.duration || record.time || 'Varies',
      activityDetails: record.activityDetails || record.details || record.description || 'See description',
      cost: record.cost || record.price || record.fee || 'See website for pricing',
      website: record.website || record.url || record.link || '#',
      travelTime: record.travelTime || record.travel || 'In-town',
      googleMapLink: record.googleMapLink || record.map || 'Search location on Google Maps',
      lgbtqFriendly: this.parseBooleanField(record.lgbtqFriendly) || false,
      tags: this.parseTags(record.tags, contentType),
      lastUpdated: new Date().toISOString()
    };

    // Add content-specific fields
    if (contentType === 'sports') {
      converted.skillLevel = record.skillLevel || record.skill || record.level || 'All levels';
      if (record.equipment) converted.equipmentNeeded = record.equipment;
      if (record.minPlayers) converted.minPlayers = record.minPlayers;
      if (record.maxPlayers) converted.maxPlayers = record.maxPlayers;
    }

    if (contentType === 'trips') {
      converted.season = record.season || 'Year-round';
      converted.distance = record.distance || 'Local';
      if (record.difficulty) converted.difficulty = record.difficulty;
      if (record.bestTime) converted.bestTimeToVisit = record.bestTime;
    }

    if (contentType === 'events') {
      if (record.priceRange) converted.priceRange = record.priceRange;
      converted.skillLevel = record.skillLevel || 'All levels';
    }

    return converted;
  }

  parseBooleanField(value) {
    if (!value) return false;
    const strValue = value.toString().toLowerCase();
    return ['true', 'yes', '1', 'y'].includes(strValue);
  }

  parseTags(tags, contentType) {
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') {
      return tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    }
    return [contentType.charAt(0).toUpperCase() + contentType.slice(1)];
  }

  generateId(record, prefix) {
    const title = (record.title || record.name || 'unknown').toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 10);
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}_${title}`;
  }

  findDuplicateInTarget(sourceRecord, targetData) {
    return targetData.some(targetRecord => {
      const sourceTitle = (sourceRecord.title || '').toLowerCase().trim();
      const targetTitle = (targetRecord.title || '').toLowerCase().trim();
      
      // Title match (exact)
      if (sourceTitle && targetTitle && sourceTitle === targetTitle) {
        return true;
      }

      // Check for very similar titles (>85% similarity)
      if (sourceTitle && targetTitle && this.calculateSimilarity(sourceTitle, targetTitle) > 0.85) {
        return true;
      }

      return false;
    });
  }

  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  }

  async compareAndMerge(sourceFilePath, targetFilePath, contentConfig) {
    try {
      console.log(`🔍 Comparing files: ${path.basename(sourceFilePath)} → ${path.basename(targetFilePath)}`);

      // Read and parse source file
      const sourceContent = await this.readFile(sourceFilePath);
      const parsedSourceData = this.parseTextFile(sourceContent);
      const sourceData = parsedSourceData
        .filter(record => record.title && record.title.trim() !== '' && record.title !== 'title')
        .map(record => this.convertRecord(record, contentConfig.type, contentConfig.prefix));

      console.log(`📄 Parsed ${sourceData.length} valid records from ${path.basename(sourceFilePath)}`);

      // Read target CSV file
      let targetData = [];
      if (fs.existsSync(targetFilePath)) {
        const targetContent = await this.readFile(targetFilePath);
        const targetResult = this.Papa.parse(targetContent, { header: true, delimiter: '|' });
        targetData = targetResult.data.filter(record => record.title && record.title.trim() !== '');
      } else {
        console.log(`📄 Target file ${path.basename(targetFilePath)} doesn't exist, will create new file`);
      }

      console.log(`📊 Source: ${sourceData.length} records, Target: ${targetData.length} records`);

      // Find new entries
      const newEntries = [];
      const duplicateEntries = [];

      sourceData.forEach(sourceRecord => {
        const isDuplicate = this.findDuplicateInTarget(sourceRecord, targetData);
        
        if (isDuplicate) {
          duplicateEntries.push(sourceRecord);
          console.log(`🔄 Skipping duplicate: "${sourceRecord.title}"`);
        } else {
          newEntries.push(sourceRecord);
        }
      });

      console.log(`✨ Found ${newEntries.length} new entries to add`);
      console.log(`🔄 Found ${duplicateEntries.length} duplicate entries (skipped)`);

      // Merge new entries with target data
      const mergedData = [...targetData, ...newEntries];

      // Save merged data back to target file
      if (newEntries.length > 0) {
        const csv = this.Papa.unparse(mergedData, {
          delimiter: '|',
          header: true
        });

        // Create backup if file exists
        if (fs.existsSync(targetFilePath)) {
          const backupPath = targetFilePath + '.backup.' + Date.now();
          fs.copyFileSync(targetFilePath, backupPath);
          console.log(`📦 Created backup: ${path.basename(backupPath)}`);
        }

        // Ensure directory exists
        const dir = path.dirname(targetFilePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(targetFilePath, csv, 'utf8');
        console.log(`✅ Successfully merged ${newEntries.length} new entries into ${path.basename(targetFilePath)}`);
      } else {
        console.log(`ℹ️  No new entries to merge`);
      }

      return {
        sourceRecords: sourceData.length,
        targetRecords: targetData.length,
        newEntries,
        duplicateEntries,
        mergedTotal: mergedData.length,
        summary: `Added ${newEntries.length} new entries. Total records: ${mergedData.length}`
      };

    } catch (error) {
      throw new Error(`Failed to compare and merge files: ${error.message}`);
    }
  }

  async processAllFiles() {
    try {
      const projectRoot = process.cwd();
      const newDataPath = path.join(projectRoot, 'src', 'new_data');
      const dataPath = path.join(projectRoot, 'public', 'data');
      
      const results = {};

      for (const [sourceFileName, config] of Object.entries(this.fileMapping)) {
        const sourceFilePath = path.join(newDataPath, sourceFileName);
        const targetFilePath = path.join(dataPath, config.target);

        // Check if source file exists
        if (!fs.existsSync(sourceFilePath)) {
          console.log(`⚠️  ${sourceFileName} not found, skipping...`);
          continue;
        }

        console.log(`\n🚀 Processing ${sourceFileName} → ${config.target}...`);
        
        try {
          const result = await this.compareAndMerge(sourceFilePath, targetFilePath, config);
          results[sourceFileName] = result;

          console.log(`\n📈 ${sourceFileName} Summary:`);
          console.log(`   Target records: ${result.targetRecords}`);
          console.log(`   New entries: ${result.newEntries.length}`);
          console.log(`   Duplicates skipped: ${result.duplicateEntries.length}`);
          console.log(`   Final total: ${result.mergedTotal}`);

          if (result.newEntries.length > 0) {
            console.log(`\n✨ Sample new entries:`);
            result.newEntries.slice(0, 3).forEach((entry, index) => {
              console.log(`   ${index + 1}. ${entry.title}`);
            });
            if (result.newEntries.length > 3) {
              console.log(`   ... and ${result.newEntries.length - 3} more`);
            }
          }

        } catch (error) {
          console.error(`❌ Error processing ${sourceFileName}: ${error.message}`);
          results[sourceFileName] = { error: error.message };
        }
      }

      return results;

    } catch (error) {
      throw new Error(`Failed to process files: ${error.message}`);
    }
  }
}

// Main execution
async function main() {
  try {
    console.log('🤖 Datarian JS - Comprehensive Data Merge Process\n');
    console.log('📋 Processing all data files from new_data folder...\n');
    
    const datarian = new DatarianJS();
    const results = await datarian.processAllFiles();
    
    console.log('\n🎉 Processing Complete! Final Summary:');
    console.log('=' .repeat(50));
    
    let totalNew = 0;
    let totalDuplicates = 0;
    let totalFinal = 0;
    
    Object.entries(results).forEach(([fileName, result]) => {
      if (result.error) {
        console.log(`❌ ${fileName}: ${result.error}`);
      } else {
        console.log(`✅ ${fileName}: +${result.newEntries.length} new entries (${result.mergedTotal} total)`);
        totalNew += result.newEntries.length;
        totalDuplicates += result.duplicateEntries.length;
        totalFinal += result.mergedTotal;
      }
    });
    
    console.log('=' .repeat(50));
    console.log(`📊 Overall Stats:`);
    console.log(`   Total new entries added: ${totalNew}`);
    console.log(`   Total duplicates skipped: ${totalDuplicates}`);
    console.log(`   Combined data records: ${totalFinal}`);
    console.log(`\n🎉 Your Toronto Guide data has been successfully enriched!`);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
} 