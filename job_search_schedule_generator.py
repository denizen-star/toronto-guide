"""
Job Search Kevin Schedule Generator
Replaces 9AM-6PM work with job search activities and skill development
"""

import json
import os
import random
from datetime import datetime, date, timedelta
from typing import Dict, List, Optional
from dataclasses import dataclass
from time_allocation_tuner import TimeAllocationTuner
from enhanced_schedule_generator import DailyActivity


class JobSearchScheduleGenerator:
    """Generate schedules for Job Search Kevin - no traditional work, focus on career transition"""
    
    def __init__(self, time_tuner: TimeAllocationTuner):
        self.time_tuner = time_tuner
        self.activity_database = self._load_activity_database()
        self.activity_usage_tracker = self._load_activity_usage_tracker()
        
    def _load_activity_database(self) -> Dict:
        """Load activities from JSON database"""
        try:
            with open('data/activities/my_complete_activity_schedule.json', 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"activities": []}
    
    def _load_activity_usage_tracker(self) -> Dict:
        """Load or create activity usage tracker for round-robin selection"""
        tracker_path = 'job_search_activity_usage_tracker.json'
        try:
            with open(tracker_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return self._create_new_tracker()
    
    def _create_new_tracker(self) -> Dict:
        """Create new activity usage tracker"""
        return {
            "last_reset": datetime.now().strftime("%Y-%m-%d"),
            "activities": {}
        }
    
    def _save_activity_usage_tracker(self):
        """Save activity usage tracker to file"""
        with open('job_search_activity_usage_tracker.json', 'w') as f:
            json.dump(self.activity_usage_tracker, f, indent=2)
    
    def _select_round_robin_activity(self, activities: List[Dict], category_key: str) -> Optional[Dict]:
        """Select activity using round-robin with monthly reset"""
        if not activities:
            return None
            
        # Check if we need to reset monthly
        current_month = datetime.now().strftime("%Y-%m")
        last_reset = self.activity_usage_tracker.get("last_reset", "")
        
        if not last_reset.startswith(current_month[:7]):  # Different month
            self.activity_usage_tracker["activities"] = {}
            self.activity_usage_tracker["last_reset"] = datetime.now().strftime("%Y-%m-%d")
        
        # Get usage counts for this category
        category_usage = self.activity_usage_tracker["activities"].get(category_key, {})
        
        # Find least used activities
        min_usage = min([category_usage.get(act["name"], 0) for act in activities])
        least_used = [act for act in activities if category_usage.get(act["name"], 0) == min_usage]
        
        # Select random from least used
        selected = random.choice(least_used)
        
        # Update usage count
        if category_key not in self.activity_usage_tracker["activities"]:
            self.activity_usage_tracker["activities"][category_key] = {}
        
        current_count = self.activity_usage_tracker["activities"][category_key].get(selected["name"], 0)
        self.activity_usage_tracker["activities"][category_key][selected["name"]] = current_count + 1
        
        return selected
    
    def _get_activities_by_schedule_type(self, schedule_type: str) -> List[Dict]:
        """Get activities by schedule type"""
        return [act for act in self.activity_database["activities"] 
                if act.get("schedule_type") == schedule_type]
    
    def _convert_db_activity_to_daily_activity(self, db_activity: Dict, time_slot: str) -> DailyActivity:
        """Convert database activity to DailyActivity object"""
        return DailyActivity(
            time=time_slot,
            duration=db_activity.get("duration", "1 hour"),
            activity=db_activity["name"],
            location=db_activity.get("location", "TBD"),
            cost=db_activity.get("cost", 0),
            networking_potential=db_activity.get("networking_potential", 0),
            energy_level=db_activity.get("energy_level", "medium"),
            description=db_activity.get("description", ""),
            tags=db_activity.get("tags", []),
            is_core_requirement=db_activity.get("is_core_requirement", False),
            category=db_activity.get("category", "individual")
        )
    
    def generate_job_search_schedule(self) -> Dict[str, List[DailyActivity]]:
        """Generate a week of job search schedules"""
        schedule = {}
        
        # Generate for next 7 days
        start_date = datetime.now().date()
        for i in range(7):
            current_date = start_date + timedelta(days=i)
            day_key = current_date.strftime("%A, %B %d, %Y")
            schedule[day_key] = self._generate_job_search_daily_activities(current_date)
        
        # Save usage tracker
        self._save_activity_usage_tracker()
        return schedule
    
    def _generate_job_search_daily_activities(self, date: date) -> List[DailyActivity]:
        """Generate daily activities for job search Kevin"""
        activities = []
        is_weekend = date.weekday() >= 5
        day_name = date.strftime("%A")
        
        # Same morning routine (6:00-9:00 AM)
        activities.extend(self._get_morning_routine(date, is_weekend))
        
        if not is_weekend:
            # JOB SEARCH WEEKDAY STRUCTURE
            activities.extend(self._get_job_search_activities(date))
        else:
            # Weekend activities (similar to working Kevin)
            activities.extend(self._get_weekend_activities(date))
        
        # Same evening routine
        activities.extend(self._get_evening_routine(date))
        
        return activities
    
    def _get_morning_routine(self, date: date, is_weekend: bool) -> List[DailyActivity]:
        """Same morning routine as working Kevin"""
        activities = []
        day_name = date.strftime("%A")
        
        # 7 Habits morning routine
        activities.append(DailyActivity(
            time="6:00 AM - 6:15 AM",
            duration="15 minutes",
            activity="Be Proactive - Wake Up & Intention",
            location="Home",
            cost=0,
            networking_potential=0,
            energy_level="medium",
            description="Set daily intentions and proactive mindset",
            tags=["morning", "7habits", "proactive"],
            is_core_requirement=True,
            category="personal_development"
        ))
        
        activities.append(DailyActivity(
            time="6:15 AM - 6:45 AM",
            duration="30 minutes",
            activity="Begin with the End in Mind - Goal Visualization",
            location="Home",
            cost=0,
            networking_potential=0,
            energy_level="low",
            description="Visualize career goals and daily objectives",
            tags=["morning", "7habits", "goals"],
            is_core_requirement=True,
            category="personal_development"
        ))
        
        activities.append(DailyActivity(
            time="6:45 AM - 7:15 AM",
            duration="30 minutes",
            activity="Sharpen the Saw - Physical Exercise",
            location="Home",
            cost=0,
            networking_potential=0,
            energy_level="high",
            description="Morning exercise or stretching",
            tags=["morning", "7habits", "exercise"],
            is_core_requirement=True,
            category="fitness"
        ))
        
        # Running on specific days
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
        
        return activities
    
    def _get_job_search_activities(self, date: date) -> List[DailyActivity]:
        """Job search activities replacing 9AM-6PM work"""
        activities = []
        day_name = date.strftime("%A")
        
        # 9:00 AM - 12:00 PM: JOB SEARCH SPRINT
        job_search_activities = [
            "Resume & Portfolio Updates",
            "Job Applications (5-10 targeted applications)",
            "LinkedIn Networking & Outreach",
            "Company Research & Application Prep",
            "Cover Letter Writing & Customization",
            "Interview Practice & Skill Prep",
            "Professional Network Expansion",
            "Industry Research & Trend Analysis"
        ]
        
        daily_job_activity = random.choice(job_search_activities)
        activities.append(DailyActivity(
            time="9:00 AM - 12:00 PM",
            duration="3 hours",
            activity=f"Job Search Sprint: {daily_job_activity}",
            location="Home Office / Co-working Space",
            cost=0,
            networking_potential=8,
            energy_level="high",
            description="Focused job search work - treat like important work sprint",
            tags=["job_search", "career", "networking", "professional"],
            is_core_requirement=True,
            category="career_development"
        ))
        
        # 12:00 PM - 2:00 PM: CITY EXPLORATION BREAK
        exploration_activities = [
            "New Cafe Discovery in Downtown",
            "High Park Walking & Nature Break",
            "Harbourfront Centre Exploration",
            "Distillery District Coffee & Walk",
            "Queen Street West Neighborhood Walk",
            "Toronto Islands Ferry & Walk",
            "Kensington Market Exploration",
            "ROM or AGO Quick Visit"
        ]
        
        daily_exploration = random.choice(exploration_activities)
        activities.append(DailyActivity(
            time="12:00 PM - 2:00 PM",
            duration="2 hours",
            activity=f"City Break: {daily_exploration}",
            location="Various Toronto Locations",
            cost=15,
            networking_potential=2,
            energy_level="medium",
            description="Get out of living space, explore Toronto, mental reset",
            tags=["exploration", "mental_health", "toronto", "break"],
            is_core_requirement=True,
            category="personal_wellness"
        ))
        
        # 2:00 PM - 5:00 PM: SKILL DEVELOPMENT + SPORTS
        # Alternate between skill development and sports
        if date.weekday() % 2 == 0:  # Mon, Wed, Fri - Skills
            skill_activities = [
                "Data Science Course (Coursera/edX)",
                "Python/R Programming Practice",
                "Machine Learning Project Work",
                "Portfolio Project Development",
                "Technical Interview Prep",
                "Industry Certification Study",
                "Online Workshop Attendance",
                "Professional Skill Building"
            ]
            
            daily_skill = random.choice(skill_activities)
            activities.append(DailyActivity(
                time="2:00 PM - 4:00 PM",
                duration="2 hours",
                activity=f"Skill Development: {daily_skill}",
                location="Home / Library / Co-working",
                cost=0,
                networking_potential=3,
                energy_level="medium",
                description="Invest in professional skills and knowledge",
                tags=["skill_development", "learning", "career", "growth"],
                is_core_requirement=True,
                category="professional_development"
            ))
            
            # Add sports activity
            activities.append(DailyActivity(
                time="4:00 PM - 5:00 PM",
                duration="1 hour",
                activity="Individual Sports Session",
                location="Local Courts/Facilities",
                cost=25,
                networking_potential=1,
                energy_level="high",
                description="Tennis, swimming, padel, or golf practice",
                tags=["sports", "fitness", "individual"],
                is_core_requirement=True,
                category="fitness"
            ))
            
        else:  # Tue, Thu - Extended Sports
            # Get sports activities from database
            sports_activities = self._get_activities_by_schedule_type('fitness_class')
            sports_activities.extend(self._get_activities_by_schedule_type('tennis_schedule'))
            
            if sports_activities:
                sport_activity = self._select_round_robin_activity(sports_activities, f'afternoon_sports_{day_name.lower()}')
                if sport_activity:
                    activities.append(self._convert_db_activity_to_daily_activity(sport_activity, "2:00 PM - 4:00 PM"))
            
            # Personal errands/tasks
            activities.append(DailyActivity(
                time="4:00 PM - 5:00 PM",
                duration="1 hour",
                activity="Personal Tasks & Errands",
                location="Various",
                cost=10,
                networking_potential=0,
                energy_level="low",
                description="Handle personal admin, errands, life tasks",
                tags=["errands", "personal", "admin"],
                is_core_requirement=False,
                category="personal_maintenance"
            ))
        
        return activities
    
    def _get_weekend_activities(self, date: date) -> List[DailyActivity]:
        """Weekend activities - similar to working Kevin but more flexible timing"""
        activities = []
        day_name = date.strftime("%A")
        
        if day_name == "Saturday":
            activities.extend(self._get_saturday_activities())
        elif day_name == "Sunday":
            activities.extend(self._get_sunday_activities())
        
        return activities
    
    def _get_saturday_activities(self) -> List[DailyActivity]:
        """Saturday activities for job search Kevin"""
        activities = []
        
        # Tennis
        tennis_activities = self._get_activities_by_schedule_type('tennis_schedule')
        if tennis_activities:
            tennis_activity = self._select_round_robin_activity(tennis_activities, 'saturday_tennis')
            if tennis_activity:
                activities.append(self._convert_db_activity_to_daily_activity(tennis_activity, "10:00 AM - 11:00 AM"))
        
        # Social activities
        social_events = self._get_activities_by_schedule_type('social_event')
        if social_events:
            social_activity = self._select_round_robin_activity(social_events, 'saturday_social')
            if social_activity:
                activities.append(self._convert_db_activity_to_daily_activity(social_activity, "7:00 PM - 9:00 PM"))
        
        return activities
    
    def _get_sunday_activities(self) -> List[DailyActivity]:
        """Sunday activities for job search Kevin"""
        activities = []
        
        # Church
        church_activities = self._get_activities_by_schedule_type('church')
        if church_activities:
            church_activity = self._select_round_robin_activity(church_activities, 'sunday_church')
            if church_activity:
                activities.append(self._convert_db_activity_to_daily_activity(church_activity, "10:00 AM - 11:00 AM"))
        
        # Family time
        family_activities = self._get_activities_by_schedule_type('peter_family')
        if family_activities:
            family_activity = self._select_round_robin_activity(family_activities, 'sunday_family')
            if family_activity:
                activities.append(self._convert_db_activity_to_daily_activity(family_activity, "2:00 PM - 4:00 PM"))
        
        return activities
    
    def _get_evening_routine(self, date: date) -> List[DailyActivity]:
        """Same evening routine as working Kevin"""
        activities = []
        
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
        
        activities.append(DailyActivity(
            time="9:30 PM - 10:30 PM",
            duration="1 hour",
            activity="Evening Wind-down with Peter",
            location="Home",
            cost=0,
            networking_potential=0,
            energy_level="low",
            description="Relaxing evening routine together",
            tags=["couple", "relaxation", "evening", "wind_down"],
            is_core_requirement=True,
            category="couple"
        ))
        
        return activities
