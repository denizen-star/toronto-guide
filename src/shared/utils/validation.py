"""
Validation utilities for data validation and error checking
"""

from typing import List, Dict, Any
from datetime import datetime


class ValidationUtils:
    """Utility class for validation operations"""
    
    @staticmethod
    def validate_time_format(time_str: str) -> bool:
        """Validate time string format (e.g., '6:00 AM')"""
        try:
            datetime.strptime(time_str, "%I:%M %p")
            return True
        except ValueError:
            return False
    
    @staticmethod
    def validate_date_format(date_str: str) -> bool:
        """Validate date string format (e.g., '2024-01-15')"""
        try:
            datetime.strptime(date_str, "%Y-%m-%d")
            return True
        except ValueError:
            return False
    
    @staticmethod
    def validate_duration(duration: str) -> bool:
        """Validate duration string"""
        valid_durations = ["1 week", "2 weeks", "1 month", "3 months", "6 months"]
        return duration in valid_durations
    
    @staticmethod
    def validate_budget(budget: float) -> List[str]:
        """Validate budget constraints"""
        issues = []
        if budget < 0:
            issues.append("Budget cannot be negative")
        if budget > 10000:
            issues.append("Budget seems unreasonably high")
        return issues
    
    @staticmethod
    def validate_networking_priority(priority: int) -> List[str]:
        """Validate networking priority (1-10 scale)"""
        issues = []
        if not 1 <= priority <= 10:
            issues.append("Networking priority must be between 1 and 10")
        return issues
    
    @staticmethod
    def validate_activity_score(score: int, score_name: str) -> List[str]:
        """Validate activity scores (1-10 scale)"""
        issues = []
        if not 1 <= score <= 10:
            issues.append(f"{score_name} must be between 1 and 10")
        return issues
    
    @staticmethod
    def validate_persona_data(persona_data: Dict[str, Any]) -> List[str]:
        """Validate persona data structure"""
        issues = []
        
        required_fields = ["id", "name", "description", "personality_type", 
                          "energy_pattern", "social_style"]
        
        for field in required_fields:
            if field not in persona_data:
                issues.append(f"Missing required field: {field}")
        
        if "max_daily_budget" in persona_data:
            issues.extend(ValidationUtils.validate_budget(persona_data["max_daily_budget"]))
        
        if "networking_priority" in persona_data:
            issues.extend(ValidationUtils.validate_networking_priority(persona_data["networking_priority"]))
        
        return issues
    
    @staticmethod
    def validate_activity_data(activity_data: Dict[str, Any]) -> List[str]:
        """Validate activity data structure"""
        issues = []
        
        required_fields = ["name", "activity_type", "duration_hours", "cost_cad", 
                          "location", "description"]
        
        for field in required_fields:
            if field not in activity_data:
                issues.append(f"Missing required field: {field}")
        
        if "cost_cad" in activity_data:
            issues.extend(ValidationUtils.validate_budget(activity_data["cost_cad"]))
        
        if "networking_potential" in activity_data:
            issues.extend(ValidationUtils.validate_activity_score(
                activity_data["networking_potential"], "Networking potential"
            ))
        
        if "connection_depth" in activity_data:
            issues.extend(ValidationUtils.validate_activity_score(
                activity_data["connection_depth"], "Connection depth"
            ))
        
        if "emotional_safety" in activity_data:
            issues.extend(ValidationUtils.validate_activity_score(
                activity_data["emotional_safety"], "Emotional safety"
            ))
        
        return issues
    
    @staticmethod
    def validate_schedule_data(schedule_data: Dict[str, Any]) -> List[str]:
        """Validate schedule data structure"""
        issues = []
        
        required_fields = ["schedule_type", "start_date", "duration"]
        
        for field in required_fields:
            if field not in schedule_data:
                issues.append(f"Missing required field: {field}")
        
        if "start_date" in schedule_data:
            if not ValidationUtils.validate_date_format(schedule_data["start_date"]):
                issues.append("Invalid start_date format. Use YYYY-MM-DD")
        
        if "duration" in schedule_data:
            if not ValidationUtils.validate_duration(schedule_data["duration"]):
                issues.append("Invalid duration. Use: 1 week, 2 weeks, 1 month, 3 months, or 6 months")
        
        return issues

