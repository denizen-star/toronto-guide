#!/usr/bin/env python3
"""
Enhanced Schedule Generator with Time Allocation Tuner Integration
Automatically refactors the entire schedule based on time allocation percentages
"""

from datetime import datetime, date, timedelta
from typing import Dict, List, Optional
from dataclasses import dataclass
from enum import Enum
import json
import random
import os
from time_allocation_tuner import TimeAllocationTuner, TimeAllocation


class ActivityType(Enum):
    MORNING_ROUTINE = "morning_routine"
    WORK = "work"
    FITNESS = "fitness"
    NETWORKING = "networking"
    SOCIAL = "social"
    CULTURAL = "cultural"
    PERSONAL_DEVELOPMENT = "personal_development"
    COUPLE_TIME = "couple_time"
    EVENING_ROUTINE = "evening_routine"
    HOUSEHOLD = "household"


@dataclass
class DailyActivity:
    time: str
    duration: str
    activity: str
    location: str
    cost: float
    networking_potential: int  # 1-10 scale
    energy_level: str  # low, medium, high
    description: str
    tags: List[str]
    is_core_requirement: bool = False
    category: str = "general"  # individual, networking, couple


class EnhancedScheduleGenerator:
    """Enhanced schedule generator that adapts to time allocation tuner settings"""
    
    def __init__(self, allocation_tuner: TimeAllocationTuner = None):
        self.tuner = allocation_tuner or TimeAllocationTuner()
        self.start_date = date(2025, 9, 15)
        self.end_date = date(2025, 10, 15)
        self.activity_database = self._load_activity_database()
        self.activity_usage_tracker = self._load_activity_usage_tracker()
    
    def _load_activity_database(self) -> List[Dict]:
        """Load activities from the JSON database"""
        try:
            with open('data/activities/my_complete_activity_schedule.json', 'r') as f:
                data = json.load(f)
                return data['activities']
        except Exception as e:
            print(f"Warning: Could not load activity database: {e}")
            return []
    
    def _get_activities_by_category(self, category: str) -> List[Dict]:
        """Get activities from database by category"""
        return [act for act in self.activity_database if act.get('category') == category]
    
    def _get_activities_by_schedule_type(self, schedule_type: str) -> List[Dict]:
        """Get activities from database by schedule type"""
        return [act for act in self.activity_database if act.get('schedule_type') == schedule_type]
    
    def _load_activity_usage_tracker(self) -> Dict:
        """Load activity usage tracker from file"""
        tracker_file = 'activity_usage_tracker.json'
        try:
            if os.path.exists(tracker_file):
                with open(tracker_file, 'r') as f:
                    tracker = json.load(f)
                    # Check if tracker is from current month, reset if not
                    current_month = datetime.now().strftime('%Y-%m')
                    if tracker.get('month') != current_month:
                        return self._create_new_tracker()
                    return tracker
            else:
                return self._create_new_tracker()
        except Exception as e:
            print(f"Warning: Could not load activity tracker: {e}")
            return self._create_new_tracker()
    
    def _create_new_tracker(self) -> Dict:
        """Create new monthly activity usage tracker"""
        return {
            'month': datetime.now().strftime('%Y-%m'),
            'activity_usage': {},
            'last_updated': datetime.now().isoformat()
        }
    
    def _save_activity_usage_tracker(self):
        """Save activity usage tracker to file"""
        try:
            with open('activity_usage_tracker.json', 'w') as f:
                json.dump(self.activity_usage_tracker, f, indent=2)
        except Exception as e:
            print(f"Warning: Could not save activity tracker: {e}")
    
    def _select_round_robin_activity(self, activities: List[Dict], category: str) -> Dict:
        """Select activity using round-robin with monthly memory"""
        if not activities:
            return None
        
        # Get usage counts for this category
        category_usage = self.activity_usage_tracker['activity_usage'].get(category, {})
        
        # Sort activities by usage count (least used first)
        activities_with_usage = []
        for activity in activities:
            activity_name = activity['name']
            usage_count = category_usage.get(activity_name, 0)
            last_used = category_usage.get(f"{activity_name}_last_used", "never")
            activities_with_usage.append((activity, usage_count, last_used))
        
        # Sort by usage count, then by last used date
        activities_with_usage.sort(key=lambda x: (x[1], x[2]))
        
        # Select the least used activity
        selected_activity = activities_with_usage[0][0]
        
        # Update usage tracker
        if category not in self.activity_usage_tracker['activity_usage']:
            self.activity_usage_tracker['activity_usage'][category] = {}
        
        activity_name = selected_activity['name']
        self.activity_usage_tracker['activity_usage'][category][activity_name] = \
            self.activity_usage_tracker['activity_usage'][category].get(activity_name, 0) + 1
        self.activity_usage_tracker['activity_usage'][category][f"{activity_name}_last_used"] = \
            datetime.now().isoformat()
        
        return selected_activity
    
    def _convert_db_activity_to_daily_activity(self, db_activity: Dict, time_slot: str = None) -> DailyActivity:
        """Convert database activity to DailyActivity object"""
        # Use provided time slot or activity's default time
        if time_slot:
            time_str = time_slot
            duration_str = f"{db_activity.get('duration_minutes', 60)} min"
        else:
            start_time = db_activity.get('time', '12:00 PM')
            duration_min = db_activity.get('duration_minutes', 60)
            time_str = f"{start_time} - {self._add_minutes_to_time(start_time, duration_min)}"
            duration_str = f"{duration_min} min"
        
        return DailyActivity(
            time=time_str,
            duration=duration_str,
            activity=db_activity.get('name', 'Unknown Activity'),
            location=db_activity.get('location', 'TBD'),
            cost=float(db_activity.get('cost_cad', 0)),
            networking_potential=int(db_activity.get('networking_potential', 5)),
            energy_level=db_activity.get('energy_level', 'medium'),
            description=db_activity.get('description', ''),
            tags=db_activity.get('tags', []),
            category=db_activity.get('category', 'general')
        )
    
    def _add_minutes_to_time(self, time_str: str, minutes: int) -> str:
        """Add minutes to a time string (e.g., '2:00 PM' + 90 min = '3:30 PM')"""
        try:
            time_obj = datetime.strptime(time_str, '%I:%M %p')
            new_time = time_obj + timedelta(minutes=minutes)
            return new_time.strftime('%I:%M %p')
        except:
            return "TBD"
        
    def generate_adaptive_schedule(self) -> Dict[str, List[DailyActivity]]:
        """Generate schedule that adapts to current allocation settings"""
        schedule = {}
        current_date = self.start_date
        
        # Get allocation parameters
        params = self.tuner.generate_schedule_parameters()
        weekly_breakdown = params['weekly_breakdown']
        
        while current_date <= self.end_date:
            day_key = current_date.strftime("%A, %B %d, %Y")
            daily_activities = self._generate_adaptive_daily_activities(current_date, weekly_breakdown)
            schedule[day_key] = daily_activities
            current_date += timedelta(days=1)
        
        # Save activity usage tracker after generating schedule
        self._save_activity_usage_tracker()
            
        return schedule
    
    def _generate_adaptive_daily_activities(self, date: date, weekly_breakdown: Dict) -> List[DailyActivity]:
        """Generate daily activities based on allocation settings"""
        activities = []
        is_weekend = date.weekday() >= 5
        day_name = date.strftime("%A")
        
        # Fixed morning routine (always the same)
        activities.extend(self._get_morning_routine(date, is_weekend))
        
        # Work hours (weekdays only)
        if not is_weekend:
            activities.extend(self._get_work_schedule(date))
        
        # Adaptive afternoon/evening activities based on allocation
        if is_weekend:
            activities.extend(self._get_adaptive_weekend_activities(date, weekly_breakdown))
        else:
            activities.extend(self._get_adaptive_weekday_activities(date, weekly_breakdown))
        
        # Evening routine (always the same)
        activities.extend(self._get_evening_routine(date))
        
        return activities
    
    def _get_morning_routine(self, date: datetime.date, is_weekend: bool) -> List[DailyActivity]:
        """Generate morning routine (fixed)"""
        activities = []
        
        # Phase 1: Be Proactive - Wake Up & Intention (6:00 AM - 6:15 AM)
        activities.append(DailyActivity(
            time="6:00 AM - 6:15 AM",
            duration="15 min",
            activity="Be Proactive - Wake Up & Intention",
            location="Home",
            cost=0,
            networking_potential=0,
            energy_level="low",
            description="Wake up, drink water, and consciously choose your attitude and approach for the day",
            tags=["wake-up", "hydration", "proactive", "intention"],
            is_core_requirement=True,
            category="individual"
        ))
        
        # Phase 2: Begin with the End in Mind - Goal Visualization (6:15 AM - 6:45 AM)
        activities.append(DailyActivity(
            time="6:15 AM - 6:45 AM",
            duration="30 min",
            activity="Begin with the End in Mind - Goal Visualization",
            location="Home",
            cost=0,
            networking_potential=0,
            energy_level="low",
            description="Review personal mission statement, visualize daily goals, and align actions with long-term objectives",
            tags=["goals", "mission", "visualization", "planning"],
            is_core_requirement=True,
            category="individual"
        ))
        
        # Phase 3: Physical Exercise - Sharpen the Saw (6:45 AM - 7:15 AM)
        if not is_weekend or date.weekday() == 6:  # Daily except Saturday
            activities.append(DailyActivity(
                time="6:45 AM - 7:15 AM",
                duration="30 min",
                activity="Sharpen the Saw - Physical Exercise",
                location="Home",
                cost=0,
                networking_potential=0,
                energy_level="medium",
                description="30 minutes of exercise: yoga, stretching, or cardio to maintain physical health and energy",
                tags=["fitness", "exercise", "wellness", "renewal"],
                is_core_requirement=True,
                category="individual"
            ))
        
        # Continue with other morning routine phases...
        # (Shortened for brevity - would include all 7 Habits phases)
        
        return activities
    
    def _get_work_schedule(self, date: datetime.date) -> List[DailyActivity]:
        """Generate work schedule (fixed)"""
        activities = []
        
        # Work Hours (9:00 AM - 6:00 PM)
        activities.append(DailyActivity(
            time="9:00 AM - 6:00 PM",
            duration="9 hours",
            activity="Work Hours - Head of Data",
            location="Office",
            cost=0,
            networking_potential=0,
            energy_level="medium",
            description="Regular work hours: 9:00 AM - 6:00 PM. Focus on data initiatives and team leadership",
            tags=["work", "professional", "office", "leadership"],
            is_core_requirement=True,
            category="individual"
        ))
        
        # Commute
        activities.append(DailyActivity(
            time="8:50 AM - 9:00 AM",
            duration="10 min",
            activity="Morning Commute",
            location="Transit",
            cost=0,
            networking_potential=0,
            energy_level="low",
            description="10-minute commute to work",
            tags=["commute", "work", "transit"],
            is_core_requirement=True,
            category="individual"
        ))
        
        activities.append(DailyActivity(
            time="6:00 PM - 6:10 PM",
            duration="10 min",
            activity="Evening Commute",
            location="Transit",
            cost=0,
            networking_potential=0,
            energy_level="low",
            description="10-minute commute from work",
            tags=["commute", "work", "transit"],
            is_core_requirement=True,
            category="individual"
        ))
        
        return activities
    
    def _get_adaptive_weekday_activities(self, date: datetime.date, weekly_breakdown: Dict) -> List[DailyActivity]:
        """Generate adaptive weekday activities based on allocation"""
        activities = []
        day_name = date.strftime("%A")
        
        # Calculate daily hours for each category
        individual_hours = weekly_breakdown['individual_activities']['hours'] / 5  # 5 weekdays
        networking_hours = weekly_breakdown['networking_social']['hours'] / 5
        couple_hours = weekly_breakdown['couple_activities']['hours'] / 5
        
        # Individual activities (running, personal development)
        if day_name in ["Tuesday", "Thursday", "Friday"]:
            activities.append(DailyActivity(
                time="7:00 AM - 8:00 AM",
                duration="1 hour",
                activity=f"{day_name} Run",
                location="High Park Running Trails",
                cost=0,
                networking_potential=0,
                energy_level="high",
                description=f"{day_name} run - 1+ hour solo training for half marathon",
                tags=["running", "fitness", "half-marathon", "solo"],
                is_core_requirement=True,
                category="individual"
            ))
        
        # PRIORITY: Add fulfilling fitness activities (6:00-8:00 PM) - SWIMMING, TENNIS, YOGA
        if individual_hours >= 1.0:
            # Add swimming activities for appropriate days
            swimming_activities = self._get_activities_by_schedule_type('fitness_class')
            day_swimming = [act for act in swimming_activities if act.get('day_of_week') == day_name and 'swim' in act['name'].lower()]
            if day_swimming:
                swim_activity = self._select_round_robin_activity(day_swimming, f'swimming_{day_name.lower()}')
                if swim_activity:
                    activities.append(self._convert_db_activity_to_daily_activity(swim_activity, "6:00 PM - 7:30 PM"))
            
            # Add tennis activities for weekdays (if no swimming)
            elif not day_swimming:
                tennis_activities = self._get_activities_by_schedule_type('tennis_schedule')
                day_tennis = [act for act in tennis_activities if act.get('day_of_week') == day_name]
                if day_tennis:
                    tennis_activity = self._select_round_robin_activity(day_tennis, f'tennis_{day_name.lower()}')
                    if tennis_activity:
                        activities.append(self._convert_db_activity_to_daily_activity(tennis_activity, "6:00 PM - 7:00 PM"))
        
        # Meaningful networking (limit drinking events to 1-2x per week max)
        if networking_hours >= 1.5:
            # Prioritize professional and cultural events over drinking
            social_events = self._get_activities_by_schedule_type('social_event')
            meaningful_events = [act for act in social_events if not any(word in act['name'].lower() for word in ['wine', 'bar', 'cocktail', 'drinking'])]
            if meaningful_events:
                social_activity = self._select_round_robin_activity(meaningful_events, f'networking_{day_name.lower()}')
                if social_activity:
                    activities.append(self._convert_db_activity_to_daily_activity(social_activity, "7:30 PM - 9:00 PM"))
        
        # Couple activities (dinner, evening time)
        if couple_hours >= 1.0:
            activities.append(DailyActivity(
                time="8:30 PM - 9:30 PM",
                duration="1 hour",
                activity="Evening Connection with Peter",
                location="Home",
                cost=0,
                networking_potential=0,
                energy_level="low",
                description="Quality time together - conversation, planning, connection",
                tags=["couple", "connection", "evening", "quality_time"],
                is_core_requirement=True,
                category="couple"
            ))
        
        return activities
    
    def _get_adaptive_weekend_activities(self, date: datetime.date, weekly_breakdown: Dict) -> List[DailyActivity]:
        """Generate adaptive weekend activities based on allocation"""
        activities = []
        day_name = date.strftime("%A")
        
        # Calculate daily hours for each category (weekends get more time)
        individual_hours = weekly_breakdown['individual_activities']['hours'] / 2  # 2 weekend days
        networking_hours = weekly_breakdown['networking_social']['hours'] / 2
        couple_hours = weekly_breakdown['couple_activities']['hours'] / 2
        
        if day_name == "Saturday":
            # Saturday activities
            activities.extend(self._get_saturday_activities(individual_hours, networking_hours, couple_hours))
        elif day_name == "Sunday":
            # Sunday activities
            activities.extend(self._get_sunday_activities(individual_hours, networking_hours, couple_hours))
        
        return activities
    
    def _get_networking_activities(self, day_name: str, available_hours: float) -> List[DailyActivity]:
        """Get networking activities based on available hours"""
        activities = []
        
        # Scale activities based on available hours
        if available_hours >= 2.0:
            if day_name == "Monday":
                activities.append(DailyActivity(
                    time="6:30 PM - 8:30 PM",
                    duration="2 hours",
                    activity="Toronto Data Science Meetup",
                    location="Downtown Toronto",
                    cost=25,
                    networking_potential=8,
                    energy_level="medium",
                    description="Professional networking with data science professionals in Toronto",
                    tags=["networking", "data-science", "professional", "tech"],
                    category="networking"
                ))
            elif day_name == "Tuesday":
                activities.append(DailyActivity(
                    time="6:30 PM - 8:30 PM",
                    duration="2 hours",
                    activity="Frontrunners Running Club",
                    location="High Park",
                    cost=15,
                    networking_potential=7,
                    energy_level="high",
                    description="Join Frontrunners or another queer run club for social running",
                    tags=["running", "social", "lgbtq", "fitness", "networking"],
                    category="networking"
                ))
            # Add other weekday networking activities...
        
        return activities
    
    def _get_couple_activities(self, day_name: str, available_hours: float, is_weekend: bool) -> List[DailyActivity]:
        """Get couple activities based on available hours"""
        activities = []
        
        # Scale dinner time based on available hours
        dinner_duration = 1.0 if not is_weekend else min(1.5, available_hours * 0.3)
        
        activities.append(DailyActivity(
            time="8:30 PM - 9:30 PM" if not is_weekend else "8:00 PM - 9:30 PM",
            duration=f"{dinner_duration} hours",
            activity="Dinner with Peter",
            location="Home/Restaurant",
            cost=30,
            networking_potential=0,
            energy_level="low",
            description="Dinner together to connect and discuss the day",
            tags=["dinner", "couple", "connection", "family"],
            is_core_requirement=True,
            category="couple"
        ))
        
        return activities
    
    def _get_saturday_activities(self, individual_hours: float, networking_hours: float, couple_hours: float) -> List[DailyActivity]:
        """Get Saturday activities based on allocation - NOW USING DATABASE"""
        activities = []
        
        # Add recreational activities from database (individual)
        recreation_activities = self._get_activities_by_schedule_type('recreation_schedule')
        if recreation_activities and individual_hours >= 1.5:
            # Look for Saturday recreational activities
            saturday_recreation = [act for act in recreation_activities if act.get('day_of_week') == 'Saturday']
            if saturday_recreation:
                recreation_activity = random.choice(saturday_recreation)
                activities.append(self._convert_db_activity_to_daily_activity(recreation_activity))
        
        # Add Peter's friends activities from database (couple)
        social_activities = self._get_activities_by_schedule_type('social_schedule')
        if social_activities and couple_hours >= 2.0:
            # Look for Saturday social activities
            saturday_social = [act for act in social_activities if act.get('day_of_week') == 'Saturday']
            if saturday_social:
                social_activity = random.choice(saturday_social)
                activities.append(self._convert_db_activity_to_daily_activity(social_activity))
        
        # Add LGBTQ+ activities from database (couple)
        lgbtq_activities = self._get_activities_by_schedule_type('lgbtq_schedule')
        if lgbtq_activities and couple_hours >= 2.5:
            # Look for Saturday LGBTQ+ activities
            saturday_lgbtq = [act for act in lgbtq_activities if act.get('day_of_week') == 'Saturday']
            if saturday_lgbtq:
                lgbtq_activity = random.choice(saturday_lgbtq)
                activities.append(self._convert_db_activity_to_daily_activity(lgbtq_activity))
        
        # Add Couple's Activity Book activities from database
        couples_book_activities = self._get_activities_by_schedule_type('couples_activity_book')
        if couples_book_activities and couple_hours >= 2.0:
            # Look for Saturday couple's book activities
            saturday_couples = [act for act in couples_book_activities if act.get('day_of_week') == 'Saturday']
            if saturday_couples:
                couples_activity = self._select_round_robin_activity(saturday_couples, 'couples_book_saturday')
                if couples_activity:
                    activities.append(self._convert_db_activity_to_daily_activity(couples_activity))
        
        # Add tennis activities from database (individual)
        tennis_activities = self._get_activities_by_schedule_type('tennis_schedule')
        if tennis_activities and individual_hours >= 1.0:
            saturday_tennis = [act for act in tennis_activities if act.get('day_of_week') == 'Saturday']
            if saturday_tennis:
                tennis_activity = self._select_round_robin_activity(saturday_tennis, 'tennis_saturday')
                if tennis_activity:
                    activities.append(self._convert_db_activity_to_daily_activity(tennis_activity))
        
        # Add fitness classes from database (individual)
        fitness_activities = self._get_activities_by_schedule_type('fitness_class')
        if fitness_activities and individual_hours >= 1.5:
            saturday_fitness = [act for act in fitness_activities if act.get('day_of_week') == 'Saturday']
            if saturday_fitness:
                fitness_activity = random.choice(saturday_fitness)
                activities.append(self._convert_db_activity_to_daily_activity(fitness_activity))
        
        # Add social events from database (networking)
        social_events = self._get_activities_by_schedule_type('social_event')
        if social_events and networking_hours >= 2.0:
            saturday_social = [act for act in social_events if act.get('day_of_week') == 'Saturday']
            if saturday_social:
                social_activity = random.choice(saturday_social)
                activities.append(self._convert_db_activity_to_daily_activity(social_activity))
        
        return activities
    
    def _get_sunday_activities(self, individual_hours: float, networking_hours: float, couple_hours: float) -> List[DailyActivity]:
        """Get Sunday activities based on allocation"""
        activities = []
        
        # Long run (individual)
        if individual_hours >= 2.0:
            activities.append(DailyActivity(
                time="8:00 AM - 10:00 AM",
                duration="2 hours",
                activity="Sunday Long Run",
                location="Running Route",
                cost=0,
                networking_potential=0,
                energy_level="high",
                description="Sunday long run - 2+ hours solo training for half marathon",
                tags=["running", "fitness", "half-marathon", "long-run", "solo"],
                is_core_requirement=True,
                category="individual"
            ))
        
        # Add church activities from database (couple activities)
        church_activities = self._get_activities_by_schedule_type('church_schedule')
        if church_activities and couple_hours >= 1.0:
            # Round-robin select a church activity for variety
            church_activity = self._select_round_robin_activity(church_activities, 'church_sunday')
            if church_activity:
                activities.append(self._convert_db_activity_to_daily_activity(church_activity))
        
        # Add family activities from database  
        family_activities = self._get_activities_by_schedule_type('family_schedule')
        if family_activities and couple_hours >= 2.0:
            # Look for Sunday family activities
            sunday_family = [act for act in family_activities if 'Sunday' in act.get('name', '')]
            if sunday_family:
                family_activity = random.choice(sunday_family)
                activities.append(self._convert_db_activity_to_daily_activity(family_activity))
        
        # Add LGBTQ+ community activities from database
        lgbtq_activities = self._get_activities_by_schedule_type('lgbtq_schedule')
        if lgbtq_activities and couple_hours >= 2.5:
            # Look for Sunday LGBTQ+ activities
            sunday_lgbtq = [act for act in lgbtq_activities if act.get('day_of_week') == 'Sunday']
            if sunday_lgbtq:
                lgbtq_activity = random.choice(sunday_lgbtq)
                activities.append(self._convert_db_activity_to_daily_activity(lgbtq_activity))
        
        # Add Couple's Activity Book activities from database
        couples_book_activities = self._get_activities_by_schedule_type('couples_activity_book')
        if couples_book_activities and couple_hours >= 1.5:
            # Look for Sunday couple's book activities
            sunday_couples = [act for act in couples_book_activities if act.get('day_of_week') == 'Sunday']
            if sunday_couples:
                couples_activity = random.choice(sunday_couples)
                activities.append(self._convert_db_activity_to_daily_activity(couples_activity))
        
        # Add fitness classes from database (individual)
        fitness_activities = self._get_activities_by_schedule_type('fitness_class')
        if fitness_activities and individual_hours >= 1.0:
            sunday_fitness = [act for act in fitness_activities if act.get('day_of_week') == 'Sunday']
            if sunday_fitness:
                fitness_activity = random.choice(sunday_fitness)
                activities.append(self._convert_db_activity_to_daily_activity(fitness_activity))
        
        return activities
    
    def _get_evening_routine(self, date: datetime.date) -> List[DailyActivity]:
        """Generate evening routine (fixed)"""
        activities = []
        
        # Evening Wind-down (9:30 PM - 10:30 PM)
        activities.append(DailyActivity(
            time="9:30 PM - 10:30 PM",
            duration="1 hour",
            activity="Evening Wind-down with Peter",
            location="Home",
            cost=0,
            networking_potential=0,
            energy_level="low",
            description="Shared reflection, planning, and connection time",
            tags=["reflection", "planning", "couple", "wind-down"],
            is_core_requirement=True,
            category="couple"
        ))
        
        return activities
    
    def export_schedule(self, schedule: Dict[str, List[DailyActivity]], filename: str = None) -> str:
        """Export schedule to markdown file"""
        if filename is None:
            filename = f"kevin_adaptive_schedule_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        
        with open(filename, 'w') as f:
            f.write("# 🎯 KEVIN'S ADAPTIVE DAILY SCHEDULE\n")
            f.write("📅 **September 15 - October 15, 2025**\n")
            f.write("=" * 80 + "\n\n")
            
            for day, activities in schedule.items():
                f.write(f"## {day}\n\n")
                
                # Calculate day summary
                total_cost = sum(activity.cost for activity in activities)
                networking_activities = [a for a in activities if a.networking_potential > 0]
                couple_activities = [a for a in activities if a.category == "couple"]
                individual_activities = [a for a in activities if a.category == "individual"]
                
                f.write(f"**📊 Day Summary:**\n")
                f.write(f"- Total Activities: {len(activities)}\n")
                f.write(f"- Individual Activities: {len(individual_activities)}\n")
                f.write(f"- Networking Activities: {len(networking_activities)}\n")
                f.write(f"- Couple Activities: {len(couple_activities)}\n")
                f.write(f"- Total Cost: ${total_cost:.0f} CAD\n\n")
                
                # Write activities
                for activity in activities:
                    priority_marker = "🎯" if activity.is_core_requirement else "📅"
                    category_marker = f" [{activity.category.upper()}]" if activity.category != "general" else ""
                    networking_marker = f" (Networking: {activity.networking_potential}/10)" if activity.networking_potential > 0 else ""
                    cost_marker = f" - ${activity.cost:.0f}" if activity.cost > 0 else ""
                    
                    f.write(f"{priority_marker} **{activity.time}** - {activity.activity}{category_marker}\n")
                    f.write(f"   📍 {activity.location}{cost_marker}{networking_marker}\n")
                    f.write(f"   ⚡ Energy Level: {activity.energy_level.title()}\n")
                    f.write(f"   📝 {activity.description}\n")
                    f.write(f"   🏷️ Tags: {', '.join(activity.tags)}\n\n")
                
                f.write("-" * 80 + "\n\n")
        
        return filename


def main():
    """Demo the enhanced schedule generator"""
    print("🎛️ ENHANCED SCHEDULE GENERATOR DEMO")
    print("=" * 50)
    print()
    
    # Create tuner and generator
    tuner = TimeAllocationTuner()
    generator = EnhancedScheduleGenerator(tuner)
    
    # Show current allocation
    print("📊 CURRENT ALLOCATION:")
    tuner.print_allocation_report()
    print()
    
    # Generate adaptive schedule
    print("🔄 GENERATING ADAPTIVE SCHEDULE...")
    schedule = generator.generate_adaptive_schedule()
    
    # Export schedule
    filename = generator.export_schedule(schedule)
    print(f"✅ Schedule exported to: {filename}")
    
    # Demo: Adjust allocation and regenerate
    print("\n🔧 ADJUSTING ALLOCATION...")
    tuner.update_allocation(
        individual_activities_percent=10.0,  # Decrease individual time
        couple_activities_percent=30.0,      # Increase couple time
        networking_social_percent=20.0       # Slight decrease in networking
    )
    
    print("📊 UPDATED ALLOCATION:")
    tuner.print_allocation_report()
    
    # Regenerate schedule with new allocation
    print("\n🔄 REGENERATING SCHEDULE WITH NEW ALLOCATION...")
    new_schedule = generator.generate_adaptive_schedule()
    new_filename = generator.export_schedule(new_schedule, "kevin_updated_schedule.md")
    print(f"✅ Updated schedule exported to: {new_filename}")


if __name__ == "__main__":
    main()
