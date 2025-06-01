import { 
  Activity, 
  StandardizedDayTrip, 
  StandardizedAmateurSport, 
  StandardizedSportingEvent, 
  StandardizedSpecialEvent, 
  HappyHour
} from './dataLoader';

// Union type for all searchable content items
export type SearchableContent = 
  | (Activity & { contentType: 'activity'; pageCategory: 'activities' })
  | (StandardizedDayTrip & { contentType: 'day-trip'; pageCategory: 'day-trips' })
  | (StandardizedAmateurSport & { contentType: 'amateur-sport'; pageCategory: 'amateur-sports' })
  | (StandardizedSportingEvent & { contentType: 'sporting-event'; pageCategory: 'sporting-events' })
  | (StandardizedSpecialEvent & { contentType: 'special-event'; pageCategory: 'special-events' })
  | (HappyHour & { contentType: 'happy-hour'; pageCategory: 'happy-hours'; title: string });

export interface SearchResult {
  item: SearchableContent;
  relevanceScore: number;
  matchedFields: string[];
}

export interface SearchFilters {
  contentTypes?: string[];
  pageCategories?: string[];
  minRelevanceScore?: number;
}

export interface PageMapping {
  pageCategory: string;
  displayName: string;
  route: string;
}

export const PAGE_MAPPINGS: PageMapping[] = [
  { pageCategory: 'activities', displayName: 'Activities', route: '/activities' },
  { pageCategory: 'happy-hours', displayName: 'Happy Hours', route: '/happy-hours' },
  { pageCategory: 'day-trips', displayName: 'Trips', route: '/day-trips' },
  { pageCategory: 'amateur-sports', displayName: 'Play', route: '/amateur-sports' },
  { pageCategory: 'sporting-events', displayName: 'Sports', route: '/sporting-events' },
  { pageCategory: 'special-events', displayName: 'Culture', route: '/special-events' }
];

class GlobalSearchEngine {
  private allContent: SearchableContent[] = [];
  private searchTimeout: NodeJS.Timeout | null = null;
  private readonly DEBOUNCE_DELAY = 300; // 300ms debounce

  /**
   * Initialize the search engine with all content data
   */
  public initialize(
    activities: Activity[],
    dayTrips: StandardizedDayTrip[],
    amateurSports: StandardizedAmateurSport[],
    sportingEvents: StandardizedSportingEvent[],
    specialEvents: StandardizedSpecialEvent[],
    happyHours: HappyHour[]
  ): void {
    this.allContent = [
      ...activities.map(item => ({ ...item, contentType: 'activity' as const, pageCategory: 'activities' as const })),
      ...dayTrips.map(item => ({ ...item, contentType: 'day-trip' as const, pageCategory: 'day-trips' as const })),
      ...amateurSports.map(item => ({ ...item, contentType: 'amateur-sport' as const, pageCategory: 'amateur-sports' as const })),
      ...sportingEvents.map(item => ({ ...item, contentType: 'sporting-event' as const, pageCategory: 'sporting-events' as const })),
      ...specialEvents.map(item => ({ ...item, contentType: 'special-event' as const, pageCategory: 'special-events' as const })),
      ...happyHours.map(item => ({ ...item, contentType: 'happy-hour' as const, pageCategory: 'happy-hours' as const, title: `${item.day_of_week} Happy Hour` }))
    ];

    console.log(`Global search initialized with ${this.allContent.length} content items`);
  }

  /**
   * Add or update a content item in the search index
   */
  public updateContent(item: SearchableContent): void {
    const index = this.allContent.findIndex(existing => 
      existing.id === item.id && existing.contentType === item.contentType
    );
    
    if (index >= 0) {
      this.allContent[index] = item;
    } else {
      this.allContent.push(item);
    }
  }

  /**
   * Remove a content item from the search index
   */
  public removeContent(id: string, contentType: string): void {
    this.allContent = this.allContent.filter(item => 
      !(item.id === id && item.contentType === contentType)
    );
  }

  /**
   * Move a content item to a different page category
   */
  public moveContent(id: string, contentType: string, newPageCategory: string): SearchableContent | null {
    const itemIndex = this.allContent.findIndex(item => 
      item.id === id && item.contentType === contentType
    );
    
    if (itemIndex >= 0) {
      const item = { ...this.allContent[itemIndex] };
      item.pageCategory = newPageCategory as any;
      
      // Update type field if it exists to match the new category
      if ('type' in item) {
        item.type = newPageCategory.replace('-', ' ');
      }
      
      this.allContent[itemIndex] = item;
      return item;
    }
    
    return null;
  }

  /**
   * Get all content items
   */
  public getAllContent(): SearchableContent[] {
    return [...this.allContent];
  }

  /**
   * Get content items by page category
   */
  public getContentByCategory(pageCategory: string): SearchableContent[] {
    return this.allContent.filter(item => item.pageCategory === pageCategory);
  }

  /**
   * Perform a search with debouncing
   */
  public searchDebounced(
    query: string,
    filters: SearchFilters = {},
    callback: (results: SearchResult[]) => void
  ): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      const results = this.search(query, filters);
      callback(results);
    }, this.DEBOUNCE_DELAY);
  }

  /**
   * Perform an immediate search
   */
  public search(query: string, filters: SearchFilters = {}): SearchResult[] {
    if (!query.trim()) {
      return this.allContent
        .filter(item => this.applyFilters(item, filters))
        .map(item => ({
          item,
          relevanceScore: 1.0,
          matchedFields: []
        }))
        .slice(0, 50); // Limit to 50 results when no query
    }

    const results: SearchResult[] = [];
    const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 0);

    for (const item of this.allContent) {
      if (!this.applyFilters(item, filters)) continue;

      const searchResult = this.calculateRelevance(item, queryWords);
      
      if (searchResult.relevanceScore >= (filters.minRelevanceScore || 0.1)) {
        results.push(searchResult);
      }
    }

    // Sort by relevance score (descending)
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Limit results to prevent UI overwhelming
    return results.slice(0, 100);
  }

  /**
   * Apply filters to content items
   */
  private applyFilters(item: SearchableContent, filters: SearchFilters): boolean {
    if (filters.contentTypes && filters.contentTypes.length > 0) {
      if (!filters.contentTypes.includes(item.contentType)) {
        return false;
      }
    }

    if (filters.pageCategories && filters.pageCategories.length > 0) {
      if (!filters.pageCategories.includes(item.pageCategory)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Calculate relevance score for a content item against search query
   */
  private calculateRelevance(item: SearchableContent, queryWords: string[]): SearchResult {
    let totalScore = 0;
    const matchedFields: string[] = [];
    const fieldWeights = {
      title: 3.0,
      name: 3.0,
      description: 1.5,
      type: 2.0,
      location: 1.8,
      tags: 1.2,
      category: 2.0,
      neighborhood: 1.5
    };

    for (const [fieldName, weight] of Object.entries(fieldWeights)) {
      const fieldValue = this.getFieldValue(item, fieldName);
      if (!fieldValue) continue;

      const fieldScore = this.calculateFieldScore(fieldValue, queryWords);
      if (fieldScore > 0) {
        totalScore += fieldScore * weight;
        matchedFields.push(fieldName);
      }
    }

    // Normalize score (0-1 range)
    const maxPossibleScore = queryWords.length * Object.values(fieldWeights).reduce((a, b) => a + b, 0);
    const relevanceScore = Math.min(totalScore / maxPossibleScore, 1.0);

    return {
      item,
      relevanceScore,
      matchedFields
    };
  }

  /**
   * Get field value from content item
   */
  private getFieldValue(item: SearchableContent, fieldName: string): string {
    const value = (item as any)[fieldName];
    
    if (Array.isArray(value)) {
      return value.join(' ');
    }
    
    return typeof value === 'string' ? value : '';
  }

  /**
   * Calculate score for a specific field
   */
  private calculateFieldScore(fieldValue: string, queryWords: string[]): number {
    const normalizedField = fieldValue.toLowerCase();
    let score = 0;

    for (const word of queryWords) {
      if (normalizedField.includes(word)) {
        // Exact word match
        const wordRegex = new RegExp(`\\b${word}\\b`, 'i');
        if (wordRegex.test(fieldValue)) {
          score += 1.0;
        } else {
          // Partial match
          score += 0.5;
        }
      }
    }

    return score;
  }

  /**
   * Get search statistics
   */
  public getStats() {
    const stats = {
      totalItems: this.allContent.length,
      byCategory: {} as Record<string, number>,
      byType: {} as Record<string, number>
    };

    for (const item of this.allContent) {
      stats.byCategory[item.pageCategory] = (stats.byCategory[item.pageCategory] || 0) + 1;
      stats.byType[item.contentType] = (stats.byType[item.contentType] || 0) + 1;
    }

    return stats;
  }
}

// Singleton instance
export const globalSearchEngine = new GlobalSearchEngine(); 