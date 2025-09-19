import { UserPersona, Activity } from '../types';

export interface CreativeSuggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedCost: number;
  duration: number;
  location: string;
  networkingPotential: number;
  tags: string[];
  alignmentScore: number; // How well it aligns with persona goals
  website?: string; // Official website link
  registrationLink?: string; // Direct registration/booking link
  contactInfo?: string; // Contact information
}

export class CreativeSuggestionsService {
  private static readonly TORONTO_CREATIVE_ACTIVITIES = [
    {
      id: 'cs1',
      title: 'Rooftop Data Visualization Workshop',
      description: 'Learn data storytelling while networking with Toronto tech professionals on a downtown rooftop',
      category: 'professional',
      estimatedCost: 75,
      duration: 180,
      location: 'TIFF Bell Lightbox Rooftop',
      networkingPotential: 9,
      tags: ['data_science', 'visualization', 'networking', 'rooftop', 'creative'],
      themes: ['professional', 'creative', 'networking'],
      website: 'https://tiff.net',
      registrationLink: 'https://tiff.net/events',
      contactInfo: 'events@tiff.net | 416-599-8433'
    },
    {
      id: 'cs2',
      title: 'Toronto Data Science Meetup',
      description: 'Monthly meetup with Toronto data science community featuring presentations and networking',
      category: 'networking',
      estimatedCost: 25,
      duration: 150,
      location: 'MaRS Discovery District',
      networkingPotential: 9,
      tags: ['data_science', 'presentations', 'meetup', 'alcohol_free', 'professional'],
      themes: ['professional', 'networking', 'alcohol_free'],
      website: 'https://www.meetup.com/Toronto-Data-Science-Meetup',
      registrationLink: 'https://www.meetup.com/Toronto-Data-Science-Meetup/events',
      contactInfo: 'organizers@torontodatascience.com'
    },
    {
      id: 'cs3',
      title: 'Frontrunners Toronto Running Group',
      description: 'Join Toronto\'s LGBTQ+ running club for group runs and social connection',
      category: 'fitness',
      estimatedCost: 0,
      duration: 90,
      location: 'High Park / Harbourfront Trail',
      networkingPotential: 7,
      tags: ['running', 'lgbtq', 'community', 'social', 'fitness'],
      themes: ['fitness', 'social', 'community'],
      website: 'https://www.frontrunners.org/toronto',
      registrationLink: 'https://www.frontrunners.org/toronto/join',
      contactInfo: 'toronto@frontrunners.org'
    },
    {
      id: 'cs4',
      title: 'Eataly Toronto Cooking Classes',
      description: 'Learn to cook authentic Italian cuisine with Peter in hands-on cooking classes',
      category: 'couple',
      estimatedCost: 120,
      duration: 180,
      location: 'Eataly Toronto',
      networkingPotential: 5,
      tags: ['cooking', 'italian', 'couple', 'hands_on', 'food'],
      themes: ['couple', 'culinary', 'learning'],
      website: 'https://www.eataly.com/ca_en/stores/toronto',
      registrationLink: 'https://www.eataly.com/ca_en/stores/toronto/experiences',
      contactInfo: 'toronto@eataly.com | 416-260-8800'
    },
    {
      id: 'cs5',
      title: 'MaRS Startup Pitch Events',
      description: 'Watch startup pitches while networking with entrepreneurs and investors in Toronto\'s innovation hub',
      category: 'networking',
      estimatedCost: 35,
      duration: 180,
      location: 'MaRS Discovery District',
      networkingPotential: 9,
      tags: ['startups', 'pitches', 'entrepreneurs', 'alcohol_free', 'innovation'],
      themes: ['professional', 'innovation', 'alcohol_free'],
      website: 'https://www.marsdd.com',
      registrationLink: 'https://www.marsdd.com/events',
      contactInfo: 'events@marsdd.com | 416-673-6277'
    },
    {
      id: 'cs6',
      title: 'High Park Mindful Running Group',
      description: 'Join a small group for mindful running combined with meditation practices in Toronto\'s largest park',
      category: 'fitness',
      estimatedCost: 0,
      duration: 90,
      location: 'High Park Meditation Garden',
      networkingPotential: 6,
      tags: ['running', 'meditation', 'mindfulness', 'group', 'spiritual'],
      themes: ['fitness', 'spiritual', 'mindfulness'],
      website: 'https://www.highpark.org',
      registrationLink: 'https://www.highpark.org/programs/fitness',
      contactInfo: 'programs@highpark.org | 416-392-1111'
    },
    {
      id: 'cs7',
      title: 'Art Gallery of Ontario (AGO) Exhibitions',
      description: 'Attend contemporary art exhibitions and gallery openings with networking opportunities',
      category: 'cultural',
      estimatedCost: 25,
      duration: 120,
      location: 'Art Gallery of Ontario',
      networkingPotential: 7,
      tags: ['art', 'exhibitions', 'cultural', 'creative', 'networking'],
      themes: ['cultural', 'creative', 'networking'],
      website: 'https://ago.ca',
      registrationLink: 'https://ago.ca/events',
      contactInfo: 'info@ago.ca | 416-979-6648'
    },
    {
      id: 'cs8',
      title: 'The Second City Toronto Improv Classes',
      description: 'Take improv comedy classes with Peter to build confidence and communication skills',
      category: 'couple',
      estimatedCost: 85,
      duration: 120,
      location: 'The Second City Toronto',
      networkingPotential: 6,
      tags: ['improv', 'comedy', 'couple', 'communication', 'confidence'],
      themes: ['couple', 'communication', 'fun'],
      website: 'https://www.secondcity.com/toronto',
      registrationLink: 'https://www.secondcity.com/toronto/classes',
      contactInfo: 'toronto@secondcity.com | 416-343-0011'
    },
    {
      id: 'cs9',
      title: 'OCAD University Digital Media Workshops',
      description: 'Experience cutting-edge digital media and data visualization tools at Toronto\'s art and design university',
      category: 'professional',
      estimatedCost: 40,
      duration: 90,
      location: 'OCAD University Digital Media Lab',
      networkingPotential: 6,
      tags: ['digital_media', 'data_visualization', 'technology', 'innovation', 'education'],
      themes: ['professional', 'technology', 'innovation'],
      website: 'https://www.ocadu.ca',
      registrationLink: 'https://www.ocadu.ca/continuing-education',
      contactInfo: 'continuinged@ocadu.ca | 416-977-6000'
    },
    {
      id: 'cs10',
      title: 'Toronto Tennis Club Programs',
      description: 'Join tennis programs and tournaments at Toronto\'s premier tennis facility',
      category: 'fitness',
      estimatedCost: 45,
      duration: 90,
      location: 'Toronto Tennis Club',
      networkingPotential: 8,
      tags: ['tennis', 'sports', 'club', 'networking', 'fitness'],
      themes: ['fitness', 'networking', 'sports'],
      website: 'https://www.torontotennisclub.com',
      registrationLink: 'https://www.torontotennisclub.com/programs',
      contactInfo: 'info@torontotennisclub.com | 416-924-9262'
    }
  ];

  static getPersonalizedSuggestions(persona: UserPersona, count: number = 3): CreativeSuggestion[] {
    const suggestions = this.TORONTO_CREATIVE_ACTIVITIES.map(activity => ({
      ...activity,
      alignmentScore: this.calculateAlignmentScore(activity, persona)
    }));

    // Sort by alignment score and return top suggestions
    return suggestions
      .sort((a, b) => b.alignmentScore - a.alignmentScore)
      .slice(0, count);
  }

  static getWeeklySuggestion(persona: UserPersona): CreativeSuggestion {
    const suggestions = this.getPersonalizedSuggestions(persona, 1);
    return suggestions[0];
  }

  static getSuggestionsByTheme(theme: string, persona: UserPersona): CreativeSuggestion[] {
    const filtered = this.TORONTO_CREATIVE_ACTIVITIES.filter(activity =>
      activity.themes.includes(theme)
    );

    return filtered.map(activity => ({
      ...activity,
      alignmentScore: this.calculateAlignmentScore(activity, persona)
    })).sort((a, b) => b.alignmentScore - a.alignmentScore);
  }

  private static calculateAlignmentScore(activity: any, persona: UserPersona): number {
    let score = 5; // Base score

    // Check goal alignment
    if (persona.goals.primary_goals.some(goal => 
      goal.toLowerCase().includes('network') && activity.networkingPotential >= 7)) {
      score += 3;
    }

    if (persona.goals.primary_goals.some(goal => 
      goal.toLowerCase().includes('fitness') && activity.category === 'fitness')) {
      score += 2;
    }

    if (persona.goals.primary_goals.some(goal => 
      goal.toLowerCase().includes('alcohol') && activity.tags.includes('alcohol_free'))) {
      score += 3;
    }

    // Check activity preferences
    if (persona.preferences.preferred_activity_types.includes(activity.category)) {
      score += 2;
    }

    // Check budget constraints
    if (activity.estimatedCost <= persona.constraints.max_daily_budget) {
      score += 1;
    } else {
      score -= 2;
    }

    // Check networking priority
    if (persona.networking.networking_priority >= 8 && activity.networkingPotential >= 7) {
      score += 2;
    }

    // Check avoided activities
    if (persona.preferences.avoided_activity_types.some(avoided => 
      activity.tags.includes(avoided))) {
      score -= 3;
    }

    return Math.max(0, Math.min(10, score));
  }

  static generateCreativeActivity(persona: UserPersona, theme?: string): CreativeSuggestion {
    const suggestions = theme 
      ? this.getSuggestionsByTheme(theme, persona)
      : this.getPersonalizedSuggestions(persona, 5);

    // Add some randomness while still preferring higher-scored activities
    const weightedRandom = Math.random() * Math.random(); // Bias toward 0
    const index = Math.floor(weightedRandom * suggestions.length);
    
    return suggestions[index] || suggestions[0];
  }
}
