#!/usr/bin/env python3
"""
Example usage of the optimized Toronto Life Planner Agent
Demonstrates key features and optimizations
"""

from toronto_life_planner import TorontoLifePlanner
from config import ConfigManager, create_fashion_industry_config
import json


def demonstrate_basic_usage():
    """Demonstrate basic planner usage"""
    print("🚀 Toronto Life Planner - Basic Usage Demo")
    print("=" * 50)
    
    # Initialize planner
    planner = TorontoLifePlanner()
    
    # Set weather for better suggestions
    planner.set_weather_conditions("sunny")
    
    # Generate 2-week itinerary
    result = planner.generate_itinerary("2024-01-15", "2 weeks")
    
    print(result["acknowledgment"])
    print("\n" + "=" * 50)
    
    # Show first 3 days
    days_shown = 0
    for day, schedule in result["itinerary"].items():
        if days_shown >= 3:
            break
            
        print(f"\n## {day}")
        for slot in schedule:
            priority_marker = "🎯" if slot.is_specific_activity else "📅"
            print(f"{priority_marker} **{slot.start_time} - {slot.end_time}:** {slot.activity.name}")
            print(f"   💰 Cost: ${slot.activity.cost_cad:.0f} CAD")
            print(f"   🌟 Networking: {slot.activity.social_networking_potential}/10")
            if slot.activity.tags:
                print(f"   🏷️ Tags: {', '.join(slot.activity.tags)}")
        
        days_shown += 1
    
    print("\n" + "=" * 50)
    print("📊 Summary Table (First 3 Days)")
    print(result["summary_table"])


def demonstrate_specific_activities():
    """Demonstrate integration of specific activities"""
    print("\n\n🎯 Specific Activities Integration Demo")
    print("=" * 50)
    
    planner = TorontoLifePlanner()
    planner.set_weather_conditions("rainy")  # Will prefer indoor activities
    
    # Define specific activities
    specific_activities = [
        {
            "date": "2024-01-16",
            "name": "Fashion Industry Mixer",
            "start_time": "2:00 PM",
            "duration": 3.0,
            "cost": 75,
            "location": "Fashion District",
            "description": "Exclusive industry networking event",
            "networking_potential": 9,
            "energy_level": "high",
            "tags": ["fashion", "networking", "exclusive"]
        },
        {
            "date": "2024-01-18",
            "name": "Art Gallery Opening",
            "start_time": "7:00 PM",
            "duration": 2.0,
            "cost": 0,
            "location": "Gallery District",
            "description": "Contemporary art exhibition opening",
            "networking_potential": 8,
            "energy_level": "medium",
            "tags": ["art", "cultural", "networking"]
        }
    ]
    
    result = planner.generate_itinerary("2024-01-15", "1 week", specific_activities)
    
    print("Generated itinerary with specific activities integrated:")
    print("\n" + "-" * 30)
    
    for day, schedule in result["itinerary"].items():
        print(f"\n{day}")
        for slot in schedule:
            if slot.is_specific_activity:
                print(f"🎯 {slot.start_time} - {slot.end_time}: {slot.activity.name}")
                print(f"   📝 {slot.notes}")
            else:
                print(f"📅 {slot.start_time} - {slot.end_time}: {slot.activity.name}")


def demonstrate_configuration():
    """Demonstrate configuration system"""
    print("\n\n⚙️ Configuration System Demo")
    print("=" * 50)
    
    # Create fashion industry configuration
    config = create_fashion_industry_config()
    
    print("Fashion Industry Configuration:")
    print(f"User: {config.user_preferences.user_name}")
    print(f"Partner: {config.user_preferences.partner_name}")
    print(f"Networking Priority: {config.user_preferences.networking_priority}/10")
    print(f"Budget Level: {config.user_preferences.budget_level.value}")
    print(f"Max Daily Cost: ${config.user_preferences.max_daily_cost}")
    print(f"Preferred Locations: {', '.join(config.user_preferences.preferred_locations)}")
    
    # Demonstrate config manager
    config_manager = ConfigManager("demo_config.json")
    config_manager.config = config
    config_manager.save_config()
    
    print(f"\nConfiguration saved to: demo_config.json")
    
    # Validate configuration
    issues = config_manager.validate_config()
    if issues:
        print("Configuration issues:")
        for issue in issues:
            print(f"- {issue}")
    else:
        print("✅ Configuration is valid!")


def demonstrate_analytics():
    """Demonstrate analytics and statistics"""
    print("\n\n📊 Analytics & Statistics Demo")
    print("=" * 50)
    
    planner = TorontoLifePlanner()
    
    # Generate some itineraries to build usage data
    planner.generate_itinerary("2024-01-15", "1 week")
    planner.generate_itinerary("2024-01-22", "1 week")
    
    # Get statistics
    stats = planner.get_activity_stats()
    
    print("Activity Usage Statistics:")
    print(f"Total Activities Available: {stats['total_activities']}")
    print(f"Activities Used: {stats['used_activities']} ({stats['usage_percentage']:.1f}%)")
    print(f"Most Used Activity: {stats['most_used_activity']} ({stats['most_used_count']} times)")
    
    # Show creative suggestions
    print("\n🎨 Creative Activity Suggestions:")
    themes = ["art", "fitness", "social", "cultural", "professional"]
    for theme in themes:
        suggestion = planner.suggest_creative_activity(theme)
        print(f"**{theme.title()}:** {suggestion}")


def demonstrate_weather_integration():
    """Demonstrate weather-aware activity selection"""
    print("\n\n🌤️ Weather Integration Demo")
    print("=" * 50)
    
    planner = TorontoLifePlanner()
    
    # Test different weather conditions
    weather_conditions = ["sunny", "rainy", "snowy"]
    
    for weather in weather_conditions:
        print(f"\nWeather: {weather.upper()}")
        planner.set_weather_conditions(weather)
        
        # Generate a single day to see weather impact
        result = planner.generate_itinerary("2024-01-15", "1 week")
        
        # Show first day's activities
        first_day = list(result["itinerary"].values())[0]
        outdoor_activities = [slot for slot in first_day if not slot.activity.indoor]
        indoor_activities = [slot for slot in first_day if slot.activity.indoor]
        
        print(f"  Indoor Activities: {len(indoor_activities)}")
        print(f"  Outdoor Activities: {len(outdoor_activities)}")
        
        if outdoor_activities:
            print(f"  Outdoor: {', '.join([slot.activity.name for slot in outdoor_activities])}")


def demonstrate_roadmap():
    """Demonstrate roadmap generation for longer durations"""
    print("\n\n🗺️ Roadmap Generation Demo")
    print("=" * 50)
    
    planner = TorontoLifePlanner()
    
    # Generate 3-month roadmap
    result = planner.generate_itinerary("2024-01-15", "3 months")
    
    print("3-Month Roadmap:")
    print(result["summary_table"])


def main():
    """Run all demonstrations"""
    print("🎯 Toronto Life Planner Agent - Optimization Demo")
    print("=" * 60)
    
    try:
        demonstrate_basic_usage()
        demonstrate_specific_activities()
        demonstrate_configuration()
        demonstrate_analytics()
        demonstrate_weather_integration()
        demonstrate_roadmap()
        
        print("\n\n✅ All demonstrations completed successfully!")
        print("\nKey Optimizations Demonstrated:")
        print("• Smart activity selection with repetition avoidance")
        print("• Conflict resolution and time management")
        print("• Weather-aware activity suggestions")
        print("• Specific activity integration")
        print("• Comprehensive configuration system")
        print("• Usage analytics and statistics")
        print("• Creative activity suggestions")
        print("• Flexible roadmap generation")
        
    except Exception as e:
        print(f"\n❌ Error during demonstration: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
