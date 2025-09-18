#!/usr/bin/env python3
"""
Comprehensive Outcome-Driven Goal System Integration
Main interface for the complete outcome tracking and analytics system
"""

from datetime import datetime, date, timedelta
from typing import Dict, List, Optional, Any
import json
from pathlib import Path

from .outcome_system import ResearchBackedOutcomeDatabase, GoalDefinition, ActionOutcomeMapping
from .goal_tracking_database import GoalTrackingDatabase
from .rating_system import OutcomeBasedRatingSystem, ActivityPerformanceData
from .daily_outcome_preview import DailyOutcomePreviewGenerator
from .analytics_dashboard import StravaStyleAnalytics

class OutcomeDrivenGoalSystem:
    """
    Complete outcome-driven goal system with:
    - Research-backed outcome predictions
    - Progressive habit tracking  
    - Daily outcome previews
    - Strava-style analytics
    - Modular goal creation
    """
    
    def __init__(self, db_path: str = "data/goal_tracking.db"):
        self.db_path = db_path
        
        # Initialize all system components
        self.outcome_db = ResearchBackedOutcomeDatabase()
        self.tracking_db = GoalTrackingDatabase(db_path)
        self.rating_system = OutcomeBasedRatingSystem()
        self.preview_generator = DailyOutcomePreviewGenerator(db_path)
        self.analytics = StravaStyleAnalytics(db_path)
        
        # Initialize Kevin's core goals
        self._initialize_core_goals()
    
    def _initialize_core_goals(self):
        """Initialize Kevin's core habit goals"""
        
        core_goals = [
            {
                "goal_id": "morning_routine_mastery",
                "name": "Morning Routine Mastery",
                "category": "daily_habits",
                "frequency": "daily",
                "duration_weeks": 52,  # 1 year
                "target_completion_rate": 0.90,
                "actions": ["wake_up_intention", "goal_visualization", "progressive_meditation"],
                "success_metrics": ["Consistency rate", "Streak achievements", "User satisfaction"],
                "rating_weight": 1.0
            },
            {
                "goal_id": "fitness_consistency",
                "name": "Fitness Consistency",
                "category": "health",
                "frequency": "4x_weekly",
                "duration_weeks": 26,  # 6 months
                "target_completion_rate": 0.95,
                "actions": ["physical_exercise"],
                "success_metrics": ["Weekly completion rate", "Performance improvement", "Health metrics"],
                "rating_weight": 1.2
            }
        ]
        
        for goal_config in core_goals:
            # Check if goal already exists
            try:
                existing_goal = self.get_goal(goal_config["goal_id"])
                if not existing_goal:
                    self.create_goal_from_config(goal_config)
            except:
                self.create_goal_from_config(goal_config)
    
    def create_goal_from_config(self, config: Dict[str, Any]) -> bool:
        """Create a goal from configuration dictionary"""
        
        # Get action mappings
        actions = []
        for action_id in config["actions"]:
            action_mapping = self.outcome_db.get_action_outcomes(action_id)
            if action_mapping:
                actions.append(action_mapping)
        
        if not actions:
            return False
        
        goal = GoalDefinition(
            goal_id=config["goal_id"],
            name=config["name"],
            category=config["category"],
            frequency=config["frequency"],
            duration_weeks=config["duration_weeks"],
            target_completion_rate=config["target_completion_rate"],
            actions=actions,
            success_metrics=config["success_metrics"],
            rating_weight=config["rating_weight"]
        )
        
        return self.tracking_db.add_goal(goal)
    
    def create_custom_goal(
        self,
        name: str,
        frequency: str,  # "daily", "weekly", "monthly", "yearly"
        duration: str,   # "1 week", "3 months", "1 year"
        actions: List[str],  # Action names or IDs
        target_completion_rate: float = 0.80
    ) -> str:
        """Create a custom goal with flexible parameters"""
        
        # Generate goal ID
        goal_id = name.lower().replace(" ", "_").replace("-", "_")
        
        # Parse duration
        duration_weeks = self._parse_duration_to_weeks(duration)
        
        # Map actions to outcome mappings
        action_mappings = []
        for action in actions:
            # Try to find existing mapping first
            mapping = self.outcome_db.get_action_outcomes(action)
            if not mapping:
                # Create generic mapping for custom actions
                mapping = self._create_custom_action_mapping(action, frequency)
            action_mappings.append(mapping)
        
        # Create goal
        goal = GoalDefinition(
            goal_id=goal_id,
            name=name,
            category="custom",
            frequency=frequency,
            duration_weeks=duration_weeks,
            target_completion_rate=target_completion_rate,
            actions=action_mappings,
            success_metrics=["Completion rate", "Consistency", "User satisfaction"],
            rating_weight=1.0
        )
        
        success = self.tracking_db.add_goal(goal)
        return goal_id if success else ""
    
    def record_habit_completion(
        self,
        goal_id: str,
        action_id: str,
        completed: bool,
        completion_date: Optional[date] = None,
        effort_level: Optional[int] = None,
        mood_before: Optional[int] = None,
        mood_after: Optional[int] = None,
        notes: Optional[str] = None
    ) -> bool:
        """Record completion of a habit/activity"""
        
        if completion_date is None:
            completion_date = date.today()
        
        return self.tracking_db.record_completion(
            goal_id=goal_id,
            action_id=action_id,
            completion_date=completion_date,
            completed=completed,
            completion_time=datetime.now() if completed else None,
            effort_level=effort_level,
            mood_before=mood_before,
            mood_after=mood_after,
            notes=notes
        )
    
    def get_daily_outcome_preview(self, scheduled_activities: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Get tomorrow's outcome preview"""
        
        preview = self.preview_generator.generate_tomorrow_preview(scheduled_activities)
        
        return {
            "date": preview.date,
            "total_activities": preview.total_activities,
            "daily_impact_summary": preview.daily_impact_summary,
            "activity_previews": [
                {
                    "name": ap.activity_name,
                    "time_slot": ap.time_slot,
                    "expected_outcomes": [
                        {
                            "name": outcome.outcome_name,
                            "description": outcome.description,
                            "probability": f"{outcome.probability:.0%}",
                            "confidence": outcome.confidence_level
                        }
                        for outcome in ap.expected_outcomes
                    ],
                    "impact_score": ap.potential_impact_score,
                    "success_probability": f"{ap.success_probability:.0%}"
                }
                for ap in preview.activity_previews
            ],
            "compound_benefits": preview.compound_benefits,
            "personalized_insights": preview.personalized_insights,
            "success_probabilities": preview.success_probabilities,
            "optimization_suggestions": preview.optimization_suggestions
        }
    
    def get_weekly_progress_report(self, week_start: Optional[date] = None) -> Dict[str, Any]:
        """Get Strava-style weekly progress report"""
        
        if week_start is None:
            # Get last Monday
            today = date.today()
            week_start = today - timedelta(days=today.weekday())
        
        report = self.analytics.generate_weekly_report(week_start)
        
        return {
            "week_period": f"{report.week_start} - {report.week_end}",
            "overall_rating": report.overall_rating,
            "grade": report.grade,
            "completion_rate": f"{report.completion_rate:.0%}",
            "points_earned": report.points_earned,
            "achievements": report.achievements_unlocked,
            "current_streaks": report.current_streaks,
            "predicted_vs_actual": report.predicted_vs_actual,
            "outcome_trends": report.outcome_trends,
            "research_validation": report.research_validation,
            "next_week_optimization": report.next_week_optimization
        }
    
    def get_monthly_analysis(self, month: Optional[int] = None, year: Optional[int] = None) -> Dict[str, Any]:
        """Get comprehensive monthly analysis"""
        
        if month is None:
            month = date.today().month
        if year is None:
            year = date.today().year
        
        report = self.analytics.generate_monthly_report(month, year)
        
        return {
            "period": f"{report.month} {report.year}",
            "total_points": report.total_points,
            "weekly_scores": report.weekly_scores,
            "average_score": sum(report.weekly_scores) / len(report.weekly_scores) if report.weekly_scores else 0,
            "best_week": report.best_week,
            "achievements_summary": report.achievements_summary,
            "goal_progress": report.goal_progress,
            "habit_formation_status": report.habit_formation_status,
            "compound_benefits": report.compound_benefits_detected,
            "recommendations": report.recommendations
        }
    
    def get_activity_rating(self, goal_id: str, action_id: str) -> Dict[str, Any]:
        """Get comprehensive rating for a specific activity"""
        
        # Get action mapping
        action_mapping = self.outcome_db.get_action_outcomes(action_id)
        if not action_mapping:
            return {}
        
        # Get performance data
        perf_data = self.tracking_db.get_performance_data(goal_id, action_id)
        if not perf_data:
            return {}
        
        # Calculate rating
        rating = self.rating_system.calculate_comprehensive_rating(action_mapping, perf_data)
        
        return {
            "activity_name": action_mapping.action_name,
            "overall_rating": rating.overall_rating,
            "grade": rating.grade,
            "explanation": rating.explanation,
            "breakdown": {
                "base_score": rating.base_rating,
                "outcome_value": rating.outcome_multiplier,
                "consistency_bonus": rating.consistency_bonus,
                "research_backing": rating.research_strength_bonus,
                "streak_achievement": rating.streak_bonus
            },
            "improvement_suggestions": rating.improvement_suggestions,
            "performance_metrics": {
                "completion_rate": f"{perf_data.completion_rate:.0%}",
                "current_streak": f"{perf_data.current_streak} days",
                "consistency_score": f"{perf_data.consistency_score:.2f}",
                "user_satisfaction": f"{perf_data.user_satisfaction:.1f}/5"
            }
        }
    
    def get_progress_insights(self, days_back: int = 30) -> List[Dict[str, Any]]:
        """Get actionable progress insights"""
        
        insights = self.analytics.generate_progress_insights(days_back)
        
        return [
            {
                "type": insight.insight_type,
                "title": insight.title,
                "description": insight.description,
                "confidence": f"{insight.confidence:.0%}",
                "action_items": insight.action_items,
                "data_points": insight.data_points
            }
            for insight in insights
        ]
    
    def get_goal(self, goal_id: str) -> Optional[Dict[str, Any]]:
        """Get goal information"""
        # This would query the database for goal info
        # For now, return None to indicate not implemented
        return None
    
    def _parse_duration_to_weeks(self, duration_str: str) -> int:
        """Parse duration string to weeks"""
        
        duration_str = duration_str.lower()
        
        if "week" in duration_str:
            return int(duration_str.split()[0])
        elif "month" in duration_str:
            return int(duration_str.split()[0]) * 4
        elif "year" in duration_str:
            return int(duration_str.split()[0]) * 52
        else:
            return 4  # Default to 4 weeks
    
    def _create_custom_action_mapping(self, action_name: str, frequency: str) -> ActionOutcomeMapping:
        """Create a basic action mapping for custom actions"""
        
        from .outcome_system import OutcomeDefinition
        
        # Create generic outcome based on action name
        outcome = OutcomeDefinition(
            outcome_id=f"custom_{action_name.lower().replace(' ', '_')}",
            name=f"{action_name} Benefits",
            description=f"Positive outcomes from completing {action_name}",
            category="general",
            measurement_type="subjective",
            research_evidence=["Custom activity - user defined"],
            time_to_manifest="short_term",
            probability=0.70,
            impact_score=3.5
        )
        
        return ActionOutcomeMapping(
            action_id=action_name.lower().replace(" ", "_"),
            action_name=action_name,
            frequency=frequency,
            duration_minutes=30,  # Default duration
            primary_outcomes=[outcome],
            secondary_outcomes=[],
            evidence_strength="moderate",
            compound_effects=[]
        )

def create_sample_system_demo():
    """Create a comprehensive demo of the system"""
    
    print("🎯 OUTCOME-DRIVEN GOAL SYSTEM DEMO")
    print("=" * 60)
    
    # Initialize system
    system = OutcomeDrivenGoalSystem("demo_goals.db")
    
    # Record some sample completions
    print("\n📝 Recording sample habit completions...")
    today = date.today()
    
    for i in range(7):  # Past week
        completion_date = today - timedelta(days=i)
        
        # Morning routine completions
        system.record_habit_completion(
            goal_id="morning_routine_mastery",
            action_id="progressive_meditation",
            completed=True,
            completion_date=completion_date,
            effort_level=4,
            mood_after=4
        )
        
        system.record_habit_completion(
            goal_id="morning_routine_mastery",
            action_id="goal_visualization",
            completed=i < 6,  # Miss one day
            completion_date=completion_date,
            effort_level=4,
            mood_after=4
        )
    
    # Get daily preview
    print("\n🔮 Tomorrow's Outcome Preview:")
    sample_activities = [
        {
            "name": "Progressive Meditation",
            "start_time": "6:45 AM",
            "end_time": "6:47 AM",
            "duration_minutes": 2,
            "activity_type": "morning_routine"
        },
        {
            "name": "Goal Visualization",
            "start_time": "6:15 AM",
            "end_time": "6:45 AM",
            "duration_minutes": 30,
            "activity_type": "morning_routine"
        },
        {
            "name": "Toronto Data Meetup",
            "start_time": "6:30 PM",
            "end_time": "8:30 PM",
            "duration_minutes": 120,
            "networking_potential": 9
        }
    ]
    
    preview = system.get_daily_outcome_preview(sample_activities)
    print(f"Date: {preview['date']}")
    print(f"Total Activities: {preview['total_activities']}")
    print(f"Overall Impact: {preview['daily_impact_summary']['overall_day_rating']}/10")
    
    print("\nExpected Outcomes:")
    for activity in preview['activity_previews']:
        print(f"  📅 {activity['name']} ({activity['time_slot']})")
        for outcome in activity['expected_outcomes'][:2]:  # Show first 2 outcomes
            print(f"    • {outcome['name']}: {outcome['probability']} probability")
    
    # Get weekly report
    print(f"\n📊 Weekly Progress Report:")
    weekly = system.get_weekly_progress_report()
    print(f"Period: {weekly['week_period']}")
    print(f"Overall Rating: {weekly['overall_rating']}/10 ({weekly['grade']})")
    print(f"Completion Rate: {weekly['completion_rate']}")
    print(f"Points Earned: {weekly['points_earned']}")
    
    print("\nCurrent Streaks:")
    for activity, days in weekly['current_streaks'].items():
        print(f"  🔥 {activity.replace('_', ' ').title()}: {days} days")
    
    print("\nAchievements:")
    for achievement in weekly['achievements']:
        print(f"  🏆 {achievement}")
    
    # Get activity rating
    print(f"\n⭐ Activity Rating - Progressive Meditation:")
    rating = system.get_activity_rating("morning_routine_mastery", "progressive_meditation")
    if rating:
        print(f"Overall Rating: {rating['overall_rating']}/10 ({rating['grade']})")
        print(f"Explanation: {rating['explanation']}")
        print(f"Current Streak: {rating['performance_metrics']['current_streak']}")
        print(f"Completion Rate: {rating['performance_metrics']['completion_rate']}")
    
    # Get insights
    print(f"\n💡 Progress Insights:")
    insights = system.get_progress_insights()
    for insight in insights[:3]:  # Show first 3
        print(f"  🎯 {insight['title']}")
        print(f"    {insight['description']}")
        if insight['action_items']:
            print(f"    Action: {insight['action_items'][0]}")
    
    print(f"\n✅ Demo completed! System is fully operational.")

if __name__ == "__main__":
    create_sample_system_demo()
