"""
Custom exceptions for the LifePlanner application
"""


class PlannerError(Exception):
    """Base exception for all planner-related errors"""
    pass


class ValidationError(PlannerError):
    """Raised when validation fails"""
    
    def __init__(self, message: str, field: str = None, value=None):
        super().__init__(message)
        self.field = field
        self.value = value


class PersonaNotFoundError(PlannerError):
    """Raised when a persona is not found"""
    
    def __init__(self, persona_id: str):
        super().__init__(f"Persona with ID '{persona_id}' not found")
        self.persona_id = persona_id


class ActivityNotFoundError(PlannerError):
    """Raised when an activity is not found"""
    
    def __init__(self, activity_name: str):
        super().__init__(f"Activity '{activity_name}' not found")
        self.activity_name = activity_name


class ConfigurationError(PlannerError):
    """Raised when configuration is invalid or missing"""
    
    def __init__(self, message: str, setting: str = None):
        super().__init__(message)
        self.setting = setting


class DataLoadError(PlannerError):
    """Raised when data cannot be loaded from storage"""
    
    def __init__(self, message: str, file_path: str = None):
        super().__init__(message)
        self.file_path = file_path


class ScheduleGenerationError(PlannerError):
    """Raised when schedule generation fails"""
    
    def __init__(self, message: str, schedule_type: str = None):
        super().__init__(message)
        self.schedule_type = schedule_type
