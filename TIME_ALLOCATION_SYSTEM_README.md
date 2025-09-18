# 🎛️ Kevin's Time Allocation Tuner System

A comprehensive system that allows you to adjust time percentages and automatically refactor your entire schedule. Perfect for building a UI that lets you tune your time allocation in real-time.

## 📁 System Components

### 1. **Time Allocation Tuner** (`time_allocation_tuner.py`)
- Core system for managing time allocation percentages
- Calculates hours based on percentages
- Exports/imports configurations
- Validates allocation constraints

### 2. **Enhanced Schedule Generator** (`enhanced_schedule_generator.py`)
- Automatically refactors entire schedule based on allocation settings
- Adapts activities to match time percentages
- Generates detailed schedule with categories
- Exports to markdown format

### 3. **UI Configuration** (`ui_config.json`)
- Complete configuration for building a web UI
- Slider settings, colors, constraints
- Preset configurations
- Visualization options

## 🚀 Quick Start

### Basic Usage

```python
from time_allocation_tuner import TimeAllocationTuner
from enhanced_schedule_generator import EnhancedScheduleGenerator

# Create tuner
tuner = TimeAllocationTuner()

# Adjust allocations
tuner.update_allocation(
    individual_activities_percent=12.0,  # Decrease individual time
    couple_activities_percent=30.0,      # Increase couple time
    networking_social_percent=20.0       # Adjust networking time
)

# Generate adaptive schedule
generator = EnhancedScheduleGenerator(tuner)
schedule = generator.generate_adaptive_schedule()

# Export schedule
filename = generator.export_schedule(schedule)
```

### Advanced Usage

```python
# Get detailed breakdown
summary = tuner.get_allocation_summary()
print(f"Individual Activities: {summary['categories']['individual_activities']['hours']:.1f}h")

# Export configuration
config_file = tuner.export_allocation("my_allocation.json")

# Import configuration
tuner.import_allocation("my_allocation.json")

# Print detailed report
tuner.print_allocation_report()
```

## 🎯 Key Features

### ✅ **Real-time Adjustment**
- Change percentages and see immediate hour calculations
- Automatic validation and constraint checking
- Live preview of schedule changes

### ✅ **Comprehensive Categories**
- **Individual Activities**: Running, personal development, fitness, grooming
- **Networking/Social**: Professional networking, social activities, making friends
- **Couple Activities**: Meals together, weekend activities, household tasks

### ✅ **Smart Scheduling**
- Automatically adapts activities based on available time
- Maintains core requirements (work, routines)
- Scales activities proportionally

### ✅ **Export/Import**
- Save allocation configurations
- Export complete schedules
- Share settings between sessions

## 📊 Time Allocation Structure

### **Fixed Time (Cannot be adjusted)**
- Work Hours: 45.0h/week (39.0%)
- Morning Routine: 21.0h/week (18.2%)
- Evening Wind-down: 7.0h/week (6.1%)
- Commute: 1.7h/week (1.4%)

### **Adjustable Time (35.3% of total time)**
- Individual Activities: 16.0% (default)
- Networking/Social: 21.6% (default)
- Couple Activities: 23.8% (default)

## 🎨 UI Integration

The system is designed for easy UI integration:

### **Slider Controls**
```json
{
  "main_categories": {
    "type": "range_slider",
    "min": 0,
    "max": 100,
    "step": 0.1,
    "show_percentage": true,
    "show_hours": true
  }
}
```

### **Visualizations**
- Pie charts showing time distribution
- Weekly timeline with activity categories
- Real-time hour calculations

### **Preset Configurations**
- Work Focus: 20% Individual, 15% Networking, 15% Couple
- Social Focus: 10% Individual, 35% Networking, 15% Couple
- Couple Focus: 12% Individual, 18% Networking, 30% Couple
- Balanced: 16% Individual, 21.6% Networking, 23.8% Couple

## 🔧 Configuration Options

### **Constraints**
```python
constraints = {
    "total_percentage_must_equal": 100.0,
    "individual_min_hours_per_week": 5.0,
    "networking_min_hours_per_week": 8.0,
    "couple_min_hours_per_week": 10.0,
    "max_individual_hours_per_week": 40.0,
    "max_networking_hours_per_week": 50.0,
    "max_couple_hours_per_week": 60.0
}
```

### **Subcategory Breakdowns**
Each main category has subcategories that can be adjusted:

- **Individual**: Running, Personal Development, Fitness/Grooming, Reflection/Planning
- **Networking**: Professional Networking, Social Activities, Professional Dev, Other Social
- **Couple**: Daily Meals, Evening Together, Weekend Activities, Breakfast, Household

## 📈 Example Workflows

### **Scenario 1: Increase Couple Time**
```python
# Increase couple time from 23.8% to 30%
tuner.update_allocation(couple_activities_percent=30.0)

# System automatically:
# - Redistributes available time
# - Scales couple activities up
# - Adjusts other categories proportionally
# - Regenerates entire schedule
```

### **Scenario 2: Focus on Networking**
```python
# Increase networking from 21.6% to 35%
tuner.update_allocation(networking_social_percent=35.0)

# System automatically:
# - Adds more networking events
# - Scales social activities
# - Maintains balance with other categories
```

### **Scenario 3: Work-Life Balance**
```python
# Use preset configuration
tuner.update_allocation(
    individual_activities_percent=15.0,
    networking_social_percent=20.0,
    couple_activities_percent=25.0
)
```

## 🎯 Building a UI

### **Step 1: Set up the backend**
```python
# Create API endpoints
@app.route('/api/allocation', methods=['GET', 'POST'])
def get_allocation():
    tuner = TimeAllocationTuner()
    return jsonify(tuner.get_allocation_summary())

@app.route('/api/update', methods=['POST'])
def update_allocation():
    data = request.json
    tuner.update_allocation(**data)
    return jsonify(tuner.get_allocation_summary())
```

### **Step 2: Create the frontend**
```javascript
// Use the UI configuration
const config = await fetch('/api/ui-config').then(r => r.json());

// Create sliders for each category
config.categories.forEach(category => {
    createSlider(category.label, category.default_percentage);
});

// Real-time updates
slider.onChange((value) => {
    updateAllocation(category.name, value);
    refreshSchedule();
});
```

### **Step 3: Add visualizations**
```javascript
// Pie chart showing time distribution
const pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Individual', 'Networking', 'Couple'],
        datasets: [{
            data: [individualHours, networkingHours, coupleHours],
            backgroundColor: ['#4CAF50', '#2196F3', '#E91E63']
        }]
    }
});
```

## 📋 File Structure

```
LifePlanner/
├── time_allocation_tuner.py          # Core allocation system
├── enhanced_schedule_generator.py    # Adaptive schedule generator
├── ui_config.json                   # UI configuration
├── time_analysis.py                 # Analysis utilities
└── TIME_ALLOCATION_SYSTEM_README.md # This file
```

## 🚀 Next Steps

1. **Build the UI**: Use the configuration in `ui_config.json` to create sliders and visualizations
2. **Add Real-time Updates**: Connect the UI to the backend for live schedule updates
3. **Add Presets**: Implement the preset configurations for quick adjustments
4. **Add Validation**: Implement constraint checking and warnings
5. **Add Export**: Allow users to export their customized schedules

## 💡 Benefits

- **Flexibility**: Easily adjust time allocation without manual schedule editing
- **Consistency**: Maintains core requirements while adapting flexible time
- **Visualization**: Clear understanding of time distribution
- **Automation**: Automatically refactors entire schedule based on changes
- **Scalability**: Easy to add new categories or adjust constraints

This system provides a solid foundation for building an interactive time allocation UI that can automatically refactor Kevin's entire schedule based on his preferences and goals.

