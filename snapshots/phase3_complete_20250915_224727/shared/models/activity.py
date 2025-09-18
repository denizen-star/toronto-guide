"""
Unified Activity model for all planner types
"""

from dataclasses import dataclass, field
from typing import Set, Optional, List
from enum import Enum
from datetime import datetime


class ActivityType(Enum):
    """Unified activity types for all planners"""
    MORNING_ROUTINE = "morning_routine"
    EVENING_ROUTINE = "evening_routine"
    SOCIAL = "social"
    PROFESSIONAL = "professional"
    FITNESS = "fitness"
    CREATIVE = "creative"
    CULTURAL = "cultural"
    COUPLE = "couple"
    LEARNING = "learning"
    SERVICE = "service"
    ADVENTURE = "adventure"
    INTIMACY = "intimacy"
    QUALITY_TIME = "quality_time"
    DAILY_CONNECTION = "daily_connection"
    EMOTIONAL_SAFETY = "emotional_safety"
    SHARED_GOALS = "shared_goals"


@dataclass
class Activity:
    """Unified activity model for all planner types"""
    name: str
    activity_type: ActivityType
    duration_hours: float
    cost_cad: float
    location: str
    description: str
    
    # Scoring metrics (1-10 scale)
    networking_potential: int = 0
    connection_depth: int = 0      # For couple activities
    emotional_safety: int = 0      # For couple activities
    energy_level: str = "medium"   # "low", "medium", "high"
    
    # Metadata
    tags: Set[str] = field(default_factory=set)
    is_habit_stacked: bool = False
    requires_planning: bool = False
    weather_dependent: bool = False
    indoor: bool = True
    day_preference: Optional[str] = None  # "weekday", "weekend", or specific day
    
    # Usage tracking
    usage_count: int = 0
    last_used: Optional[datetime] = None
    
    def to_dict(self) -> dict:
        """Convert to dictionary for JSON serialization"""
        return {
            "name": self.name,
            "activity_type": self.activity_type.value,
            "duration_hours": self.duration_hours,
            "cost_cad": self.cost_cad,
            "location": self.location,
            "description": self.description,
            "networking_potential": self.networking_potential,
            "connection_depth": self.connection_depth,
            "emotional_safety": self.emotional_safety,
            "energy_level": self.energy_level,
            "tags": list(self.tags),
            "is_habit_stacked": self.is_habit_stacked,
            "requires_planning": self.requires_planning,
            "weather_dependent": self.weather_dependent,
            "indoor": self.indoor,
            "day_preference": self.day_preference,
            "usage_count": self.usage_count,
            "last_used": self.last_used.isoformat() if self.last_used else None
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Activity':
        """Create Activity from dictionary"""
        return cls(
            name=data["name"],
            activity_type=ActivityType(data["activity_type"]),
            duration_hours=data["duration_hours"],
            cost_cad=data["cost_cad"],
            location=data["location"],
            description=data["description"],
            networking_potential=data.get("networking_potential", 0),
            connection_depth=data.get("connection_depth", 0),
            emotional_safety=data.get("emotional_safety", 0),
            energy_level=data.get("energy_level", "medium"),
            tags=set(data.get("tags", [])),
            is_habit_stacked=data.get("is_habit_stacked", False),
            requires_planning=data.get("requires_planning", False),
            weather_dependent=data.get("weather_dependent", False),
            indoor=data.get("indoor", True),
            day_preference=data.get("day_preference"),
            usage_count=data.get("usage_count", 0),
            last_used=datetime.fromisoformat(data["last_used"]) if data.get("last_used") else None
        )


@dataclass
class TimeSlot:
    """Time slot for scheduling activities"""
    start_time: str
    end_time: str
    activity: Activity
    notes: str = ""
    is_specific_activity: bool = False
    is_habit_stacked: bool = False
    emotional_check_in: bool = False
    
    def to_dict(self) -> dict:
        """Convert to dictionary for JSON serialization"""
        return {
            "start_time": self.start_time,
            "end_time": self.end_time,
            "activity": self.activity.to_dict(),
            "notes": self.notes,
            "is_specific_activity": self.is_specific_activity,
            "is_habit_stacked": self.is_habit_stacked,
            "emotional_check_in": self.emotional_check_in
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'TimeSlot':
        """Create TimeSlot from dictionary"""
        return cls(
            start_time=data["start_time"],
            end_time=data["end_time"],
            activity=Activity.from_dict(data["activity"]),
            notes=data.get("notes", ""),
            is_specific_activity=data.get("is_specific_activity", False),
            is_habit_stacked=data.get("is_habit_stacked", False),
            emotional_check_in=data.get("emotional_check_in", False)
        )
