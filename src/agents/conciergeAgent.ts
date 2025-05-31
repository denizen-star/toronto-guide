import { contentValidator, PAGE_CONTENT_DESCRIPTIONS, ValidationResult } from '../utils/contentValidator';
import Papa from 'papaparse';

export interface CurationInsight {
  type: 'category_suggestion' | 'quality_improvement' | 'content_gap' | 'misplaced_content';
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
  };
  qualityMetrics: {
    averageScore: number;
    contentAlignment: number;
    categoryConsistency: number;
  };
}

class ConciergeAgent {
  /**
   * Curate a specific page category and provide insights
   */
  async curatePage(category: 'activities' | 'happy-hours' | 'day-trips' | 'amateur-sports' | 'sporting-events' | 'special-events'): Promise<CurationReport> {
    console.log(`🤵 Concierge Agent analyzing ${category} page...`);
    
    const insights: CurationInsight[] = [];
    let validationResults: ValidationResult[] = [];

    try {
      // Load and validate data for the specific category
      switch (category) {
        case 'activities':
          validationResults = await this.validateActivities();
          break;
        case 'day-trips':
          validationResults = await this.validateDayTrips();
          break;
        case 'amateur-sports':
          validationResults = await this.validateAmateurSports();
          break;
        case 'sporting-events':
          validationResults = await this.validateSportingEvents();
          break;
        case 'special-events':
          validationResults = await this.validateSpecialEvents();
          break;
        default:
          throw new Error(`Category ${category} not yet supported by concierge`);
      }

      // Generate category-specific insights
      insights.push(...this.generateCategoryInsights(category, validationResults));
      insights.push(...this.generateQualityInsights(category, validationResults));
      insights.push(...this.generateContentGapInsights(category, validationResults));

    } catch (error) {
      console.error(`Concierge analysis failed for ${category}:`, error);
    }

    // Calculate metrics
    const totalItems = validationResults.length;
    const validItems = validationResults.filter(r => r.isValid).length;
    const issuesFound = validationResults.reduce((sum, r) => sum + r.issues.length, 0);
    const averageScore = validationResults.reduce((sum, r) => sum + r.score, 0) / totalItems;

    return {
      pageCategory: category,
      generatedAt: new Date().toISOString(),
      insights,
      summary: {
        totalItems,
        validItems,
        issuesFound,
        recommendationsCount: insights.length
      },
      qualityMetrics: {
        averageScore,
        contentAlignment: this.calculateContentAlignment(category, validationResults),
        categoryConsistency: this.calculateCategoryConsistency(validationResults)
      }
    };
  }

  /**
   * Validate activities specifically
   */
  private async validateActivities(): Promise<ValidationResult[]> {
    const response = await fetch('/data/activities.csv');
    const data = await response.text();
    const { data: activities } = Papa.parse(data, { header: true, delimiter: '|' });
    
    return activities
      .filter((activity: any) => activity.id && activity.title)
      .map((activity: any) => contentValidator.validateActivity(activity));
  }

  /**
   * Validate day trips specifically
   */
  private async validateDayTrips(): Promise<ValidationResult[]> {
    const response = await fetch('/data/day_trips_standardized.csv');
    const data = await response.text();
    const { data: trips } = Papa.parse(data, { header: true, delimiter: '|' });
    
    return trips
      .filter((trip: any) => trip.id && trip.title)
      .map((trip: any) => contentValidator.validateDayTrip(trip));
  }

  /**
   * Validate amateur sports specifically
   */
  private async validateAmateurSports(): Promise<ValidationResult[]> {
    const response = await fetch('/data/amateur_sports_standardized.csv');
    const data = await response.text();
    const { data: sports } = Papa.parse(data, { header: true, delimiter: '|' });
    
    return sports
      .filter((sport: any) => sport.id && sport.title)
      .map((sport: any) => contentValidator.validateAmateurSport(sport));
  }

  /**
   * Validate sporting events specifically
   */
  private async validateSportingEvents(): Promise<ValidationResult[]> {
    const response = await fetch('/data/sporting_events_standardized.csv');
    const data = await response.text();
    const { data: events } = Papa.parse(data, { header: true, delimiter: '|' });
    
    return events
      .filter((event: any) => event.id && event.title)
      .map((event: any) => contentValidator.validateSportingEvent(event));
  }

  /**
   * Validate special events specifically
   */
  private async validateSpecialEvents(): Promise<ValidationResult[]> {
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
        recommendation: 'Review these items and consider moving them to more appropriate categories.',
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
        recommendation: 'Remove non-Toronto items or create separate sections for other cities.',
        affectedItems: locationMismatches.map(r => r.id),
        category
      });
    }

    return insights;
  }

  /**
   * Generate insights about content quality
   */
  private generateQualityInsights(category: string, results: ValidationResult[]): CurationInsight[] {
    const insights: CurationInsight[] = [];
    
    // Low quality items
    const lowQualityItems = results.filter(r => r.score < 50);
    if (lowQualityItems.length > 0) {
      insights.push({
        type: 'quality_improvement',
        severity: 'medium',
        title: `${lowQualityItems.length} items need quality improvement`,
        description: 'Items with low validation scores that need attention.',
        recommendation: 'Review and improve descriptions, tags, or remove low-quality entries.',
        affectedItems: lowQualityItems.map(r => r.id),
        category
      });
    }

    // Missing or poor tags
    const tagIssues = results.filter(r => 
      r.issues.some(issue => issue.type === 'tag_mismatch')
    );
    if (tagIssues.length > 0) {
      insights.push({
        type: 'quality_improvement',
        severity: 'low',
        title: `${tagIssues.length} items have tagging issues`,
        description: 'Items with missing or misaligned tags that affect discoverability.',
        recommendation: 'Add appropriate tags based on page content expectations.',
        affectedItems: tagIssues.map(r => r.id),
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
}

export const conciergeAgent = new ConciergeAgent();
export { ConciergeAgent }; 