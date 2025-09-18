# LifePlanner Migration Guide

## 📖 Table of Contents

1. [Overview](#overview)
2. [Migration from Old System](#migration-from-old-system)
3. [Data Migration](#data-migration)
4. [API Changes](#api-changes)
5. [Configuration Changes](#configuration-changes)
6. [Troubleshooting](#troubleshooting)

## 🔄 Overview

This guide helps you migrate from the old LifePlanner system to the new refactored version. The new system provides:

- **Unified Architecture**: Single agent for all planning types
- **Service Layer**: Clean separation of business logic
- **Repository Pattern**: Abstracted data access
- **Better Error Handling**: Comprehensive exception system
- **Improved Performance**: Optimized algorithms and caching

## 🚀 Migration from Old System

### Step 1: Backup Current Data

```bash
# Create backup of current data
cp -r data/ data_backup/
cp -r src/ src_backup/
```

### Step 2: Install New System

```bash
# Clone new repository
git clone https://github.com/yourusername/lifeplanner.git
cd lifeplanner

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Migrate Data

The new system automatically migrates your existing data:

```python
from src.features.application import LifePlannerApp

# Initialize app (will migrate data automatically)
app = LifePlannerApp()

# Verify migration
personas = app.get_available_personas()
print(f"Migrated {len(personas)} personas")
```

### Step 4: Update Code

#### Old Code
```python
from src.planners.toronto_life_planner import TorontoLifePlanner
from src.planners.couple_activity_scheduler import CoupleActivityScheduler

# Create planners
individual_planner = TorontoLifePlanner()
couple_planner = CoupleActivityScheduler()

# Generate schedules
individual_schedule = individual_planner.generate_schedule(...)
couple_schedule = couple_planner.generate_schedule(...)
```

#### New Code
```python
from src.features.application import LifePlannerApp

# Create unified app
app = LifePlannerApp()

# Set persona
app.set_persona("kevin_head_of_data")

# Generate any type of schedule
individual_schedule = app.generate_schedule(
    start_date="2024-01-15",
    duration="1 week",
    schedule_type="individual"
)

couple_schedule = app.generate_schedule(
    start_date="2024-01-15",
    duration="1 week",
    schedule_type="couple"
)

integrated_schedule = app.generate_schedule(
    start_date="2024-01-15",
    duration="1 week",
    schedule_type="integrated"
)
```

## 📊 Data Migration

### Persona Data

#### Old Format
```python
# src/core/personas.py
class UserPersona:
    def __init__(self, demographics, personality_profile, goals_and_aspirations, ...):
        self.demographics = demographics
        self.personality_profile = personality_profile
        # ... complex nested structure
```

#### New Format
```python
# src/shared/models/persona.py
@dataclass
class Persona:
    id: str
    name: str
    description: str
    personality_type: PersonalityType
    energy_pattern: str
    social_style: str
    # ... simplified structure
```

### Activity Data

#### Old Format
```python
# Multiple activity classes
class Activity:
    def __init__(self, name, duration, cost, ...):
        # Individual activity attributes

class CoupleActivity:
    def __init__(self, name, duration, cost, connection_depth, ...):
        # Couple activity attributes
```

#### New Format
```python
# Unified activity class
@dataclass
class Activity:
    name: str
    activity_type: ActivityType
    duration_hours: float
    cost_cad: float
    location: str
    description: str
    # ... unified attributes for all activity types
```

### Migration Script

```python
#!/usr/bin/env python3
"""
Migration script from old to new LifePlanner system
"""

import json
from pathlib import Path
from src.shared.models import Persona, Activity, ActivityType, PersonalityType

def migrate_personas():
    """Migrate personas from old format to new format"""
    # Load old personas
    with open('data_backup/personas.json', 'r') as f:
        old_personas = json.load(f)
    
    new_personas = []
    for persona_data in old_personas.get('personas', []):
        # Convert old format to new format
        new_persona = {
            "id": persona_data.get('id'),
            "name": persona_data.get('name'),
            "description": persona_data.get('description'),
            "personality_type": persona_data.get('personality_type'),
            "energy_pattern": persona_data.get('energy_pattern'),
            "social_style": persona_data.get('social_style'),
            "preferred_activities": persona_data.get('preferred_activities', []),
            "preferred_locations": persona_data.get('preferred_locations', []),
            "budget_level": persona_data.get('budget_level', 'moderate'),
            "max_daily_budget": persona_data.get('max_daily_budget', 200.0),
            "available_days": persona_data.get('available_days', []),
            "primary_goals": persona_data.get('primary_goals', []),
            "networking_priority": persona_data.get('networking_priority', 5)
        }
        new_personas.append(new_persona)
    
    # Save new format
    with open('data/personas.json', 'w') as f:
        json.dump({"personas": new_personas}, f, indent=2)
    
    print(f"✅ Migrated {len(new_personas)} personas")

def migrate_activities():
    """Migrate activities from old format to new format"""
    # Load old activities
    with open('data_backup/activities.json', 'r') as f:
        old_activities = json.load(f)
    
    new_activities = []
    for activity_data in old_activities.get('activities', []):
        # Convert old format to new format
        new_activity = {
            "name": activity_data.get('name'),
            "activity_type": activity_data.get('activity_type'),
            "duration_hours": activity_data.get('duration_hours'),
            "cost_cad": activity_data.get('cost_cad'),
            "location": activity_data.get('location'),
            "description": activity_data.get('description'),
            "social_networking_potential": activity_data.get('networking_potential', 0),
            "energy_level": activity_data.get('energy_level', 'medium'),
            "connection_depth": activity_data.get('connection_depth', 0),
            "emotional_safety_level": activity_data.get('emotional_safety', 0),
            "day_preference": activity_data.get('day_preference'),
            "weather_dependent": activity_data.get('weather_dependent', False),
            "indoor": activity_data.get('indoor', True),
            "tags": activity_data.get('tags', []),
            "is_habit_stacked": activity_data.get('is_habit_stacked', False),
            "requires_planning": activity_data.get('requires_planning', False),
            "usage_count": 0,
            "last_used": None
        }
        new_activities.append(new_activity)
    
    # Save new format
    with open('data/activities.json', 'w') as f:
        json.dump({"activities": new_activities}, f, indent=2)
    
    print(f"✅ Migrated {len(new_activities)} activities")

if __name__ == "__main__":
    print("🔄 Starting LifePlanner migration...")
    migrate_personas()
    migrate_activities()
    print("✅ Migration completed!")
```

## 🔧 API Changes

### Planner Classes

#### Old API
```python
# Multiple planner classes
toronto_planner = TorontoLifePlanner()
couple_planner = CoupleActivityScheduler()
integrated_planner = IntegratedCouplePlanner()

# Different methods for each
individual_result = toronto_planner.generate_schedule(...)
couple_result = couple_planner.generate_schedule(...)
integrated_result = integrated_planner.generate_schedule(...)
```

#### New API
```python
# Single unified app
app = LifePlannerApp()

# Same method for all types
individual_result = app.generate_schedule(..., schedule_type="individual")
couple_result = app.generate_schedule(..., schedule_type="couple")
integrated_result = app.generate_schedule(..., schedule_type="integrated")
```

### Error Handling

#### Old API
```python
try:
    result = planner.generate_schedule(...)
    if "error" in result:
        print(f"Error: {result['error']}")
except Exception as e:
    print(f"Unexpected error: {e}")
```

#### New API
```python
from src.shared.exceptions import ValidationError, PlannerError

try:
    result = app.generate_schedule(...)
except ValidationError as e:
    print(f"Validation error: {e}")
except PlannerError as e:
    print(f"Planning error: {e}")
```

### Configuration

#### Old API
```python
from src.core.config import ConfigManager

config_manager = ConfigManager()
settings = config_manager.load_config()
```

#### New API
```python
from src.features.application import LifePlannerApp

app = LifePlannerApp()
settings = app.settings
```

## ⚙️ Configuration Changes

### Settings File

#### Old Format
```json
{
  "user_preferences": {
    "name": "Kevin",
    "partner_name": "Peter"
  },
  "planner_config": {
    "morning_start": "6:00 AM",
    "bedtime": "10:30 PM"
  }
}
```

#### New Format
```json
{
  "user_name": "Kevin",
  "partner_name": "Peter",
  "morning_start": "6:00 AM",
  "bedtime": "10:30 PM",
  "max_daily_budget": 200.0,
  "max_weekly_budget": 1000.0,
  "core_requirements": {
    "meditation": {"frequency": "progressive"},
    "running": {"schedule": {"Tuesday": 60, "Thursday": 60}}
  }
}
```

### Environment Variables

```bash
# New environment variables
export LIFEPLANNER_LOG_LEVEL=INFO
export LIFEPLANNER_DATA_DIR=data
export LIFEPLANNER_CONFIG_FILE=data/settings.json
```

## 🔍 Troubleshooting

### Common Migration Issues

#### 1. Import Errors
```python
# Old imports (will fail)
from src.planners.toronto_life_planner import TorontoLifePlanner

# New imports
from src.features.application import LifePlannerApp
```

#### 2. Data Format Issues
```python
# Check data format
import json
with open('data/personas.json', 'r') as f:
    data = json.load(f)
    print(json.dumps(data, indent=2))
```

#### 3. Persona Not Found
```python
# Check available personas
app = LifePlannerApp()
personas = app.get_available_personas()
print([p['id'] for p in personas])
```

#### 4. Activity Selection Issues
```python
# Check activity statistics
stats = app.get_activity_statistics()
print(f"Total activities: {stats['total_activities']}")
```

### Migration Validation

```python
def validate_migration():
    """Validate that migration was successful"""
    app = LifePlannerApp()
    
    # Check personas
    personas = app.get_available_personas()
    assert len(personas) > 0, "No personas found"
    
    # Check activities
    stats = app.get_activity_statistics()
    assert stats['total_activities'] > 0, "No activities found"
    
    # Test schedule generation
    result = app.generate_schedule(
        start_date="2024-01-15",
        duration="1 week",
        schedule_type="integrated"
    )
    assert "schedule" in result, "Schedule generation failed"
    
    print("✅ Migration validation successful!")

if __name__ == "__main__":
    validate_migration()
```

### Rollback Plan

If migration fails, you can rollback:

```bash
# Restore backup data
cp -r data_backup/* data/

# Restore backup code
cp -r src_backup/* src/

# Reinstall old dependencies
pip install -r requirements_old.txt
```

## 📞 Support

If you encounter issues during migration:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [API Reference](api-reference.md)
3. Check [GitHub Issues](https://github.com/yourusername/lifeplanner/issues)
4. Join [GitHub Discussions](https://github.com/yourusername/lifeplanner/discussions)

---

**Migration completed successfully! 🎉**

