"""
Yearly Progression System for Kevin's Life Planner
Tracks monthly accomplishments, progressive goals, and expected outcomes
"""

from dataclasses import dataclass, field
from datetime import datetime, date, timedelta
from typing import Dict, List, Optional, Tuple
import json
from enum import Enum

class ProgressionType(Enum):
    LINEAR = "linear"          # Steady increase each month
    EXPONENTIAL = "exponential" # Accelerating growth
    MILESTONE = "milestone"     # Step changes at specific points
    SEASONAL = "seasonal"       # Varies by season/month

@dataclass
class MonthlyMilestone:
    month: int  # 1-12
    year: int
    milestone_name: str
    description: str
    target_value: float
    measurement_unit: str
    category: str
    difficulty_level: int  # 1-10
    expected_outcomes: List[str]
    prerequisite_habits: List[str]
    celebration_reward: str

@dataclass
class ProgressiveGoal:
    goal_id: str
    name: str
    category: str
    progression_type: ProgressionType
    starting_value: float
    target_value: float
    measurement_unit: str
    monthly_milestones: List[MonthlyMilestone]
    research_benefits: List[str]
    compound_effects: List[str]

@dataclass
class MonthlyAccomplishmentPlan:
    month: int
    year: int
    month_name: str
    theme: str  # Focus theme for the month
    progressive_goals: List[ProgressiveGoal]
    habit_streaks_target: Dict[str, int]  # habit_name: target_streak_days
    couple_activities_count: int
    career_milestones: List[str]
    health_metrics: Dict[str, float]
    expected_outcomes: List[str]
    success_probability: float
    celebration_plan: str

class YearlyProgressionSystem:
    def __init__(self):
        self.current_year = datetime.now().year
        self.progressive_goals = self._initialize_progressive_goals()
        self.monthly_themes = self._initialize_monthly_themes()
        
    def _initialize_progressive_goals(self) -> List[ProgressiveGoal]:
        """Initialize Kevin's progressive goals for the year"""
        goals = []
        
        # Progressive Meditation Goal
        meditation_milestones = []
        for month in range(1, 13):
            if month <= 4:
                target_minutes = month  # Months 1-4: 1-4 minutes
            elif month <= 8:
                target_minutes = month - 3  # Months 5-8: 2-5 minutes  
            elif month <= 12:
                target_minutes = month - 6  # Months 9-12: 3-6 minutes
            else:
                target_minutes = 5  # Cap at 5 minutes
                
            milestone = MonthlyMilestone(
                month=month,
                year=self.current_year,
                milestone_name=f"Meditation Mastery Month {month}",
                description=f"Consistently meditate {target_minutes} minutes daily",
                target_value=target_minutes,
                measurement_unit="minutes",
                category="mindfulness",
                difficulty_level=min(month, 8),
                expected_outcomes=[
                    f"{15 + month*5}% stress reduction",
                    f"{10 + month*3}% improved focus",
                    f"{20 + month*4}% better emotional regulation"
                ],
                prerequisite_habits=["morning_routine", "intention_setting"],
                celebration_reward=f"New meditation cushion upgrade" if month % 3 == 0 else "Favorite healthy treat"
            )
            meditation_milestones.append(milestone)
            
        meditation_goal = ProgressiveGoal(
            goal_id="progressive_meditation_2025",
            name="Progressive Daily Meditation",
            category="mindfulness",
            progression_type=ProgressionType.LINEAR,
            starting_value=1.0,
            target_value=5.0,
            measurement_unit="minutes",
            monthly_milestones=meditation_milestones,
            research_benefits=[
                "Reduces cortisol levels by up to 23%",
                "Improves attention span by 14% in 8 weeks", 
                "Increases gray matter density in hippocampus",
                "Reduces anxiety symptoms by 60%",
                "Improves sleep quality by 42%"
            ],
            compound_effects=[
                "Better decision-making throughout the day",
                "Improved relationship communication",
                "Enhanced work performance and creativity",
                "Increased emotional intelligence"
            ]
        )
        goals.append(meditation_goal)
        
        # Progressive Exercise Goal
        exercise_milestones = []
        for month in range(1, 13):
            target_sessions = min(3 + (month-1)//2, 6)  # Start 3/week, max 6/week
            milestone = MonthlyMilestone(
                month=month,
                year=self.current_year,
                milestone_name=f"Fitness Evolution Month {month}",
                description=f"Complete {target_sessions} exercise sessions per week",
                target_value=target_sessions,
                measurement_unit="sessions/week",
                category="fitness",
                difficulty_level=min(month, 9),
                expected_outcomes=[
                    f"{10 + month*2}% strength increase",
                    f"{5 + month*3}% cardiovascular improvement",
                    f"{25 + month*5}% energy level boost"
                ],
                prerequisite_habits=["morning_routine", "sleep_schedule"],
                celebration_reward="New workout gear" if month % 4 == 0 else "Post-workout smoothie"
            )
            exercise_milestones.append(milestone)
            
        exercise_goal = ProgressiveGoal(
            goal_id="progressive_exercise_2025",
            name="Progressive Fitness Building",
            category="fitness",
            progression_type=ProgressionType.LINEAR,
            starting_value=3.0,
            target_value=6.0,
            measurement_unit="sessions/week",
            monthly_milestones=exercise_milestones,
            research_benefits=[
                "Increases BDNF (brain growth factor) by 200-300%",
                "Reduces risk of depression by 26%",
                "Improves memory and learning by 20%",
                "Increases lifespan by 3-7 years",
                "Boosts immune system by 25%"
            ],
            compound_effects=[
                "Better sleep quality and recovery",
                "Improved confidence and body image",
                "Enhanced work productivity",
                "Stronger discipline in other life areas"
            ]
        )
        goals.append(exercise_goal)
        
        # Career Development Goal (for Working Kevin)
        career_milestones = []
        for month in range(1, 13):
            if month <= 3:
                focus = "Skill Development"
                target = f"Complete {month} professional certifications"
            elif month <= 6:
                focus = "Network Building" 
                target = f"Connect with {month*2} industry professionals"
            elif month <= 9:
                focus = "Project Leadership"
                target = f"Lead {month-6} high-impact projects"
            else:
                focus = "Strategic Growth"
                target = f"Achieve {month-9} promotion milestones"
                
            milestone = MonthlyMilestone(
                month=month,
                year=self.current_year,
                milestone_name=f"Career Catalyst Month {month}",
                description=target,
                target_value=month,
                measurement_unit="achievements",
                category="career",
                difficulty_level=month,
                expected_outcomes=[
                    f"{5 + month*2}% salary increase potential",
                    f"{10 + month*3}% industry recognition growth",
                    f"{15 + month*4}% professional network expansion"
                ],
                prerequisite_habits=["daily_learning", "networking", "goal_review"],
                celebration_reward="Professional development course" if month % 3 == 0 else "Networking dinner"
            )
            career_milestones.append(milestone)
            
        career_goal = ProgressiveGoal(
            goal_id="career_advancement_2025",
            name="Strategic Career Advancement",
            category="career",
            progression_type=ProgressionType.EXPONENTIAL,
            starting_value=1.0,
            target_value=12.0,
            measurement_unit="milestones",
            monthly_milestones=career_milestones,
            research_benefits=[
                "Continuous learning increases earning potential by 23%",
                "Strong networks account for 85% of career opportunities",
                "Leadership skills increase promotion likelihood by 67%",
                "Strategic thinking improves job satisfaction by 34%"
            ],
            compound_effects=[
                "Increased confidence in all life areas",
                "Better financial security and options",
                "Enhanced problem-solving abilities",
                "Stronger personal brand and reputation"
            ]
        )
        goals.append(career_goal)
        
        return goals
    
    def _initialize_monthly_themes(self) -> Dict[int, str]:
        """Define focus themes for each month"""
        return {
            1: "Foundation Building - Establish Core Habits",
            2: "Momentum Creation - Build Consistency", 
            3: "Skill Development - Learn and Grow",
            4: "Relationship Nurturing - Deepen Connections",
            5: "Energy Optimization - Peak Performance",
            6: "Adventure & Exploration - Expand Horizons", 
            7: "Leadership & Impact - Make a Difference",
            8: "Balance & Integration - Harmonize Life Areas",
            9: "Strategic Planning - Set Future Direction",
            10: "Mastery Focus - Perfect Key Skills",
            11: "Gratitude & Reflection - Appreciate Progress",
            12: "Celebration & Planning - Honor Achievements"
        }
    
    def generate_monthly_plan(self, month: int, year: int, persona: str = "working") -> MonthlyAccomplishmentPlan:
        """Generate detailed monthly accomplishment plan"""
        
        month_name = datetime(year, month, 1).strftime("%B")
        theme = self.monthly_themes.get(month, "Growth & Progress")
        
        # Get progressive goals for this month
        monthly_progressive_goals = []
        for goal in self.progressive_goals:
            monthly_milestones = [m for m in goal.monthly_milestones if m.month == month]
            if monthly_milestones:
                goal_copy = ProgressiveGoal(
                    goal_id=goal.goal_id,
                    name=goal.name,
                    category=goal.category,
                    progression_type=goal.progression_type,
                    starting_value=goal.starting_value,
                    target_value=goal.target_value,
                    measurement_unit=goal.measurement_unit,
                    monthly_milestones=monthly_milestones,
                    research_benefits=goal.research_benefits,
                    compound_effects=goal.compound_effects
                )
                monthly_progressive_goals.append(goal_copy)
        
        # Calculate habit streak targets
        habit_streaks = {
            "meditation": min(month * 7, 30),  # Progressive daily streaks
            "exercise": min(month * 4, 24),    # Progressive weekly streaks  
            "reading": min(month * 5, 30),     # Daily reading streaks
            "gratitude": min(month * 7, 30),   # Daily gratitude streaks
            "networking": min(month * 2, 12)   # Weekly networking streaks
        }
        
        # Couple activities count (increases with relationship depth)
        couple_activities = min(4 + month//2, 8)
        
        # Career milestones based on persona
        if persona == "working":
            career_milestones = [
                f"Complete {min(month, 3)} professional development activities",
                f"Achieve {min(month//2, 2)} project leadership roles",
                f"Build {min(month*2, 10)} new professional connections"
            ]
        else:  # job_searching
            career_milestones = [
                f"Apply to {min(month*5, 25)} relevant positions",
                f"Complete {min(month*2, 8)} networking interviews",
                f"Develop {min(month, 4)} new job search strategies"
            ]
        
        # Health metrics progression
        health_metrics = {
            "energy_level": min(7.0 + month*0.2, 9.5),
            "sleep_quality": min(7.5 + month*0.15, 9.0),
            "stress_level": max(6.0 - month*0.3, 2.0),  # Lower is better
            "fitness_score": min(6.0 + month*0.25, 9.0)
        }
        
        # Expected outcomes compilation
        expected_outcomes = []
        for goal in monthly_progressive_goals:
            for milestone in goal.monthly_milestones:
                expected_outcomes.extend(milestone.expected_outcomes)
        
        # Add general monthly outcomes
        expected_outcomes.extend([
            f"{15 + month*3}% overall life satisfaction increase",
            f"{10 + month*2}% productivity improvement",
            f"{20 + month*4}% goal achievement confidence boost"
        ])
        
        # Success probability (starts high, adjusts based on complexity)
        base_probability = 0.85
        complexity_factor = min(month * 0.02, 0.15)  # Increases difficulty
        consistency_bonus = min(month * 0.01, 0.10)   # Experience bonus
        success_probability = base_probability - complexity_factor + consistency_bonus
        
        # Celebration plan
        celebration_plans = {
            3: "Quarterly Progress Party - Favorite restaurant dinner",
            6: "Mid-Year Achievement Celebration - Weekend getaway",
            9: "Three-Quarter Victory - Professional milestone reward",
            12: "Annual Mastery Celebration - Dream experience or item"
        }
        celebration_plan = celebration_plans.get(month, "Weekly progress acknowledgment with favorite activity")
        
        return MonthlyAccomplishmentPlan(
            month=month,
            year=year,
            month_name=month_name,
            theme=theme,
            progressive_goals=monthly_progressive_goals,
            habit_streaks_target=habit_streaks,
            couple_activities_count=couple_activities,
            career_milestones=career_milestones,
            health_metrics=health_metrics,
            expected_outcomes=expected_outcomes,
            success_probability=success_probability,
            celebration_plan=celebration_plan
        )
    
    def generate_yearly_overview(self, year: int, persona: str = "working") -> Dict:
        """Generate complete yearly progression overview"""
        
        yearly_data = {
            "year": year,
            "persona": persona,
            "total_progressive_goals": len(self.progressive_goals),
            "monthly_plans": [],
            "yearly_targets": {},
            "compound_benefits": [],
            "success_metrics": {}
        }
        
        # Generate all 12 monthly plans
        for month in range(1, 13):
            monthly_plan = self.generate_monthly_plan(month, year, persona)
            yearly_data["monthly_plans"].append(monthly_plan)
        
        # Calculate yearly targets
        yearly_data["yearly_targets"] = {
            "meditation_minutes": 5,  # Final daily target
            "exercise_sessions_per_week": 6,
            "habit_streaks_achieved": 12,
            "couple_activities_completed": 60,
            "career_milestones": 12,
            "health_score_improvement": 40,
            "life_satisfaction_increase": 50
        }
        
        # Compound benefits over the year
        yearly_data["compound_benefits"] = [
            "Established unshakeable daily routines",
            "Achieved peak physical and mental fitness",
            "Built strong professional network and reputation",
            "Deepened relationship connection and intimacy",
            "Developed mastery mindset and continuous growth",
            "Created sustainable work-life integration",
            "Enhanced emotional intelligence and resilience",
            "Achieved financial and career advancement goals"
        ]
        
        # Success metrics tracking
        yearly_data["success_metrics"] = {
            "habit_consistency": "Track daily completion rates",
            "progressive_improvement": "Monitor monthly milestone achievements", 
            "outcome_realization": "Measure research-backed benefits",
            "relationship_depth": "Assess connection and communication quality",
            "career_advancement": "Track professional growth and opportunities",
            "life_satisfaction": "Monthly self-assessment surveys"
        }
        
        return yearly_data
    
    def get_current_month_focus(self) -> Dict:
        """Get current month's focus and immediate next steps"""
        current_month = datetime.now().month
        current_year = datetime.now().year
        
        current_plan = self.generate_monthly_plan(current_month, current_year)
        
        return {
            "current_month": current_plan.month_name,
            "theme": current_plan.theme,
            "top_3_priorities": [
                goal.monthly_milestones[0].milestone_name 
                for goal in current_plan.progressive_goals[:3]
            ],
            "this_week_actions": [
                f"Start daily {current_plan.progressive_goals[0].name.lower()}",
                f"Schedule {current_plan.couple_activities_count//4} couple activities",
                f"Begin {current_plan.career_milestones[0].lower()}"
            ],
            "expected_outcomes": current_plan.expected_outcomes[:5],
            "success_probability": current_plan.success_probability
        }
