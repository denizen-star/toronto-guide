#!/usr/bin/env python3
"""
Calendar Completion Integration
Connects clickable calendar tiles to the outcome tracking system
"""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent / "src"))

from datetime import date, datetime
from typing import Dict, List, Any
import json
from features.outcome_driven_system import OutcomeDrivenGoalSystem

class CalendarCompletionAPI:
    """API for handling calendar tile completion clicks"""
    
    def __init__(self):
        self.outcome_system = OutcomeDrivenGoalSystem()
        
        # Map calendar activity IDs to system action IDs
        self.activity_mapping = {
            'wake_up_intention': {
                'goal_id': 'morning_routine_mastery',
                'action_id': 'wake_up_intention',
                'name': 'Be Proactive - Wake Up & Intention'
            },
            'goal_visualization': {
                'goal_id': 'morning_routine_mastery', 
                'action_id': 'goal_visualization',
                'name': 'Begin with the End in Mind - Goal Visualization'
            },
            'progressive_meditation': {
                'goal_id': 'morning_routine_mastery',
                'action_id': 'progressive_meditation', 
                'name': 'Sharpen the Saw - Progressive Meditation'
            },
            'physical_exercise': {
                'goal_id': 'fitness_consistency',
                'action_id': 'physical_exercise',
                'name': 'Physical Exercise (Running)'
            },
            'networking_event': {
                'goal_id': 'networking_goals',
                'action_id': 'networking_event',
                'name': 'Professional Networking Event'
            }
        }
    
    def record_completion_from_calendar(self, completion_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Record completion from calendar tile click
        
        Args:
            completion_data: {
                'activity_id': 'progressive_meditation',
                'completed': True,
                'effort_level': 4,
                'mood_after': 4, 
                'notes': 'Felt very focused today',
                'date': '2025-09-17'
            }
        
        Returns:
            Success response with updated streak and progress info
        """
        
        activity_id = completion_data.get('activity_id')
        if activity_id not in self.activity_mapping:
            return {'success': False, 'error': f'Unknown activity: {activity_id}'}
        
        mapping = self.activity_mapping[activity_id]
        
        try:
            # Record the completion
            success = self.outcome_system.record_habit_completion(
                goal_id=mapping['goal_id'],
                action_id=mapping['action_id'],
                completed=completion_data.get('completed', False),
                completion_date=date.fromisoformat(completion_data.get('date', str(date.today()))),
                effort_level=completion_data.get('effort_level'),
                mood_after=completion_data.get('mood_after'),
                notes=completion_data.get('notes')
            )
            
            if success:
                # Get updated progress information
                updated_info = self._get_updated_activity_info(activity_id)
                
                return {
                    'success': True,
                    'message': f"✅ {mapping['name']} recorded successfully!",
                    'updated_info': updated_info
                }
            else:
                return {'success': False, 'error': 'Failed to record completion'}
                
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def _get_updated_activity_info(self, activity_id: str) -> Dict[str, Any]:
        """Get updated streak and progress info after completion"""
        
        mapping = self.activity_mapping[activity_id]
        
        try:
            # Get activity rating and performance data
            rating = self.outcome_system.get_activity_rating(
                mapping['goal_id'], 
                mapping['action_id']
            )
            
            # Get weekly progress
            weekly_progress = self.outcome_system.get_weekly_progress_report()
            
            # Extract relevant information
            current_streak = weekly_progress.get('current_streaks', {}).get(mapping['action_id'], 0)
            
            return {
                'current_streak': current_streak,
                'weekly_rating': weekly_progress.get('overall_rating', 0),
                'completion_rate': rating.get('performance_metrics', {}).get('completion_rate', '0%'),
                'grade': rating.get('grade', 'N/A'),
                'next_milestone': self._get_next_streak_milestone(current_streak)
            }
            
        except Exception as e:
            return {'error': str(e)}
    
    def _get_next_streak_milestone(self, current_streak: int) -> Dict[str, Any]:
        """Get information about the next streak milestone"""
        
        milestones = [7, 14, 30, 60, 90, 180, 365]
        
        for milestone in milestones:
            if current_streak < milestone:
                return {
                    'target': milestone,
                    'days_remaining': milestone - current_streak,
                    'achievement': self._get_milestone_achievement(milestone)
                }
        
        return {'target': 'All milestones achieved!', 'days_remaining': 0, 'achievement': 'Legend Status'}
    
    def _get_milestone_achievement(self, days: int) -> str:
        """Get achievement name for milestone"""
        achievements = {
            7: 'Week Warrior 🔥',
            14: 'Fortnight Fighter 🔥🔥', 
            30: 'Month Master 🔥🔥🔥',
            60: 'Two Month Champion 🏆',
            90: 'Quarter King 👑',
            180: 'Half Year Hero 🌟',
            365: 'Year Legend 🏅'
        }
        return achievements.get(days, f'{days}-Day Achiever')
    
    def get_calendar_activities_with_outcomes(self, target_date: str = None) -> List[Dict[str, Any]]:
        """
        Get calendar activities enhanced with outcome predictions
        This integrates with your existing schedule generation
        """
        
        if target_date is None:
            target_date = str(date.today())
        
        # Sample activities (in real implementation, this would come from your schedule generator)
        base_activities = [
            {
                'activity_id': 'wake_up_intention',
                'name': 'Be Proactive - Wake Up & Intention',
                'start_time': '6:00 AM',
                'end_time': '6:15 AM',
                'duration_minutes': 15,
                'category': 'morning_routine'
            },
            {
                'activity_id': 'goal_visualization',
                'name': 'Begin with the End in Mind - Goal Visualization', 
                'start_time': '6:15 AM',
                'end_time': '6:45 AM',
                'duration_minutes': 30,
                'category': 'morning_routine'
            },
            {
                'activity_id': 'progressive_meditation',
                'name': 'Sharpen the Saw - Progressive Meditation',
                'start_time': '6:45 AM',
                'end_time': '6:47 AM', 
                'duration_minutes': 2,
                'category': 'morning_routine'
            },
            {
                'activity_id': 'physical_exercise',
                'name': 'Tuesday Running (60 min)',
                'start_time': '7:00 AM',
                'end_time': '8:00 AM',
                'duration_minutes': 60,
                'category': 'fitness'
            },
            {
                'activity_id': 'networking_event',
                'name': 'Toronto Data Science Meetup',
                'start_time': '6:30 PM',
                'end_time': '8:30 PM',
                'duration_minutes': 120,
                'category': 'networking',
                'networking_potential': 9
            }
        ]
        
        # Enhance each activity with outcome predictions
        enhanced_activities = []
        
        for activity in base_activities:
            # Get outcome preview for this activity
            preview = self.outcome_system.get_daily_outcome_preview([activity])
            
            # Get current streak info
            activity_id = activity['activity_id']
            if activity_id in self.activity_mapping:
                mapping = self.activity_mapping[activity_id]
                weekly_progress = self.outcome_system.get_weekly_progress_report()
                current_streak = weekly_progress.get('current_streaks', {}).get(mapping['action_id'], 0)
            else:
                current_streak = 0
            
            # Enhanced activity with completion tracking
            enhanced_activity = {
                **activity,
                'clickable': True,
                'current_streak': current_streak,
                'expected_outcomes': preview.get('activity_previews', [{}])[0].get('expected_outcomes', []),
                'success_probability': preview.get('success_probabilities', {}).get('overall_day_success', '75%'),
                'impact_score': preview.get('daily_impact_summary', {}).get('overall_day_rating', 0),
                'completion_interface': {
                    'modal_enabled': True,
                    'effort_rating': True,
                    'mood_rating': True, 
                    'notes_field': True
                }
            }
            
            enhanced_activities.append(enhanced_activity)
        
        return enhanced_activities

def create_flask_api_endpoint():
    """Example Flask API endpoint for handling calendar completions"""
    
    api = CalendarCompletionAPI()
    
    # This would be your Flask route
    example_route = '''
    from flask import Flask, request, jsonify
    
    app = Flask(__name__)
    calendar_api = CalendarCompletionAPI()
    
    @app.route('/api/record-completion', methods=['POST'])
    def record_completion():
        """Handle completion recording from calendar tiles"""
        completion_data = request.json
        result = calendar_api.record_completion_from_calendar(completion_data)
        return jsonify(result)
    
    @app.route('/api/calendar-activities/<date>')  
    def get_calendar_activities(date):
        """Get enhanced calendar activities for a specific date"""
        activities = calendar_api.get_calendar_activities_with_outcomes(date)
        return jsonify({'activities': activities})
    '''
    
    return example_route

def demo_calendar_completion():
    """Demo the calendar completion system"""
    
    print("🎯 CALENDAR COMPLETION INTEGRATION DEMO")
    print("=" * 60)
    
    api = CalendarCompletionAPI()
    
    # Simulate clicking on meditation tile and completing it
    print("1️⃣ Simulating meditation tile click...")
    
    completion_data = {
        'activity_id': 'progressive_meditation',
        'completed': True,
        'effort_level': 4,
        'mood_after': 5,
        'notes': 'Week 5: 2-minute session. Felt very calm and focused. Mind wandered less than usual.',
        'date': str(date.today())
    }
    
    result = api.record_completion_from_calendar(completion_data)
    
    if result['success']:
        print(f"   ✅ {result['message']}")
        updated_info = result['updated_info']
        print(f"   🔥 Current Streak: {updated_info['current_streak']} days")
        print(f"   ⭐ Weekly Rating: {updated_info['weekly_rating']}/10")
        print(f"   🎯 Next Milestone: {updated_info['next_milestone']['achievement']} in {updated_info['next_milestone']['days_remaining']} days")
    else:
        print(f"   ❌ Error: {result['error']}")
    
    # Get enhanced calendar activities
    print(f"\n2️⃣ Getting enhanced calendar activities...")
    activities = api.get_calendar_activities_with_outcomes()
    
    print(f"   📅 Found {len(activities)} trackable activities:")
    for activity in activities:
        print(f"   • {activity['name']} (🔥 {activity['current_streak']} day streak)")
        print(f"     Expected Impact: {activity['impact_score']:.1f}/10")
        print(f"     Success Probability: {activity['success_probability']}")
    
    print(f"\n✅ Calendar completion integration working!")

if __name__ == "__main__":
    demo_calendar_completion()
