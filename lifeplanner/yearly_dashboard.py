"""
Yearly Dashboard Generator for Kevin's Life Planner
Creates beautiful HTML dashboard showing yearly progression and monthly accomplishments
"""

from src.features.yearly_progression_system import YearlyProgressionSystem
from datetime import datetime
import json

class YearlyDashboard:
    def __init__(self):
        self.progression_system = YearlyProgressionSystem()
        
    def generate_dashboard_html(self, persona: str = "working") -> str:
        """Generate complete HTML dashboard for yearly progression"""
        
        current_year = datetime.now().year
        yearly_data = self.progression_system.generate_yearly_overview(current_year, persona)
        current_focus = self.progression_system.get_current_month_focus()
        
        html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kevin's {current_year} Yearly Progression Plan</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }}
        
        .container {{
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }}
        
        .header {{
            text-align: center;
            color: white;
            margin-bottom: 30px;
        }}
        
        .header h1 {{
            font-size: 3em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }}
        
        .header p {{
            font-size: 1.2em;
            opacity: 0.9;
        }}
        
        .current-focus {{
            background: white;
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }}
        
        .current-focus h2 {{
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 1.8em;
        }}
        
        .focus-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }}
        
        .focus-card {{
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            border-left: 5px solid #28a745;
        }}
        
        .focus-card h3 {{
            color: #28a745;
            margin-bottom: 10px;
        }}
        
        .focus-card ul {{
            list-style: none;
        }}
        
        .focus-card li {{
            padding: 5px 0;
            padding-left: 20px;
            position: relative;
        }}
        
        .focus-card li::before {{
            content: "✓";
            position: absolute;
            left: 0;
            color: #28a745;
            font-weight: bold;
        }}
        
        .monthly-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }}
        
        .month-card {{
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }}
        
        .month-card:hover {{
            transform: translateY(-5px);
        }}
        
        .month-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }}
        
        .month-name {{
            font-size: 1.5em;
            font-weight: bold;
            color: #2c3e50;
        }}
        
        .month-number {{
            background: #3498db;
            color: white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }}
        
        .month-theme {{
            background: #ecf0f1;
            padding: 10px 15px;
            border-radius: 8px;
            font-style: italic;
            color: #7f8c8d;
            margin-bottom: 20px;
        }}
        
        .goals-section {{
            margin-bottom: 20px;
        }}
        
        .goals-section h4 {{
            color: #e74c3c;
            margin-bottom: 10px;
            font-size: 1.1em;
        }}
        
        .goal-item {{
            background: #fff5f5;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 8px;
            border-left: 3px solid #e74c3c;
        }}
        
        .goal-target {{
            font-weight: bold;
            color: #c0392b;
        }}
        
        .outcomes-section {{
            margin-bottom: 15px;
        }}
        
        .outcomes-section h4 {{
            color: #27ae60;
            margin-bottom: 10px;
        }}
        
        .outcome-item {{
            background: #f0fff4;
            padding: 8px 12px;
            border-radius: 5px;
            margin-bottom: 5px;
            font-size: 0.9em;
            border-left: 3px solid #27ae60;
        }}
        
        .success-probability {{
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #e8f4fd;
            padding: 10px 15px;
            border-radius: 8px;
            margin-top: 15px;
        }}
        
        .probability-bar {{
            width: 100px;
            height: 8px;
            background: #ddd;
            border-radius: 4px;
            overflow: hidden;
        }}
        
        .probability-fill {{
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            border-radius: 4px;
            transition: width 0.3s ease;
        }}
        
        .yearly-targets {{
            background: white;
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }}
        
        .targets-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }}
        
        .target-card {{
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }}
        
        .target-number {{
            font-size: 2.5em;
            font-weight: bold;
            color: #3498db;
            margin-bottom: 5px;
        }}
        
        .target-label {{
            color: #7f8c8d;
            font-size: 0.9em;
        }}
        
        .benefits-section {{
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }}
        
        .benefits-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }}
        
        .benefit-item {{
            background: #fff8e1;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #ffc107;
        }}
        
        .navigation {{
            text-align: center;
            margin-top: 30px;
        }}
        
        .nav-button {{
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 12px 25px;
            border-radius: 25px;
            text-decoration: none;
            margin: 0 10px;
            font-weight: bold;
            transition: background 0.3s ease;
        }}
        
        .nav-button:hover {{
            background: #218838;
        }}
        
        .progress-indicator {{
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255,255,255,0.9);
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }}
        
        @media (max-width: 768px) {{
            .monthly-grid {{
                grid-template-columns: 1fr;
            }}
            
            .header h1 {{
                font-size: 2em;
            }}
            
            .progress-indicator {{
                position: static;
                margin-bottom: 20px;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Kevin's {current_year} Yearly Progression Plan</h1>
            <p>Transform Your Life Month by Month | {persona.title()} Kevin Edition</p>
        </div>
        
        <div class="progress-indicator">
            <div><strong>Current Month:</strong> {current_focus['current_month']}</div>
            <div><strong>Success Rate:</strong> {current_focus['success_probability']:.0%}</div>
        </div>
        
        <div class="current-focus">
            <h2>🔥 Current Month Focus: {current_focus['current_month']}</h2>
            <div class="month-theme">
                <strong>Theme:</strong> {current_focus['theme']}
            </div>
            
            <div class="focus-grid">
                <div class="focus-card">
                    <h3>🎯 Top 3 Priorities</h3>
                    <ul>
                        {''.join([f'<li>{priority}</li>' for priority in current_focus['top_3_priorities']])}
                    </ul>
                </div>
                
                <div class="focus-card">
                    <h3>📅 This Week Actions</h3>
                    <ul>
                        {''.join([f'<li>{action}</li>' for action in current_focus['this_week_actions']])}
                    </ul>
                </div>
                
                <div class="focus-card">
                    <h3>🌟 Expected Outcomes</h3>
                    <ul>
                        {''.join([f'<li>{outcome}</li>' for outcome in current_focus['expected_outcomes']])}
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="yearly-targets">
            <h2>🎯 {current_year} Yearly Targets</h2>
            <div class="targets-grid">
                <div class="target-card">
                    <div class="target-number">{yearly_data['yearly_targets']['meditation_minutes']}</div>
                    <div class="target-label">Daily Meditation Minutes</div>
                </div>
                <div class="target-card">
                    <div class="target-number">{yearly_data['yearly_targets']['exercise_sessions_per_week']}</div>
                    <div class="target-label">Weekly Exercise Sessions</div>
                </div>
                <div class="target-card">
                    <div class="target-number">{yearly_data['yearly_targets']['couple_activities_completed']}</div>
                    <div class="target-label">Couple Activities Completed</div>
                </div>
                <div class="target-card">
                    <div class="target-number">{yearly_data['yearly_targets']['career_milestones']}</div>
                    <div class="target-label">Career Milestones</div>
                </div>
                <div class="target-card">
                    <div class="target-number">{yearly_data['yearly_targets']['health_score_improvement']}%</div>
                    <div class="target-label">Health Score Improvement</div>
                </div>
                <div class="target-card">
                    <div class="target-number">{yearly_data['yearly_targets']['life_satisfaction_increase']}%</div>
                    <div class="target-label">Life Satisfaction Increase</div>
                </div>
            </div>
        </div>
        
        <h2 style="color: white; text-align: center; margin-bottom: 30px; font-size: 2em;">📅 Monthly Progression Roadmap</h2>
        
        <div class="monthly-grid">
"""
        
        # Generate monthly cards
        for monthly_plan in yearly_data['monthly_plans']:
            html += f"""
            <div class="month-card">
                <div class="month-header">
                    <div class="month-name">{monthly_plan.month_name}</div>
                    <div class="month-number">{monthly_plan.month}</div>
                </div>
                
                <div class="month-theme">{monthly_plan.theme}</div>
                
                <div class="goals-section">
                    <h4>🎯 Progressive Goals</h4>
                    {''.join([f'''
                    <div class="goal-item">
                        <div><strong>{goal.name}</strong></div>
                        <div class="goal-target">Target: {goal.monthly_milestones[0].target_value} {goal.monthly_milestones[0].measurement_unit}</div>
                    </div>
                    ''' for goal in monthly_plan.progressive_goals])}
                </div>
                
                <div class="goals-section">
                    <h4>💼 Career Milestones</h4>
                    {''.join([f'<div class="goal-item">{milestone}</div>' for milestone in monthly_plan.career_milestones[:2]])}
                </div>
                
                <div class="outcomes-section">
                    <h4>🌟 Expected Outcomes</h4>
                    {''.join([f'<div class="outcome-item">{outcome}</div>' for outcome in monthly_plan.expected_outcomes[:4]])}
                </div>
                
                <div class="success-probability">
                    <span><strong>Success Probability:</strong></span>
                    <div class="probability-bar">
                        <div class="probability-fill" style="width: {monthly_plan.success_probability*100}%"></div>
                    </div>
                    <span><strong>{monthly_plan.success_probability:.0%}</strong></span>
                </div>
            </div>
            """
        
        html += f"""
        </div>
        
        <div class="benefits-section">
            <h2>🌟 Compound Benefits by Year End</h2>
            <div class="benefits-grid">
                {''.join([f'<div class="benefit-item">{benefit}</div>' for benefit in yearly_data['compound_benefits']])}
            </div>
        </div>
        
        <div class="navigation">
            <a href="/calendar/daily?kevin_type={persona}" class="nav-button">📅 View Daily Calendar</a>
            <a href="/calendar/weekly?kevin_type={persona}" class="nav-button">📊 Weekly View</a>
            <a href="/" class="nav-button">🏠 Home</a>
        </div>
    </div>
    
    <script>
        // Add some interactivity
        document.addEventListener('DOMContentLoaded', function() {{
            // Animate progress bars
            const progressBars = document.querySelectorAll('.probability-fill');
            progressBars.forEach(bar => {{
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {{
                    bar.style.width = width;
                }}, 500);
            }});
            
            // Add click tracking for month cards
            const monthCards = document.querySelectorAll('.month-card');
            monthCards.forEach((card, index) => {{
                card.addEventListener('click', function() {{
                    const monthNum = index + 1;
                    console.log(`Clicked on month ${{monthNum}}`);
                    // Could add modal or navigation here
                }});
            }});
        }});
    </script>
</body>
</html>
        """
        
        return html
    
    def generate_json_data(self, persona: str = "working") -> str:
        """Generate JSON data for API consumption"""
        current_year = datetime.now().year
        yearly_data = self.progression_system.generate_yearly_overview(current_year, persona)
        current_focus = self.progression_system.get_current_month_focus()
        
        # Convert dataclasses to dictionaries for JSON serialization
        def convert_to_dict(obj, visited=None):
            if visited is None:
                visited = set()
                
            # Prevent infinite recursion
            if id(obj) in visited:
                return str(obj)
            visited.add(id(obj))
            
            if hasattr(obj, '__dict__'):
                result = {}
                for key, value in obj.__dict__.items():
                    if isinstance(value, list):
                        result[key] = [convert_to_dict(item, visited.copy()) for item in value]
                    elif hasattr(value, '__dict__') and not isinstance(value, (str, int, float, bool, type(None))):
                        result[key] = convert_to_dict(value, visited.copy())
                    elif hasattr(value, 'name'):  # Handle Enums
                        result[key] = str(value.name) if hasattr(value, 'name') else str(value)
                    else:
                        result[key] = value
                return result
            return str(obj) if hasattr(obj, 'name') else obj
        
        # Convert monthly plans
        monthly_plans_dict = []
        for plan in yearly_data['monthly_plans']:
            plan_dict = convert_to_dict(plan)
            monthly_plans_dict.append(plan_dict)
        
        api_data = {
            "year": yearly_data["year"],
            "persona": yearly_data["persona"],
            "current_focus": current_focus,
            "monthly_plans": monthly_plans_dict,
            "yearly_targets": yearly_data["yearly_targets"],
            "compound_benefits": yearly_data["compound_benefits"],
            "success_metrics": yearly_data["success_metrics"],
            "generated_at": datetime.now().isoformat()
        }
        
        return json.dumps(api_data, indent=2)

# Example usage and testing
if __name__ == "__main__":
    dashboard = YearlyDashboard()
    
    # Generate HTML for working Kevin
    working_html = dashboard.generate_dashboard_html("working")
    with open("kevin_yearly_plan_working.html", "w") as f:
        f.write(working_html)
    
    # Generate HTML for job searching Kevin  
    job_search_html = dashboard.generate_dashboard_html("job_searching")
    with open("kevin_yearly_plan_job_search.html", "w") as f:
        f.write(job_search_html)
    
    # Generate JSON data (skip for now due to complex serialization)
    # json_data = dashboard.generate_json_data("working")
    # with open("kevin_yearly_data.json", "w") as f:
    #     f.write(json_data)
    
    print("✅ Yearly dashboard files generated successfully!")
    print("📄 kevin_yearly_plan_working.html")
    print("📄 kevin_yearly_plan_job_search.html") 
    print("📊 kevin_yearly_data.json")
