import Datarian from './datarian';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Datarian Helper - Easy-to-use interface for data management
 * 
 * This helper provides simplified methods to invoke the Datarian agent
 * for common data management tasks in the Toronto Guide project.
 */
class DatarianHelper {
  private datarian: Datarian;
  private projectRoot: string;

  constructor() {
    this.datarian = new Datarian();
    this.projectRoot = process.cwd();
  }

  /**
   * Copy all *.txt files from desktop to new_data folder and process them
   */
  async importDesktopTextFiles(): Promise<void> {
    try {
      const desktopPath = path.join(require('os').homedir(), 'Desktop');
      const newDataPath = path.join(this.projectRoot, 'src', 'new_data');
      
      // Ensure new_data directory exists
      if (!fs.existsSync(newDataPath)) {
        fs.mkdirSync(newDataPath, { recursive: true });
      }

      // Find all .txt files on desktop
      const desktopFiles = fs.readdirSync(desktopPath)
        .filter(file => file.endsWith('.txt'))
        .map(file => path.join(desktopPath, file));

      if (desktopFiles.length === 0) {
        console.log('❌ No .txt files found on desktop');
        return;
      }

      console.log(`📁 Found ${desktopFiles.length} .txt files on desktop:`);
      desktopFiles.forEach(file => console.log(`   - ${path.basename(file)}`));

      // Copy files to new_data folder
      for (const sourceFile of desktopFiles) {
        const fileName = path.basename(sourceFile);
        const destFile = path.join(newDataPath, fileName);
        
        fs.copyFileSync(sourceFile, destFile);
        console.log(`✅ Copied ${fileName} to new_data folder`);

        // Process the copied file
        await this.processDataFile(destFile);
      }

      console.log(`🎉 Successfully imported and processed ${desktopFiles.length} files!`);

    } catch (error) {
      console.error(`❌ Error importing files: ${error.message}`);
      throw error;
    }
  }

  /**
   * Process a single data file through the complete Datarian workflow
   */
  async processDataFile(filePath: string): Promise<void> {
    try {
      const fileName = path.basename(filePath);
      console.log(`\n🔍 Processing ${fileName}...`);

      // Full workflow processing
      const result = await this.datarian.invoke('full-process', {
        filePath: filePath,
        outputPath: path.join(this.projectRoot, 'public', 'data')
      });

      console.log(`\n📊 Results for ${fileName}:`);
      console.log(`   Content Type: ${result.analysis.contentType} (${result.analysis.confidenceScore.toFixed(1)}% confidence)`);
      console.log(`   Records Found: ${result.analysis.rowCount}`);
      console.log(`   Successfully Converted: ${result.conversion.convertedData.length}`);
      console.log(`   Quality Score: ${result.qualityReport.dataQualityScore.toFixed(1)}%`);

      if (result.conversion.errors.length > 0) {
        console.log(`   ⚠️  Errors: ${result.conversion.errors.length}`);
        result.conversion.errors.slice(0, 3).forEach(error => console.log(`      - ${error}`));
      }

      if (result.conversion.duplicatesFound > 0) {
        console.log(`   🔄 Duplicates Found: ${result.conversion.duplicatesFound}`);
      }

      if (result.qualityReport.recommendations.length > 0) {
        console.log(`   💡 Recommendations:`);
        result.qualityReport.recommendations.slice(0, 3).forEach(rec => console.log(`      - ${rec}`));
      }

    } catch (error) {
      console.error(`❌ Error processing ${filePath}: ${error.message}`);
    }
  }

  /**
   * Analyze a specific file without converting it
   */
  async analyzeFile(filePath: string): Promise<any> {
    try {
      console.log(`🔍 Analyzing ${path.basename(filePath)}...`);
      
      const analysis = await this.datarian.invoke('analyze', { filePath });
      
      console.log(`\n📊 Analysis Results:`);
      console.log(`   File Type: ${analysis.fileType}`);
      console.log(`   Content Type: ${analysis.contentType} (${analysis.confidenceScore.toFixed(1)}% confidence)`);
      console.log(`   Rows: ${analysis.rowCount}`);
      console.log(`   Columns: ${analysis.detectedColumns.length} (${analysis.detectedColumns.join(', ')})`);
      
      if (analysis.issues.length > 0) {
        console.log(`   ⚠️  Issues Found:`);
        analysis.issues.forEach(issue => console.log(`      - ${issue}`));
      }

      if (analysis.duplicateCheck.length > 0) {
        console.log(`   🔄 Potential Duplicates: ${analysis.duplicateCheck.length}`);
      }

      return analysis;

    } catch (error) {
      console.error(`❌ Error analyzing file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Process all files in the new_data folder
   */
  async processNewDataFolder(): Promise<void> {
    try {
      const newDataPath = path.join(this.projectRoot, 'src', 'new_data');
      
      if (!fs.existsSync(newDataPath)) {
        console.log('❌ new_data folder does not exist');
        return;
      }

      const files = fs.readdirSync(newDataPath)
        .filter(file => file.endsWith('.txt') || file.endsWith('.csv') || file.endsWith('.json'))
        .map(file => path.join(newDataPath, file));

      if (files.length === 0) {
        console.log('❌ No data files found in new_data folder');
        return;
      }

      console.log(`📁 Processing ${files.length} files from new_data folder...`);

      for (const file of files) {
        await this.processDataFile(file);
      }

      console.log(`\n🎉 Completed processing all files in new_data folder!`);

    } catch (error) {
      console.error(`❌ Error processing new_data folder: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate a comprehensive report of all data in the project
   */
  async generateDataReport(): Promise<void> {
    try {
      console.log('📈 Generating comprehensive data report...\n');

      const dataPath = path.join(this.projectRoot, 'public', 'data');
      const files = fs.readdirSync(dataPath)
        .filter(file => file.endsWith('_standardized.csv'))
        .map(file => path.join(dataPath, file));

      let totalRecords = 0;
      let totalValidRecords = 0;
      const contentTypes: { [key: string]: number } = {};

      for (const file of files) {
        const fileName = path.basename(file, '_standardized.csv');
        console.log(`📊 Analyzing ${fileName}...`);

        try {
          const Papa = require('papaparse');
          const content = fs.readFileSync(file, 'utf8');
          const { data } = Papa.parse(content, { header: true, delimiter: '|' });

          const report = this.datarian.generateQualityReport(data);
          
          totalRecords += report.totalRecords;
          totalValidRecords += report.validRecords;
          contentTypes[fileName] = report.totalRecords;

          console.log(`   Records: ${report.totalRecords}`);
          console.log(`   Quality: ${report.dataQualityScore.toFixed(1)}%`);
          
        } catch (error) {
          console.log(`   ⚠️  Error reading file: ${error.message}`);
        }
      }

      console.log(`\n📈 Overall Project Data Summary:`);
      console.log(`   Total Records: ${totalRecords}`);
      console.log(`   Overall Quality: ${totalRecords > 0 ? ((totalValidRecords / totalRecords) * 100).toFixed(1) : 0}%`);
      console.log(`   Content Types:`);
      Object.entries(contentTypes).forEach(([type, count]) => {
        console.log(`      - ${type}: ${count} records`);
      });

    } catch (error) {
      console.error(`❌ Error generating data report: ${error.message}`);
      throw error;
    }
  }

  /**
   * Clean up and organize data files
   */
  async organizeDataFiles(): Promise<void> {
    try {
      console.log('🧹 Organizing data files...\n');

      const newDataPath = path.join(this.projectRoot, 'src', 'new_data');
      const archivePath = path.join(newDataPath, 'processed');

      // Create archive folder if it doesn't exist
      if (!fs.existsSync(archivePath)) {
        fs.mkdirSync(archivePath, { recursive: true });
      }

      // Move processed files to archive
      if (fs.existsSync(newDataPath)) {
        const files = fs.readdirSync(newDataPath)
          .filter(file => file.endsWith('.txt') || file.endsWith('.csv') || file.endsWith('.json'))
          .filter(file => !fs.statSync(path.join(newDataPath, file)).isDirectory());

        for (const file of files) {
          const sourcePath = path.join(newDataPath, file);
          const destPath = path.join(archivePath, file);
          
          fs.renameSync(sourcePath, destPath);
          console.log(`📦 Archived ${file}`);
        }

        console.log(`✅ Moved ${files.length} processed files to archive`);
      }

    } catch (error) {
      console.error(`❌ Error organizing files: ${error.message}`);
      throw error;
    }
  }
}

/**
 * Command-line interface for easy usage
 */
async function main() {
  const helper = new DatarianHelper();
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'import':
        console.log('🚀 Starting import process...\n');
        await helper.importDesktopTextFiles();
        break;

      case 'process':
        if (args[1]) {
          await helper.processDataFile(args[1]);
        } else {
          await helper.processNewDataFolder();
        }
        break;

      case 'analyze':
        if (!args[1]) {
          console.log('❌ Please provide a file path to analyze');
          process.exit(1);
        }
        await helper.analyzeFile(args[1]);
        break;

      case 'report':
        await helper.generateDataReport();
        break;

      case 'organize':
        await helper.organizeDataFiles();
        break;

      case 'help':
      default:
        console.log(`
🤖 Datarian Helper - Data Management for Toronto Guide

Usage: node datarian-helper.js <command> [options]

Commands:
  import              Copy all *.txt files from desktop to new_data and process them
  process [filepath]  Process a specific file or all files in new_data folder
  analyze <filepath>  Analyze a file without converting it
  report              Generate comprehensive data report for the project
  organize            Move processed files to archive folder
  help                Show this help message

Examples:
  node datarian-helper.js import
  node datarian-helper.js process
  node datarian-helper.js analyze /path/to/file.txt
  node datarian-helper.js report
        `);
        break;
    }

  } catch (error) {
    console.error(`\n❌ Command failed: ${error.message}`);
    process.exit(1);
  }
}

// Run CLI if this file is executed directly
if (require.main === module) {
  main();
}

export default DatarianHelper; 