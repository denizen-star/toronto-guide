#!/usr/bin/env python3
"""
Play-by-Play Daily Schedule Itinerary - September 15, 2025
Complete day-by-day breakdown with every activity detailed
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from planners.toronto_life_planner import TorontoLifePlanner
import datetime

def generate_play_by_play_itinerary():
    """Generate complete play-by-play daily schedule starting September 15, 2025"""
    print("📅 **PLAY-BY-PLAY DAILY SCHEDULE ITINERARY**")
    print("=" * 80)
    print("Start Date: Monday, September 15, 2025")
    print("Duration: 30 days")
    print("Format: Complete daily breakdown with every activity")
    print()
    
    # Initialize planner
    planner = TorontoLifePlanner()
    
    # Generate the plan
    start_date = "2025-09-15"
    result = planner.generate_itinerary(start_date, "1 month")
    
    print("=" * 80)
    print("📅 **COMPLETE DAILY PLAY-BY-PLAY SCHEDULE**")
    print("=" * 80)
    
    # Track statistics
    total_activities = 0
    total_cost = 0
    core_activities = 0
    additional_activities = 0
    activity_counts = {}
    
    # Display each day with complete play-by-play schedule
    for day_key, time_slots in result["itinerary"].items():
        if isinstance(time_slots, list):
            print(f"\n🗓️ **{day_key}**")
            print("=" * 80)
            
            # Sort time slots by start time
            sorted_slots = sorted(time_slots, key=lambda x: planner._time_to_minutes(x.start_time))
            
            # Display complete timeline
            print("\n⏰ **COMPLETE DAILY TIMELINE:**")
            print("-" * 50)
            
            for i, slot in enumerate(sorted_slots, 1):
                # Determine if it's a core requirement
                is_core = "Core Requirement" in slot.notes
                core_indicator = "🎯" if is_core else "📅"
                
                print(f"{core_indicator} **{i:2d}. {slot.start_time} - {slot.end_time}**")
                print(f"    **Activity:** {slot.activity.name}")
                print(f"    **Location:** {slot.activity.location}")
                print(f"    **Duration:** {slot.activity.duration_hours:.1f} hours")
                print(f"    **Cost:** ${slot.activity.cost_cad:.0f} CAD")
                print(f"    **Networking Score:** {slot.activity.social_networking_potential}/10")
                print(f"    **Tags:** {', '.join(slot.activity.tags) if slot.activity.tags else 'General'}")
                if slot.notes:
                    print(f"    **Notes:** {slot.notes}")
                print(f"    **Description:** {slot.activity.description}")
                print()
                
                # Update statistics
                total_cost += slot.activity.cost_cad
                if is_core:
                    core_activities += 1
                else:
                    additional_activities += 1
                
                activity_type = slot.activity.name
                activity_counts[activity_type] = activity_counts.get(activity_type, 0) + 1
            
            # Day summary
            day_total_cost = sum(slot.activity.cost_cad for slot in sorted_slots)
            day_networking_score = max(slot.activity.social_networking_potential for slot in sorted_slots) if sorted_slots else 0
            day_core_count = sum(1 for slot in sorted_slots if "Core Requirement" in slot.notes)
            day_additional_count = len(sorted_slots) - day_core_count
            
            print("📊 **DAY SUMMARY:**")
            print("-" * 30)
            print(f"   • **Total Activities:** {len(sorted_slots)}")
            print(f"   • **Core Requirements:** {day_core_count}")
            print(f"   • **Additional Activities:** {day_additional_count}")
            print(f"   • **Daily Cost:** ${day_total_cost:.0f} CAD")
            print(f"   • **Max Networking Score:** {day_networking_score}/10")
            print(f"   • **Core Requirements %:** {(day_core_count/len(sorted_slots))*100:.1f}%")
            
            # Time analysis
            if sorted_slots:
                first_activity = min(sorted_slots, key=lambda x: planner._time_to_minutes(x.start_time))
                last_activity = max(sorted_slots, key=lambda x: planner._time_to_minutes(x.end_time))
                print(f"   • **First Activity:** {first_activity.start_time} - {first_activity.activity.name}")
                print(f"   • **Last Activity:** {last_activity.end_time} - {last_activity.activity.name}")
            
            print()
            print("=" * 80)
            
            total_activities += len(sorted_slots)
    
    # Complete monthly summary
    print("\n" + "=" * 80)
    print("📊 **COMPLETE MONTHLY SUMMARY**")
    print("=" * 80)
    
    print(f"**Activity Breakdown:**")
    print(f"  • **Total Activities:** {total_activities}")
    print(f"  • **Core Requirements:** {core_activities}")
    print(f"  • **Additional Activities:** {additional_activities}")
    print(f"  • **Core Requirements %:** {(core_activities/total_activities)*100:.1f}%")
    print()
    
    print(f"**Financial Summary:**")
    print(f"  • **Total Monthly Cost:** ${total_cost:.0f} CAD")
    print(f"  • **Average Daily Cost:** ${total_cost/30:.0f} CAD")
    print(f"  • **Average Weekly Cost:** ${total_cost/4:.0f} CAD")
    print(f"  • **Cost per Activity:** ${total_cost/total_activities:.0f} CAD")
    print()
    
    print("**Most Frequent Activities (Top 20):**")
    sorted_activities = sorted(activity_counts.items(), key=lambda x: x[1], reverse=True)
    for i, (activity, count) in enumerate(sorted_activities[:20], 1):
        print(f"  {i:2d}. {activity}: {count} times")
    
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
            print(f"  • **Week {i}:** ${cost:.0f} CAD")
    
    print()
    print("**Activity Type Distribution:**")
    # Group activities by type
    activity_types = {}
    for activity, count in activity_counts.items():
        if "Core Requirement" in activity or any(tag in activity.lower() for tag in ['work', 'commute', 'running', 'meditation', 'grooming', 'laundry', 'grocery']):
            category = "Core Requirements"
        elif any(tag in activity.lower() for tag in ['comedy', 'show', 'play', 'drag', 'theater']):
            category = "Entertainment"
        elif any(tag in activity.lower() for tag in ['wine', 'dinner', 'restaurant', 'cooking']):
            category = "Dining & Social"
        elif any(tag in activity.lower() for tag in ['gallery', 'art', 'jazz', 'cultural']):
            category = "Cultural"
        elif any(tag in activity.lower() for tag in ['wake', 'shower', 'grooming', 'bedtime']):
            category = "Personal Care"
        else:
            category = "Other"
        
        if category not in activity_types:
            activity_types[category] = 0
        activity_types[category] += count
    
    for category, count in sorted(activity_types.items(), key=lambda x: x[1], reverse=True):
        print(f"  • **{category}:** {count} activities ({(count/total_activities)*100:.1f}%)")
    
    print()
    print("✅ **PLAY-BY-PLAY ITINERARY COMPLETE**")
    print("This comprehensive schedule shows every single activity")
    print("with complete details for your entire month in Toronto!")

if __name__ == "__main__":
    generate_play_by_play_itinerary()
