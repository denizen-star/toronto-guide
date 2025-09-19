import { create } from 'zustand';
import { AppState, UserPersona, TimeAllocation, Activity, WeeklySchedule } from '../types';

interface AppStore extends AppState {
  // Actions
  setSelectedPersona: (persona: UserPersona | null) => void;
  setTimeAllocation: (allocation: Partial<TimeAllocation>) => void;
  setCurrentSchedule: (schedule: WeeklySchedule | null) => void;
  setPersonas: (personas: UserPersona[]) => void;
  setActivities: (activities: Activity[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Complex actions
  loadPersonas: () => Promise<void>;
  generateSchedule: () => Promise<void>;
  exportSchedule: () => Promise<string>;
}

const defaultTimeAllocation: TimeAllocation = {
  individual_activities_percent: 16.0,
  networking_social_percent: 21.6,
  couple_activities_percent: 23.8,
  individual_breakdown: {
    running_percent: 27.0,
    personal_development_percent: 19.0,
    fitness_grooming_percent: 35.0,
    reflection_planning_percent: 19.0,
  },
  networking_breakdown: {
    professional_networking_percent: 24.0,
    social_activities_percent: 50.0,
    professional_dev_networking_percent: 18.0,
    other_social_percent: 8.0,
  },
  couple_breakdown: {
    daily_meals_percent: 29.0,
    evening_together_percent: 25.0,
    weekend_activities_percent: 25.0,
    breakfast_together_percent: 13.0,
    household_together_percent: 8.0,
  },
};

export const useStore = create<AppStore>((set, get) => ({
  // Initial state - Kevin Job Search as default
  selectedPersona: null, // Will be set after personas load
  timeAllocation: defaultTimeAllocation,
  currentSchedule: null,
  personas: [],
  activities: [],
  isLoading: false,
  error: null,

  // Basic setters
  setSelectedPersona: (persona) => set({ selectedPersona: persona }),
  setTimeAllocation: (allocation) => 
    set((state) => ({ 
      timeAllocation: { ...state.timeAllocation, ...allocation } 
    })),
  setCurrentSchedule: (schedule) => set({ currentSchedule: schedule }),
  setPersonas: (personas) => set({ personas }),
  setActivities: (activities) => set({ activities }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Complex actions
  loadPersonas: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // Kevin personas based on the original LifePlanner data
      const personas: UserPersona[] = [
        {
          persona_id: "kevin_job_search",
          persona_name: "Kevin - Job Searching",
          description: "40-year-old Head of Data in career transition, building professional network while maintaining fitness routine",
          demographics: {
            age_range: [40, 45],
            life_stage: "mid_career",
            occupation: "Head of Data (Seeking New Role)",
            income_level: "high",
            location_preference: "Toronto",
            relationship_status: "married",
            has_children: false,
            education_level: "university"
          },
          personality: {
            personality_type: "introvert-extrovert",
            energy_pattern: "not_morning_person",
            social_style: "selective",
            risk_tolerance: 7,
            spontaneity_level: 3,
            perfectionism_level: 8,
            stress_tolerance: 8,
            decision_making_style: "analytical"
          },
          goals: {
            primary_goals: [
              "Build healthy social network outside bar scene",
              "Build professional network in Toronto, New York and Miami", 
              "Practice more intentional activities",
              "Establish clear morning and evening routines",
              "Drink less alcohol"
            ],
            career_goals: [
              "Find new Head of Data role",
              "Build professional network in Toronto, New York and Miami",
              "Excel in fintech data role",
              "Lead data initiatives",
              "Attend industry events and meetups"
            ],
            personal_goals: [
              "Complete half marathon training",
              "Build healthy social network individually and as couple",
              "Practice intentional activities", 
              "Establish stimulating morning and evening routines"
            ],
            short_term_goals: [
              "Join Frontrunners or another queer run club",
              "Attend Toronto Data Science Meetup",
              "Participate in early morning breakfast events",
              "Maintain running schedule (Tue/Thu/Fri/Sun)",
              "Apply to 5 jobs per week"
            ],
            long_term_goals: [
              "Secure new Head of Data position",
              "Build strong professional network across multiple cities",
              "Complete half marathon",
              "Establish consistent morning/evening routines"
            ]
          },
          preferences: {
            activity_preferences: ["professional_driven", "fitness_focused"],
            preferred_activity_types: ["professional", "fitness", "networking", "skill_development"],
            avoided_activity_types: ["bar_scene", "heavy_drinking"],
            preferred_locations: ["Financial District", "Entertainment District", "Running Paths", "Professional Venues"],
            budget_preference: "moderate",
            time_preferences: {
              morning_start: "8:00 AM",
              bedtime: "10:30 PM",
              preferred_breakfast: "Skip breakfast",
              preferred_dinner: "6:00 PM"
            },
            group_size_preference: "small_groups",
            frequency_preference: "high"
          },
          constraints: {
            max_daily_budget: 200.0,
            max_weekly_budget: 1000.0,
            available_weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            available_weekends: ["Saturday", "Sunday"],
            time_constraints: {
              job_search_hours: "9:00 AM - 5:00 PM",
              running_schedule: "Tuesday, Thursday, Friday, Sunday",
              mass_schedule: "Sunday 9:30 AM"
            },
            physical_limitations: [],
            dietary_restrictions: [],
            accessibility_needs: []
          },
          behavioral_patterns: {
            typical_morning_routine: ["Late start (not morning person)", "Job search activities", "Skill development", "Networking research"],
            typical_evening_routine: ["Running or fitness", "Professional networking", "Couple time", "Application follow-ups"],
            weekend_habits: ["Long runs", "Professional meetups", "Data science events", "Couple activities"],
            stress_management: ["Running", "Data analysis", "Professional networking", "Couple support"],
            learning_preferences: ["Hands-on experiences", "Data-driven learning", "Professional workshops", "Online courses"]
          },
          networking: {
            networking_priority: 9,
            preferred_networking_venues: ["Toronto Data Science Meetup", "Fintech events", "Professional breakfast events", "Industry conferences"],
            networking_approach: "strategic",
            relationship_depth_preference: "professional",
            follow_up_style: "professional",
            communication_preference: "in_person"
          },
          metadata: {
            created_date: new Date().toISOString(),
            last_updated: new Date().toISOString(),
            is_active: true,
            usage_count: 0
          }
        },
        {
          persona_id: "kevin_working",
          persona_name: "Kevin - Working",
          description: "40-year-old Head of Data with stable job, focusing on building social network and maintaining fitness",
          demographics: {
            age_range: [40, 45],
            life_stage: "mid_career",
            occupation: "Head of Data at Fintech",
            income_level: "high",
            location_preference: "Toronto",
            relationship_status: "married",
            has_children: false,
            education_level: "university"
          },
          personality: {
            personality_type: "introvert-extrovert",
            energy_pattern: "not_morning_person",
            social_style: "selective",
            risk_tolerance: 7,
            spontaneity_level: 3,
            perfectionism_level: 8,
            stress_tolerance: 8,
            decision_making_style: "analytical"
          },
          goals: {
            primary_goals: [
              "Build healthy social network outside bar scene",
              "Excel in current Head of Data role",
              "Maintain work-life balance",
              "Complete half marathon training"
            ],
            career_goals: [
              "Lead data initiatives at current company",
              "Build professional network in Toronto",
              "Mentor junior data professionals",
              "Attend industry events and meetups"
            ],
            personal_goals: [
              "Complete half marathon training",
              "Build healthy social network individually and as couple",
              "Practice intentional activities",
              "Establish stimulating morning and evening routines"
            ],
            short_term_goals: [
              "Join Frontrunners or another queer run club",
              "Attend Toronto Data Science Meetup",
              "Maintain running schedule (Tue/Thu/Fri/Sun)",
              "Reduce alcohol consumption"
            ],
            long_term_goals: [
              "Build strong professional network",
              "Complete half marathon",
              "Establish consistent routines",
              "Build healthy social network outside bar scene"
            ]
          },
          preferences: {
            activity_preferences: ["professional_driven", "fitness_focused"],
            preferred_activity_types: ["professional", "fitness", "networking", "social"],
            avoided_activity_types: ["bar_scene", "heavy_drinking"],
            preferred_locations: ["Financial District", "Entertainment District", "Running Paths", "Professional Venues"],
            budget_preference: "moderate",
            time_preferences: {
              morning_start: "6:00 AM",
              bedtime: "10:30 PM",
              preferred_breakfast: "7:00 AM",
              preferred_dinner: "6:00 PM"
            },
            group_size_preference: "small_groups",
            frequency_preference: "moderate"
          },
          constraints: {
            max_daily_budget: 150.0,
            max_weekly_budget: 800.0,
            available_weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            available_weekends: ["Saturday", "Sunday"],
            time_constraints: {
              work_start: "9:00 AM",
              work_end: "6:00 PM",
              running_schedule: "Tuesday, Thursday, Friday, Sunday",
              mass_schedule: "Sunday 9:30 AM"
            },
            physical_limitations: [],
            dietary_restrictions: [],
            accessibility_needs: []
          },
          behavioral_patterns: {
            typical_morning_routine: ["Flexible start", "Creative work", "Coffee", "Inspiration time"],
            typical_evening_routine: ["Client work", "Creative projects", "Social time", "Reflection"],
            weekend_habits: ["Art galleries", "Creative workshops", "Networking events", "Personal projects"],
            stress_management: ["Creative expression", "Nature time", "Social connection", "Physical activity"],
            learning_preferences: ["Hands-on experiences", "Visual learning", "Collaborative learning", "Trial and error"]
          },
          networking: {
            networking_priority: 7,
            preferred_networking_venues: ["Art galleries", "Creative workshops", "Cafes", "Co-working spaces"],
            networking_approach: "organic",
            relationship_depth_preference: "mixed",
            follow_up_style: "professional",
            communication_preference: "in_person"
          },
          metadata: {
            created_date: new Date().toISOString(),
            last_updated: new Date().toISOString(),
            is_active: true,
            usage_count: 0
          }
        }
      ];
      
      // Set Kevin Job Search as the default selected persona
      const defaultPersona = personas.find(p => p.persona_id === "kevin_job_search") || personas[0];
      set({ personas, selectedPersona: defaultPersona, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load personas', isLoading: false });
    }
  },

  generateSchedule: async () => {
    const { selectedPersona } = get();
    if (!selectedPersona) {
      set({ error: 'No persona selected' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      // Mock schedule generation - in real app this would call an API
      const mockSchedule: WeeklySchedule = {
        week_start: new Date().toISOString().split('T')[0],
        week_end: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        days: [],
        weekly_summary: {
          total_cost: 450,
          total_activities: 28,
          networking_activities: 8,
          couple_activities: 12,
          individual_activities: 8
        }
      };

      set({ currentSchedule: mockSchedule, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to generate schedule', isLoading: false });
    }
  },

  exportSchedule: async () => {
    const { currentSchedule } = get();
    if (!currentSchedule) {
      throw new Error('No schedule to export');
    }

    // Mock export functionality
    return `schedule_${currentSchedule.week_start}.md`;
  }
}));
