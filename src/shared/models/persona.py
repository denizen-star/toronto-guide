"""
Simplified Persona model for user profiles
"""

from dataclasses import dataclass, field
from typing import Set, List, Dict, Optional
from enum import Enum
from datetime import datetime


class PersonalityType(Enum):
    """Personality types"""
    INTROVERT = "introvert"
    EXTROVERT = "extrovert"
    AMBIVERT = "ambivert"


class SocialStyle(Enum):
    """Social interaction styles"""
    NETWORKER = "networker"
    CONNECTOR = "connector"
    SELECTIVE = "selective"
    BALANCED = "balanced"


class EnergyPattern(Enum):
    """Energy patterns throughout the day"""
    MORNING_PERSON = "morning_person"
    EVENING_PERSON = "evening_person"
    STEADY_ENERGY = "steady_energy"
    VARIABLE_ENERGY = "variable_energy"


@dataclass
class Persona:
    """Simplified persona model"""
    id: str
    name: str
    description: str
    
    # Core characteristics
    personality_type: PersonalityType
    energy_pattern: EnergyPattern
    social_style: SocialStyle
    
    # Preferences
    preferred_activities: Set[str] = field(default_factory=set)
    preferred_locations: Set[str] = field(default_factory=set)
    avoided_activities: Set[str] = field(default_factory=set)
    budget_level: str = "moderate"  # "budget", "moderate", "premium"
    
    # Constraints
    max_daily_budget: float = 200.0
    max_weekly_budget: float = 1000.0
    available_days: Set[str] = field(default_factory=lambda: {
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    })
    
    # Goals
    primary_goals: List[str] = field(default_factory=list)
    networking_priority: int = 5  # 1-10 scale
    
    # Time preferences
    morning_start: str = "6:00 AM"
    bedtime: str = "10:30 PM"
    preferred_breakfast_time: str = "7:00 AM"
    preferred_dinner_time: str = "6:00 PM"
    
    # Metadata
    created_date: datetime = field(default_factory=datetime.now)
    last_updated: datetime = field(default_factory=datetime.now)
    is_active: bool = True
    usage_count: int = 0
    
    def to_dict(self) -> dict:
        """Convert to dictionary for JSON serialization"""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "personality_type": self.personality_type.value,
            "energy_pattern": self.energy_pattern.value,
            "social_style": self.social_style.value,
            "preferred_activities": list(self.preferred_activities),
            "preferred_locations": list(self.preferred_locations),
            "avoided_activities": list(self.avoided_activities),
            "budget_level": self.budget_level,
            "max_daily_budget": self.max_daily_budget,
            "max_weekly_budget": self.max_weekly_budget,
            "available_days": list(self.available_days),
            "primary_goals": self.primary_goals,
            "networking_priority": self.networking_priority,
            "morning_start": self.morning_start,
            "bedtime": self.bedtime,
            "preferred_breakfast_time": self.preferred_breakfast_time,
            "preferred_dinner_time": self.preferred_dinner_time,
            "created_date": self.created_date.isoformat(),
            "last_updated": self.last_updated.isoformat(),
            "is_active": self.is_active,
            "usage_count": self.usage_count
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Persona':
        """Create Persona from dictionary"""
        return cls(
            id=data["id"],
            name=data["name"],
            description=data["description"],
            personality_type=PersonalityType(data["personality_type"]),
            energy_pattern=EnergyPattern(data["energy_pattern"]),
            social_style=SocialStyle(data["social_style"]),
            preferred_activities=set(data.get("preferred_activities", [])),
            preferred_locations=set(data.get("preferred_locations", [])),
            avoided_activities=set(data.get("avoided_activities", [])),
            budget_level=data.get("budget_level", "moderate"),
            max_daily_budget=data.get("max_daily_budget", 200.0),
            max_weekly_budget=data.get("max_weekly_budget", 1000.0),
            available_days=set(data.get("available_days", [])),
            primary_goals=data.get("primary_goals", []),
            networking_priority=data.get("networking_priority", 5),
            morning_start=data.get("morning_start", "6:00 AM"),
            bedtime=data.get("bedtime", "10:30 PM"),
            preferred_breakfast_time=data.get("preferred_breakfast_time", "7:00 AM"),
            preferred_dinner_time=data.get("preferred_dinner_time", "6:00 PM"),
            created_date=datetime.fromisoformat(data.get("created_date", datetime.now().isoformat())),
            last_updated=datetime.fromisoformat(data.get("last_updated", datetime.now().isoformat())),
            is_active=data.get("is_active", True),
            usage_count=data.get("usage_count", 0)
        )
    
    def matches_activity(self, activity_type: str, location: str, cost: float) -> bool:
        """Check if an activity matches this persona's preferences"""
        # Check if activity type is preferred
        if activity_type not in self.preferred_activities:
            return False
        
        # Check if activity type is avoided
        if activity_type in self.avoided_activities:
            return False
        
        # Check budget constraints
        if cost > self.max_daily_budget:
            return False
        
        # Check location preferences (if any location matches)
        if self.preferred_locations and not any(loc in location for loc in self.preferred_locations):
            return False
        
        return True
    
    def get_activity_score(self, activity_type: str, location: str, cost: float, networking_potential: int) -> float:
        """Get a score (0-1) for how well an activity matches this persona"""
        score = 0.0
        
        # Base score for matching activity type
        if activity_type in self.preferred_activities:
            score += 0.4
        
        # Location match bonus
        if self.preferred_locations and any(loc in location for loc in self.preferred_locations):
            score += 0.2
        
        # Budget alignment
        if cost <= self.max_daily_budget * 0.5:  # Well within budget
            score += 0.2
        elif cost <= self.max_daily_budget:  # Within budget
            score += 0.1
        
        # Networking alignment
        if self.networking_priority >= 7 and networking_potential >= 6:
            score += 0.2
        elif self.networking_priority >= 5 and networking_potential >= 4:
            score += 0.1
        
        return min(score, 1.0)

