"""
Centralized application settings and configuration
"""

from dataclasses import dataclass, field
from typing import Dict, List, Set, Optional
from datetime import datetime


@dataclass
class CoreRequirements:
    """Core schedule requirements for users"""
    # Meditation progression
    meditation: Dict = field(default_factory=lambda: {
        "frequency": "progressive",
        "current_week": 0,
        "progression": {
            "weeks_1_4": 1,    # 1x per week
            "weeks_5_8": 2,    # 2x per week
            "weeks_9_12": 3,   # 3x per week
            "weeks_13_16": 4,  # 4x per week
            "weeks_17_plus": 5 # 5x per week
        }
    })
    
    # Work schedule
    work_hours: Dict = field(default_factory=lambda: {
        "start": "9:00 AM",
        "end": "6:00 PM",
        "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    })
    
    # Commute
    commute: Dict = field(default_factory=lambda: {
        "morning_duration": 10,  # minutes
        "evening_duration": 10,  # minutes
        "morning_start": "8:50 AM",
        "evening_start": "6:00 PM"
    })
    
    # Fitness schedule
    running: Dict = field(default_factory=lambda: {
        "Tuesday": {"duration": 60, "time_preference": "flexible"},
        "Thursday": {"duration": 60, "time_preference": "flexible"},
        "Friday": {"duration": 60, "time_preference": "flexible"},
        "Sunday": {"duration": 120, "time_preference": "flexible"}
    })
    
    swimming: Dict = field(default_factory=lambda: {
        "frequency": "twice_per_month",
        "last_scheduled": None
    })
    
    tennis: Dict = field(default_factory=lambda: {
        "frequency": "twice_per_month",
        "last_scheduled": None
    })
    
    # Professional development
    immigration_work: Dict = field(default_factory=lambda: {
        "hours_per_week": 3,
        "scheduled_hours": 0
    })
    
    professional_development: Dict = field(default_factory=lambda: {
        "hours_per_week": 5,
        "scheduled_hours": 0
    })
    
    # Household management
    household_budgeting: Dict = field(default_factory=lambda: {
        "weekly_hours": 1,
        "monthly_hours": 2.5,
        "weekly_scheduled": 0,
        "monthly_scheduled": 0
    })
    
    grocery_shopping: Dict = field(default_factory=lambda: {
        "frequency": "weekly",
        "preferred_day": "Saturday"
    })
    
    laundry: Dict = field(default_factory=lambda: {
        "frequency": "weekly",
        "preferred_day": "Sunday"
    })
    
    # Personal grooming
    personal_grooming: Dict = field(default_factory=lambda: {
        "daily": ["shower", "skincare", "teeth_brushing", "deodorant"],
        "weekly": ["hair_washing_3x", "nail_trimming", "beard_trimming"],
        "bi_weekly": ["haircut_trim", "eyebrow_grooming"],
        "monthly": ["deep_skincare", "hair_styling", "wardrobe_organization"]
    })
    
    # Entertainment schedule
    entertainment: Dict = field(default_factory=lambda: {
        "comedy_show": {"frequency": "every_two_months", "last_scheduled": None},
        "show_play": {"frequency": "every_two_months", "last_scheduled": None},
        "drag_show": {"frequency": "monthly", "last_scheduled": None}
    })
    
    # Preferences
    no_breakfast: bool = True
    no_morning_news: bool = True


@dataclass
class AppSettings:
    """Centralized application settings"""
    # User information
    user_name: str = "Kevin"
    partner_name: str = "Peter"
    
    # Schedule constraints
    morning_start: str = "6:00 AM"
    bedtime: str = "10:30 PM"
    preferred_breakfast_time: str = "7:00 AM"
    preferred_dinner_time: str = "6:00 PM"
    
    # Budget constraints
    max_daily_budget: float = 200.0
    max_weekly_budget: float = 1000.0
    
    # Core requirements
    core_requirements: CoreRequirements = field(default_factory=CoreRequirements)
    
    # Activity preferences
    preferred_activity_types: Set[str] = field(default_factory=lambda: {
        "social", "professional", "fitness", "cultural"
    })
    avoided_activity_types: Set[str] = field(default_factory=set)
    
    # Location preferences
    preferred_locations: Set[str] = field(default_factory=lambda: {
        "Downtown", "Entertainment District", "Fashion District", "Queen West"
    })
    avoided_locations: Set[str] = field(default_factory=set)
    
    # Networking preferences
    networking_priority: int = 7  # 1-10 scale
    min_networking_score: int = 5  # Minimum networking potential for activities
    
    # Planning preferences
    max_activities_per_day: int = 6
    min_networking_activities_per_week: int = 3
    conflict_resolution: bool = True
    time_buffer_minutes: int = 15
    smart_activity_selection: bool = True
    
    # Weather integration
    weather_api_enabled: bool = False
    weather_api_key: Optional[str] = None
    weather_check_frequency: str = "daily"  # "daily", "weekly", "manual"
    
    # Analytics
    track_usage_stats: bool = True
    generate_reports: bool = True
    
    # Output settings
    include_cost_breakdown: bool = True
    include_networking_scores: bool = True
    include_activity_tags: bool = True
    include_creative_suggestions: bool = True
    
    def to_dict(self) -> dict:
        """Convert to dictionary for JSON serialization"""
        return {
            "user_name": self.user_name,
            "partner_name": self.partner_name,
            "morning_start": self.morning_start,
            "bedtime": self.bedtime,
            "preferred_breakfast_time": self.preferred_breakfast_time,
            "preferred_dinner_time": self.preferred_dinner_time,
            "max_daily_budget": self.max_daily_budget,
            "max_weekly_budget": self.max_weekly_budget,
            "core_requirements": self.core_requirements.__dict__,
            "preferred_activity_types": list(self.preferred_activity_types),
            "avoided_activity_types": list(self.avoided_activity_types),
            "preferred_locations": list(self.preferred_locations),
            "avoided_locations": list(self.avoided_locations),
            "networking_priority": self.networking_priority,
            "min_networking_score": self.min_networking_score,
            "max_activities_per_day": self.max_activities_per_day,
            "min_networking_activities_per_week": self.min_networking_activities_per_week,
            "conflict_resolution": self.conflict_resolution,
            "time_buffer_minutes": self.time_buffer_minutes,
            "smart_activity_selection": self.smart_activity_selection,
            "weather_api_enabled": self.weather_api_enabled,
            "weather_api_key": self.weather_api_key,
            "weather_check_frequency": self.weather_check_frequency,
            "track_usage_stats": self.track_usage_stats,
            "generate_reports": self.generate_reports,
            "include_cost_breakdown": self.include_cost_breakdown,
            "include_networking_scores": self.include_networking_scores,
            "include_activity_tags": self.include_activity_tags,
            "include_creative_suggestions": self.include_creative_suggestions
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'AppSettings':
        """Create AppSettings from dictionary"""
        settings = cls()
        
        # Update with provided data
        for key, value in data.items():
            if key == "core_requirements":
                settings.core_requirements = CoreRequirements(**value)
            elif key in ["preferred_activity_types", "avoided_activity_types", 
                        "preferred_locations", "avoided_locations"]:
                setattr(settings, key, set(value))
            elif hasattr(settings, key):
                setattr(settings, key, value)
        
        return settings
    
    def get_budget_range(self) -> tuple:
        """Get budget range based on current settings"""
        if self.max_daily_budget <= 50:
            return (0, 50)
        elif self.max_daily_budget <= 150:
            return (50, 150)
        else:
            return (150, self.max_daily_budget)
    
    def validate(self) -> List[str]:
        """Validate settings and return list of issues"""
        issues = []
        
        # Validate times
        try:
            from datetime import datetime
            datetime.strptime(self.morning_start, "%I:%M %p")
            datetime.strptime(self.bedtime, "%I:%M %p")
        except ValueError:
            issues.append("Invalid time format. Use format like '6:00 AM'")
        
        # Validate networking priority
        if not 1 <= self.networking_priority <= 10:
            issues.append("Networking priority must be between 1 and 10")
        
        # Validate budget
        if self.max_daily_budget < 0:
            issues.append("Max daily cost cannot be negative")
        
        if self.max_weekly_budget < self.max_daily_budget:
            issues.append("Max weekly budget should be at least as much as daily budget")
        
        return issues

