// Type definitions for LifePlanner React Application

export interface Demographics {
  age_range: [number, number];
  life_stage: string;
  occupation: string;
  income_level: string;
  location_preference: string;
  relationship_status: string;
  has_children: boolean;
  education_level: string;
}

export interface PersonalityProfile {
  personality_type: string;
  energy_pattern: string;
  social_style: string;
  risk_tolerance: number;
  spontaneity_level: number;
  perfectionism_level: number;
  stress_tolerance: number;
  decision_making_style: string;
}

export interface Goals {
  primary_goals: string[];
  career_goals: string[];
  personal_goals: string[];
  short_term_goals: string[];
  long_term_goals: string[];
}

export interface Preferences {
  activity_preferences: string[];
  preferred_activity_types: string[];
  avoided_activity_types: string[];
  preferred_locations: string[];
  budget_preference: string;
  time_preferences: {
    morning_start: string;
    bedtime: string;
    preferred_breakfast: string;
    preferred_dinner: string;
  };
  group_size_preference: string;
  frequency_preference: string;
}

export interface Constraints {
  max_daily_budget: number;
  max_weekly_budget: number;
  available_weekdays: string[];
  available_weekends: string[];
  time_constraints: Record<string, string>;
  physical_limitations: string[];
  dietary_restrictions: string[];
  accessibility_needs: string[];
}

export interface BehavioralPatterns {
  typical_morning_routine: string[];
  typical_evening_routine: string[];
  weekend_habits: string[];
  stress_management: string[];
  learning_preferences: string[];
}

export interface NetworkingProfile {
  networking_priority: number;
  preferred_networking_venues: string[];
  networking_approach: string;
  relationship_depth_preference: string;
  follow_up_style: string;
  communication_preference: string;
}

export interface PersonaMetadata {
  created_date: string;
  last_updated: string;
  is_active: boolean;
  usage_count: number;
}

export interface UserPersona {
  persona_id: string;
  persona_name: string;
  description: string;
  demographics: Demographics;
  personality: PersonalityProfile;
  goals: Goals;
  preferences: Preferences;
  constraints: Constraints;
  behavioral_patterns: BehavioralPatterns;
  networking: NetworkingProfile;
  metadata: PersonaMetadata;
}

export interface TimeAllocation {
  individual_activities_percent: number;
  networking_social_percent: number;
  couple_activities_percent: number;
  individual_breakdown: {
    running_percent: number;
    personal_development_percent: number;
    fitness_grooming_percent: number;
    reflection_planning_percent: number;
  };
  networking_breakdown: {
    professional_networking_percent: number;
    social_activities_percent: number;
    professional_dev_networking_percent: number;
    other_social_percent: number;
  };
  couple_breakdown: {
    daily_meals_percent: number;
    evening_together_percent: number;
    weekend_activities_percent: number;
    breakfast_together_percent: number;
    household_together_percent: number;
  };
}

export interface Activity {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  cost_cad: number;
  duration_minutes: number;
  networking_potential: number;
  location: string;
  tags: string[];
  requirements: string[];
  best_time: string[];
  frequency: string;
}

export interface ScheduleItem {
  start_time: string;
  end_time: string;
  activity: Activity;
  date: string;
  type: 'individual' | 'networking' | 'couple';
}

export interface Schedule {
  date: string;
  time_slots: ScheduleItem[];
  daily_summary: {
    total_cost: number;
    total_networking_potential: number;
    activity_count: number;
    categories_covered: string[];
  };
}

export interface WeeklySchedule {
  week_start: string;
  week_end: string;
  days: Schedule[];
  weekly_summary: {
    total_cost: number;
    total_activities: number;
    networking_activities: number;
    couple_activities: number;
    individual_activities: number;
  };
}

export interface AppState {
  selectedPersona: UserPersona | null;
  timeAllocation: TimeAllocation;
  currentSchedule: WeeklySchedule | null;
  personas: UserPersona[];
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
}
