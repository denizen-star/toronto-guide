# Toronto Life Planner Agent - Optimized Version

A sophisticated and intelligent agent designed to generate personalized daily and weekly itineraries for busy couples exploring new social and professional circles in Toronto. This optimized version addresses common performance issues and provides enhanced features for better user experience.

## 📁 Project Structure

This project is organized into a clean, logical folder structure:

- **`src/core/`** - Core system files and configuration
- **`src/planners/`** - Planning and scheduling modules  
- **`src/demos/`** - Demonstration scripts
- **`src/examples/`** - Usage examples
- **`docs/`** - Documentation and references
- **`data/`** - Data files and schedules
- **`outputs/`** - Generated weekly plans and reports
- **`assets/`** - Static images and media files

📖 **For detailed structure information, see [PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md)**

## 🚀 Key Features & Optimizations

### Core Improvements
- **Smart Activity Selection**: Avoids repetition and intelligently selects activities based on usage patterns
- **Conflict Resolution**: Automatically resolves scheduling conflicts and adjusts times
- **Weather Integration**: Weather-aware activity suggestions with indoor fallbacks
- **Enhanced Networking Focus**: Prioritizes high-networking-potential activities
- **Flexible Configuration**: Comprehensive user preference system
- **Usage Analytics**: Tracks activity usage and provides insights

### Advanced Features
- **Activity Tagging System**: Better categorization and filtering
- **Time Management**: Intelligent time slot allocation with buffers
- **Budget Awareness**: Cost tracking and budget-conscious suggestions
- **Creative Suggestions**: Weekly creative activity recommendations
- **Specific Activity Integration**: Seamlessly integrates user-specified activities

## 📋 Requirements

- Python 3.8+
- No external dependencies (uses only standard library)

## 🛠️ Installation

1. Clone or download the project files
2. Ensure Python 3.8+ is installed
3. No additional packages required

## 🎯 Quick Start

### Run Kevin's Weekly Plan (2025)
```bash
cd outputs/weekly_plans
python3 kevin_weekly_planner_sept_15_22.py
```

### Run a Demo
```bash
cd src/demos
python3 couple_activity_demo.py
```

### Basic Usage

```python
# Import from the planners module
import sys
sys.path.append('src/planners')
from toronto_life_planner import TorontoLifePlanner

# Initialize the planner
planner = TorontoLifePlanner()

# Set weather conditions for better suggestions
planner.set_weather_conditions("sunny")

# Generate a 2-week itinerary
result = planner.generate_itinerary("2025-09-15", "2 weeks")

# Print the itinerary
print(result["acknowledgment"])
for day, schedule in result["itinerary"].items():
    print(f"\n## {day}")
    for slot in schedule:
        print(f"{slot.start_time} - {slot.end_time}: {slot.activity.name}")
        print(f"  Cost: ${slot.activity.cost_cad:.0f} CAD")
        print(f"  Networking: {slot.activity.social_networking_potential}/10")
```

### With Specific Activities

```python
# Define specific activities to integrate
specific_activities = [
    {
        "date": "2024-01-16",
        "name": "Fashion Week Event",
        "start_time": "2:00 PM",
        "duration": 3.0,
        "cost": 100,
        "location": "Fashion District",
        "description": "Exclusive fashion week networking event",
        "networking_potential": 9,
        "energy_level": "high",
        "tags": ["fashion", "networking", "exclusive"]
    }
]

# Generate itinerary with specific activities
result = planner.generate_itinerary("2024-01-15", "2 weeks", specific_activities)
```

## ⚙️ Configuration

### Using the Configuration System

```python
from config import ConfigManager, create_fashion_industry_config

# Load existing configuration
config_manager = ConfigManager()

# Update preferences
config_manager.update_user_preferences(
    networking_priority=9,
    max_daily_cost=250.0,
    preferred_locations={"Downtown", "Fashion District"}
)

# Use preset configurations
fashion_config = create_fashion_industry_config()
budget_config = create_budget_conscious_config()
```

### Configuration Options

#### User Preferences
- **Schedule Constraints**: Morning start time, bedtime, meal times
- **Budget Settings**: Daily budget limits, budget level (budget/moderate/premium)
- **Networking Focus**: Priority level (1-10), minimum networking score
- **Activity Preferences**: Preferred/avoided activity types and locations
- **Weather Sensitivity**: Weather-aware activity selection
- **Repetition Control**: Avoid repeating activities within specified timeframe

#### Planner Settings
- **Activity Limits**: Maximum activities per day, minimum networking activities per week
- **Output Options**: Cost breakdown, networking scores, activity tags
- **Advanced Features**: Conflict resolution, smart selection, time buffers
- **Analytics**: Usage tracking, report generation

## 📊 Activity Database

The planner includes a comprehensive database of Toronto activities with:

### Activity Types
- **Morning Routines**: Meditation, yoga, coffee & news
- **Breakfast Options**: Home-cooked, cafe, social brunch
- **Social & Professional**: Gallery openings, industry mixers, workshops
- **Fitness & Active**: Running, pilates, tennis, rock climbing, dance
- **Evening Activities**: Theater, jazz clubs, comedy shows, rooftop dinners
- **Evening Routines**: Reading, reflection, couple's meditation

### Activity Properties
- **Duration**: Hours required
- **Cost**: CAD pricing
- **Location**: Specific Toronto areas
- **Networking Potential**: 1-10 scale
- **Energy Level**: Low/medium/high
- **Tags**: Categorization for better filtering
- **Weather Dependency**: Indoor/outdoor considerations
- **Day Preferences**: Weekday/weekend specific

## 🎨 Creative Suggestions

The planner provides creative weekly activity suggestions not in the main database:

```python
# Get creative suggestions by theme
suggestion = planner.suggest_creative_activity("art")
# Returns: "Visit a hidden speakeasy in the Entertainment District"

# Get random creative suggestion
suggestion = planner.suggest_creative_activity()
```

## 📈 Analytics & Statistics

Track your activity usage and get insights:

```python
# Get usage statistics
stats = planner.get_activity_stats()
print(f"Activities Used: {stats['used_activities']}")
print(f"Most Used: {stats['most_used_activity']}")

# Reset planner state
planner.reset_planner()
```

## 🔧 Advanced Features

### Weather Integration

```python
# Set weather conditions
planner.set_weather_conditions("rainy")  # Will prefer indoor activities
planner.set_weather_conditions("sunny")  # Will include outdoor activities
```

### Conflict Resolution

The planner automatically:
- Detects time conflicts between activities
- Adjusts start times with buffers
- Prioritizes user-specified activities
- Maintains logical activity flow

### Smart Activity Selection

- Avoids repeating activities within the repetition window
- Prioritizes activities with lower usage counts
- Considers networking potential and user preferences
- Balances energy levels throughout the day

## 📅 Duration Support

### 2 Weeks & 1 Month
- Detailed daily breakdowns
- Hourly time slots
- Specific activity recommendations
- Cost tracking and networking scores

### 3 & 6 Months
- Monthly theme-based roadmaps
- High-level activity planning
- Progressive networking goals
- Creative monthly highlights

## 🎯 Example Output

### Daily Itinerary
```
## Day 1: Monday, January 15, 2024

📅 **6:00 AM - 7:00 AM:** Morning Meditation & Journaling
   💰 Cost: $0 CAD
   📍 Location: Home
   🌟 Networking Potential: 0/10
   🏷️ Tags: mindfulness, home, personal
   📝 Notes: Start your day with intention and energy

🎯 **2:00 PM - 5:00 PM:** Fashion Week Event
   💰 Cost: $100 CAD
   📍 Location: Fashion District
   🌟 Networking Potential: 9/10
   🏷️ Tags: fashion, networking, exclusive
   📝 Notes: 🎯 Priority Activity: Exclusive fashion week networking event
```

### Summary Table
```
## 📊 Weekly Summary Table

| Day | Date | Morning | Main Activity | Evening | Total Cost | Networking Score |
|-----|------|---------|---------------|---------|------------|------------------|
| Day 1 | Monday, January 15, 2024 | Morning Meditation | Fashion Week Event | Wind-down Reading | $120 | 9/10 |
| Day 2 | Tuesday, January 16, 2024 | Yoga Flow Session | Art Gallery Opening | Couple's Meditation | $65 | 8/10 |
```

## 🚀 Performance Optimizations

### What Was Improved
1. **Activity Selection**: Smart filtering prevents repetition and improves variety
2. **Conflict Resolution**: Automatic time conflict detection and resolution
3. **Weather Awareness**: Context-aware activity suggestions
4. **Usage Tracking**: Prevents overuse of popular activities
5. **Time Management**: Better time slot allocation and buffer management
6. **Configuration System**: Flexible user preference management
7. **Analytics**: Usage insights and performance tracking

### Performance Benefits
- **Faster Execution**: Optimized algorithms and data structures
- **Better Variety**: Smart activity rotation prevents monotony
- **Conflict-Free Schedules**: Automatic conflict resolution
- **Personalized Experience**: Comprehensive configuration options
- **Reliable Output**: Consistent, well-formatted results

## 🔮 Future Enhancements

- **Weather API Integration**: Real-time weather data
- **Machine Learning**: Learn from user preferences over time
- **Social Media Integration**: Share itineraries and get feedback
- **Mobile App**: Native mobile application
- **Calendar Integration**: Sync with Google Calendar, Outlook
- **Location Services**: GPS-based activity suggestions
- **Group Planning**: Multi-person itinerary coordination

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📞 Support

For questions, issues, or feature requests, please open an issue in the project repository.

---

**The Toronto Life Planner Agent** - Building meaningful connections, one day at a time! 🎯✨
