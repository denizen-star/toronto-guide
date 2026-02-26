#!/usr/bin/env python3
"""
Demo script for the unified Life Planner Agent
"""

import json
import sys
import os

# Add the src directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from features.scheduling import LifePlannerAgent
from features.configuration import AppSettings
from shared.models import Persona, PersonalityType, EnergyPattern, SocialStyle


def load_persona(persona_id: str) -> Persona:
    """Load persona from JSON file"""
    try:
        with open('data/personas.json', 'r') as f:
            data = json.load(f)
            for persona_data in data.get("personas", []):
                if persona_data["id"] == persona_id:
                    return Persona.from_dict(persona_data)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error loading persona: {e}")
    
    return None


def load_settings() -> AppSettings:
    """Load settings from JSON file"""
    try:
        with open('data/settings.json', 'r') as f:
            data = json.load(f)
            return AppSettings.from_dict(data)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error loading settings: {e}")
        return AppSettings()


def main():
    """Demonstrate the unified Life Planner Agent"""
    print("🎯 Unified Life Planner Agent Demo")
    print("=" * 50)
    
    # Load settings and persona
    settings = load_settings()
    persona = load_persona("kevin_head_of_data")
    
    if not persona:
        print("Error: Could not load persona")
        return
    
    # Create planner agent
    planner = LifePlannerAgent(settings, persona)
    
    print(f"✅ Loaded persona: {persona.name}")
    print(f"✅ Loaded {len(planner.activities)} activities")
    print()
    
    # Demonstrate different schedule types
    schedule_types = [
        ("individual", "Individual Lifestyle Planning"),
        ("couple", "Couple Activity Planning"),
        ("integrated", "Integrated Individual + Couple Planning")
    ]
    
    for schedule_type, description in schedule_types:
        print(f"📅 **{description}**")
        print("-" * 40)
        
        # Generate schedule
        result = planner.generate_schedule(
            start_date="2024-01-15",
            duration="1 week",
            schedule_type=schedule_type,
            focus_areas=["fitness", "networking"]
        )
        
        if "error" in result:
            print(f"❌ Error: {result['error']}")
            continue
        
        print(result["acknowledgment"])
        print()
        
        # Show first day as example
        schedule_data = result["schedule"]
        time_slots = schedule_data.get("time_slots", [])
        
        if time_slots:
            print("**Sample Day (First Day):**")
            for i, slot_data in enumerate(time_slots[:5]):  # Show first 5 activities
                activity = slot_data["activity"]
                print(f"{i+1}. {slot_data['start_time']} - {slot_data['end_time']}: {activity['name']}")
                print(f"   💰 ${activity['cost_cad']:.0f} | 🌟 Networking: {activity['networking_potential']}/10")
                if activity['connection_depth'] > 0:
                    print(f"   💝 Connection: {activity['connection_depth']}/10 | 🛡️ Safety: {activity['emotional_safety']}/10")
                print()
        
        print(result["summary"])
        print("\n" + "=" * 50 + "\n")
    
    # Show activity statistics
    print("📊 **Activity Statistics**")
    stats = planner.get_activity_stats()
    print(f"Total Activities Available: {stats['total_activities']}")
    print(f"Activities Used: {stats['used_activities']} ({stats['usage_percentage']:.1f}%)")
    print(f"Most Used Activity: {stats['most_used_activity']} ({stats['most_used_count']} times)")


if __name__ == "__main__":
    main()

