#!/usr/bin/env python3
"""
My Breakpoint Tennis Schedule Integration
Based on the actual tennis schedule from Breakpoint Club:
https://breakpointclub.org/

This script integrates your real tennis activities into the life planner system.
"""

from activity_integration_tool import ActivityIntegrationTool, ScheduleType
from integrated_couple_planner import IntegratedCouplePlanner
import datetime


def setup_breakpoint_tennis_activities():
    """Set up tennis activities based on the actual Breakpoint Club schedule"""
    
    print("🎾 SETTING UP BREAKPOINT TENNIS ACTIVITIES")
    print("=" * 50)
    print("Based on your actual tennis schedule from Breakpoint Club")
    print("Website: https://breakpointclub.org/")
    print("Contact: mera@acetennis.ca")
    print()
    
    # Create integration tool
    tool = ActivityIntegrationTool()
    
    # SATURDAY CLASSES
    print("📅 Adding Saturday Tennis Classes...")
    
    # Saturday 8-9am classes
    tool.add_tennis_schedule_activity(
        name="Beginner Adult Class (Coach Neel)",
        day="Saturday",
        time="8:00 AM",
        duration=60,
        location="Harbord Collegiate Institute, 286 Harbord St, Toronto (outdoor)",
        cost=25.0,  # Estimated cost
        description="Beginner tennis class focusing on backhand, net play, and hitting sessions"
    )
    
    tool.add_tennis_schedule_activity(
        name="Beginner Adult Class (Coach Shivya)",
        day="Saturday",
        time="8:00 AM",
        duration=60,
        location="Park Lawn Bubble Rink Tennis Courts, 340 Park Lawn Rd, Toronto (outdoor)",
        description="Beginner tennis class covering rules, positioning, smashes, and challenger training"
    )
    
    # Saturday 10-11am classes
    tool.add_tennis_schedule_activity(
        name="Beginner Adult Class (Coach Omar)",
        day="Saturday",
        time="10:00 AM",
        duration=60,
        location="Harbord Collegiate Institute, 286 Harbord St, Toronto (outdoor)",
        description="Beginner tennis class focusing on attack shots and doubles strategy"
    )
    
    tool.add_tennis_schedule_activity(
        name="Beginner Adult Class (Coach Shivya)",
        day="Saturday",
        time="10:00 AM",
        duration=60,
        location="Park Lawn Bubble Rink Tennis Courts, 340 Park Lawn Road, Toronto (outdoor)",
        description="Beginner tennis class covering net play, scoring, forehand, and serves"
    )
    
    # Saturday 11am-12pm
    tool.add_tennis_schedule_activity(
        name="Beginner 1.5 Adult Class (Coach Luis)",
        day="Saturday",
        time="11:00 AM",
        duration=60,
        location="Riverdale CI, 1094 Gerrard St E, Toronto (outdoor)",
        description="Intermediate beginner class focusing on scoring and doubles strategy"
    )
    
    # Saturday 12-1pm
    tool.add_tennis_schedule_activity(
        name="Beginner Adult Class (Coach Neel)",
        day="Saturday",
        time="12:00 PM",
        duration=60,
        location="Harbord Collegiate Institute, 286 Harbord St, Toronto (outdoor)",
        description="Beginner tennis class covering challenger training, forehand, footwork, and returns"
    )
    
    # Saturday 1-2pm (Indoor)
    tool.add_tennis_schedule_activity(
        name="Beginner 1.5 Adult Class (Coach Niki) - Indoor",
        day="Saturday",
        time="1:00 PM",
        duration=60,
        location="Crescent, 2365 Bayview Ave, Toronto (indoor)",
        description="Indoor intermediate beginner class covering all tennis fundamentals"
    )
    
    # Saturday 3-4pm
    tool.add_tennis_schedule_activity(
        name="Beginner Adult Class (Coach Jamal)",
        day="Saturday",
        time="3:00 PM",
        duration=60,
        location="Harbord Collegiate Institute, 286 Harbord St, Toronto (outdoor)",
        description="Beginner tennis class focusing on serves, footwork, cardio, and tiebreakers"
    )
    
    # Saturday 4-5pm
    tool.add_tennis_schedule_activity(
        name="Beginner Adult Class (Coach Jamal)",
        day="Saturday",
        time="4:00 PM",
        duration=60,
        location="Harbord Collegiate Institute, 286 Harbord St, Toronto (outdoor)",
        description="Beginner tennis class covering smashes, scoring, and overhand serves"
    )
    
    # Saturday 5-6pm
    tool.add_tennis_schedule_activity(
        name="Beginner Adult Class (Coach Ali)",
        day="Saturday",
        time="5:00 PM",
        duration=60,
        location="Riverdale CI, 1094 Gerrard St E, Toronto (outdoor)",
        description="Beginner tennis class focusing on scoring, footwork, backhand, and cardio tennis"
    )
    
    # SUNDAY CLASSES
    print("📅 Adding Sunday Tennis Classes...")
    
    # Sunday 9-10am
    tool.add_tennis_schedule_activity(
        name="Beginner Adult Class (Coach Omar)",
        day="Sunday",
        time="9:00 AM",
        duration=60,
        location="Harbord Collegiate Institute, 286 Harbord St, Toronto (outdoor)",
        description="Beginner tennis class focusing on rally and hitting sessions"
    )
    
    # Sunday 10-11am
    tool.add_tennis_schedule_activity(
        name="Beginner Adult Class (Coach Niki)",
        day="Sunday",
        time="10:00 AM",
        duration=60,
        location="Harbord Collegiate Institute, 286 Harbord St, Toronto (outdoor)",
        description="Beginner tennis class covering forehand and backhand fundamentals"
    )
    
    tool.add_tennis_schedule_activity(
        name="Beginner Adult Class (Coach Ali)",
        day="Sunday",
        time="10:00 AM",
        duration=60,
        location="Riverdale Collegiate Institute, 1094 Gerrard St E, Toronto (outdoor)",
        description="Beginner tennis class covering challenger training, cardio tennis, and returns"
    )
    
    # Sunday 1-2pm
    tool.add_tennis_schedule_activity(
        name="Beginner Adult Class (Coach Jamal)",
        day="Sunday",
        time="1:00 PM",
        duration=60,
        location="Harbord Collegiate Institute, 286 Harbord St, Toronto (outdoor)",
        description="Beginner tennis class covering challenger training, cardio tennis, and doubles"
    )
    
    # Sunday 4-5pm
    tool.add_tennis_schedule_activity(
        name="Beginner Adult Class (Coach Jamal)",
        day="Sunday",
        time="4:00 PM",
        duration=60,
        location="Harbord Collegiate Institute, 286 Harbord St, Toronto (outdoor)",
        description="Beginner tennis class focusing on serves and forehand"
    )
    
    tool.add_tennis_schedule_activity(
        name="Beginner Adult Class (Coach Luis)",
        day="Sunday",
        time="4:00 PM",
        duration=60,
        location="Riverdale Collegiate Institute, 1094 Gerrard St E, Toronto (outdoor)",
        description="Beginner tennis class covering hitting sessions, scoring, smashes, and backhand"
    )
    
    # Sunday 5-6pm
    tool.add_tennis_schedule_activity(
        name="Beginner Adult Class (Coach Jamal)",
        day="Sunday",
        time="5:00 PM",
        duration=60,
        location="Harbord Collegiate Institute, 286 Harbord St, Toronto (outdoor)",
        description="Beginner tennis class focusing on cardio tennis and smashes"
    )
    
    # Sunday 7-8pm (Indoor)
    tool.add_tennis_schedule_activity(
        name="Beginner 1.5 Adult Class (Coach Hesh) - Indoor",
        day="Sunday",
        time="7:00 PM",
        duration=60,
        location="Crescent, 2365 Bayview Ave, Toronto (indoor)",
        description="Indoor intermediate beginner class covering all tennis fundamentals"
    )
    
    # WEEKDAY CLASSES
    print("📅 Adding Weekday Tennis Classes...")
    
    # Monday classes
    tool.add_tennis_schedule_activity(
        name="Beginner 1.5 Adult Class (Coach Shivya)",
        day="Monday",
        time="12:00 PM",
        duration=60,
        location="Park Lawn Bubble Rink Tennis Courts, 340 Park Lawn Rd, Toronto (outdoor)",
        description="Lunchtime intermediate beginner class covering backhand, scoring, forehand, and footwork"
    )
    
    tool.add_tennis_schedule_activity(
        name="Beginner Adult Class (Coach Ali)",
        day="Monday",
        time="12:00 PM",
        duration=60,
        location="Jonathan Ashbridge, 1515 Queen St E, Toronto (outdoor)",
        description="Lunchtime beginner class covering backhand, rally, smashes, lobs, and doubles"
    )
    
    tool.add_tennis_schedule_activity(
        name="Beginner Adult Class (Coach Ali)",
        day="Monday",
        time="6:00 PM",
        duration=60,
        location="Riverdale Collegiate Institute, 1094 Gerrard St E, Toronto (outdoor)",
        description="Evening beginner class covering serves, groundstrokes, and scoring"
    )
    
    tool.add_tennis_schedule_activity(
        name="Beginner Adult Class (Coach Shivya)",
        day="Monday",
        time="7:00 PM",
        duration=60,
        location="Park Lawn Bubble Rink Tennis Courts, 340 Park Lawn Road, Toronto (outdoor)",
        description="Evening beginner class focusing on backhand and lobs"
    )
    
    # Monday 8-9pm (Indoor)
    tool.add_tennis_schedule_activity(
        name="Beginner 1.5 Adult Class (Coach Luis) - Indoor",
        day="Monday",
        time="8:00 PM",
        duration=60,
        location="Niagara Street PS gym, 222 Niagara St, Toronto (indoor)",
        description="Evening indoor intermediate beginner class covering cardio tennis, scoring, and groundstrokes"
    )
    
    tool.add_tennis_schedule_activity(
        name="Beginner 1.5 Adult Class (Coach Omar) - Indoor",
        day="Monday",
        time="8:00 PM",
        duration=60,
        location="Niagara Street PS gym, 222 Niagara St, Toronto (indoor)",
        description="Evening indoor intermediate beginner class covering challenger training, rally, backhand, and forehand"
    )
    
    # Tuesday classes
    tool.add_tennis_schedule_activity(
        name="Beginner Adult Class (Coach Jamal)",
        day="Tuesday",
        time="6:00 PM",
        duration=60,
        location="Harbord Collegiate Institute, 286 Harbord St, Toronto (outdoor)",
        description="Evening beginner class covering challenger training and backhand"
    )
    
    tool.add_tennis_schedule_activity(
        name="Beginner 1.5 Adult Class (Coach Luis)",
        day="Tuesday",
        time="6:00 PM",
        duration=60,
        location="Riverdale Collegiate Institute, 1094 Gerrard St E, Toronto (outdoor)",
        description="Evening intermediate beginner class covering backhand and rally"
    )
    
    # Wednesday classes
    tool.add_tennis_schedule_activity(
        name="Beginner Adult Class (Coach Neel)",
        day="Wednesday",
        time="9:00 AM",
        duration=60,
        location="Park Lawn Bubble Rink Tennis Courts, 340 Park Lawn Road, Toronto (outdoor)",
        description="Morning beginner class focusing on footwork and forehand"
    )
    
    tool.add_tennis_schedule_activity(
        name="Beginner Adult Class (Coach Omar)",
        day="Wednesday",
        time="6:00 PM",
        duration=60,
        location="Harbord Collegiate Institute, 286 Harbord St, Toronto (outdoor)",
        description="Evening beginner class covering cardio tennis and rally"
    )
    
    tool.add_tennis_schedule_activity(
        name="Beginner Adult Class (Coach Ali)",
        day="Wednesday",
        time="6:00 PM",
        duration=60,
        location="Jonathan Ashbridge, 1515 Queen Street East, Toronto (outdoor)",
        description="Evening beginner class covering smashes and backhand"
    )
    
    # Thursday classes
    tool.add_tennis_schedule_activity(
        name="Beginner Adult Class (Coach Ali)",
        day="Thursday",
        time="7:00 PM",
        duration=60,
        location="Park Lawn Bubble Rink Tennis Courts, 340 Park Lawn Road, Toronto (outdoor)",
        description="Evening beginner class covering doubles strategy and smashes"
    )
    
    # Friday classes
    tool.add_tennis_schedule_activity(
        name="Beginner 1.5 Adult Class (Coach Luis)",
        day="Friday",
        time="6:00 PM",
        duration=60,
        location="Jonathan Ashbridge, 1515 Queen St E, Toronto (outdoor)",
        description="Evening intermediate beginner class covering footwork, returns, backhand, forehand, and smashes"
    )
    
    tool.add_tennis_schedule_activity(
        name="Beginner 1.5 Adult Class (Coach Omar) - Indoor",
        day="Friday",
        time="6:00 PM",
        duration=60,
        location="Niagara Street PS gym, 222 Niagara St, Toronto (indoor)",
        description="Evening indoor intermediate beginner class covering rally, serve, backhand, forehand, and footwork"
    )
    
    print(f"✅ Added {len(tool.integrated_activities)} tennis activities from Breakpoint Club")
    
    return tool


def generate_my_tennis_schedule():
    """Generate a personalized tennis schedule based on your preferences"""
    
    print("\n🎾 GENERATING YOUR PERSONALIZED TENNIS SCHEDULE")
    print("=" * 60)
    
    # Set up all tennis activities
    tool = setup_breakpoint_tennis_activities()
    
    # Create integrated planner
    planner = IntegratedCouplePlanner("Kervin", "Partner")
    
    # Generate integrated schedule for next week
    start_date = "2024-01-15"  # Update this to your desired start date
    duration = "1 week"
    
    print(f"\n📅 Generating integrated schedule from {start_date} for {duration}")
    print("Including tennis activities with couple and individual activities")
    
    # Generate the integrated schedule
    result = planner.generate_integrated_schedule(
        start_date=start_date,
        duration=duration,
        couple_focus_areas=["emotional_safety", "habit_building", "partnership"],
        include_individual_activities=True
    )
    
    return result, tool


def recommend_tennis_classes():
    """Recommend specific tennis classes based on skill level and preferences"""
    
    print("\n🎯 TENNIS CLASS RECOMMENDATIONS")
    print("=" * 50)
    
    print("""
**Based on your Breakpoint Club schedule, here are recommendations:**

🏆 **BEGINNER CLASSES (Perfect for getting started):**
• Saturday 8:00 AM - Coach Neel @ Harbord Collegiate (outdoor)
• Sunday 10:00 AM - Coach Ali @ Riverdale Collegiate (outdoor)
• Monday 12:00 PM - Coach Shivya @ Park Lawn (outdoor) - Great lunchtime option
• Wednesday 9:00 AM - Coach Neel @ Park Lawn (outdoor) - Morning workout

🏆 **INTERMEDIATE CLASSES (Beginner 1.5):**
• Saturday 1:00 PM - Coach Niki @ Crescent (indoor) - Weather-proof option
• Sunday 7:00 PM - Coach Hesh @ Crescent (indoor) - Evening indoor option
• Monday 8:00 PM - Coach Luis @ Niagara Street (indoor) - Late evening option
• Friday 6:00 PM - Coach Omar @ Niagara Street (indoor) - After work option

🏆 **WEEKEND WARRIOR OPTIONS:**
• Saturday 10:00 AM - Coach Omar @ Harbord Collegiate (outdoor)
• Sunday 1:00 PM - Coach Jamal @ Harbord Collegiate (outdoor)
• Saturday 4:00 PM - Coach Jamal @ Harbord Collegiate (outdoor)

🏆 **NETWORKING OPPORTUNITIES:**
• Monday 12:00 PM classes - Great for meeting working professionals
• Wednesday 6:00 PM classes - After work networking
• Friday 6:00 PM classes - End of week socializing

**Contact for Registration:**
📧 Email: mera@acetennis.ca
🌐 Website: https://breakpointclub.org/
    """)


def create_tennis_workout_plan():
    """Create a structured tennis workout plan"""
    
    print("\n💪 TENNIS WORKOUT PLAN")
    print("=" * 40)
    
    print("""
**Weekly Tennis Training Structure:**

📅 **MONDAY - Technical Focus**
• 12:00 PM - Coach Ali @ Jonathan Ashbridge
• Focus: Backhand technique and rally building
• Perfect for lunch break workout

📅 **WEDNESDAY - Fitness & Movement**
• 6:00 PM - Coach Omar @ Harbord Collegiate
• Focus: Cardio tennis and footwork
• Great after-work fitness session

📅 **FRIDAY - Strategy & Doubles**
• 6:00 PM - Coach Omar @ Niagara Street (indoor)
• Focus: Rally building and tactical play
• Indoor option for consistent training

📅 **SUNDAY - Comprehensive Practice**
• 10:00 AM - Coach Ali @ Riverdale Collegiate
• Focus: Challenger training and returns
• Perfect weekend morning session

**Monthly Progression:**
Week 1-2: Focus on basic strokes and movement
Week 3-4: Introduce doubles strategy and match play
Week 5-6: Advanced techniques and competitive play
Week 7-8: Tournament preparation and match tactics

**Skill Development Focus:**
• September: Backhand and net play
• October: Forehand and attack shots
• November: Serve and return techniques
• December: Footwork and positioning
    """)


def save_tennis_schedule():
    """Save tennis schedule for future reference"""
    
    print("\n💾 SAVING YOUR TENNIS SCHEDULE")
    print("=" * 40)
    
    tool = setup_breakpoint_tennis_activities()
    
    # Save to file
    tool.save_integration_data("my_breakpoint_tennis_schedule.json")
    
    # Show summary
    summary = tool.get_activity_summary()
    print(f"\n📊 Tennis Schedule Summary:")
    print(f"Total Classes: {summary['total_activities']}")
    print(f"Weekly Cost: ${summary['total_weekly_cost']:.2f} CAD")
    print(f"High Priority Classes: {summary['high_priority_activities']}")
    
    print(f"\nBy Type:")
    for activity_type, count in summary['by_type'].items():
        print(f"  {activity_type}: {count}")
    
    print(f"\nBy Frequency:")
    for frequency, count in summary['by_frequency'].items():
        print(f"  {frequency}: {count}")
    
    return tool


def main():
    """Main function to run the tennis schedule integration"""
    
    print("🎾 BREAKPOINT TENNIS SCHEDULE INTEGRATION")
    print("=" * 60)
    print("Integrating your tennis activities from Breakpoint Club")
    print("Website: https://breakpointclub.org/")
    print("Contact: mera@acetennis.ca")
    print()
    
    # Set up tennis activities
    tool = setup_breakpoint_tennis_activities()
    
    # Show recommendations
    recommend_tennis_classes()
    
    # Create workout plan
    create_tennis_workout_plan()
    
    # Save schedule
    save_tennis_schedule()
    
    # Generate integrated schedule
    print("\n" + "=" * 60)
    print("GENERATING INTEGRATED SCHEDULE")
    print("=" * 60)
    
    result, tool = generate_my_tennis_schedule()
    
    # Display the acknowledgment
    print(result["acknowledgment"])
    
    # Show sample day with tennis activities
    print("\n📅 Sample Day with Tennis Activities:")
    day_1_key = list(result["schedule"].keys())[0]
    day_1_activities = result["schedule"][day_1_key]
    
    for activity in day_1_activities:
        if activity["type"] == "individual":
            print(f"👤 {activity['time']} - {activity['end_time']}: {activity['name']}")
            print(f"   📍 {activity['location']} | 💰 ${activity['cost']:.0f}")
        else:  # couple
            markers = "🔄" if activity.get("is_habit_stacked") else "💕"
            print(f"{markers} {activity['time']} - {activity['end_time']}: {activity['name']}")
            print(f"   📍 {activity['location']} | 💰 ${activity['cost']:.0f}")
    
    print(f"\n{result['summary']}")
    
    print("\n🎉 TENNIS SCHEDULE INTEGRATION COMPLETE!")
    print("=" * 60)
    print("""
**Your Tennis Activities Are Now Integrated!**

✅ **What's Included:**
• All Breakpoint Club tennis classes from your schedule
• Beginner and Intermediate 1.5 level classes
• Indoor and outdoor options
• Morning, afternoon, and evening sessions
• Weekend and weekday classes

✅ **Integration Benefits:**
• Tennis activities are part of your comprehensive life plan
• Balanced with couple activities and individual growth
• Cost and time management included
• Networking opportunities identified
• Skill progression tracking

✅ **Next Steps:**
1. Contact mera@acetennis.ca to register for classes
2. Choose 2-3 classes per week that fit your schedule
3. Start with beginner classes and progress to 1.5 level
4. Use the integrated schedule to balance tennis with other activities

✅ **Files Created:**
• my_breakpoint_tennis_schedule.json (your tennis activities)
• Integration with existing life planner system

**Ready to elevate your tennis game and members experience! 🎾**
    """)


if __name__ == "__main__":
    main()
