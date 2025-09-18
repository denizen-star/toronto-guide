#!/usr/bin/env python3
"""
My Swimming Schedule Integration
Based on the swimming team schedules from your images:

1. The Toronto Athletic Club - Masters Swim Team
2. The Downtown Swim Club (DSC) 
3. Southern Ontario Trillium Y Masters Swim Club

This script integrates your swimming activities into the life planner system.
"""

from activity_integration_tool import ActivityIntegrationTool, ScheduleType
from integrated_couple_planner import IntegratedCouplePlanner
import datetime


def setup_swimming_activities():
    """Set up swimming activities based on the three swim clubs from your images"""
    
    print("🏊‍♂️ SETTING UP SWIMMING ACTIVITIES")
    print("=" * 50)
    print("Based on your swimming team schedules:")
    print("1. The Toronto Athletic Club")
    print("2. The Downtown Swim Club (DSC)")
    print("3. Southern Ontario Trillium Y Masters Swim Club")
    print()
    
    # Create integration tool
    tool = ActivityIntegrationTool()
    
    # THE TORONTO ATHLETIC CLUB - MASTERS SWIM TEAM
    print("🏊‍♂️ Adding The Toronto Athletic Club Masters Swim...")
    
    tool.add_fitness_class_activity(
        name="Masters Swim - Monday Morning",
        day="Monday",
        time="7:30 AM",
        duration=90,
        location="The Toronto Athletic Club (50m pool)",
        cost=35.0,  # Estimated cost for private club
        description="Morning masters swim practice in 50m pool"
    )
    
    tool.add_fitness_class_activity(
        name="Masters Swim - Wednesday Morning",
        day="Wednesday",
        time="7:30 AM",
        duration=90,
        location="The Toronto Athletic Club (50m pool)",
        cost=35.0,
        description="Morning masters swim practice in 50m pool"
    )
    
    tool.add_fitness_class_activity(
        name="Masters Swim - Thursday Evening",
        day="Thursday",
        time="9:00 PM",
        duration=120,
        location="The Toronto Athletic Club (50m pool)",
        cost=35.0,
        description="Evening masters swim practice in 50m pool"
    )
    
    tool.add_fitness_class_activity(
        name="Masters Swim - Friday Evening",
        day="Friday",
        time="8:30 PM",
        duration=120,
        location="The Toronto Athletic Club (25yd pool)",
        cost=35.0,
        description="Evening masters swim practice in 25yd pool"
    )
    
    tool.add_fitness_class_activity(
        name="Masters Swim - Sunday Morning",
        day="Sunday",
        time="10:00 AM",
        duration=120,
        location="The Toronto Athletic Club (50m pool)",
        cost=35.0,
        description="Sunday morning masters swim practice in 50m pool"
    )
    
    # THE DOWNTOWN SWIM CLUB (DSC)
    print("🏊‍♂️ Adding The Downtown Swim Club (DSC)...")
    
    tool.add_fitness_class_activity(
        name="DSC Masters Swim - Tuesday Evening",
        day="Tuesday",
        time="7:00 PM",
        duration=120,
        location="Jimmie Simpson Recreation Centre",
        cost=15.0,  # Community center pricing
        description="Downtown Swim Club masters practice - two sessions: 7:00-8:00 PM and 8:00-9:00 PM"
    )
    
    tool.add_fitness_class_activity(
        name="DSC Masters Swim - Wednesday Evening",
        day="Wednesday",
        time="9:00 PM",
        duration=60,
        location="Wellesley Community Centre",
        cost=15.0,
        description="Downtown Swim Club masters practice"
    )
    
    tool.add_fitness_class_activity(
        name="DSC Masters Swim - Thursday Evening",
        day="Thursday",
        time="8:00 PM",
        duration=75,
        location="Pam McConnell Aquatic Centre",
        cost=15.0,
        description="Downtown Swim Club masters practice"
    )
    
    tool.add_fitness_class_activity(
        name="DSC Masters Swim - Saturday Afternoon",
        day="Saturday",
        time="5:00 PM",
        duration=75,
        location="University of Toronto - Varsity Pool",
        cost=15.0,
        description="Downtown Swim Club masters practice at UofT Varsity Pool"
    )
    
    # SOUTHERN ONTARIO TRILLIUM Y MASTERS SWIM CLUB
    print("🏊‍♂️ Adding Southern Ontario Trillium Y Masters...")
    
    # This club trains at Toronto Sheppard Ave. YMCA Centre
    # Contact: Chris Smith (416) 444-1885, chrismith32@hotmail.com
    # Website: http://tymswimteam.com/
    
    tool.add_fitness_class_activity(
        name="Trillium Y Masters Swim",
        day="Tuesday",
        time="7:00 PM",
        duration=90,
        location="Toronto Sheppard Ave. YMCA Centre, 567 Sheppard Avenue East",
        cost=20.0,  # YMCA pricing
        description="Southern Ontario Trillium Y Masters Swim Club practice - 40 swimmers registered, 15 competing"
    )
    
    tool.add_fitness_class_activity(
        name="Trillium Y Masters Swim - Weekend",
        day="Saturday",
        time="10:00 AM",
        duration=90,
        location="Toronto Sheppard Ave. YMCA Centre, 567 Sheppard Avenue East",
        cost=20.0,
        description="Weekend masters swim practice at YMCA"
    )
    
    # Add additional swimming activities for variety
    print("🏊‍♂️ Adding Additional Swimming Options...")
    
    # Open swim times at community centers
    tool.add_fitness_class_activity(
        name="Open Swim - Morning",
        day="Monday",
        time="6:00 AM",
        duration=60,
        location="Local Community Pool",
        cost=5.0,
        description="Morning open swim for individual practice"
    )
    
    tool.add_fitness_class_activity(
        name="Open Swim - Evening",
        day="Wednesday",
        time="8:00 PM",
        duration=60,
        location="Local Community Pool",
        cost=5.0,
        description="Evening open swim for individual practice"
    )
    
    print(f"✅ Added {len(tool.integrated_activities)} swimming activities")
    
    return tool


def recommend_swimming_schedule():
    """Recommend swimming schedule based on different goals and preferences"""
    
    print("\n🏊‍♂️ SWIMMING SCHEDULE RECOMMENDATIONS")
    print("=" * 50)
    
    print("""
**SWIMMING CLUB COMPARISON:**

🏆 **THE TORONTO ATHLETIC CLUB** (Premium Option)
• Cost: ~$35 per session
• Facilities: 50m and 25yd pools
• Schedule: Mon/Wed mornings (7:30-9:00 AM), Thu/Fri evenings, Sunday morning
• Best for: Serious competitive swimmers, premium facilities
• Contact: Private club membership required

🏆 **THE DOWNTOWN SWIM CLUB (DSC)** (Community Option)
• Cost: ~$15 per session
• Facilities: Various community centers and UofT Varsity Pool
• Schedule: Tue/Wed/Thu evenings, Saturday afternoon
• Best for: Competitive swimmers on a budget, community feel
• Website: www.dsctoronto.ca/calendar
• Contact: Check website for registration

🏆 **SOUTHERN ONTARIO TRILLIUM Y MASTERS** (YMCA Option)
• Cost: ~$20 per session
• Facilities: Toronto Sheppard Ave. YMCA Centre
• Schedule: Tuesday evenings, Saturday mornings
• Best for: Balanced approach, YMCA membership benefits
• Contact: Chris Smith (416) 444-1885, chrismith32@hotmail.com
• Website: http://tymswimteam.com/

**RECOMMENDED SCHEDULES:**

🎯 **COMPETITIVE TRAINING (5-6 sessions/week):**
• Monday: Toronto Athletic Club 7:30 AM (50m pool)
• Tuesday: DSC 7:00 PM @ Jimmie Simpson
• Wednesday: Toronto Athletic Club 7:30 AM (50m pool)
• Thursday: DSC 8:00 PM @ Pam McConnell Aquatic Centre
• Friday: Toronto Athletic Club 8:30 PM (25yd pool)
• Sunday: Toronto Athletic Club 10:00 AM (50m pool)

🎯 **BALANCED TRAINING (3-4 sessions/week):**
• Monday: Open Swim 6:00 AM @ Community Pool
• Tuesday: Trillium Y Masters 7:00 PM @ YMCA
• Thursday: DSC 8:00 PM @ Pam McConnell Aquatic Centre
• Saturday: DSC 5:00 PM @ UofT Varsity Pool

🎯 **CASUAL FITNESS (2-3 sessions/week):**
• Tuesday: Trillium Y Masters 7:00 PM @ YMCA
• Thursday: DSC 8:00 PM @ Pam McConnell Aquatic Centre
• Saturday: DSC 5:00 PM @ UofT Varsity Pool

🎯 **BUDGET-FRIENDLY (2 sessions/week):**
• Tuesday: DSC 7:00 PM @ Jimmie Simpson
• Saturday: DSC 5:00 PM @ UofT Varsity Pool
• Total weekly cost: ~$30
    """)


def create_swimming_workout_plan():
    """Create a structured swimming workout plan"""
    
    print("\n💪 SWIMMING WORKOUT PLAN")
    print("=" * 40)
    
    print("""
**Weekly Swimming Training Structure:**

📅 **MONDAY - Endurance & Technique**
• 7:30 AM - Toronto Athletic Club (50m pool)
• Focus: Long distance swimming, stroke technique
• Perfect start to the week

📅 **TUESDAY - Speed & Intervals**
• 7:00 PM - DSC @ Jimmie Simpson or Trillium Y @ YMCA
• Focus: Interval training, sprint work
• Great after-work session

📅 **WEDNESDAY - Recovery & Drills**
• 7:30 AM - Toronto Athletic Club (50m pool)
• Focus: Technique drills, recovery swimming
• Mid-week technique focus

📅 **THURSDAY - Strength & Power**
• 8:00 PM - DSC @ Pam McConnell Aquatic Centre
• Focus: Power training, strength building
• Evening intensity session

📅 **FRIDAY - Race Preparation**
• 8:30 PM - Toronto Athletic Club (25yd pool)
• Focus: Race pace, starts and turns
• End of week race prep

📅 **SATURDAY - Competition Simulation**
• 5:00 PM - DSC @ UofT Varsity Pool
• Focus: Race simulation, competitive swimming
• Weekend competition practice

📅 **SUNDAY - Long Distance**
• 10:00 AM - Toronto Athletic Club (50m pool)
• Focus: Endurance, long distance swimming
• Weekend endurance session

**Monthly Progression:**
Week 1-2: Build base endurance and technique
Week 3-4: Introduce speed work and intervals
Week 5-6: Focus on race preparation and power
Week 7-8: Competition preparation and peak performance

**Skill Development Focus:**
• Freestyle technique and endurance
• Backstroke form and consistency
• Breaststroke timing and power
• Butterfly technique and strength
• Starts, turns, and finishes
    """)


def swimming_contact_information():
    """Display contact information for all swimming clubs"""
    
    print("\n📞 SWIMMING CLUB CONTACT INFORMATION")
    print("=" * 50)
    
    print("""
**THE TORONTO ATHLETIC CLUB**
• Type: Private Athletic Club
• Membership: Required
• Facilities: 50m and 25yd pools
• Schedule: Mon/Wed 7:30-9:00 AM, Thu 9:00-11:00 PM, Fri 8:30-10:30 PM, Sun 10:00 AM-12:00 PM
• Contact: Check their website for membership information

**THE DOWNTOWN SWIM CLUB (DSC)**
• Website: www.dsctoronto.ca/calendar
• Schedule: Tue 7:00-9:00 PM (Jimmie Simpson), Wed 9:00-10:00 PM (Wellesley), 
  Thu 8:00-9:15 PM (Pam McConnell), Sat 5:00-6:15 PM (UofT Varsity)
• Facilities: Community centers and university pools
• Cost: ~$15 per session
• Contact: Check website for registration details

**SOUTHERN ONTARIO TRILLIUM Y MASTERS SWIM CLUB**
• Contact Person: Chris Smith
• Phone: (416) 444-1885
• Email: chrismith32@hotmail.com
• Website: http://tymswimteam.com/
• Training Facility: Toronto Sheppard Ave. YMCA Centre
• Address: 567 Sheppard Avenue East
• Statistics: 40 swimmers registered, 15 competing, 56 swims in 2025
• Cost: ~$20 per session (YMCA membership benefits)
• Club Code: TYMS
• Region: Ontario, GTA

**REGISTRATION TIPS:**
1. Contact clubs directly for current pricing and availability
2. Ask about trial sessions before committing
3. Inquire about membership benefits and packages
4. Check if equipment (goggles, caps) is provided or required
5. Ask about coaching levels and training intensity
    """)


def save_swimming_schedule():
    """Save swimming schedule for future reference"""
    
    print("\n💾 SAVING YOUR SWIMMING SCHEDULE")
    print("=" * 40)
    
    tool = setup_swimming_activities()
    
    # Save to file
    tool.save_integration_data("my_swimming_schedule.json")
    
    # Show summary
    summary = tool.get_activity_summary()
    print(f"\n📊 Swimming Schedule Summary:")
    print(f"Total Sessions: {summary['total_activities']}")
    print(f"Weekly Cost: ${summary['total_weekly_cost']:.2f} CAD")
    print(f"High Priority Sessions: {summary['high_priority_activities']}")
    
    print(f"\nBy Type:")
    for activity_type, count in summary['by_type'].items():
        print(f"  {activity_type}: {count}")
    
    print(f"\nBy Frequency:")
    for frequency, count in summary['by_frequency'].items():
        print(f"  {frequency}: {count}")
    
    return tool


def generate_complete_fitness_schedule():
    """Generate a complete schedule combining tennis and swimming"""
    
    print("\n🏃‍♂️🏊‍♂️ COMPLETE FITNESS SCHEDULE")
    print("=" * 50)
    
    # Set up both tennis and swimming activities
    print("Setting up comprehensive fitness activities...")
    
    # Create integration tool
    tool = ActivityIntegrationTool()
    
    # Add swimming activities
    swimming_tool = setup_swimming_activities()
    tool.integrated_activities.extend(swimming_tool.integrated_activities)
    
    # Add tennis activities (from previous script)
    from my_breakpoint_tennis_schedule import setup_breakpoint_tennis_activities
    tennis_tool = setup_breakpoint_tennis_activities()
    tool.integrated_activities.extend(tennis_tool.integrated_activities)
    
    print(f"✅ Total activities: {len(tool.integrated_activities)}")
    print(f"   - Swimming: {len(swimming_tool.integrated_activities)}")
    print(f"   - Tennis: {len(tennis_tool.integrated_activities)}")
    
    # Create integrated planner
    planner = IntegratedCouplePlanner("Kervin", "Partner")
    
    # Generate integrated schedule
    start_date = "2024-01-15"
    duration = "1 week"
    
    print(f"\n📅 Generating complete integrated schedule...")
    
    result = planner.generate_integrated_schedule(
        start_date=start_date,
        duration=duration,
        couple_focus_areas=["emotional_safety", "habit_building", "partnership"],
        include_individual_activities=True
    )
    
    # Save complete schedule
    tool.save_integration_data("my_complete_fitness_schedule.json")
    
    return result, tool


def main():
    """Main function to run the swimming schedule integration"""
    
    print("🏊‍♂️ SWIMMING SCHEDULE INTEGRATION")
    print("=" * 60)
    print("Integrating swimming activities from your team schedules:")
    print("1. The Toronto Athletic Club")
    print("2. The Downtown Swim Club (DSC)")
    print("3. Southern Ontario Trillium Y Masters Swim Club")
    print()
    
    # Set up swimming activities
    tool = setup_swimming_activities()
    
    # Show recommendations
    recommend_swimming_schedule()
    
    # Create workout plan
    create_swimming_workout_plan()
    
    # Show contact information
    swimming_contact_information()
    
    # Save schedule
    save_swimming_schedule()
    
    # Generate complete fitness schedule
    print("\n" + "=" * 60)
    print("GENERATING COMPLETE FITNESS SCHEDULE")
    print("=" * 60)
    
    result, tool = generate_complete_fitness_schedule()
    
    # Display the acknowledgment
    print(result["acknowledgment"])
    
    # Show sample day with fitness activities
    print("\n📅 Sample Day with Tennis & Swimming:")
    day_1_key = list(result["schedule"].keys())[0]
    day_1_activities = result["schedule"][day_1_key]
    
    for activity in day_1_activities:
        if activity["type"] == "individual":
            activity_icon = "🏊‍♂️" if "swim" in activity["name"].lower() else "🎾" if "tennis" in activity["name"].lower() else "👤"
            print(f"{activity_icon} {activity['time']} - {activity['end_time']}: {activity['name']}")
            print(f"   📍 {activity['location']} | 💰 ${activity['cost']:.0f}")
        else:  # couple
            markers = "🔄" if activity.get("is_habit_stacked") else "💕"
            print(f"{markers} {activity['time']} - {activity['end_time']}: {activity['name']}")
            print(f"   📍 {activity['location']} | 💰 ${activity['cost']:.0f}")
    
    print(f"\n{result['summary']}")
    
    print("\n🎉 SWIMMING SCHEDULE INTEGRATION COMPLETE!")
    print("=" * 60)
    print("""
**Your Swimming Activities Are Now Integrated!**

✅ **What's Included:**
• The Toronto Athletic Club masters swim sessions
• Downtown Swim Club (DSC) community practices
• Southern Ontario Trillium Y Masters Swim Club
• Open swim options for individual practice
• Complete contact information for all clubs

✅ **Integration Benefits:**
• Swimming activities are part of your comprehensive life plan
• Balanced with tennis, couple activities, and individual growth
• Multiple club options for different budgets and schedules
• Professional coaching and competitive opportunities
• Complete fitness routine with cross-training benefits

✅ **Next Steps:**
1. Contact the swimming clubs to inquire about membership and pricing
2. Choose 2-4 swimming sessions per week that fit your schedule
3. Combine with tennis for complete fitness routine
4. Use the integrated schedule to balance fitness with other activities

✅ **Files Created:**
• my_swimming_schedule.json (your swimming activities)
• my_complete_fitness_schedule.json (tennis + swimming combined)
• Integration with existing life planner system

**Ready to dive into your swimming fitness journey! 🏊‍♂️**
    """)


if __name__ == "__main__":
    main()
