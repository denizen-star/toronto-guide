"""
Unified Life Planner Agent - Single agent for all planning types
"""

import json
from typing import Dict, List, Optional
from datetime import datetime, timedelta

from ...shared.models import Activity, Persona, Schedule, ScheduleType, TimeSlot, ActivityType
from ...shared.utils import TimeUtils, ValidationUtils
from ...shared.exceptions import ValidationError, ScheduleGenerationError
from ...features.configuration import AppSettings
from ...features.activities import ActivityService
from ...features.personas import PersonaService
from .base_planner import BasePlanner


class LifePlannerAgent(BasePlanner):
    """Unified life planning agent for all schedule types"""
    
    def __init__(self, settings: AppSettings, persona: Optional[Persona] = None,
                 activity_service: Optional[ActivityService] = None,
                 persona_service: Optional[PersonaService] = None):
        super().__init__(settings, persona, activity_service, persona_service)
        self.schedule_type = ScheduleType.INTEGRATED
    
    def generate_schedule(self, start_date: str, duration: str, 
                         schedule_type: str = "integrated",
                         focus_areas: Optional[List[str]] = None) -> Dict:
        """Generate schedule based on type and focus areas"""
        
        # Validate inputs
        validation_issues = self._validate_schedule_inputs(start_date, duration)
        if validation_issues:
            raise ValidationError(f"Schedule validation failed: {', '.join(validation_issues)}")
        
        # Set schedule type
        self.schedule_type = ScheduleType(schedule_type)
        
        start_dt = datetime.strptime(start_date, "%Y-%m-%d")
        days = TimeUtils.get_duration_days(start_date, duration)
        
        if schedule_type == "individual":
            return self._generate_individual_schedule(start_dt, days, focus_areas)
        elif schedule_type == "couple":
            return self._generate_couple_schedule(start_dt, days, focus_areas)
        else:  # integrated
            return self._generate_integrated_schedule(start_dt, days, focus_areas)
    
    def _load_activities(self):
        """Load activities from service layer (inherited from BasePlanner)"""
        # This method is already implemented in BasePlanner
        super()._load_activities()
    
    def _generate_individual_schedule(self, start_dt: datetime, days: int, 
                                    focus_areas: Optional[List[str]]) -> Dict:
        """Generate individual lifestyle schedule"""
        schedule = Schedule(
            schedule_type=ScheduleType.INDIVIDUAL,
            start_date=start_dt.strftime("%Y-%m-%d"),
            duration=f"{days} days",
            focus_areas=focus_areas or []
        )
        
        current_date = start_dt
        for day_num in range(1, days + 1):
            day_key = TimeUtils.format_date_key(day_num, current_date)
            is_weekend = TimeUtils.is_weekend(current_date)
            
            # Generate daily schedule
            day_slots = self._generate_individual_day_schedule(current_date, is_weekend, focus_areas)
            
            # Add to schedule
            for slot in day_slots:
                schedule.add_time_slot(slot)
            
            current_date += timedelta(days=1)
        
        # Generate acknowledgment and summary
        acknowledgment = self._generate_acknowledgment(
            start_dt.strftime("%Y-%m-%d"), 
            f"{days} days", 
            "Individual", 
            focus_areas
        )
        
        summary = self._generate_summary(schedule)
        
        return {
            "acknowledgment": acknowledgment,
            "schedule": schedule.to_dict(),
            "summary": summary,
            "stats": self.get_activity_stats()
        }
    
    def _generate_couple_schedule(self, start_dt: datetime, days: int, 
                                focus_areas: Optional[List[str]]) -> Dict:
        """Generate couple-focused schedule"""
        schedule = Schedule(
            schedule_type=ScheduleType.COUPLE,
            start_date=start_dt.strftime("%Y-%m-%d"),
            duration=f"{days} days",
            focus_areas=focus_areas or []
        )
        
        current_date = start_dt
        for day_num in range(1, days + 1):
            day_key = TimeUtils.format_date_key(day_num, current_date)
            is_weekend = TimeUtils.is_weekend(current_date)
            
            # Generate daily couple schedule
            day_slots = self._generate_couple_day_schedule(current_date, is_weekend, focus_areas)
            
            # Add to schedule
            for slot in day_slots:
                schedule.add_time_slot(slot)
            
            current_date += timedelta(days=1)
        
        # Generate acknowledgment and summary
        acknowledgment = self._generate_acknowledgment(
            start_dt.strftime("%Y-%m-%d"), 
            f"{days} days", 
            "Couple", 
            focus_areas
        )
        
        summary = self._generate_summary(schedule)
        
        return {
            "acknowledgment": acknowledgment,
            "schedule": schedule.to_dict(),
            "summary": summary,
            "stats": self.get_activity_stats()
        }
    
    def _generate_integrated_schedule(self, start_dt: datetime, days: int, 
                                    focus_areas: Optional[List[str]]) -> Dict:
        """Generate integrated individual + couple schedule"""
        schedule = Schedule(
            schedule_type=ScheduleType.INTEGRATED,
            start_date=start_dt.strftime("%Y-%m-%d"),
            duration=f"{days} days",
            focus_areas=focus_areas or []
        )
        
        current_date = start_dt
        for day_num in range(1, days + 1):
            day_key = TimeUtils.format_date_key(day_num, current_date)
            is_weekend = TimeUtils.is_weekend(current_date)
            
            # Generate integrated daily schedule
            day_slots = self._generate_integrated_day_schedule(current_date, is_weekend, focus_areas)
            
            # Add to schedule
            for slot in day_slots:
                schedule.add_time_slot(slot)
            
            current_date += timedelta(days=1)
        
        # Generate acknowledgment and summary
        acknowledgment = self._generate_acknowledgment(
            start_dt.strftime("%Y-%m-%d"), 
            f"{days} days", 
            "Integrated", 
            focus_areas
        )
        
        summary = self._generate_summary(schedule)
        
        return {
            "acknowledgment": acknowledgment,
            "schedule": schedule.to_dict(),
            "summary": summary,
            "stats": self.get_activity_stats()
        }
    
    def _generate_individual_day_schedule(self, date: datetime, is_weekend: bool, 
                                        focus_areas: Optional[List[str]]) -> List[TimeSlot]:
        """Generate individual daily schedule"""
        time_slots = []
        
        # Morning routine
        morning_activity = self._select_activity("morning_routine", min_networking=0)
        if morning_activity:
            time_slots.append(self._create_time_slot(
                self.settings.morning_start, morning_activity,
                "Morning routine and preparation"
            ))
        
        # Work hours (weekdays only)
        if not is_weekend and date.weekday() < 5:
            work_activity = self._select_activity("professional", min_networking=0)
            if work_activity:
                time_slots.append(self._create_time_slot(
                    self.settings.core_requirements.work_hours["start"],
                    work_activity,
                    "Work hours"
                ))
        
        # Main activity (afternoon/evening)
        main_activity = self._select_activity("social", min_networking=5)
        if main_activity:
            start_time = "2:00 PM" if is_weekend else "6:00 PM"
            time_slots.append(self._create_time_slot(
                start_time, main_activity,
                "Main social or networking activity"
            ))
        
        # Evening routine
        evening_activity = self._select_activity("evening_routine", min_networking=0)
        if evening_activity:
            time_slots.append(self._create_time_slot(
                "9:30 PM", evening_activity,
                "Evening wind-down routine"
            ))
        
        # Sort and resolve conflicts
        time_slots = self._sort_time_slots(time_slots)
        time_slots = self._resolve_time_conflicts(time_slots)
        
        return time_slots
    
    def _generate_couple_day_schedule(self, date: datetime, is_weekend: bool, 
                                    focus_areas: Optional[List[str]]) -> List[TimeSlot]:
        """Generate couple daily schedule"""
        time_slots = []
        
        # Morning connection
        morning_activity = self._select_activity("daily_connection", min_networking=0)
        if morning_activity:
            time_slots.append(self._create_time_slot(
                "7:00 AM", morning_activity,
                "Morning connection time", is_habit_stacked=True
            ))
        
        # Main couple activity
        main_activity = self._select_activity("quality_time", min_networking=0)
        if main_activity:
            start_time = "2:00 PM" if is_weekend else "7:00 PM"
            time_slots.append(self._create_time_slot(
                start_time, main_activity,
                "Main couple activity"
            ))
        
        # Evening connection
        evening_activity = self._select_activity("daily_connection", min_networking=0)
        if evening_activity:
            time_slots.append(self._create_time_slot(
                "9:30 PM", evening_activity,
                "Evening connection time", is_habit_stacked=True
            ))
        
        # Weekly emotional check-in (Sundays)
        if date.weekday() == 6:  # Sunday
            check_in_activity = self._select_activity("emotional_safety", min_networking=0)
            if check_in_activity:
                time_slots.append(self._create_time_slot(
                    "10:00 AM", check_in_activity,
                    "Weekly emotional check-in", emotional_check_in=True
                ))
        
        # Sort and resolve conflicts
        time_slots = self._sort_time_slots(time_slots)
        time_slots = self._resolve_time_conflicts(time_slots)
        
        return time_slots
    
    def _generate_integrated_day_schedule(self, date: datetime, is_weekend: bool, 
                                        focus_areas: Optional[List[str]]) -> List[TimeSlot]:
        """Generate integrated daily schedule combining individual and couple activities"""
        time_slots = []
        
        # Morning routine (individual)
        morning_activity = self._select_activity("morning_routine", min_networking=0)
        if morning_activity:
            time_slots.append(self._create_time_slot(
                self.settings.morning_start, morning_activity,
                "Morning routine and preparation"
            ))
        
        # Work hours (weekdays only)
        if not is_weekend and date.weekday() < 5:
            work_activity = self._select_activity("professional", min_networking=0)
            if work_activity:
                time_slots.append(self._create_time_slot(
                    self.settings.core_requirements.work_hours["start"],
                    work_activity,
                    "Work hours"
                ))
        
        # Main individual activity
        individual_activity = self._select_activity("social", min_networking=5)
        if individual_activity:
            start_time = "2:00 PM" if is_weekend else "6:00 PM"
            time_slots.append(self._create_time_slot(
                start_time, individual_activity,
                "Individual social or networking activity"
            ))
        
        # Couple activity
        couple_activity = self._select_activity("quality_time", min_networking=0)
        if couple_activity:
            couple_start = "4:00 PM" if is_weekend else "8:00 PM"
            time_slots.append(self._create_time_slot(
                couple_start, couple_activity,
                "Couple quality time"
            ))
        
        # Evening routine (individual)
        evening_activity = self._select_activity("evening_routine", min_networking=0)
        if evening_activity:
            time_slots.append(self._create_time_slot(
                "9:30 PM", evening_activity,
                "Evening wind-down routine"
            ))
        
        # Sort and resolve conflicts
        time_slots = self._sort_time_slots(time_slots)
        time_slots = self._resolve_time_conflicts(time_slots)
        
        return time_slots
