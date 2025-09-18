# 🌐 Kevin's Time Allocation Tuner - Web UI

A beautiful, interactive web interface for managing your time allocation percentages and automatically refactoring your entire schedule.

## 🚀 Quick Start

### Option 1: Easy Start (Recommended)
```bash
python3 start_ui.py
```
This will automatically open your browser to the web interface.

### Option 2: Manual Start
```bash
python3 app.py
```
Then open your browser to: http://localhost:8080

## 🎯 Features

### ✅ **Interactive Sliders**
- **Main Category Sliders**: Adjust Individual, Networking, and Couple time percentages
- **Subcategory Sliders**: Fine-tune specific activities within each category
- **Real-time Updates**: See changes instantly as you adjust sliders

### ✅ **Quick Presets**
- **Work Focus**: 20% Individual, 15% Networking, 15% Couple
- **Social Focus**: 10% Individual, 35% Networking, 15% Couple
- **Couple Focus**: 12% Individual, 18% Networking, 30% Couple
- **Balanced**: 16% Individual, 21.6% Networking, 23.8% Couple

### ✅ **Visual Analytics**
- **Pie Chart**: Visual representation of time distribution
- **Weekly Timeline**: Overview of time allocation across categories
- **Summary Stats**: Total hours, fixed time, and available time

### ✅ **Smart Scheduling**
- **Automatic Refactoring**: Entire schedule updates based on your preferences
- **Export Functionality**: Download your customized schedule as Markdown
- **Real-time Validation**: Ensures percentages add up correctly

## 🎨 Interface Overview

### **Left Panel - Controls**
- **Quick Presets**: One-click configuration changes
- **Main Category Sliders**: Adjust overall time allocation
- **Subcategory Breakdowns**: Fine-tune specific activities
- **Action Buttons**: Export schedule, reset to defaults

### **Right Panel - Visualization**
- **Time Summary**: Key statistics and metrics
- **Pie Chart**: Visual time distribution
- **Weekly Timeline**: Category breakdown overview

## 📊 Time Categories

### **Individual Activities (16.0% default)**
- **Running**: Solo training and fitness
- **Personal Development**: Learning and skill building
- **Fitness & Grooming**: Exercise and personal care
- **Reflection & Planning**: Goal setting and daily planning

### **Networking & Social (21.6% default)**
- **Professional Networking**: Industry events and meetups
- **Social Activities**: Sports clubs and social events
- **Professional Dev Networking**: 1:1 meetings and career development
- **Other Social**: Casual socializing and community events

### **Couple Activities (23.8% default)**
- **Daily Meals**: Breakfast and dinner together
- **Evening Together**: Shared wind-down time
- **Weekend Activities**: Art workshops, cooking classes, exploration
- **Breakfast Together**: Morning connection time
- **Household Together**: Grocery shopping and budgeting

## 🔧 How to Use

### **1. Adjust Main Categories**
- Use the main sliders to adjust overall time allocation
- Watch the pie chart and timeline update in real-time
- See immediate feedback on hours and percentages

### **2. Fine-tune Subcategories**
- Click on any category card to expand subcategory controls
- Adjust specific activities within each category
- Maintain proportional distribution within categories

### **3. Apply Presets**
- Click any preset button for quick configuration
- Perfect for testing different time allocation strategies
- Easily switch between work-focused, social-focused, or balanced approaches

### **4. Export Your Schedule**
- Click "Export Schedule" to generate a Markdown file
- Includes all your customized time allocations
- Ready to use or share with others

## 🎛️ Technical Details

### **Backend (Flask)**
- **RESTful API**: Clean endpoints for all operations
- **Real-time Updates**: Instant response to slider changes
- **Data Validation**: Ensures consistent and valid allocations
- **Export Integration**: Seamless schedule generation

### **Frontend (HTML/CSS/JavaScript)**
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Interactive Sliders**: Smooth, responsive controls
- **Chart.js Integration**: Beautiful, animated visualizations
- **Real-time Updates**: No page refreshes needed

### **Data Flow**
1. **User adjusts slider** → JavaScript captures change
2. **API call made** → Backend updates allocation
3. **Schedule regenerated** → New time distribution calculated
4. **UI updated** → Charts, stats, and timeline refresh

## 📁 File Structure

```
LifePlanner/
├── app.py                          # Flask web application
├── start_ui.py                     # Easy startup script
├── templates/
│   └── index.html                  # Main UI template
├── static/
│   ├── style.css                   # Styling and responsive design
│   └── script.js                   # Interactive functionality
├── time_allocation_tuner.py        # Core allocation system
├── enhanced_schedule_generator.py  # Adaptive schedule generator
├── ui_config.json                  # UI configuration
└── requirements.txt                # Python dependencies
```

## 🚀 Advanced Usage

### **Custom Presets**
Edit `ui_config.json` to add your own preset configurations:

```json
{
  "ui_components": {
    "controls": {
      "preset_buttons": [
        {
          "name": "My Custom Preset",
          "individual": 18.0,
          "networking": 25.0,
          "couple": 20.0
        }
      ]
    }
  }
}
```

### **API Endpoints**
- `GET /api/allocation` - Get current allocation
- `POST /api/allocation` - Update allocation
- `GET /api/preset/<name>` - Apply preset
- `GET /api/schedule` - Generate schedule
- `GET /api/export` - Export schedule
- `GET /api/config` - Get UI configuration

### **Customization**
- **Colors**: Modify CSS variables in `style.css`
- **Layout**: Adjust HTML structure in `templates/index.html`
- **Functionality**: Extend JavaScript in `static/script.js`

## 🔧 Troubleshooting

### **Common Issues**

**1. Port Already in Use**
```bash
# Kill existing process
lsof -ti:5000 | xargs kill -9
# Or use different port
python3 app.py --port 5001
```

**2. Module Not Found**
```bash
# Install dependencies
pip3 install -r requirements.txt
```

**3. Browser Not Opening**
- Manually navigate to: http://localhost:8080
- Check firewall settings
- Try different browser

### **Debug Mode**
```bash
# Enable debug mode
export FLASK_DEBUG=1
python3 app.py
```

## 🎯 Benefits

- **Intuitive Interface**: Easy-to-use sliders and visualizations
- **Real-time Feedback**: See changes instantly
- **Flexible Configuration**: Adjust any aspect of your time allocation
- **Export Ready**: Generate schedules for external use
- **Mobile Friendly**: Works on any device
- **No Installation**: Runs directly from Python

## 🚀 Next Steps

1. **Start the UI**: Run `python3 start_ui.py`
2. **Explore Presets**: Try different time allocation strategies
3. **Customize**: Adjust sliders to match your preferences
4. **Export Schedule**: Download your customized schedule
5. **Iterate**: Make adjustments based on your experience

## 💡 Tips

- **Start with Presets**: Use presets as a starting point
- **Fine-tune Gradually**: Make small adjustments and see the impact
- **Check Validation**: Ensure percentages add up to 100%
- **Export Regularly**: Save your preferred configurations
- **Test Different Scenarios**: Try various time allocation strategies

This web UI provides a powerful, intuitive way to manage your time allocation and automatically refactor your entire schedule based on your preferences!
