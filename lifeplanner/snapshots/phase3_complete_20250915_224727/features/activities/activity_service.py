"""
Service layer for activity management
"""

from typing import List, Optional, Set
from datetime import datetime

from ...shared.models import Activity, ActivityType, Persona
from .activity_repository import ActivityRepository


class ActivityService:
    """Service layer for activity business logic"""
    
    def __init__(self, repository: Optional[ActivityRepository] = None):
        self.repository = repository or ActivityRepository()
    
    def get_all_activities(self) -> List[Activity]:
        """Get all activities"""
        return self.repository.load_all()
    
    def get_activities_by_type(self, activity_type: ActivityType) -> List[Activity]:
        """Get activities by type"""
        return self.repository.load_by_type(activity_type)
    
    def get_activities_by_tags(self, tags: Set[str]) -> List[Activity]:
        """Get activities that match any of the specified tags"""
        return self.repository.load_by_tags(tags)
    
    def get_activities_for_persona(self, persona: Persona) -> List[Activity]:
        """Get activities filtered for a specific persona"""
        all_activities = self.get_all_activities()
        filtered_activities = []
        
        for activity in all_activities:
            if self._matches_persona(activity, persona):
                filtered_activities.append(activity)
        
        return filtered_activities
    
    def _matches_persona(self, activity: Activity, persona: Persona) -> bool:
        """Check if an activity matches persona preferences"""
        # Check activity type
        if activity.activity_type.value not in persona.preferred_activities:
            return False
        
        # Check if activity type is avoided
        if activity.activity_type.value in persona.avoided_activities:
            return False
        
        # Check budget constraints
        if activity.cost_cad > persona.max_daily_budget:
            return False
        
        # Check location preferences (if any location matches)
        if (persona.preferred_locations and 
            not any(loc in activity.location for loc in persona.preferred_locations)):
            return False
        
        return True
    
    def get_activity_score(self, activity: Activity, persona: Persona) -> float:
        """Get a score (0-1) for how well an activity matches the persona"""
        return persona.get_activity_score(
            activity.activity_type.value,
            activity.location,
            activity.cost_cad,
            activity.networking_potential
        )
    
    def select_activity(self, activity_type: ActivityType, persona: Optional[Persona] = None,
                       exclude_used: bool = True, min_networking: int = 0,
                       max_cost: Optional[float] = None) -> Optional[Activity]:
        """Select an activity based on criteria"""
        if persona:
            available_activities = self.get_activities_for_persona(persona)
        else:
            available_activities = self.get_activities_by_type(activity_type)
        
        # Apply additional filters
        filtered_activities = []
        for activity in available_activities:
            if (activity.networking_potential >= min_networking and
                (max_cost is None or activity.cost_cad <= max_cost) and
                (not exclude_used or activity.usage_count == 0)):
                filtered_activities.append(activity)
        
        if not filtered_activities:
            return None
        
        # Sort by persona match score if persona exists
        if persona:
            filtered_activities.sort(key=lambda x: self.get_activity_score(x, persona), reverse=True)
        else:
            # Sort by usage count (prefer less used activities)
            filtered_activities.sort(key=lambda x: x.usage_count)
        
        return filtered_activities[0]
    
    def update_activity_usage(self, activity: Activity) -> bool:
        """Update activity usage statistics"""
        activity.usage_count += 1
        activity.last_used = datetime.now()
        return self.repository.save(activity)
    
    def get_activity_statistics(self) -> dict:
        """Get statistics about activities"""
        activities = self.get_all_activities()
        
        if not activities:
            return {
                "total_activities": 0,
                "by_type": {},
                "average_cost": 0,
                "average_networking_potential": 0
            }
        
        # Count by type
        by_type = {}
        for activity in activities:
            activity_type = activity.activity_type.value
            by_type[activity_type] = by_type.get(activity_type, 0) + 1
        
        # Calculate averages
        total_cost = sum(a.cost_cad for a in activities)
        total_networking = sum(a.networking_potential for a in activities)
        
        return {
            "total_activities": len(activities),
            "by_type": by_type,
            "average_cost": total_cost / len(activities),
            "average_networking_potential": total_networking / len(activities)
        }
