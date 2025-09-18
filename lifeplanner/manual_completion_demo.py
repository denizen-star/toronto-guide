#!/usr/bin/env python3
"""
Manual Completion Demo
Shows how to manually record habit completions
"""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent / "src"))

from datetime import date, datetime
from features.outcome_driven_system import OutcomeDrivenGoalSystem

def record_todays_habits():
    """Demo: Record today's habit completions manually"""
    
    print("🎯 MANUAL HABIT COMPLETION DEMO")
    print("=" * 50)
    
    # Initialize system
    system = OutcomeDrivenGoalSystem()
    
    print("📝 Recording today's habits...\n")
    
    # Example 1: Completed meditation
    print("1️⃣ Recording Progressive Meditation...")
    success = system.record_habit_completion(
        goal_id="morning_routine_mastery",
        action_id="progressive_meditation",
        completed=True,
        completion_date=date.today(),
        effort_level=4,  # 1-5 scale (4 = good effort)
        mood_before=3,   # 1-5 scale (3 = neutral)
        mood_after=4,    # 1-5 scale (4 = good mood after)
        notes="Week 5: 2-minute session. Felt very focused and calm. Mind wandered less than usual."
    )
    print(f"   ✅ Recorded: {success}")
    
    # Example 2: Completed goal visualization
    print("\n2️⃣ Recording Goal Visualization...")
    success = system.record_habit_completion(
        goal_id="morning_routine_mastery", 
        action_id="goal_visualization",
        completed=True,
        completion_date=date.today(),
        effort_level=3,
        mood_before=3,
        mood_after=4,
        notes="Visualized successful networking at tonight's meetup. Saw myself making 3 new connections."
    )
    print(f"   ✅ Recorded: {success}")
    
    # Example 3: Missed wake up intention (happens sometimes!)
    print("\n3️⃣ Recording Missed Wake Up Intention...")
    success = system.record_habit_completion(
        goal_id="morning_routine_mastery",
        action_id="wake_up_intention", 
        completed=False,  # Didn't do it today
        completion_date=date.today(),
        effort_level=1,   # Low effort
        mood_before=2,    # Groggy morning
        mood_after=2,     # Still groggy
        notes="Overslept by 15 minutes. Rushed morning, didn't set intentions properly."
    )
    print(f"   ✅ Recorded: {success}")
    
    # Example 4: Completed exercise
    print("\n4️⃣ Recording Physical Exercise...")
    success = system.record_habit_completion(
        goal_id="fitness_consistency",
        action_id="physical_exercise",
        completed=True,
        completion_date=date.today(),
        effort_level=5,   # High effort
        mood_before=3,
        mood_after=5,     # Great mood after exercise!
        notes="5K run in High Park. Felt strong, good pace. Met another runner, brief chat about routes."
    )
    print(f"   ✅ Recorded: {success}")
    
    print(f"\n📊 Getting updated progress...")
    
    # Get updated weekly report
    try:
        weekly_report = system.get_weekly_progress_report()
        print(f"\n📈 Updated Weekly Progress:")
        print(f"   Overall Rating: {weekly_report['overall_rating']}/10 ({weekly_report['grade']})")
        print(f"   Completion Rate: {weekly_report['completion_rate']}")
        print(f"   Points Earned: {weekly_report['points_earned']}")
        
        print(f"\n🔥 Current Streaks:")
        for activity, days in weekly_report['current_streaks'].items():
            status = "🔥" if days > 0 else "💔"
            print(f"   {status} {activity.replace('_', ' ').title()}: {days} days")
            
    except Exception as e:
        print(f"   Note: Weekly report generation had an issue: {e}")
    
    print(f"\n✅ Manual completion demo finished!")
    print(f"\n💡 In real use, you would:")
    print(f"   • Check off habits in your LifePlanner UI")
    print(f"   • Rate effort and mood with sliders")
    print(f"   • Add notes about how it went")
    print(f"   • System automatically tracks streaks and calculates ratings")

if __name__ == "__main__":
    record_todays_habits()
