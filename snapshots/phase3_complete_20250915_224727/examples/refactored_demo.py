#!/usr/bin/env python3
"""
Demo script for the refactored Life Planner Application
"""

import sys
import os
from datetime import datetime

# Add the src directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from features.application import LifePlannerApp
from shared.exceptions import PlannerError, ValidationError, PersonaNotFoundError


def main():
    """Demonstrate the refactored Life Planner Application"""
    print("🎯 Refactored Life Planner Application Demo")
    print("=" * 60)
    
    try:
        # Initialize the application
        app = LifePlannerApp()
        print("✅ Application initialized successfully")
        
        # Show app status
        status = app.get_app_status()
        print(f"📊 App Status:")
        print(f"   - Settings loaded: {status['settings_loaded']}")
        print(f"   - Available personas: {status['available_personas']}")
        print(f"   - Total activities: {status['total_activities']}")
        print()
        
        # Show available personas
        print("👥 Available Personas:")
        personas = app.get_available_personas()
        for persona in personas:
            print(f"   - {persona['name']} ({persona['id']})")
            print(f"     Personality: {persona['personality_type']}")
            print(f"     Networking Priority: {persona['networking_priority']}/10")
        print()
        
        # Set persona
        if personas:
            persona_id = personas[0]['id']
            app.set_persona(persona_id)
            print(f"✅ Set active persona: {personas[0]['name']}")
            print()
        
        # Show activity statistics
        print("📈 Activity Statistics:")
        stats = app.get_activity_statistics()
        print(f"   - Total activities: {stats['total_activities']}")
        print(f"   - Average cost: ${stats['average_cost']:.2f}")
        print(f"   - Average networking potential: {stats['average_networking_potential']:.1f}/10")
        print()
        
        # Generate different types of schedules
        schedule_types = [
            ("individual", "Individual Lifestyle Planning"),
            ("couple", "Couple Activity Planning"),
            ("integrated", "Integrated Individual + Couple Planning")
        ]
        
        for schedule_type, description in schedule_types:
            print(f"📅 **{description}**")
            print("-" * 50)
            
            try:
                # Generate schedule
                result = app.generate_schedule(
                    start_date="2024-01-15",
                    duration="1 week",
                    schedule_type=schedule_type,
                    focus_areas=["fitness", "networking"]
                )
                
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
                        if activity.get('connection_depth', 0) > 0:
                            print(f"   💝 Connection: {activity['connection_depth']}/10 | 🛡️ Safety: {activity['emotional_safety']}/10")
                        print()
                
                print(result["summary"])
                print("\n" + "=" * 60 + "\n")
                
            except ValidationError as e:
                print(f"❌ Validation Error: {e}")
            except PlannerError as e:
                print(f"❌ Planner Error: {e}")
        
        # Show final app status
        print("📊 Final App Status:")
        final_status = app.get_app_status()
        print(f"   - Used activities: {final_status['used_activities']}")
        print(f"   - Last updated: {final_status['last_updated']}")
        
    except Exception as e:
        print(f"❌ Application Error: {e}")
        return 1
    
    return 0


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
