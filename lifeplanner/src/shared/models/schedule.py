"""
Schedule models for planning
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional
from enum import Enum
from datetime import datetime
from .activity import TimeSlot


class ScheduleType(Enum):
    """Types of schedules"""
    INDIVIDUAL = "individual"
    COUPLE = "couple"
    INTEGRATED = "integrated"


@dataclass
class Schedule:
    """Schedule container for activities"""
    schedule_type: ScheduleType
    start_date: str
    duration: str
    time_slots: List[TimeSlot] = field(default_factory=list)
    focus_areas: List[str] = field(default_factory=list)
    total_cost: float = 0.0
    created_date: datetime = field(default_factory=datetime.now)
    
    def add_time_slot(self, time_slot: TimeSlot):
        """Add a time slot to the schedule"""
        self.time_slots.append(time_slot)
        self.total_cost += time_slot.activity.cost_cad
    
    def get_activities_by_type(self, activity_type: str) -> List[TimeSlot]:
        """Get all time slots with a specific activity type"""
        return [slot for slot in self.time_slots if slot.activity.activity_type.value == activity_type]
    
    def get_daily_schedule(self, day: str) -> List[TimeSlot]:
        """Get time slots for a specific day"""
        return [slot for slot in self.time_slots if day in slot.start_time]
    
    def to_dict(self) -> dict:
        """Convert to dictionary for JSON serialization"""
        return {
            "schedule_type": self.schedule_type.value,
            "start_date": self.start_date,
            "duration": self.duration,
            "time_slots": [slot.to_dict() for slot in self.time_slots],
            "focus_areas": self.focus_areas,
            "total_cost": self.total_cost,
            "created_date": self.created_date.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Schedule':
        """Create Schedule from dictionary"""
        return cls(
            schedule_type=ScheduleType(data["schedule_type"]),
            start_date=data["start_date"],
            duration=data["duration"],
            time_slots=[TimeSlot.from_dict(slot_data) for slot_data in data.get("time_slots", [])],
            focus_areas=data.get("focus_areas", []),
            total_cost=data.get("total_cost", 0.0),
            created_date=datetime.fromisoformat(data.get("created_date", datetime.now().isoformat()))
        )

