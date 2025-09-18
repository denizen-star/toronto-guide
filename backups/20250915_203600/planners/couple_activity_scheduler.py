#!/usr/bin/env python3
"""
Couple Activity Scheduler - Intentional Relationship Planning
Integrates principles from Atomic Habits, Hold Me Tight, and The Power of a Partner
for meaningful couple activity scheduling and relationship building.

Key Features:
- Habit stacking for consistent couple activities
- Emotional safety and connection focus
- Intentional planning based on relationship goals
- Atomic Habits principles for sustainable relationship habits
"""

import json
import datetime
from typing import Dict, List, Optional, Tuple, Set
from dataclasses import dataclass, field
from enum import Enum
import random
from collections import defaultdict


class CoupleActivityType(Enum):
    """Types of couple activities based on relationship building principles"""
    DAILY_CONNECTION = "daily_connection"  # Small daily habits (Atomic Habits)
    EMOTIONAL_SAFETY = "emotional_safety"  # Safe space activities (Hold Me Tight)
    SHARED_GOALS = "shared_goals"  # Collaborative activities (Power of a Partner)
    QUALITY_TIME = "quality_time"  # Undivided attention activities
    ADVENTURE = "adventure"  # New experiences together
    INTIMACY = "intimacy"  # Physical and emotional closeness
    LEARNING = "learning"  # Growing together
    SERVICE = "service"  # Giving back together
    CREATIVE = "creative"  # Creative and artistic activities


class HabitStackingTrigger(Enum):
    """Triggers for habit stacking based on Atomic Habits principles"""
    MORNING_ROUTINE = "morning_routine"
    AFTER_DINNER = "after_dinner"
    BEFORE_BED = "before_bed"
    WEEKEND_MORNING = "weekend_morning"
    COMMUTE_HOME = "commute_home"
    LUNCH_BREAK = "lunch_break"


@dataclass
class CoupleActivity:
    """Enhanced activity class for couple-specific activities"""
    name: str
    activity_type: CoupleActivityType
    duration_minutes: int
    cost_cad: float
    location: str
    description: str
    emotional_safety_level: int  # 1-10 scale for emotional safety
    connection_depth: int  # 1-10 scale for relationship depth
    habit_stacking_trigger: Optional[HabitStackingTrigger] = None
    requires_planning: bool = False
    energy_level: str = "medium"  # "low", "medium", "high"
    weather_dependent: bool = False
    indoor: bool = True
    tags: Set[str] = field(default_factory=set)
    relationship_goals: Set[str] = field(default_factory=set)  # Goals this activity supports
    last_used: Optional[datetime.datetime] = None
    usage_count: int = 0


@dataclass
class CoupleTimeSlot:
    """Time slot specifically for couple activities"""
    start_time: str
    end_time: str
    activity: CoupleActivity
    notes: str = ""
    is_habit_stacked: bool = False
    emotional_check_in: bool = False  # Whether this includes emotional check-in


@dataclass
class RelationshipGoals:
    """Relationship goals based on the self-help book principles"""
    atomic_habits_goals: List[str] = field(default_factory=lambda: [
        "Build consistent daily connection habits",
        "Create sustainable relationship routines",
        "Make couple time automatic and easy"
    ])
    emotional_safety_goals: List[str] = field(default_factory=lambda: [
        "Create safe emotional space for vulnerability",
        "Build trust through consistent presence",
        "Develop secure attachment patterns"
    ])
    partnership_goals: List[str] = field(default_factory=lambda: [
        "Collaborate on shared objectives",
        "Support each other's individual growth",
        "Build mutual accountability and support"
    ])


class CoupleActivityScheduler:
    """
    Intentional couple activity scheduler based on self-help book principles
    """
    
    def __init__(self, user_name: str = "User", partner_name: str = "Partner"):
        self.user_name = user_name
        self.partner_name = partner_name
        self.activities_db = self._load_couple_activities_database()
        self.relationship_goals = RelationshipGoals()
        self.used_activities: Set[str] = set()
        self.habit_streaks: Dict[str, int] = defaultdict(int)  # Track habit consistency
        self.emotional_check_ins: List[datetime.datetime] = []  # Track emotional check-ins
        
    def _load_couple_activities_database(self) -> List[CoupleActivity]:
        """Load comprehensive database of couple activities based on self-help principles"""
        activities = [
            # DAILY CONNECTION ACTIVITIES (Atomic Habits - Small, Consistent Actions)
            CoupleActivity(
                "Morning Intention Setting", CoupleActivityType.DAILY_CONNECTION, 5, 0, "Home",
                "Share daily intentions and support each other's goals", 8, 7,
                HabitStackingTrigger.MORNING_ROUTINE, False, "low",
                tags={"intention", "goals", "support", "morning"},
                relationship_goals={"atomic_habits_goals", "partnership_goals"}
            ),
            CoupleActivity(
                "Evening Gratitude Share", CoupleActivityType.DAILY_CONNECTION, 10, 0, "Home",
                "Share three things you're grateful for about each other", 9, 8,
                HabitStackingTrigger.BEFORE_BED, False, "low",
                tags={"gratitude", "appreciation", "evening", "connection"},
                relationship_goals={"emotional_safety_goals", "atomic_habits_goals"}
            ),
            CoupleActivity(
                "After-Dinner Walk & Talk", CoupleActivityType.DAILY_CONNECTION, 15, 0, "Neighborhood",
                "Take a short walk while discussing your day", 7, 6,
                HabitStackingTrigger.AFTER_DINNER, False, "low",
                tags={"walking", "conversation", "daily", "outdoor"},
                relationship_goals={"atomic_habits_goals", "emotional_safety_goals"}
            ),
            CoupleActivity(
                "Coffee & Connection", CoupleActivityType.DAILY_CONNECTION, 20, 15, "Local Cafe",
                "Morning coffee together with focused conversation", 8, 7,
                HabitStackingTrigger.MORNING_ROUTINE, False, "low",
                tags={"coffee", "morning", "conversation", "cafe"},
                relationship_goals={"atomic_habits_goals", "emotional_safety_goals"}
            ),
            
            # EMOTIONAL SAFETY ACTIVITIES (Hold Me Tight - Safe Emotional Space)
            CoupleActivity(
                "Weekly Emotional Check-In", CoupleActivityType.EMOTIONAL_SAFETY, 30, 0, "Home",
                "Dedicated time to share feelings, concerns, and needs without judgment", 10, 9,
                None, True, "low",
                tags={"emotional", "check-in", "vulnerability", "weekly"},
                relationship_goals={"emotional_safety_goals"}
            ),
            CoupleActivity(
                "Hold Me Tight Exercise", CoupleActivityType.EMOTIONAL_SAFETY, 45, 0, "Home",
                "Practice emotional attunement and responsive communication", 10, 9,
                None, True, "medium",
                tags={"emotional", "attachment", "communication", "intimacy"},
                relationship_goals={"emotional_safety_goals"}
            ),
            CoupleActivity(
                "Safe Space Conversation", CoupleActivityType.EMOTIONAL_SAFETY, 25, 0, "Home",
                "Create a judgment-free zone for sharing difficult topics", 10, 8,
                None, False, "low",
                tags={"emotional", "safe-space", "vulnerability", "communication"},
                relationship_goals={"emotional_safety_goals"}
            ),
            CoupleActivity(
                "Attachment Repair Ritual", CoupleActivityType.EMOTIONAL_SAFETY, 20, 0, "Home",
                "Practice reconnection and repair after conflicts", 9, 8,
                None, False, "medium",
                tags={"repair", "attachment", "conflict-resolution", "healing"},
                relationship_goals={"emotional_safety_goals"}
            ),
            
            # SHARED GOALS ACTIVITIES (Power of a Partner - Collaborative Partnership)
            CoupleActivity(
                "Monthly Goal Planning Session", CoupleActivityType.SHARED_GOALS, 60, 0, "Home",
                "Plan and align on shared monthly goals and individual support", 8, 8,
                None, True, "medium",
                tags={"planning", "goals", "collaboration", "monthly"},
                relationship_goals={"partnership_goals", "atomic_habits_goals"}
            ),
            CoupleActivity(
                "Accountability Partner Check-In", CoupleActivityType.SHARED_GOALS, 20, 0, "Home",
                "Weekly check-in on individual goals and mutual support", 7, 7,
                None, False, "low",
                tags={"accountability", "support", "goals", "weekly"},
                relationship_goals={"partnership_goals"}
            ),
            CoupleActivity(
                "Collaborative Project Planning", CoupleActivityType.SHARED_GOALS, 45, 0, "Home",
                "Plan a shared project or adventure together", 8, 8,
                None, True, "medium",
                tags={"collaboration", "planning", "projects", "partnership"},
                relationship_goals={"partnership_goals"}
            ),
            CoupleActivity(
                "Mutual Growth Discussion", CoupleActivityType.SHARED_GOALS, 30, 0, "Home",
                "Discuss how to support each other's personal development", 8, 8,
                None, False, "medium",
                tags={"growth", "development", "support", "personal"},
                relationship_goals={"partnership_goals"}
            ),
            
            # QUALITY TIME ACTIVITIES (Undivided Attention)
            CoupleActivity(
                "Device-Free Dinner", CoupleActivityType.QUALITY_TIME, 60, 50, "Restaurant",
                "Uninterrupted dinner conversation without phones", 8, 8,
                None, False, "low",
                tags={"dinner", "device-free", "conversation", "undivided"},
                relationship_goals={"emotional_safety_goals", "atomic_habits_goals"}
            ),
            CoupleActivity(
                "Weekly Date Night", CoupleActivityType.QUALITY_TIME, 120, 100, "Various",
                "Dedicated weekly time for just the two of you", 9, 9,
                None, True, "medium",
                tags={"date-night", "weekly", "romance", "quality-time"},
                relationship_goals={"emotional_safety_goals", "atomic_habits_goals"}
            ),
            CoupleActivity(
                "Sunset Watching", CoupleActivityType.QUALITY_TIME, 30, 0, "Outdoor",
                "Watch sunset together in peaceful silence or gentle conversation", 9, 8,
                None, False, "low",
                tags={"sunset", "nature", "peaceful", "outdoor"},
                relationship_goals={"emotional_safety_goals"}
            ),
            CoupleActivity(
                "Cooking Together", CoupleActivityType.QUALITY_TIME, 90, 40, "Home",
                "Prepare a meal together with focused collaboration", 7, 7,
                None, False, "medium",
                tags={"cooking", "collaboration", "home", "creative"},
                relationship_goals={"partnership_goals", "atomic_habits_goals"}
            ),
            
            # ADVENTURE ACTIVITIES (New Experiences Together)
            CoupleActivity(
                "Try Something New Together", CoupleActivityType.ADVENTURE, 120, 80, "Various",
                "Explore a new activity, cuisine, or experience neither has tried", 6, 7,
                None, True, "high",
                tags={"adventure", "new", "exploration", "excitement"},
                relationship_goals={"partnership_goals", "atomic_habits_goals"}
            ),
            CoupleActivity(
                "Spontaneous Day Trip", CoupleActivityType.ADVENTURE, 480, 150, "Various",
                "Unplanned adventure to a nearby destination", 7, 8,
                None, True, "high",
                tags={"spontaneous", "travel", "adventure", "day-trip"},
                relationship_goals={"partnership_goals"}
            ),
            CoupleActivity(
                "Learn a New Skill Together", CoupleActivityType.ADVENTURE, 180, 120, "Class/Home",
                "Take a class or learn something new as a couple", 6, 7,
                None, True, "medium",
                tags={"learning", "skill", "class", "growth"},
                relationship_goals={"partnership_goals", "atomic_habits_goals"}
            ),
            
            # INTIMACY ACTIVITIES (Physical and Emotional Closeness)
            CoupleActivity(
                "Massage Exchange", CoupleActivityType.INTIMACY, 30, 0, "Home",
                "Take turns giving each other relaxing massages", 9, 9,
                None, False, "low",
                tags={"massage", "touch", "relaxation", "intimacy"},
                relationship_goals={"emotional_safety_goals"}
            ),
            CoupleActivity(
                "Dance Together", CoupleActivityType.INTIMACY, 20, 0, "Home",
                "Put on music and dance together in your living room", 8, 8,
                None, False, "medium",
                tags={"dance", "music", "movement", "fun"},
                relationship_goals={"emotional_safety_goals", "atomic_habits_goals"}
            ),
            CoupleActivity(
                "Cuddle and Read", CoupleActivityType.INTIMACY, 45, 0, "Home",
                "Read aloud to each other while cuddling", 9, 9,
                None, False, "low",
                tags={"reading", "cuddling", "intimacy", "peaceful"},
                relationship_goals={"emotional_safety_goals"}
            ),
            
            # LEARNING ACTIVITIES (Growing Together)
            CoupleActivity(
                "Relationship Book Club", CoupleActivityType.LEARNING, 60, 20, "Home",
                "Read and discuss relationship books together", 8, 8,
                None, True, "low",
                tags={"reading", "learning", "discussion", "growth"},
                relationship_goals={"partnership_goals", "emotional_safety_goals"}
            ),
            CoupleActivity(
                "Attend Couples Workshop", CoupleActivityType.LEARNING, 180, 200, "Workshop",
                "Participate in relationship or communication workshop", 9, 9,
                None, True, "medium",
                tags={"workshop", "learning", "professional", "growth"},
                relationship_goals={"emotional_safety_goals", "partnership_goals"}
            ),
            CoupleActivity(
                "Watch Educational Content Together", CoupleActivityType.LEARNING, 45, 0, "Home",
                "Watch documentaries or educational videos and discuss", 6, 6,
                None, False, "low",
                tags={"learning", "video", "discussion", "educational"},
                relationship_goals={"partnership_goals"}
            ),
            
            # SERVICE ACTIVITIES (Giving Back Together)
            CoupleActivity(
                "Volunteer Together", CoupleActivityType.SERVICE, 180, 0, "Community",
                "Volunteer for a cause you both care about", 7, 8,
                None, True, "medium",
                tags={"volunteer", "service", "community", "giving"},
                relationship_goals={"partnership_goals"}
            ),
            CoupleActivity(
                "Random Acts of Kindness", CoupleActivityType.SERVICE, 60, 30, "Community",
                "Plan and execute random acts of kindness together", 8, 7,
                None, False, "medium",
                tags={"kindness", "service", "community", "giving"},
                relationship_goals={"partnership_goals"}
            ),
            
            # CREATIVE & SILLY ACTIVITIES (From The Couple's Activity Book)
            CoupleActivity(
                "Our Story Comic Strip", CoupleActivityType.CREATIVE, 120, 25, "Home",
                "Create a comic strip or short story about how you met or a memorable shared experience", 9, 8,
                None, True, "medium",
                tags={"creative", "storytelling", "memory", "art", "fun"},
                relationship_goals={"emotional_safety_goals", "atomic_habits_goals"}
            ),
            CoupleActivity(
                "Couple's Time Capsule", CoupleActivityType.CREATIVE, 90, 15, "Home",
                "Decorate a box and fill it with mementos representing your relationship right now", 8, 9,
                None, True, "low",
                tags={"memory", "future", "mementos", "anniversary", "creative"},
                relationship_goals={"emotional_safety_goals", "partnership_goals"}
            ),
            CoupleActivity(
                "Collaborative Playlist Creation", CoupleActivityType.CREATIVE, 60, 0, "Home",
                "Create shared playlists representing specific feelings, memories, or relationship moments", 7, 7,
                None, False, "low",
                tags={"music", "memory", "collaborative", "creative", "nostalgia"},
                relationship_goals={"emotional_safety_goals", "atomic_habits_goals"}
            ),
            CoupleActivity(
                "DIY Pictionary with Inside Jokes", CoupleActivityType.CREATIVE, 90, 10, "Home",
                "Create Pictionary with inside jokes, shared memories, and favorite things", 8, 7,
                None, True, "high",
                tags={"games", "inside-jokes", "memory", "fun", "competitive"},
                relationship_goals={"emotional_safety_goals", "atomic_habits_goals"}
            ),
            CoupleActivity(
                "Our Personalities in a Box", CoupleActivityType.CREATIVE, 60, 0, "Home",
                "Find objects that represent each other and guess what they symbolize", 8, 8,
                None, False, "medium",
                tags={"creative", "personality", "symbolism", "fun", "insight"},
                relationship_goals={"emotional_safety_goals"}
            ),
            
            # ADVENTUROUS & EXPLORATORY ACTIVITIES
            CoupleActivity(
                "Tourist in Our Own City", CoupleActivityType.ADVENTURE, 240, 80, "Various",
                "Explore a new part of your city as tourists, visiting landmarks and neighborhoods", 7, 8,
                None, True, "medium",
                tags={"exploration", "adventure", "local", "discovery", "walking"},
                relationship_goals={"partnership_goals", "atomic_habits_goals"}
            ),
            CoupleActivity(
                "Progressive Dinner Adventure", CoupleActivityType.ADVENTURE, 180, 120, "Various",
                "Plan a meal where each course is at a different location around the city", 8, 8,
                None, True, "medium",
                tags={"dining", "adventure", "progressive", "exploration", "culinary"},
                relationship_goals={"partnership_goals", "atomic_habits_goals"}
            ),
            CoupleActivity(
                "Photo Scavenger Hunt", CoupleActivityType.ADVENTURE, 120, 20, "Various",
                "Find and photograph specific things that represent your relationship", 7, 7,
                None, True, "medium",
                tags={"photography", "scavenger-hunt", "creative", "adventure", "memory"},
                relationship_goals={"partnership_goals", "atomic_habits_goals"}
            ),
            CoupleActivity(
                "Two-Person Book Club", CoupleActivityType.LEARNING, 180, 60, "Restaurant",
                "Read the same book, dress up, and discuss it over a formal dinner", 8, 8,
                None, True, "low",
                tags={"reading", "discussion", "formal", "learning", "intellectual"},
                relationship_goals={"partnership_goals", "atomic_habits_goals"}
            ),
            CoupleActivity(
                "Blind Food Tasting Challenge", CoupleActivityType.ADVENTURE, 90, 40, "Home",
                "Take turns tasting foods blindfolded and guessing what they are", 7, 7,
                None, False, "high",
                tags={"food", "challenge", "senses", "fun", "competitive"},
                relationship_goals={"atomic_habits_goals"}
            ),
            
            # MINDFUL & CONNECTING ACTIVITIES
            CoupleActivity(
                "Star-Gazing with Dreams", CoupleActivityType.QUALITY_TIME, 120, 0, "Outdoor",
                "Star-gaze while discussing your biggest goals and dreams", 9, 9,
                None, False, "low",
                tags={"stargazing", "dreams", "goals", "nature", "intimate"},
                relationship_goals={"emotional_safety_goals", "partnership_goals"}
            ),
            CoupleActivity(
                "Relationship Check-In Walk", CoupleActivityType.QUALITY_TIME, 90, 0, "Outdoor",
                "Long walk without phones to discuss feelings, worries, and joys", 8, 9,
                None, False, "low",
                tags={"walking", "conversation", "check-in", "nature", "intimate"},
                relationship_goals={"emotional_safety_goals", "atomic_habits_goals"}
            ),
            CoupleActivity(
                "Future Vision Board Creation", CoupleActivityType.CREATIVE, 120, 30, "Home",
                "Create a vision board with shared goals for travel, family, and home life", 8, 8,
                None, True, "low",
                tags={"vision", "goals", "future", "creative", "planning"},
                relationship_goals={"partnership_goals", "atomic_habits_goals"}
            ),
            CoupleActivity(
                "Mutual Massage Night", CoupleActivityType.INTIMACY, 90, 20, "Home",
                "Set mood with candles and music, take turns giving relaxing massages", 9, 9,
                None, False, "low",
                tags={"massage", "intimacy", "relaxation", "touch", "romantic"},
                relationship_goals={"emotional_safety_goals"}
            ),
            CoupleActivity(
                "A-to-Z of Our Love", CoupleActivityType.QUALITY_TIME, 60, 0, "Home",
                "Take turns listing things you love about each other, going through the alphabet", 9, 9,
                None, False, "low",
                tags={"appreciation", "love", "alphabet", "gratitude", "intimate"},
                relationship_goals={"emotional_safety_goals", "atomic_habits_goals"}
            ),
            
            # RELAXING & FUN ACTIVITIES
            CoupleActivity(
                "Themed Movie Marathon", CoupleActivityType.QUALITY_TIME, 240, 40, "Home",
                "Pick a theme (director, genre, actor) and marathon with themed snacks", 7, 7,
                None, True, "low",
                tags={"movies", "marathon", "themed", "relaxing", "entertainment"},
                relationship_goals={"atomic_habits_goals"}
            ),
            CoupleActivity(
                "Shared Spa Night", CoupleActivityType.INTIMACY, 120, 50, "Home",
                "Set up home spa with face masks, oils, and give each other manicures", 8, 8,
                None, True, "low",
                tags={"spa", "self-care", "intimacy", "relaxation", "pampering"},
                relationship_goals={"emotional_safety_goals", "atomic_habits_goals"}
            ),
            CoupleActivity(
                "Indoor Picnic", CoupleActivityType.QUALITY_TIME, 90, 30, "Home",
                "Spread blanket on floor and eat a meal prepared together", 7, 7,
                None, False, "low",
                tags={"picnic", "indoor", "casual", "cooking", "intimate"},
                relationship_goals={"atomic_habits_goals"}
            ),
            CoupleActivity(
                "Board Game Tournament", CoupleActivityType.QUALITY_TIME, 120, 20, "Home",
                "Compete in two-player board/card games with fun prizes", 7, 7,
                None, True, "high",
                tags={"games", "tournament", "competitive", "fun", "prizes"},
                relationship_goals={"atomic_habits_goals"}
            ),
            CoupleActivity(
                "Couples' Cooking Challenge", CoupleActivityType.QUALITY_TIME, 150, 60, "Home",
                "Pick a new recipe and work together to prepare it as a team", 8, 7,
                None, True, "medium",
                tags={"cooking", "challenge", "teamwork", "new-recipe", "collaborative"},
                relationship_goals={"partnership_goals", "atomic_habits_goals"}
            ),
        ]
        
        return activities
    
    def generate_couple_schedule(self, start_date: str, duration: str, 
                               focus_areas: Optional[List[str]] = None) -> Dict:
        """
        Generate intentional couple activity schedule based on self-help principles
        
        Args:
            start_date: Start date in YYYY-MM-DD format
            duration: "1 week", "2 weeks", "1 month", or "3 months"
            focus_areas: List of focus areas like ["emotional_safety", "habit_building", "adventure"]
        
        Returns:
            Dictionary containing formatted couple schedule
        """
        start_dt = datetime.datetime.strptime(start_date, "%Y-%m-%d")
        
        # Generate acknowledgment with focus on intentional planning
        acknowledgment = self._generate_couple_acknowledgment(start_date, duration, focus_areas)
        
        if duration in ["1 week", "2 weeks"]:
            schedule = self._generate_detailed_couple_schedule(start_dt, duration, focus_areas)
        else:
            schedule = self._generate_couple_roadmap(start_dt, duration, focus_areas)
        
        summary_table = self._generate_couple_summary_table(schedule, duration)
        
        return {
            "acknowledgment": acknowledgment,
            "schedule": schedule,
            "summary_table": summary_table,
            "relationship_goals": self.relationship_goals
        }
    
    def _generate_couple_acknowledgment(self, start_date: str, duration: str, 
                                      focus_areas: Optional[List[str]]) -> str:
        """Generate acknowledgment focused on intentional couple planning"""
        focus_text = ""
        if focus_areas:
            focus_text = f"\n**Focus Areas:** {', '.join(focus_areas).replace('_', ' ').title()}"
        
        return f"""
💕 **Intentional Couple Activity Planner - Ready to Strengthen Your Bond!**

**Date Range:** {start_date} for {duration}
**Couple:** {self.user_name} & {self.partner_name}
**Approach:** Intentional relationship building based on proven self-help principles

**Core Principles:**
• **Atomic Habits:** Small, consistent actions that build lasting relationship habits
• **Hold Me Tight:** Creating emotional safety and secure attachment
• **Power of a Partner:** Collaborative growth and mutual support{focus_text}

This schedule is designed to help you build deeper connection, create sustainable relationship habits, 
and strengthen your partnership through intentional, meaningful activities.

Let's create lasting love together! 💖
        """.strip()
    
    def _generate_detailed_couple_schedule(self, start_dt: datetime.datetime, 
                                         duration: str, focus_areas: Optional[List[str]]) -> Dict:
        """Generate detailed daily couple schedule with habit stacking"""
        days = 7 if duration == "1 week" else 14
        
        schedule = {}
        current_date = start_dt
        
        for day_num in range(1, days + 1):
            day_key = f"Day {day_num}: {current_date.strftime('%A, %B %d, %Y')}"
            is_weekend = current_date.weekday() >= 5
            
            # Generate day schedule with habit stacking
            day_schedule = self._generate_couple_day_schedule(current_date, is_weekend, focus_areas)
            schedule[day_key] = day_schedule
            
            current_date += datetime.timedelta(days=1)
        
        return schedule
    
    def _generate_couple_day_schedule(self, date: datetime.datetime, is_weekend: bool, 
                                    focus_areas: Optional[List[str]]) -> List[CoupleTimeSlot]:
        """Generate daily couple schedule with habit stacking and emotional safety"""
        time_slots = []
        
        # Morning Habit Stacking (Atomic Habits principle)
        if not is_weekend:
            morning_activity = self._select_habit_stacked_activity(
                HabitStackingTrigger.MORNING_ROUTINE, focus_areas
            )
            if morning_activity:
                time_slots.append(CoupleTimeSlot(
                    "7:00 AM", "7:15 AM", morning_activity,
                    "Start your day with intentional connection", True
                ))
        
        # Weekend Morning Connection
        if is_weekend:
            weekend_activity = self._select_habit_stacked_activity(
                HabitStackingTrigger.WEEKEND_MORNING, focus_areas
            )
            if weekend_activity:
                time_slots.append(CoupleTimeSlot(
                    "9:00 AM", "9:30 AM", weekend_activity,
                    "Weekend morning connection time", True
                ))
        
        # Main Couple Activity (varies by day and focus)
        main_activity = self._select_main_couple_activity(is_weekend, focus_areas)
        if main_activity:
            start_time = "7:00 PM" if not is_weekend else "2:00 PM"
            end_time = self._calculate_end_time(start_time, main_activity.duration_minutes)
            time_slots.append(CoupleTimeSlot(
                start_time, end_time, main_activity,
                "Primary couple connection activity", False
            ))
        
        # Evening Habit Stacking
        evening_activity = self._select_habit_stacked_activity(
            HabitStackingTrigger.BEFORE_BED, focus_areas
        )
        if evening_activity:
            time_slots.append(CoupleTimeSlot(
                "9:30 PM", "9:45 PM", evening_activity,
                "End your day with connection", True
            ))
        
        # Weekly Emotional Check-In (Hold Me Tight principle)
        if date.weekday() == 6:  # Sunday
            check_in_activity = self._select_activity_by_type(
                CoupleActivityType.EMOTIONAL_SAFETY, focus_areas
            )
            if check_in_activity:
                time_slots.append(CoupleTimeSlot(
                    "10:00 AM", "10:30 AM", check_in_activity,
                    "Weekly emotional check-in and connection", False, True
                ))
        
        # Update usage tracking only for non-habit-stacked activities to allow reuse
        for slot in time_slots:
            if not slot.is_habit_stacked:
                self.used_activities.add(slot.activity.name)
            slot.activity.usage_count += 1
            slot.activity.last_used = datetime.datetime.now()
        
        return time_slots
    
    def _select_habit_stacked_activity(self, trigger: HabitStackingTrigger, 
                                     focus_areas: Optional[List[str]]) -> Optional[CoupleActivity]:
        """Select activity for habit stacking based on Atomic Habits principles"""
        available_activities = [
            a for a in self.activities_db 
            if a.habit_stacking_trigger == trigger
        ]
        
        if not available_activities:
            return None
        
        # Filter by focus areas if specified
        if focus_areas:
            filtered_activities = []
            for activity in available_activities:
                for goal in activity.relationship_goals:
                    if any(focus in goal for focus in focus_areas):
                        filtered_activities.append(activity)
                        break
            if filtered_activities:
                available_activities = filtered_activities
        
        # Select activity with lowest usage count (Atomic Habits - make it easy)
        available_activities.sort(key=lambda x: x.usage_count)
        return available_activities[0] if available_activities else None
    
    def _select_main_couple_activity(self, is_weekend: bool, 
                                   focus_areas: Optional[List[str]]) -> Optional[CoupleActivity]:
        """Select main couple activity for the day"""
        # Prioritize activities based on focus areas
        activity_types = []
        if focus_areas:
            if "emotional_safety" in focus_areas:
                activity_types.append(CoupleActivityType.EMOTIONAL_SAFETY)
            if "habit_building" in focus_areas:
                activity_types.append(CoupleActivityType.DAILY_CONNECTION)
            if "adventure" in focus_areas:
                activity_types.append(CoupleActivityType.ADVENTURE)
            if "partnership" in focus_areas:
                activity_types.append(CoupleActivityType.SHARED_GOALS)
        
        # Default to quality time if no specific focus
        if not activity_types:
            activity_types = [CoupleActivityType.QUALITY_TIME]
        
        # Select from available activity types, allowing reuse
        for activity_type in activity_types:
            activity = self._select_activity_by_type(activity_type, focus_areas, allow_reuse=True)
            if activity:
                return activity
        
        return None
    
    def _select_activity_by_type(self, activity_type: CoupleActivityType, 
                               focus_areas: Optional[List[str]], allow_reuse: bool = False) -> Optional[CoupleActivity]:
        """Select activity by type with focus area filtering"""
        available_activities = [
            a for a in self.activities_db 
            if a.activity_type == activity_type and
            (allow_reuse or a.name not in self.used_activities)
        ]
        
        if not available_activities:
            return None
        
        # Filter by focus areas if specified
        if focus_areas:
            filtered_activities = []
            for activity in available_activities:
                for goal in activity.relationship_goals:
                    if any(focus in goal for focus in focus_areas):
                        filtered_activities.append(activity)
                        break
            if filtered_activities:
                available_activities = filtered_activities
        
        # Select activity with lowest usage count
        available_activities.sort(key=lambda x: x.usage_count)
        return available_activities[0] if available_activities else None
    
    def _calculate_end_time(self, start_time: str, duration_minutes: int) -> str:
        """Calculate end time based on start time and duration in minutes"""
        start_minutes = self._time_to_minutes(start_time)
        end_minutes = start_minutes + duration_minutes
        
        # Handle day overflow
        if end_minutes >= 1440:  # 24 hours = 1440 minutes
            end_minutes = end_minutes % 1440
        
        hour = end_minutes // 60
        minute = end_minutes % 60
        
        period = "AM" if hour < 12 else "PM"
        if hour > 12:
            hour -= 12
        elif hour == 0:
            hour = 12
        
        return f"{hour}:{minute:02d} {period}"
    
    def _time_to_minutes(self, time_str: str) -> int:
        """Convert time string to minutes since midnight"""
        time_str = time_str.replace(" AM", "").replace(" PM", "")
        hour, minute = map(int, time_str.split(":"))
        
        if "PM" in time_str and hour != 12:
            hour += 12
        elif "AM" in time_str and hour == 12:
            hour = 0
        
        return hour * 60 + minute
    
    def _generate_couple_roadmap(self, start_dt: datetime.datetime, duration: str, 
                               focus_areas: Optional[List[str]]) -> Dict:
        """Generate high-level couple roadmap for longer durations"""
        months = 1 if duration == "1 month" else 3
        roadmap = {}
        
        monthly_themes = [
            "Building Daily Connection Habits",
            "Deepening Emotional Safety",
            "Strengthening Partnership Goals"
        ]
        
        for month in range(months):
            month_date = start_dt + datetime.timedelta(days=30 * month)
            theme = monthly_themes[month % len(monthly_themes)]
            
            roadmap[f"Month {month + 1}: {theme}"] = {
                "focus": theme,
                "key_activities": self._get_theme_couple_activities(theme),
                "relationship_goals": self._get_monthly_relationship_goals(theme),
                "habit_streak_target": f"Maintain {5 + month * 2} day streak of daily connection",
                "monthly_highlight": self._get_monthly_couple_highlight(theme)
            }
        
        return roadmap
    
    def _get_theme_couple_activities(self, theme: str) -> List[str]:
        """Get activities that fit the monthly theme"""
        theme_activities = {
            "Building Daily Connection Habits": [
                "Morning intention setting", "Evening gratitude share", 
                "After-dinner walk & talk", "Coffee & connection"
            ],
            "Deepening Emotional Safety": [
                "Weekly emotional check-in", "Hold Me Tight exercises",
                "Safe space conversations", "Attachment repair rituals"
            ],
            "Strengthening Partnership Goals": [
                "Monthly goal planning", "Accountability check-ins",
                "Collaborative projects", "Mutual growth discussions"
            ]
        }
        return theme_activities.get(theme, ["Quality time activities", "Connection building"])
    
    def _get_monthly_relationship_goals(self, theme: str) -> List[str]:
        """Get relationship goals for the monthly theme"""
        theme_goals = {
            "Building Daily Connection Habits": [
                "Establish 3 consistent daily connection habits",
                "Create automatic couple time routines",
                "Build habit stacking triggers for relationship activities"
            ],
            "Deepening Emotional Safety": [
                "Create safe space for vulnerability",
                "Practice emotional attunement and responsiveness",
                "Develop secure attachment patterns"
            ],
            "Strengthening Partnership Goals": [
                "Align on shared objectives and individual support",
                "Build mutual accountability systems",
                "Collaborate on meaningful projects together"
            ]
        }
        return theme_goals.get(theme, ["Strengthen relationship connection"])
    
    def _get_monthly_couple_highlight(self, theme: str) -> str:
        """Get creative monthly highlight suggestion"""
        highlights = {
            "Building Daily Connection Habits": "Complete a 30-day daily connection challenge",
            "Deepening Emotional Safety": "Attend a couples workshop or therapy session together",
            "Strengthening Partnership Goals": "Launch a collaborative project that excites you both"
        }
        return highlights.get(theme, "Try a new relationship-building activity together")
    
    def _generate_couple_summary_table(self, schedule: Dict, duration: str) -> str:
        """Generate summary table for couple activities"""
        if duration in ["1 month", "3 months"]:
            return self._generate_roadmap_table(schedule)
        else:
            return self._generate_daily_couple_table(schedule)
    
    def _generate_daily_couple_table(self, schedule: Dict) -> str:
        """Generate daily couple activity summary table"""
        table = "## 💕 **Couple Activity Summary**\n\n"
        table += "| Day | Date | Morning Connection | Main Activity | Evening Connection | Total Cost | Connection Depth |\n"
        table += "|-----|------|-------------------|---------------|-------------------|------------|------------------|\n"
        
        for day_key, time_slots in schedule.items():
            if isinstance(time_slots, list):
                morning = time_slots[0].activity.name if time_slots else "N/A"
                main_activity = time_slots[1].activity.name if len(time_slots) > 1 else "N/A"
                evening = time_slots[-1].activity.name if time_slots else "N/A"
                
                total_cost = sum(slot.activity.cost_cad for slot in time_slots)
                max_connection = max(slot.activity.connection_depth for slot in time_slots) if time_slots else 0
                
                date_str = day_key.split(": ")[1] if ": " in day_key else day_key
                table += f"| {day_key.split(':')[0]} | {date_str} | {morning} | {main_activity} | {evening} | ${total_cost:.0f} | {max_connection}/10 |\n"
        
        return table
    
    def _generate_roadmap_table(self, roadmap: Dict) -> str:
        """Generate roadmap summary table"""
        table = "## 🗺️ **Couple Relationship Roadmap**\n\n"
        table += "| Month | Theme | Key Activities | Relationship Goals | Habit Streak Target | Monthly Highlight |\n"
        table += "|-------|-------|----------------|-------------------|-------------------|------------------|\n"
        
        for month_key, details in roadmap.items():
            if isinstance(details, dict):
                theme = details.get('focus', 'General')
                activities = ', '.join(details.get('key_activities', [])[:2])
                goals = ', '.join(details.get('relationship_goals', [])[:2])
                streak = details.get('habit_streak_target', 'Build consistency')
                highlight = details.get('monthly_highlight', 'Try something new')
                
                table += f"| {month_key} | {theme} | {activities} | {goals} | {streak} | {highlight} |\n"
        
        return table
    
    def get_relationship_insights(self) -> Dict:
        """Get insights about couple activity patterns and relationship building"""
        total_activities = len(self.activities_db)
        used_activities = len(self.used_activities)
        
        # Calculate activity type distribution
        type_distribution = defaultdict(int)
        for activity in self.activities_db:
            if activity.name in self.used_activities:
                type_distribution[activity.activity_type.value] += 1
        
        # Calculate average connection depth
        used_activity_objects = [a for a in self.activities_db if a.name in self.used_activities]
        avg_connection_depth = sum(a.connection_depth for a in used_activity_objects) / len(used_activity_objects) if used_activity_objects else 0
        
        return {
            "total_activities_available": total_activities,
            "activities_used": used_activities,
            "usage_percentage": (used_activities / total_activities) * 100,
            "activity_type_distribution": dict(type_distribution),
            "average_connection_depth": round(avg_connection_depth, 1),
            "habit_streaks": dict(self.habit_streaks),
            "emotional_check_ins_scheduled": len(self.emotional_check_ins)
        }


def main():
    """Demonstrate the Couple Activity Scheduler"""
    scheduler = CoupleActivityScheduler("Sarah", "Michael")
    
    # Generate a 2-week schedule focused on emotional safety and habit building
    result = scheduler.generate_couple_schedule(
        start_date="2024-01-15",
        duration="2 weeks",
        focus_areas=["emotional_safety", "habit_building"]
    )
    
    print(result["acknowledgment"])
    print("\n" + "="*60 + "\n")
    
    for day, schedule in result["schedule"].items():
        print(f"## {day}")
        print()
        for slot in schedule:
            habit_marker = "🔄" if slot.is_habit_stacked else "💕"
            check_in_marker = "💬" if slot.emotional_check_in else ""
            print(f"{habit_marker}{check_in_marker} **{slot.start_time} - {slot.end_time}:** {slot.activity.name}")
            print(f"   💰 Cost: ${slot.activity.cost_cad:.0f} CAD")
            print(f"   📍 Location: {slot.activity.location}")
            print(f"   💝 Connection Depth: {slot.activity.connection_depth}/10")
            print(f"   🛡️ Emotional Safety: {slot.activity.emotional_safety_level}/10")
            print(f"   🏷️ Tags: {', '.join(slot.activity.tags) if slot.activity.tags else 'General'}")
            print(f"   📝 Notes: {slot.notes}")
            print()
        print("-" * 60)
        print()
    
    print(result["summary_table"])
    
    # Show relationship insights
    print("\n" + "="*60)
    print("## 💡 **Relationship Insights**")
    insights = scheduler.get_relationship_insights()
    print(f"Activities Used: {insights['activities_used']}/{insights['total_activities_available']} ({insights['usage_percentage']:.1f}%)")
    print(f"Average Connection Depth: {insights['average_connection_depth']}/10")
    print(f"Activity Type Distribution: {insights['activity_type_distribution']}")


if __name__ == "__main__":
    main()
