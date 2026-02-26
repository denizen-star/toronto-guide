#!/usr/bin/env python3
"""
One Month Core Schedule Requirements Plan
Focuses exclusively on essential activities and routines
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from planners.toronto_life_planner import TorontoLifePlanner
import datetime

def generate_core_schedule_month():
    """Generate a one-month plan with only Core Schedule Requirements"""
    print("🎯 **ONE MONTH CORE SCHEDULE REQUIREMENTS PLAN**")
    print("=" * 60)
    print("Focus: Essential activities and routines only")
    print("Duration: 1 month (4 weeks)")
    print("Start Date: January 15, 2024")
    print()
    
    # Initialize planner
    planner = TorontoLifePlanner()
    
    # Generate the plan
    start_date = "2024-01-15"
    result = planner.generate_itinerary(start_date, "1 month")
    
    # Show core requirements status
    print("📋 **CORE REQUIREMENTS OVERVIEW**")
    print("-" * 40)
    status = planner.get_core_requirements_status()
    
    for category, details in status.items():
        print(f"\n{category.replace('_', ' ').title()}:")
        for key, value in details.items():
            print(f"  • {key.replace('_', ' ').title()}: {value}")
    
    print("\n" + "=" * 60)
    print("📅 **DAILY CORE SCHEDULE BREAKDOWN**")
    print("=" * 60)
    
    # Show each day with only core requirements
    week_count = 0
    for day_key, time_slots in result["itinerary"].items():
        if isinstance(time_slots, list):
            # Filter to only show core requirements
            core_slots = [slot for slot in time_slots if "Core Requirement" in slot.notes]
            
            if core_slots:  # Only show days with core requirements
                print(f"\n{day_key}")
                print("-" * 50)
                
                for slot in core_slots:
                    print(f"🎯 {slot.start_time} - {slot.end_time}: {slot.activity.name}")
                    print(f"   📝 {slot.notes}")
                    print(f"   💰 Cost: ${slot.activity.cost_cad:.0f} CAD")
                    print(f"   📍 Location: {slot.activity.location}")
                    print(f"   🏷️ Tags: {', '.join(slot.activity.tags) if slot.activity.tags else 'General'}")
                    print()
                
                # Track weeks
                if "Monday" in day_key:
                    week_count += 1
                    if week_count <= 4:  # Show only first 4 weeks
                        print(f"📊 **Week {week_count} Summary:**")
                        print(f"   • Core Activities: {len(core_slots)}")
                        print(f"   • Total Cost: ${sum(slot.activity.cost_cad for slot in core_slots):.0f} CAD")
                        print()
    
    print("=" * 60)
    print("📊 **MONTHLY CORE SCHEDULE SUMMARY**")
    print("=" * 60)
    
    # Calculate monthly totals
    total_core_activities = 0
    total_cost = 0
    activity_counts = {}
    
    for day_key, time_slots in result["itinerary"].items():
        if isinstance(time_slots, list):
            core_slots = [slot for slot in time_slots if "Core Requirement" in slot.notes]
            total_core_activities += len(core_slots)
            
            for slot in core_slots:
                total_cost += slot.activity.cost_cad
                activity_type = slot.activity.name
                activity_counts[activity_type] = activity_counts.get(activity_type, 0) + 1
    
    print(f"Total Core Activities: {total_core_activities}")
    print(f"Total Monthly Cost: ${total_cost:.0f} CAD")
    print(f"Average Daily Cost: ${total_cost/30:.0f} CAD")
    print()
    
    print("**Activity Frequency:**")
    for activity, count in sorted(activity_counts.items()):
        print(f"  • {activity}: {count} times")
    
    print("\n" + "=" * 60)
    print("✅ **CORE SCHEDULE COMPLETE**")
    print("This plan includes only your essential activities and routines.")
    print("All activities are automatically scheduled and conflict-free.")

if __name__ == "__main__":
    generate_core_schedule_month()
