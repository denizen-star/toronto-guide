#!/usr/bin/env python3
"""
Simple Flask server for LifePlanner UI - Phase 1
No complex imports, just basic functionality to test the UI
"""

import os
import json
from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configuration
UI_DIR = 'ui'

@app.route('/')
def index():
    """Serve the main UI"""
    return send_from_directory(UI_DIR, 'index.html')

@app.route('/simple_index.html')
def simple_index():
    """Serve the simple UI"""
    return send_from_directory(UI_DIR, 'simple_index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files (CSS, JS, etc.)"""
    try:
        return send_from_directory(UI_DIR, filename)
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404

# Simple API endpoints for testing
@app.route('/api/v1/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'LifePlanner Simple UI Server',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/v1/status')
def get_status():
    """Get application status"""
    return jsonify({
        'status': {
            'settings_loaded': True,
            'active_persona': 'kevin_head_of_data',
            'total_activities': 25,
            'available_personas': 2,
            'last_updated': datetime.now().isoformat()
        }
    })

@app.route('/api/v1/personas')
def get_personas():
    """Get available personas"""
    personas = [
        {
            'id': 'kevin_head_of_data',
            'name': 'Kevin - Head of Data',
            'description': '40-year-old gay married man, recently moved to Toronto',
            'personality_type': 'introvert-extrovert',
            'networking_priority': 7
        },
        {
            'id': 'peter_fashion_director',
            'name': 'Peter - Fashion Director',
            'description': '50-year-old celebrity fashion director, Toronto resident',
            'personality_type': 'extrovert',
            'networking_priority': 8
        }
    ]
    
    return jsonify({
        'personas': personas,
        'count': len(personas)
    })

@app.route('/api/v1/personas/<persona_id>', methods=['POST'])
def set_persona(persona_id):
    """Set active persona"""
    return jsonify({
        'message': f'Persona {persona_id} set successfully',
        'persona_id': persona_id,
        'timestamp': datetime.now().isoformat()
    })

def load_activity_database():
    """Load all available activities from the database files"""
    import json
    import os
    
    activities = []
    
    # Load core activities
    try:
        with open('data/activities.json', 'r') as f:
            core_data = json.load(f)
            activities.extend(core_data.get('activities', []))
    except FileNotFoundError:
        print("⚠️ Core activities.json not found")
    
    # Load complete activity schedule
    try:
        with open('data/activities/my_complete_activity_schedule.json', 'r') as f:
            complete_data = json.load(f)
            activities.extend(complete_data.get('activities', []))
    except FileNotFoundError:
        print("⚠️ Complete activity schedule not found")
    
    print(f"📊 Loaded {len(activities)} activities from database")
    return activities

def create_activity_pools(activities):
    """Organize activities into pools for variety"""
    pools = {
        'networking': [],
        'couple': [],
        'fitness': [],
        'entertainment': [],
        'cultural': [],
        'professional': [],
        'restaurants': [],
        'social': []
    }
    
    for activity in activities:
        activity_type = activity.get('activity_type', activity.get('schedule_type', ''))
        tags = activity.get('tags', [])
        location = activity.get('location', '').lower()
        name = activity.get('name', '').lower()
        
        # More comprehensive categorization
        if any(tag in ['networking', 'professional'] for tag in tags) or 'networking' in activity_type or 'professional' in activity_type:
            pools['networking'].append(activity)
        elif any(tag in ['couple', 'connection', 'intimacy'] for tag in tags) or 'couple' in activity_type or activity.get('connection_depth', 0) > 5:
            pools['couple'].append(activity)
        elif any(tag in ['fitness', 'tennis', 'sports', 'running', 'swimming', 'yoga', 'pilates'] for tag in tags) or 'fitness' in activity_type or 'tennis' in activity_type:
            pools['fitness'].append(activity)
        elif any(tag in ['entertainment', 'show', 'comedy', 'theatre'] for tag in tags) or 'entertainment' in activity_type or 'show' in name:
            pools['entertainment'].append(activity)
        elif any(tag in ['cultural', 'art', 'gallery', 'festival'] for tag in tags) or 'cultural' in activity_type or 'gallery' in location:
            pools['cultural'].append(activity)
        elif any(tag in ['social', 'event'] for tag in tags) or 'social' in activity_type or 'event' in activity_type:
            pools['social'].append(activity)
        elif 'restaurant' in location or 'dining' in name or 'dinner' in name:
            pools['restaurants'].append(activity)
        else:
            pools['professional'].append(activity)
    
    return pools

@app.route('/api/v1/schedule', methods=['POST'])
def generate_schedule():
    """Generate a schedule with VARIETY using the activity database"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request body required'}), 400
        
        print(f"📅 Generating schedule: {data}")
        
        # Validate required fields
        start_date = data.get('start_date')
        duration = data.get('duration') 
        schedule_type = data.get('schedule_type')
        
        if not start_date or not duration or not schedule_type:
            return jsonify({
                'error': 'Missing required fields',
                'received_data': data,
                'required_fields': ['start_date', 'duration', 'schedule_type']
            }), 400
        
        # MASTER SCHEDULE WITH VARIETY - Following MASTER_SCHEDULE_REQUIREMENTS.xml
        # All dates are 2025+ and activities respect work hour constraints
        base_activities = []
        
        # Load activity database for variety
        available_activities = load_activity_database()
        activity_pools = create_activity_pools(available_activities)
        
        print(f"🎲 Activity pools created:")
        for pool_name, pool_activities in activity_pools.items():
            print(f"   {pool_name}: {len(pool_activities)} activities")
        
        # Import modules for variety
        from datetime import datetime, timedelta
        import random
        
        # Helper function to select varied activities
        def select_varied_activity(pool, default_activity, day_name, activity_type='general'):
            """Select a varied activity from pool or return default"""
            if pool:
                selected = random.choice(pool)
                return {
                    'name': f"{selected.get('name', default_activity['name'])} ({day_name})",
                    'activity_type': selected.get('activity_type', selected.get('schedule_type', default_activity.get('activity_type', 'general'))),
                    'duration_hours': selected.get('duration_hours', selected.get('duration_minutes', default_activity.get('duration_hours', 1) * 60) / 60),
                    'cost_cad': selected.get('cost_cad', default_activity.get('cost_cad', 0)),
                    'location': selected.get('location', default_activity.get('location', 'Toronto')),
                    'description': f"{selected.get('description', default_activity.get('description', 'Activity'))} - {day_name}",
                    'networking_potential': selected.get('networking_potential', default_activity.get('networking_potential', 0)),
                    'connection_depth': selected.get('connection_depth', default_activity.get('connection_depth', 0)),
                    'emotional_safety': selected.get('emotional_safety', default_activity.get('emotional_safety', 0))
                }
            return default_activity
        
        start_date_obj = datetime.strptime(start_date, '%Y-%m-%d')
        total_days = 7 if '1 week' in duration else (14 if '2 week' in duration else 30)
        
        for day_offset in range(total_days):
            current_date = start_date_obj + timedelta(days=day_offset)
            day_name = current_date.strftime('%A')
            is_weekend = day_name in ['Saturday', 'Sunday']
            is_weekday = not is_weekend
            date_str = current_date.strftime('%Y-%m-%d')
            
            # === DAILY REQUIREMENTS (EVERY DAY) ===
            
            # Morning Routine (6:00-6:50 AM) - Fixed daily requirements with tags
            day_activities = [
                {'start_time': '6:00 AM', 'end_time': '6:15 AM', 'activity': {'name': f'Wake Up & Hydration ({day_name})', 'activity_type': 'morning_routine', 'duration_hours': 0.25, 'cost_cad': 0, 'location': 'Home', 'description': 'Wake up, drink water, set daily intentions', 'networking_potential': 0, 'tags': ['morning', 'routine', 'daily', 'hydration']}, 'notes': f'Daily routine - {day_name}', 'day_index': day_offset, 'actual_date': date_str},
                {'start_time': '6:15 AM', 'end_time': '6:20 AM', 'activity': {'name': f'Morning Intention Setting ({day_name})', 'activity_type': 'couple_daily_connection', 'duration_hours': 0.08, 'cost_cad': 0, 'location': 'Home', 'description': 'Share daily intentions and support each other\'s goals (habit stacked)', 'networking_potential': 0, 'connection_depth': 7, 'emotional_safety': 8, 'tags': ['couple', 'connection', 'habit_stacked', 'morning']}, 'notes': f'Habit stacked - {day_name}', 'day_index': day_offset, 'actual_date': date_str},
                {'start_time': '6:20 AM', 'end_time': '6:45 AM', 'activity': {'name': f'Personal Grooming ({day_name})', 'activity_type': 'morning_routine', 'duration_hours': 0.42, 'cost_cad': 0, 'location': 'Home', 'description': 'Shower, skincare, teeth brushing, deodorant (daily requirements)', 'networking_potential': 0, 'tags': ['grooming', 'daily', 'personal_care', 'hygiene']}, 'notes': f'Daily grooming - {day_name}', 'day_index': day_offset, 'actual_date': date_str},
                {'start_time': '6:45 AM', 'end_time': '6:46 AM', 'activity': {'name': f'Progressive Meditation ({day_name})', 'activity_type': 'morning_routine', 'duration_hours': 0.02, 'cost_cad': 0, 'location': 'Home', 'description': 'Week 0: 1 minute meditation (progressive: weeks 1-4=1min, 5-8=2min, etc.)', 'networking_potential': 0, 'tags': ['meditation', 'mindfulness', 'progressive', 'daily']}, 'notes': f'Progressive meditation - {day_name}', 'day_index': day_offset, 'actual_date': date_str}
            ]
            
            # Running Schedule (BEFORE work - specific days) - With tags
            if day_name == 'Tuesday':
                day_activities.append({'start_time': '7:00 AM', 'end_time': '8:00 AM', 'activity': {'name': f'{day_name} Running (60min)', 'activity_type': 'fitness', 'duration_hours': 1.0, 'cost_cad': 0, 'location': 'High Park Running Trails, 1873 Bloor St W, Toronto', 'description': 'Tuesday 60-minute training run. Website: highpark.ca. TTC: Keele Station + 5min walk. Car: 15min from downtown.', 'networking_potential': 1, 'tags': ['running', 'fitness', 'outdoor', 'training', 'tuesday']}, 'notes': f'{day_name}: 60min (before work)', 'day_index': day_offset, 'actual_date': date_str})
            elif day_name == 'Thursday':
                day_activities.append({'start_time': '7:00 AM', 'end_time': '8:00 AM', 'activity': {'name': f'{day_name} Running (60min)', 'activity_type': 'fitness', 'duration_hours': 1.0, 'cost_cad': 0, 'location': 'High Park Running Trails, 1873 Bloor St W, Toronto', 'description': 'Thursday 60-minute training run. Website: highpark.ca. TTC: Keele Station + 5min walk. Car: 15min from downtown.', 'networking_potential': 1, 'tags': ['running', 'fitness', 'outdoor', 'training', 'thursday']}, 'notes': f'{day_name}: 60min (before work)', 'day_index': day_offset, 'actual_date': date_str})
            elif day_name == 'Friday':
                day_activities.append({'start_time': '7:00 AM', 'end_time': '8:00 AM', 'activity': {'name': f'{day_name} Running (60min)', 'activity_type': 'fitness', 'duration_hours': 1.0, 'cost_cad': 0, 'location': 'High Park Running Trails, 1873 Bloor St W, Toronto', 'description': 'Friday 60-minute training run. Website: highpark.ca. TTC: Keele Station + 5min walk. Car: 15min from downtown.', 'networking_potential': 1, 'tags': ['running', 'fitness', 'outdoor', 'training', 'friday']}, 'notes': f'{day_name}: 60min (before work)', 'day_index': day_offset, 'actual_date': date_str})
            elif day_name == 'Sunday':
                day_activities.append({'start_time': '8:00 AM', 'end_time': '10:00 AM', 'activity': {'name': f'{day_name} Long Run (120min)', 'activity_type': 'fitness', 'duration_hours': 2.0, 'cost_cad': 0, 'location': 'Martin Goodman Trail, Harbourfront, Toronto', 'description': 'Sunday 120-minute long run along waterfront. Website: waterfrontoronto.ca. TTC: Union Station + 10min walk. Car: Parking at Harbourfront Centre.', 'networking_potential': 2, 'tags': ['running', 'fitness', 'outdoor', 'long_run', 'sunday', 'waterfront']}, 'notes': f'{day_name}: 120min (weekend)', 'day_index': day_offset, 'actual_date': date_str})
            
            # Work Schedule (WEEKDAYS ONLY - 9 AM - 6 PM) - PROPER ALLOCATION
            if is_weekday:
                # Core work blocks (always scheduled)
                day_activities.extend([
                    {'start_time': '8:50 AM', 'end_time': '9:00 AM', 'activity': {'name': f'Morning Commute ({day_name})', 'activity_type': 'commute', 'duration_hours': 0.17, 'cost_cad': 6, 'location': 'TTC/Car to Office', 'description': '10-minute commute to work. TTC: $3.35 fare. Car: Downtown parking $15/day.', 'networking_potential': 0, 'tags': ['commute', 'daily', 'transport']}, 'notes': f'Daily commute - {day_name}', 'day_index': day_offset, 'actual_date': date_str},
                    {'start_time': '9:00 AM', 'end_time': '12:00 PM', 'activity': {'name': f'Work - Morning Block ({day_name})', 'activity_type': 'work', 'duration_hours': 3.0, 'cost_cad': 0, 'location': 'Office - Head of Data', 'description': 'Core work responsibilities: data analysis, team meetings, strategic planning', 'networking_potential': 2, 'tags': ['work', 'core', 'data', 'analysis']}, 'notes': f'Core work - {day_name}', 'day_index': day_offset, 'actual_date': date_str}
                ])
                
                # Lunch activities - ROTATE, not every day
                lunch_options = [
                    {'name': f'Professional Lunch Meeting ({day_name})', 'activity_type': 'professional', 'duration_hours': 1.0, 'cost_cad': 35, 'location': 'Downtown Toronto Restaurant', 'description': 'Business lunch for professional networking. Book via OpenTable. Budget: $25-50. Dress: Business casual.', 'networking_potential': 8, 'tags': ['networking', 'lunch', 'professional', 'restaurant']},
                    {'name': f'1:1 Peer Meeting ({day_name})', 'activity_type': 'professional', 'duration_hours': 1.0, 'cost_cad': 30, 'location': 'Coffee Shop, Toronto', 'description': 'One-on-one meeting with industry peer. Discuss career, share insights, build relationships.', 'networking_potential': 9, 'tags': ['networking', '1:1', 'peer', 'mentorship']},
                    {'name': f'Industry Breakfast Meetup ({day_name})', 'activity_type': 'professional', 'duration_hours': 1.0, 'cost_cad': 25, 'location': 'Business District Cafe', 'description': 'Early industry breakfast meetup. Network with professionals before work starts.', 'networking_potential': 8, 'tags': ['networking', 'breakfast', 'industry', 'early']},
                    {'name': f'Regular Lunch Break ({day_name})', 'activity_type': 'personal', 'duration_hours': 1.0, 'cost_cad': 15, 'location': 'Office/Nearby', 'description': 'Regular lunch break - eat, relax, recharge for afternoon work.', 'networking_potential': 0, 'tags': ['lunch', 'break', 'personal', 'recharge']}
                ]
                
                # Select lunch activity (not every day is networking)
                if day_offset % 3 == 0:  # Professional lunch every 3rd day
                    lunch_activity = lunch_options[0]  # Professional lunch
                elif day_offset % 4 == 0:  # 1:1 peer meeting every 4th day
                    lunch_activity = lunch_options[1]  # 1:1 peer meeting
                elif day_offset % 5 == 0:  # Industry breakfast every 5th day
                    lunch_activity = lunch_options[2]  # Industry breakfast
                else:
                    lunch_activity = lunch_options[3]  # Regular lunch
                
                day_activities.append({
                    'start_time': '12:00 PM', 'end_time': '1:00 PM', 
                    'activity': lunch_activity, 
                    'notes': f'Lunch variety - {day_name}', 
                    'day_index': day_offset, 
                    'actual_date': date_str
                })
                
                # Afternoon work
                day_activities.append({'start_time': '1:00 PM', 'end_time': '3:00 PM', 'activity': {'name': f'Work - Afternoon Block ({day_name})', 'activity_type': 'work', 'duration_hours': 2.0, 'cost_cad': 0, 'location': 'Office - Head of Data', 'description': 'Core work responsibilities: data analysis, reporting, stakeholder meetings', 'networking_potential': 2, 'tags': ['work', 'core', 'afternoon', 'analysis']}, 'notes': f'Core work - {day_name}', 'day_index': day_offset, 'actual_date': date_str})
                
                # Immigration Work - ONLY 3 hours total per week (not daily!)
                immigration_hours_allocated = 0
                if day_name == 'Monday' and immigration_hours_allocated < 3:
                    day_activities.append({'start_time': '3:00 PM', 'end_time': '4:30 PM', 'activity': {'name': f'Immigration Work - Session 1 ({day_name})', 'activity_type': 'professional', 'duration_hours': 1.5, 'cost_cad': 0, 'location': 'Office/Home', 'description': 'Immigration paperwork and tasks (1.5h of 3h/week requirement). Visa applications, document preparation.', 'networking_potential': 0, 'tags': ['immigration', 'paperwork', 'required', 'legal']}, 'notes': f'1.5h of 3h/week - {day_name}', 'day_index': day_offset, 'actual_date': date_str})
                    immigration_hours_allocated += 1.5
                elif day_name == 'Wednesday' and immigration_hours_allocated < 3:
                    day_activities.append({'start_time': '3:00 PM', 'end_time': '4:30 PM', 'activity': {'name': f'Immigration Work - Session 2 ({day_name})', 'activity_type': 'professional', 'duration_hours': 1.5, 'cost_cad': 0, 'location': 'Office/Home', 'description': 'Immigration paperwork and tasks (1.5h of 3h/week requirement). Document review, application follow-up.', 'networking_potential': 0, 'tags': ['immigration', 'paperwork', 'required', 'legal']}, 'notes': f'1.5h of 3h/week - {day_name}', 'day_index': day_offset, 'actual_date': date_str})
                    immigration_hours_allocated += 1.5
                else:
                    # Regular work continues
                    day_activities.append({'start_time': '3:00 PM', 'end_time': '4:00 PM', 'activity': {'name': f'Work - Late Afternoon ({day_name})', 'activity_type': 'work', 'duration_hours': 1.0, 'cost_cad': 0, 'location': 'Office - Head of Data', 'description': 'Continued work responsibilities, project management, team coordination', 'networking_potential': 2, 'tags': ['work', 'core', 'project', 'management']}, 'notes': f'Core work - {day_name}', 'day_index': day_offset, 'actual_date': date_str})
                
                # Professional Development - ONLY 5 hours total per week (not daily!)
                prof_dev_hours_allocated = 0
                if day_name in ['Tuesday', 'Thursday'] and prof_dev_hours_allocated < 5:
                    day_activities.append({'start_time': '4:00 PM', 'end_time': '6:00 PM', 'activity': {'name': f'Professional Development - Session ({day_name})', 'activity_type': 'professional', 'duration_hours': 2.0, 'cost_cad': 0, 'location': 'Office/Online', 'description': 'Skill development and learning (2h of 5h/week requirement). Online courses, reading, training.', 'networking_potential': 1, 'tags': ['professional_development', 'learning', 'skills', 'career']}, 'notes': f'2h of 5h/week - {day_name}', 'day_index': day_offset, 'actual_date': date_str})
                    prof_dev_hours_allocated += 2.0
                elif day_name == 'Friday' and prof_dev_hours_allocated < 5:
                    day_activities.append({'start_time': '4:00 PM', 'end_time': '5:00 PM', 'activity': {'name': f'Professional Development - Final ({day_name})', 'activity_type': 'professional', 'duration_hours': 1.0, 'cost_cad': 0, 'location': 'Office/Online', 'description': 'Skill development and learning (1h of 5h/week requirement). Week wrap-up learning.', 'networking_potential': 1, 'tags': ['professional_development', 'learning', 'weekly_wrap']}, 'notes': f'1h of 5h/week - {day_name}', 'day_index': day_offset, 'actual_date': date_str})
                    day_activities.append({'start_time': '5:00 PM', 'end_time': '6:00 PM', 'activity': {'name': f'Work - End of Day ({day_name})', 'activity_type': 'work', 'duration_hours': 1.0, 'cost_cad': 0, 'location': 'Office - Head of Data', 'description': 'Wrap up work, plan next week, team check-ins', 'networking_potential': 2, 'tags': ['work', 'wrap_up', 'planning']}, 'notes': f'Core work - {day_name}', 'day_index': day_offset, 'actual_date': date_str})
                else:
                    # Regular work continues
                    day_activities.extend([
                        {'start_time': '4:00 PM', 'end_time': '5:00 PM', 'activity': {'name': f'Work - Late Afternoon ({day_name})', 'activity_type': 'work', 'duration_hours': 1.0, 'cost_cad': 0, 'location': 'Office - Head of Data', 'description': 'Continued work responsibilities, project management', 'networking_potential': 2, 'tags': ['work', 'core', 'project']}, 'notes': f'Core work - {day_name}', 'day_index': day_offset, 'actual_date': date_str},
                        {'start_time': '5:00 PM', 'end_time': '6:00 PM', 'activity': {'name': f'Work - End of Day ({day_name})', 'activity_type': 'work', 'duration_hours': 1.0, 'cost_cad': 0, 'location': 'Office - Head of Data', 'description': 'Wrap up work, plan tomorrow, team check-ins', 'networking_potential': 2, 'tags': ['work', 'wrap_up', 'daily']}, 'notes': f'Core work - {day_name}', 'day_index': day_offset, 'actual_date': date_str}
                    ])
                
                # Evening commute
                day_activities.append({'start_time': '6:00 PM', 'end_time': '6:10 PM', 'activity': {'name': f'Evening Commute ({day_name})', 'activity_type': 'commute', 'duration_hours': 0.17, 'cost_cad': 6, 'location': 'Office to Home', 'description': '10-minute commute from work. TTC: $3.35 fare. Car: Downtown to home.', 'networking_potential': 0, 'tags': ['commute', 'daily', 'transport']}, 'notes': f'Daily commute - {day_name}', 'day_index': day_offset, 'actual_date': date_str})
            
            # Weekend-specific daytime activities with variety
            if day_name == 'Saturday':
                # Required Saturday activities
                day_activities.extend([
                    {'start_time': '10:00 AM', 'end_time': '12:00 PM', 'activity': {'name': 'Grocery Shopping (Saturday)', 'activity_type': 'personal', 'duration_hours': 2.0, 'cost_cad': 100, 'location': 'St. Lawrence Market, 93 Front St E, Toronto', 'description': 'Weekly grocery shopping (Saturday preferred). Website: stlawrencemarket.com. TTC: Union Station + 10min walk. Car: Parking $5/hour. First-time: Bring reusable bags, cash preferred.', 'networking_potential': 1}, 'notes': 'Saturday preferred', 'day_index': day_offset, 'actual_date': date_str},
                    {'start_time': '2:00 PM', 'end_time': '2:20 PM', 'activity': {'name': 'Beard Trimming (Weekly)', 'activity_type': 'personal_care', 'duration_hours': 0.33, 'cost_cad': 0, 'location': 'Home', 'description': 'Weekly beard trimming and grooming (Saturday preferred)', 'networking_potential': 0}, 'notes': 'Weekly personal care', 'day_index': day_offset, 'actual_date': date_str}
                ])
                
                # Add varied Saturday afternoon activity
                if activity_pools['fitness']:
                    varied_fitness = select_varied_activity(
                        activity_pools['fitness'],
                        {'name': 'Tennis Session', 'activity_type': 'fitness', 'duration_hours': 1.5, 'cost_cad': 30, 'location': 'Tennis Club', 'description': 'Weekend tennis', 'networking_potential': 4},
                        day_name
                    )
                    day_activities.append({
                        'start_time': '3:00 PM', 'end_time': '4:30 PM', 
                        'activity': varied_fitness, 
                        'notes': f'Fitness variety - {day_name}', 
                        'day_index': day_offset, 
                        'actual_date': date_str
                    })
                    
            elif day_name == 'Sunday':
                # Required Sunday activities
                day_activities.extend([
                    {'start_time': '9:00 AM', 'end_time': '9:15 AM', 'activity': {'name': 'Nail Trimming (Weekly)', 'activity_type': 'personal_care', 'duration_hours': 0.25, 'cost_cad': 0, 'location': 'Home', 'description': 'Weekly nail trimming and maintenance (Sunday preferred)', 'networking_potential': 0}, 'notes': 'Weekly personal care', 'day_index': day_offset, 'actual_date': date_str},
                    {'start_time': '10:30 AM', 'end_time': '11:00 AM', 'activity': {'name': 'Weekly Emotional Check-In (Sunday)', 'activity_type': 'couple_emotional_safety', 'duration_hours': 0.5, 'cost_cad': 0, 'location': 'Home', 'description': 'Dedicated time to share feelings, concerns, and needs without judgment (Sunday mornings)', 'networking_potential': 0, 'connection_depth': 9, 'emotional_safety': 10}, 'notes': 'Sunday emotional safety', 'day_index': day_offset, 'actual_date': date_str},
                    {'start_time': '1:00 PM', 'end_time': '3:00 PM', 'activity': {'name': 'Laundry (Sunday)', 'activity_type': 'personal', 'duration_hours': 2.0, 'cost_cad': 0, 'location': 'Home', 'description': 'Weekly laundry (Sunday preferred). Includes sorting, washing, drying, folding.', 'networking_potential': 0}, 'notes': 'Sunday preferred', 'day_index': day_offset, 'actual_date': date_str}
                ])
                
                # Add varied Sunday afternoon activity
                if activity_pools['cultural'] or activity_pools['social']:
                    cultural_pool = activity_pools['cultural'] + activity_pools['social']
                    varied_cultural = select_varied_activity(
                        cultural_pool,
                        {'name': 'Cultural Event', 'activity_type': 'cultural', 'duration_hours': 2.0, 'cost_cad': 25, 'location': 'Toronto Venue', 'description': 'Sunday cultural activity', 'networking_potential': 6},
                        day_name
                    )
                    day_activities.append({
                        'start_time': '3:30 PM', 'end_time': '5:30 PM', 
                        'activity': varied_cultural, 
                        'notes': f'Cultural variety - {day_name}', 
                        'day_index': day_offset, 
                        'actual_date': date_str
                    })
            
            # Evening Activities (AFTER 6:10 PM - VARIETY FROM DATABASE)
            if is_weekday:
                # Weekday evenings - networking focus with variety
                networking_activity = random.choice(activity_pools['networking']) if activity_pools['networking'] else {
                    'name': f'Toronto Networking Event ({day_name})', 'activity_type': 'social', 'duration_hours': 2.0, 'cost_cad': 25, 'location': 'MaRS Discovery District, 661 University Ave, Toronto', 'description': 'Professional networking to build Toronto connections.', 'networking_potential': 8
                }
                
                couple_activity = random.choice(activity_pools['couple']) if activity_pools['couple'] else {
                    'name': f'Device-Free Dinner ({day_name})', 'activity_type': 'couple_quality_time', 'duration_hours': 1.0, 'cost_cad': 60, 'location': 'Toronto Restaurant', 'description': 'Uninterrupted dinner conversation without phones.', 'connection_depth': 8, 'emotional_safety': 8
                }
                
                day_activities.extend([
                    {'start_time': '6:30 PM', 'end_time': '8:30 PM', 'activity': {
                        'name': networking_activity.get('name', f'Networking Event ({day_name})'),
                        'activity_type': networking_activity.get('activity_type', 'social'),
                        'duration_hours': networking_activity.get('duration_hours', networking_activity.get('duration_minutes', 120) / 60),
                        'cost_cad': networking_activity.get('cost_cad', 25),
                        'location': networking_activity.get('location', 'Toronto Venue'),
                        'description': networking_activity.get('description', 'Professional networking event'),
                        'networking_potential': networking_activity.get('networking_potential', 8)
                    }, 'notes': f'Networking variety - {day_name}', 'day_index': day_offset, 'actual_date': date_str},
                    {'start_time': '8:30 PM', 'end_time': '9:30 PM', 'activity': {
                        'name': couple_activity.get('name', f'Couple Time ({day_name})'),
                        'activity_type': couple_activity.get('activity_type', 'couple_quality_time'),
                        'duration_hours': couple_activity.get('duration_hours', couple_activity.get('duration_minutes', 60) / 60),
                        'cost_cad': couple_activity.get('cost_cad', 60),
                        'location': couple_activity.get('location', 'Toronto'),
                        'description': couple_activity.get('description', 'Quality couple time'),
                        'networking_potential': couple_activity.get('networking_potential', 0),
                        'connection_depth': couple_activity.get('connection_depth', 8),
                        'emotional_safety': couple_activity.get('emotional_safety', 8)
                    }, 'notes': f'Couple variety - {day_name}', 'day_index': day_offset, 'actual_date': date_str}
                ])
            else:
                # Weekend evenings - couple and entertainment variety
                entertainment_activity = random.choice(activity_pools['entertainment']) if activity_pools['entertainment'] else {
                    'name': f'Cultural Event ({day_name})', 'activity_type': 'entertainment', 'duration_hours': 1.5, 'cost_cad': 50, 'location': 'Toronto Venue', 'description': 'Cultural entertainment activity'
                }
                
                couple_weekend_activity = random.choice(activity_pools['couple']) if activity_pools['couple'] else {
                    'name': f'Couple Adventure ({day_name})', 'activity_type': 'couple_adventure', 'duration_hours': 1.0, 'cost_cad': 40, 'location': 'Home', 'description': 'Weekend couple time'
                }
                
                day_activities.extend([
                    {'start_time': '6:30 PM', 'end_time': '8:00 PM', 'activity': {
                        'name': entertainment_activity.get('name', f'Entertainment ({day_name})'),
                        'activity_type': entertainment_activity.get('activity_type', 'entertainment'),
                        'duration_hours': entertainment_activity.get('duration_hours', entertainment_activity.get('duration_minutes', 90) / 60),
                        'cost_cad': entertainment_activity.get('cost_cad', 50),
                        'location': entertainment_activity.get('location', 'Toronto'),
                        'description': entertainment_activity.get('description', 'Entertainment activity'),
                        'networking_potential': entertainment_activity.get('networking_potential', 5)
                    }, 'notes': f'Entertainment variety - {day_name}', 'day_index': day_offset, 'actual_date': date_str},
                    {'start_time': '8:00 PM', 'end_time': '9:00 PM', 'activity': {
                        'name': couple_weekend_activity.get('name', f'Couple Time ({day_name})'),
                        'activity_type': couple_weekend_activity.get('activity_type', 'couple_quality_time'),
                        'duration_hours': couple_weekend_activity.get('duration_hours', couple_weekend_activity.get('duration_minutes', 60) / 60),
                        'cost_cad': couple_weekend_activity.get('cost_cad', 40),
                        'location': couple_weekend_activity.get('location', 'Home'),
                        'description': couple_weekend_activity.get('description', 'Weekend couple activity'),
                        'networking_potential': couple_weekend_activity.get('networking_potential', 0),
                        'connection_depth': couple_weekend_activity.get('connection_depth', 7),
                        'emotional_safety': couple_weekend_activity.get('emotional_safety', 7)
                    }, 'notes': f'Couple weekend variety - {day_name}', 'day_index': day_offset, 'actual_date': date_str}
                ])
            
            # Evening Routine (EVERY DAY - 9:45-10:30 PM)
            day_activities.extend([
                {'start_time': '9:45 PM', 'end_time': '9:55 PM', 'activity': {'name': f'Evening Gratitude Share ({day_name})', 'activity_type': 'couple_daily_connection', 'duration_hours': 0.17, 'cost_cad': 0, 'location': 'Home', 'description': 'Share three things you\'re grateful for about each other (habit stacked with bedtime)', 'networking_potential': 0, 'connection_depth': 8, 'emotional_safety': 9}, 'notes': f'Habit stacked - {day_name}', 'day_index': day_offset, 'actual_date': date_str},
                {'start_time': '10:00 PM', 'end_time': '10:30 PM', 'activity': {'name': f'Evening Wind Down ({day_name})', 'activity_type': 'evening_routine', 'duration_hours': 0.5, 'cost_cad': 0, 'location': 'Home', 'description': 'Prepare for 10:30 PM bedtime: no screens, reading, relaxation (no morning news rule)', 'networking_potential': 0}, 'notes': f'Bedtime routine - {day_name}', 'day_index': day_offset, 'actual_date': date_str}
            ])
            
            # Add all day activities to base_activities
            base_activities.extend(day_activities)
        
        # Add weekly/monthly activities (weekend specific)
        # These are added separately to avoid duplication in the daily loop
        
        # Weekend-specific activities (Saturday/Sunday only) - already included in daily loop above
        
        # Mock schedule data for testing
        mock_schedule = {
            'acknowledgment': f"🎯 Life Planner - {schedule_type.title()} Schedule Generated!\n\nDate Range: {start_date} for {duration}\nUser: Kevin\nPartner: Peter",
            'schedule': {
                'date': start_date,
                'duration': duration,
                'schedule_type': schedule_type,
                'time_slots': base_activities
            },
            'summary': f'## 📊 Schedule Summary\n\n**Total Activities:** {len(base_activities)}\n**Duration:** {duration}\n**Schedule Type:** {schedule_type.title()}'
        }
        
        return jsonify(mock_schedule)
        
    except Exception as e:
        print(f"❌ Error generating schedule: {e}")
        return jsonify({
            'error': 'Failed to generate schedule',
            'message': str(e)
        }), 500

@app.route('/api/v1/activities')
def get_activities():
    """Get activities"""
    return jsonify({
        'activities': [],
        'statistics': {
            'total_activities': 25,
            'by_type': {
                'individual': 10,
                'networking': 8,
                'couple': 7
            },
            'average_cost': 45.0,
            'average_networking_potential': 4.2
        }
    })

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'error': 'Not Found',
        'message': 'The requested resource was not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'error': 'Internal Server Error',
        'message': 'An unexpected error occurred'
    }), 500

if __name__ == '__main__':
    print("🚀 Starting Simple LifePlanner UI Server...")
    print(f"📁 Serving UI from: {os.path.abspath(UI_DIR)}")
    print()
    print("🌐 Access the application at:")
    print("   Simple UI: http://localhost:8081/simple_index.html")
    print("   Test Health: http://localhost:8081/api/v1/health")
    print()
    print("🎯 This is a simplified server for Phase 1 testing")
    print("📝 Check browser console for detailed debugging info")
    print()
    
    app.run(host='0.0.0.0', port=8081, debug=True)
