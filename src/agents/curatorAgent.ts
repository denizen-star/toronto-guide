import { contentReassignmentManager, type ReassignmentOperation } from '../utils/contentReassignmentManager';
import type { SearchableContent } from '../utils/globalSearch';

export interface ReassignmentPattern {
  pattern: string;
  recommendation: string;
  confidence: number;
  examples: string[];
  keywords: string[];
  sourceCategory: string;
  targetCategory: string;
  contentTypes: string[];
}

class CuratorAgent {
  private learnedPatterns: ReassignmentPattern[] = [];

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

      const newPattern: ReassignmentPattern = {
        pattern,
        recommendation,
        confidence,
        examples: ops.map(op => op.title),
        keywords: commonKeywords,
        sourceCategory,
        targetCategory,
        contentTypes: Array.from(contentTypes)
      };

      newPatterns.push(newPattern);
    }

    // Sort patterns by confidence
    return newPatterns.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Add approved patterns to the curator's learning database
   */
  public async addApprovedPatterns(patterns: ReassignmentPattern[]): Promise<void> {
    // Add each approved pattern to the learned patterns
    patterns.forEach(pattern => {
      // Check if pattern already exists
      const existingIndex = this.learnedPatterns.findIndex(p => 
        p.sourceCategory === pattern.sourceCategory && 
        p.targetCategory === pattern.targetCategory
      );
      
      if (existingIndex >= 0) {
        // Update existing pattern
        const existing = this.learnedPatterns[existingIndex];
        this.learnedPatterns[existingIndex] = {
          ...pattern,
          confidence: Math.max(existing.confidence, pattern.confidence),
          examples: [...new Set([...existing.examples, ...pattern.examples])],
          keywords: [...new Set([...existing.keywords, ...pattern.keywords])]
        };
      } else {
        // Add new pattern
        this.learnedPatterns.push(pattern);
      }
    });

    // Sort patterns by confidence
    this.learnedPatterns.sort((a, b) => b.confidence - a.confidence);

    console.log(`Added ${patterns.length} new patterns to curator learning database`);
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
   * Get recommendations for content based on learned patterns
   */
  public getRecommendationsForContent(content: SearchableContent): ReassignmentPattern[] {
    return this.learnedPatterns
      .filter(pattern => {
        // Check if content matches pattern
        const contentText = [
          content.title,
          'description' in content ? content.description : '',
          // Safely handle tags for different content types
          ...('tags' in content && Array.isArray(content.tags) ? content.tags : [])
        ].join(' ').toLowerCase();

        // Count how many keywords match
        const matchingKeywords = pattern.keywords.filter(keyword => 
          contentText.includes(keyword.toLowerCase())
        );

        // Return true if at least 30% of keywords match
        return matchingKeywords.length >= Math.ceil(pattern.keywords.length * 0.3);
      })
      .sort((a, b) => b.confidence - a.confidence);
  }
}

// Singleton instance
export const curatorAgent = new CuratorAgent();
export { CuratorAgent }; 