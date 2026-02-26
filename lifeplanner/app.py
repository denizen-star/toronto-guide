#!/usr/bin/env python3
"""
Kevin's Time Allocation Tuner - Web UI
Flask web application for managing time allocation percentages
"""

from flask import Flask, render_template, request, jsonify, send_from_directory
import json
import os
from datetime import datetime
from time_allocation_tuner import TimeAllocationTuner
from enhanced_schedule_generator import EnhancedScheduleGenerator

app = Flask(__name__)

# Global tuner instance
tuner = TimeAllocationTuner()
generator = EnhancedScheduleGenerator(tuner)

@app.route('/')
def index():
    """Main page with time allocation interface"""
    return render_template('index.html')

@app.route('/simple_index.html')
def simple_index():
    """Serve the simple UI"""
    return send_from_directory('ui', 'simple_index.html')

@app.route('/api/allocation')
def get_allocation():
    """Get current allocation settings"""
    return jsonify(tuner.get_allocation_summary())

@app.route('/api/allocation', methods=['POST'])
def update_allocation():
    """Update allocation settings"""
    try:
        data = request.json
        
        # Update main categories
        if 'individual_activities_percent' in data:
            tuner.update_allocation(individual_activities_percent=float(data['individual_activities_percent']))
        if 'networking_social_percent' in data:
            tuner.update_allocation(networking_social_percent=float(data['networking_social_percent']))
        if 'couple_activities_percent' in data:
            tuner.update_allocation(couple_activities_percent=float(data['couple_activities_percent']))
        
        # Update subcategories
        if 'individual_breakdown' in data:
            breakdown = data['individual_breakdown']
            if 'running_percent' in breakdown:
                tuner.update_allocation(running_percent=float(breakdown['running_percent']))
            if 'personal_development_percent' in breakdown:
                tuner.update_allocation(personal_development_percent=float(breakdown['personal_development_percent']))
            if 'fitness_grooming_percent' in breakdown:
                tuner.update_allocation(fitness_grooming_percent=float(breakdown['fitness_grooming_percent']))
            if 'reflection_planning_percent' in breakdown:
                tuner.update_allocation(reflection_planning_percent=float(breakdown['reflection_planning_percent']))
        
        if 'networking_breakdown' in data:
            breakdown = data['networking_breakdown']
            if 'professional_networking_percent' in breakdown:
                tuner.update_allocation(professional_networking_percent=float(breakdown['professional_networking_percent']))
            if 'social_activities_percent' in breakdown:
                tuner.update_allocation(social_activities_percent=float(breakdown['social_activities_percent']))
            if 'professional_dev_networking_percent' in breakdown:
                tuner.update_allocation(professional_dev_networking_percent=float(breakdown['professional_dev_networking_percent']))
            if 'other_social_percent' in breakdown:
                tuner.update_allocation(other_social_percent=float(breakdown['other_social_percent']))
        
        if 'couple_breakdown' in data:
            breakdown = data['couple_breakdown']
            if 'daily_meals_percent' in breakdown:
                tuner.update_allocation(daily_meals_percent=float(breakdown['daily_meals_percent']))
            if 'evening_together_percent' in breakdown:
                tuner.update_allocation(evening_together_percent=float(breakdown['evening_together_percent']))
            if 'weekend_activities_percent' in breakdown:
                tuner.update_allocation(weekend_activities_percent=float(breakdown['weekend_activities_percent']))
            if 'breakfast_together_percent' in breakdown:
                tuner.update_allocation(breakfast_together_percent=float(breakdown['breakfast_together_percent']))
            if 'household_together_percent' in breakdown:
                tuner.update_allocation(household_together_percent=float(breakdown['household_together_percent']))
        
        return jsonify({
            'success': True,
            'allocation': tuner.get_allocation_summary()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/preset/<preset_name>')
def apply_preset(preset_name):
    """Apply a preset configuration"""
    presets = {
        'work_focus': {
            'individual_activities_percent': 20.0,
            'networking_social_percent': 15.0,
            'couple_activities_percent': 15.0
        },
        'social_focus': {
            'individual_activities_percent': 10.0,
            'networking_social_percent': 35.0,
            'couple_activities_percent': 15.0
        },
        'couple_focus': {
            'individual_activities_percent': 12.0,
            'networking_social_percent': 18.0,
            'couple_activities_percent': 30.0
        },
        'balanced': {
            'individual_activities_percent': 16.0,
            'networking_social_percent': 21.6,
            'couple_activities_percent': 23.8
        }
    }
    
    if preset_name in presets:
        tuner.update_allocation(**presets[preset_name])
        return jsonify({
            'success': True,
            'allocation': tuner.get_allocation_summary()
        })
    else:
        return jsonify({
            'success': False,
            'error': 'Preset not found'
        }), 404

@app.route('/api/schedule')
def get_schedule():
    """Generate and return current schedule"""
    try:
        schedule = generator.generate_adaptive_schedule()
        return jsonify({
            'success': True,
            'schedule': schedule
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/export')
def export_schedule():
    """Export current schedule to markdown"""
    try:
        schedule = generator.generate_adaptive_schedule()
        filename = generator.export_schedule(schedule)
        return jsonify({
            'success': True,
            'filename': filename
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/config')
def get_config():
    """Get UI configuration"""
    try:
        with open('ui_config.json', 'r') as f:
            config = json.load(f)
        return jsonify(config)
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    # Create templates directory if it doesn't exist
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static', exist_ok=True)
    
    # Use port 8080 to avoid conflict with AirPlay Receiver on port 5000
    # You can change this port if needed
    port = int(os.environ.get('PORT', 8080))
    
    print("🎛️ Starting Kevin's Time Allocation Tuner Web UI...")
    print("📱 Open your browser to: http://localhost:8080")
    print("💡 To use a different port: PORT=3000 python3 app.py")
    app.run(debug=True, host='0.0.0.0', port=port)
