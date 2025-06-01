import Papa from 'papaparse';
import { QuarantinedItem } from './contentValidator';
import { quarantineManager } from './quarantineManager';

export interface CSVUpdateResult {
  filename: string;
  originalCount: number;
  updatedCount: number;
  removedCount: number;
  movedCount: number;
  csvContent: string;
}

export interface UpdateSummary {
  totalProcessed: number;
  totalRemoved: number;
  totalMoved: number;
  categoryMoves: Record<string, number>;
  updatedFiles: CSVUpdateResult[];
}

export class CSVUpdater {
  
  /**
   * Generate updated CSV files based on approved quarantine changes
   */
  async generateUpdatedCSVs(): Promise<UpdateSummary> {
    console.log('🔄 CSV Updater: Generating updated CSV files...');
    
    const approvedItems = quarantineManager.getApprovedItems();
    const rejectedItems = quarantineManager.getItemsByStatus('rejected');
    
    const summary: UpdateSummary = {
      totalProcessed: 0,
      totalRemoved: rejectedItems.length,
      totalMoved: 0,
      categoryMoves: {},
      updatedFiles: []
    };

    // Process each CSV file
    const csvFiles = [
      { path: '/data/activities.csv', category: 'activities', delimiter: '|' },
      { path: '/data/day_trips_standardized.csv', category: 'day-trips', delimiter: '|' },
      { path: '/data/amateur_sports_standardized.csv', category: 'amateur-sports', delimiter: '|' },
      { path: '/data/sporting_events_standardized.csv', category: 'sporting-events', delimiter: '|' },
      { path: '/data/special_events_standardized.csv', category: 'special-events', delimiter: '|' },
      { path: '/data/happy_hours.csv', category: 'happy-hours', delimiter: '|' }
    ];

    for (const file of csvFiles) {
      try {
        const result = await this.updateCSVFile(file.path, file.category, file.delimiter, approvedItems, rejectedItems);
        summary.updatedFiles.push(result);
        summary.totalProcessed += result.originalCount;
        summary.totalMoved += result.movedCount;
        
        // Track category moves
        approvedItems.forEach(item => {
          if (item.suggestedCategory && item.suggestedCategory !== item.itemType) {
            const moveKey = `${item.itemType} → ${item.suggestedCategory}`;
            summary.categoryMoves[moveKey] = (summary.categoryMoves[moveKey] || 0) + 1;
          }
        });
        
      } catch (error) {
        console.error(`Failed to update ${file.path}:`, error);
      }
    }

    return summary;
  }

  /**
   * Update a specific CSV file
   */
  private async updateCSVFile(
    filePath: string, 
    category: string, 
    delimiter: string,
    approvedItems: QuarantinedItem[], 
    rejectedItems: QuarantinedItem[]
  ): Promise<CSVUpdateResult> {
    
    const response = await fetch(filePath);
    const csvText = await response.text();
    const { data: originalData } = Papa.parse(csvText, { header: true, delimiter });

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
    const updatedData = originalData.filter((row: any) => {
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
        // Add happy hour specific fields if moving to happy hours
        newRow.venueType = newRow.venueType || 'Bars & Lounges';
        newRow.specialType = newRow.specialType || 'Food & Drink Combos';
      }
      updatedData.push(newRow);
      movedCount++;
    });

    // Generate updated CSV content
    const csvContent = Papa.unparse(updatedData, { delimiter });

    return {
      filename: filePath.split('/').pop() || filePath,
      originalCount,
      updatedCount: updatedData.length,
      removedCount,
      movedCount,
      csvContent
    };
  }

  /**
   * Generate a reconciliation report
   */
  generateReconciliationReport(): string {
    const approvedItems = quarantineManager.getApprovedItems();
    const rejectedItems = quarantineManager.getItemsByStatus('rejected');
    
    let report = '# CSV Update Reconciliation Report\n\n';
    report += `Generated: ${new Date().toISOString()}\n\n`;
    
    report += '## Summary\n';
    report += `- Items to remove: ${rejectedItems.length}\n`;
    report += `- Items to move: ${approvedItems.filter(item => item.suggestedCategory && item.suggestedCategory !== item.itemType).length}\n\n`;
    
    if (rejectedItems.length > 0) {
      report += '## Items to Remove\n';
      rejectedItems.forEach(item => {
        report += `- **${item.originalData.title}** (${item.itemType})\n`;
        report += `  - ID: ${item.id}\n`;
        report += `  - Reason: ${item.reviewNotes || item.quarantineReason}\n\n`;
      });
    }
    
    if (approvedItems.length > 0) {
      report += '## Items to Move/Reassign\n';
      approvedItems
        .filter(item => item.suggestedCategory && item.suggestedCategory !== item.itemType)
        .forEach(item => {
          report += `- **${item.originalData.title}**\n`;
          report += `  - From: ${item.itemType}\n`;
          report += `  - To: ${item.suggestedCategory}\n`;
          report += `  - Notes: ${item.reviewNotes || 'Category reassignment'}\n\n`;
        });
    }
    
    return report;
  }

  /**
   * Download updated CSV files as ZIP
   */
  async downloadUpdatedCSVs(): Promise<void> {
    try {
      const updateSummary = await this.generateUpdatedCSVs();
      
      // Create downloads for each updated file
      updateSummary.updatedFiles.forEach(file => {
        this.downloadFile(file.csvContent, `updated_${file.filename}`, 'text/csv');
      });
      
      // Download reconciliation report
      const report = this.generateReconciliationReport();
      this.downloadFile(report, 'reconciliation_report.md', 'text/markdown');
      
      // Download summary
      const summaryJson = JSON.stringify(updateSummary, null, 2);
      this.downloadFile(summaryJson, 'update_summary.json', 'application/json');
      
      console.log('✅ CSV Update: All files downloaded successfully');
      
    } catch (error) {
      console.error('❌ CSV Update: Failed to generate downloads:', error);
      throw error;
    }
  }

  /**
   * Helper method to download a file
   */
  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Get preview of changes without downloading
   */
  async getUpdatePreview(): Promise<{
    summary: UpdateSummary;
    sampleChanges: string[];
  }> {
    const summary = await this.generateUpdatedCSVs();
    const approvedItems = quarantineManager.getApprovedItems();
    const rejectedItems = quarantineManager.getItemsByStatus('rejected');
    
    const sampleChanges = [
      ...rejectedItems.slice(0, 3).map(item => 
        `🗑️ Remove: "${item.originalData.title}" from ${item.itemType}`
      ),
      ...approvedItems
        .filter(item => item.suggestedCategory && item.suggestedCategory !== item.itemType)
        .slice(0, 3)
        .map(item => 
          `📁 Move: "${item.originalData.title}" from ${item.itemType} to ${item.suggestedCategory}`
        )
    ];
    
    return { summary, sampleChanges };
  }
}

export const csvUpdater = new CSVUpdater(); 