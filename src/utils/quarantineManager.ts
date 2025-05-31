import { QuarantinedItem } from './contentValidator';

export interface QuarantineState {
  items: QuarantinedItem[];
  lastUpdated: string;
  reviewProgress: {
    totalItems: number;
    reviewedItems: number;
    currentIndex: number;
  };
}

export class QuarantineManager {
  private storageKey = 'toronto-guide-quarantine';
  private stateStorageKey = 'toronto-guide-quarantine-state';

  /**
   * Save quarantined items to localStorage
   */
  saveQuarantinedItems(items: QuarantinedItem[]): void {
    try {
      const quarantineData = {
        items,
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem(this.storageKey, JSON.stringify(quarantineData));
    } catch (error) {
      console.error('Failed to save quarantined items:', error);
    }
  }

  /**
   * Load quarantined items from localStorage
   */
  loadQuarantinedItems(): QuarantinedItem[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];
      
      const data = JSON.parse(stored);
      return data.items || [];
    } catch (error) {
      console.error('Failed to load quarantined items:', error);
      return [];
    }
  }

  /**
   * Save review progress state
   */
  saveReviewState(state: QuarantineState): void {
    try {
      localStorage.setItem(this.stateStorageKey, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save review state:', error);
    }
  }

  /**
   * Load review progress state
   */
  loadReviewState(): QuarantineState | null {
    try {
      const stored = localStorage.getItem(this.stateStorageKey);
      if (!stored) return null;
      
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to load review state:', error);
      return null;
    }
  }

  /**
   * Update a specific quarantined item
   */
  updateQuarantinedItem(itemId: string, updates: Partial<QuarantinedItem>): void {
    const items = this.loadQuarantinedItems();
    const itemIndex = items.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
      items[itemIndex] = { ...items[itemIndex], ...updates };
      if (updates.reviewStatus) {
        items[itemIndex].reviewedAt = new Date();
      }
      this.saveQuarantinedItems(items);
    }
  }

  /**
   * Get items by review status
   */
  getItemsByStatus(status: 'pending' | 'approved' | 'rejected'): QuarantinedItem[] {
    const items = this.loadQuarantinedItems();
    return items.filter(item => item.reviewStatus === status);
  }

  /**
   * Get next pending item for review
   */
  getNextPendingItem(): QuarantinedItem | null {
    const pendingItems = this.getItemsByStatus('pending');
    return pendingItems.length > 0 ? pendingItems[0] : null;
  }

  /**
   * Approve an item and optionally move it to a different category
   */
  approveItem(itemId: string, targetCategory?: string, notes?: string): void {
    this.updateQuarantinedItem(itemId, {
      reviewStatus: 'approved',
      reviewNotes: notes,
      suggestedCategory: targetCategory
    });
  }

  /**
   * Reject an item
   */
  rejectItem(itemId: string, notes?: string): void {
    this.updateQuarantinedItem(itemId, {
      reviewStatus: 'rejected',
      reviewNotes: notes
    });
  }

  /**
   * Get review statistics
   */
  getReviewStats(): {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    completionPercentage: number;
  } {
    const items = this.loadQuarantinedItems();
    const total = items.length;
    const pending = items.filter(item => item.reviewStatus === 'pending').length;
    const approved = items.filter(item => item.reviewStatus === 'approved').length;
    const rejected = items.filter(item => item.reviewStatus === 'rejected').length;
    
    const completionPercentage = total > 0 ? ((approved + rejected) / total) * 100 : 0;

    return {
      total,
      pending,
      approved,
      rejected,
      completionPercentage
    };
  }

  /**
   * Clear all quarantine data
   */
  clearQuarantine(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.stateStorageKey);
  }

  /**
   * Export quarantine data as JSON
   */
  exportQuarantineData(): string {
    const items = this.loadQuarantinedItems();
    const state = this.loadReviewState();
    
    return JSON.stringify({
      items,
      state,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  /**
   * Import quarantine data from JSON
   */
  importQuarantineData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.items && Array.isArray(data.items)) {
        this.saveQuarantinedItems(data.items);
      }
      
      if (data.state) {
        this.saveReviewState(data.state);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import quarantine data:', error);
      return false;
    }
  }

  /**
   * Get items that should be reintegrated into main data
   */
  getApprovedItems(): QuarantinedItem[] {
    return this.getItemsByStatus('approved');
  }

  /**
   * Remove approved items from quarantine after reintegration
   */
  removeApprovedItems(): void {
    const items = this.loadQuarantinedItems();
    const remainingItems = items.filter(item => item.reviewStatus !== 'approved');
    this.saveQuarantinedItems(remainingItems);
  }
}

export const quarantineManager = new QuarantineManager(); 