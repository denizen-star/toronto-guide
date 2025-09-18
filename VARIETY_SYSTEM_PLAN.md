# 🎲 Activity Variety System Plan

## 🚨 **Current Problem**
The server generates **identical activities every day** instead of using the rich database of activities you've provided.

**Current**: Same networking event, same dinner, same activities repeated daily
**Needed**: Rotation through hundreds of available activities with proper variety

## 📊 **Available Activity Sources**

### **1. Complete Activity Database** (`data/activities/my_complete_activity_schedule.json`)
- **902 activities** including:
  - Tennis classes (multiple coaches, locations, times)
  - Swimming sessions (3 different clubs, various times)
  - Fitness classes (yoga, pilates, hiking)
  - Social events (wine tasting, cultural festivals)
  - Professional networking events
  - Entertainment options

### **2. Core Activities Database** (`data/activities.json`)
- **10+ curated activities** with detailed properties:
  - Connection depth, emotional safety scores
  - Networking potential, energy levels
  - Weather dependency, planning requirements
  - Day preferences, location preferences

### **3. Detailed Schedules**
- **Tennis**: Multiple coaches, times, locations from Breakpoint Club
- **Swimming**: 3 clubs with different schedules and costs
- **Running**: Various trails and times

## 🎯 **Variety System Requirements**

### **Daily Variety**
- **Morning Routine**: Fixed (same daily requirements)
- **Work Hours**: Fixed (same work schedule)
- **Evening Activities**: **ROTATE** through different:
  - Networking events (fashion mixers, art galleries, professional lunches)
  - Cultural activities (theatre, comedy, festivals)
  - Fitness options (yoga, pilates, swimming, tennis)
  - Couple activities (device-free dinners at different restaurants, new experiences)

### **Weekly Variety**
- **Week 1**: Focus on professional networking + cultural activities
- **Week 2**: Focus on fitness variety + couple adventures
- **Week 3**: Focus on entertainment + social events
- **Week 4**: Focus on new experiences + skill development

### **Monthly Variety**
- **Month 1**: Explore downtown venues and professional networking
- **Month 2**: Focus on fitness goals and outdoor activities
- **Month 3**: Cultural immersion and entertainment variety

## 🔧 **Implementation Strategy**

### **1. Activity Pool System**
Create pools of activities by category:
- **Networking Pool**: 20+ professional/social networking events
- **Couple Pool**: 15+ couple activities with different locations/experiences
- **Fitness Pool**: 30+ fitness options (classes, sports, outdoor activities)
- **Entertainment Pool**: 25+ shows, events, cultural activities

### **2. Rotation Logic**
- **Daily**: Select different activities from each pool
- **Weekly**: Ensure no activity repeats within 7 days
- **Monthly**: Introduce seasonal/monthly special events

### **3. Constraint Respect**
- **Work Hours**: Always respect 9 AM - 6 PM restrictions
- **Frequencies**: Swimming (max 2x/month), Tennis (max 3x/month)
- **Personal Care**: Maintain weekly/bi-weekly/monthly schedules
- **Core Requirements**: Always include daily routines, work, commute

## 🚀 **Next Steps**

1. **Load Activity Database**: Read all available activities from JSON files
2. **Create Activity Pools**: Categorize by type, time, day preference
3. **Implement Rotation**: Select different activities each day/week
4. **Maintain Constraints**: Respect work hours and frequency limits
5. **Add Seasonality**: Include weather-dependent and seasonal activities

**This will transform the static schedule into a dynamic, varied experience!**

