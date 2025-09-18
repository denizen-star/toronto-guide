"""
Calendar Views Module for Dual Kevin System
Provides daily, weekly, and monthly calendar views for both Kevin versions
"""

from datetime import datetime, date, timedelta
import calendar


def generate_weekly_calendar_html(schedule, kevin_type="working"):
    """Generate HTML for weekly calendar view"""
    colors = {
        'working': {'primary': '#28a745', 'secondary': '#20c997'},
        'jobsearch': {'primary': '#007bff', 'secondary': '#6f42c1'}
    }
    
    color_scheme = colors.get(kevin_type, colors['working'])
    
    # Get current week
    today = datetime.now().date()
    start_of_week = today - timedelta(days=today.weekday())
    
    weekly_html = '<div class="weekly-calendar">'
    
    for i in range(7):
        day_date = start_of_week + timedelta(days=i)
        day_name = day_date.strftime("%A")
        
        # Find activities for this day
        day_activities = []
        for day_key, activities in schedule.items():
            if day_name in day_key:
                day_activities = activities  # Show ALL activities for full 6 AM - midnight view
                break
        
        weekly_html += f'''
        <div class="week-day" style="border-top: 3px solid {color_scheme['primary']};">
            <div class="week-day-header">
                <h4>{day_name}</h4>
                <span class="week-date">{day_date.strftime("%m/%d")}</span>
            </div>
            <div class="week-day-activities">
        '''
        
        for activity in day_activities:
            # Get activity type tag for weekly view
            activity_tag = get_activity_type_tag(activity)
            # Get website info
            website_info = get_activity_website_and_instructions(activity)
            # Networking rating
            networking_stars = "⭐" * min(activity.networking_potential, 5) if activity.networking_potential > 0 else "No networking"
            
            weekly_html += f'''
            <div class="week-activity">
                <div class="week-activity-tag" style="background-color: {activity_tag['color']};">{activity_tag['tag'][:8]}</div>
                <span class="week-time">{activity.time.split(' - ')[0]}</span>
                <span class="week-title">{activity.activity[:20]}...</span>
                <div class="week-details">
                    <span class="week-networking">🤝 {networking_stars[:3]}</span>
                    <a href="{website_info['website']}" target="_blank" class="week-link">🔗</a>
                </div>
            </div>
            '''
        
        if len(day_activities) == 0:
            weekly_html += '<div class="week-activity"><span class="week-title">No activities</span></div>'
        
        weekly_html += '</div></div>'
    
    weekly_html += '</div>'
    return weekly_html


def generate_monthly_calendar_html(schedule, kevin_type="working"):
    """Generate HTML for monthly calendar view"""
    colors = {
        'working': {'primary': '#28a745', 'secondary': '#20c997'},
        'jobsearch': {'primary': '#007bff', 'secondary': '#6f42c1'}
    }
    
    color_scheme = colors.get(kevin_type, colors['working'])
    
    # Get current month
    today = datetime.now().date()
    year = today.year
    month = today.month
    
    # Get calendar data
    cal = calendar.monthcalendar(year, month)
    month_name = calendar.month_name[month]
    
    monthly_html = f'''
    <div class="monthly-calendar">
        <div class="month-header">
            <h2>{month_name} {year}</h2>
        </div>
        <div class="calendar-grid">
            <div class="calendar-weekdays">
                <div class="weekday">Mon</div>
                <div class="weekday">Tue</div>
                <div class="weekday">Wed</div>
                <div class="weekday">Thu</div>
                <div class="weekday">Fri</div>
                <div class="weekday">Sat</div>
                <div class="weekday">Sun</div>
            </div>
            <div class="calendar-days">
    '''
    
    for week in cal:
        for day in week:
            if day == 0:
                monthly_html += '<div class="calendar-day empty"></div>'
            else:
                # Check if this day has activities
                day_date = date(year, month, day)
                day_name = day_date.strftime("%A")
                
                has_activities = False
                activity_count = 0
                activity_types = set()
                for day_key, activities in schedule.items():
                    if day_name in day_key:
                        has_activities = True
                        activity_count = len(activities)
                        # Get activity types for this day
                        for activity in activities[:3]:  # Show up to 3 activity types
                            activity_tag = get_activity_type_tag(activity)
                            activity_types.add(activity_tag['tag'])
                        break
                
                is_today = day_date == today
                day_class = "calendar-day"
                if is_today:
                    day_class += " today"
                if has_activities:
                    day_class += " has-activities"
                
                # Create activity type indicators
                type_indicators = ""
                if activity_types:
                    type_colors = {
                        'Individual': '#28a745',
                        'Professional Growth': '#6f42c1',
                        'Couple Activity': '#dc3545',
                        'Friendship Activity': '#fd7e14'
                    }
                    for activity_type in list(activity_types)[:2]:  # Show max 2 types
                        color = type_colors.get(activity_type, '#6c757d')
                        type_indicators += f'<span class="month-activity-dot" style="background-color: {color};"></span>'
                
                monthly_html += f'''
                <div class="{day_class}" style="border-color: {color_scheme['primary']};">
                    <div class="day-number">{day}</div>
                    <div class="day-activities">
                        <div class="activity-count">{f"{activity_count} activities" if has_activities else ""}</div>
                        <div class="activity-types">{type_indicators}</div>
                    </div>
                </div>
                '''
    
    monthly_html += '''
            </div>
        </div>
    </div>
    '''
    
    return monthly_html


def get_activity_type_tag(activity):
    """Determine activity type tag based on activity details"""
    activity_name = activity.activity.lower()
    category = activity.category.lower()
    
    if any(word in activity_name for word in ['couple', 'peter', 'relationship', 'date', 'massage']):
        return {'tag': 'Couple Activity', 'color': '#f8d7da'}
    elif any(word in activity_name for word in ['network', 'social', 'mixer', 'event', 'meetup', 'friends']):
        return {'tag': 'Friendship Activity', 'color': '#ffeaa7'}
    elif any(word in activity_name for word in ['work', 'job', 'career', 'professional', 'skill', 'course', 'interview']):
        return {'tag': 'Professional Growth', 'color': '#e2d5f1'}
    else:
        return {'tag': 'Individual', 'color': '#d4edda'}

def get_activity_website_and_instructions(activity):
    """Get website and instructions for specific activities"""
    activity_name = activity.activity.lower()
    
    # 7 Habits activities
    if 'be proactive' in activity_name:
        return {
            'website': 'https://www.franklincovey.com/the-7-habits/',
            'instructions': 'Start your day by setting intentions. Drink water, review your goals, and choose a proactive mindset for the day ahead.'
        }
    elif 'begin with the end in mind' in activity_name:
        return {
            'website': 'https://www.franklincovey.com/the-7-habits/',
            'instructions': 'Visualize your goals and desired outcomes. Spend time thinking about what you want to accomplish today and this week.'
        }
    elif 'sharpen the saw' in activity_name:
        return {
            'website': 'https://www.franklincovey.com/the-7-habits/',
            'instructions': 'Physical renewal through exercise. Do stretching, light workout, or preparation for your main fitness activity.'
        }
    
    # Swimming activities
    elif 'swim' in activity_name:
        if 'dsc' in activity_name:
            return {
                'website': 'https://www.dsc.ca/',
                'instructions': 'Arrive 15 minutes early. Bring goggles, swim cap, and water bottle. Follow lane etiquette and coach instructions.'
            }
        elif 'trillium' in activity_name:
            return {
                'website': 'https://ymcagta.org/find-a-y/trillium-y',
                'instructions': 'Check in at front desk. Pool schedule varies - confirm times. Bring YMCA membership card and swim gear.'
            }
        else:
            return {
                'website': 'https://www.toronto.ca/explore-enjoy/recreation/swimming/',
                'instructions': 'Check pool hours and availability. Bring swim gear and arrive 10 minutes early for lane swimming.'
            }
    
    # Tennis activities
    elif 'tennis' in activity_name:
        return {
            'website': 'https://www.toronto.ca/explore-enjoy/recreation/tennis/',
            'instructions': 'Bring tennis racket, appropriate shoes, and water. Arrive 10 minutes early. Check weather for outdoor courts.'
        }
    
    # Running activities
    elif 'run' in activity_name:
        return {
            'website': 'https://www.runningroom.com/ca/training',
            'instructions': 'Warm up for 5 minutes. Follow your half-marathon training plan. Cool down and stretch afterward. Stay hydrated.'
        }
    
    # Job search activities
    elif 'job search' in activity_name:
        return {
            'website': 'https://www.linkedin.com/jobs/',
            'instructions': 'Set specific goals (5-10 applications). Update your resume for each role. Use job boards like LinkedIn, Indeed, and company websites.'
        }
    elif 'linkedin' in activity_name:
        return {
            'website': 'https://www.linkedin.com/',
            'instructions': 'Send 3-5 personalized connection requests daily. Engage with posts in your industry. Update your status regularly.'
        }
    
    # City exploration
    elif 'cafe' in activity_name or 'exploration' in activity_name:
        return {
            'website': 'https://www.blogto.com/toronto/the_best_cafes_in_toronto/',
            'instructions': 'Try a new neighborhood cafe. Bring a book or journal. Take photos and rate your experience. Budget $10-15.'
        }
    elif 'high park' in activity_name:
        return {
            'website': 'https://www.highparktoronto.com/',
            'instructions': 'Wear comfortable walking shoes. Check seasonal highlights (cherry blossoms, fall colors). Bring water and snacks.'
        }
    elif 'harbourfront' in activity_name:
        return {
            'website': 'https://www.harbourfrontcentre.com/',
            'instructions': 'Check event calendar for free activities. Great for photos and people watching. Parking available but expensive.'
        }
    
    # Skill development
    elif 'course' in activity_name or 'skill' in activity_name:
        return {
            'website': 'https://www.coursera.org/',
            'instructions': 'Set up distraction-free environment. Take notes and complete assignments. Apply learnings to personal projects.'
        }
    
    # Social activities
    elif 'mixer' in activity_name:
        return {
            'website': 'https://www.eventbrite.ca/',
            'instructions': 'Prepare elevator pitch. Bring business cards. Set goal to meet 3-5 new people. Follow up within 48 hours.'
        }
    elif 'church' in activity_name:
        return {
            'website': 'https://www.stmichaelscathedral.com/',
            'instructions': 'Arrive 10 minutes early. Dress appropriately. Participate in community and fellowship activities after service.'
        }
    
    # Default for unknown activities
    else:
        return {
            'website': 'https://www.google.com/search?q=' + activity.activity.replace(' ', '+'),
            'instructions': 'Prepare in advance. Arrive on time. Bring any necessary equipment or materials.'
        }

def get_calendar_styles(kevin_type="working"):
    """Get CSS styles for calendar views"""
    colors = {
        'working': {'primary': '#28a745', 'secondary': '#20c997', 'bg': 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'},
        'jobsearch': {'primary': '#007bff', 'secondary': '#6f42c1', 'bg': 'linear-gradient(135deg, #007bff 0%, #6f42c1 100%)'}
    }
    
    color_scheme = colors.get(kevin_type, colors['working'])
    
    return f'''
    <style>
        body {{ 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: {color_scheme['bg']};
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }}
        .header {{
            background: white;
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        .nav-link {{
            background: {color_scheme['primary']};
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            margin-left: 10px;
        }}
        .nav-link:hover {{
            opacity: 0.8;
            text-decoration: none;
            color: white;
        }}
        .content {{
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            max-width: 1200px;
            margin: 0 auto;
        }}
        .calendar-nav {{
            text-align: center;
            margin: 20px 0;
        }}
        .calendar-nav a {{
            background: #17a2b8;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            margin: 0 5px;
        }}
        .calendar-nav a:hover {{
            background: #138496;
            text-decoration: none;
            color: white;
        }}
        
        /* Weekly Calendar Styles */
        .weekly-calendar {{
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 15px;
            margin: 20px 0;
        }}
        .week-day {{
            background: #f8f9fa;
            border-radius: 10px;
            padding: 12px;
            min-height: 400px;
            max-height: 500px;
            overflow-y: auto;
        }}
        .week-day-header {{
            text-align: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid {color_scheme['primary']};
        }}
        .week-day-header h4 {{
            margin: 0;
            color: {color_scheme['primary']};
        }}
        .week-date {{
            color: #6c757d;
            font-size: 0.9em;
        }}
        .week-activity {{
            background: white;
            margin: 6px 0;
            padding: 10px;
            border-radius: 10px;
            border-left: 3px solid {color_scheme['secondary']};
            position: relative;
            box-shadow: 0 1px 4px rgba(0,0,0,0.08);
            font-size: 0.8em;
            border: 1px solid #f5f5f5;
            transition: all 0.2s ease;
        }}
        .week-activity:hover {{
            box-shadow: 0 2px 8px rgba(0,0,0,0.12);
            border-color: #e0e0e0;
        }}
        .week-activity-tag {{
            position: absolute;
            top: 6px;
            right: 8px;
            padding: 3px 8px;
            border-radius: 12px;
            color: #495057;
            font-size: 0.65em;
            font-weight: 600;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }}
        .week-time {{
            font-weight: 500;
            color: #6c757d;
            font-size: 0.75em;
            display: block;
            margin-bottom: 4px;
            letter-spacing: 0.3px;
        }}
        .week-title {{
            color: #2c3e50;
            font-size: 0.8em;
            font-weight: 600;
            margin-bottom: 6px;
            padding-right: 55px;
            line-height: 1.2;
        }}
        .week-details {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.65em;
            margin-top: 4px;
        }}
        .week-networking {{
            color: #6c757d;
            background: #f8f9fa;
            padding: 2px 6px;
            border-radius: 8px;
            font-size: 0.7em;
        }}
        .week-link {{
            color: #007bff;
            text-decoration: none;
            font-size: 1.1em;
            padding: 2px 4px;
            border-radius: 4px;
            transition: all 0.2s ease;
        }}
        .week-link:hover {{
            color: #0056b3;
            background: #f8f9ff;
        }}
        
        /* Monthly Calendar Styles */
        .monthly-calendar {{
            margin: 20px 0;
        }}
        .month-header {{
            text-align: center;
            margin-bottom: 20px;
            color: {color_scheme['primary']};
        }}
        .calendar-grid {{
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }}
        .calendar-weekdays {{
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            background: {color_scheme['primary']};
        }}
        .weekday {{
            padding: 15px;
            text-align: center;
            color: white;
            font-weight: bold;
        }}
        .calendar-days {{
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            background: white;
        }}
        .calendar-day {{
            min-height: 100px;
            padding: 10px;
            border: 1px solid #e9ecef;
            position: relative;
        }}
        .calendar-day.empty {{
            background: #f8f9fa;
        }}
        .calendar-day.today {{
            background: {color_scheme['secondary']};
            color: white;
        }}
        .calendar-day.has-activities {{
            background: #e8f5e8;
        }}
        .day-number {{
            font-weight: bold;
            font-size: 1.2em;
            margin-bottom: 5px;
        }}
        .day-activities {{
            font-size: 0.8em;
            color: #6c757d;
        }}
        .calendar-day.today .day-activities {{
            color: white;
        }}
        .activity-count {{
            font-size: 0.8em;
            margin-bottom: 4px;
        }}
        .activity-types {{
            display: flex;
            gap: 3px;
            justify-content: center;
        }}
        .month-activity-dot {{
            width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
        }}
        
        /* Enhanced Calendar Event Tiles - Streamlined & Minimalist */
        .calendar-event {{
            background: white;
            margin: 20px 0;
            padding: 24px;
            border-radius: 16px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.08);
            position: relative;
            transition: all 0.2s ease;
            border: 1px solid #f0f0f0;
        }}
        .calendar-event:hover {{
            transform: translateY(-1px);
            box-shadow: 0 4px 20px rgba(0,0,0,0.12);
            border-color: #e0e0e0;
        }}
        .activity-tag {{
            position: absolute;
            top: 12px;
            right: 16px;
            padding: 6px 14px;
            border-radius: 24px;
            color: #495057;
            font-size: 0.75em;
            font-weight: 600;
            border: none;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }}
        .event-time {{
            font-weight: 500;
            color: #6c757d;
            font-size: 0.9em;
            margin-bottom: 6px;
            letter-spacing: 0.5px;
        }}
        .event-title {{
            font-size: 1.3em;
            font-weight: 600;
            color: #2c3e50;
            margin: 6px 0 16px 0;
            padding-right: 120px;
            line-height: 1.3;
        }}
        .event-details {{
            color: #6c757d;
            font-size: 0.9em;
            margin: 12px 0;
            display: flex;
            align-items: center;
            gap: 20px;
            flex-wrap: wrap;
        }}
        .networking-rating {{
            display: inline-flex;
            align-items: center;
            background: #f8f9fa;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.8em;
            border: 1px solid #e9ecef;
        }}
        .event-description {{
            color: #5a6c7d;
            font-size: 0.85em;
            line-height: 1.5;
            margin: 16px 0 12px 0;
        }}
        .event-website {{
            margin: 16px 0 8px 0;
            padding: 0;
            background: none;
            border: none;
        }}
        .event-website a {{
            color: #007bff;
            text-decoration: none;
            font-weight: 500;
            font-size: 0.85em;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: #f8f9ff;
            border-radius: 20px;
            border: 1px solid #e3f2fd;
            transition: all 0.2s ease;
        }}
        .event-website a:hover {{
            background: #e3f2fd;
            transform: translateY(-1px);
        }}
        .event-instructions {{
            margin: 12px 0 0 0;
            padding: 16px;
            background: #fafbfc;
            border-radius: 12px;
            border: 1px solid #f0f0f0;
            font-size: 0.85em;
            line-height: 1.5;
        }}
        .instructions-label {{
            font-weight: 600;
            color: #495057;
            margin-bottom: 8px;
            font-size: 0.8em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}
    </style>
    '''
