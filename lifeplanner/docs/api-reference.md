# LifePlanner API Reference

## 📖 Table of Contents

1. [Core Models](#core-models)
2. [Application API](#application-api)
3. [Service APIs](#service-apis)
4. [Repository APIs](#repository-apis)
5. [Utility Functions](#utility-functions)
6. [Exceptions](#exceptions)

## 🏗️ Core Models

### Activity

Represents a single activity that can be scheduled.

```python
@dataclass
class Activity:
    name: str                                    # Activity name
    activity_type: ActivityType                  # Type of activity
    duration_hours: float                        # Duration in hours
    cost_cad: float                             # Cost in CAD
    location: str                               # Location
    description: str                            # Description
    
    # Scoring metrics
    social_networking_potential: int = 0        # 1-10 scale
    energy_level: str = "medium"                # "low", "medium", "high"
    connection_depth: int = 0                   # 1-10 (couple activities)
    emotional_safety_level: int = 0             # 1-10 (couple activities)
    
    # Metadata
    day_preference: Optional[str] = None        # "weekday", "weekend"
    weather_dependent: bool = False
    indoor: bool = True
    tags: Set[str] = field(default_factory=set)
    is_habit_stacked: bool = False
    requires_planning: bool = False
    
    # Usage tracking
    usage_count: int = 0
    last_used: Optional[datetime] = None
```

**Methods:**
- `to_dict() -> Dict`: Convert to dictionary for JSON serialization
- `from_dict(data: Dict) -> Activity`: Create from dictionary
- `matches_criteria(**kwargs) -> bool`: Check if activity matches criteria

### Persona

Represents a user's personality profile and preferences.

```python
@dataclass
class Persona:
    id: str                                     # Unique identifier
    name: str                                   # Display name
    description: str                            # Description
    
    # Core characteristics
    personality_type: PersonalityType           # Personality type
    energy_pattern: str                         # Energy pattern
    social_style: str                          # Social interaction style
    
    # Preferences
    preferred_activities: Set[ActivityType]     # Preferred activity types
    preferred_locations: Set[str]               # Preferred locations
    budget_level: str                          # Budget level
    
    # Constraints
    max_daily_budget: float = 0.0              # Maximum daily budget
    available_days: Set[str] = field(default_factory=set)  # Available days
    
    # Goals
    primary_goals: List[str] = field(default_factory=list)  # Primary goals
    networking_priority: int = 0                # Networking priority (1-10)
```

**Methods:**
- `to_dict() -> Dict`: Convert to dictionary for JSON serialization
- `from_dict(data: Dict) -> Persona`: Create from dictionary
- `matches_activity(activity: Activity) -> bool`: Check if activity matches persona
- `get_activity_score(activity: Activity) -> float`: Get match score (0-1)

### Schedule

Container for time slots representing a daily or weekly schedule.

```python
@dataclass
class Schedule:
    date: str                                   # Schedule date
    time_slots: List[TimeSlot] = field(default_factory=list)  # Time slots
    schedule_type: str = "individual"           # Schedule type
    notes: str = ""                            # Additional notes
```

**Methods:**
- `add_time_slot(slot: TimeSlot)`: Add a time slot
- `remove_time_slot(index: int)`: Remove a time slot
- `get_total_cost() -> float`: Calculate total cost
- `get_activity_count() -> int`: Get number of activities
- `to_dict() -> Dict`: Convert to dictionary

### TimeSlot

Represents a scheduled time period with an activity.

```python
@dataclass
class TimeSlot:
    start_time: str                             # Start time (e.g., "6:00 AM")
    end_time: str                               # End time (e.g., "7:00 AM")
    activity: Activity                          # Scheduled activity
    notes: str = ""                            # Additional notes
    is_specific_activity: bool = False         # Is this a specific activity?
    is_habit_stacked: bool = False             # Is this habit stacked?
    emotional_check_in: bool = False           # Is this an emotional check-in?
```

## 🚀 Application API

### LifePlannerApp

Main application class that orchestrates all services.

```python
class LifePlannerApp:
    def __init__(self, config_file: str = "data/settings.json")
```

**Methods:**

#### `set_persona(persona_id: str) -> bool`
Set the active persona for planning.

**Parameters:**
- `persona_id` (str): ID of the persona to set

**Returns:**
- `bool`: True if successful, False otherwise

**Raises:**
- `PersonaNotFoundError`: If persona doesn't exist

**Example:**
```python
app = LifePlannerApp()
app.set_persona("kevin_head_of_data")
```

#### `generate_schedule(start_date: str, duration: str, schedule_type: str = "integrated", focus_areas: Optional[List[str]] = None) -> Dict`
Generate a schedule using the planner agent.

**Parameters:**
- `start_date` (str): Start date in YYYY-MM-DD format
- `duration` (str): Duration ("1 week", "2 weeks", "1 month", "3 months", "6 months")
- `schedule_type` (str): Type of schedule ("individual", "couple", "integrated")
- `focus_areas` (Optional[List[str]]): List of focus areas

**Returns:**
- `Dict`: Schedule result with acknowledgment, schedule data, and summary

**Raises:**
- `ValidationError`: If inputs are invalid
- `PlannerError`: If schedule generation fails

**Example:**
```python
result = app.generate_schedule(
    start_date="2024-01-15",
    duration="1 week",
    schedule_type="integrated",
    focus_areas=["fitness", "networking"]
)
```

#### `get_available_personas() -> List[Dict]`
Get list of available personas.

**Returns:**
- `List[Dict]`: List of persona information dictionaries

**Example:**
```python
personas = app.get_available_personas()
for persona in personas:
    print(f"{persona['name']} ({persona['id']})")
```

#### `get_activity_statistics() -> Dict`
Get activity statistics.

**Returns:**
- `Dict`: Statistics including total activities, by type, averages

**Example:**
```python
stats = app.get_activity_statistics()
print(f"Total activities: {stats['total_activities']}")
```

#### `update_settings(**kwargs) -> bool`
Update application settings.

**Parameters:**
- `**kwargs`: Settings to update

**Returns:**
- `bool`: True if successful

**Example:**
```python
app.update_settings(
    user_name="New Name",
    max_daily_budget=250.0
)
```

#### `reset_planner()`
Reset planner state to start fresh.

**Example:**
```python
app.reset_planner()
```

#### `get_app_status() -> Dict`
Get application status and statistics.

**Returns:**
- `Dict`: Status information

**Example:**
```python
status = app.get_app_status()
print(f"Active persona: {status['active_persona']}")
```

## 🔧 Service APIs

### PersonaService

Service layer for persona management.

```python
class PersonaService:
    def __init__(self, repository: Optional[PersonaRepository] = None)
```

**Methods:**

#### `get_all_personas() -> List[Persona]`
Get all active personas.

#### `get_persona_by_id(persona_id: str) -> Optional[Persona]`
Get a specific persona by ID.

#### `create_persona(persona: Persona) -> bool`
Create a new persona.

#### `update_persona(persona: Persona) -> bool`
Update an existing persona.

#### `delete_persona(persona_id: str) -> bool`
Delete a persona (soft delete).

#### `get_persona_recommendations(persona_id: str) -> List[dict]`
Get activity recommendations for a persona.

#### `increment_usage(persona_id: str) -> bool`
Increment usage count for a persona.

### ActivityService

Service layer for activity management.

```python
class ActivityService:
    def __init__(self, repository: Optional[ActivityRepository] = None)
```

**Methods:**

#### `get_all_activities() -> List[Activity]`
Get all activities.

#### `get_activities_by_type(activity_type: ActivityType) -> List[Activity]`
Get activities by type.

#### `get_activities_by_tags(tags: Set[str]) -> List[Activity]`
Get activities that match any of the specified tags.

#### `get_activities_for_persona(persona: Persona) -> List[Activity]`
Get activities filtered for a specific persona.

#### `select_activity(activity_type: ActivityType, persona: Optional[Persona] = None, exclude_used: bool = True, min_networking: int = 0, max_cost: Optional[float] = None) -> Optional[Activity]`
Select an activity based on criteria.

#### `update_activity_usage(activity: Activity) -> bool`
Update activity usage statistics.

#### `get_activity_statistics() -> dict`
Get statistics about activities.

### ConfigurationService

Service layer for configuration management.

```python
class ConfigurationService:
    def __init__(self, config_file: str = "data/settings.json")
```

**Methods:**

#### `load_settings() -> AppSettings`
Load settings from storage.

#### `save_settings(settings: AppSettings) -> bool`
Save settings to storage.

#### `update_settings(**kwargs) -> bool`
Update specific settings.

#### `validate_settings(settings: AppSettings) -> list`
Validate settings and return list of issues.

#### `reset_to_defaults() -> bool`
Reset settings to defaults.

## 🗄️ Repository APIs

### PersonaRepository

Repository for persona data access.

```python
class PersonaRepository:
    def __init__(self, data_file: str = "data/personas.json")
```

**Methods:**

#### `load_all() -> List[Persona]`
Load all personas from storage.

#### `load_by_id(persona_id: str) -> Optional[Persona]`
Load a specific persona by ID.

#### `save(persona: Persona) -> bool`
Save a persona to storage.

#### `delete(persona_id: str) -> bool`
Delete a persona by ID.

#### `exists(persona_id: str) -> bool`
Check if a persona exists.

### ActivityRepository

Repository for activity data access.

```python
class ActivityRepository:
    def __init__(self, data_file: str = "data/activities.json")
```

**Methods:**

#### `load_all() -> List[Activity]`
Load all activities from storage.

#### `load_by_type(activity_type: ActivityType) -> List[Activity]`
Load activities by type.

#### `load_by_tags(tags: Set[str]) -> List[Activity]`
Load activities that have any of the specified tags.

#### `load_by_networking_potential(min_potential: int) -> List[Activity]`
Load activities with minimum networking potential.

#### `load_by_cost_range(max_cost: float) -> List[Activity]`
Load activities within cost range.

#### `save(activity: Activity) -> bool`
Save an activity to storage.

#### `delete(activity_name: str) -> bool`
Delete an activity by name.

## 🛠️ Utility Functions

### TimeUtils

Utility class for time-related operations.

```python
class TimeUtils:
    @staticmethod
    def time_to_minutes(time_str: str) -> int
    @staticmethod
    def minutes_to_time(minutes: int) -> str
    @staticmethod
    def calculate_end_time(start_time: str, duration_hours: float) -> str
    @staticmethod
    def has_time_conflict(slot1_start: str, slot1_end: str, slot2_start: str, slot2_end: str) -> bool
    @staticmethod
    def sort_time_slots(time_slots: List) -> List
    @staticmethod
    def resolve_time_conflicts(time_slots: List) -> List
    @staticmethod
    def get_duration_days(start_date: str, duration: str) -> int
    @staticmethod
    def is_weekend(date: datetime) -> bool
    @staticmethod
    def get_day_name(date: datetime) -> str
    @staticmethod
    def format_date_key(day_num: int, date: datetime) -> str
```

### ValidationUtils

Utility class for validation operations.

```python
class ValidationUtils:
    @staticmethod
    def validate_time_format(time_str: str) -> bool
    @staticmethod
    def validate_date_format(date_str: str) -> bool
    @staticmethod
    def validate_duration(duration: str) -> bool
    @staticmethod
    def validate_budget(budget: float) -> List[str]
    @staticmethod
    def validate_networking_priority(priority: int) -> List[str]
    @staticmethod
    def validate_activity_score(score: int, score_name: str) -> List[str]
    @staticmethod
    def validate_persona_data(persona_data: Dict[str, Any]) -> List[str]
    @staticmethod
    def validate_activity_data(activity_data: Dict[str, Any]) -> List[str]
    @staticmethod
    def validate_schedule_data(schedule_data: Dict[str, Any]) -> List[str]
```

## ⚠️ Exceptions

### PlannerError

Base exception for all planner-related errors.

```python
class PlannerError(Exception):
    pass
```

### ValidationError

Raised when validation fails.

```python
class ValidationError(PlannerError):
    def __init__(self, message: str, field: str = None, value=None)
```

### PersonaNotFoundError

Raised when a persona is not found.

```python
class PersonaNotFoundError(PlannerError):
    def __init__(self, persona_id: str)
```

### ActivityNotFoundError

Raised when an activity is not found.

```python
class ActivityNotFoundError(PlannerError):
    def __init__(self, activity_name: str)
```

### ConfigurationError

Raised when configuration is invalid or missing.

```python
class ConfigurationError(PlannerError):
    def __init__(self, message: str, setting: str = None)
```

### DataLoadError

Raised when data cannot be loaded from storage.

```python
class DataLoadError(PlannerError):
    def __init__(self, message: str, file_path: str = None)
```

### ScheduleGenerationError

Raised when schedule generation fails.

```python
class ScheduleGenerationError(PlannerError):
    def __init__(self, message: str, schedule_type: str = None)
```

## 📝 Usage Examples

### Basic Usage

```python
from src.features.application import LifePlannerApp
from src.shared.exceptions import PlannerError, ValidationError

# Initialize application
app = LifePlannerApp()

# Set persona
app.set_persona("kevin_head_of_data")

# Generate schedule
try:
    result = app.generate_schedule(
        start_date="2024-01-15",
        duration="1 week",
        schedule_type="integrated",
        focus_areas=["fitness", "networking"]
    )
    print(result["acknowledgment"])
except ValidationError as e:
    print(f"Validation failed: {e}")
except PlannerError as e:
    print(f"Planning failed: {e}")
```

### Advanced Usage

```python
# Get available personas
personas = app.get_available_personas()
print(f"Available personas: {[p['name'] for p in personas]}")

# Get activity statistics
stats = app.get_activity_statistics()
print(f"Total activities: {stats['total_activities']}")

# Update settings
app.update_settings(
    user_name="New Name",
    max_daily_budget=250.0
)

# Get app status
status = app.get_app_status()
print(f"Active persona: {status['active_persona']}")
```

---

**For more examples, see the [User Guide](user-guide.md) and [Developer Guide](developer-guide.md).**

