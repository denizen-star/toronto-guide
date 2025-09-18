#!/usr/bin/env python3
"""
The Toronto Life Planner Agent - Optimized Version
A proactive and creative agent designed to generate personalized daily and weekly 
itineraries for a busy couple exploring new social and professional circles in Toronto.

Key Optimizations:
- Smart activity selection to avoid repetition
- Conflict resolution for scheduling
- Weather-aware suggestions
- Enhanced networking focus
- Better time management
"""

import json
import datetime
from typing import Dict, List, Optional, Tuple, Set
from dataclasses import dataclass, field
from enum import Enum
import random
import copy
from collections import defaultdict


class ActivityType(Enum):
    MORNING_ROUTINE = "morning_routine"
    BREAKFAST = "breakfast"
    ACTIVITY = "activity"
    DINNER = "dinner"
    EVENING_ROUTINE = "evening_routine"
    SOCIAL = "social"
    PROFESSIONAL = "professional"
    FITNESS = "fitness"
    CREATIVE = "creative"
    CULTURAL = "cultural"


@dataclass
class Activity:
    name: str
    activity_type: ActivityType
    duration_hours: float
    cost_cad: float
    location: str
    description: str
    social_networking_potential: int  # 1-10 scale
    energy_level: str  # "low", "medium", "high"
    day_preference: Optional[str] = None  # "weekday", "weekend", or specific day
    weather_dependent: bool = False
    indoor: bool = True
    tags: Set[str] = field(default_factory=set)  # For better categorization
    last_used: Optional[datetime.datetime] = None  # Track usage to avoid repetition
    usage_count: int = 0  # Track how often used


@dataclass
class TimeSlot:
    start_time: str
    end_time: str
    activity: Activity
    notes: str = ""
    is_specific_activity: bool = False  # Track if this was a user-specified activity


class TorontoLifePlanner:
    """
    The Toronto Life Planner Agent - Optimized Version
    Generates personalized itineraries for busy couples in Toronto
    """
    
    def __init__(self):
        self.user_name = "User"
        self.partner_name = "Husband (Celebrity Fashion Stylist)"
        self.morning_start = "6:00 AM"
        self.bedtime = "10:30 PM"
        self.activities_db = self._load_activities_database()
        self.used_activities: Set[str] = set()  # Track used activities to avoid repetition
        self.activity_usage_count: Dict[str, int] = defaultdict(int)  # Track usage frequency
        self.weekly_themes = [
            "Creative Immersion",
            "Social & Active Push", 
            "Professional Networking",
            "Cultural Exploration",
            "Fitness & Wellness",
            "Culinary Adventures",
            "Art & Fashion"
        ]
        self.weather_conditions = "unknown"  # Will be updated based on weather data
    
    def _load_activities_database(self) -> List[Activity]:
        """Load comprehensive database of Toronto activities with enhanced tagging"""
        activities = [
            # Morning Routines - Structured Morning Process (6:00 AM - 9:45 AM)
            Activity("Wake Up & Hydration", ActivityType.MORNING_ROUTINE, 0.25, 0, "Home", 
                    "Wake up, drink water, and start the day with intention", 0, "low", 
                    tags={"wake-up", "hydration", "home", "personal"}),
            Activity("Morning Exercise", ActivityType.MORNING_ROUTINE, 0.75, 0, "Home", 
                    "30-45 minutes of exercise: yoga, stretching, or light cardio to energize", 0, "medium",
                    tags={"fitness", "exercise", "home", "wellness"}),
            Activity("Shower & Grooming", ActivityType.MORNING_ROUTINE, 0.5, 0, "Home", 
                    "Shower, skincare routine, and personal grooming", 0, "low",
                    tags={"grooming", "shower", "home", "personal-care"}),
            Activity("Breakfast & Coffee", ActivityType.MORNING_ROUTINE, 0.5, 10, "Home", 
                    "Nutritious breakfast and morning coffee while reviewing the day ahead", 0, "low",
                    tags={"breakfast", "coffee", "nutrition", "home"}),
            Activity("Work Preparation", ActivityType.MORNING_ROUTINE, 0.5, 0, "Home", 
                    "Review schedule, check emails, pack work bag, and set daily intentions", 0, "low",
                    tags={"work-prep", "organization", "planning", "professional"}),
            Activity("Commute & Industry News", ActivityType.MORNING_ROUTINE, 0.75, 5, "Transit/Cafe", 
                    "Commute to work while catching up on fashion industry news and trends", 2, "low",
                    tags={"commute", "industry", "news", "professional"}),
            
            # Alternative Morning Routines (for variety)
            Activity("Morning Meditation & Journaling", ActivityType.MORNING_ROUTINE, 0.5, 0, "Home", 
                    "Start day with mindfulness and intention setting", 0, "low", 
                    tags={"mindfulness", "home", "personal"}),
            Activity("Yoga Flow Session", ActivityType.MORNING_ROUTINE, 1.0, 0, "Home", 
                    "Gentle yoga to energize and center", 0, "medium",
                    tags={"fitness", "home", "wellness"}),
            Activity("Coffee & News Review", ActivityType.MORNING_ROUTINE, 0.5, 5, "Local Cafe", 
                    "Catch up on fashion industry news and trends", 2, "low",
                    tags={"professional", "cafe", "industry"}),
            
            # Breakfast Options
            Activity("Home-Cooked Breakfast", ActivityType.BREAKFAST, 1.0, 15, "Home", 
                    "Nutritious breakfast with cooking time", 0, "low",
                    tags={"home", "cooking", "healthy"}),
            Activity("Cafe Breakfast", ActivityType.BREAKFAST, 1.0, 25, "Trendy Cafe", 
                    "Social breakfast at popular local spot", 3, "low",
                    tags={"social", "cafe", "casual"}),
            Activity("Brunch with Friends", ActivityType.BREAKFAST, 2.0, 45, "Restaurant", 
                    "Extended social brunch networking", 7, "medium",
                    tags={"social", "networking", "restaurant", "weekend"}),
            
            # Social & Professional Activities
            Activity("Art Gallery Opening", ActivityType.SOCIAL, 2.0, 0, "Gallery District", 
                    "Network with artists, collectors, and creatives", 8, "medium", "weekend",
                    tags={"art", "networking", "cultural", "evening"}),
            Activity("Fashion Industry Mixer", ActivityType.PROFESSIONAL, 3.0, 50, "Event Venue", 
                    "Professional networking in fashion industry", 9, "high", "weekday",
                    tags={"fashion", "professional", "networking", "industry"}),
            Activity("Cooking Class", ActivityType.SOCIAL, 2.5, 85, "Culinary School", 
                    "Learn new skills while meeting food enthusiasts", 6, "medium",
                    tags={"cooking", "learning", "social", "hands-on"}),
            Activity("Wine Tasting Event", ActivityType.SOCIAL, 2.0, 65, "Wine Bar", 
                    "Sophisticated social networking opportunity", 7, "low",
                    tags={"wine", "sophisticated", "social", "evening"}),
            Activity("Photography Walk", ActivityType.CREATIVE, 2.0, 0, "Toronto Waterfront", 
                    "Creative exploration and potential photo opportunities", 4, "medium",
                    tags={"photography", "outdoor", "creative", "walking"}, weather_dependent=True, indoor=False),
            Activity("Fashion Show", ActivityType.PROFESSIONAL, 3.0, 75, "Fashion District", 
                    "Industry event for networking and inspiration", 8, "high", "weekend",
                    tags={"fashion", "professional", "show", "industry"}),
            Activity("Art Workshop", ActivityType.CREATIVE, 3.0, 95, "Art Studio", 
                    "Hands-on creative experience with other artists", 6, "medium",
                    tags={"art", "workshop", "creative", "hands-on"}),
            Activity("Rooftop Networking", ActivityType.PROFESSIONAL, 2.0, 40, "Rooftop Bar", 
                    "Casual professional networking with city views", 7, "medium",
                    tags={"networking", "rooftop", "professional", "evening"}),
            Activity("Fashion Styling Workshop", ActivityType.PROFESSIONAL, 2.5, 120, "Fashion Institute", 
                    "Professional development and industry connections", 8, "high",
                    tags={"fashion", "styling", "professional", "workshop"}),
            Activity("Cultural Festival", ActivityType.CULTURAL, 4.0, 30, "Various Locations", 
                    "Immerse in Toronto's diverse cultural scene", 5, "high", "weekend",
                    tags={"cultural", "festival", "outdoor", "diverse"}, weather_dependent=True, indoor=False),
            
            # Fitness & Active
            Activity("Morning Run", ActivityType.FITNESS, 1.0, 0, "High Park", 
                    "Energizing run through beautiful park", 2, "high",
                    tags={"running", "outdoor", "fitness", "morning"}, weather_dependent=True, indoor=False),
            Activity("Pilates Class", ActivityType.FITNESS, 1.0, 35, "Studio", 
                    "Core strengthening and flexibility", 3, "medium",
                    tags={"pilates", "fitness", "studio", "core"}),
            Activity("Tennis Match", ActivityType.FITNESS, 1.5, 25, "Tennis Club", 
                    "Active social sport with potential for new connections", 5, "high",
                    tags={"tennis", "sport", "social", "competitive"}, weather_dependent=True, indoor=False),
            Activity("Rock Climbing", ActivityType.FITNESS, 2.0, 45, "Climbing Gym", 
                    "Adventure sport with supportive community", 4, "high",
                    tags={"climbing", "adventure", "fitness", "community"}),
            Activity("Dance Class", ActivityType.FITNESS, 1.5, 40, "Dance Studio", 
                    "Fun fitness with social interaction", 6, "high",
                    tags={"dance", "fitness", "social", "fun"}),
            
            # Evening Activities
            Activity("Theater Performance", ActivityType.CULTURAL, 3.0, 85, "Theater District", 
                    "Cultural evening with potential for sophisticated networking", 6, "low",
                    tags={"theater", "cultural", "evening", "sophisticated"}),
            Activity("Jazz Club", ActivityType.SOCIAL, 2.0, 35, "Jazz District", 
                    "Intimate social setting for deeper connections", 5, "low",
                    tags={"jazz", "music", "intimate", "evening"}),
            Activity("Comedy Show", ActivityType.SOCIAL, 2.0, 25, "Comedy Club", 
                    "Light social activity for laughter and bonding", 4, "low",
                    tags={"comedy", "entertainment", "social", "fun"}),
            Activity("Rooftop Dinner", ActivityType.SOCIAL, 2.5, 120, "Rooftop Restaurant", 
                    "Romantic dinner with city views", 3, "low",
                    tags={"dinner", "romantic", "rooftop", "restaurant"}),
            
            # Evening Routines - Structured Wind-Down Process (45 minutes total)
            Activity("Decompression & Connection", ActivityType.EVENING_ROUTINE, 0.5, 0, "Home", 
                    "Device-free conversation about your day, challenges, and future plans. Quick check of tomorrow's to-do lists and pack gym bag", 0, "low",
                    tags={"connection", "conversation", "decompression", "couple", "device-free", "preparation"}),
            Activity("Final Wind-Down & Bed", ActivityType.EVENING_ROUTINE, 0.25, 0, "Home", 
                    "Transition to rest mode: dim lights, cool bedroom, read or meditate. Be fully settled and ready for sleep by 10:30 PM", 0, "low",
                    tags={"bedtime", "rest", "meditation", "reading", "sleep-preparation"}),
            
            # Alternative Evening Routines (for variety)
            Activity("Wind-down Reading", ActivityType.EVENING_ROUTINE, 0.5, 0, "Home", 
                    "Relaxing reading before bed", 0, "low",
                    tags={"reading", "home", "relaxing", "personal"}),
            Activity("Evening Reflection", ActivityType.EVENING_ROUTINE, 0.5, 0, "Home", 
                    "Gratitude practice and day review", 0, "low",
                    tags={"reflection", "gratitude", "home", "personal"}),
            Activity("Couple's Meditation", ActivityType.EVENING_ROUTINE, 0.5, 0, "Home", 
                    "Shared mindfulness practice", 0, "low",
                    tags={"meditation", "couple", "home", "mindfulness"}),
        ]
        
        return activities
    
    def generate_itinerary(self, start_date: str, duration: str, 
                          specific_activities: Optional[List[Dict]] = None) -> Dict:
        """
        Generate personalized itinerary based on duration and requirements
        
        Args:
            start_date: Start date in YYYY-MM-DD format
            duration: "2 weeks", "1 month", "3 months", or "6 months"
            specific_activities: List of activities with specific dates/times
        
        Returns:
            Dictionary containing formatted itinerary
        """
        start_dt = datetime.datetime.strptime(start_date, "%Y-%m-%d")
        
        # Acknowledge and set scope
        acknowledgment = self._generate_acknowledgment(start_date, duration)
        
        if duration in ["2 weeks", "1 month"]:
            itinerary = self._generate_detailed_itinerary(start_dt, duration, specific_activities)
        else:
            itinerary = self._generate_roadmap(start_dt, duration)
        
        summary_table = self._generate_summary_table(itinerary, duration)
        
        return {
            "acknowledgment": acknowledgment,
            "itinerary": itinerary,
            "summary_table": summary_table
        }
    
    def _generate_acknowledgment(self, start_date: str, duration: str) -> str:
        """Generate acknowledgment and scope setting"""
        return f"""
🎯 **The Toronto Life Planner - Ready to Expand Your Network!**

**Date Range:** {start_date} for {duration}
**Target:** Building new social and professional circles in Toronto
**Focus:** Aggressive network expansion while maintaining lifestyle consistency

I'll create a personalized itinerary tailored to both you and your husband's shared and individual goals. 
Each day will include intentional morning routines, purposeful activities, and relaxing evening routines 
to ensure you're in bed by 10:30 PM.

Let's build those connections! 🚀
        """.strip()
    
    def _generate_detailed_itinerary(self, start_dt: datetime.datetime, 
                                   duration: str, specific_activities: Optional[List[Dict]]) -> Dict:
        """Generate detailed daily itinerary"""
        days = 14 if duration == "2 weeks" else 30
        
        itinerary = {}
        current_date = start_dt
        
        for day_num in range(1, days + 1):
            day_key = f"Day {day_num}: {current_date.strftime('%A, %B %d, %Y')}"
            
            # Check for specific activities on this date
            day_specific_activities = []
            if specific_activities:
                for activity in specific_activities:
                    if activity.get('date') == current_date.strftime('%Y-%m-%d'):
                        day_specific_activities.append(activity)
            
            # Generate day schedule
            day_schedule = self._generate_day_schedule(current_date, day_specific_activities)
            itinerary[day_key] = day_schedule
            
            current_date += datetime.timedelta(days=1)
        
        return itinerary
    
    def _generate_day_schedule(self, date: datetime.datetime, 
                             specific_activities: List[Dict]) -> List[TimeSlot]:
        """Generate detailed schedule for a single day with conflict resolution"""
        is_weekend = date.weekday() >= 5
        time_slots = []
        
        # Process specific activities first and integrate them
        scheduled_specific = self._process_specific_activities(specific_activities, is_weekend)
        
        # Structured Morning Routine (6:00 AM - 9:45 AM) - Based on 7 Habits of Highly Effective People
        # Phase 1: Be Proactive - Wake Up & Intention Setting (6:00 AM - 6:15 AM)
        wake_up_activity = Activity("Be Proactive - Wake Up & Intention", ActivityType.MORNING_ROUTINE, 0.25, 0, "Home", 
                "Wake up, drink water, and consciously choose your attitude and approach for the day", 0, "low",
                tags={"wake-up", "hydration", "proactive", "intention", "personal"})
        time_slots.append(TimeSlot("6:00 AM", "6:15 AM", wake_up_activity, 
                                  "Be proactive - start your day with intention and control"))
        
        # Phase 2: Begin with the End in Mind - Goal Visualization (6:15 AM - 6:45 AM)
        goal_activity = Activity("Begin with the End in Mind", ActivityType.MORNING_ROUTINE, 0.5, 0, "Home", 
                "Review personal mission statement, visualize daily goals, and align actions with long-term objectives", 0, "low",
                tags={"goals", "mission", "visualization", "planning", "personal"})
        time_slots.append(TimeSlot("6:15 AM", "6:45 AM", goal_activity, 
                                  "Begin with the end in mind - visualize your daily goals"))
        
        # Phase 3: Physical Exercise - Sharpen the Saw (6:45 AM - 7:15 AM)
        exercise_activity = Activity("Sharpen the Saw - Physical Exercise", ActivityType.MORNING_ROUTINE, 0.5, 0, "Home", 
                "30 minutes of exercise: yoga, stretching, or cardio to maintain physical health and energy", 0, "medium",
                tags={"fitness", "exercise", "wellness", "renewal", "physical"})
        time_slots.append(TimeSlot("6:45 AM", "7:15 AM", exercise_activity, 
                                  "Sharpen the saw - maintain your physical health"))
        
        # Phase 4: Personal Development - Continuous Learning (7:15 AM - 7:45 AM)
        learning_activity = Activity("Personal Development - Continuous Learning", ActivityType.MORNING_ROUTINE, 0.5, 0, "Home", 
                "Read industry news, listen to educational content, or study to enhance skills and knowledge", 2, "low",
                tags={"learning", "development", "education", "growth", "professional"})
        time_slots.append(TimeSlot("7:15 AM", "7:45 AM", learning_activity, 
                                  "Invest in continuous learning and personal development"))
        
        # Phase 5: Family Time & Breakfast - Relationship Building (7:45 AM - 8:15 AM)
        family_activity = Activity("Family Time & Breakfast", ActivityType.MORNING_ROUTINE, 0.5, 10, "Home", 
                "Enjoy breakfast together, strengthen relationships, and start the day with positive interactions", 0, "low",
                tags={"family", "breakfast", "relationships", "connection", "personal"})
        time_slots.append(TimeSlot("7:45 AM", "8:15 AM", family_activity, 
                                  "Strengthen relationships and enjoy quality time together"))
        
        # Phase 6: Put First Things First - Priority Planning (8:15 AM - 8:45 AM)
        priority_activity = Activity("Put First Things First - Priority Planning", ActivityType.MORNING_ROUTINE, 0.5, 0, "Home", 
                "Identify urgent vs important tasks, prioritize high-impact activities, and plan your day strategically", 0, "low",
                tags={"priorities", "planning", "organization", "focus", "professional"})
        time_slots.append(TimeSlot("8:15 AM", "8:45 AM", priority_activity, 
                                  "Put first things first - prioritize your most important tasks"))
        
        # Phase 7: Think Win-Win - Collaborative Preparation (8:45 AM - 9:15 AM)
        collaboration_activity = Activity("Think Win-Win - Collaborative Preparation", ActivityType.MORNING_ROUTINE, 0.5, 0, "Home", 
                "Plan collaborative efforts, consider mutual benefits, and prepare for win-win interactions", 0, "low",
                tags={"collaboration", "win-win", "cooperation", "networking", "professional"})
        time_slots.append(TimeSlot("8:45 AM", "9:15 AM", collaboration_activity, 
                                  "Think win-win - prepare for collaborative and mutually beneficial interactions"))
        
        # Phase 8: Seek First to Understand - Communication Prep (9:15 AM - 9:30 AM)
        communication_activity = Activity("Seek First to Understand - Communication Prep", ActivityType.MORNING_ROUTINE, 0.25, 0, "Home", 
                "Prepare for communications by considering others' perspectives, review meeting agendas, and enhance empathy", 2, "low",
                tags={"communication", "empathy", "understanding", "perspective", "professional"})
        time_slots.append(TimeSlot("9:15 AM", "9:30 AM", communication_activity, 
                                  "Seek first to understand - prepare for effective communication"))
        
        # Phase 9: Quick Commute & Industry News (9:30 AM - 9:40 AM) - 10 minutes
        commute_activity = Activity("Quick Commute & Industry News", ActivityType.MORNING_ROUTINE, 0.17, 0, "Transit", 
                "10-minute commute while catching up on fashion industry news and trends", 2, "low",
                tags={"commute", "industry", "news", "professional", "quick"})
        time_slots.append(TimeSlot("9:30 AM", "9:40 AM", commute_activity, 
                                  "Quick commute while catching up on industry news"))
        
        # Phase 10: Work Arrival & Setup (9:40 AM - 9:45 AM) - 5 minutes
        arrival_activity = Activity("Work Arrival & Setup", ActivityType.MORNING_ROUTINE, 0.08, 0, "Office", 
                "Arrive at work, settle in, and prepare for the day's activities", 0, "low",
                tags={"work", "arrival", "setup", "professional", "office"})
        time_slots.append(TimeSlot("9:40 AM", "9:45 AM", arrival_activity, 
                                  "Arrive at work and prepare for the day"))
        
        # Main Activity (10:00 AM - 12:00 PM or 2:00 PM)
        if not self._has_activity_at_time(scheduled_specific, "10:00 AM", "12:00 PM"):
            main_activity = self._select_main_activity(is_weekend, specific_activities)
            end_time = "12:00 PM" if main_activity.duration_hours <= 2 else "2:00 PM"
            time_slots.append(TimeSlot("10:00 AM", end_time, main_activity, 
                                      "Primary networking and social activity"))
            
            # Lunch Break (12:00 PM - 1:00 PM) if needed
            if main_activity.duration_hours > 2 and not self._has_activity_at_time(scheduled_specific, "12:00 PM", "1:00 PM"):
                time_slots.append(TimeSlot("12:00 PM", "1:00 PM", 
                                          Activity("Lunch Break", ActivityType.BREAKFAST, 1.0, 20, "Restaurant", 
                                                  "Quick lunch to refuel", 2, "low"), 
                                          "Quick refuel"))
        
        # Afternoon Activity (1:00 PM - 4:00 PM or 2:00 PM - 5:00 PM)
        if not self._has_activity_at_time(scheduled_specific, "1:00 PM", "4:00 PM"):
            afternoon_activity = self._select_activity(ActivityType.SOCIAL, is_weekend, min_networking=4)
            start_time = "1:00 PM" if main_activity.duration_hours <= 2 else "2:00 PM"
            end_time = "4:00 PM" if main_activity.duration_hours <= 2 else "5:00 PM"
            time_slots.append(TimeSlot(start_time, end_time, afternoon_activity, 
                                      "Continue building connections"))
        
        # Dinner (6:00 PM - 8:00 PM)
        if not self._has_activity_at_time(scheduled_specific, "6:00 PM", "8:00 PM"):
            dinner_activity = self._select_activity(ActivityType.SOCIAL, is_weekend, min_networking=3)
            time_slots.append(TimeSlot("6:00 PM", "8:00 PM", dinner_activity, 
                                      "Social dinner with networking potential"))
        
        # Structured Evening Wind-Down Routine (9:45 PM - 10:30 PM) - Based on 7 Habits of Highly Effective People
        if not self._has_activity_at_time(scheduled_specific, "9:45 PM", "10:30 PM"):
            # Phase 1: Seek First to Understand - Daily Reflection (9:45 PM - 10:00 PM) - 15 minutes
            reflection_activity = Activity("Seek First to Understand - Daily Reflection", ActivityType.EVENING_ROUTINE, 0.25, 0, "Home", 
                    "Reflect on daily interactions, assess listening skills, and consider others' perspectives from today", 0, "low",
                    tags={"reflection", "understanding", "empathy", "communication", "personal"})
            time_slots.append(TimeSlot("9:45 PM", "10:00 PM", reflection_activity, 
                                      "Seek first to understand - reflect on daily interactions and communication"))
            
            # Phase 2: Think Win-Win - Relationship Review (10:00 PM - 10:15 PM) - 15 minutes
            relationship_activity = Activity("Think Win-Win - Relationship Review", ActivityType.EVENING_ROUTINE, 0.25, 0, "Home", 
                    "Review relationships and collaborations, identify win-win opportunities, and plan for mutual benefits", 0, "low",
                    tags={"relationships", "win-win", "collaboration", "connection", "personal"})
            time_slots.append(TimeSlot("10:00 PM", "10:15 PM", relationship_activity, 
                                      "Think win-win - review relationships and plan for mutual benefits"))
            
            # Phase 3: Sharpen the Saw - Renewal & Rest (10:15 PM - 10:30 PM) - 15 minutes
            renewal_activity = Activity("Sharpen the Saw - Renewal & Rest", ActivityType.EVENING_ROUTINE, 0.25, 0, "Home", 
                    "Engage in relaxing activities, practice gratitude, and prepare for restorative sleep", 0, "low",
                    tags={"renewal", "rest", "gratitude", "relaxation", "personal"})
            time_slots.append(TimeSlot("10:15 PM", "10:30 PM", renewal_activity, 
                                      "Sharpen the saw - renew yourself for tomorrow"))
        
        # Add specific activities and merge with generated schedule
        time_slots.extend(scheduled_specific)
        
        # Sort by start time and resolve any remaining conflicts
        time_slots.sort(key=lambda x: self._time_to_minutes(x.start_time))
        
        # Ensure morning routine is preserved and other activities start after 9:45 AM
        morning_routine_slots = [slot for slot in time_slots if self._time_to_minutes(slot.start_time) < self._time_to_minutes("9:45 AM")]
        other_slots = [slot for slot in time_slots if self._time_to_minutes(slot.start_time) >= self._time_to_minutes("9:45 AM")]
        
        # Rebuild time_slots with morning routine first, then other activities
        time_slots = morning_routine_slots + other_slots
        
        return time_slots
    
    def _select_activity(self, activity_type: ActivityType, is_weekend: bool, 
                        exclude_used: bool = True, min_networking: int = 0, 
                        preferred_tags: Set[str] = None) -> Activity:
        """Optimized activity selection with smart filtering and repetition avoidance"""
        # Filter by type, day preference, and weather
        available_activities = [
            a for a in self.activities_db 
            if a.activity_type == activity_type and 
            (a.day_preference is None or 
             (is_weekend and a.day_preference == "weekend") or
             (not is_weekend and a.day_preference == "weekday")) and
            a.social_networking_potential >= min_networking and
            self._is_weather_appropriate(a)
        ]
        
        # If preferred tags are specified, prioritize activities with those tags
        if preferred_tags:
            preferred_activities = [a for a in available_activities if preferred_tags.intersection(a.tags)]
            if preferred_activities:
                available_activities = preferred_activities
        
        if not available_activities:
            # Fallback to any activity of the type
            available_activities = [a for a in self.activities_db if a.activity_type == activity_type]
        
        if exclude_used:
            # Remove recently used activities
            available_activities = [a for a in available_activities if a.name not in self.used_activities]
        
        if not available_activities:
            # If still no activities, allow previously used ones
            available_activities = [a for a in self.activities_db if a.activity_type == activity_type]
        
        # Smart selection: prefer activities with lower usage count
        available_activities.sort(key=lambda x: (x.usage_count, -x.social_networking_potential))
        
        # Select from top 3 options to add some randomness while being smart
        selected = random.choice(available_activities[:min(3, len(available_activities))])
        
        # Update usage tracking
        self.used_activities.add(selected.name)
        self.activity_usage_count[selected.name] += 1
        selected.usage_count += 1
        selected.last_used = datetime.datetime.now()
        
        return selected
    
    def _is_weather_appropriate(self, activity: Activity) -> bool:
        """Check if activity is appropriate for current weather conditions"""
        if not activity.weather_dependent:
            return True
        
        # Simple weather logic - in a real implementation, you'd integrate with weather API
        if self.weather_conditions == "rainy" and not activity.indoor:
            return False
        if self.weather_conditions == "snowy" and not activity.indoor:
            return False
        
        return True
    
    def set_weather_conditions(self, conditions: str):
        """Set current weather conditions for activity filtering"""
        self.weather_conditions = conditions.lower()
    
    def _select_main_activity(self, is_weekend: bool, specific_activities: List[Dict]) -> Activity:
        """Select main activity for the day, prioritizing specific activities and high networking potential"""
        if specific_activities:
            # Use specific activity if provided
            specific = specific_activities[0]
            activity = Activity(
                name=specific.get('name', 'Custom Activity'),
                activity_type=ActivityType.SOCIAL,
                duration_hours=specific.get('duration', 2.0),
                cost_cad=specific.get('cost', 50),
                location=specific.get('location', 'Toronto'),
                description=specific.get('description', 'Custom activity'),
                social_networking_potential=specific.get('networking_potential', 5),
                energy_level=specific.get('energy_level', 'medium'),
                tags=set(specific.get('tags', []))
            )
            # Mark as specific activity for tracking
            activity.last_used = datetime.datetime.now()
            return activity
        
        # Select high networking potential activity with smart filtering
        return self._select_activity(ActivityType.SOCIAL, is_weekend, 
                                   exclude_used=True, min_networking=6)
    
    def _process_specific_activities(self, specific_activities: List[Dict], is_weekend: bool) -> List[TimeSlot]:
        """Process user-specified activities and convert to TimeSlots"""
        time_slots = []
        for activity in specific_activities:
            activity_obj = Activity(
                name=activity.get('name', 'Custom Activity'),
                activity_type=ActivityType.SOCIAL,
                duration_hours=activity.get('duration', 2.0),
                cost_cad=activity.get('cost', 50),
                location=activity.get('location', 'Toronto'),
                description=activity.get('description', 'Custom activity'),
                social_networking_potential=activity.get('networking_potential', 5),
                energy_level=activity.get('energy_level', 'medium'),
                tags=set(activity.get('tags', []))
            )
            
            start_time = activity.get('start_time', '10:00 AM')
            end_time = self._calculate_end_time(start_time, activity_obj.duration_hours)
            
            time_slot = TimeSlot(
                start_time=start_time,
                end_time=end_time,
                activity=activity_obj,
                notes=f"🎯 Priority Activity: {activity_obj.description}",
                is_specific_activity=True
            )
            time_slots.append(time_slot)
        
        return time_slots
    
    def _has_activity_at_time(self, time_slots: List[TimeSlot], start_time: str, end_time: str) -> bool:
        """Check if there's already an activity scheduled during the given time"""
        start_minutes = self._time_to_minutes(start_time)
        end_minutes = self._time_to_minutes(end_time)
        
        for slot in time_slots:
            slot_start = self._time_to_minutes(slot.start_time)
            slot_end = self._time_to_minutes(slot.end_time)
            
            # Check for overlap
            if not (end_minutes <= slot_start or start_minutes >= slot_end):
                return True
        
        return False
    
    def _time_to_minutes(self, time_str: str) -> int:
        """Convert time string to minutes since midnight"""
        time_str = time_str.replace(" AM", "").replace(" PM", "")
        hour, minute = map(int, time_str.split(":"))
        
        if "PM" in time_str and hour != 12:
            hour += 12
        elif "AM" in time_str and hour == 12:
            hour = 0
        
        return hour * 60 + minute
    
    def _calculate_end_time(self, start_time: str, duration_hours: float) -> str:
        """Calculate end time based on start time and duration"""
        start_minutes = self._time_to_minutes(start_time)
        end_minutes = start_minutes + int(duration_hours * 60)
        
        hour = end_minutes // 60
        minute = end_minutes % 60
        
        period = "AM" if hour < 12 else "PM"
        if hour > 12:
            hour -= 12
        elif hour == 0:
            hour = 12
        
        return f"{hour}:{minute:02d} {period}"
    
    def _resolve_time_conflicts(self, time_slots: List[TimeSlot]) -> List[TimeSlot]:
        """Resolve any remaining time conflicts by adjusting times"""
        if len(time_slots) <= 1:
            return time_slots
        
        resolved_slots = [time_slots[0]]
        
        for i in range(1, len(time_slots)):
            current_slot = time_slots[i]
            prev_slot = resolved_slots[-1]
            
            current_start = self._time_to_minutes(current_slot.start_time)
            prev_end = self._time_to_minutes(prev_slot.end_time)
            
            # If there's a conflict, adjust the current slot's start time
            if current_start < prev_end:
                # Move current slot to start after previous slot ends
                new_start_minutes = prev_end + 15  # Add 15-minute buffer
                new_start_hour = new_start_minutes // 60
                new_start_minute = new_start_minutes % 60
                
                period = "AM" if new_start_hour < 12 else "PM"
                if new_start_hour > 12:
                    new_start_hour -= 12
                elif new_start_hour == 0:
                    new_start_hour = 12
                
                current_slot.start_time = f"{new_start_hour}:{new_start_minute:02d} {period}"
                current_slot.end_time = self._calculate_end_time(current_slot.start_time, current_slot.activity.duration_hours)
            
            resolved_slots.append(current_slot)
        
        return resolved_slots
    
    def reset_planner(self):
        """Reset the planner state to start fresh"""
        self.used_activities.clear()
        self.activity_usage_count.clear()
        for activity in self.activities_db:
            activity.last_used = None
            activity.usage_count = 0
    
    def get_activity_stats(self) -> Dict:
        """Get statistics about activity usage"""
        total_activities = len(self.activities_db)
        used_activities = len(self.used_activities)
        most_used = max(self.activity_usage_count.items(), key=lambda x: x[1]) if self.activity_usage_count else ("None", 0)
        
        return {
            "total_activities": total_activities,
            "used_activities": used_activities,
            "most_used_activity": most_used[0],
            "most_used_count": most_used[1],
            "usage_percentage": (used_activities / total_activities) * 100
        }
    
    def suggest_creative_activity(self, theme: str = None) -> str:
        """Suggest a creative weekly activity not in the main list"""
        creative_suggestions = [
            "Visit a hidden speakeasy in the Entertainment District",
            "Attend a silent disco at a local park",
            "Join a flash mob dance group",
            "Explore Toronto's underground PATH system",
            "Visit a rooftop farm in the city",
            "Attend a midnight movie screening",
            "Join a city-wide scavenger hunt",
            "Visit a pop-up art installation",
            "Attend a themed costume party",
            "Explore a new neighborhood by bike",
            "Join a local book club meeting",
            "Attend a live podcast recording",
            "Visit a vintage clothing market",
            "Join a community garden project",
            "Attend a local comedy open mic"
        ]
        
        if theme:
            themed_suggestions = {
                "art": "Visit a hidden speakeasy in the Entertainment District",
                "fitness": "Join a flash mob dance group",
                "social": "Attend a themed costume party",
                "cultural": "Explore Toronto's underground PATH system",
                "professional": "Attend a live podcast recording"
            }
            return themed_suggestions.get(theme.lower(), random.choice(creative_suggestions))
        
        return random.choice(creative_suggestions)
    
    def _generate_roadmap(self, start_dt: datetime.datetime, duration: str) -> Dict:
        """Generate high-level roadmap for longer durations"""
        months = 3 if duration == "3 months" else 6
        roadmap = {}
        
        for month in range(months):
            month_date = start_dt + datetime.timedelta(days=30 * month)
            theme = self.weekly_themes[month % len(self.weekly_themes)]
            
            roadmap[f"Month {month + 1}: {theme}"] = {
                "focus": theme,
                "key_activities": self._get_theme_activities(theme),
                "networking_goals": f"Build {5 + month * 2} new meaningful connections",
                "monthly_highlight": self._get_monthly_highlight(theme),
                "creative_suggestion": self.suggest_creative_activity(theme.lower().split()[0])
            }
        
        return roadmap
    
    def _get_theme_activities(self, theme: str) -> List[str]:
        """Get activities that fit the monthly theme"""
        theme_activities = {
            "Creative Immersion": ["Art workshops", "Gallery openings", "Photography walks", "Creative writing groups"],
            "Social & Active Push": ["Fitness classes", "Sports leagues", "Outdoor adventures", "Group activities"],
            "Professional Networking": ["Industry events", "Professional mixers", "Conferences", "Workshops"],
            "Cultural Exploration": ["Museums", "Cultural festivals", "Theater shows", "Cultural tours"],
            "Fitness & Wellness": ["Yoga retreats", "Fitness challenges", "Wellness workshops", "Active adventures"],
            "Culinary Adventures": ["Cooking classes", "Food tours", "Wine tastings", "Restaurant explorations"],
            "Art & Fashion": ["Fashion shows", "Art exhibitions", "Styling workshops", "Design events"]
        }
        return theme_activities.get(theme, ["Social events", "Networking opportunities"])
    
    def _get_monthly_highlight(self, theme: str) -> str:
        """Get creative monthly highlight suggestion"""
        highlights = {
            "Creative Immersion": "Discover a hidden art studio in Kensington Market",
            "Social & Active Push": "Join a new sports league or fitness challenge",
            "Professional Networking": "Host your own industry networking event",
            "Cultural Exploration": "Attend a cultural festival you've never been to",
            "Fitness & Wellness": "Try a new wellness practice or retreat",
            "Culinary Adventures": "Explore a new cuisine or cooking technique",
            "Art & Fashion": "Collaborate on a creative project with new connections"
        }
        return highlights.get(theme, "Try something completely new and unexpected")
    
    def _generate_summary_table(self, itinerary: Dict, duration: str) -> str:
        """Generate summary table for easy reading"""
        if duration in ["3 months", "6 months"]:
            return self._generate_roadmap_table(itinerary)
        else:
            return self._generate_daily_summary_table(itinerary)
    
    def _generate_daily_summary_table(self, itinerary: Dict) -> str:
        """Generate daily summary table"""
        table = "## 📊 **Weekly Summary Table**\n\n"
        table += "| Day | Date | Morning | Main Activity | Evening | Total Cost | Networking Score |\n"
        table += "|-----|------|---------|---------------|---------|------------|------------------|\n"
        
        for day_key, time_slots in itinerary.items():
            if isinstance(time_slots, list):
                morning = time_slots[0].activity.name if time_slots else "N/A"
                main_activity = time_slots[2].activity.name if len(time_slots) > 2 else "N/A"
                evening = time_slots[-1].activity.name if time_slots else "N/A"
                
                total_cost = sum(slot.activity.cost_cad for slot in time_slots)
                networking_score = max(slot.activity.social_networking_potential for slot in time_slots)
                
                date_str = day_key.split(": ")[1] if ": " in day_key else day_key
                table += f"| {day_key.split(':')[0]} | {date_str} | {morning} | {main_activity} | {evening} | ${total_cost:.0f} | {networking_score}/10 |\n"
        
        return table
    
    def _generate_roadmap_table(self, roadmap: Dict) -> str:
        """Generate roadmap summary table"""
        table = "## 🗺️ **Monthly Roadmap Summary**\n\n"
        table += "| Month | Theme | Focus Areas | Networking Goal | Monthly Highlight | Creative Suggestion |\n"
        table += "|-------|-------|-------------|-----------------|------------------|-------------------|\n"
        
        for month_key, details in roadmap.items():
            if isinstance(details, dict):
                theme = details.get('focus', 'General')
                activities = ', '.join(details.get('key_activities', [])[:3])
                goal = details.get('networking_goals', 'Build connections')
                highlight = details.get('monthly_highlight', 'Try something new')
                creative = details.get('creative_suggestion', 'Explore something new')
                
                table += f"| {month_key} | {theme} | {activities} | {goal} | {highlight} | {creative} |\n"
        
        return table


def main():
    """Main function to demonstrate the optimized Toronto Life Planner"""
    planner = TorontoLifePlanner()
    
    # Set weather conditions for better activity selection
    planner.set_weather_conditions("sunny")
    
    # Example usage with specific activities
    start_date = "2024-01-15"
    duration = "2 weeks"
    
    # Example specific activities to integrate
    specific_activities = [
        {
            "date": "2024-01-16",
            "name": "Fashion Week Event",
            "start_time": "2:00 PM",
            "duration": 3.0,
            "cost": 100,
            "location": "Fashion District",
            "description": "Exclusive fashion week networking event",
            "networking_potential": 9,
            "energy_level": "high",
            "tags": ["fashion", "networking", "exclusive"]
        }
    ]
    
    result = planner.generate_itinerary(start_date, duration, specific_activities)
    
    print(result["acknowledgment"])
    print("\n" + "="*50 + "\n")
    
    for day, schedule in result["itinerary"].items():
        print(f"## {day}")
        print()
        for slot in schedule:
            priority_marker = "🎯" if slot.is_specific_activity else "📅"
            print(f"{priority_marker} **{slot.start_time} - {slot.end_time}:** {slot.activity.name}")
            print(f"   💰 Cost: ${slot.activity.cost_cad:.0f} CAD")
            print(f"   📍 Location: {slot.activity.location}")
            print(f"   🌟 Networking Potential: {slot.activity.social_networking_potential}/10")
            print(f"   🏷️ Tags: {', '.join(slot.activity.tags) if slot.activity.tags else 'General'}")
            print(f"   📝 Notes: {slot.notes}")
            print()
        print("-" * 50)
        print()
    
    print(result["summary_table"])
    
    # Show activity statistics
    print("\n" + "="*50)
    print("## 📊 **Activity Usage Statistics**")
    stats = planner.get_activity_stats()
    print(f"Total Activities Available: {stats['total_activities']}")
    print(f"Activities Used: {stats['used_activities']} ({stats['usage_percentage']:.1f}%)")
    print(f"Most Used Activity: {stats['most_used_activity']} ({stats['most_used_count']} times)")
    
    # Show creative suggestions
    print("\n" + "="*50)
    print("## 🎨 **Creative Weekly Suggestions**")
    for theme in ["art", "fitness", "social", "cultural", "professional"]:
        suggestion = planner.suggest_creative_activity(theme)
        print(f"**{theme.title()} Theme:** {suggestion}")


if __name__ == "__main__":
    main()
