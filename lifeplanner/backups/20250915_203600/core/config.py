#!/usr/bin/env python3
"""
Configuration system for the Toronto Life Planner Agent
Manages user preferences, constraints, and settings
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Set
from enum import Enum


class EnergyLevel(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class BudgetLevel(Enum):
    BUDGET = "budget"  # $0-50 per day
    MODERATE = "moderate"  # $50-150 per day
    PREMIUM = "premium"  # $150+ per day


@dataclass
class UserPreferences:
    """User preferences and constraints"""
    # Basic info
    user_name: str = "User"
    partner_name: str = "Husband (Celebrity Fashion Stylist)"
    
    # Schedule constraints
    morning_start: str = "6:00 AM"
    bedtime: str = "10:30 PM"
    preferred_breakfast_time: str = "7:00 AM"
    preferred_dinner_time: str = "6:00 PM"
    
    # Activity preferences
    preferred_energy_level: EnergyLevel = EnergyLevel.MEDIUM
    budget_level: BudgetLevel = BudgetLevel.MODERATE
    max_daily_cost: float = 200.0
    
    # Networking focus
    networking_priority: int = 8  # 1-10 scale
    min_networking_score: int = 5  # Minimum networking potential for activities
    
    # Activity type preferences
    preferred_activity_types: Set[str] = field(default_factory=lambda: {
        "social", "professional", "creative", "cultural"
    })
    avoided_activity_types: Set[str] = field(default_factory=lambda: set())
    
    # Location preferences
    preferred_locations: Set[str] = field(default_factory=lambda: {
        "Downtown", "Entertainment District", "Fashion District", "Queen West"
    })
    avoided_locations: Set[str] = field(default_factory=lambda: set())
    
    # Day preferences
    weekend_activity_boost: bool = True  # More activities on weekends
    weekday_networking_focus: bool = True  # Focus on professional networking weekdays
    
    # Weather preferences
    weather_sensitivity: bool = True  # Consider weather when selecting activities
    indoor_fallback: bool = True  # Prefer indoor activities in bad weather
    
    # Repetition control
    avoid_repetition: bool = True  # Avoid repeating activities
    repetition_window_days: int = 7  # Days to avoid repeating activities
    
    # Creative suggestions
    include_creative_suggestions: bool = True
    creative_suggestion_frequency: str = "weekly"  # "daily", "weekly", "monthly"


@dataclass
class PlannerConfig:
    """Main configuration for the Toronto Life Planner"""
    user_preferences: UserPreferences = field(default_factory=UserPreferences)
    
    # Database settings
    max_activities_per_day: int = 6
    min_networking_activities_per_week: int = 3
    
    # Output settings
    include_cost_breakdown: bool = True
    include_networking_scores: bool = True
    include_activity_tags: bool = True
    include_creative_suggestions: bool = True
    
    # Advanced settings
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


class ConfigManager:
    """Manages configuration loading, saving, and validation"""
    
    def __init__(self, config_file: str = "planner_config.json"):
        self.config_file = config_file
        self.config = self._load_config()
    
    def _load_config(self) -> PlannerConfig:
        """Load configuration from file or create default"""
        try:
            import json
            with open(self.config_file, 'r') as f:
                config_data = json.load(f)
            return self._dict_to_config(config_data)
        except (FileNotFoundError, json.JSONDecodeError):
            return PlannerConfig()
    
    def save_config(self):
        """Save current configuration to file"""
        import json
        config_dict = self._config_to_dict(self.config)
        with open(self.config_file, 'w') as f:
            json.dump(config_dict, f, indent=2)
    
    def _config_to_dict(self, config: PlannerConfig) -> Dict:
        """Convert config object to dictionary for JSON serialization"""
        return {
            "user_preferences": {
                "user_name": config.user_preferences.user_name,
                "partner_name": config.user_preferences.partner_name,
                "morning_start": config.user_preferences.morning_start,
                "bedtime": config.user_preferences.bedtime,
                "preferred_breakfast_time": config.user_preferences.preferred_breakfast_time,
                "preferred_dinner_time": config.user_preferences.preferred_dinner_time,
                "preferred_energy_level": config.user_preferences.preferred_energy_level.value,
                "budget_level": config.user_preferences.budget_level.value,
                "max_daily_cost": config.user_preferences.max_daily_cost,
                "networking_priority": config.user_preferences.networking_priority,
                "min_networking_score": config.user_preferences.min_networking_score,
                "preferred_activity_types": list(config.user_preferences.preferred_activity_types),
                "avoided_activity_types": list(config.user_preferences.avoided_activity_types),
                "preferred_locations": list(config.user_preferences.preferred_locations),
                "avoided_locations": list(config.user_preferences.avoided_locations),
                "weekend_activity_boost": config.user_preferences.weekend_activity_boost,
                "weekday_networking_focus": config.user_preferences.weekday_networking_focus,
                "weather_sensitivity": config.user_preferences.weather_sensitivity,
                "indoor_fallback": config.user_preferences.indoor_fallback,
                "avoid_repetition": config.user_preferences.avoid_repetition,
                "repetition_window_days": config.user_preferences.repetition_window_days,
                "include_creative_suggestions": config.user_preferences.include_creative_suggestions,
                "creative_suggestion_frequency": config.user_preferences.creative_suggestion_frequency
            },
            "max_activities_per_day": config.max_activities_per_day,
            "min_networking_activities_per_week": config.min_networking_activities_per_week,
            "include_cost_breakdown": config.include_cost_breakdown,
            "include_networking_scores": config.include_networking_scores,
            "include_activity_tags": config.include_activity_tags,
            "include_creative_suggestions": config.include_creative_suggestions,
            "conflict_resolution": config.conflict_resolution,
            "time_buffer_minutes": config.time_buffer_minutes,
            "smart_activity_selection": config.smart_activity_selection,
            "weather_api_enabled": config.weather_api_enabled,
            "weather_api_key": config.weather_api_key,
            "weather_check_frequency": config.weather_check_frequency,
            "track_usage_stats": config.track_usage_stats,
            "generate_reports": config.generate_reports
        }
    
    def _dict_to_config(self, config_dict: Dict) -> PlannerConfig:
        """Convert dictionary to config object"""
        user_prefs_data = config_dict.get("user_preferences", {})
        
        user_preferences = UserPreferences(
            user_name=user_prefs_data.get("user_name", "User"),
            partner_name=user_prefs_data.get("partner_name", "Husband (Celebrity Fashion Stylist)"),
            morning_start=user_prefs_data.get("morning_start", "6:00 AM"),
            bedtime=user_prefs_data.get("bedtime", "10:30 PM"),
            preferred_breakfast_time=user_prefs_data.get("preferred_breakfast_time", "7:00 AM"),
            preferred_dinner_time=user_prefs_data.get("preferred_dinner_time", "6:00 PM"),
            preferred_energy_level=EnergyLevel(user_prefs_data.get("preferred_energy_level", "medium")),
            budget_level=BudgetLevel(user_prefs_data.get("budget_level", "moderate")),
            max_daily_cost=user_prefs_data.get("max_daily_cost", 200.0),
            networking_priority=user_prefs_data.get("networking_priority", 8),
            min_networking_score=user_prefs_data.get("min_networking_score", 5),
            preferred_activity_types=set(user_prefs_data.get("preferred_activity_types", [])),
            avoided_activity_types=set(user_prefs_data.get("avoided_activity_types", [])),
            preferred_locations=set(user_prefs_data.get("preferred_locations", [])),
            avoided_locations=set(user_prefs_data.get("avoided_locations", [])),
            weekend_activity_boost=user_prefs_data.get("weekend_activity_boost", True),
            weekday_networking_focus=user_prefs_data.get("weekday_networking_focus", True),
            weather_sensitivity=user_prefs_data.get("weather_sensitivity", True),
            indoor_fallback=user_prefs_data.get("indoor_fallback", True),
            avoid_repetition=user_prefs_data.get("avoid_repetition", True),
            repetition_window_days=user_prefs_data.get("repetition_window_days", 7),
            include_creative_suggestions=user_prefs_data.get("include_creative_suggestions", True),
            creative_suggestion_frequency=user_prefs_data.get("creative_suggestion_frequency", "weekly")
        )
        
        return PlannerConfig(
            user_preferences=user_preferences,
            max_activities_per_day=config_dict.get("max_activities_per_day", 6),
            min_networking_activities_per_week=config_dict.get("min_networking_activities_per_week", 3),
            include_cost_breakdown=config_dict.get("include_cost_breakdown", True),
            include_networking_scores=config_dict.get("include_networking_scores", True),
            include_activity_tags=config_dict.get("include_activity_tags", True),
            include_creative_suggestions=config_dict.get("include_creative_suggestions", True),
            conflict_resolution=config_dict.get("conflict_resolution", True),
            time_buffer_minutes=config_dict.get("time_buffer_minutes", 15),
            smart_activity_selection=config_dict.get("smart_activity_selection", True),
            weather_api_enabled=config_dict.get("weather_api_enabled", False),
            weather_api_key=config_dict.get("weather_api_key"),
            weather_check_frequency=config_dict.get("weather_check_frequency", "daily"),
            track_usage_stats=config_dict.get("track_usage_stats", True),
            generate_reports=config_dict.get("generate_reports", True)
        )
    
    def update_user_preferences(self, **kwargs):
        """Update user preferences with provided values"""
        for key, value in kwargs.items():
            if hasattr(self.config.user_preferences, key):
                setattr(self.config.user_preferences, key, value)
        self.save_config()
    
    def get_budget_range(self) -> tuple:
        """Get budget range based on budget level"""
        budget_ranges = {
            BudgetLevel.BUDGET: (0, 50),
            BudgetLevel.MODERATE: (50, 150),
            BudgetLevel.PREMIUM: (150, 1000)
        }
        return budget_ranges.get(self.config.user_preferences.budget_level, (0, 200))
    
    def validate_config(self) -> List[str]:
        """Validate configuration and return list of issues"""
        issues = []
        
        # Validate times
        try:
            from datetime import datetime
            datetime.strptime(self.config.user_preferences.morning_start, "%I:%M %p")
            datetime.strptime(self.config.user_preferences.bedtime, "%I:%M %p")
        except ValueError:
            issues.append("Invalid time format. Use format like '6:00 AM'")
        
        # Validate networking priority
        if not 1 <= self.config.user_preferences.networking_priority <= 10:
            issues.append("Networking priority must be between 1 and 10")
        
        # Validate budget
        if self.config.user_preferences.max_daily_cost < 0:
            issues.append("Max daily cost cannot be negative")
        
        return issues


# Example usage and configuration presets
def create_fashion_industry_config() -> PlannerConfig:
    """Create configuration optimized for fashion industry professionals"""
    user_prefs = UserPreferences(
        user_name="Fashion Professional",
        partner_name="Celebrity Stylist",
        networking_priority=9,
        min_networking_score=7,
        preferred_activity_types={"professional", "social", "creative", "cultural"},
        preferred_locations={"Fashion District", "Entertainment District", "Yorkville", "Queen West"},
        budget_level=BudgetLevel.PREMIUM,
        max_daily_cost=300.0,
        weekend_activity_boost=True,
        weekday_networking_focus=True
    )
    
    return PlannerConfig(
        user_preferences=user_prefs,
        min_networking_activities_per_week=5,
        include_creative_suggestions=True
    )


def create_budget_conscious_config() -> PlannerConfig:
    """Create configuration for budget-conscious users"""
    user_prefs = UserPreferences(
        networking_priority=6,
        min_networking_score=4,
        budget_level=BudgetLevel.BUDGET,
        max_daily_cost=75.0,
        preferred_activity_types={"social", "cultural", "fitness"},
        avoided_activity_types={"professional"},  # Often more expensive
        weather_sensitivity=True,
        indoor_fallback=True
    )
    
    return PlannerConfig(
        user_preferences=user_prefs,
        min_networking_activities_per_week=2,
        include_cost_breakdown=True
    )


if __name__ == "__main__":
    # Example usage
    config_manager = ConfigManager()
    
    # Update some preferences
    config_manager.update_user_preferences(
        networking_priority=9,
        max_daily_cost=250.0,
        preferred_locations={"Downtown", "Fashion District"}
    )
    
    # Validate configuration
    issues = config_manager.validate_config()
    if issues:
        print("Configuration issues found:")
        for issue in issues:
            print(f"- {issue}")
    else:
        print("Configuration is valid!")
    
    # Save configuration
    config_manager.save_config()
    print("Configuration saved successfully!")
