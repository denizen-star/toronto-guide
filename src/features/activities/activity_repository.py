"""
Repository for activity data access
"""

import json
from typing import List, Optional, Set
from pathlib import Path

from ...shared.models import Activity, ActivityType


class ActivityRepository:
    """Repository for activity data persistence"""
    
    def __init__(self, data_file: str = "data/activities.json"):
        self.data_file = Path(data_file)
        self._ensure_data_file_exists()
    
    def _ensure_data_file_exists(self):
        """Ensure the data file exists, create if not"""
        if not self.data_file.exists():
            self.data_file.parent.mkdir(parents=True, exist_ok=True)
            # Create empty activities file
            with open(self.data_file, 'w') as f:
                json.dump({"activities": []}, f, indent=2)
    
    def load_all(self) -> List[Activity]:
        """Load all activities from storage"""
        try:
            with open(self.data_file, 'r') as f:
                data = json.load(f)
                return [Activity.from_dict(activity_data) for activity_data in data.get("activities", [])]
        except (FileNotFoundError, json.JSONDecodeError, KeyError) as e:
            print(f"Warning: Could not load activities from {self.data_file}: {e}")
            return []
    
    def load_by_type(self, activity_type: ActivityType) -> List[Activity]:
        """Load activities by type"""
        all_activities = self.load_all()
        return [a for a in all_activities if a.activity_type == activity_type]
    
    def load_by_tags(self, tags: Set[str]) -> List[Activity]:
        """Load activities that have any of the specified tags"""
        all_activities = self.load_all()
        return [a for a in all_activities if tags.intersection(a.tags)]
    
    def load_by_networking_potential(self, min_potential: int) -> List[Activity]:
        """Load activities with minimum networking potential"""
        all_activities = self.load_all()
        return [a for a in all_activities if a.networking_potential >= min_potential]
    
    def load_by_cost_range(self, max_cost: float) -> List[Activity]:
        """Load activities within cost range"""
        all_activities = self.load_all()
        return [a for a in all_activities if a.cost_cad <= max_cost]
    
    def save(self, activity: Activity) -> bool:
        """Save an activity to storage"""
        try:
            activities = self.load_all()
            
            # Update existing or add new
            existing_index = None
            for i, existing_activity in enumerate(activities):
                if existing_activity.name == activity.name:
                    existing_index = i
                    break
            
            if existing_index is not None:
                activities[existing_index] = activity
            else:
                activities.append(activity)
            
            # Save back to file
            data = {"activities": [a.to_dict() for a in activities]}
            with open(self.data_file, 'w') as f:
                json.dump(data, f, indent=2)
            
            return True
        except Exception as e:
            print(f"Error saving activity {activity.name}: {e}")
            return False
    
    def delete(self, activity_name: str) -> bool:
        """Delete an activity by name"""
        try:
            activities = self.load_all()
            activities = [a for a in activities if a.name != activity_name]
            
            data = {"activities": [a.to_dict() for a in activities]}
            with open(self.data_file, 'w') as f:
                json.dump(data, f, indent=2)
            
            return True
        except Exception as e:
            print(f"Error deleting activity {activity_name}: {e}")
            return False

