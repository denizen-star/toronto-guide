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
        self.user_name = "Kevin"
        self.partner_name = "Peter"
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
        
        # Core Schedule Requirements Integration
        self.core_requirements = self._initialize_core_requirements()
        self.meditation_intentions = [
            "Stress relief", "Focus/concentration", "Gratitude", "Self-compassion",
            "Goal setting", "Sleep preparation", "Energy/awakening"
        ]
        self.meditation_week = 0  # Track meditation progression
        self.entertainment_cycle = 0  # Track comedy/show/play alternation
    
    def _initialize_core_requirements(self) -> Dict:
        """Initialize Core Schedule Requirements"""
        return {
            "comedy_show": {"frequency": "every_two_months", "last_scheduled": None},
            "show_play": {"frequency": "every_two_months", "last_scheduled": None},
            "drag_show": {"frequency": "monthly", "last_scheduled": None},
            "meditation": {
                "progression": {
                    "weeks_1_4": 1,  # 1x per week
                    "weeks_5_8": 2,  # 2x per week
                    "weeks_9_12": 3,  # 3x per week
                    "weeks_13_16": 4,  # 4x per week
                    "weeks_17_plus": 5  # 5x per week
                },
                "current_week": 0
            },
            "immigration_work": {"hours_per_week": 3, "scheduled_hours": 0},
            "professional_development": {"hours_per_week": 5, "scheduled_hours": 0},
            "household_budgeting": {
                "weekly_hours": 1,
                "monthly_hours": 2.5,
                "weekly_scheduled": 0,
                "monthly_scheduled": 0
            },
            "work_hours": {
                "start": "9:00 AM",
                "end": "6:00 PM",
                "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
            },
            "commute": {
                "morning_duration": 10,  # minutes
                "evening_duration": 10,  # minutes
                "morning_start": "8:50 AM",
                "evening_start": "6:00 PM"
            },
            "running": {
                "schedule": {
                    "Tuesday": {"duration": 60, "time_preference": "flexible"},
                    "Thursday": {"duration": 60, "time_preference": "flexible"},
                    "Friday": {"duration": 60, "time_preference": "flexible"},
                    "Sunday": {"duration": 120, "time_preference": "flexible"}
                }
            },
            "swimming": {"frequency": "twice_per_month", "last_scheduled": None},
            "tennis": {"frequency": "twice_per_month", "last_scheduled": None},
            "no_breakfast": True,
            "laundry": {"frequency": "weekly", "preferred_day": "Sunday"},
            "grocery_shopping": {"frequency": "weekly", "preferred_day": "Saturday"},
            "personal_grooming": {
                "daily": ["shower", "skincare", "teeth_brushing", "deodorant"],
                "weekly": ["hair_washing_3x", "nail_trimming", "beard_trimming"],
                "bi_weekly": ["haircut_trim", "eyebrow_grooming"],
                "monthly": ["deep_skincare", "hair_styling", "wardrobe_organization"]
            },
            "no_morning_news": True
        }
    
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
            Activity("Morning Shower & Grooming", ActivityType.MORNING_ROUTINE, 0.5, 0, "Home", 
                    "Morning shower, skincare routine, and personal grooming to start the day fresh", 0, "low",
                    tags={"grooming", "shower", "home", "personal-care", "morning"}),
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
            
            # Evening Routines - Structured Wind-Down Process (60 minutes total)
            Activity("Decompression & Connection", ActivityType.EVENING_ROUTINE, 0.5, 0, "Home", 
                    "Device-free conversation about your day, challenges, and future plans. Quick check of tomorrow's to-do lists and pack gym bag", 0, "low",
                    tags={"connection", "conversation", "decompression", "couple", "device-free", "preparation"}),
            Activity("Evening Shower & Face Routine", ActivityType.EVENING_ROUTINE, 0.25, 0, "Home", 
                    "Evening shower, complete face cleansing routine, skincare, and personal grooming before bed", 0, "low",
                    tags={"shower", "face-routine", "skincare", "grooming", "personal-care", "bedtime", "evening"}),
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
    
    def _get_meditation_frequency(self, week_number: int) -> int:
        """Get meditation frequency based on week number"""
        if week_number <= 4:
            return 1
        elif week_number <= 8:
            return 2
        elif week_number <= 12:
            return 3
        elif week_number <= 16:
            return 4
        else:
            return 5
    
    def _get_meditation_intention(self, week_number: int, session_number: int) -> str:
        """Get meditation intention based on week and session"""
        intention_index = (week_number - 1 + session_number - 1) % len(self.meditation_intentions)
        return self.meditation_intentions[intention_index]
    
    def _should_schedule_entertainment(self, date: datetime.datetime, entertainment_type: str) -> bool:
        """Check if entertainment should be scheduled based on frequency"""
        if entertainment_type == "drag_show":
            # Monthly - first Sunday of each month
            return date.weekday() == 6 and date.day <= 7
        elif entertainment_type in ["comedy_show", "show_play"]:
            # Every two months, alternating
            month = date.month
            if entertainment_type == "comedy_show":
                return month % 2 == 1  # Odd months
            else:
                return month % 2 == 0  # Even months
        return False
    
    def _schedule_core_requirements(self, date: datetime.datetime, time_slots: List[TimeSlot]) -> List[TimeSlot]:
        """Schedule core requirements for a specific date"""
        week_number = ((date - datetime.datetime(2024, 1, 1)).days // 7) + 1
        
        # Schedule meditation based on progression
        meditation_freq = self._get_meditation_frequency(week_number)
        if meditation_freq >= 1 and date.weekday() == 0:  # Monday
            intention = self._get_meditation_intention(week_number, 1)
            meditation_activity = Activity(
                f"Meditation - {intention}", ActivityType.MORNING_ROUTINE, 0.5, 0, "Home",
                f"Meditation session focused on {intention.lower()}", 0, "low",
                tags={"meditation", "mindfulness", "personal", "core-requirement"}
            )
            time_slots.append(TimeSlot("6:30 AM", "7:00 AM", meditation_activity, 
                                      f"Core Requirement: Meditation - {intention}"))
        
        if meditation_freq >= 2 and date.weekday() == 2:  # Wednesday
            intention = self._get_meditation_intention(week_number, 2)
            meditation_activity = Activity(
                f"Meditation - {intention}", ActivityType.MORNING_ROUTINE, 0.5, 0, "Home",
                f"Meditation session focused on {intention.lower()}", 0, "low",
                tags={"meditation", "mindfulness", "personal", "core-requirement"}
            )
            time_slots.append(TimeSlot("6:30 AM", "7:00 AM", meditation_activity, 
                                      f"Core Requirement: Meditation - {intention}"))
        
        if meditation_freq >= 3 and date.weekday() == 4:  # Friday
            intention = self._get_meditation_intention(week_number, 3)
            meditation_activity = Activity(
                f"Meditation - {intention}", ActivityType.MORNING_ROUTINE, 0.5, 0, "Home",
                f"Meditation session focused on {intention.lower()}", 0, "low",
                tags={"meditation", "mindfulness", "personal", "core-requirement"}
            )
            time_slots.append(TimeSlot("6:30 AM", "7:00 AM", meditation_activity, 
                                      f"Core Requirement: Meditation - {intention}"))
        
        # Schedule entertainment
        if self._should_schedule_entertainment(date, "drag_show"):
            drag_activity = Activity(
                "Drag Show", ActivityType.SOCIAL, 2.0, 30, "Entertainment District",
                "Monthly drag show for entertainment and social connection", 4, "medium",
                tags={"drag-show", "entertainment", "social", "core-requirement"}
            )
            time_slots.append(TimeSlot("8:00 PM", "10:00 PM", drag_activity, 
                                      "Core Requirement: Monthly Drag Show"))
        
        elif self._should_schedule_entertainment(date, "comedy_show"):
            comedy_activity = Activity(
                "Comedy Show", ActivityType.SOCIAL, 2.0, 25, "Comedy Club",
                "Bi-monthly comedy show for entertainment and social connection", 4, "low",
                tags={"comedy", "entertainment", "social", "core-requirement"}
            )
            time_slots.append(TimeSlot("8:00 PM", "10:00 PM", comedy_activity, 
                                      "Core Requirement: Bi-monthly Comedy Show"))
        
        elif self._should_schedule_entertainment(date, "show_play"):
            show_activity = Activity(
                "Show/Play", ActivityType.CULTURAL, 3.0, 85, "Theater District",
                "Bi-monthly theater show for cultural enrichment", 6, "low",
                tags={"theater", "cultural", "entertainment", "core-requirement"}
            )
            time_slots.append(TimeSlot("7:00 PM", "10:00 PM", show_activity, 
                                      "Core Requirement: Bi-monthly Show/Play"))
        
        # Schedule work hours activities
        if date.weekday() < 5:  # Weekdays
            # Work hours (9:00 AM - 6:00 PM)
            work_activity = Activity(
                "Work Hours", ActivityType.PROFESSIONAL, 9.0, 0, "Office",
                "Regular work hours: 9:00 AM - 6:00 PM", 0, "medium",
                tags={"work", "core-requirement", "professional", "office"}
            )
            time_slots.append(TimeSlot("9:00 AM", "6:00 PM", work_activity, 
                                      "Core Requirement: Work Hours"))
            
            # Commute (10 minutes each way)
            morning_commute = Activity(
                "Morning Commute", ActivityType.MORNING_ROUTINE, 0.17, 0, "Transit",
                "10-minute commute to work", 0, "low",
                tags={"commute", "work", "core-requirement", "transit"}
            )
            time_slots.append(TimeSlot("8:50 AM", "9:00 AM", morning_commute, 
                                      "Core Requirement: Morning Commute"))
            
            evening_commute = Activity(
                "Evening Commute", ActivityType.EVENING_ROUTINE, 0.17, 0, "Transit",
                "10-minute commute from work", 0, "low",
                tags={"commute", "work", "core-requirement", "transit"}
            )
            time_slots.append(TimeSlot("6:00 PM", "6:10 PM", evening_commute, 
                                      "Core Requirement: Evening Commute"))
            
            # Immigration work (3 hours per week) - during work hours
            if date.weekday() in [1, 3]:  # Tuesday, Thursday
                immigration_activity = Activity(
                    "Immigration Application Work", ActivityType.PROFESSIONAL, 1.5, 0, "Office",
                    "Work on finalizing Canada immigration application", 0, "medium",
                    tags={"immigration", "work", "core-requirement", "professional"}
                )
                time_slots.append(TimeSlot("10:00 AM", "11:30 AM", immigration_activity, 
                                          "Core Requirement: Immigration Work"))
            
            # Professional development (5 hours per week) - during work hours
            if date.weekday() in [1, 3, 4]:  # Tuesday, Thursday, Friday
                dev_hours = 1.5 if date.weekday() == 4 else 1.0  # More time on Friday
                dev_activity = Activity(
                    "Professional Development", ActivityType.PROFESSIONAL, dev_hours, 20, "Office/Cafe",
                    "Training, 1:1 coffee meetings, career expansion techniques", 6, "medium",
                    tags={"professional-development", "work", "core-requirement", "networking"}
                )
                start_time = "2:00 PM" if date.weekday() == 4 else "1:00 PM"
                end_time = "3:30 PM" if date.weekday() == 4 else "2:00 PM"
                time_slots.append(TimeSlot(start_time, end_time, dev_activity, 
                                          "Core Requirement: Professional Development"))
        
        # Schedule fitness activities
        if date.weekday() in [1, 3, 4, 6]:  # Tuesday, Thursday, Friday, Sunday
            if date.weekday() == 6:  # Sunday - long run
                run_activity = Activity(
                    "Long Run", ActivityType.FITNESS, 2.0, 0, "Running Route",
                    "Sunday long run - 2+ hours", 0, "high",
                    tags={"running", "fitness", "core-requirement", "long-run"}
                )
                time_slots.append(TimeSlot("8:00 AM", "10:00 AM", run_activity, 
                                          "Core Requirement: Sunday Long Run"))
            else:  # Tuesday, Thursday, Friday - regular runs
                run_activity = Activity(
                    "Regular Run", ActivityType.FITNESS, 1.0, 0, "Running Route",
                    f"{date.strftime('%A')} run - 1+ hour", 0, "high",
                    tags={"running", "fitness", "core-requirement", "regular-run"}
                )
                time_slots.append(TimeSlot("7:00 AM", "8:00 AM", run_activity, 
                                          f"Core Requirement: {date.strftime('%A')} Run"))
        
        # Schedule swimming (twice per month)
        if self._should_schedule_monthly_activity(date, "swimming"):
            swim_activity = Activity(
                "Swimming", ActivityType.FITNESS, 1.0, 15, "Pool",
                "Swimming session - twice per month", 0, "medium",
                tags={"swimming", "fitness", "core-requirement", "pool"}
            )
            time_slots.append(TimeSlot("6:00 PM", "7:00 PM", swim_activity, 
                                      "Core Requirement: Swimming"))
        
        # Schedule tennis (twice per month)
        if self._should_schedule_monthly_activity(date, "tennis"):
            tennis_activity = Activity(
                "Tennis", ActivityType.FITNESS, 1.5, 25, "Tennis Club",
                "Tennis match - twice per month", 5, "high",
                tags={"tennis", "fitness", "core-requirement", "sport"}
            )
            time_slots.append(TimeSlot("6:00 PM", "7:30 PM", tennis_activity, 
                                      "Core Requirement: Tennis"))
        
        # Schedule household activities
        if date.weekday() == 5:  # Saturday
            # Grocery shopping
            grocery_activity = Activity(
                "Grocery Shopping", ActivityType.MORNING_ROUTINE, 1.0, 50, "Grocery Store",
                "Weekly grocery shopping and meal planning", 0, "low",
                tags={"grocery", "shopping", "core-requirement", "household"}
            )
            time_slots.append(TimeSlot("9:00 AM", "10:00 AM", grocery_activity, 
                                      "Core Requirement: Grocery Shopping"))
            
            # Household budgeting
            budget_activity = Activity(
                "Household Budgeting", ActivityType.MORNING_ROUTINE, 1.0, 0, "Home",
                "Weekly expense tracking and bill payments", 0, "low",
                tags={"budgeting", "finance", "core-requirement", "personal"}
            )
            time_slots.append(TimeSlot("10:00 AM", "11:00 AM", budget_activity, 
                                      "Core Requirement: Weekly Budgeting"))
        
        if date.weekday() == 6:  # Sunday
            # Laundry
            laundry_activity = Activity(
                "Laundry", ActivityType.MORNING_ROUTINE, 1.0, 0, "Home",
                "Weekly laundry and household maintenance", 0, "low",
                tags={"laundry", "household", "core-requirement", "maintenance"}
            )
            time_slots.append(TimeSlot("10:00 AM", "11:00 AM", laundry_activity, 
                                      "Core Requirement: Weekly Laundry"))
        
        # Monthly budget review with Peter
        if date.day <= 7 and date.weekday() == 5:  # First Saturday of month
            monthly_budget_activity = Activity(
                "Monthly Budget Review with Peter", ActivityType.SOCIAL, 2.5, 0, "Home",
                "Budget review, goal setting, and financial planning with partner", 0, "low",
                tags={"budgeting", "finance", "core-requirement", "couple", "planning"}
            )
            time_slots.append(TimeSlot("11:00 AM", "1:30 PM", monthly_budget_activity, 
                                      "Core Requirement: Monthly Budget Review"))
        
        # Schedule personal grooming
        self._schedule_personal_grooming(date, time_slots)
        
        return time_slots
    
    def _should_schedule_monthly_activity(self, date: datetime.datetime, activity_type: str) -> bool:
        """Check if monthly activity should be scheduled (twice per month)"""
        if activity_type in ["swimming", "tennis"]:
            # Schedule twice per month - 1st and 3rd week
            week_of_month = (date.day - 1) // 7 + 1
            return week_of_month in [1, 3]
        return False
    
    def _schedule_personal_grooming(self, date: datetime.datetime, time_slots: List[TimeSlot]) -> None:
        """Schedule personal grooming activities based on frequency"""
        # Daily grooming (integrated into morning routine)
        if date.weekday() < 5:  # Weekdays
            daily_grooming = Activity(
                "Daily Personal Grooming", ActivityType.MORNING_ROUTINE, 0.5, 0, "Home",
                "Daily: shower, skincare, teeth brushing, deodorant", 0, "low",
                tags={"grooming", "personal-care", "core-requirement", "daily"}
            )
            time_slots.append(TimeSlot("7:15 AM", "7:45 AM", daily_grooming, 
                                      "Core Requirement: Daily Grooming"))
        
        # Weekly grooming (Sundays)
        if date.weekday() == 6:  # Sunday
            weekly_grooming = Activity(
                "Weekly Personal Grooming", ActivityType.MORNING_ROUTINE, 1.0, 0, "Home",
                "Weekly: hair washing (3x), nail trimming, beard trimming", 0, "low",
                tags={"grooming", "personal-care", "core-requirement", "weekly"}
            )
            time_slots.append(TimeSlot("11:00 AM", "12:00 PM", weekly_grooming, 
                                      "Core Requirement: Weekly Grooming"))
        
        # Bi-weekly grooming (1st and 3rd Sunday of month)
        week_of_month = (date.day - 1) // 7 + 1
        if date.weekday() == 6 and week_of_month in [1, 3]:  # 1st or 3rd Sunday
            bi_weekly_grooming = Activity(
                "Bi-weekly Personal Grooming", ActivityType.MORNING_ROUTINE, 1.5, 30, "Salon/Home",
                "Bi-weekly: haircut/trim, eyebrow grooming", 0, "low",
                tags={"grooming", "personal-care", "core-requirement", "bi-weekly"}
            )
            time_slots.append(TimeSlot("2:00 PM", "3:30 PM", bi_weekly_grooming, 
                                      "Core Requirement: Bi-weekly Grooming"))
        
        # Monthly grooming (1st Sunday of month)
        if date.weekday() == 6 and date.day <= 7:  # First Sunday of month
            monthly_grooming = Activity(
                "Monthly Personal Grooming", ActivityType.MORNING_ROUTINE, 2.0, 50, "Home",
                "Monthly: deep skincare treatment, hair styling, wardrobe organization", 0, "low",
                tags={"grooming", "personal-care", "core-requirement", "monthly"}
            )
            time_slots.append(TimeSlot("4:00 PM", "6:00 PM", monthly_grooming, 
                                      "Core Requirement: Monthly Grooming"))
    
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
        
        # Phase 4: Morning Shower & Grooming (7:15 AM - 7:45 AM)
        morning_shower_activity = Activity("Morning Shower & Grooming", ActivityType.MORNING_ROUTINE, 0.5, 0, "Home", 
                "Morning shower, skincare routine, and personal grooming to start the day fresh", 0, "low",
                tags={"grooming", "shower", "home", "personal-care", "morning"})
        time_slots.append(TimeSlot("7:15 AM", "7:45 AM", morning_shower_activity, 
                                  "Morning shower and grooming to start the day fresh"))
        
        # Phase 5: Personal Development - Continuous Learning (7:45 AM - 8:15 AM)
        learning_activity = Activity("Personal Development - Continuous Learning", ActivityType.MORNING_ROUTINE, 0.5, 0, "Home", 
                "Read industry news, listen to educational content, or study to enhance skills and knowledge", 2, "low",
                tags={"learning", "development", "education", "growth", "professional"})
        time_slots.append(TimeSlot("7:45 AM", "8:15 AM", learning_activity, 
                                  "Invest in continuous learning and personal development"))
        
        # Phase 6: Family Time & Breakfast - Relationship Building (8:15 AM - 8:45 AM)
        family_activity = Activity("Family Time & Breakfast", ActivityType.MORNING_ROUTINE, 0.5, 10, "Home", 
                "Enjoy breakfast together, strengthen relationships, and start the day with positive interactions", 0, "low",
                tags={"family", "breakfast", "relationships", "connection", "personal"})
        time_slots.append(TimeSlot("8:15 AM", "8:45 AM", family_activity, 
                                  "Strengthen relationships and enjoy quality time together"))
        
        # Phase 7: Put First Things First - Priority Planning (8:45 AM - 9:15 AM)
        priority_activity = Activity("Put First Things First - Priority Planning", ActivityType.MORNING_ROUTINE, 0.5, 0, "Home", 
                "Identify urgent vs important tasks, prioritize high-impact activities, and plan your day strategically", 0, "low",
                tags={"priorities", "planning", "organization", "focus", "professional"})
        time_slots.append(TimeSlot("8:45 AM", "9:15 AM", priority_activity, 
                                  "Put first things first - prioritize your most important tasks"))
        
        # Phase 8: Think Win-Win - Collaborative Preparation (9:15 AM - 9:30 AM)
        collaboration_activity = Activity("Think Win-Win - Collaborative Preparation", ActivityType.MORNING_ROUTINE, 0.25, 0, "Home", 
                "Plan collaborative efforts, consider mutual benefits, and prepare for win-win interactions", 0, "low",
                tags={"collaboration", "win-win", "cooperation", "networking", "professional"})
        time_slots.append(TimeSlot("9:15 AM", "9:30 AM", collaboration_activity, 
                                  "Think win-win - prepare for collaborative and mutually beneficial interactions"))
        
        # Phase 9: Quick Commute & Positive Content (9:30 AM - 9:40 AM) - 10 minutes
        commute_activity = Activity("Quick Commute & Positive Content", ActivityType.MORNING_ROUTINE, 0.17, 0, "Transit", 
                "10-minute commute while listening to uplifting music, podcasts, or positive content", 0, "low",
                tags={"commute", "positive", "uplifting", "personal", "quick"})
        time_slots.append(TimeSlot("9:30 AM", "9:40 AM", commute_activity, 
                                  "Quick commute with positive, uplifting content"))
        
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
        
        # Structured Evening Wind-Down Routine (9:30 PM - 10:30 PM) - Based on 7 Habits of Highly Effective People
        if not self._has_activity_at_time(scheduled_specific, "9:30 PM", "10:30 PM"):
            # Phase 1: Seek First to Understand - Daily Reflection (9:30 PM - 9:45 PM) - 15 minutes
            reflection_activity = Activity("Seek First to Understand - Daily Reflection", ActivityType.EVENING_ROUTINE, 0.25, 0, "Home", 
                    "Reflect on daily interactions, assess listening skills, and consider others' perspectives from today", 0, "low",
                    tags={"reflection", "understanding", "empathy", "communication", "personal"})
            time_slots.append(TimeSlot("9:30 PM", "9:45 PM", reflection_activity, 
                                      "Seek first to understand - reflect on daily interactions and communication"))
            
            # Phase 2: Think Win-Win - Relationship Review (9:45 PM - 10:00 PM) - 15 minutes
            relationship_activity = Activity("Think Win-Win - Relationship Review", ActivityType.EVENING_ROUTINE, 0.25, 0, "Home", 
                    "Review relationships and collaborations, identify win-win opportunities, and plan for mutual benefits", 0, "low",
                    tags={"relationships", "win-win", "collaboration", "connection", "personal"})
            time_slots.append(TimeSlot("9:45 PM", "10:00 PM", relationship_activity, 
                                      "Think win-win - review relationships and plan for mutual benefits"))
            
            # Phase 3: Evening Shower & Face Routine (10:00 PM - 10:15 PM) - 15 minutes
            shower_face_activity = Activity("Evening Shower & Face Routine", ActivityType.EVENING_ROUTINE, 0.25, 0, "Home", 
                    "Evening shower, complete face cleansing routine, skincare, and personal grooming before bed", 0, "low",
                    tags={"shower", "face-routine", "skincare", "grooming", "personal-care", "bedtime"})
            time_slots.append(TimeSlot("10:00 PM", "10:15 PM", shower_face_activity, 
                                      "Evening shower and complete face routine for healthy skin"))
            
            # Phase 4: Sharpen the Saw - Renewal & Rest (10:15 PM - 10:30 PM) - 15 minutes
            renewal_activity = Activity("Sharpen the Saw - Renewal & Rest", ActivityType.EVENING_ROUTINE, 0.25, 0, "Home", 
                    "Engage in relaxing activities, practice gratitude, and prepare for restorative sleep", 0, "low",
                    tags={"renewal", "rest", "gratitude", "relaxation", "personal"})
            time_slots.append(TimeSlot("10:15 PM", "10:30 PM", renewal_activity, 
                                      "Sharpen the saw - renew yourself for tomorrow"))
        
        # Add specific activities and merge with generated schedule
        time_slots.extend(scheduled_specific)
        
        # Schedule Core Requirements
        time_slots = self._schedule_core_requirements(date, time_slots)
        
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
    
    def get_core_requirements_status(self) -> Dict:
        """Get status of Core Schedule Requirements"""
        return {
            "meditation_progression": {
                "current_week": self.meditation_week,
                "intentions_used": self.meditation_intentions[:self.meditation_week % len(self.meditation_intentions)],
                "next_intention": self.meditation_intentions[self.meditation_week % len(self.meditation_intentions)]
            },
            "entertainment_schedule": {
                "comedy_show": "Every 2 months (odd months)",
                "show_play": "Every 2 months (even months)", 
                "drag_show": "Monthly (first Sunday)"
            },
            "work_commitments": {
                "work_hours": "9:00 AM - 6:00 PM (Monday-Friday)",
                "commute": "10 minutes each way",
                "immigration_hours_weekly": 3,
                "professional_dev_hours_weekly": 5,
                "budgeting_hours_weekly": 1,
                "budgeting_hours_monthly": 2.5
            },
            "fitness_schedule": {
                "running": "Tuesday, Thursday, Friday (1+ hour), Sunday (2+ hours)",
                "swimming": "Twice per month",
                "tennis": "Twice per month"
            },
            "household_schedule": {
                "grocery_shopping": "Weekly (Saturday)",
                "laundry": "Weekly (Sunday)",
                "budgeting": "Weekly (Saturday) + Monthly with Peter"
            },
            "personal_care": {
                "daily_grooming": "Shower, skincare, teeth, deodorant",
                "weekly_grooming": "Hair washing (3x), nail trimming, beard trimming",
                "bi_weekly_grooming": "Haircut/trim, eyebrow grooming",
                "monthly_grooming": "Deep skincare, hair styling, wardrobe organization"
            },
            "preferences": {
                "no_morning_news": True,
                "positive_morning_content": True,
                "no_breakfast": True
            }
        }
    
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
