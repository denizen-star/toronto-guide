import Papa from 'papaparse';
import * as fs from 'fs';
import * as path from 'path';
import process from 'process';

// Import existing data interfaces
import {
  StandardizedItem,
  StandardizedSpecialEvent,
  StandardizedSportingEvent,
  StandardizedAmateurSport,
  StandardizedDayTrip,
  Activity,
  Location,
  Category,
  Price,
  Schedule,
  Tag
} from '../src/utils/dataLoader';

export interface DataAnalysis {
  fileType: string;
  detectedColumns: string[];
  rowCount: number;
  contentType: 'activities' | 'events' | 'sports' | 'trips' | 'locations' | 'unknown';
  confidenceScore: number;
  suggestedMapping: { [key: string]: string };
  issues: string[];
  duplicateCheck: string[];
}

export interface ConversionResult {
  success: boolean;
  convertedData: StandardizedItem[];
  errors: string[];
  warnings: string[];
  duplicatesFound: number;
  duplicateEntries: string[];
}

export interface DataQualityReport {
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  missingFields: { [field: string]: number };
  dataQualityScore: number;
  recommendations: string[];
}

export interface ComparisonResult {
  sourceRecords: number;
  targetRecords: number;
  newEntries: any[];
  duplicateEntries: any[];
  mergedTotal: number;
  summary: string;
}

/**
 * Datarian - Advanced Data Management Agent
 * 
 * Responsibilities:
 * - Analyze and understand content from various data sources
 * - Convert data to standardized format
 * - Prevent duplicates
 * - Ensure data quality and completeness
 * - Validate data against existing models
 * - Compare and merge data files
 */
class Datarian {
  private existingData: Map<string, StandardizedItem[]>;
  private dataTypes: string[];
  private fieldMappings: { [contentType: string]: { [key: string]: string } };

  constructor() {
    this.existingData = new Map();
    this.dataTypes = ['activities', 'events', 'sports', 'trips', 'locations'];
    this.initializeFieldMappings();
  }

  private initializeFieldMappings() {
    this.fieldMappings = {
      activities: {
        'name': 'title',
        'title': 'title',
        'desc': 'description',
        'description': 'description',
        'place': 'location',
        'location': 'location',
        'venue': 'location',
        'address': 'location',
        'category': 'type',
        'type': 'type',
        'url': 'website',
        'website': 'website',
        'link': 'website',
        'price': 'cost',
        'cost': 'cost',
        'fee': 'cost',
        'start': 'startDate',
        'startDate': 'startDate',
        'end': 'endDate',
        'endDate': 'endDate',
        'image': 'image',
        'photo': 'image',
        'picture': 'image',
        'time': 'duration',
        'duration': 'duration'
      },
      sports: {
        'sport': 'type',
        'activity': 'type',
        'skill': 'skillLevel',
        'level': 'skillLevel',
        'difficulty': 'skillLevel',
        'equipment': 'equipmentNeeded',
        'gear': 'equipmentNeeded',
        'minPlayers': 'minPlayers',
        'maxPlayers': 'maxPlayers',
        'players': 'maxPlayers'
      },
      trips: {
        'distance': 'distance',
        'season': 'season',
        'difficulty': 'difficulty',
        'bestTime': 'bestTimeToVisit'
      },
      events: {
        'event': 'title',
        'registration': 'registrationDeadline',
        'deadline': 'registrationDeadline',
        'priceRange': 'priceRange'
      }
    };
  }

  /**
   * Analyze file content to understand structure and type
   */
  async analyzeFile(filePath: string): Promise<DataAnalysis> {
    try {
      const content = await this.readFile(filePath);
      const extension = path.extname(filePath).toLowerCase();
      
      let parsedData: any[] = [];
      let detectedColumns: string[] = [];

      // Parse based on file type
      if (extension === '.csv') {
        const result = Papa.parse(content, { header: true });
        parsedData = result.data as any[];
        detectedColumns = result.meta.fields || [];
      } else if (extension === '.txt') {
        // Handle various text formats
        parsedData = this.parseTextFile(content);
        detectedColumns = this.extractColumnsFromText(parsedData);
      } else if (extension === '.json') {
        parsedData = JSON.parse(content);
        detectedColumns = parsedData.length > 0 ? Object.keys(parsedData[0]) : [];
      }

      // Analyze content type and confidence
      const contentAnalysis = this.analyzeContentType(detectedColumns, parsedData);
      
      // Check for potential duplicates
      const duplicateCheck = await this.checkForDuplicates(parsedData, contentAnalysis.contentType);

      return {
        fileType: extension,
        detectedColumns,
        rowCount: parsedData.length,
        contentType: contentAnalysis.contentType,
        confidenceScore: contentAnalysis.confidence,
        suggestedMapping: this.generateFieldMapping(detectedColumns, contentAnalysis.contentType),
        issues: this.identifyDataIssues(parsedData, detectedColumns),
        duplicateCheck
      };

    } catch (error) {
      throw new Error(`Failed to analyze file: ${error.message}`);
    }
  }

  /**
   * Convert data to standardized format
   */
  async convertToStandardized(
    filePath: string, 
    contentType: string,
    customMapping?: { [key: string]: string }
  ): Promise<ConversionResult> {
    try {
      const content = await this.readFile(filePath);
      const extension = path.extname(filePath).toLowerCase();
      
      let parsedData: any[] = [];
      
      // Parse data
      if (extension === '.csv') {
        const result = Papa.parse(content, { header: true });
        parsedData = result.data as any[];
      } else if (extension === '.txt') {
        parsedData = this.parseTextFile(content);
      } else if (extension === '.json') {
        parsedData = JSON.parse(content);
      }

      // Use custom mapping or generate one
      const fieldMapping = customMapping || this.generateFieldMapping(
        Object.keys(parsedData[0] || {}), 
        contentType as any
      );

      // Convert each record
      const convertedData: StandardizedItem[] = [];
      const errors: string[] = [];
      const warnings: string[] = [];
      let duplicatesFound = 0;
      const duplicateEntries: string[] = [];

      for (let i = 0; i < parsedData.length; i++) {
        try {
          const record = parsedData[i];
          const converted = this.convertRecord(record, fieldMapping, contentType);
          
          // Check for duplicates
          if (await this.isDuplicate(converted, contentType)) {
            duplicatesFound++;
            duplicateEntries.push(converted.title || `Record ${i + 1}`);
            warnings.push(`Duplicate found: ${converted.title || `Record ${i + 1}`}`);
            continue;
          }

          // Validate required fields
          const validation = this.validateRecord(converted, contentType);
          if (validation.isValid) {
            convertedData.push(converted);
          } else {
            errors.push(`Row ${i + 1}: ${validation.errors.join(', ')}`);
          }

        } catch (error) {
          errors.push(`Row ${i + 1}: ${error.message}`);
        }
      }

      return {
        success: errors.length === 0,
        convertedData,
        errors,
        warnings,
        duplicatesFound,
        duplicateEntries
      };

    } catch (error) {
      return {
        success: false,
        convertedData: [],
        errors: [error.message],
        warnings: [],
        duplicatesFound: 0,
        duplicateEntries: []
      };
    }
  }

  /**
   * Generate data quality report
   */
  generateQualityReport(data: StandardizedItem[]): DataQualityReport {
    const totalRecords = data.length;
    let validRecords = 0;
    const missingFields: { [field: string]: number } = {};
    
    const requiredFields = ['id', 'title', 'description', 'location', 'type'];
    const optionalFields = ['image', 'website', 'startDate', 'endDate', 'cost'];

    // Initialize missing field counters
    [...requiredFields, ...optionalFields].forEach(field => {
      missingFields[field] = 0;
    });

    data.forEach(record => {
      let isValid = true;
      
      // Check required fields
      requiredFields.forEach(field => {
        if (!record[field] || record[field].toString().trim() === '') {
          missingFields[field]++;
          isValid = false;
        }
      });

      // Check optional fields
      optionalFields.forEach(field => {
        if (!record[field] || record[field].toString().trim() === '') {
          missingFields[field]++;
        }
      });

      if (isValid) validRecords++;
    });

    const dataQualityScore = totalRecords > 0 ? (validRecords / totalRecords) * 100 : 0;

    const recommendations: string[] = [];
    
    // Generate recommendations based on missing data
    Object.entries(missingFields).forEach(([field, count]) => {
      if (count > 0) {
        const percentage = (count / totalRecords) * 100;
        if (percentage > 50) {
          recommendations.push(`${field}: ${percentage.toFixed(1)}% missing - High priority for data enrichment`);
        } else if (percentage > 20) {
          recommendations.push(`${field}: ${percentage.toFixed(1)}% missing - Consider data enhancement`);
        }
      }
    });

    if (dataQualityScore < 70) {
      recommendations.push('Overall data quality is below 70% - Recommend data cleanup before integration');
    }

    return {
      totalRecords,
      validRecords,
      invalidRecords: totalRecords - validRecords,
      missingFields,
      dataQualityScore,
      recommendations
    };
  }

  /**
   * Save converted data to appropriate CSV files
   */
  async saveStandardizedData(
    data: StandardizedItem[], 
    contentType: string, 
    outputPath: string
  ): Promise<void> {
    try {
      // Determine output filename based on content type
      const filename = `${contentType}_standardized.csv`;
      const fullPath = path.join(outputPath, filename);

      // Convert to CSV format
      const csv = Papa.unparse(data, {
        delimiter: '|', // Using pipe delimiter to match existing format
        header: true
      });

      // Ensure directory exists
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write file
      fs.writeFileSync(fullPath, csv, 'utf8');
      
      console.log(`✅ Saved ${data.length} records to ${fullPath}`);
    } catch (error) {
      throw new Error(`Failed to save data: ${error.message}`);
    }
  }

  // Private helper methods

  private async readFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  private parseTextFile(content: string): any[] {
    const lines = content.split('\n').filter(line => line.trim());
    
    // Try to detect structure (tab-separated, comma-separated, etc.)
    if (lines.length === 0) return [];

    // Check if it's structured data
    const firstLine = lines[0];
    let delimiter = '\t';
    
    if (firstLine.includes('|')) delimiter = '|';
    else if (firstLine.includes(',')) delimiter = ',';
    else if (firstLine.includes(';')) delimiter = ';';

    // If structured
    if (firstLine.includes(delimiter)) {
      const headers = firstLine.split(delimiter).map(h => h.trim());
      return lines.slice(1).map(line => {
        const values = line.split(delimiter).map(v => v.trim());
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        return obj;
      });
    }

    // If unstructured, try to extract key information
    return this.parseUnstructuredText(lines);
  }

  private parseUnstructuredText(lines: string[]): any[] {
    const records: any[] = [];
    let currentRecord: any = {};
    
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

      // If we detect end of record (empty line or new title pattern)
      if (Object.keys(currentRecord).length > 0) {
        // Look ahead to see if next non-empty line starts a new record
        const nextMeaningfulLine = lines.find(l => l.trim() && !l.startsWith(' '));
        if (nextMeaningfulLine && (nextMeaningfulLine.match(/^[A-Z]/) || nextMeaningfulLine.includes(':'))) {
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

  private extractColumnsFromText(data: any[]): string[] {
    const allKeys = new Set<string>();
    data.forEach(record => {
      Object.keys(record).forEach(key => allKeys.add(key));
    });
    return Array.from(allKeys);
  }

  private analyzeContentType(columns: string[], data: any[]): { contentType: 'activities' | 'events' | 'sports' | 'trips' | 'locations' | 'unknown', confidence: number } {
    const scores = {
      activities: 0,
      events: 0,
      sports: 0,
      trips: 0,
      locations: 0
    };

    // Analyze column names
    const columnString = columns.join(' ').toLowerCase();
    
    // Sports indicators
    if (columnString.includes('sport') || columnString.includes('skill') || 
        columnString.includes('equipment') || columnString.includes('player')) {
      scores.sports += 30;
    }

    // Trip indicators
    if (columnString.includes('distance') || columnString.includes('season') || 
        columnString.includes('trip') || columnString.includes('travel')) {
      scores.trips += 30;
    }

    // Event indicators
    if (columnString.includes('event') || columnString.includes('registration') || 
        columnString.includes('deadline')) {
      scores.events += 30;
    }

    // Location indicators
    if (columnString.includes('address') || columnString.includes('coordinate') || 
        columnString.includes('latitude') || columnString.includes('longitude')) {
      scores.locations += 30;
    }

    // General activity indicators
    if (columnString.includes('activity') || columnString.includes('title') || 
        columnString.includes('description')) {
      scores.activities += 20;
    }

    // Analyze actual data content
    if (data.length > 0) {
      const sampleContent = JSON.stringify(data.slice(0, 5)).toLowerCase();
      
      if (sampleContent.includes('basketball') || sampleContent.includes('soccer') || 
          sampleContent.includes('volleyball') || sampleContent.includes('fitness')) {
        scores.sports += 20;
      }

      if (sampleContent.includes('trip') || sampleContent.includes('getaway') || 
          sampleContent.includes('km') || sampleContent.includes('miles')) {
        scores.trips += 20;
      }

      if (sampleContent.includes('festival') || sampleContent.includes('concert') || 
          sampleContent.includes('show')) {
        scores.events += 20;
      }
    }

    // Find highest score
    const maxScore = Math.max(...Object.values(scores));
    const contentType = Object.entries(scores).find(([, score]) => score === maxScore)?.[0] as any || 'unknown';
    
    const confidence = maxScore > 0 ? Math.min(maxScore / 50 * 100, 100) : 0;

    return { contentType, confidence };
  }

  private generateFieldMapping(columns: string[], contentType: string): { [key: string]: string } {
    const mapping: { [key: string]: string } = {};
    const baseMapping = this.fieldMappings.activities;
    const typeMapping = this.fieldMappings[contentType] || {};
    
    columns.forEach(column => {
      const normalizedColumn = column.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // Check type-specific mapping first
      for (const [key, value] of Object.entries(typeMapping)) {
        if (normalizedColumn.includes(key.toLowerCase()) || 
            column.toLowerCase().includes(key.toLowerCase())) {
          mapping[column] = value;
          return;
        }
      }

      // Check base mapping
      for (const [key, value] of Object.entries(baseMapping)) {
        if (normalizedColumn.includes(key.toLowerCase()) || 
            column.toLowerCase().includes(key.toLowerCase())) {
          mapping[column] = value;
          return;
        }
      }

      // Default mapping for unmapped fields
      if (!mapping[column]) {
        mapping[column] = column.toLowerCase().replace(/[^a-z0-9]/g, '');
      }
    });

    return mapping;
  }

  private convertRecord(record: any, fieldMapping: { [key: string]: string }, contentType: string): StandardizedItem {
    const converted: any = {
      id: this.generateId(record, contentType),
      lastUpdated: new Date().toISOString()
    };

    // Apply field mapping
    Object.entries(fieldMapping).forEach(([sourceField, targetField]) => {
      if (record[sourceField] !== undefined && record[sourceField] !== null) {
        converted[targetField] = record[sourceField];
      }
    });

    // Ensure required fields have defaults
    if (!converted.title) converted.title = 'Untitled';
    if (!converted.description) converted.description = 'No description available';
    if (!converted.location) converted.location = 'Location TBD';
    if (!converted.type) converted.type = contentType;
    if (!converted.image) converted.image = `https://source.unsplash.com/random/?${contentType}`;
    if (!converted.startDate) converted.startDate = new Date().toISOString().split('T')[0];
    if (!converted.endDate) converted.endDate = converted.startDate;
    if (!converted.registrationDeadline) converted.registrationDeadline = 'Check website';
    if (!converted.duration) converted.duration = 'Varies';
    if (!converted.activityDetails) converted.activityDetails = converted.description;
    if (!converted.cost) converted.cost = 'See website for pricing';
    if (!converted.website) converted.website = '#';
    if (!converted.travelTime) converted.travelTime = 'In-town';
    if (!converted.googleMapLink) converted.googleMapLink = 'Search location on Google Maps';
    if (converted.lgbtqFriendly === undefined) converted.lgbtqFriendly = false;
    if (!converted.tags || !Array.isArray(converted.tags)) {
      converted.tags = [contentType.charAt(0).toUpperCase() + contentType.slice(1)];
    }

    // Type-specific field handling
    if (contentType === 'sports') {
      if (!converted.skillLevel) converted.skillLevel = 'All levels';
    }

    if (contentType === 'trips') {
      if (!converted.season) converted.season = 'Year-round';
      if (!converted.distance) converted.distance = 'Local';
    }

    return converted as StandardizedItem;
  }

  private generateId(record: any, contentType: string): string {
    const prefix = contentType.substring(0, 2);
    const title = (record.title || record.name || 'unknown').toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 10);
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}_${title}`;
  }

  private identifyDataIssues(data: any[], columns: string[]): string[] {
    const issues: string[] = [];

    if (data.length === 0) {
      issues.push('No data rows found');
      return issues;
    }

    // Check for empty critical fields
    const criticalFields = ['title', 'name', 'description', 'location'];
    const emptyCounts: { [key: string]: number } = {};

    data.forEach(record => {
      columns.forEach(column => {
        const normalizedColumn = column.toLowerCase();
        if (criticalFields.some(field => normalizedColumn.includes(field))) {
          if (!record[column] || record[column].toString().trim() === '') {
            emptyCounts[column] = (emptyCounts[column] || 0) + 1;
          }
        }
      });
    });

    Object.entries(emptyCounts).forEach(([field, count]) => {
      const percentage = (count / data.length) * 100;
      if (percentage > 20) {
        issues.push(`${field}: ${percentage.toFixed(1)}% missing values`);
      }
    });

    // Check for URL validation
    columns.forEach(column => {
      if (column.toLowerCase().includes('website') || column.toLowerCase().includes('url')) {
        const invalidUrls = data.filter(record => {
          const url = record[column];
          return url && !url.match(/^https?:\/\/.+/);
        }).length;
        
        if (invalidUrls > 0) {
          issues.push(`${column}: ${invalidUrls} invalid URLs found`);
        }
      }
    });

    return issues;
  }

  private async checkForDuplicates(data: any[], contentType: string): Promise<string[]> {
    const duplicates: string[] = [];
    const seen = new Set<string>();

    data.forEach((record, index) => {
      const title = record.title || record.name || `Record ${index + 1}`;
      const key = title.toLowerCase().trim();
      
      if (seen.has(key)) {
        duplicates.push(title);
      } else {
        seen.add(key);
      }
    });

    return duplicates;
  }

  private async isDuplicate(record: StandardizedItem, contentType: string): Promise<boolean> {
    // Load existing data if not already loaded
    if (!this.existingData.has(contentType)) {
      // This would load from existing CSV files
      // For now, return false - implement actual duplicate checking against existing data
      return false;
    }

    const existing = this.existingData.get(contentType) || [];
    return existing.some(item => 
      item.title.toLowerCase().trim() === record.title.toLowerCase().trim() &&
      item.location.toLowerCase().trim() === record.location.toLowerCase().trim()
    );
  }

  private validateRecord(record: StandardizedItem, contentType: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required field validation
    if (!record.id) errors.push('Missing ID');
    if (!record.title || record.title.trim() === '') errors.push('Missing title');
    if (!record.description || record.description.trim() === '') errors.push('Missing description');
    if (!record.location || record.location.trim() === '') errors.push('Missing location');
    if (!record.type || record.type.trim() === '') errors.push('Missing type');

    // URL validation
    if (record.website && record.website !== '#' && !record.website.match(/^https?:\/\/.+/)) {
      errors.push('Invalid website URL');
    }

    // Date validation
    if (record.startDate && !this.isValidDate(record.startDate)) {
      errors.push('Invalid start date');
    }

    if (record.endDate && !this.isValidDate(record.endDate)) {
      errors.push('Invalid end date');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  /**
   * Compare two CSV files and identify new entries to merge
   */
  async compareAndMerge(
    sourceFilePath: string,
    targetFilePath: string,
    contentType: string = 'activities'
  ): Promise<ComparisonResult> {
    try {
      console.log(`🔍 Comparing files: ${path.basename(sourceFilePath)} → ${path.basename(targetFilePath)}`);

      // First, convert source file to standardized format if it's not CSV
      let sourceData: any[] = [];
      const sourceExt = path.extname(sourceFilePath).toLowerCase();
      
      if (sourceExt === '.txt') {
        // Process .txt file through full conversion pipeline
        const conversion = await this.convertToStandardized(sourceFilePath, contentType);
        sourceData = conversion.convertedData;
        console.log(`📄 Converted ${sourceData.length} records from ${path.basename(sourceFilePath)}`);
      } else if (sourceExt === '.csv') {
        // Load CSV directly
        const content = await this.readFile(sourceFilePath);
        const result = Papa.parse(content, { header: true, delimiter: '|' });
        sourceData = result.data as any[];
      }

      // Load target CSV file
      const targetContent = await this.readFile(targetFilePath);
      const targetResult = Papa.parse(targetContent, { header: true, delimiter: '|' });
      const targetData = targetResult.data as any[];

      console.log(`📊 Source: ${sourceData.length} records, Target: ${targetData.length} records`);

      // Find new entries (not in target)
      const newEntries: any[] = [];
      const duplicateEntries: any[] = [];

      sourceData.forEach(sourceRecord => {
        const isDuplicate = this.findDuplicateInTarget(sourceRecord, targetData);
        
        if (isDuplicate) {
          duplicateEntries.push(sourceRecord);
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
        await this.saveDataToCsv(mergedData, targetFilePath);
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

  /**
   * Check if a record exists in the target data (duplicate detection)
   */
  private findDuplicateInTarget(sourceRecord: any, targetData: any[]): boolean {
    return targetData.some(targetRecord => {
      // Compare by title and location (case-insensitive)
      const sourceTitle = (sourceRecord.title || '').toLowerCase().trim();
      const targetTitle = (targetRecord.title || '').toLowerCase().trim();
      const sourceLocation = (sourceRecord.location || '').toLowerCase().trim();
      const targetLocation = (targetRecord.location || '').toLowerCase().trim();

      // Also check by ID if available
      if (sourceRecord.id && targetRecord.id && sourceRecord.id === targetRecord.id) {
        return true;
      }

      // Title and location match
      if (sourceTitle && targetTitle && sourceTitle === targetTitle) {
        if (sourceLocation && targetLocation && sourceLocation === targetLocation) {
          return true;
        }
        // If locations are both empty or very similar, consider it a match
        if (!sourceLocation && !targetLocation) {
          return true;
        }
      }

      return false;
    });
  }

  /**
   * Save data array to CSV file with proper formatting
   */
  private async saveDataToCsv(data: any[], filePath: string): Promise<void> {
    try {
      const csv = Papa.unparse(data, {
        delimiter: '|',
        header: true
      });

      fs.writeFileSync(filePath, csv, 'utf8');
    } catch (error) {
      throw new Error(`Failed to save CSV: ${error.message}`);
    }
  }

  /**
   * Process activities.txt and merge with activities.csv
   */
  async processActivitiesAndMerge(): Promise<ComparisonResult> {
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

      const result = await this.compareAndMerge(activitiesTxtPath, activitiesCsvPath, 'activities');

      console.log('\n📈 Merge Summary:');
      console.log(`   Original activities.csv: ${result.targetRecords} records`);
      console.log(`   New entries from activities.txt: ${result.newEntries.length} records`);
      console.log(`   Duplicates skipped: ${result.duplicateEntries.length} records`);
      console.log(`   Final total: ${result.mergedTotal} records`);

      if (result.newEntries.length > 0) {
        console.log('\n✨ New entries added:');
        result.newEntries.slice(0, 5).forEach((entry, index) => {
          console.log(`   ${index + 1}. ${entry.title || 'Untitled'} - ${entry.location || 'No location'}`);
        });
        if (result.newEntries.length > 5) {
          console.log(`   ... and ${result.newEntries.length - 5} more`);
        }
      }

      return result;

    } catch (error) {
      throw new Error(`Failed to process activities: ${error.message}`);
    }
  }

  /**
   * Main invoke method - Entry point for the agent
   */
  async invoke(command: string, options: any = {}): Promise<any> {
    console.log(`🤖 Datarian activated: ${command}`);

    switch (command.toLowerCase()) {
      case 'analyze':
        if (!options.filePath) throw new Error('filePath is required for analyze command');
        return await this.analyzeFile(options.filePath);

      case 'convert':
        if (!options.filePath || !options.contentType) {
          throw new Error('filePath and contentType are required for convert command');
        }
        return await this.convertToStandardized(options.filePath, options.contentType, options.customMapping);

      case 'quality-report':
        if (!options.data) throw new Error('data is required for quality-report command');
        return this.generateQualityReport(options.data);

      case 'save':
        if (!options.data || !options.contentType || !options.outputPath) {
          throw new Error('data, contentType, and outputPath are required for save command');
        }
        return await this.saveStandardizedData(options.data, options.contentType, options.outputPath);

      case 'compare-merge':
        if (!options.sourceFile || !options.targetFile) {
          throw new Error('sourceFile and targetFile are required for compare-merge command');
        }
        return await this.compareAndMerge(options.sourceFile, options.targetFile, options.contentType);

      case 'merge-activities':
        return await this.processActivitiesAndMerge();

      case 'full-process':
        // Complete workflow: analyze -> convert -> quality check -> save
        if (!options.filePath || !options.outputPath) {
          throw new Error('filePath and outputPath are required for full-process command');
        }
        
        const analysis = await this.analyzeFile(options.filePath);
        console.log(`📊 Analysis complete: ${analysis.contentType} (${analysis.confidenceScore.toFixed(1)}% confidence)`);
        
        const conversion = await this.convertToStandardized(
          options.filePath, 
          analysis.contentType, 
          options.customMapping
        );
        console.log(`🔄 Conversion complete: ${conversion.convertedData.length} records converted`);
        
        const qualityReport = this.generateQualityReport(conversion.convertedData);
        console.log(`📈 Quality Score: ${qualityReport.dataQualityScore.toFixed(1)}%`);
        
        if (conversion.convertedData.length > 0) {
          await this.saveStandardizedData(conversion.convertedData, analysis.contentType, options.outputPath);
        }
        
        return {
          analysis,
          conversion,
          qualityReport
        };

      default:
        throw new Error(`Unknown command: ${command}. Available commands: analyze, convert, quality-report, save, compare-merge, merge-activities, full-process`);
    }
  }
}

export default Datarian; 