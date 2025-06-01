import { contentValidator, PAGE_CONTENT_DESCRIPTIONS, ValidationResult } from '../utils/contentValidator';
import { globalSearchEngine, SearchableContent } from '../utils/globalSearch';
import { contentReassignmentManager, type ReassignmentOperation } from '../utils/contentReassignmentManager';
import Papa from 'papaparse';

export interface CurationInsight {
  type: 'category_suggestion' | 'quality_improvement' | 'content_gap' | 'misplaced_content' | 'reassignment_analysis';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  recommendation: string;
  affectedItems: string[];
  category: string;
}

export interface CurationReport {
  pageCategory: string;
  generatedAt: string;
  insights: CurationInsight[];
  summary: {
    totalItems: number;
    validItems: number;
    issuesFound: number;
    recommendationsCount: number;
    reassignedItems?: number;
    totalReassignments?: number;
  };
  qualityMetrics: {
    averageScore: number;
    contentAlignment: number;
    categoryConsistency: number;
    reassignmentImpact?: number;
  };
}

interface ReassignmentPattern {
  pattern: string;
  recommendation: string;
  confidence: number;
  examples: string[];
}

class ConciergeAgent {
  private learnedPatterns: ReassignmentPattern[] = [];

  /**
   * Curate a specific page category and provide insights
   */
  async curatePage(category: 'activities' | 'happy-hours' | 'day-trips' | 'amateur-sports' | 'sporting-events' | 'special-events'): Promise<CurationReport> {
    console.log(`🤵 Concierge Agent analyzing ${category} page with dynamic content...`);
    
    const insights: CurationInsight[] = [];
    let validationResults: ValidationResult[] = [];

    try {
      // Get current content from global search engine (includes reassigned items)
      const currentContent = this.getCurrentCategoryContent(category);
      
      // Load and validate data for the specific category
      switch (category) {
        case 'activities':
          validationResults = await this.validateActivities(currentContent);
          break;
        case 'day-trips':
          validationResults = await this.validateDayTrips(currentContent);
          break;
        case 'amateur-sports':
          validationResults = await this.validateAmateurSports(currentContent);
          break;
        case 'sporting-events':
          validationResults = await this.validateSportingEvents(currentContent);
          break;
        case 'special-events':
          validationResults = await this.validateSpecialEvents(currentContent);
          break;
        default:
          throw new Error(`Category ${category} not yet supported by concierge`);
      }

      // Generate category-specific insights
      insights.push(...this.generateCategoryInsights(category, validationResults));
      insights.push(...this.generateQualityInsights(category, validationResults));
      insights.push(...this.generateContentGapInsights(category, validationResults));
      insights.push(...this.generateReassignmentInsights(category, currentContent));

    } catch (error) {
      console.error(`Concierge analysis failed for ${category}:`, error);
    }

    // Calculate metrics
    const totalItems = validationResults.length;
    const validItems = validationResults.filter(r => r.isValid).length;
    const issuesFound = validationResults.reduce((sum, r) => sum + r.issues.length, 0);
    const averageScore = validationResults.reduce((sum, r) => sum + r.score, 0) / (totalItems || 1);
    
    // Get reassignment statistics
    const reassignmentStats = contentReassignmentManager.getStats();
    const categoryReassignments = contentReassignmentManager.getOperations()
      .filter(op => op.newPageCategory === this.mapCategoryToPageCategory(category));

    return {
      pageCategory: category,
      generatedAt: new Date().toISOString(),
      insights,
      summary: {
        totalItems,
        validItems,
        issuesFound,
        recommendationsCount: insights.length,
        reassignedItems: categoryReassignments.length,
        totalReassignments: reassignmentStats.totalOperations
      },
      qualityMetrics: {
        averageScore,
        contentAlignment: this.calculateContentAlignment(category, validationResults),
        categoryConsistency: this.calculateCategoryConsistency(validationResults),
        reassignmentImpact: this.calculateReassignmentImpact(category)
      }
    };
  }

  /**
   * Get current content for a category from global search engine
   */
  private getCurrentCategoryContent(category: string): SearchableContent[] {
    const pageCategory = this.mapCategoryToPageCategory(category);
    return globalSearchEngine.getContentByCategory(pageCategory);
  }

  /**
   * Map category names to page categories
   */
  private mapCategoryToPageCategory(category: string): string {
    const mapping: Record<string, string> = {
      'activities': 'activities',
      'happy-hours': 'happy-hours',
      'day-trips': 'day-trips',
      'amateur-sports': 'amateur-sports',
      'sporting-events': 'sporting-events',
      'special-events': 'special-events'
    };
    return mapping[category] || category;
  }

  /**
   * Generate insights about recent reassignments
   */
  private generateReassignmentInsights(category: string, currentContent: SearchableContent[]): CurationInsight[] {
    const insights: CurationInsight[] = [];
    const pageCategory = this.mapCategoryToPageCategory(category);
    
    // Get reassignment operations for this category
    const incomingReassignments = contentReassignmentManager.getOperations()
      .filter(op => op.newPageCategory === pageCategory);
    
    const outgoingReassignments = contentReassignmentManager.getOperations()
      .filter(op => op.originalPageCategory === pageCategory);

    if (incomingReassignments.length > 0) {
      insights.push({
        type: 'reassignment_analysis',
        severity: 'medium',
        title: `${incomingReassignments.length} items recently moved to this category`,
        description: `Content has been reassigned to this page from other categories in the current session.`,
        recommendation: `Review the newly assigned items to ensure they fit well with the existing content and update any category-specific metadata.`,
        affectedItems: incomingReassignments.map(op => op.title),
        category
      });
    }

    if (outgoingReassignments.length > 0) {
      insights.push({
        type: 'reassignment_analysis',
        severity: 'low',
        title: `${outgoingReassignments.length} items moved away from this category`,
        description: `Content has been reassigned from this page to other categories in the current session.`,
        recommendation: `Consider if this indicates a pattern that might require adjusting the category criteria or content curation approach.`,
        affectedItems: outgoingReassignments.map(op => op.title),
        category
      });
    }

    // Analyze content diversity after reassignments
    if (currentContent.length > 0) {
      const contentTypes = new Set(currentContent.map(item => item.contentType));
      if (contentTypes.size > 1) {
        insights.push({
          type: 'reassignment_analysis',
          severity: 'low',
          title: `Mixed content types detected`,
          description: `This category now contains ${contentTypes.size} different content types: ${Array.from(contentTypes).join(', ')}.`,
          recommendation: `Consider if the mix of content types is intentional and provides good user experience.`,
          affectedItems: [],
          category
        });
      }
    }

    return insights;
  }

  /**
   * Calculate the impact of reassignments on category quality
   */
  private calculateReassignmentImpact(category: string): number {
    const pageCategory = this.mapCategoryToPageCategory(category);
    const currentContent = globalSearchEngine.getContentByCategory(pageCategory);
    const reassignments = contentReassignmentManager.getOperations();
    
    if (reassignments.length === 0) return 1.0;
    
    const categoryReassignments = reassignments.filter(
      op => op.newPageCategory === pageCategory || op.originalPageCategory === pageCategory
    );
    
    if (categoryReassignments.length === 0) return 1.0;
    
    // Simple impact calculation: fewer reassignments = higher stability
    const impactScore = Math.max(0, 1 - (categoryReassignments.length / Math.max(currentContent.length, 1)));
    return impactScore;
  }

  /**
   * Validate activities using current content
   */
  private async validateActivities(currentContent?: SearchableContent[]): Promise<ValidationResult[]> {
    if (currentContent && currentContent.length > 0) {
      // Use current content from global search engine
      return currentContent
        .filter(item => item.contentType === 'activity')
        .map((activity: any) => contentValidator.validateActivity(activity));
    }
    
    // Fallback to CSV loading
    const response = await fetch('/data/activities.csv');
    const data = await response.text();
    const { data: activities } = Papa.parse(data, { header: true, delimiter: '|' });
    
    return activities
      .filter((activity: any) => activity.id && activity.title)
      .map((activity: any) => contentValidator.validateActivity(activity));
  }

  /**
   * Validate day trips using current content
   */
  private async validateDayTrips(currentContent?: SearchableContent[]): Promise<ValidationResult[]> {
    if (currentContent && currentContent.length > 0) {
      return currentContent
        .filter(item => item.contentType === 'day-trip')
        .map((trip: any) => contentValidator.validateDayTrip(trip));
    }
    
    const response = await fetch('/data/day_trips_standardized.csv');
    const data = await response.text();
    const { data: trips } = Papa.parse(data, { header: true, delimiter: '|' });
    
    return trips
      .filter((trip: any) => trip.id && trip.title)
      .map((trip: any) => contentValidator.validateDayTrip(trip));
  }

  /**
   * Validate amateur sports using current content
   */
  private async validateAmateurSports(currentContent?: SearchableContent[]): Promise<ValidationResult[]> {
    if (currentContent && currentContent.length > 0) {
      return currentContent
        .filter(item => item.contentType === 'amateur-sport')
        .map((sport: any) => contentValidator.validateAmateurSport(sport));
    }
    
    const response = await fetch('/data/amateur_sports_standardized.csv');
    const data = await response.text();
    const { data: sports } = Papa.parse(data, { header: true, delimiter: '|' });
    
    return sports
      .filter((sport: any) => sport.id && sport.title)
      .map((sport: any) => contentValidator.validateAmateurSport(sport));
  }

  /**
   * Validate sporting events using current content
   */
  private async validateSportingEvents(currentContent?: SearchableContent[]): Promise<ValidationResult[]> {
    if (currentContent && currentContent.length > 0) {
      return currentContent
        .filter(item => item.contentType === 'sporting-event')
        .map((event: any) => contentValidator.validateSportingEvent(event));
    }
    
    const response = await fetch('/data/sporting_events_standardized.csv');
    const data = await response.text();
    const { data: events } = Papa.parse(data, { header: true, delimiter: '|' });
    
    return events
      .filter((event: any) => event.id && event.title)
      .map((event: any) => contentValidator.validateSportingEvent(event));
  }

  /**
   * Validate special events using current content
   */
  private async validateSpecialEvents(currentContent?: SearchableContent[]): Promise<ValidationResult[]> {
    if (currentContent && currentContent.length > 0) {
      return currentContent
        .filter(item => item.contentType === 'special-event')
        .map((event: any) => contentValidator.validateSpecialEvent(event));
    }
    
    const response = await fetch('/data/special_events_standardized.csv');
    const data = await response.text();
    const { data: events } = Papa.parse(data, { header: true, delimiter: '|' });
    
    return events
      .filter((event: any) => event.id && event.title)
      .map((event: any) => contentValidator.validateSpecialEvent(event));
  }

  /**
   * Generate insights about category mismatches
   */
  private generateCategoryInsights(category: string, results: ValidationResult[]): CurationInsight[] {
    const insights: CurationInsight[] = [];
    
    // Find items that might belong in different categories
    const categoryMismatches = results.filter(r => 
      r.issues.some(issue => issue.type === 'category_mismatch')
    );

    if (categoryMismatches.length > 0) {
      insights.push({
        type: 'misplaced_content',
        severity: 'high',
        title: `${categoryMismatches.length} items may be in wrong category`,
        description: `Found ${categoryMismatches.length} items that appear to belong in different sections.`,
        recommendation: 'Review these items and consider using the reassignment tool to move them to more appropriate categories.',
        affectedItems: categoryMismatches.map(r => r.id),
        category
      });
    }

    // Find location mismatches (e.g., Montreal items in Toronto guide)
    const locationMismatches = results.filter(r => 
      r.issues.some(issue => issue.type === 'location_mismatch' && issue.severity === 'high')
    );

    if (locationMismatches.length > 0) {
      insights.push({
        type: 'misplaced_content',
        severity: 'high',
        title: `${locationMismatches.length} items are outside Toronto area`,
        description: 'Items found that appear to be for locations outside Toronto.',
        recommendation: 'Remove non-Toronto items or create separate sections for other cities. Use the global search to find and reassign these items.',
        affectedItems: locationMismatches.map(r => r.id),
        category
      });
    }

    return insights;
  }

  /**
   * Enhanced quality insights with reassignment context
   */
  private generateQualityInsights(category: string, results: ValidationResult[]): CurationInsight[] {
    const insights: CurationInsight[] = [];

    // Low quality items
    const lowQualityItems = results.filter(r => r.score < 50);
    if (lowQualityItems.length > 0) {
      insights.push({
        type: 'quality_improvement',
        severity: 'high',
        title: `${lowQualityItems.length} items need quality improvement`,
        description: 'Items with low quality scores that need attention.',
        recommendation: 'Review and improve descriptions, add missing information, or consider removal. Use the content reassignment tool if items would be better in a different category.',
        affectedItems: lowQualityItems.map(r => r.id),
        category
      });
    }

    // Missing critical information
    const missingInfo = results.filter(r => 
      r.issues.some(issue => issue.type === 'missing_data' && issue.severity === 'high')
    );
    
    if (missingInfo.length > 0) {
      insights.push({
        type: 'quality_improvement',
        severity: 'medium',
        title: `${missingInfo.length} items missing critical information`,
        description: 'Items are missing required fields like description, location, or other important details.',
        recommendation: 'Update these items with complete information to improve user experience.',
        affectedItems: missingInfo.map(r => r.id),
        category
      });
    }

    // Inconsistent formatting/descriptions
    const formattingIssues = results.filter(r => 
      r.issues.some(issue => issue.type === 'description_mismatch')
    );
    
    if (formattingIssues.length > 0) {
      insights.push({
        type: 'quality_improvement',
        severity: 'low',
        title: `${formattingIssues.length} items have description inconsistencies`,
        description: 'Items with description inconsistencies that could be standardized.',
        recommendation: 'Standardize descriptions for better consistency across the platform.',
        affectedItems: formattingIssues.map(r => r.id),
        category
      });
    }

    return insights;
  }

  /**
   * Generate insights about content gaps
   */
  private generateContentGapInsights(category: string, results: ValidationResult[]): CurationInsight[] {
    const insights: CurationInsight[] = [];
    
    const expectations = PAGE_CONTENT_DESCRIPTIONS[category as keyof typeof PAGE_CONTENT_DESCRIPTIONS];
    
    if ('expectedNeighborhoods' in expectations) {
      // Check neighborhood coverage for activities
      const coveredNeighborhoods = new Set(
        results
          .map(r => r.originalData.neighborhood)
          .filter(Boolean)
          .map(n => n.toLowerCase())
      );

      const expectedNeighborhoods = expectations.expectedNeighborhoods;
      const missingNeighborhoods = expectedNeighborhoods.filter(n => 
        !Array.from(coveredNeighborhoods).some(covered => 
          covered.includes(n.toLowerCase())
        )
      );

      if (missingNeighborhoods.length > 0) {
        insights.push({
          type: 'content_gap',
          severity: 'medium',
          title: `Missing coverage for ${missingNeighborhoods.length} neighborhoods`,
          description: `No content found for: ${missingNeighborhoods.join(', ')}`,
          recommendation: 'Consider adding activities for underrepresented neighborhoods.',
          affectedItems: [],
          category
        });
      }
    }

    if ('expectedCategories' in expectations) {
      // Check category coverage
      const categoryTags = results.flatMap(r => {
        const tags = Array.isArray(r.originalData.tags) ? r.originalData.tags : 
          (r.originalData.tags ? String(r.originalData.tags).split(',') : []);
        return tags.map(tag => tag.toLowerCase().trim());
      });

      const expectedCategories = expectations.expectedCategories;
      const weakCategories = expectedCategories.filter(cat => {
        const matchingItems = categoryTags.filter(tag => 
          tag.includes(cat.toLowerCase()) || cat.toLowerCase().includes(tag)
        );
        return matchingItems.length < 3; // Less than 3 items in category
      });

      if (weakCategories.length > 0) {
        insights.push({
          type: 'content_gap',
          severity: 'low',
          title: `Weak coverage in ${weakCategories.length} categories`,
          description: `Limited content for: ${weakCategories.join(', ')}`,
          recommendation: 'Consider adding more diverse content to strengthen category coverage.',
          affectedItems: [],
          category
        });
      }
    }

    return insights;
  }

  /**
   * Calculate how well content aligns with page expectations
   */
  private calculateContentAlignment(category: string, results: ValidationResult[]): number {
    const totalItems = results.length;
    if (totalItems === 0) return 0;

    const alignedItems = results.filter(r => r.score >= 80).length;
    return (alignedItems / totalItems) * 100;
  }

  /**
   * Calculate category consistency
   */
  private calculateCategoryConsistency(results: ValidationResult[]): number {
    const totalItems = results.length;
    if (totalItems === 0) return 0;

    const consistentItems = results.filter(r => 
      !r.issues.some(issue => issue.type === 'category_mismatch')
    ).length;
    
    return (consistentItems / totalItems) * 100;
  }

  /**
   * Get quick recommendations for a page
   */
  async getQuickRecommendations(category: string): Promise<string[]> {
    console.log(`🤵 Concierge Agent providing quick recommendations for ${category}...`);
    
    const report = await this.curatePage(category as any);
    
    return report.insights
      .sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      })
      .slice(0, 5)
      .map(insight => `${insight.title}: ${insight.recommendation}`);
  }

  /**
   * Generate a summary report for all categories
   */
  async generateOverallReport(): Promise<{
    summary: string;
    categoryReports: CurationReport[];
    topRecommendations: string[];
  }> {
    console.log('🤵 Concierge Agent generating overall content report...');
    
    const categories = ['activities', 'day-trips', 'amateur-sports', 'sporting-events', 'special-events'] as const;
    const categoryReports: CurationReport[] = [];
    
    for (const category of categories) {
      try {
        const report = await this.curatePage(category);
        categoryReports.push(report);
      } catch (error) {
        console.error(`Failed to generate report for ${category}:`, error);
      }
    }

    // Generate overall summary
    const totalItems = categoryReports.reduce((sum, r) => sum + r.summary.totalItems, 0);
    const totalIssues = categoryReports.reduce((sum, r) => sum + r.summary.issuesFound, 0);
    const avgQuality = categoryReports.reduce((sum, r) => sum + r.qualityMetrics.averageScore, 0) / categoryReports.length;

    const summary = `Analyzed ${totalItems} items across ${categoryReports.length} categories. ` +
      `Found ${totalIssues} issues with average quality score of ${avgQuality.toFixed(1)}/100. ` +
      `Content alignment varies by category, with recommendations available for improvement.`;

    // Get top recommendations across all categories
    const allInsights = categoryReports.flatMap(r => r.insights);
    const topRecommendations = allInsights
      .sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      })
      .slice(0, 10)
      .map(insight => `[${insight.category}] ${insight.recommendation}`);

    return {
      summary,
      categoryReports,
      topRecommendations
    };
  }

  /**
   * Learn from recent reassignments to improve future recommendations
   */
  public async learnFromReassignments(): Promise<ReassignmentPattern[]> {
    const operations = contentReassignmentManager.getOperations();
    const newPatterns: ReassignmentPattern[] = [];

    // Group operations by source and target categories
    const categoryMoves = operations.reduce((acc, op) => {
      const key = `${op.originalPageCategory} → ${op.newPageCategory}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(op);
      return acc;
    }, {} as Record<string, ReassignmentOperation[]>);

    // Analyze patterns for each category move
    for (const [move, ops] of Object.entries(categoryMoves)) {
      if (ops.length < 2) continue; // Skip single moves as they might be outliers

      // Analyze common characteristics
      const commonKeywords = this.findCommonKeywords(ops);
      const contentTypes = new Set(ops.map(op => op.contentType));
      
      // Calculate confidence based on number of similar moves
      const confidence = Math.min(ops.length / 10, 0.9); // Cap at 90%

      // Generate pattern description
      const [sourceCategory, targetCategory] = move.split(' → ');
      const pattern = `Content from "${sourceCategory}" is often better suited for "${targetCategory}" when it contains: ${commonKeywords.join(', ')}`;
      
      // Generate recommendation
      const recommendation = this.generateRecommendation(
        sourceCategory,
        targetCategory,
        commonKeywords,
        Array.from(contentTypes),
        confidence
      );

      newPatterns.push({
        pattern,
        recommendation,
        confidence,
        examples: ops.map(op => op.title)
      });

      // Store pattern for future use
      this.learnedPatterns.push({
        pattern,
        recommendation,
        confidence,
        examples: ops.map(op => op.title)
      });
    }

    // Sort patterns by confidence
    return newPatterns.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Find common keywords in reassigned content
   */
  private findCommonKeywords(operations: ReassignmentOperation[]): string[] {
    const keywords = new Map<string, number>();
    
    operations.forEach(op => {
      const text = [
        op.title,
        op.originalData.description,
        ...(op.originalData.tags || [])
      ].join(' ').toLowerCase();

      // Extract meaningful words
      const words = text.match(/\b\w{4,}\b/g) || [];
      words.forEach(word => {
        keywords.set(word, (keywords.get(word) || 0) + 1);
      });
    });

    // Return keywords that appear in at least 30% of operations
    const threshold = operations.length * 0.3;
    return Array.from(keywords.entries())
      .filter(([_, count]) => count >= threshold)
      .map(([word]) => word)
      .slice(0, 5); // Limit to top 5 keywords
  }

  /**
   * Generate a recommendation based on observed patterns
   */
  private generateRecommendation(
    sourceCategory: string,
    targetCategory: string,
    keywords: string[],
    contentTypes: string[],
    confidence: number
  ): string {
    const confidenceLevel = confidence > 0.8 ? 'strongly' : confidence > 0.5 ? 'moderately' : 'suggests';
    
    return `Data ${confidenceLevel} indicates that content containing keywords like "${keywords.join('", "')}" ` +
           `might be better suited in the "${targetCategory}" category. ` +
           `This is particularly true for ${contentTypes.join(' and ')} content types. ` +
           `Consider reviewing similar content in "${sourceCategory}" for potential reassignment.`;
  }

  /**
   * Add approved patterns to the concierge's learning database
   */
  public async addApprovedPatterns(patterns: ReassignmentPattern[]): Promise<void> {
    // Add each approved pattern to the learned patterns
    patterns.forEach(pattern => {
      // Check if pattern already exists
      const existingIndex = this.learnedPatterns.findIndex(p => p.pattern === pattern.pattern);
      
      if (existingIndex >= 0) {
        // Update existing pattern with new confidence and examples
        this.learnedPatterns[existingIndex] = {
          ...this.learnedPatterns[existingIndex],
          confidence: Math.max(this.learnedPatterns[existingIndex].confidence, pattern.confidence),
          examples: [...new Set([...this.learnedPatterns[existingIndex].examples, ...pattern.examples])]
        };
      } else {
        // Add new pattern
        this.learnedPatterns.push(pattern);
      }
    });

    // Sort patterns by confidence
    this.learnedPatterns.sort((a, b) => b.confidence - a.confidence);

    console.log(`Added ${patterns.length} new patterns to concierge learning database`);
  }
}

export const conciergeAgent = new ConciergeAgent();
export { ConciergeAgent }; 