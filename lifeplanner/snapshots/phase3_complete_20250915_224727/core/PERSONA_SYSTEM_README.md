# Persona System for Toronto Life Planner

A comprehensive persona-driven recommendation system that personalizes activity suggestions, routines, and goal-setting based on detailed user profiles.

## 🎯 Overview

The Persona System enhances the Toronto Life Planner by providing personalized recommendations based on detailed user profiles. Each persona includes demographics, personality traits, goals, preferences, constraints, and behavioral patterns that influence activity selection and routine customization.

## 📁 File Structure

```
personas.py              # Core persona data structures and management
persona_integration.py   # Integration with TorontoLifePlanner
persona_examples.py      # Usage examples and demonstrations
personas.json           # Stored persona data (auto-generated)
```

## 🏗️ Core Components

### 1. UserPersona Class
The main persona data structure containing:

- **Demographics**: Age, life stage, occupation, income level
- **Personality Profile**: Personality type, energy patterns, social style
- **Goals & Aspirations**: Short-term and long-term personal/professional goals
- **Preferences**: Activity types, locations, budget, time preferences
- **Constraints**: Budget limits, time availability, physical limitations
- **Behavioral Patterns**: Typical routines, stress management, learning preferences
- **Networking Profile**: Networking priorities, preferred venues, communication style

### 2. PersonaManager Class
Manages persona storage, retrieval, and basic operations:

```python
from personas import PersonaManager

manager = PersonaManager()
personas = manager.get_all_personas()
persona = manager.get_persona("fashion_professional")
```

### 3. PersonaIntegratedPlanner Class
Enhanced planner with persona-driven recommendations:

```python
from persona_integration import PersonaIntegratedPlanner

planner = PersonaIntegratedPlanner()
planner.set_persona("fashion_professional")
result = planner.generate_persona_itinerary("2024-01-15", "1 week")
```

## 🎭 Predefined Personas

### Fashion Industry Professional
- **Focus**: High networking, premium experiences, industry advancement
- **Characteristics**: Extroverted, morning person, aggressive networking
- **Budget**: Premium ($300/day)
- **Activities**: Fashion shows, industry events, gallery openings

### Creative Entrepreneur
- **Focus**: Creative community, business growth, artistic integrity
- **Characteristics**: Ambivert, variable energy, organic networking
- **Budget**: Moderate ($150/day)
- **Activities**: Art galleries, creative workshops, cultural events

### Wellness-Focused Professional
- **Focus**: Health, work-life balance, meaningful connections
- **Characteristics**: Introverted, morning person, selective networking
- **Budget**: Moderate ($100/day)
- **Activities**: Yoga classes, wellness workshops, nature activities

## 🚀 Quick Start

### 1. Basic Usage

```python
from persona_integration import PersonaIntegratedPlanner

# Initialize planner
planner = PersonaIntegratedPlanner()

# Set active persona
planner.set_persona("fashion_professional")

# Generate personalized itinerary
result = planner.generate_persona_itinerary("2024-01-15", "1 week")

# View results
print(result["persona_summary"])
for day, activities in result["itinerary"].items():
    print(f"\n{day}")
    for slot in activities:
        print(f"  {slot.start_time} - {slot.end_time}: {slot.activity.name}")
```

### 2. Creating Custom Personas

```python
from personas import UserPersona, Demographics, PersonalityProfile, GoalsAndAspirations, Preferences, Constraints, BehavioralPatterns, NetworkingProfile
from personas import LifeStage, PersonalityType, EnergyPattern, SocialStyle, ActivityPreference

# Create custom persona
custom_persona = UserPersona(
    persona_id="my_custom_persona",
    persona_name="My Custom Persona",
    description="A custom persona for specific needs",
    demographics=Demographics(
        age_range=(25, 30),
        life_stage=LifeStage.EARLY_CAREER,
        occupation="Software Developer",
        income_level="moderate"
    ),
    personality=PersonalityProfile(
        personality_type=PersonalityType.INTROVERT,
        energy_pattern=EnergyPattern.EVENING_PERSON,
        social_style=SocialStyle.SELECTIVE
    ),
    # ... other components
)

# Add to manager
manager = PersonaManager()
manager.add_persona(custom_persona)
```

### 3. Getting Activity Recommendations

```python
# Get recommendations for current persona
suggestions = planner.get_persona_activity_suggestions("social")

for suggestion in suggestions[:5]:
    print(f"{suggestion.activity.name} (Match: {suggestion.match_score:.2f})")
    print(f"  Reasons: {', '.join(suggestion.match_reasons)}")
```

## 🔧 Advanced Features

### Persona-Based Activity Scoring
Activities are scored based on:
- Activity type preference match
- Location preference match
- Budget alignment
- Networking opportunity alignment
- Personality compatibility

### Routine Customization
Personas influence:
- Morning routine structure
- Evening wind-down activities
- Weekend activity selection
- Stress management strategies

### Config Integration
Convert existing planner configurations to personas:

```python
from config import create_fashion_industry_config
from persona_integration import PersonaIntegratedPlanner

config = create_fashion_industry_config()
planner = PersonaIntegratedPlanner()
persona = planner.create_persona_from_config(config)
```

## 📊 Persona Analytics

Track persona usage and characteristics:

```python
manager = PersonaManager()
personas = manager.get_all_personas()

# Analyze personality distribution
personality_types = {}
for persona in personas:
    ptype = persona.personality.personality_type.value
    personality_types[ptype] = personality_types.get(ptype, 0) + 1
```

## 💾 Data Persistence

Personas are automatically saved to `personas.json`:

```python
# Save personas
manager.save_personas()

# Load personas (automatic on initialization)
manager = PersonaManager()  # Loads from personas.json
```

## 🎯 Use Cases

### 1. Personalized Planning
- Generate itineraries tailored to specific user types
- Adapt activity selection based on personality and preferences
- Customize routines for different life stages

### 2. A/B Testing
- Test different persona configurations
- Compare activity recommendations across personas
- Optimize planning algorithms for different user types

### 3. Market Segmentation
- Understand different user needs and preferences
- Develop targeted features for specific personas
- Analyze usage patterns across persona types

### 4. Recommendation Engine
- Provide personalized activity suggestions
- Match users with compatible activities
- Suggest networking opportunities based on goals

## 🔍 Example Output

### Persona Summary
```
## 👤 Persona Profile: Fashion Industry Professional

Description: Ambitious fashion professional focused on networking and industry advancement

### 🎯 Key Characteristics
- Life Stage: Mid Career
- Personality: Extrovert
- Energy Pattern: Morning Person
- Social Style: Networker
- Budget Level: Premium

### 🎯 Primary Goals
- Build industry network
- Advance career
- Stay current with trends

### 🏷️ Preferred Activity Types
professional, social, creative, cultural

### 📍 Preferred Locations
Fashion District, Entertainment District, Yorkville, Queen West

### 💰 Budget Constraints
- Daily Max: $300
- Weekly Max: $1500

### 🤝 Networking Profile
- Priority: 9/10
- Approach: Aggressive
- Preferred Venues: Fashion shows, Industry events, Gallery openings
```

### Enhanced Itinerary
```
Day 1: Monday, January 15, 2024
6:00 AM - 6:15 AM: Be Proactive - Wake Up & Intention | Persona Match: 0.85
6:15 AM - 6:45 AM: Begin with the End in Mind | Persona Match: 0.90
6:45 AM - 7:15 AM: Sharpen the Saw - Physical Exercise | Persona Match: 0.75
7:15 AM - 7:45 AM: Personal Development - Continuous Learning | Persona Match: 0.80
7:45 AM - 8:15 AM: Family Time & Breakfast | Persona Match: 0.70
8:15 AM - 8:45 AM: Put First Things First - Priority Planning | Persona Match: 0.85
8:45 AM - 9:15 AM: Think Win-Win - Collaborative Preparation | Persona Match: 0.90
9:15 AM - 9:45 AM: Seek First to Understand - Communication Prep | Persona Match: 0.80
10:00 AM - 12:00 PM: Fashion Industry Mixer | Persona Match: 0.95 | Reasons: Matches preferred activity type, Matches preferred location, Good networking opportunity
```

## 🛠️ Customization

### Adding New Persona Types
1. Create new persona using `UserPersona` class
2. Define specific characteristics and preferences
3. Add to `PersonaManager` for persistence

### Extending Activity Scoring
Modify `_get_activity_recommendation()` in `PersonaIntegratedPlanner` to add new scoring criteria.

### Custom Routine Templates
Add new routine patterns in `BehavioralPatterns` class or modify `get_persona_routine_suggestions()`.

## 📈 Future Enhancements

- Machine learning-based persona recommendations
- Dynamic persona adaptation based on user behavior
- Integration with external data sources (weather, events)
- Advanced analytics and insights
- Multi-persona planning for couples/groups
- Real-time persona updates based on feedback

## 🤝 Contributing

To add new personas or enhance the system:

1. Define persona characteristics in `personas.py`
2. Update integration logic in `persona_integration.py`
3. Add examples in `persona_examples.py`
4. Test with different scenarios
5. Update documentation

## 📝 Notes

- Personas are stored in JSON format for easy modification
- All persona data is serializable for API integration
- The system is designed to be extensible and customizable
- Persona matching scores range from 0.0 to 1.0
- High-priority recommendations have scores ≥ 0.7
