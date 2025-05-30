const path = require('path');
const fs = require('fs');

// Import Datarian (we'll compile TypeScript on the fly or use a simplified version)
// For now, let's create a simple JavaScript implementation

class DatarianJS {
  constructor() {
    this.Papa = require('papaparse');
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

    // Otherwise, parse as unstructured text (original logic)
    const records = [];
    let currentRecord = {};
    
    lines.forEach(line => {
      line = line.trim();
      if (!line) return;

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

      // Check if this might be the end of a record
      const nextIndex = lines.indexOf(line) + 1;
      const nextLine = nextIndex < lines.length ? lines[nextIndex] : null;
      
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

  convertRecord(record) {
    // If record already has proper structure (from CSV), use it with minimal conversion
    if (record.title && record.description && Object.keys(record).length > 5) {
      // This looks like it's already in the right format, just ensure ID and lastUpdated
      return {
        ...record,
        id: record.id || this.generateId(record),
        lastUpdated: record.lastUpdated || new Date().toISOString()
      };
    }

    // Otherwise, convert from simpler structure
    const converted = {
      id: this.generateId(record),
      title: record.title || record.name || 'Untitled',
      description: record.description || record.desc || 'No description available',
      categoryId: 'cat1', // Default category
      locationId: 'loc1', // Default location
      priceId: 'price1', // Default price
      scheduleId: 'sched1', // Default schedule
      tags: record.tags ? record.tags.split(',').map(t => t.trim()) : ['Activity'],
      website: record.website || record.url || '#',
      lastUpdated: new Date().toISOString(),
      city: 'toronto'
    };

    return converted;
  }

  generateId(record) {
    const title = (record.title || record.name || 'unknown').toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 10);
    const timestamp = Date.now().toString().slice(-6);
    return `ac${timestamp}_${title}`;
  }

  findDuplicateInTarget(sourceRecord, targetData) {
    return targetData.some(targetRecord => {
      const sourceTitle = (sourceRecord.title || '').toLowerCase().trim();
      const targetTitle = (targetRecord.title || '').toLowerCase().trim();
      
      // Title match (exact)
      if (sourceTitle && targetTitle && sourceTitle === targetTitle) {
        return true;
      }

      // Check for very similar titles (>80% similarity)
      if (sourceTitle && targetTitle && this.calculateSimilarity(sourceTitle, targetTitle) > 0.8) {
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

  async compareAndMerge(sourceFilePath, targetFilePath) {
    try {
      console.log(`🔍 Comparing files: ${path.basename(sourceFilePath)} → ${path.basename(targetFilePath)}`);

      // Read and parse source file
      const sourceContent = await this.readFile(sourceFilePath);
      const parsedSourceData = this.parseTextFile(sourceContent);
      const sourceData = parsedSourceData
        .filter(record => record.title && record.title.trim() !== '' && record.title !== 'title') // Filter out header and empty records
        .map(record => this.convertRecord(record));

      console.log(`📄 Parsed ${sourceData.length} valid records from ${path.basename(sourceFilePath)}`);

      // Read target CSV file
      const targetContent = await this.readFile(targetFilePath);
      const targetResult = this.Papa.parse(targetContent, { header: true, delimiter: '|' });
      const targetData = targetResult.data.filter(record => record.title && record.title.trim() !== '');

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

        // Create backup first
        const backupPath = targetFilePath + '.backup.' + Date.now();
        fs.copyFileSync(targetFilePath, backupPath);
        console.log(`📦 Created backup: ${path.basename(backupPath)}`);

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

  async processActivitiesAndMerge() {
    try {
      const projectRoot = process.cwd();
      const activitiesTxtPath = path.join(projectRoot, 'src', 'new_data', 'activities.txt');
      const activitiesCsvPath = path.join(projectRoot, 'public', 'data', 'activities.csv');

      // Check if files exist
      if (!fs.existsSync(activitiesTxtPath)) {
        throw new Error('activities.txt not found in src/new_data folder');
      }

      if (!fs.existsSync(activitiesCsvPath)) {
        throw new Error('activities.csv not found in public/data folder');
      }

      console.log('🚀 Starting activities comparison and merge process...\n');

      const result = await this.compareAndMerge(activitiesTxtPath, activitiesCsvPath);

      console.log('\n📈 Merge Summary:');
      console.log(`   Original activities.csv: ${result.targetRecords} records`);
      console.log(`   New entries from activities.txt: ${result.newEntries.length} records`);
      console.log(`   Duplicates skipped: ${result.duplicateEntries.length} records`);
      console.log(`   Final total: ${result.mergedTotal} records`);

      if (result.newEntries.length > 0) {
        console.log('\n✨ New entries added:');
        result.newEntries.slice(0, 5).forEach((entry, index) => {
          console.log(`   ${index + 1}. ${entry.title || 'Untitled'}`);
        });
        if (result.newEntries.length > 5) {
          console.log(`   ... and ${result.newEntries.length - 5} more`);
        }
      }

      if (result.duplicateEntries.length > 0) {
        console.log('\n🔄 Duplicates found (not added):');
        result.duplicateEntries.slice(0, 3).forEach((entry, index) => {
          console.log(`   ${index + 1}. ${entry.title || 'Untitled'}`);
        });
        if (result.duplicateEntries.length > 3) {
          console.log(`   ... and ${result.duplicateEntries.length - 3} more`);
        }
      }

      return result;

    } catch (error) {
      throw new Error(`Failed to process activities: ${error.message}`);
    }
  }
}

// Main execution
async function main() {
  try {
    console.log('🤖 Datarian JS - Activities Merge Process\n');
    
    const datarian = new DatarianJS();
    const result = await datarian.processActivitiesAndMerge();
    
    console.log('\n🎉 Process completed successfully!');
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
} 