# LifePlanner - Intelligent Lifestyle Management System

[![Python Version](https://img.shields.io/badge/python-3.8+-blue.svg)](https://python.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-production--ready-brightgreen.svg)](README.md)

A sophisticated, AI-powered lifestyle planning system designed to help individuals and couples optimize their daily schedules, build meaningful connections, and achieve their personal and relationship goals.

## ✨ Features

### 🎯 **Core Planning**
- **Individual Planning**: Personalized daily and weekly schedules
- **Couple Planning**: Relationship-focused activity scheduling
- **Integrated Planning**: Combined individual and couple activities
- **Persona-Based**: AI-driven recommendations based on personality profiles

### 🧠 **Intelligent Features**
- **Smart Activity Selection**: ML-powered activity recommendations
- **Conflict Resolution**: Automatic time conflict detection and resolution
- **Habit Stacking**: Build new habits by linking them to existing routines
- **Emotional Safety**: Couple activities designed for relationship growth

### 📊 **Analytics & Insights**
- **Usage Tracking**: Monitor activity patterns and preferences
- **Progress Metrics**: Track goal achievement and habit formation
- **Performance Analytics**: Understand what works best for you
- **Recommendation Engine**: Learn from your behavior to suggest improvements

### 🔧 **Flexibility & Customization**
- **Multiple Output Formats**: JSON, Markdown, CSV exports
- **Configurable Settings**: Customize budgets, schedules, and preferences
- **Persona Management**: Create and manage multiple personality profiles
- **Focus Areas**: Target specific goals (fitness, networking, relationships)

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/lifeplanner.git
cd lifeplanner

# Install dependencies
pip install -r requirements.txt

# Run the application
python -m src.features.application.life_planner_app
```

### Basic Usage

```python
from src.features.application import LifePlannerApp

# Initialize the application
app = LifePlannerApp()

# Set your persona
app.set_persona("kevin_head_of_data")

# Generate a schedule
result = app.generate_schedule(
    start_date="2024-01-15",
    duration="1 week",
    schedule_type="integrated",
    focus_areas=["fitness", "networking"]
)

print(result["acknowledgment"])
```

## 📖 Documentation

- **[User Guide](docs/user-guide.md)** - Complete user manual
- **[API Reference](docs/api-reference.md)** - Technical documentation
- **[Developer Guide](docs/developer-guide.md)** - Architecture and extension guide
- **[Migration Guide](docs/migration-guide.md)** - Upgrading from previous versions

## 🏗️ Architecture

```
src/
├── shared/                 # Core models and utilities
│   ├── models/            # Data models (Activity, Persona, Schedule)
│   ├── utils/             # Utility functions
│   └── exceptions/        # Custom exception hierarchy
├── features/              # Feature modules
│   ├── application/       # Main application orchestration
│   ├── configuration/     # Settings management
│   ├── personas/          # Persona management
│   ├── activities/        # Activity management
│   └── scheduling/        # Planning logic
└── examples/              # Example scripts and demos
```

## 🎨 Persona System

LifePlanner uses sophisticated persona profiles to personalize your experience:

- **Personality Types**: Extrovert, Introvert, Ambivert
- **Energy Patterns**: Morning person, evening person, variable
- **Social Styles**: Networker, connector, selective, established network
- **Preferences**: Activity types, locations, budget constraints
- **Goals**: Primary objectives and networking priorities

## 📅 Schedule Types

### Individual Planning
- Personal development activities
- Professional networking
- Fitness and wellness routines
- Creative and cultural pursuits

### Couple Planning
- Daily connection activities
- Emotional safety exercises
- Shared goal planning
- Quality time together
- Adventure and learning experiences

### Integrated Planning
- Combines individual and couple activities
- Balances personal growth with relationship building
- Optimizes time for both partners' needs

## 🔧 Configuration

### Settings File (`data/settings.json`)
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
    "running": {"schedule": {"Tuesday": 60, "Thursday": 60}},
    "work_hours": {"start": "9:00 AM", "end": "6:00 PM"}
  }
}
```

## 📊 Output Formats

### Markdown
```markdown
# Daily Schedule - January 15, 2024

## Morning Routine
- **6:00 AM - 6:30 AM**: Wake Up & Hydration
- **6:30 AM - 7:15 AM**: Morning Exercise

## Main Activities
- **2:00 PM - 4:00 PM**: Art Gallery Opening
  - 💰 $0 | 🌟 Networking: 8/10
```

### JSON
```json
{
  "schedule": {
    "date": "2024-01-15",
    "time_slots": [
      {
        "start_time": "6:00 AM",
        "end_time": "6:30 AM",
        "activity": {
          "name": "Wake Up & Hydration",
          "cost_cad": 0,
          "networking_potential": 0
        }
      }
    ]
  }
}
```

## 🛠️ Development

### Running Tests
```bash
# Run all tests
pytest tests/

# Run specific test categories
pytest tests/unit/
pytest tests/integration/
pytest tests/performance/
```

### Code Quality
```bash
# Lint code
flake8 src/

# Type checking
mypy src/

# Format code
black src/
```

## 📈 Performance

- **Schedule Generation**: < 1 second for 1-week schedules
- **Memory Usage**: < 50MB for typical usage
- **Data Loading**: < 100ms for persona and activity data
- **Concurrent Users**: Supports multiple simultaneous planning sessions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by habit stacking principles from "Atomic Habits"
- Couple activity concepts from relationship psychology research
- Activity recommendations based on urban lifestyle optimization

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/lifeplanner/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/lifeplanner/discussions)

---

**LifePlanner** - Transform your time into meaningful experiences! 🚀

