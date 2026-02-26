#!/usr/bin/env python3
"""
Weekly Breakdown of Core Schedule Requirements
Organized by week for easy planning and tracking
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from planners.toronto_life_planner import TorontoLifePlanner
import datetime

def generate_weekly_breakdown():
    """Generate a weekly breakdown of Core Schedule Requirements"""
    print("📅 **CORE SCHEDULE REQUIREMENTS - WEEKLY BREAKDOWN**")
    print("=" * 70)
    print("Duration: 1 month (4 weeks)")
    print("Start Date: January 15, 2024")
    print()
    
    # Initialize planner
    planner = TorontoLifePlanner()
    
    # Generate the plan
    start_date = "2024-01-15"
    result = planner.generate_itinerary(start_date, "1 month")
    
    # Organize by weeks
    weeks = {}
    current_week = 1
    week_start_date = datetime.datetime(2024, 1, 15)
    
    for day_key, time_slots in result["itinerary"].items():
        if isinstance(time_slots, list):
            # Extract date from day_key
            date_str = day_key.split(": ")[1] if ": " in day_key else day_key
            day_date = datetime.datetime.strptime(date_str, "%A, %B %d, %Y")
            
            # Determine which week this day belongs to
            days_diff = (day_date - week_start_date).days
            week_num = (days_diff // 7) + 1
            
            if week_num not in weeks:
                weeks[week_num] = []
            
            # Filter to only core requirements
            core_slots = [slot for slot in time_slots if "Core Requirement" in slot.notes]
            if core_slots:
                weeks[week_num].append({
                    'day': day_key,
                    'date': date_str,
                    'activities': core_slots
                })
    
    # Display each week
    for week_num in sorted(weeks.keys()):
        print(f"🗓️ **WEEK {week_num}**")
        print("=" * 50)
        
        week_activities = weeks[week_num]
        total_cost = 0
        activity_count = 0
        
        for day_info in week_activities:
            print(f"\n📅 {day_info['day']}")
            print("-" * 40)
            
            for slot in day_info['activities']:
                print(f"🎯 {slot.start_time} - {slot.end_time}: {slot.activity.name}")
                print(f"   📝 {slot.notes}")
                print(f"   💰 Cost: ${slot.activity.cost_cad:.0f} CAD")
                print(f"   📍 Location: {slot.activity.location}")
                print(f"   🏷️ Tags: {', '.join(slot.activity.tags) if slot.activity.tags else 'General'}")
                print()
                
                total_cost += slot.activity.cost_cad
                activity_count += 1
        
        # Week summary
        print(f"📊 **Week {week_num} Summary:**")
        print(f"   • Total Core Activities: {activity_count}")
        print(f"   • Total Cost: ${total_cost:.0f} CAD")
        print(f"   • Average Daily Cost: ${total_cost/7:.0f} CAD")
        
        # Activity breakdown for the week
        week_activity_types = {}
        for day_info in week_activities:
            for slot in day_info['activities']:
                activity_type = slot.activity.name
                week_activity_types[activity_type] = week_activity_types.get(activity_type, 0) + 1
        
        print(f"   • Activity Types: {len(week_activity_types)} different activities")
        print()
    
    # Monthly summary
    print("=" * 70)
    print("📊 **MONTHLY SUMMARY**")
    print("=" * 70)
    
    total_monthly_cost = 0
    total_monthly_activities = 0
    monthly_activity_types = {}
    
    for week_num in sorted(weeks.keys()):
        week_activities = weeks[week_num]
        for day_info in week_activities:
            for slot in day_info['activities']:
                total_monthly_cost += slot.activity.cost_cad
                total_monthly_activities += 1
                activity_type = slot.activity.name
                monthly_activity_types[activity_type] = monthly_activity_types.get(activity_type, 0) + 1
    
    print(f"Total Core Activities: {total_monthly_activities}")
    print(f"Total Monthly Cost: ${total_monthly_cost:.0f} CAD")
    print(f"Average Weekly Cost: ${total_monthly_cost/4:.0f} CAD")
    print(f"Average Daily Cost: ${total_monthly_cost/30:.0f} CAD")
    print()
    
    print("**Weekly Cost Breakdown:**")
    for week_num in sorted(weeks.keys()):
        week_cost = sum(
            sum(slot.activity.cost_cad for slot in day_info['activities'])
            for day_info in weeks[week_num]
        )
        print(f"  • Week {week_num}: ${week_cost:.0f} CAD")
    
    print()
    print("**Most Frequent Activities:**")
    sorted_activities = sorted(monthly_activity_types.items(), key=lambda x: x[1], reverse=True)
    for activity, count in sorted_activities[:10]:  # Top 10
        print(f"  • {activity}: {count} times")
    
    print()
    print("✅ **CORE SCHEDULE COMPLETE**")
    print("This weekly breakdown shows your essential activities organized by week.")
    print("All activities are automatically scheduled and conflict-free.")

if __name__ == "__main__":
    generate_weekly_breakdown()
