# LifePlanner User Guide

## 📖 Table of Contents

1. [Getting Started](#getting-started)
2. [Understanding Personas](#understanding-personas)
3. [Creating Schedules](#creating-schedules)
4. [Managing Activities](#managing-activities)
5. [Configuration](#configuration)
6. [Output Formats](#output-formats)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Features](#advanced-features)

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lifeplanner.git
   cd lifeplanner
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python -m src.features.application.life_planner_app
   ```

### First Run

When you first run LifePlanner, it will:
- Create default configuration files
- Load sample personas and activities
- Set up the data directory structure

## 👤 Understanding Personas

Personas are the heart of LifePlanner's personalization system. They define your preferences, constraints, and goals.

### Default Personas

**Kevin - Head of Data**
- Personality: Introvert-Extrovert
- Energy Pattern: Not a morning person
- Social Style: Selective
- Budget: Moderate ($200/day)
- Goals: Build healthy social network, professional networking

**Peter - Fashion Director**
- Personality: Extrovert
- Energy Pattern: Variable
- Social Style: Established network
- Budget: Premium ($500/day)
- Goals: Support Kevin's networking, maintain celebrity status

### Creating Custom Personas

```python
from src.shared.models import Persona, PersonalityType

persona = Persona(
    id="my_custom_persona",
    name="My Custom Persona",
    description="A custom persona for my needs",
    personality_type=PersonalityType.AMBIVERT,
    energy_pattern="morning",
    social_style="networker",
    preferred_activities={"fitness", "social", "cultural"},
    preferred_locations={"Downtown", "Parks", "Restaurants"},
    budget_level="moderate",
    max_daily_budget=150.0,
    available_days={"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"},
    primary_goals=["Fitness", "Networking", "Learning"],
    networking_priority=8
)
```

## 📅 Creating Schedules

### Basic Schedule Generation

```python
from src.features.application import LifePlannerApp

app = LifePlannerApp()

# Set your persona
app.set_persona("kevin_head_of_data")

# Generate a 1-week integrated schedule
result = app.generate_schedule(
    start_date="2024-01-15",
    duration="1 week",
    schedule_type="integrated",
    focus_areas=["fitness", "networking"]
)
```

### Schedule Types

#### Individual Planning
Focuses on personal development and individual goals:
```python
result = app.generate_schedule(
    start_date="2024-01-15",
    duration="1 week",
    schedule_type="individual",
    focus_areas=["fitness", "professional_development"]
)
```

#### Couple Planning
Emphasizes relationship building and shared activities:
```python
result = app.generate_schedule(
    start_date="2024-01-15",
    duration="1 week",
    schedule_type="couple",
    focus_areas=["quality_time", "emotional_safety"]
)
```

#### Integrated Planning
Combines individual and couple activities:
```python
result = app.generate_schedule(
    start_date="2024-01-15",
    duration="1 week",
    schedule_type="integrated",
    focus_areas=["fitness", "networking", "quality_time"]
)
```

### Focus Areas

Available focus areas include:
- `fitness` - Physical activities and exercise
- `networking` - Professional and social connections
- `cultural` - Arts, museums, and cultural events
- `creative` - Artistic and creative pursuits
- `professional` - Work-related activities
- `quality_time` - Couple-focused activities
- `emotional_safety` - Relationship building exercises
- `adventure` - New experiences and exploration

## 🎯 Managing Activities

### Activity Types

LifePlanner includes various activity types:

**Individual Activities:**
- `morning_routine` - Wake up and preparation
- `breakfast` - Morning meal
- `activity` - General activities
- `dinner` - Evening meal
- `evening_routine` - Wind-down activities
- `social` - Social networking
- `professional` - Work-related
- `fitness` - Physical exercise
- `creative` - Artistic pursuits
- `cultural` - Cultural events

**Couple Activities:**
- `couple_daily_connection` - Daily bonding
- `couple_emotional_safety` - Emotional check-ins
- `couple_shared_goals` - Goal planning
- `couple_quality_time` - Quality time together
- `couple_adventure` - New experiences
- `couple_intimacy` - Intimate activities
- `couple_learning` - Learning together
- `couple_service` - Service activities
- `couple_creative` - Creative collaboration

### Activity Attributes

Each activity has several attributes:
- **Duration**: How long the activity takes
- **Cost**: Price in CAD
- **Location**: Where it takes place
- **Networking Potential**: 1-10 scale for social value
- **Energy Level**: Low, medium, or high
- **Connection Depth**: 1-10 scale for couple activities
- **Emotional Safety**: 1-10 scale for couple activities

## ⚙️ Configuration

### Settings File

The main configuration is in `data/settings.json`:

```json
{
  "user_name": "Kevin",
  "partner_name": "Peter",
  "morning_start": "6:00 AM",
  "bedtime": "10:30 PM",
  "max_daily_budget": 200.0,
  "max_weekly_budget": 1000.0,
  "core_requirements": {
    "meditation": {
      "frequency": "progressive",
      "current_week": 0
    },
    "running": {
      "schedule": {
        "Tuesday": 60,
        "Thursday": 60,
        "Friday": 60,
        "Sunday": 120
      }
    },
    "work_hours": {
      "start": "9:00 AM",
      "end": "6:00 PM",
      "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    }
  }
}
```

### Updating Settings

```python
# Update specific settings
app.update_settings(
    user_name="New Name",
    max_daily_budget=250.0,
    morning_start="5:30 AM"
)

# Reset to defaults
app.config_service.reset_to_defaults()
```

## 📄 Output Formats

### Markdown Format

```markdown
# Daily Schedule - January 15, 2024

## Morning Routine
- **6:00 AM - 6:30 AM**: Wake Up & Hydration
  - 💰 $0 | 🌟 Networking: 0/10
  - Location: Home

## Main Activities
- **2:00 PM - 4:00 PM**: Art Gallery Opening
  - 💰 $0 | 🌟 Networking: 8/10
  - Location: Gallery District
  - Tags: art, networking, cultural, evening
```

### JSON Format

```json
{
  "acknowledgment": "🎯 Life Planner - Integrated Schedule Generated!",
  "schedule": {
    "date": "2024-01-15",
    "time_slots": [
      {
        "start_time": "6:00 AM",
        "end_time": "6:30 AM",
        "activity": {
          "name": "Wake Up & Hydration",
          "activity_type": "morning_routine",
          "duration_hours": 0.25,
          "cost_cad": 0,
          "location": "Home",
          "networking_potential": 0,
          "energy_level": "low"
        },
        "notes": "Morning routine and preparation"
      }
    ]
  },
  "summary": "## 📊 Schedule Summary\n\n**Total Activities:** 5\n**Total Cost:** $150 CAD"
}
```

### CSV Format

```csv
start_time,end_time,activity_name,activity_type,cost_cad,location,networking_potential
6:00 AM,6:30 AM,Wake Up & Hydration,morning_routine,0,Home,0
2:00 PM,4:00 PM,Art Gallery Opening,social,0,Gallery District,8
```

## 🔧 Troubleshooting

### Common Issues

#### "Persona not found" Error
```python
# Check available personas
personas = app.get_available_personas()
print([p["id"] for p in personas])

# Use correct persona ID
app.set_persona("kevin_head_of_data")
```

#### "No activities available" Error
```python
# Check activity statistics
stats = app.get_activity_statistics()
print(f"Total activities: {stats['total_activities']}")

# Check if activities are loaded
print(f"Activities loaded: {len(app.planner.activities)}")
```

#### "Validation failed" Error
```python
# Check date format (use YYYY-MM-DD)
start_date = "2024-01-15"  # Correct format

# Check duration (use valid options)
duration = "1 week"  # Valid: "1 week", "2 weeks", "1 month", "3 months", "6 months"
```

### Debug Mode

Enable debug logging:
```python
import logging
logging.basicConfig(level=logging.DEBUG)

app = LifePlannerApp()
```

## 🚀 Advanced Features

### Custom Activity Creation

```python
from src.shared.models import Activity, ActivityType

custom_activity = Activity(
    name="My Custom Activity",
    activity_type=ActivityType.SOCIAL,
    duration_hours=2.0,
    cost_cad=50.0,
    location="Custom Location",
    description="A custom activity I created",
    networking_potential=7,
    energy_level="medium",
    tags={"custom", "personal"}
)

# Add to activity service
app.activity_service.repository.save(custom_activity)
```

### Batch Schedule Generation

```python
# Generate multiple schedules
schedules = []
for i in range(4):  # Generate 4 weeks
    start_date = f"2024-01-{15 + i*7:02d}"
    result = app.generate_schedule(
        start_date=start_date,
        duration="1 week",
        schedule_type="integrated"
    )
    schedules.append(result)
```

### Performance Monitoring

```python
# Get app status
status = app.get_app_status()
print(f"Total activities: {status['total_activities']}")
print(f"Used activities: {status['used_activities']}")
print(f"Available personas: {status['available_personas']}")
```

## 📞 Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [API Reference](api-reference.md)
3. Check [GitHub Issues](https://github.com/yourusername/lifeplanner/issues)
4. Join [GitHub Discussions](https://github.com/yourusername/lifeplanner/discussions)

---

**Happy Planning! 🎯**

