#!/usr/bin/env python3
"""
Integration of Outcome-Driven Goal System with LifePlanner
Connects the new outcome tracking system with the existing LifePlanner interface
"""

import sys
from pathlib import Path

# Add src directory to path for imports
sys.path.append(str(Path(__file__).parent / "src"))

from datetime import date, datetime, timedelta
from typing import Dict, List, Any, Optional
import json

try:
    from features.outcome_driven_system import OutcomeDrivenGoalSystem
except ImportError:
    print("Warning: Outcome system not available. Install dependencies or check imports.")
    OutcomeDrivenGoalSystem = None

class LifePlannerOutcomeIntegration:
    """Integration layer between LifePlanner and Outcome System"""
    
    def __init__(self):
        self.outcome_system = OutcomeDrivenGoalSystem() if OutcomeDrivenGoalSystem else None
        self.enabled = self.outcome_system is not None
    
    def enhance_daily_schedule(self, daily_activities: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Enhance daily schedule with outcome predictions"""
        
        if not self.enabled:
            return {"enhanced": False, "activities": daily_activities}
        
        # Get outcome preview
        preview = self.outcome_system.get_daily_outcome_preview(daily_activities)
        
        # Enhance each activity with outcome information
        enhanced_activities = []
        for i, activity in enumerate(daily_activities):
            enhanced_activity = activity.copy()
            
            # Add outcome preview if available
            if i < len(preview.get("activity_previews", [])):
                activity_preview = preview["activity_previews"][i]
                enhanced_activity["expected_outcomes"] = activity_preview["expected_outcomes"]
                enhanced_activity["impact_score"] = activity_preview["impact_score"]
                enhanced_activity["success_probability"] = activity_preview["success_probability"]
            
            enhanced_activities.append(enhanced_activity)
        
        return {
            "enhanced": True,
            "activities": enhanced_activities,
            "daily_summary": {
                "total_impact": preview.get("daily_impact_summary", {}).get("overall_day_rating", 0),
                "compound_benefits": preview.get("compound_benefits", []),
                "insights": preview.get("personalized_insights", []),
                "optimization_suggestions": preview.get("optimization_suggestions", [])
            }
        }
    
    def add_completion_tracking_to_activity(self, activity: Dict[str, Any]) -> Dict[str, Any]:
        """Add completion tracking interface to activity"""
        
        if not self.enabled:
            return activity
        
        enhanced_activity = activity.copy()
        
        # Add completion tracking fields
        enhanced_activity["trackable"] = True
        enhanced_activity["completion_interface"] = {
            "checkbox_id": f"complete_{activity.get('name', '').lower().replace(' ', '_')}",
            "effort_rating": {"min": 1, "max": 5, "default": 3},
            "mood_rating": {"min": 1, "max": 5, "default": 3},
            "notes_field": True
        }
        
        return enhanced_activity
    
    def record_daily_completions(self, completions: List[Dict[str, Any]]) -> bool:
        """Record daily completions from UI"""
        
        if not self.enabled:
            return False
        
        success_count = 0
        
        for completion in completions:
            success = self.outcome_system.record_habit_completion(
                goal_id=completion.get("goal_id", "default_goal"),
                action_id=completion.get("action_id", "generic_activity"),
                completed=completion.get("completed", False),
                completion_date=completion.get("date", date.today()),
                effort_level=completion.get("effort_level"),
                mood_after=completion.get("mood_after"),
                notes=completion.get("notes")
            )
            if success:
                success_count += 1
        
        return success_count == len(completions)
    
    def get_weekly_progress_widget(self) -> Dict[str, Any]:
        """Get weekly progress widget data for UI"""
        
        if not self.enabled:
            return {"enabled": False}
        
        report = self.outcome_system.get_weekly_progress_report()
        
        return {
            "enabled": True,
            "title": "Weekly Progress",
            "overall_rating": report["overall_rating"],
            "grade": report["grade"],
            "completion_rate": report["completion_rate"],
            "points": report["points_earned"],
            "streaks": [
                {"name": name.replace("_", " ").title(), "days": days}
                for name, days in report["current_streaks"].items()
            ],
            "achievements": report["achievements"][:3],  # Show top 3
            "next_milestone": self._get_next_milestone(report["current_streaks"])
        }
    
    def get_outcome_preview_widget(self, scheduled_activities: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Get outcome preview widget for tomorrow"""
        
        if not self.enabled:
            return {"enabled": False}
        
        preview = self.outcome_system.get_daily_outcome_preview(scheduled_activities)
        
        return {
            "enabled": True,
            "title": "Tomorrow's Expected Outcomes",
            "date": preview["date"],
            "total_impact": preview["daily_impact_summary"]["overall_day_rating"],
            "top_outcomes": self._get_top_outcomes(preview["activity_previews"]),
            "compound_benefits": preview["compound_benefits"][:2],  # Show top 2
            "success_probability": preview["success_probabilities"].get("overall_day_success", "75%")
        }
    
    def get_monthly_analytics_data(self) -> Dict[str, Any]:
        """Get monthly analytics for dashboard"""
        
        if not self.enabled:
            return {"enabled": False}
        
        monthly = self.outcome_system.get_monthly_analysis()
        
        return {
            "enabled": True,
            "period": monthly["period"],
            "total_points": monthly["total_points"],
            "average_score": monthly["average_score"],
            "goal_progress": monthly["goal_progress"],
            "habit_status": monthly["habit_formation_status"],
            "recommendations": monthly["recommendations"][:3]  # Top 3
        }
    
    def _get_next_milestone(self, streaks: Dict[str, int]) -> Dict[str, Any]:
        """Get next streak milestone"""
        
        milestones = [7, 14, 30, 60, 90, 180, 365]
        
        for activity, current_streak in streaks.items():
            for milestone in milestones:
                if current_streak < milestone:
                    days_to_go = milestone - current_streak
                    return {
                        "activity": activity.replace("_", " ").title(),
                        "current": current_streak,
                        "target": milestone,
                        "days_to_go": days_to_go
                    }
        
        return {"activity": "All milestones achieved!", "current": 0, "target": 0, "days_to_go": 0}
    
    def _get_top_outcomes(self, activity_previews: List[Dict[str, Any]]) -> List[Dict[str, str]]:
        """Get top 3 expected outcomes for the day"""
        
        all_outcomes = []
        
        for activity in activity_previews:
            for outcome in activity.get("expected_outcomes", []):
                all_outcomes.append({
                    "name": outcome["name"],
                    "probability": outcome["probability"],
                    "activity": activity["name"]
                })
        
        # Sort by probability and return top 3
        sorted_outcomes = sorted(all_outcomes, key=lambda x: float(x["probability"].strip("%")), reverse=True)
        return sorted_outcomes[:3]

# Integration functions for existing LifePlanner code
def enhance_schedule_with_outcomes(daily_activities: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Standalone function to enhance schedule with outcomes"""
    integration = LifePlannerOutcomeIntegration()
    return integration.enhance_daily_schedule(daily_activities)

def get_progress_widgets() -> Dict[str, Any]:
    """Get all progress widgets for UI"""
    integration = LifePlannerOutcomeIntegration()
    
    return {
        "weekly_progress": integration.get_weekly_progress_widget(),
        "monthly_analytics": integration.get_monthly_analytics_data()
    }

def record_completions_from_ui(completion_data: List[Dict[str, Any]]) -> bool:
    """Record completions from UI form"""
    integration = LifePlannerOutcomeIntegration()
    return integration.record_daily_completions(completion_data)

if __name__ == "__main__":
    # Test the integration
    print("🔗 LIFEPLANNER OUTCOME INTEGRATION TEST")
    print("=" * 50)
    
    integration = LifePlannerOutcomeIntegration()
    
    if integration.enabled:
        print("✅ Outcome system integration enabled")
        
        # Test schedule enhancement
        sample_activities = [
            {
                "name": "Progressive Meditation",
                "start_time": "6:45 AM",
                "end_time": "6:47 AM",
                "duration_minutes": 2
            },
            {
                "name": "Morning Run",
                "start_time": "7:00 AM", 
                "end_time": "8:00 AM",
                "duration_minutes": 60
            }
        ]
        
        enhanced = integration.enhance_daily_schedule(sample_activities)
        print(f"\n📊 Enhanced {len(enhanced['activities'])} activities")
        print(f"Daily Impact Score: {enhanced['daily_summary']['total_impact']}/10")
        
        # Test progress widget
        progress = integration.get_weekly_progress_widget()
        print(f"\n📈 Weekly Progress: {progress['overall_rating']}/10 ({progress['grade']})")
        print(f"Completion Rate: {progress['completion_rate']}")
        
        # Test outcome preview
        preview = integration.get_outcome_preview_widget(sample_activities)
        print(f"\n🔮 Tomorrow's Impact: {preview['total_impact']}/10")
        print(f"Success Probability: {preview['success_probability']}")
        
    else:
        print("❌ Outcome system integration disabled - dependencies not available")
    
    print(f"\n✅ Integration test completed!")
