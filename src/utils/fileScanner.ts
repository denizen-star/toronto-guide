import Papa from 'papaparse';
import path from 'path';
import { contentValidator } from './contentValidator';
import { StandardizedItem } from './dataLoader';

export interface FileScanResult {
  fileName: string;
  fileType: string;
  rowCount: number;
  columnCount: number;
  columns: string[];
  issues: FileScanIssue[];
  dataQualityScore: number;
  lastModified: Date;
  sizeInBytes: number;
  encoding: string;
  recommendations: string[];
}

export interface FileScanIssue {
  type: 'missing_column' | 'inconsistent_data' | 'duplicate_data' | 'invalid_format' | 'encoding_issue';
  severity: 'low' | 'medium' | 'high';
  message: string;
  location: string;
  recommendation: string;
}

export interface FileStats {
  totalFiles: number;
  totalRows: number;
  averageQualityScore: number;
  issuesByType: Record<string, number>;
  filesByType: Record<string, number>;
  lastScanDate: Date;
}

class FileScanner {
  private readonly REQUIRED_COLUMNS = {
    activities: ['id', 'title', 'description', 'categoryId', 'locationId', 'tags'],
    'happy-hours': ['id', 'location_id', 'day_of_week', 'start_time', 'end_time', 'offerings'],
    'day-trips': ['id', 'title', 'description', 'distance', 'duration', 'tags'],
    'amateur-sports': ['id', 'title', 'description', 'type', 'skillLevel', 'tags'],
    'sporting-events': ['id', 'title', 'description', 'date', 'type', 'tags'],
    'special-events': ['id', 'title', 'description', 'date', 'type', 'tags']
  };

  private readonly ENCODING_PATTERNS = {
    UTF8_BOM: Buffer.from([0xEF, 0xBB, 0xBF]),
    UTF16_LE: Buffer.from([0xFF, 0xFE]),
    UTF16_BE: Buffer.from([0xFE, 0xFF])
  };

  /**
   * Scan a single CSV file for quality and consistency
   */
  async scanFile(filePath: string): Promise<FileScanResult> {
    try {
      const fileContent = await this.readFileContent(filePath);
      const fileName = path.basename(filePath);
      const fileType = this.detectFileType(fileName);
      const encoding = this.detectEncoding(fileContent);
      
      // Parse CSV content
      const parseResult = Papa.parse(fileContent, { header: true });
      const data = parseResult.data as Record<string, any>[];
      
      const issues: FileScanIssue[] = [];
      const recommendations: string[] = [];
      
      // Check required columns
      const missingColumns = this.checkRequiredColumns(fileType, Object.keys(data[0] || {}));
      if (missingColumns.length > 0) {
        issues.push({
          type: 'missing_column',
          severity: 'high',
          message: `Missing required columns: ${missingColumns.join(', ')}`,
          location: 'header',
          recommendation: 'Add missing columns to maintain data consistency'
        });
      }

      // Check for duplicate entries
      const duplicates = this.findDuplicates(data);
      if (duplicates.length > 0) {
        issues.push({
          type: 'duplicate_data',
          severity: 'medium',
          message: `Found ${duplicates.length} duplicate entries`,
          location: `rows: ${duplicates.join(', ')}`,
          recommendation: 'Review and remove duplicate entries'
        });
      }

      // Check data consistency
      const inconsistencies = this.checkDataConsistency(data);
      issues.push(...inconsistencies);

      // Calculate quality score
      const qualityScore = this.calculateQualityScore(issues);

      // Generate recommendations
      if (qualityScore < 80) {
        recommendations.push('Consider running data cleanup to improve quality score');
      }
      if (issues.some(i => i.type === 'encoding_issue')) {
        recommendations.push('Convert file to UTF-8 encoding to prevent character issues');
      }

      return {
        fileName,
        fileType,
        rowCount: data.length,
        columnCount: Object.keys(data[0] || {}).length,
        columns: Object.keys(data[0] || {}),
        issues,
        dataQualityScore: qualityScore,
        lastModified: new Date(),
        sizeInBytes: Buffer.from(fileContent).length,
        encoding,
        recommendations
      };
    } catch (error: unknown) {
      throw new Error(`Failed to scan file ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Scan all CSV files in the data directory
   */
  async scanAllFiles(): Promise<FileStats> {
    const stats: FileStats = {
      totalFiles: 0,
      totalRows: 0,
      averageQualityScore: 0,
      issuesByType: {},
      filesByType: {},
      lastScanDate: new Date()
    };

    const files = [
      'activities.csv',
      'happy_hours.csv',
      'day_trips_standardized.csv',
      'amateur_sports_standardized.csv',
      'sporting_events_standardized.csv',
      'special_events_standardized.csv'
    ];

    let totalQualityScore = 0;

    for (const file of files) {
      const result = await this.scanFile(`public/data/${file}`);
      
      stats.totalFiles++;
      stats.totalRows += result.rowCount;
      totalQualityScore += result.dataQualityScore;
      
      // Track issues by type
      result.issues.forEach(issue => {
        stats.issuesByType[issue.type] = (stats.issuesByType[issue.type] || 0) + 1;
      });
      
      // Track files by type
      stats.filesByType[result.fileType] = (stats.filesByType[result.fileType] || 0) + 1;
    }

    stats.averageQualityScore = totalQualityScore / stats.totalFiles;
    return stats;
  }

  /**
   * Detect file type from filename
   */
  private detectFileType(fileName: string): string {
    const name = fileName.toLowerCase();
    if (name.includes('activities')) return 'activities';
    if (name.includes('happy_hours')) return 'happy-hours';
    if (name.includes('day_trips')) return 'day-trips';
    if (name.includes('amateur_sports')) return 'amateur-sports';
    if (name.includes('sporting_events')) return 'sporting-events';
    if (name.includes('special_events')) return 'special-events';
    return 'unknown';
  }

  /**
   * Check for required columns based on file type
   */
  private checkRequiredColumns(fileType: string, columns: string[]): string[] {
    const required = this.REQUIRED_COLUMNS[fileType as keyof typeof this.REQUIRED_COLUMNS] || [];
    return required.filter(col => !columns.includes(col));
  }

  /**
   * Find duplicate entries in data
   */
  private findDuplicates(data: Record<string, any>[]): number[] {
    const seen = new Set<string>();
    const duplicates: number[] = [];

    data.forEach((row, index) => {
      const key = `${row.id}-${row.title}`;
      if (seen.has(key)) {
        duplicates.push(index + 1);
      } else {
        seen.add(key);
      }
    });

    return duplicates;
  }

  /**
   * Check data consistency across rows
   */
  private checkDataConsistency(data: Record<string, any>[]): FileScanIssue[] {
    const issues: FileScanIssue[] = [];

    data.forEach((row, index) => {
      // Check for empty required fields
      Object.entries(row).forEach(([key, value]) => {
        if (!value && this.isRequiredField(key)) {
          issues.push({
            type: 'inconsistent_data',
            severity: 'medium',
            message: `Empty required field: ${key}`,
            location: `row ${index + 1}`,
            recommendation: `Provide value for ${key}`
          });
        }
      });

      // Check date formats
      if (row.date && !this.isValidDate(row.date)) {
        issues.push({
          type: 'invalid_format',
          severity: 'medium',
          message: 'Invalid date format',
          location: `row ${index + 1}, column: date`,
          recommendation: 'Use YYYY-MM-DD format for dates'
        });
      }
    });

    return issues;
  }

  /**
   * Calculate quality score based on issues
   */
  private calculateQualityScore(issues: FileScanIssue[]): number {
    let score = 100;

    issues.forEach(issue => {
      switch (issue.severity) {
        case 'high':
          score -= 20;
          break;
        case 'medium':
          score -= 10;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });

    return Math.max(0, score);
  }

  /**
   * Check if a field is required
   */
  private isRequiredField(field: string): boolean {
    return ['id', 'title', 'description'].includes(field);
  }

  /**
   * Validate date format
   */
  private isValidDate(dateStr: string): boolean {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * Read file content with encoding detection
   */
  private async readFileContent(filePath: string): Promise<string> {
    const fs = require('fs').promises;
    const buffer = await fs.readFile(filePath);
    return buffer.toString();
  }

  /**
   * Detect file encoding
   */
  private detectEncoding(content: string): string {
    const buffer = Buffer.from(content);
    
    if (buffer.indexOf(this.ENCODING_PATTERNS.UTF8_BOM) === 0) return 'UTF-8 with BOM';
    if (buffer.indexOf(this.ENCODING_PATTERNS.UTF16_LE) === 0) return 'UTF-16 LE';
    if (buffer.indexOf(this.ENCODING_PATTERNS.UTF16_BE) === 0) return 'UTF-16 BE';
    
    return 'UTF-8';
  }
}

// Export singleton instance
export const fileScanner = new FileScanner(); 