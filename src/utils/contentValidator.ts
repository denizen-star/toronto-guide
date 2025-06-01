import Papa from 'papaparse';
import { 
  Activity, 
  StandardizedDayTrip,
  StandardizedAmateurSport,
  StandardizedSportingEvent,
  StandardizedSpecialEvent
} from './dataLoader';

// Page content descriptions based on PAGE_CONTENT_DESCRIPTION.md
export const PAGE_CONTENT_DESCRIPTIONS = {
  activities: {
    purpose: "Comprehensive listing of cultural activities and attractions in Toronto",
    expectedCategories: ["Museums", "Food & Dining", "Outdoor Activities", "Entertainment"],
    expectedTags: [
      "must-not-miss", "outdoor", "family-friendly", "seasonal", "photography", "free", 
      "art", "culture", "indoor", "rainy-day", "food", "history", "guided-tour", 
      "walking", "adventure", "thrill", "unique", "museum", "education", "cycling", 
      "active", "shopping", "luxury", "fashion", "sports", "entertainment"
    ],
    expectedNeighborhoods: [
      "Downtown", "Midtown", "Uptown", "East End", "West End", "Waterfront",
      "Toronto Islands", "High Park", "Yorkville", "Entertainment District",
      "St. Lawrence", "Kensington Market", "Distillery District", "Harbourfront"
    ]
  },
  "happy-hours": {
    purpose: "Directory of nightlife venues with special drink and food offers",
    expectedVenueTypes: [
      "Bars & Lounges", "Restaurants", "Pubs & Gastropubs", "Clubs & Nightlife", 
      "Breweries", "Rooftop Venues"
    ],
    expectedSpecialTypes: [
      "Wine Specials", "Cocktail Specials", "Beer Specials", "Food & Drink Combos", 
      "Entertainment"
    ],
    expectedNeighborhoods: [
      "Downtown", "King West", "Yorkville", "Entertainment District", "Ossington", 
      "Waterfront"
    ]
  },
  "day-trips": {
    purpose: "Curated destinations for day-long excursions from Toronto",
    expectedCategories: [
      "Wine Country", "Nature & Parks", "Historic Sites", "Beaches & Waterfront", 
      "Cultural Attractions", "Adventure & Outdoor", "Scenic Drives"
    ],
    expectedHighlights: [
      "Family Friendly", "Romantic", "Photography", "Culinary Experiences", 
      "Shopping", "Historic Sites", "Scenic Views"
    ],
    expectedDistances: ["Local (0-50km)", "Medium (50-150km)", "Far (150km+)"]
  },
  "amateur-sports": {
    purpose: "Local recreational sports activities and clubs for participation",
    expectedSportTypes: [
      "Golf", "Tennis", "Fitness", "Swimming", "Baseball", "Basketball", 
      "Football", "General Sports"
    ],
    expectedSkillLevels: ["Beginner", "Intermediate", "Advanced", "All Levels"]
  },
  "sporting-events": {
    purpose: "Professional sports games and major sporting events",
    expectedSportTypes: [
      "Hockey", "Basketball", "Soccer", "Baseball", "Tennis", "General Sports"
    ],
    expectedVenues: ["Scotiabank Arena", "Rogers Centre", "BMO Field"],
    expectedEventTypes: ["Regular season", "Playoffs", "Championships", "Special events"]
  },
  "special-events": {
    purpose: "Cultural events, festivals, exhibitions, and special happenings",
    expectedEventTypes: ["Art", "Music", "Theater", "Food", "Festival", "Cultural"],
    expectedTags: [
      "art", "music", "theater", "food", "festival", "cultural", "family-friendly", 
      "adult-oriented"
    ]
  }
};

export interface ValidationResult {
  id: string;
  itemType: 'activities' | 'happy-hours' | 'day-trips' | 'amateur-sports' | 'sporting-events' | 'special-events';
  isValid: boolean;
  score: number; // 0-100 confidence score
  issues: ValidationIssue[];
  suggestedCategory?: string;
  originalData: any;
}

export interface ValidationIssue {
  type: 'category_mismatch' | 'location_mismatch' | 'tag_mismatch' | 'description_mismatch' | 'missing_data';
  severity: 'low' | 'medium' | 'high';
  message: string;
  field: string;
  suggestion?: string;
}

export interface QuarantinedItem extends ValidationResult {
  quarantineReason: string;
  reviewStatus: 'pending' | 'approved' | 'rejected';
  reviewedAt?: Date;
  reviewNotes?: string;
}

class ContentValidator {
  private validationThreshold = 70; // Items scoring below this are quarantined

  /**
   * Validates activities against the activities page expectations
   */
  validateActivity(activity: Activity): ValidationResult {
    const issues: ValidationIssue[] = [];
    let score = 100;

    // Check if tags align with expected activity tags
    const activityTags = Array.isArray(activity.tags) ? activity.tags : 
      (activity.tags ? String(activity.tags).split(',').map(tag => tag.trim()) : []);
    
    const validTags = PAGE_CONTENT_DESCRIPTIONS.activities.expectedTags;
    const hasValidTags = activityTags.some(tag => 
      validTags.some(validTag => tag.toLowerCase().includes(validTag.toLowerCase()))
    );

    if (!hasValidTags) {
      issues.push({
        type: 'tag_mismatch',
        severity: 'medium',
        message: 'Activity tags do not align with expected activity categories',
        field: 'tags',
        suggestion: 'Consider adding tags like: art, culture, outdoor, entertainment, food'
      });
      score -= 20;
    }

    // Check neighborhood alignment
    if (activity.neighborhood) {
      const validNeighborhoods = PAGE_CONTENT_DESCRIPTIONS.activities.expectedNeighborhoods;
      const isValidNeighborhood = validNeighborhoods.some(neighborhood =>
        activity.neighborhood?.toLowerCase().includes(neighborhood.toLowerCase())
      );

      if (!isValidNeighborhood) {
        issues.push({
          type: 'location_mismatch',
          severity: 'low',
          message: 'Neighborhood not commonly associated with Toronto activities',
          field: 'neighborhood',
          suggestion: 'Verify if this is within expected Toronto activity areas'
        });
        score -= 10;
      }
    }

    // Check for Montreal activities (should not be in Toronto activities)
    const description = activity.description?.toLowerCase() || '';
    const title = activity.title?.toLowerCase() || '';
    
    if (description.includes('montreal') || title.includes('montreal') || 
        activity.neighborhood?.toLowerCase().includes('montreal')) {
      issues.push({
        type: 'location_mismatch',
        severity: 'high',
        message: 'This appears to be a Montreal activity in Toronto activities list',
        field: 'location',
        suggestion: 'Move to Montreal activities or remove from Toronto guide'
      });
      score -= 40;
    }

    // Check for proper activity content vs other categories
    if (this.appearsToBeHappyHour(activity)) {
      issues.push({
        type: 'category_mismatch',
        severity: 'high',
        message: 'This appears to be a happy hour/nightlife item rather than a general activity',
        field: 'content',
        suggestion: 'Consider moving to happy hours section'
      });
      score -= 30;
    }

    return {
      id: activity.id,
      itemType: 'activities',
      isValid: score >= this.validationThreshold,
      score,
      issues,
      originalData: activity
    };
  }

  /**
   * Validates day trips against day trip expectations
   */
  validateDayTrip(dayTrip: StandardizedDayTrip): ValidationResult {
    const issues: ValidationIssue[] = [];
    let score = 100;

    // Check travel time - should be reasonable for day trip
    const travelTime = dayTrip.travelTime || '';
    if (travelTime.includes('15-16') || travelTime.includes('14-15')) {
      issues.push({
        type: 'location_mismatch',
        severity: 'high',
        message: 'Travel time exceeds reasonable day trip distance (>8 hours)',
        field: 'travelTime',
        suggestion: 'Consider moving to multi-day trips or weekend getaways'
      });
      score -= 40;
    }

    // Check for reasonable day trip duration
    if (dayTrip.duration && dayTrip.duration.includes('15-16 hrs')) {
      issues.push({
        type: 'description_mismatch',
        severity: 'medium',
        message: 'Duration seems excessive for a day trip',
        field: 'duration'
      });
      score -= 20;
    }

    // Validate location is accessible from Toronto
    const location = dayTrip.location?.toLowerCase() || '';
    if (location.includes('thunder bay') || location.includes('manitoba')) {
      issues.push({
        type: 'location_mismatch',
        severity: 'high',
        message: 'Location is too far from Toronto for a day trip',
        field: 'location',
        suggestion: 'Consider categorizing as weekend getaway or remove'
      });
      score -= 35;
    }

    return {
      id: dayTrip.id,
      itemType: 'day-trips',
      isValid: score >= this.validationThreshold,
      score,
      issues,
      originalData: dayTrip
    };
  }

  /**
   * Validates amateur sports activities
   */
  validateAmateurSport(sport: StandardizedAmateurSport): ValidationResult {
    const issues: ValidationIssue[] = [];
    let score = 100;

    // Check if it's actually a professional sport
    const title = sport.title?.toLowerCase() || '';
    const description = sport.description?.toLowerCase() || '';
    
    if ((title.includes('maple leafs') || title.includes('raptors') || 
        title.includes('blue jays')) || (description.includes('professional') ||
        description.includes('nhl') || description.includes('nba'))) {
      issues.push({
        type: 'category_mismatch',
        severity: 'high',
        message: 'This appears to be a professional sport, not amateur',
        field: 'content',
        suggestion: 'Move to sporting events section'
      });
      score -= 40;
    }

    // Check skill level validity
    const expectedSkillLevels = PAGE_CONTENT_DESCRIPTIONS["amateur-sports"].expectedSkillLevels;
    if (sport.skillLevel && !expectedSkillLevels.includes(sport.skillLevel)) {
      issues.push({
        type: 'description_mismatch',
        severity: 'low',
        message: 'Skill level not in expected format',
        field: 'skillLevel',
        suggestion: `Use one of: ${expectedSkillLevels.join(', ')}`
      });
      score -= 10;
    }

    return {
      id: sport.id,
      itemType: 'amateur-sports',
      isValid: score >= this.validationThreshold,
      score,
      issues,
      originalData: sport
    };
  }

  /**
   * Validates sporting events
   */
  validateSportingEvent(event: StandardizedSportingEvent): ValidationResult {
    const issues: ValidationIssue[] = [];
    let score = 100;

    // Check if it's actually an amateur sport
    const title = event.title?.toLowerCase() || '';
    const description = event.description?.toLowerCase() || '';
    
    if (title.includes('amateur') || title.includes('recreational') || 
        description.includes('beginner') || description.includes('drop-in')) {
      issues.push({
        type: 'category_mismatch',
        severity: 'medium',
        message: 'This appears to be amateur/recreational sports, not professional',
        field: 'content',
        suggestion: 'Move to amateur sports section'
      });
      score -= 25;
    }

    // Check location for professional venues
    const location = event.location?.toLowerCase() || '';
    const expectedVenues = PAGE_CONTENT_DESCRIPTIONS["sporting-events"].expectedVenues;
    const isKnownVenue = expectedVenues.some(venue => 
      location.includes(venue.toLowerCase())
    );

    if (!isKnownVenue && (location.includes('arena') || location.includes('stadium'))) {
      issues.push({
        type: 'location_mismatch',
        severity: 'low',
        message: 'Venue not recognized as major Toronto sports venue',
        field: 'location',
        suggestion: 'Verify this is a professional sports venue'
      });
      score -= 10;
    }

    return {
      id: event.id,
      itemType: 'sporting-events',
      isValid: score >= this.validationThreshold,
      score,
      issues,
      originalData: event
    };
  }

  /**
   * Validates special events
   */
  validateSpecialEvent(event: StandardizedSpecialEvent): ValidationResult {
    const issues: ValidationIssue[] = [];
    let score = 100;

    // Check if it's a sports event rather than cultural
    const title = event.title?.toLowerCase() || '';
    const description = event.description?.toLowerCase() || '';
    
    if (title.includes('game') || title.includes('match') || 
        description.includes('professional sports') || description.includes('hockey') ||
        description.includes('basketball') || description.includes('baseball')) {
      issues.push({
        type: 'category_mismatch',
        severity: 'medium',
        message: 'This appears to be a sporting event rather than cultural event',
        field: 'content',
        suggestion: 'Move to sporting events section'
      });
      score -= 25;
    }

    // Check for appropriate cultural event characteristics
    const expectedTags = PAGE_CONTENT_DESCRIPTIONS["special-events"].expectedTags;
    const eventTags = Array.isArray(event.tags) ? event.tags : 
      (event.tags ? String(event.tags).split(',').map(tag => tag.trim()) : []);
    
    const hasCulturalTags = eventTags.some(tag => 
      expectedTags.some(expectedTag => 
        tag.toLowerCase().includes(expectedTag.toLowerCase())
      )
    );

    if (!hasCulturalTags) {
      issues.push({
        type: 'tag_mismatch',
        severity: 'medium',
        message: 'Event lacks cultural/arts-focused tags',
        field: 'tags',
        suggestion: 'Add tags like: art, music, theater, festival, cultural'
      });
      score -= 20;
    }

    return {
      id: event.id,
      itemType: 'special-events',
      isValid: score >= this.validationThreshold,
      score,
      issues,
      originalData: event
    };
  }

  /**
   * Helper method to detect if an activity is actually a happy hour
   */
  private appearsToBeHappyHour(activity: Activity): boolean {
    const title = activity.title?.toLowerCase() || '';
    const description = activity.description?.toLowerCase() || '';
    
    return title.includes('happy hour') || 
           title.includes('bar crawl') || 
           description.includes('discounted drinks') ||
           description.includes('cocktails') ||
           description.includes('craft beer') ||
           (description.includes('bar') && description.includes('night'));
  }

  /**
   * Validate all data and return quarantined items
   */
  async validateAllData(): Promise<QuarantinedItem[]> {
    const quarantinedItems: QuarantinedItem[] = [];

    try {
      // Load and validate activities
      const activitiesResponse = await fetch('/data/activities.csv');
      const activitiesData = await activitiesResponse.text();
      const { data: activities } = Papa.parse(activitiesData, { header: true });
      
      activities.forEach((activity: any) => {
        if (activity.id && activity.title) {
          const result = this.validateActivity(activity as Activity);
          if (!result.isValid) {
            quarantinedItems.push({
              ...result,
              quarantineReason: result.issues.map(issue => issue.message).join('; '),
              reviewStatus: 'pending'
            });
          }
        }
      });

      // Load and validate day trips
      const dayTripsResponse = await fetch('/data/day_trips_standardized.csv');
      const dayTripsData = await dayTripsResponse.text();
      const { data: dayTrips } = Papa.parse(dayTripsData, { 
        header: true, 
        delimiter: '|' 
      });
      
      dayTrips.forEach((trip: any) => {
        if (trip.id && trip.title) {
          const result = this.validateDayTrip(trip as StandardizedDayTrip);
          if (!result.isValid) {
            quarantinedItems.push({
              ...result,
              quarantineReason: result.issues.map(issue => issue.message).join('; '),
              reviewStatus: 'pending'
            });
          }
        }
      });

      // Load and validate amateur sports
      const amateurSportsResponse = await fetch('/data/amateur_sports_standardized.csv');
      const amateurSportsData = await amateurSportsResponse.text();
      const { data: amateurSports } = Papa.parse(amateurSportsData, { 
        header: true, 
        delimiter: '|' 
      });
      
      amateurSports.forEach((sport: any) => {
        if (sport.id && sport.title) {
          const result = this.validateAmateurSport(sport as StandardizedAmateurSport);
          if (!result.isValid) {
            quarantinedItems.push({
              ...result,
              quarantineReason: result.issues.map(issue => issue.message).join('; '),
              reviewStatus: 'pending'
            });
          }
        }
      });

      // Load and validate sporting events
      const sportingEventsResponse = await fetch('/data/sporting_events_standardized.csv');
      const sportingEventsData = await sportingEventsResponse.text();
      const { data: sportingEvents } = Papa.parse(sportingEventsData, { 
        header: true, 
        delimiter: '|' 
      });
      
      sportingEvents.forEach((event: any) => {
        if (event.id && event.title) {
          const result = this.validateSportingEvent(event as StandardizedSportingEvent);
          if (!result.isValid) {
            quarantinedItems.push({
              ...result,
              quarantineReason: result.issues.map(issue => issue.message).join('; '),
              reviewStatus: 'pending'
            });
          }
        }
      });

      // Load and validate special events
      const specialEventsResponse = await fetch('/data/special_events_standardized.csv');
      const specialEventsData = await specialEventsResponse.text();
      const { data: specialEvents } = Papa.parse(specialEventsData, { 
        header: true, 
        delimiter: '|' 
      });
      
      specialEvents.forEach((event: any) => {
        if (event.id && event.title) {
          const result = this.validateSpecialEvent(event as StandardizedSpecialEvent);
          if (!result.isValid) {
            quarantinedItems.push({
              ...result,
              quarantineReason: result.issues.map(issue => issue.message).join('; '),
              reviewStatus: 'pending'
            });
          }
        }
      });

    } catch (error) {
      console.error('Error validating data:', error);
    }

    return quarantinedItems;
  }

  /**
   * Get validation summary statistics
   */
  getValidationSummary(results: ValidationResult[]): {
    totalItems: number;
    validItems: number;
    quarantinedItems: number;
    issuesByType: Record<string, number>;
    averageScore: number;
  } {
    const totalItems = results.length;
    const validItems = results.filter(r => r.isValid).length;
    const quarantinedItems = results.filter(r => !r.isValid).length;
    
    const issuesByType: Record<string, number> = {};
    results.forEach(result => {
      result.issues.forEach(issue => {
        issuesByType[issue.type] = (issuesByType[issue.type] || 0) + 1;
      });
    });

    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / totalItems;

    return {
      totalItems,
      validItems,
      quarantinedItems,
      issuesByType,
      averageScore
    };
  }
}

export const contentValidator = new ContentValidator();
export default ContentValidator; 