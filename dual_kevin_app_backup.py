"""
Dual Kevin LifePlanner App
Serves both Working Kevin and Job Search Kevin versions
"""

from flask import Flask, render_template, jsonify, request, redirect, url_for
import json
import os
from datetime import datetime
from time_allocation_tuner import TimeAllocationTuner
from enhanced_schedule_generator import EnhancedScheduleGenerator
from job_search_schedule_generator import JobSearchScheduleGenerator
from calendar_views import generate_weekly_calendar_html, generate_monthly_calendar_html, get_calendar_styles, get_activity_type_tag, get_activity_website_and_instructions

app = Flask(__name__)

# Global instances
working_tuner = TimeAllocationTuner()
working_generator = EnhancedScheduleGenerator(working_tuner)
jobsearch_generator = JobSearchScheduleGenerator(working_tuner)

@app.route('/')
def index():
    """Main landing page with links to both Kevin versions"""
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>LifePlanner - Choose Your Kevin</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0;
                padding: 40px;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container {
                background: white;
                border-radius: 20px;
                padding: 60px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 800px;
            }
            h1 {
                color: #333;
                font-size: 3em;
                margin-bottom: 20px;
                background: linear-gradient(45deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .subtitle {
                color: #666;
                font-size: 1.2em;
                margin-bottom: 50px;
            }
            .kevin-options {
                display: flex;
                gap: 40px;
                justify-content: center;
                flex-wrap: wrap;
            }
            .kevin-card {
                background: #f8f9fa;
                border-radius: 15px;
                padding: 40px 30px;
                width: 300px;
                border: 3px solid transparent;
                transition: all 0.3s ease;
                text-decoration: none;
                color: inherit;
            }
            .kevin-card:hover {
                border-color: #667eea;
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
                text-decoration: none;
                color: inherit;
            }
            .kevin-title {
                font-size: 1.8em;
                font-weight: bold;
                margin-bottom: 15px;
                color: #333;
            }
            .kevin-description {
                color: #666;
                line-height: 1.6;
                margin-bottom: 20px;
            }
            .kevin-schedule {
                background: #e9ecef;
                border-radius: 8px;
                padding: 15px;
                font-size: 0.9em;
                color: #555;
            }
            .working-kevin { border-left: 5px solid #28a745; }
            .jobsearch-kevin { border-left: 5px solid #007bff; }
            .emoji { font-size: 2em; margin-bottom: 15px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎯 LifePlanner</h1>
            <p class="subtitle">Choose your Kevin version to get started</p>
            
            <div class="kevin-options">
                <a href="/working-kevin" class="kevin-card working-kevin">
                    <div class="emoji">💼</div>
                    <div class="kevin-title">Working Kevin</div>
                    <div class="kevin-description">
                        Traditional work schedule with optimized personal time, fitness variety, and relationship focus.
                    </div>
                    <div class="kevin-schedule">
                        <strong>Schedule:</strong><br>
                        6:00-9:00 AM: Morning routine<br>
                        9:00 AM-6:00 PM: Work hours<br>
                        6:00-10:00 PM: Fitness, social, couple time
                    </div>
                </a>
                
                <a href="/job-search-kevin" class="kevin-card jobsearch-kevin">
                    <div class="emoji">🚀</div>
                    <div class="kevin-title">Job Search Kevin</div>
                    <div class="kevin-description">
                        Career transition focus with job search sprints, skill development, and city exploration.
                    </div>
                    <div class="kevin-schedule">
                        <strong>Schedule:</strong><br>
                        6:00-9:00 AM: Morning routine<br>
                        9:00 AM-12:00 PM: Job search sprint<br>
                        12:00-2:00 PM: City exploration<br>
                        2:00-5:00 PM: Skills + sports
                    </div>
                </a>
            </div>
        </div>
    </body>
    </html>
    '''

@app.route('/working-kevin')
def working_kevin():
    """Working Kevin dashboard"""
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Working Kevin - LifePlanner</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                margin: 0;
                padding: 20px;
                min-height: 100vh;
            }
            .header {
                background: white;
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .nav-link {
                background: #007bff;
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: bold;
            }
            .nav-link:hover {
                background: #0056b3;
                text-decoration: none;
                color: white;
            }
            .content {
                background: white;
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            .features {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-top: 30px;
            }
            .feature-card {
                background: #f8f9fa;
                border-radius: 10px;
                padding: 20px;
                border-left: 4px solid #28a745;
            }
            .btn {
                background: #28a745;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                text-decoration: none;
                display: inline-block;
                margin: 10px 10px 10px 0;
                font-weight: bold;
                cursor: pointer;
            }
            .btn:hover {
                background: #218838;
                text-decoration: none;
                color: white;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>💼 Working Kevin LifePlanner</h1>
            <div>
                <a href="/job-search-kevin" class="nav-link">🚀 Switch to Job Search Kevin</a>
                <a href="/" class="nav-link">🏠 Home</a>
            </div>
        </div>
        
        <div class="content">
            <h2>Traditional Work Schedule with Life Optimization</h2>
            <p>Your current system with enhanced fitness variety, meaningful networking, and structured personal development.</p>
            
            <div style="margin: 20px 0;">
                <a href="/working-kevin/schedule" class="btn">📅 Generate Schedule</a>
                <a href="/working-kevin/sliders" class="btn">🎛️ Time Allocation Sliders</a>
                <a href="http://localhost:8080/simple_index.html" target="_blank" class="btn">📱 Simple UI</a>
            </div>
            
            <div style="margin: 20px 0; padding: 15px; background: #e9ecef; border-radius: 10px;">
                <h4>📅 Calendar Views</h4>
                <a href="/calendar/daily?kevin_type=working" class="btn" style="background: #17a2b8;">📅 Daily View</a>
                <a href="/calendar/weekly?kevin_type=working" class="btn" style="background: #17a2b8;">📊 Weekly View</a>
                <a href="/calendar/monthly?kevin_type=working" class="btn" style="background: #17a2b8;">🗓️ Monthly View</a>
            </div>
            
            <div class="features">
                <div class="feature-card">
                    <h3>🏊‍♂️ Fitness Variety</h3>
                    <p>Swimming, tennis, running with round-robin rotation through different clubs and coaches.</p>
                </div>
                <div class="feature-card">
                    <h3>📚 Structured Personal Development</h3>
                    <p>7 Habits morning routine, self-help book integration, goal alignment scoring.</p>
                </div>
                <div class="feature-card">
                    <h3>💑 Relationship Focus</h3>
                    <p>Quality couple time with Peter, activities from "The Couple's Activity Book".</p>
                </div>
                <div class="feature-card">
                    <h3>🌐 Meaningful Networking</h3>
                    <p>Professional events, cultural activities, LGBTQ+ community engagement.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    '''

@app.route('/job-search-kevin')
def job_search_kevin():
    """Job Search Kevin dashboard"""
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Job Search Kevin - LifePlanner</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #007bff 0%, #6f42c1 100%);
                margin: 0;
                padding: 20px;
                min-height: 100vh;
            }
            .header {
                background: white;
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .nav-link {
                background: #28a745;
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: bold;
            }
            .nav-link:hover {
                background: #218838;
                text-decoration: none;
                color: white;
            }
            .content {
                background: white;
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            .features {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-top: 30px;
            }
            .feature-card {
                background: #f8f9fa;
                border-radius: 10px;
                padding: 20px;
                border-left: 4px solid #007bff;
            }
            .btn {
                background: #007bff;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                text-decoration: none;
                display: inline-block;
                margin: 10px 10px 10px 0;
                font-weight: bold;
                cursor: pointer;
            }
            .btn:hover {
                background: #0056b3;
                text-decoration: none;
                color: white;
            }
            .schedule-block {
                background: #e7f3ff;
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
                border-left: 5px solid #007bff;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚀 Job Search Kevin LifePlanner</h1>
            <div>
                <a href="/working-kevin" class="nav-link">💼 Switch to Working Kevin</a>
                <a href="/" class="nav-link">🏠 Home</a>
            </div>
        </div>
        
        <div class="content">
            <h2>Career Transition with Purpose & Structure</h2>
            <p>Optimized schedule for job searching, skill development, and maintaining well-being during career transition.</p>
            
            <div style="margin: 20px 0;">
                <a href="/job-search-kevin/schedule" class="btn">📅 Generate Job Search Schedule</a>
                <a href="/job-search-kevin/activities" class="btn">🎯 View Activities</a>
            </div>
            
            <div style="margin: 20px 0; padding: 15px; background: #e9ecef; border-radius: 10px;">
                <h4>📅 Calendar Views</h4>
                <a href="/calendar/daily?kevin_type=jobsearch" class="btn" style="background: #6f42c1;">📅 Daily View</a>
                <a href="/calendar/weekly?kevin_type=jobsearch" class="btn" style="background: #6f42c1;">📊 Weekly View</a>
                <a href="/calendar/monthly?kevin_type=jobsearch" class="btn" style="background: #6f42c1;">🗓️ Monthly View</a>
            </div>
            
            <div class="schedule-block">
                <h3>📋 Daily Structure</h3>
                <strong>9:00 AM - 12:00 PM:</strong> Job Search Sprint (applications, networking, research)<br>
                <strong>12:00 PM - 2:00 PM:</strong> City Exploration Break (cafes, parks, mental reset)<br>
                <strong>2:00 PM - 5:00 PM:</strong> Skill Development + Sports (courses, tennis, swimming)
            </div>
            
            <div class="features">
                <div class="feature-card">
                    <h3>💼 Focused Job Search</h3>
                    <p>3-hour daily sprints for applications, networking, and career development activities.</p>
                </div>
                <div class="feature-card">
                    <h3>🌆 Toronto Exploration</h3>
                    <p>Daily city breaks to explore neighborhoods, cafes, and prevent isolation.</p>
                </div>
                <div class="feature-card">
                    <h3>📈 Skill Development</h3>
                    <p>Dedicated time for courses, certifications, and professional growth.</p>
                </div>
                <div class="feature-card">
                    <h3>🎾 Active Lifestyle</h3>
                    <p>Tennis, swimming, padel, golf integrated into afternoon schedule.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    '''

@app.route('/working-kevin/schedule')
def working_kevin_schedule():
    """Generate and display working Kevin schedule with UI"""
    schedule = working_generator.generate_adaptive_schedule()
    
    # Generate HTML for the schedule
    schedule_html = ""
    for day, activities in schedule.items():
        schedule_html += f'<div class="day-section"><h3>{day}</h3>'
        for activity in activities:
            cost_display = f"${activity.cost}" if activity.cost > 0 else "Free"
            category_color = {
                'individual': '#28a745',
                'networking': '#007bff', 
                'couple': '#dc3545',
                'fitness': '#fd7e14',
                'work': '#6c757d'
            }.get(activity.category, '#6c757d')
            
            schedule_html += f'''
            <div class="activity-card" style="border-left: 4px solid {category_color};">
                <div class="activity-time">{activity.time}</div>
                <div class="activity-name">{activity.activity}</div>
                <div class="activity-details">
                    📍 {activity.location} • {cost_display} • {activity.category}
                </div>
                <div class="activity-description">{activity.description}</div>
            </div>
            '''
        schedule_html += '</div>'
    
    return f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Working Kevin - Generated Schedule</title>
        <style>
            body {{ 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
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
                background: #007bff;
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: bold;
                margin-left: 10px;
            }}
            .nav-link:hover {{
                background: #0056b3;
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
            .day-section {{
                margin: 30px 0;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 10px;
                border-left: 4px solid #28a745;
            }}
            .day-section h3 {{
                margin: 0 0 20px 0;
                color: #28a745;
                font-size: 1.5em;
            }}
            .activity-card {{
                background: white;
                margin: 10px 0;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }}
            .activity-time {{
                font-weight: bold;
                color: #495057;
                font-size: 0.9em;
            }}
            .activity-name {{
                font-size: 1.2em;
                font-weight: bold;
                color: #212529;
                margin: 5px 0;
            }}
            .activity-details {{
                color: #6c757d;
                font-size: 0.9em;
                margin: 5px 0;
            }}
            .activity-description {{
                color: #495057;
                font-size: 0.9em;
                font-style: italic;
                margin-top: 8px;
            }}
            .export-btn {{
                background: #28a745;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                text-decoration: none;
                display: inline-block;
                margin: 10px 0;
                font-weight: bold;
                cursor: pointer;
            }}
            .export-btn:hover {{
                background: #218838;
                text-decoration: none;
                color: white;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>💼 Working Kevin - Your Generated Schedule</h1>
            <div>
                <a href="/working-kevin" class="nav-link">← Back to Dashboard</a>
                <a href="/job-search-kevin" class="nav-link">🚀 Job Search Kevin</a>
                <a href="/" class="nav-link">🏠 Home</a>
            </div>
        </div>
        
        <div class="content">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2>🗓️ Your Personalized Weekly Schedule</h2>
                <p>Generated with fitness variety, meaningful networking, and structured personal development</p>
                <button onclick="window.print()" class="export-btn">🖨️ Print Schedule</button>
                <button onclick="location.reload()" class="export-btn">🔄 Generate New Schedule</button>
            </div>
            
            {schedule_html}
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #e9ecef; border-radius: 10px;">
                <h3>🎯 Schedule Features</h3>
                <p><strong>🏊‍♂️ Fitness Variety:</strong> Swimming, tennis, running with round-robin rotation</p>
                <p><strong>🌐 Meaningful Networking:</strong> Professional and cultural events</p>
                <p><strong>💑 Relationship Focus:</strong> Quality couple time with Peter</p>
                <p><strong>📚 Personal Development:</strong> 7 Habits morning routine integrated</p>
            </div>
        </div>
    </body>
    </html>
    '''

@app.route('/job-search-kevin/schedule')
def job_search_kevin_schedule():
    """Generate and display job search Kevin schedule with UI"""
    schedule = jobsearch_generator.generate_job_search_schedule()
    
    # Generate HTML for the schedule
    schedule_html = ""
    for day, activities in schedule.items():
        schedule_html += f'<div class="day-section"><h3>{day}</h3>'
        for activity in activities:
            cost_display = f"${activity.cost}" if activity.cost > 0 else "Free"
            category_color = {
                'career_development': '#007bff',
                'personal_wellness': '#20c997',
                'professional_development': '#6f42c1',
                'fitness': '#fd7e14',
                'personal_development': '#28a745',
                'couple': '#dc3545'
            }.get(activity.category, '#6c757d')
            
            schedule_html += f'''
            <div class="activity-card" style="border-left: 4px solid {category_color};">
                <div class="activity-time">{activity.time}</div>
                <div class="activity-name">{activity.activity}</div>
                <div class="activity-details">
                    📍 {activity.location} • {cost_display} • {activity.category}
                </div>
                <div class="activity-description">{activity.description}</div>
            </div>
            '''
        schedule_html += '</div>'
    
    return f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Job Search Kevin - Generated Schedule</title>
        <style>
            body {{ 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #007bff 0%, #6f42c1 100%);
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
                background: #28a745;
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: bold;
                margin-left: 10px;
            }}
            .nav-link:hover {{
                background: #218838;
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
            .day-section {{
                margin: 30px 0;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 10px;
                border-left: 4px solid #007bff;
            }}
            .day-section h3 {{
                margin: 0 0 20px 0;
                color: #007bff;
                font-size: 1.5em;
            }}
            .activity-card {{
                background: white;
                margin: 10px 0;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }}
            .activity-time {{
                font-weight: bold;
                color: #495057;
                font-size: 0.9em;
            }}
            .activity-name {{
                font-size: 1.2em;
                font-weight: bold;
                color: #212529;
                margin: 5px 0;
            }}
            .activity-details {{
                color: #6c757d;
                font-size: 0.9em;
                margin: 5px 0;
            }}
            .activity-description {{
                color: #495057;
                font-size: 0.9em;
                font-style: italic;
                margin-top: 8px;
            }}
            .export-btn {{
                background: #007bff;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                text-decoration: none;
                display: inline-block;
                margin: 10px 0;
                font-weight: bold;
                cursor: pointer;
            }}
            .export-btn:hover {{
                background: #0056b3;
                text-decoration: none;
                color: white;
            }}
            .schedule-highlight {{
                background: linear-gradient(45deg, #007bff, #6f42c1);
                color: white;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                text-align: center;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚀 Job Search Kevin - Your Generated Schedule</h1>
            <div>
                <a href="/job-search-kevin" class="nav-link">← Back to Dashboard</a>
                <a href="/working-kevin" class="nav-link">💼 Working Kevin</a>
                <a href="/" class="nav-link">🏠 Home</a>
            </div>
        </div>
        
        <div class="content">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2>🎯 Your Career Transition Schedule</h2>
                <p>Optimized for job searching, skill development, and maintaining well-being</p>
                <button onclick="window.print()" class="export-btn">🖨️ Print Schedule</button>
                <button onclick="location.reload()" class="export-btn">🔄 Generate New Schedule</button>
            </div>
            
            <div class="schedule-highlight">
                <h3>📋 Daily Structure</h3>
                <strong>9:00 AM - 12:00 PM:</strong> Job Search Sprint (applications, networking, research)<br>
                <strong>12:00 PM - 2:00 PM:</strong> City Exploration Break (cafes, parks, mental reset)<br>
                <strong>2:00 PM - 5:00 PM:</strong> Skill Development + Sports (courses, tennis, swimming)
            </div>
            
            {schedule_html}
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #e9ecef; border-radius: 10px;">
                <h3>🎯 Job Search Schedule Features</h3>
                <p><strong>💼 Focused Career Work:</strong> 3-hour daily sprints for maximum productivity</p>
                <p><strong>🌆 Mental Health Breaks:</strong> Toronto exploration to prevent isolation</p>
                <p><strong>📈 Skill Development:</strong> Dedicated time for courses and certifications</p>
                <p><strong>🎾 Active Lifestyle:</strong> Sports and fitness integrated into afternoons</p>
            </div>
        </div>
    </body>
    </html>
    '''

@app.route('/working-kevin/sliders')
def working_kevin_sliders():
    """Redirect to the slider interface"""
    return redirect("http://localhost:8080")

# UNIFIED CALENDAR VIEWS - Same frontend, different data sources
@app.route('/calendar/daily')
def unified_daily_calendar():
    """Unified daily calendar view for both Kevin versions"""
    kevin_type = request.args.get('kevin_type', 'working')
    
    # Get data from appropriate generator
    if kevin_type == 'jobsearch':
        schedule = jobsearch_generator.generate_job_search_schedule()
        title = "🚀 Job Search Kevin - Daily Calendar"
        back_link = "/job-search-kevin"
        other_link = "/calendar/daily?kevin_type=working"
        other_label = "💼 Working Kevin"
    else:
        schedule = working_generator.generate_adaptive_schedule()
        title = "💼 Working Kevin - Daily Calendar"
        back_link = "/working-kevin"
        other_link = "/calendar/daily?kevin_type=jobsearch"
        other_label = "🚀 Job Search Kevin"
    
    # Get today's date
    today = datetime.now().date()
    today_activities = []
    
    # Find today's activities
    for day_key, activities in schedule.items():
        if today.strftime("%A") in day_key:
            today_activities = activities
            break
    
    # Generate enhanced activity HTML
    activities_html = ""
    for activity in today_activities:
        cost_display = f"${activity.cost}" if activity.cost > 0 else "Free"
        category_color = {
            'individual': '#28a745', 'networking': '#007bff', 'couple': '#dc3545',
            'fitness': '#fd7e14', 'work': '#6c757d', 'career_development': '#007bff',
            'personal_wellness': '#20c997', 'professional_development': '#6f42c1',
            'personal_development': '#28a745'
        }.get(activity.category, '#6c757d')
        
        # Get activity type tag
        activity_tag = get_activity_type_tag(activity)
        
        # Get website and instructions
        website_info = get_activity_website_and_instructions(activity)
        
        # Generate networking rating stars
        networking_stars = "⭐" * min(activity.networking_potential, 5) if activity.networking_potential > 0 else "No networking"
        
        activities_html += f'''
        <div class="calendar-event" style="border-left: 4px solid {category_color};">
            <div class="activity-tag" style="background-color: {activity_tag['color']};">
                {activity_tag['tag']}
            </div>
            <div class="event-time">{activity.time}</div>
            <div class="event-title">{activity.activity}</div>
            <div class="event-details">
                <span>📍 {activity.location}</span>
                <span>💰 {cost_display}</span>
                <span class="networking-rating">🤝 {networking_stars}</span>
            </div>
            <div class="event-description">{activity.description}</div>
            <div class="event-website">
                <a href="{website_info['website']}" target="_blank">📖 Visit Website & Learn More</a>
            </div>
            <div class="event-instructions">
                <div class="instructions-label">How To Prepare:</div>
                {website_info['instructions']}
            </div>
        </div>
        '''
    
    styles = get_calendar_styles(kevin_type)
    
    return f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>{title}</title>
        {styles}
    </head>
    <body>
        <div class="header">
            <h1>📅 {title}</h1>
            <div>
                <a href="{back_link}" class="nav-link">← Back to Dashboard</a>
                <a href="{other_link}" class="nav-link">{other_label}</a>
                <a href="/" class="nav-link">🏠 Home</a>
            </div>
        </div>
        
        <div class="content">
            <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
                <h2>📅 {today.strftime("%A, %B %d, %Y")}</h2>
                <p>Your detailed daily schedule with enhanced activity information</p>
            </div>
            
            <div class="calendar-nav">
                <a href="/calendar/daily?kevin_type={kevin_type}">📅 Daily</a>
                <a href="/calendar/weekly?kevin_type={kevin_type}">📊 Weekly</a>
                <a href="/calendar/monthly?kevin_type={kevin_type}">🗓️ Monthly</a>
            </div>
            
            <div class="daily-schedule">
                {activities_html}
            </div>
        </div>
    </body>
    </html>
    '''

@app.route('/calendar/weekly')
def unified_weekly_calendar():
    """Unified weekly calendar view for both Kevin versions"""
    kevin_type = request.args.get('kevin_type', 'working')
    
    # Get data from appropriate generator
    if kevin_type == 'jobsearch':
        schedule = jobsearch_generator.generate_job_search_schedule()
        title = "🚀 Job Search Kevin - Weekly Calendar"
        back_link = "/job-search-kevin"
        other_link = "/calendar/weekly?kevin_type=working"
        other_label = "💼 Working Kevin"
    else:
        schedule = working_generator.generate_adaptive_schedule()
        title = "💼 Working Kevin - Weekly Calendar"
        back_link = "/working-kevin"
        other_link = "/calendar/weekly?kevin_type=jobsearch"
        other_label = "🚀 Job Search Kevin"
    
    weekly_html = generate_weekly_calendar_html(schedule, kevin_type)
    styles = get_calendar_styles(kevin_type)
    
    return f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>{title}</title>
        {styles}
    </head>
    <body>
        <div class="header">
            <h1>📊 {title}</h1>
            <div>
                <a href="{back_link}" class="nav-link">← Back to Dashboard</a>
                <a href="{other_link}" class="nav-link">{other_label}</a>
                <a href="/" class="nav-link">🏠 Home</a>
            </div>
        </div>
        
        <div class="content">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2>📊 Your Weekly Overview</h2>
                <p>7-day schedule from 6 AM to midnight with all activities</p>
            </div>
            
            <div class="calendar-nav">
                <a href="/calendar/daily?kevin_type={kevin_type}">📅 Daily</a>
                <a href="/calendar/weekly?kevin_type={kevin_type}">📊 Weekly</a>
                <a href="/calendar/monthly?kevin_type={kevin_type}">🗓️ Monthly</a>
            </div>
            
            {weekly_html}
        </div>
    </body>
    </html>
    '''

@app.route('/calendar/monthly')
def unified_monthly_calendar():
    """Unified monthly calendar view for both Kevin versions"""
    kevin_type = request.args.get('kevin_type', 'working')
    
    # Get data from appropriate generator
    if kevin_type == 'jobsearch':
        schedule = jobsearch_generator.generate_job_search_schedule()
        title = "🚀 Job Search Kevin - Monthly Calendar"
        back_link = "/job-search-kevin"
        other_link = "/calendar/monthly?kevin_type=working"
        other_label = "💼 Working Kevin"
    else:
        schedule = working_generator.generate_adaptive_schedule()
        title = "💼 Working Kevin - Monthly Calendar"
        back_link = "/working-kevin"
        other_link = "/calendar/monthly?kevin_type=jobsearch"
        other_label = "🚀 Job Search Kevin"
    
    monthly_html = generate_monthly_calendar_html(schedule, kevin_type)
    styles = get_calendar_styles(kevin_type)
    
    return f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>{title}</title>
        {styles}
    </head>
    <body>
        <div class="header">
            <h1>🗓️ {title}</h1>
            <div>
                <a href="{back_link}" class="nav-link">← Back to Dashboard</a>
                <a href="{other_link}" class="nav-link">{other_label}</a>
                <a href="/" class="nav-link">🏠 Home</a>
            </div>
        </div>
        
        <div class="content">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2>🗓️ Your Monthly View</h2>
                <p>Full month overview with activity highlights and type indicators</p>
            </div>
            
            <div class="calendar-nav">
                <a href="/calendar/daily?kevin_type={kevin_type}">📅 Daily</a>
                <a href="/calendar/weekly?kevin_type={kevin_type}">📊 Weekly</a>
                <a href="/calendar/monthly?kevin_type={kevin_type}">🗓️ Monthly</a>
            </div>
            
            {monthly_html}
        </div>
    </body>
    </html>
    '''

# Calendar Views for Working Kevin
@app.route('/working-kevin/calendar/daily')
def working_kevin_daily_calendar():
    """Daily calendar view for Working Kevin"""
    from datetime import datetime, timedelta
    import calendar
    
    # Get today's date or date from query parameter
    today = datetime.now().date()
    
    # Generate today's schedule
    schedule = working_generator.generate_adaptive_schedule()
    today_key = today.strftime("%A, %B %d, %Y")
    today_activities = []
    
    # Find today's activities
    for day_key, activities in schedule.items():
        if today.strftime("%A") in day_key:
            today_activities = activities
            break
    
    # Generate enhanced activity HTML
    activities_html = ""
    for activity in today_activities:
        cost_display = f"${activity.cost}" if activity.cost > 0 else "Free"
        category_color = {
            'individual': '#28a745',
            'networking': '#007bff', 
            'couple': '#dc3545',
            'fitness': '#fd7e14',
            'work': '#6c757d'
        }.get(activity.category, '#6c757d')
        
        # Get activity type tag
        activity_tag = get_activity_type_tag(activity)
        
        # Get website and instructions
        website_info = get_activity_website_and_instructions(activity)
        
        # Generate networking rating stars
        networking_stars = "⭐" * min(activity.networking_potential, 5) if activity.networking_potential > 0 else "No networking"
        
        activities_html += f'''
        <div class="calendar-event" style="border-left: 4px solid {category_color};">
            <div class="activity-tag" style="background-color: {activity_tag['color']};">
                {activity_tag['tag']}
            </div>
            <div class="event-time">{activity.time}</div>
            <div class="event-title">{activity.activity}</div>
            <div class="event-details">
                <span>📍 {activity.location}</span>
                <span>💰 {cost_display}</span>
                <span class="networking-rating">🤝 {networking_stars}</span>
            </div>
            <div class="event-description">{activity.description}</div>
            <div class="event-website">
                <a href="{website_info['website']}" target="_blank">📖 Visit Website & Learn More</a>
            </div>
            <div class="event-instructions">
                <div class="instructions-label">How To Prepare:</div>
                {website_info['instructions']}
            </div>
        </div>
        '''
    
    styles = get_calendar_styles('working')
    
    return f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Working Kevin - Daily Calendar</title>
        {styles}
        <style>
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
                background: #007bff;
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: bold;
                margin-left: 10px;
            }}
            .content {{
                background: white;
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                max-width: 1000px;
                margin: 0 auto;
            }}
            .calendar-header {{
                text-align: center;
                margin-bottom: 30px;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 10px;
                border-left: 4px solid #28a745;
            }}
            .calendar-event {{
                background: #f8f9fa;
                margin: 15px 0;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }}
            .event-time {{
                font-weight: bold;
                color: #495057;
                font-size: 1.1em;
            }}
            .event-title {{
                font-size: 1.3em;
                font-weight: bold;
                color: #212529;
                margin: 8px 0;
            }}
            .event-details {{
                color: #6c757d;
                font-size: 0.9em;
                margin: 5px 0;
            }}
            .event-description {{
                color: #495057;
                font-size: 0.9em;
                font-style: italic;
                margin-top: 8px;
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
        </style>
    </head>
    <body>
        <div class="header">
            <h1>📅 Working Kevin - Daily Calendar</h1>
            <div>
                <a href="/working-kevin" class="nav-link">← Back to Dashboard</a>
                <a href="/job-search-kevin" class="nav-link">🚀 Job Search Kevin</a>
                <a href="/" class="nav-link">🏠 Home</a>
            </div>
        </div>
        
        <div class="content">
            <div class="calendar-header">
                <h2>📅 {today.strftime("%A, %B %d, %Y")}</h2>
                <p>Your detailed daily schedule with all activities</p>
            </div>
            
            <div class="calendar-nav">
                <a href="/working-kevin/calendar/daily">📅 Daily</a>
                <a href="/working-kevin/calendar/weekly">📊 Weekly</a>
                <a href="/working-kevin/calendar/monthly">🗓️ Monthly</a>
            </div>
            
            <div class="daily-schedule">
                {activities_html}
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #e9ecef; border-radius: 10px;">
                <h3>💼 Working Kevin Daily Focus</h3>
                <p><strong>Morning:</strong> 7 Habits routine + Running (Tue/Thu/Fri)</p>
                <p><strong>Work Day:</strong> 9 AM - 6 PM focused work time</p>
                <p><strong>Evening:</strong> Fitness variety + Networking + Couple time</p>
            </div>
        </div>
    </body>
    </html>
    '''

@app.route('/working-kevin/calendar/weekly')
def working_kevin_weekly_calendar():
    """Weekly calendar view for Working Kevin"""
    schedule = working_generator.generate_adaptive_schedule()
    weekly_html = generate_weekly_calendar_html(schedule, 'working')
    styles = get_calendar_styles('working')
    
    return f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Working Kevin - Weekly Calendar</title>
        {styles}
    </head>
    <body>
        <div class="header">
            <h1>📊 Working Kevin - Weekly Calendar</h1>
            <div>
                <a href="/working-kevin" class="nav-link">← Back to Dashboard</a>
                <a href="/job-search-kevin" class="nav-link">🚀 Job Search Kevin</a>
                <a href="/" class="nav-link">🏠 Home</a>
            </div>
        </div>
        
        <div class="content">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2>📊 Your Weekly Overview</h2>
                <p>7-day schedule with all your activities and commitments</p>
            </div>
            
            <div class="calendar-nav">
                <a href="/working-kevin/calendar/daily">📅 Daily</a>
                <a href="/working-kevin/calendar/weekly">📊 Weekly</a>
                <a href="/working-kevin/calendar/monthly">🗓️ Monthly</a>
            </div>
            
            {weekly_html}
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #e9ecef; border-radius: 10px;">
                <h3>💼 Weekly Pattern</h3>
                <p><strong>Weekdays:</strong> Work + Evening fitness/networking</p>
                <p><strong>Weekends:</strong> Tennis, social events, church, couple activities</p>
            </div>
        </div>
    </body>
    </html>
    '''

@app.route('/working-kevin/calendar/monthly')
def working_kevin_monthly_calendar():
    """Monthly calendar view for Working Kevin"""
    schedule = working_generator.generate_adaptive_schedule()
    monthly_html = generate_monthly_calendar_html(schedule, 'working')
    styles = get_calendar_styles('working')
    
    return f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Working Kevin - Monthly Calendar</title>
        {styles}
    </head>
    <body>
        <div class="header">
            <h1>🗓️ Working Kevin - Monthly Calendar</h1>
            <div>
                <a href="/working-kevin" class="nav-link">← Back to Dashboard</a>
                <a href="/job-search-kevin" class="nav-link">🚀 Job Search Kevin</a>
                <a href="/" class="nav-link">🏠 Home</a>
            </div>
        </div>
        
        <div class="content">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2>🗓️ Your Monthly View</h2>
                <p>Full month overview with activity highlights</p>
            </div>
            
            <div class="calendar-nav">
                <a href="/working-kevin/calendar/daily">📅 Daily</a>
                <a href="/working-kevin/calendar/weekly">📊 Weekly</a>
                <a href="/working-kevin/calendar/monthly">🗓️ Monthly</a>
            </div>
            
            {monthly_html}
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #e9ecef; border-radius: 10px;">
                <h3>💼 Monthly Goals</h3>
                <p><strong>Fitness:</strong> Swimming, tennis, running variety</p>
                <p><strong>Personal:</strong> 7 Habits daily practice</p>
                <p><strong>Relationship:</strong> Regular couple activities</p>
                <p><strong>Career:</strong> Consistent work schedule + networking</p>
            </div>
        </div>
    </body>
    </html>
    '''

# Job Search Kevin Calendar Views
@app.route('/job-search-kevin/calendar/daily')
def job_search_kevin_daily_calendar():
    """Daily calendar view for Job Search Kevin"""
    from datetime import datetime, timedelta
    
    # Get today's date
    today = datetime.now().date()
    
    # Generate today's schedule
    schedule = jobsearch_generator.generate_job_search_schedule()
    today_activities = []
    
    # Find today's activities
    for day_key, activities in schedule.items():
        if today.strftime("%A") in day_key:
            today_activities = activities
            break
    
    # Generate enhanced activity HTML
    activities_html = ""
    for activity in today_activities:
        cost_display = f"${activity.cost}" if activity.cost > 0 else "Free"
        category_color = {
            'career_development': '#007bff',
            'personal_wellness': '#20c997',
            'professional_development': '#6f42c1',
            'fitness': '#fd7e14',
            'personal_development': '#28a745',
            'couple': '#dc3545'
        }.get(activity.category, '#6c757d')
        
        # Get activity type tag
        activity_tag = get_activity_type_tag(activity)
        
        # Get website and instructions
        website_info = get_activity_website_and_instructions(activity)
        
        # Generate networking rating stars
        networking_stars = "⭐" * min(activity.networking_potential, 5) if activity.networking_potential > 0 else "No networking"
        
        activities_html += f'''
        <div class="calendar-event" style="border-left: 4px solid {category_color};">
            <div class="activity-tag" style="background-color: {activity_tag['color']};">
                {activity_tag['tag']}
            </div>
            <div class="event-time">{activity.time}</div>
            <div class="event-title">{activity.activity}</div>
            <div class="event-details">
                <span>📍 {activity.location}</span>
                <span>💰 {cost_display}</span>
                <span class="networking-rating">🤝 {networking_stars}</span>
            </div>
            <div class="event-description">{activity.description}</div>
            <div class="event-website">
                <a href="{website_info['website']}" target="_blank">📖 Visit Website & Learn More</a>
            </div>
            <div class="event-instructions">
                <div class="instructions-label">How To Prepare:</div>
                {website_info['instructions']}
            </div>
        </div>
        '''
    
    styles = get_calendar_styles('jobsearch')
    
    return f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Job Search Kevin - Daily Calendar</title>
        {styles}
    </head>
    <body>
        <div class="header">
            <h1>📅 Job Search Kevin - Daily Calendar</h1>
            <div>
                <a href="/job-search-kevin" class="nav-link">← Back to Dashboard</a>
                <a href="/working-kevin" class="nav-link">💼 Working Kevin</a>
                <a href="/" class="nav-link">🏠 Home</a>
            </div>
        </div>
        
        <div class="content">
            <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(45deg, #007bff, #6f42c1); color: white; border-radius: 10px;">
                <h2>📅 {today.strftime("%A, %B %d, %Y")}</h2>
                <p>Your career transition focused daily schedule</p>
            </div>
            
            <div class="calendar-nav">
                <a href="/job-search-kevin/calendar/daily">📅 Daily</a>
                <a href="/job-search-kevin/calendar/weekly">📊 Weekly</a>
                <a href="/job-search-kevin/calendar/monthly">🗓️ Monthly</a>
            </div>
            
            <div class="daily-schedule">
                {activities_html}
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #e9ecef; border-radius: 10px;">
                <h3>🚀 Job Search Daily Focus</h3>
                <p><strong>Morning Sprint:</strong> 9 AM - 12 PM focused job search work</p>
                <p><strong>City Break:</strong> 12 PM - 2 PM exploration and mental reset</p>
                <p><strong>Skill Building:</strong> 2 PM - 5 PM development + sports</p>
            </div>
        </div>
    </body>
    </html>
    '''

@app.route('/job-search-kevin/calendar/weekly')
def job_search_kevin_weekly_calendar():
    """Weekly calendar view for Job Search Kevin"""
    schedule = jobsearch_generator.generate_job_search_schedule()
    weekly_html = generate_weekly_calendar_html(schedule, 'jobsearch')
    styles = get_calendar_styles('jobsearch')
    
    return f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Job Search Kevin - Weekly Calendar</title>
        {styles}
    </head>
    <body>
        <div class="header">
            <h1>📊 Job Search Kevin - Weekly Calendar</h1>
            <div>
                <a href="/job-search-kevin" class="nav-link">← Back to Dashboard</a>
                <a href="/working-kevin" class="nav-link">💼 Working Kevin</a>
                <a href="/" class="nav-link">🏠 Home</a>
            </div>
        </div>
        
        <div class="content">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2>📊 Your Career Transition Week</h2>
                <p>7-day overview of job search, skills, and personal activities</p>
            </div>
            
            <div class="calendar-nav">
                <a href="/job-search-kevin/calendar/daily">📅 Daily</a>
                <a href="/job-search-kevin/calendar/weekly">📊 Weekly</a>
                <a href="/job-search-kevin/calendar/monthly">🗓️ Monthly</a>
            </div>
            
            {weekly_html}
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #e9ecef; border-radius: 10px;">
                <h3>🚀 Weekly Structure</h3>
                <p><strong>Weekdays:</strong> Job search + City exploration + Skills</p>
                <p><strong>Weekends:</strong> Social activities, church, family time</p>
            </div>
        </div>
    </body>
    </html>
    '''

@app.route('/job-search-kevin/calendar/monthly')
def job_search_kevin_monthly_calendar():
    """Monthly calendar view for Job Search Kevin"""
    schedule = jobsearch_generator.generate_job_search_schedule()
    monthly_html = generate_monthly_calendar_html(schedule, 'jobsearch')
    styles = get_calendar_styles('jobsearch')
    
    return f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Job Search Kevin - Monthly Calendar</title>
        {styles}
    </head>
    <body>
        <div class="header">
            <h1>🗓️ Job Search Kevin - Monthly Calendar</h1>
            <div>
                <a href="/job-search-kevin" class="nav-link">← Back to Dashboard</a>
                <a href="/working-kevin" class="nav-link">💼 Working Kevin</a>
                <a href="/" class="nav-link">🏠 Home</a>
            </div>
        </div>
        
        <div class="content">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2>🗓️ Your Career Transition Month</h2>
                <p>Full month view of your job search journey</p>
            </div>
            
            <div class="calendar-nav">
                <a href="/job-search-kevin/calendar/daily">📅 Daily</a>
                <a href="/job-search-kevin/calendar/weekly">📊 Weekly</a>
                <a href="/job-search-kevin/calendar/monthly">🗓️ Monthly</a>
            </div>
            
            {monthly_html}
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #e9ecef; border-radius: 10px;">
                <h3>🚀 Monthly Career Goals</h3>
                <p><strong>Job Search:</strong> Daily applications and networking</p>
                <p><strong>Skills:</strong> Continuous learning and development</p>
                <p><strong>Wellness:</strong> City exploration and fitness</p>
                <p><strong>Balance:</strong> Maintaining relationships and personal time</p>
            </div>
        </div>
    </body>
    </html>
    '''

@app.route('/job-search-kevin/activities')
def job_search_kevin_activities():
    """Display available activities for job search Kevin"""
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Job Search Kevin - Activities</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #007bff 0%, #6f42c1 100%);
                margin: 0;
                padding: 20px;
                min-height: 100vh;
            }
            .header {
                background: white;
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .nav-link {
                background: #28a745;
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: bold;
                margin-left: 10px;
            }
            .nav-link:hover {
                background: #218838;
                text-decoration: none;
                color: white;
            }
            .content {
                background: white;
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            .activity-section {
                margin: 30px 0;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 10px;
                border-left: 4px solid #007bff;
            }
            .activity-list {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 15px;
                margin-top: 15px;
            }
            .activity-item {
                background: white;
                padding: 15px;
                border-radius: 8px;
                border-left: 3px solid #007bff;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🎯 Job Search Kevin - Activities</h1>
            <div>
                <a href="/job-search-kevin" class="nav-link">← Back to Dashboard</a>
                <a href="/working-kevin" class="nav-link">💼 Working Kevin</a>
                <a href="/" class="nav-link">🏠 Home</a>
            </div>
        </div>
        
        <div class="content">
            <h2>Your Job Search Activity Categories</h2>
            
            <div class="activity-section">
                <h3>💼 Job Search Sprint Activities (9:00 AM - 12:00 PM)</h3>
                <div class="activity-list">
                    <div class="activity-item">
                        <strong>Resume & Portfolio Updates</strong><br>
                        <small>Tailoring applications for specific roles</small>
                    </div>
                    <div class="activity-item">
                        <strong>Job Applications (5-10 targeted)</strong><br>
                        <small>Quality over quantity approach</small>
                    </div>
                    <div class="activity-item">
                        <strong>LinkedIn Networking & Outreach</strong><br>
                        <small>Building professional connections</small>
                    </div>
                    <div class="activity-item">
                        <strong>Company Research & Prep</strong><br>
                        <small>Understanding target employers</small>
                    </div>
                    <div class="activity-item">
                        <strong>Interview Practice & Skills</strong><br>
                        <small>Behavioral and technical prep</small>
                    </div>
                    <div class="activity-item">
                        <strong>Industry Research & Trends</strong><br>
                        <small>Staying current with market</small>
                    </div>
                </div>
            </div>
            
            <div class="activity-section">
                <h3>🌆 City Exploration Break (12:00 PM - 2:00 PM)</h3>
                <div class="activity-list">
                    <div class="activity-item">
                        <strong>New Cafe Discovery</strong><br>
                        <small>Downtown Toronto exploration</small>
                    </div>
                    <div class="activity-item">
                        <strong>High Park Walking</strong><br>
                        <small>Nature break and exercise</small>
                    </div>
                    <div class="activity-item">
                        <strong>Harbourfront Centre</strong><br>
                        <small>Cultural and waterfront exploration</small>
                    </div>
                    <div class="activity-item">
                        <strong>Distillery District</strong><br>
                        <small>Historic area coffee and walk</small>
                    </div>
                    <div class="activity-item">
                        <strong>Queen Street West</strong><br>
                        <small>Neighborhood exploration</small>
                    </div>
                    <div class="activity-item">
                        <strong>Toronto Islands Ferry</strong><br>
                        <small>Ferry ride and island walk</small>
                    </div>
                </div>
            </div>
            
            <div class="activity-section">
                <h3>📚 Skill Development (2:00 PM - 4:00 PM)</h3>
                <div class="activity-list">
                    <div class="activity-item">
                        <strong>Data Science Courses</strong><br>
                        <small>Coursera, edX, online learning</small>
                    </div>
                    <div class="activity-item">
                        <strong>Python/R Programming</strong><br>
                        <small>Hands-on coding practice</small>
                    </div>
                    <div class="activity-item">
                        <strong>Machine Learning Projects</strong><br>
                        <small>Portfolio development</small>
                    </div>
                    <div class="activity-item">
                        <strong>Technical Interview Prep</strong><br>
                        <small>Coding challenges and algorithms</small>
                    </div>
                    <div class="activity-item">
                        <strong>Industry Certifications</strong><br>
                        <small>Professional credentials</small>
                    </div>
                    <div class="activity-item">
                        <strong>Online Workshops</strong><br>
                        <small>Live learning opportunities</small>
                    </div>
                </div>
            </div>
            
            <div class="activity-section">
                <h3>🎾 Sports & Fitness (4:00 PM - 5:00 PM)</h3>
                <div class="activity-list">
                    <div class="activity-item">
                        <strong>Swimming</strong><br>
                        <small>Masters classes at various pools</small>
                    </div>
                    <div class="activity-item">
                        <strong>Tennis</strong><br>
                        <small>Lessons with different coaches</small>
                    </div>
                    <div class="activity-item">
                        <strong>Padel</strong><br>
                        <small>Growing sport in Toronto</small>
                    </div>
                    <div class="activity-item">
                        <strong>Golf Practice</strong><br>
                        <small>Range sessions and putting</small>
                    </div>
                    <div class="activity-item">
                        <strong>Running</strong><br>
                        <small>Half-marathon training</small>
                    </div>
                    <div class="activity-item">
                        <strong>Gym Workouts</strong><br>
                        <small>Strength and conditioning</small>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    '''

if __name__ == '__main__':
    print("🎯 DUAL KEVIN LIFEPLANNER STARTING...")
    print("=" * 50)
    print("🌐 Main Dashboard: http://localhost:8082")
    print("💼 Working Kevin: http://localhost:8082/working-kevin")
    print("🚀 Job Search Kevin: http://localhost:8082/job-search-kevin")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=8082, debug=True)
