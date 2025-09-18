#!/usr/bin/env python3
"""
Detailed One Month Daily Plan - September 15, 2025
Comprehensive daily schedule with all activities and core requirements
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from planners.toronto_life_planner import TorontoLifePlanner
import datetime

def generate_september_2025_plan():
    """Generate detailed one-month daily plan starting September 15, 2025"""
    print("📅 **DETAILED ONE MONTH DAILY PLAN**")
    print("=" * 70)
    print("Start Date: Monday, September 15, 2025")
    print("Duration: 30 days")
    print("Focus: Complete daily schedule with Core Requirements + Additional Activities")
    print()
    
    # Initialize planner
    planner = TorontoLifePlanner()
    
    # Generate the plan
    start_date = "2025-09-15"
    result = planner.generate_itinerary(start_date, "1 month")
    
    # Show core requirements status
    print("📋 **CORE REQUIREMENTS OVERVIEW**")
    print("-" * 50)
    status = planner.get_core_requirements_status()
    
    for category, details in status.items():
        print(f"\n{category.replace('_', ' ').title()}:")
        for key, value in details.items():
            print(f"  • {key.replace('_', ' ').title()}: {value}")
    
    print("\n" + "=" * 70)
    print("📅 **DAILY DETAILED SCHEDULE**")
    print("=" * 70)
    
    # Track monthly statistics
    total_activities = 0
    total_cost = 0
    core_activities = 0
    additional_activities = 0
    activity_counts = {}
    
    # Display each day with full schedule
    for day_key, time_slots in result["itinerary"].items():
        if isinstance(time_slots, list):
            print(f"\n🗓️ **{day_key}**")
            print("=" * 60)
            
            # Separate core requirements from additional activities
            core_slots = [slot for slot in time_slots if "Core Requirement" in slot.notes]
            additional_slots = [slot for slot in time_slots if "Core Requirement" not in slot.notes]
            
            # Display core requirements first
            if core_slots:
                print("\n🎯 **CORE REQUIREMENTS:**")
                print("-" * 30)
                for slot in core_slots:
                    print(f"⏰ {slot.start_time} - {slot.end_time}: {slot.activity.name}")
                    print(f"   📝 {slot.notes}")
                    print(f"   💰 Cost: ${slot.activity.cost_cad:.0f} CAD")
                    print(f"   📍 Location: {slot.activity.location}")
                    print(f"   🏷️ Tags: {', '.join(slot.activity.tags) if slot.activity.tags else 'General'}")
                    print()
                    
                    total_cost += slot.activity.cost_cad
                    core_activities += 1
                    activity_type = slot.activity.name
                    activity_counts[activity_type] = activity_counts.get(activity_type, 0) + 1
            
            # Display additional activities
            if additional_slots:
                print("\n📅 **ADDITIONAL ACTIVITIES:**")
                print("-" * 30)
                for slot in additional_slots:
                    print(f"⏰ {slot.start_time} - {slot.end_time}: {slot.activity.name}")
                    print(f"   💰 Cost: ${slot.activity.cost_cad:.0f} CAD")
                    print(f"   📍 Location: {slot.activity.location}")
                    print(f"   🌟 Networking: {slot.activity.social_networking_potential}/10")
                    print(f"   🏷️ Tags: {', '.join(slot.activity.tags) if slot.activity.tags else 'General'}")
                    print()
                    
                    total_cost += slot.activity.cost_cad
                    additional_activities += 1
                    activity_type = slot.activity.name
                    activity_counts[activity_type] = activity_counts.get(activity_type, 0) + 1
            
            # Day summary
            day_total_cost = sum(slot.activity.cost_cad for slot in time_slots)
            day_networking_score = max(slot.activity.social_networking_potential for slot in time_slots) if time_slots else 0
            
            print(f"📊 **Day Summary:**")
            print(f"   • Total Activities: {len(time_slots)}")
            print(f"   • Core Requirements: {len(core_slots)}")
            print(f"   • Additional Activities: {len(additional_slots)}")
            print(f"   • Daily Cost: ${day_total_cost:.0f} CAD")
            print(f"   • Max Networking Score: {day_networking_score}/10")
            print()
            
            total_activities += len(time_slots)
    
    # Monthly summary
    print("=" * 70)
    print("📊 **MONTHLY SUMMARY**")
    print("=" * 70)
    
    print(f"**Activity Breakdown:**")
    print(f"  • Total Activities: {total_activities}")
    print(f"  • Core Requirements: {core_activities}")
    print(f"  • Additional Activities: {additional_activities}")
    print(f"  • Core Requirements %: {(core_activities/total_activities)*100:.1f}%")
    print()
    
    print(f"**Financial Summary:**")
    print(f"  • Total Monthly Cost: ${total_cost:.0f} CAD")
    print(f"  • Average Daily Cost: ${total_cost/30:.0f} CAD")
    print(f"  • Average Weekly Cost: ${total_cost/4:.0f} CAD")
    print()
    
    print("**Most Frequent Activities:**")
    sorted_activities = sorted(activity_counts.items(), key=lambda x: x[1], reverse=True)
    for activity, count in sorted_activities[:15]:  # Top 15
        print(f"  • {activity}: {count} times")
    
    print()
    print("**Weekly Cost Distribution:**")
    # Calculate weekly costs
    week_costs = [0, 0, 0, 0, 0]  # 5 weeks
    week_count = 0
    current_week_cost = 0
    
    for day_key, time_slots in result["itinerary"].items():
        if isinstance(time_slots, list):
            day_cost = sum(slot.activity.cost_cad for slot in time_slots)
            current_week_cost += day_cost
            
            # Check if it's a Sunday (end of week)
            if "Sunday" in day_key:
                week_costs[week_count] = current_week_cost
                week_count += 1
                current_week_cost = 0
    
    # Handle remaining days
    if current_week_cost > 0:
        week_costs[week_count] = current_week_cost
    
    for i, cost in enumerate(week_costs, 1):
        if cost > 0:
            print(f"  • Week {i}: ${cost:.0f} CAD")
    
    print()
    print("✅ **DETAILED PLAN COMPLETE**")
    print("This comprehensive plan includes all your core requirements")
    print("plus additional activities for a balanced lifestyle in Toronto.")

if __name__ == "__main__":
    generate_september_2025_plan()
