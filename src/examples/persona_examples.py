#!/usr/bin/env python3
"""
Persona Examples and Usage Demonstrations
Shows how to use the persona system with the Toronto Life Planner
"""

from persona_integration import PersonaIntegratedPlanner
from personas import PersonaManager, create_fashion_professional_persona, create_creative_entrepreneur_persona, create_wellness_professional_persona
from config import ConfigManager, create_fashion_industry_config
import json


def demonstrate_persona_creation():
    """Demonstrate creating and managing personas"""
    print("🎭 Persona Creation and Management Demo")
    print("=" * 60)
    
    # Initialize persona manager
    manager = PersonaManager()
    
    # Create custom personas
    fashion_persona = create_fashion_professional_persona()
    creative_persona = create_creative_entrepreneur_persona()
    wellness_persona = create_wellness_professional_persona()
    
    # Add personas to manager
    manager.add_persona(fashion_persona)
    manager.add_persona(creative_persona)
    manager.add_persona(wellness_persona)
    
    print(f"✅ Created {len(manager.get_all_personas())} personas")
    
    # Display persona details
    for persona in manager.get_all_personas():
        print(f"\n👤 {persona.persona_name}")
        print(f"   Description: {persona.description}")
        print(f"   Life Stage: {persona.demographics.life_stage.value}")
        print(f"   Personality: {persona.personality.personality_type.value}")
        print(f"   Budget: {persona.preferences.budget_preference}")
        print(f"   Networking Priority: {persona.networking.networking_priority}/10")
        print(f"   Preferred Activities: {', '.join(persona.preferences.preferred_activity_types)}")


def demonstrate_persona_planning():
    """Demonstrate persona-based planning"""
    print("\n\n📅 Persona-Based Planning Demo")
    print("=" * 60)
    
    # Initialize persona-integrated planner
    planner = PersonaIntegratedPlanner()
    
    # Get available personas
    personas = planner.persona_manager.get_all_personas()
    
    if not personas:
        print("No personas available. Creating default personas...")
        planner.persona_manager.create_default_personas()
        personas = planner.persona_manager.get_all_personas()
    
    # Test with different personas
    for persona in personas[:2]:  # Test with first 2 personas
        print(f"\n🎯 Testing with: {persona.persona_name}")
        print("-" * 40)
        
        # Set persona
        planner.set_persona(persona.persona_id)
        
        # Generate itinerary
        result = planner.generate_persona_itinerary("2024-01-15", "3 days")
        
        # Show persona summary
        print("Persona Profile:")
        print(result["persona_summary"])
        
        # Show first day's activities
        first_day = list(result["itinerary"].values())[0]
        if isinstance(first_day, list) and first_day and hasattr(first_day[0], 'activity'):
            print(f"\nFirst Day Schedule:")
            for slot in first_day[:4]:  # Show first 4 activities
                print(f"  {slot.start_time} - {slot.end_time}: {slot.activity.name}")
                if "Persona Match" in slot.notes:
                    print(f"    📊 {slot.notes}")
        else:
            print(f"\nFirst Day Schedule: {first_day}")
        
        # Show recommendations
        print(f"\nRecommendations for {persona.persona_name}:")
        for rec in result["persona_recommendations"][:3]:
            print(f"  • {rec['type'].title()}: {rec['value']} ({rec['priority']} priority)")


def demonstrate_activity_recommendations():
    """Demonstrate persona-based activity recommendations"""
    print("\n\n💡 Persona-Based Activity Recommendations Demo")
    print("=" * 60)
    
    planner = PersonaIntegratedPlanner()
    personas = planner.persona_manager.get_all_personas()
    
    if not personas:
        planner.persona_manager.create_default_personas()
        personas = planner.persona_manager.get_all_personas()
    
    # Test activity recommendations for each persona
    for persona in personas:
        print(f"\n🎯 Activity Recommendations for: {persona.persona_name}")
        print("-" * 50)
        
        planner.set_persona(persona.persona_id)
        
        # Get recommendations for different activity types
        activity_types = ["social", "professional", "creative", "fitness"]
        
        for activity_type in activity_types:
            suggestions = planner.get_persona_activity_suggestions(activity_type)
            
            if suggestions:
                top_suggestion = suggestions[0]
                print(f"\n{activity_type.title()} Activities:")
                print(f"  🥇 {top_suggestion.activity.name}")
                print(f"     Match Score: {top_suggestion.match_score:.2f}")
                print(f"     Reasons: {', '.join(top_suggestion.match_reasons)}")
                print(f"     Cost: ${top_suggestion.activity.cost_cad}")
                print(f"     Networking: {top_suggestion.activity.social_networking_potential}/10")
                
                if top_suggestion.customization_notes:
                    print(f"     Notes: {top_suggestion.customization_notes}")


def demonstrate_routine_customization():
    """Demonstrate persona-based routine customization"""
    print("\n\n🕐 Persona-Based Routine Customization Demo")
    print("=" * 60)
    
    planner = PersonaIntegratedPlanner()
    personas = planner.persona_manager.get_all_personas()
    
    if not personas:
        planner.persona_manager.create_default_personas()
        personas = planner.persona_manager.get_all_personas()
    
    for persona in personas:
        print(f"\n🕐 Routines for: {persona.persona_name}")
        print("-" * 40)
        
        planner.set_persona(persona.persona_id)
        routines = planner.get_persona_routine_suggestions()
        
        print("Morning Routine:")
        for activity in routines.get("morning_routine", [])[:4]:
            print(f"  • {activity}")
        
        print("\nEvening Routine:")
        for activity in routines.get("evening_routine", [])[:4]:
            print(f"  • {activity}")
        
        print("\nWeekend Activities:")
        for activity in routines.get("weekend_activities", [])[:4]:
            print(f"  • {activity}")


def demonstrate_config_to_persona_conversion():
    """Demonstrate converting existing config to persona"""
    print("\n\n⚙️ Config to Persona Conversion Demo")
    print("=" * 60)
    
    # Create a config-based persona
    config_manager = ConfigManager()
    config = create_fashion_industry_config()
    
    planner = PersonaIntegratedPlanner()
    persona = planner.create_persona_from_config(config)
    
    print(f"✅ Created persona from config: {persona.persona_name}")
    print(f"   Description: {persona.description}")
    print(f"   Budget Level: {persona.preferences.budget_preference}")
    print(f"   Networking Priority: {persona.networking.networking_priority}/10")
    print(f"   Preferred Activities: {', '.join(persona.preferences.preferred_activity_types)}")
    print(f"   Preferred Locations: {', '.join(persona.preferences.preferred_locations)}")
    
    # Add to manager and test
    planner.persona_manager.add_persona(persona)
    planner.set_persona(persona.persona_id)
    
    # Generate itinerary with config-based persona
    result = planner.generate_persona_itinerary("2024-01-15", "2 days")
    
    print(f"\n📅 Itinerary generated with config-based persona:")
    first_day = list(result["itinerary"].values())[0]
    for slot in first_day[:3]:
        print(f"  {slot.start_time} - {slot.end_time}: {slot.activity.name}")


def demonstrate_persona_analytics():
    """Demonstrate persona usage analytics"""
    print("\n\n📊 Persona Analytics Demo")
    print("=" * 60)
    
    manager = PersonaManager()
    personas = manager.get_all_personas()
    
    print("Persona Usage Statistics:")
    print(f"Total Personas: {len(personas)}")
    print(f"Active Personas: {len([p for p in personas if p.is_active])}")
    
    # Show persona characteristics distribution
    personality_types = {}
    life_stages = {}
    budget_levels = {}
    
    for persona in personas:
        # Personality types
        ptype = persona.personality.personality_type.value
        personality_types[ptype] = personality_types.get(ptype, 0) + 1
        
        # Life stages
        stage = persona.demographics.life_stage.value
        life_stages[stage] = life_stages.get(stage, 0) + 1
        
        # Budget levels
        budget = persona.preferences.budget_preference
        budget_levels[budget] = budget_levels.get(budget, 0) + 1
    
    print(f"\nPersonality Type Distribution:")
    for ptype, count in personality_types.items():
        print(f"  {ptype.title()}: {count}")
    
    print(f"\nLife Stage Distribution:")
    for stage, count in life_stages.items():
        print(f"  {stage.replace('_', ' ').title()}: {count}")
    
    print(f"\nBudget Level Distribution:")
    for budget, count in budget_levels.items():
        print(f"  {budget.title()}: {count}")


def demonstrate_persona_export_import():
    """Demonstrate exporting and importing personas"""
    print("\n\n💾 Persona Export/Import Demo")
    print("=" * 60)
    
    manager = PersonaManager()
    
    # Export personas to JSON
    personas_data = {
        "personas": [persona.to_dict() for persona in manager.get_all_personas()]
    }
    
    with open("exported_personas.json", "w") as f:
        json.dump(personas_data, f, indent=2)
    
    print("✅ Exported personas to exported_personas.json")
    
    # Show export structure
    if personas_data["personas"]:
        sample_persona = personas_data["personas"][0]
        print(f"\nSample exported persona structure:")
        print(f"  ID: {sample_persona['persona_id']}")
        print(f"  Name: {sample_persona['persona_name']}")
        print(f"  Demographics: {sample_persona['demographics']['life_stage']}")
        print(f"  Personality: {sample_persona['personality']['personality_type']}")
        print(f"  Budget: {sample_persona['preferences']['budget_preference']}")


def main():
    """Run all persona demonstrations"""
    print("🎭 Toronto Life Planner - Persona System Demo")
    print("=" * 70)
    
    try:
        demonstrate_persona_creation()
        demonstrate_persona_planning()
        demonstrate_activity_recommendations()
        demonstrate_routine_customization()
        demonstrate_config_to_persona_conversion()
        demonstrate_persona_analytics()
        demonstrate_persona_export_import()
        
        print("\n\n✅ All persona demonstrations completed successfully!")
        print("\nKey Features Demonstrated:")
        print("• Persona creation and management")
        print("• Persona-based itinerary generation")
        print("• Activity recommendations based on persona")
        print("• Routine customization for different personas")
        print("• Config to persona conversion")
        print("• Persona analytics and insights")
        print("• Export/import functionality")
        
    except Exception as e:
        print(f"\n❌ Error during demonstration: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
