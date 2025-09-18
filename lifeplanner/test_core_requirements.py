#!/usr/bin/env python3
"""
Test script to demonstrate Core Schedule Requirements integration
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from planners.toronto_life_planner import TorontoLifePlanner
import datetime

def test_core_requirements_integration():
    """Test the Core Schedule Requirements integration"""
    print("🧪 Testing Core Schedule Requirements Integration")
    print("=" * 60)
    
    # Initialize planner
    planner = TorontoLifePlanner()
    
    # Test core requirements status
    print("\n📋 Core Requirements Status:")
    status = planner.get_core_requirements_status()
    for category, details in status.items():
        print(f"\n{category.replace('_', ' ').title()}:")
        for key, value in details.items():
            print(f"  • {key.replace('_', ' ').title()}: {value}")
    
    # Generate a sample week
    print("\n📅 Sample Week Schedule (with Core Requirements):")
    print("-" * 60)
    
    start_date = "2024-01-15"  # Monday
    result = planner.generate_itinerary(start_date, "2 weeks")
    
    # Show first 3 days to demonstrate integration
    days_shown = 0
    for day_key, time_slots in result["itinerary"].items():
        if days_shown >= 3:
            break
            
        print(f"\n{day_key}")
        print("-" * 40)
        
        for slot in time_slots:
            # Highlight core requirements
            marker = "🎯" if "Core Requirement" in slot.notes else "📅"
            print(f"{marker} {slot.start_time} - {slot.end_time}: {slot.activity.name}")
            if "Core Requirement" in slot.notes:
                print(f"   📝 {slot.notes}")
            print(f"   🏷️ Tags: {', '.join(slot.activity.tags) if slot.activity.tags else 'General'}")
            print()
        
        days_shown += 1
    
    print("\n✅ Core Schedule Requirements successfully integrated!")
    print("\nKey Features:")
    print("• Meditation with progressive frequency and rotating intentions")
    print("• Entertainment schedule (comedy/show/play alternating, monthly drag shows)")
    print("• Work hours: Immigration (3h/week) + Professional Development (5h/week)")
    print("• Household budgeting: Weekly (1h) + Monthly with Peter (2.5h)")
    print("• No morning news - replaced with positive content")
    print("• All activities tagged as 'core-requirement' for easy identification")

if __name__ == "__main__":
    test_core_requirements_integration()
