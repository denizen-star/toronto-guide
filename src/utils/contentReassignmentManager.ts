import { SearchableContent } from './globalSearch';

export interface ReassignmentOperation {
  id: string;
  contentType: string;
  title: string;
  originalPageCategory: string;
  newPageCategory: string;
  timestamp: string;
  originalData: any;
  updatedData: any;
}

export interface CSVUpdateInstruction {
  sourceFile: string;
  targetFile: string;
  operation: 'move' | 'update' | 'add' | 'remove';
  itemId: string;
  itemTitle: string;
  changes: Record<string, any>;
  instructions: string;
}

export interface ReassignmentSummary {
  totalOperations: number;
  operationsByCategory: Record<string, number>;
  csvInstructions: CSVUpdateInstruction[];
  sessionChanges: ReassignmentOperation[];
  generatedAt: string;
}

class ContentReassignmentManager {
  private operations: ReassignmentOperation[] = [];
  private readonly STORAGE_KEY = 'content_reassignment_operations';

  constructor() {
    this.loadOperations();
  }

  /**
   * Record a content reassignment operation
   */
  public recordReassignment(
    originalContent: SearchableContent,
    newPageCategory: string,
    updatedContent: SearchableContent
  ): ReassignmentOperation {
    const operation: ReassignmentOperation = {
      id: `${originalContent.id}_${originalContent.contentType}_${Date.now()}`,
      contentType: originalContent.contentType,
      title: originalContent.title || (originalContent as any).name || 'Untitled',
      originalPageCategory: originalContent.pageCategory,
      newPageCategory,
      timestamp: new Date().toISOString(),
      originalData: this.sanitizeDataForStorage(originalContent),
      updatedData: this.sanitizeDataForStorage(updatedContent)
    };

    this.operations.push(operation);
    this.saveOperations();

    console.log(`Content reassignment recorded: ${operation.title} moved from ${operation.originalPageCategory} to ${operation.newPageCategory}`);

    return operation;
  }

  /**
   * Get all recorded operations
   */
  public getOperations(): ReassignmentOperation[] {
    return [...this.operations];
  }

  /**
   * Get operations by content type
   */
  public getOperationsByType(contentType: string): ReassignmentOperation[] {
    return this.operations.filter(op => op.contentType === contentType);
  }

  /**
   * Clear all operations
   */
  public clearOperations(): void {
    this.operations = [];
    this.saveOperations();
    console.log('All content reassignment operations cleared');
  }

  /**
   * Generate CSV update instructions for all operations
   */
  public generateCSVInstructions(): CSVUpdateInstruction[] {
    const instructions: CSVUpdateInstruction[] = [];

    for (const operation of this.operations) {
      const csvInstruction = this.generateInstructionForOperation(operation);
      if (csvInstruction) {
        instructions.push(csvInstruction);
      }
    }

    return instructions;
  }

  /**
   * Generate a comprehensive reassignment summary
   */
  public generateReassignmentSummary(): ReassignmentSummary {
    const operationsByCategory: Record<string, number> = {};
    
    for (const operation of this.operations) {
      const key = `${operation.originalPageCategory} → ${operation.newPageCategory}`;
      operationsByCategory[key] = (operationsByCategory[key] || 0) + 1;
    }

    return {
      totalOperations: this.operations.length,
      operationsByCategory,
      csvInstructions: this.generateCSVInstructions(),
      sessionChanges: this.getOperations(),
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Export operations as JSON for manual processing
   */
  public exportOperations(): string {
    const summary = this.generateReassignmentSummary();
    return JSON.stringify(summary, null, 2);
  }

  /**
   * Download CSV update instructions as a file
   */
  public downloadUpdateInstructions(): void {
    const summary = this.generateReassignmentSummary();
    const instructions = this.formatInstructionsForDownload(summary);
    
    const blob = new Blob([instructions], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `csv-update-instructions-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('CSV update instructions downloaded');
  }

  /**
   * Check if there are pending operations
   */
  public hasPendingOperations(): boolean {
    return this.operations.length > 0;
  }

  /**
   * Get summary statistics
   */
  public getStats() {
    const stats = {
      totalOperations: this.operations.length,
      byContentType: {} as Record<string, number>,
      byCategoryMove: {} as Record<string, number>,
      oldestOperation: this.operations.length > 0 ? this.operations[0].timestamp : null,
      newestOperation: this.operations.length > 0 ? this.operations[this.operations.length - 1].timestamp : null
    };

    for (const operation of this.operations) {
      stats.byContentType[operation.contentType] = (stats.byContentType[operation.contentType] || 0) + 1;
      const moveKey = `${operation.originalPageCategory} → ${operation.newPageCategory}`;
      stats.byCategoryMove[moveKey] = (stats.byCategoryMove[moveKey] || 0) + 1;
    }

    return stats;
  }

  /**
   * Generate CSV instruction for a specific operation
   */
  private generateInstructionForOperation(operation: ReassignmentOperation): CSVUpdateInstruction | null {
    const sourceFile = this.getCSVFileForCategory(operation.originalPageCategory);
    const targetFile = this.getCSVFileForCategory(operation.newPageCategory);

    if (!sourceFile || !targetFile) {
      console.warn(`Could not determine CSV files for operation: ${operation.id}`);
      return null;
    }

    const changes: Record<string, any> = {
      pageCategory: operation.newPageCategory
    };

    // Update type field if it exists
    if (operation.updatedData.type) {
      changes.type = operation.updatedData.type;
    }

    const isSameFile = sourceFile === targetFile;
    const operationType = isSameFile ? 'update' : 'move';

    let instructions: string;
    if (isSameFile) {
      instructions = `Update item "${operation.title}" (ID: ${operation.originalData.id}) in file "${sourceFile}":
- Change the category/type field to reflect new page assignment
- Update any category-specific fields as needed`;
    } else {
      instructions = `Move item "${operation.title}" (ID: ${operation.originalData.id}):
1. Remove from "${sourceFile}"
2. Add to "${targetFile}" with updated category fields
3. Ensure all field mappings are correct for the target file format`;
    }

    return {
      sourceFile,
      targetFile,
      operation: operationType,
      itemId: operation.originalData.id,
      itemTitle: operation.title,
      changes,
      instructions
    };
  }

  /**
   * Get CSV file name for a page category
   */
  private getCSVFileForCategory(pageCategory: string): string | null {
    const mapping: Record<string, string> = {
      'activities': 'activities.csv',
      'happy-hours': 'happy_hours.csv',
      'day-trips': 'day_trips_standardized.csv',
      'amateur-sports': 'amateur_sports_standardized.csv',
      'sporting-events': 'sporting_events_standardized.csv',
      'special-events': 'special_events_standardized.csv'
    };

    return mapping[pageCategory] || null;
  }

  /**
   * Format instructions for download
   */
  private formatInstructionsForDownload(summary: ReassignmentSummary): string {
    let content = `# CSV Update Instructions
# Generated: ${summary.generatedAt}
# Total Operations: ${summary.totalOperations}

## Summary of Changes
`;

    for (const [move, count] of Object.entries(summary.operationsByCategory)) {
      content += `- ${move}: ${count} item${count > 1 ? 's' : ''}\n`;
    }

    content += `\n## Detailed Instructions\n\n`;

    for (let i = 0; i < summary.csvInstructions.length; i++) {
      const instruction = summary.csvInstructions[i];
      content += `### ${i + 1}. ${instruction.itemTitle}\n`;
      content += `**Operation:** ${instruction.operation}\n`;
      content += `**Source File:** ${instruction.sourceFile}\n`;
      content += `**Target File:** ${instruction.targetFile}\n`;
      content += `**Item ID:** ${instruction.itemId}\n\n`;
      content += `**Instructions:**\n${instruction.instructions}\n\n`;
      
      if (Object.keys(instruction.changes).length > 0) {
        content += `**Required Field Changes:**\n`;
        for (const [field, value] of Object.entries(instruction.changes)) {
          content += `- ${field}: ${value}\n`;
        }
        content += '\n';
      }
      
      content += '---\n\n';
    }

    content += `## Important Notes

1. **Backup First:** Always backup your CSV files before making changes.

2. **Field Mapping:** When moving items between different CSV files, ensure all required fields are present and correctly mapped.

3. **Data Validation:** After making changes, run the content validation tool to ensure data integrity.

4. **Session State:** These changes are currently only applied in the browser session. Making the CSV changes will make them permanent.

5. **Testing:** Test the changes on a local development environment before deploying.

## Complete Operations Log

`;

    for (const operation of summary.sessionChanges) {
      content += `- ${operation.timestamp}: ${operation.title} (${operation.contentType}) moved from ${operation.originalPageCategory} to ${operation.newPageCategory}\n`;
    }

    return content;
  }

  /**
   * Remove non-serializable properties from data
   */
  private sanitizeDataForStorage(data: any): any {
    const sanitized = { ...data };
    
    // Remove function properties and other non-serializable items
    for (const key in sanitized) {
      if (typeof sanitized[key] === 'function') {
        delete sanitized[key];
      }
    }
    
    return sanitized;
  }

  /**
   * Save operations to localStorage
   */
  private saveOperations(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.operations));
    } catch (error) {
      console.error('Failed to save reassignment operations:', error);
    }
  }

  /**
   * Load operations from localStorage
   */
  private loadOperations(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.operations = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load reassignment operations:', error);
      this.operations = [];
    }
  }
}

// Singleton instance
export const contentReassignmentManager = new ContentReassignmentManager(); 