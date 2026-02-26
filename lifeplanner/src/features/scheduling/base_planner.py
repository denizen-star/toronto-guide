"""
Base planner abstract class for all scheduling functionality
"""

from abc import ABC, abstractmethod
from typing import Dict, List, Optional, Set
from datetime import datetime

from ...shared.models import Activity, Persona, Schedule, ScheduleType, TimeSlot
from ...shared.utils import TimeUtils, ValidationUtils
from ...shared.exceptions import ValidationError, PersonaNotFoundError, ActivityNotFoundError
from ...features.configuration import AppSettings
from ...features.activities import ActivityService
from ...features.personas import PersonaService


class BasePlanner(ABC):
    """Abstract base class for all planners"""
    
    def __init__(self, settings: AppSettings, persona: Optional[Persona] = None,
                 activity_service: Optional[ActivityService] = None,
                 persona_service: Optional[PersonaService] = None):
        self.settings = settings
        self.persona = persona
        self.activity_service = activity_service or ActivityService()
        self.persona_service = persona_service or PersonaService()
        self.activities: List[Activity] = []
        self.used_activities: Set[str] = set()
        self._load_activities()
    
    @abstractmethod
    def generate_schedule(self, start_date: str, duration: str, 
                         focus_areas: Optional[List[str]] = None) -> Dict:
        """Generate schedule based on planner type"""
        pass
    
    def _load_activities(self):
        """Load activities from service layer"""
        try:
            self.activities = self.activity_service.get_all_activities()
        except Exception as e:
            print(f"Warning: Could not load activities: {e}")
            self.activities = []
    
    def _apply_persona_preferences(self, activities: List[Activity]) -> List[Activity]:
        """Filter activities based on persona preferences"""
        if not self.persona:
            return activities
        
        filtered_activities = []
        for activity in activities:
            if self._matches_persona(activity):
                filtered_activities.append(activity)
        
        return filtered_activities
    
    def _matches_persona(self, activity: Activity) -> bool:
        """Check if activity matches persona preferences"""
        if not self.persona:
            return True
        
        # Check activity type
        if activity.activity_type.value not in self.persona.preferred_activities:
            return False
        
        # Check if activity type is avoided
        if activity.activity_type.value in self.persona.avoided_activities:
            return False
        
        # Check budget constraints
        if activity.cost_cad > self.persona.max_daily_budget:
            return False
        
        # Check location preferences (if any location matches)
        if (self.persona.preferred_locations and 
            not any(loc in activity.location for loc in self.persona.preferred_locations)):
            return False
        
        return True
    
    def _get_activity_score(self, activity: Activity) -> float:
        """Get a score (0-1) for how well an activity matches the persona"""
        if not self.persona:
            return 0.5  # Neutral score if no persona
        
        return self.persona.get_activity_score(
            activity.activity_type.value,
            activity.location,
            activity.cost_cad,
            activity.networking_potential
        )
    
    def _select_activity(self, activity_type: str, 
                        exclude_used: bool = True,
                        min_networking: int = 0,
                        max_cost: Optional[float] = None) -> Optional[Activity]:
        """Select an activity based on criteria using service layer"""
        try:
            from ...shared.models import ActivityType
            activity_type_enum = ActivityType(activity_type)
            
            selected = self.activity_service.select_activity(
                activity_type_enum,
                persona=self.persona,
                exclude_used=exclude_used,
                min_networking=min_networking,
                max_cost=max_cost
            )
            
            if selected:
                # Update usage tracking
                self.used_activities.add(selected.name)
                self.activity_service.update_activity_usage(selected)
                
                # Update persona usage if persona exists
                if self.persona:
                    self.persona_service.increment_usage(self.persona.id)
            
            return selected
        except Exception as e:
            print(f"Warning: Error selecting activity {activity_type}: {e}")
            return None
    
    def _create_time_slot(self, start_time: str, activity: Activity, 
                         notes: str = "", **kwargs) -> TimeSlot:
        """Create a time slot with calculated end time"""
        end_time = TimeUtils.calculate_end_time(start_time, activity.duration_hours)
        
        return TimeSlot(
            start_time=start_time,
            end_time=end_time,
            activity=activity,
            notes=notes,
            **kwargs
        )
    
    def _resolve_time_conflicts(self, time_slots: List[TimeSlot]) -> List[TimeSlot]:
        """Resolve time conflicts in schedule"""
        return TimeUtils.resolve_time_conflicts(time_slots)
    
    def _sort_time_slots(self, time_slots: List[TimeSlot]) -> List[TimeSlot]:
        """Sort time slots by start time"""
        return TimeUtils.sort_time_slots(time_slots)
    
    def _validate_schedule_inputs(self, start_date: str, duration: str) -> List[str]:
        """Validate schedule generation inputs"""
        issues = []
        
        if not ValidationUtils.validate_date_format(start_date):
            issues.append("Invalid start_date format. Use YYYY-MM-DD")
        
        if not ValidationUtils.validate_duration(duration):
            issues.append("Invalid duration. Use: 1 week, 2 weeks, 1 month, 3 months, or 6 months")
        
        return issues
    
    def _generate_acknowledgment(self, start_date: str, duration: str, 
                               schedule_type: str, focus_areas: Optional[List[str]] = None) -> str:
        """Generate acknowledgment message for schedule"""
        focus_text = ""
        if focus_areas:
            focus_text = f"\n**Focus Areas:** {', '.join(focus_areas).replace('_', ' ').title()}"
        
        persona_text = ""
        if self.persona:
            persona_text = f"\n**Persona:** {self.persona.name}"
        
        return f"""
🎯 **Life Planner - {schedule_type.title()} Schedule Generated!**

**Date Range:** {start_date} for {duration}
**User:** {self.settings.user_name}
**Partner:** {self.settings.partner_name}{persona_text}{focus_text}

This schedule has been tailored to your preferences and goals.
Let's make the most of your time! 🚀
        """.strip()
    
    def _generate_summary(self, schedule: Schedule) -> str:
        """Generate summary statistics for schedule"""
        total_activities = len(schedule.time_slots)
        total_cost = schedule.total_cost
        
        # Calculate activity type distribution
        type_counts = {}
        for slot in schedule.time_slots:
            activity_type = slot.activity.activity_type.value
            type_counts[activity_type] = type_counts.get(activity_type, 0) + 1
        
        # Calculate average networking potential
        avg_networking = 0
        if schedule.time_slots:
            avg_networking = sum(slot.activity.networking_potential for slot in schedule.time_slots) / len(schedule.time_slots)
        
        summary = f"""
## 📊 **Schedule Summary**

**Total Activities:** {total_activities}
**Total Cost:** ${total_cost:.0f} CAD
**Average Networking Potential:** {avg_networking:.1f}/10

**Activity Breakdown:**
"""
        
        for activity_type, count in type_counts.items():
            summary += f"- {activity_type.replace('_', ' ').title()}: {count}\n"
        
        return summary.strip()
    
    def reset_planner(self):
        """Reset planner state to start fresh"""
        self.used_activities.clear()
        for activity in self.activities:
            activity.usage_count = 0
            activity.last_used = None
    
    def get_activity_stats(self) -> Dict:
        """Get statistics about activity usage"""
        total_activities = len(self.activities)
        used_activities = len(self.used_activities)
        
        # Find most used activity
        most_used = None
        most_used_count = 0
        for activity in self.activities:
            if activity.usage_count > most_used_count:
                most_used = activity.name
                most_used_count = activity.usage_count
        
        return {
            "total_activities": total_activities,
            "used_activities": used_activities,
            "usage_percentage": (used_activities / total_activities) * 100 if total_activities > 0 else 0,
            "most_used_activity": most_used or "None",
            "most_used_count": most_used_count
        }
