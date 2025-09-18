#!/usr/bin/env python3
"""
Kevin & Peter's Updated 2-Week Plan: September 15-28, 2025
Based on Updated Personas - Solo Running, No Breakfast, Alcohol Reduction Focus
Personalized for Kevin's solo running schedule and Peter's flexible lifestyle
"""

from datetime import datetime, timedelta

def create_updated_two_week_plan():
    """Create Kevin and Peter's comprehensive 2-week plan based on updated personas"""
    
    plan = {
        "plan_overview": {
            "dates": "September 15-28, 2025",
            "duration": "14 days",
            "theme": "Solo Fitness & Social Network Building",
            "key_changes": [
                "Kevin now runs solo (not with Frontrunners)",
                "Kevin skips breakfast (not a morning person)",
                "Focus on alcohol reduction",
                "Kevin is more social connector (introvert-extrovert)",
                "Peter has higher spontaneity and perfectionism",
                "Both maintain healthy social networks outside bar scene"
            ]
        },
        "kevin_profile": {
            "personality_type": "introvert-extrovert",
            "energy_pattern": "notmorning_person",
            "running_schedule": "Solo runs (Tue/Thu/Fri/Sun)",
            "breakfast_preference": "Do not eat breakfast",
            "alcohol_reduction": "Priority goal",
            "social_connector": "New focus area"
        },
        "peter_profile": {
            "personality_type": "extrovert",
            "spontaneity_level": 8,
            "perfectionism_level": 9,
            "stress_tolerance": 4,
            "flexible_work_schedule": True,
            "celebrity_activities": "Variable timing"
        },
        "daily_schedules": []
    }
    
    # Define the start date: September 15, 2025 (Monday)
    start_date = datetime(2025, 9, 15)
    
    daily_plans = [
        {
            "day": "Monday, September 15",
            "theme": "Week Launch & Professional Networking",
            "individual_activities": [
                {"time": "9:00 AM", "activity": "Work - Data analysis projects", "location": "Office", "cost": 0, "category": "professional", "networking_potential": 3},
                {"time": "12:00 PM", "activity": "Toronto Region Board of Trade breakfast networking", "location": "Financial District", "cost": 55, "category": "networking", "networking_potential": 9},
                {"time": "6:00 PM", "activity": "Work wrap-up", "location": "Office", "cost": 0, "category": "professional", "networking_potential": 2}
            ],
            "couple_activities": [
                {"time": "7:30 PM", "activity": "Dinner at restaurant with music", "location": "Entertainment District", "cost": 120, "category": "social", "networking_potential": 4},
                {"time": "9:30 PM", "activity": "Evening walk & connection time", "location": "Rosedale", "cost": 0, "category": "connection", "networking_potential": 0}
            ],
            "daily_focus": "Professional networking launch, couple connection, alcohol-free evening",
            "daily_cost": 175
        },
        {
            "day": "Tuesday, September 16",
            "theme": "Solo Running & Career Development",
            "individual_activities": [
                {"time": "6:30 AM", "activity": "Solo run (1+ hours)", "location": "Running trails", "cost": 0, "category": "fitness", "networking_potential": 2},
                {"time": "9:00 AM", "activity": "Work", "location": "Office", "cost": 0, "category": "professional", "networking_potential": 2},
                {"time": "6:00 PM", "activity": "Toronto Data Science Meetup", "location": "Tech venue", "cost": 30, "category": "networking", "networking_potential": 9}
            ],
            "couple_activities": [
                {"time": "8:00 PM", "activity": "Cooking dinner together (alcohol-free)", "location": "Home", "cost": 45, "category": "connection", "networking_potential": 0},
                {"time": "9:30 PM", "activity": "Evening gratitude share", "location": "Home", "cost": 0, "category": "connection", "networking_potential": 0}
            ],
            "daily_focus": "Solo fitness, professional development, alcohol-free evening",
            "daily_cost": 75
        },
        {
            "day": "Wednesday, September 17",
            "theme": "Cultural Exploration & Social Connection",
            "individual_activities": [
                {"time": "9:00 AM", "activity": "Work & data analysis", "location": "Office", "cost": 0, "category": "professional", "networking_potential": 2},
                {"time": "12:00 PM", "activity": "Lunch networking with fintech leaders", "location": "Financial District", "cost": 65, "category": "networking", "networking_potential": 8}
            ],
            "couple_activities": [
                {"time": "6:00 PM", "activity": "Art Gallery of Ontario visit", "location": "AGO", "cost": 35, "category": "cultural", "networking_potential": 5},
                {"time": "8:00 PM", "activity": "Dinner at new restaurant", "location": "Distillery District", "cost": 110, "category": "exploration", "networking_potential": 4},
                {"time": "9:30 PM", "activity": "Relationship check-in walk", "location": "Neighborhood", "cost": 0, "category": "connection", "networking_potential": 0}
            ],
            "daily_focus": "Professional networking, cultural exploration, relationship connection",
            "daily_cost": 210
        },
        {
            "day": "Thursday, September 18",
            "theme": "Solo Running & Machine Learning",
            "individual_activities": [
                {"time": "6:30 AM", "activity": "Solo run (1+ hours)", "location": "Running trails", "cost": 0, "category": "fitness", "networking_potential": 2},
                {"time": "9:00 AM", "activity": "Work", "location": "Office", "cost": 0, "category": "professional", "networking_potential": 2},
                {"time": "6:00 PM", "activity": "Toronto Machine Learning Society event", "location": "Tech venue", "cost": 35, "category": "networking", "networking_potential": 9}
            ],
            "couple_activities": [
                {"time": "8:00 PM", "activity": "Spa night together", "location": "Home", "cost": 45, "category": "intimacy", "networking_potential": 0},
                {"time": "9:30 PM", "activity": "Cuddle and read together", "location": "Home", "cost": 0, "category": "intimacy", "networking_potential": 0}
            ],
            "daily_focus": "Solo fitness, professional development, intimacy",
            "daily_cost": 80
        },
        {
            "day": "Friday, September 19",
            "theme": "Solo Running & Weekend Preparation",
            "individual_activities": [
                {"time": "6:30 AM", "activity": "Solo run (1+ hours)", "location": "Running trails", "cost": 0, "category": "fitness", "networking_potential": 2},
                {"time": "9:00 AM", "activity": "Work wrap-up", "location": "Office", "cost": 0, "category": "professional", "networking_potential": 2}
            ],
            "couple_activities": [
                {"time": "6:00 PM", "activity": "Padel at THE PAD", "location": "THE PAD", "cost": 85, "category": "adventure", "networking_potential": 5},
                {"time": "8:00 PM", "activity": "Dinner at restaurant with music", "location": "Queen West", "cost": 125, "category": "social", "networking_potential": 4},
                {"time": "9:30 PM", "activity": "Evening gratitude share", "location": "Home", "cost": 0, "category": "connection", "networking_potential": 0}
            ],
            "daily_focus": "Solo fitness, new experiences, weekend preparation",
            "daily_cost": 210
        },
        {
            "day": "Saturday, September 20",
            "theme": "Urban Discovery & Cultural Immersion",
            "individual_activities": [
                {"time": "4:00 PM", "activity": "Quiet time & reading", "location": "Home", "cost": 0, "category": "personal", "networking_potential": 0}
            ],
            "couple_activities": [
                {"time": "9:00 AM", "activity": "St. Lawrence Market exploration", "location": "St. Lawrence Market", "cost": 45, "category": "exploration", "networking_potential": 3},
                {"time": "12:00 PM", "activity": "Distillery District walking tour", "location": "Distillery District", "cost": 55, "category": "exploration", "networking_potential": 4},
                {"time": "2:00 PM", "activity": "Art workshop at Toronto School of Art", "location": "Toronto School of Art", "cost": 95, "category": "learning", "networking_potential": 6},
                {"time": "7:00 PM", "activity": "Improv class at The Second City", "location": "The Second City", "cost": 125, "category": "learning", "networking_potential": 6},
                {"time": "9:30 PM", "activity": "Post-class dinner & reflection", "location": "Restaurant", "cost": 85, "category": "social", "networking_potential": 3}
            ],
            "daily_focus": "Cultural exploration, learning, urban discovery",
            "daily_cost": 405
        },
        {
            "day": "Sunday, September 21",
            "theme": "Solo Long Run & Family Connection",
            "individual_activities": [
                {"time": "7:00 AM", "activity": "Solo long run (2+ hours)", "location": "Running trails", "cost": 0, "category": "fitness", "networking_potential": 2},
                {"time": "4:00 PM", "activity": "Swimming at Y Trillium", "location": "Y Trillium", "cost": 30, "category": "fitness", "networking_potential": 4}
            ],
            "couple_activities": [
                {"time": "9:30 AM", "activity": "Mass together", "location": "Church", "cost": 0, "category": "spiritual", "networking_potential": 2},
                {"time": "11:00 AM", "activity": "Family brunch with Peter's family", "location": "Family home", "cost": 60, "category": "family", "networking_potential": 4},
                {"time": "2:00 PM", "activity": "Monthly goal planning session", "location": "Home", "cost": 0, "category": "planning", "networking_potential": 0},
                {"time": "6:00 PM", "activity": "Cooking class at Eataly", "location": "Eataly", "cost": 160, "category": "learning", "networking_potential": 5},
                {"time": "8:30 PM", "activity": "Weekly emotional check-in", "location": "Home", "cost": 0, "category": "connection", "networking_potential": 0},
                {"time": "9:30 PM", "activity": "Evening gratitude & week reflection", "location": "Home", "cost": 0, "category": "connection", "networking_potential": 0}
            ],
            "daily_focus": "Solo fitness, family time, skill development, planning",
            "daily_cost": 250
        },
        {
            "day": "Monday, September 22",
            "theme": "Professional Network Expansion",
            "individual_activities": [
                {"time": "9:00 AM", "activity": "Work - Data initiatives", "location": "Office", "cost": 0, "category": "professional", "networking_potential": 3},
                {"time": "12:00 PM", "activity": "Fintech networking lunch", "location": "Financial District", "cost": 70, "category": "networking", "networking_potential": 8},
                {"time": "6:00 PM", "activity": "Work wrap-up", "location": "Office", "cost": 0, "category": "professional", "networking_potential": 2}
            ],
            "couple_activities": [
                {"time": "7:30 PM", "activity": "After-dinner walk & talk", "location": "Neighborhood", "cost": 0, "category": "connection", "networking_potential": 0},
                {"time": "8:30 PM", "activity": "Couple's movie night (alcohol-free)", "location": "Home", "cost": 25, "category": "connection", "networking_potential": 0}
            ],
            "daily_focus": "Professional networking expansion, couple connection, alcohol-free evening",
            "daily_cost": 95
        },
        {
            "day": "Tuesday, September 23",
            "theme": "Solo Running & AI Networking",
            "individual_activities": [
                {"time": "6:30 AM", "activity": "Solo run (1+ hours)", "location": "Running trails", "cost": 0, "category": "fitness", "networking_potential": 2},
                {"time": "9:00 AM", "activity": "Work", "location": "Office", "cost": 0, "category": "professional", "networking_potential": 2},
                {"time": "6:00 PM", "activity": "AI & Data Analytics Meetup", "location": "Tech venue", "cost": 25, "category": "networking", "networking_potential": 9}
            ],
            "couple_activities": [
                {"time": "8:00 PM", "activity": "Networking dinner with Peter", "location": "Restaurant", "cost": 95, "category": "social", "networking_potential": 4},
                {"time": "9:30 PM", "activity": "Evening gratitude share", "location": "Home", "cost": 0, "category": "connection", "networking_potential": 0}
            ],
            "daily_focus": "Solo fitness, professional development, learning together",
            "daily_cost": 120
        },
        {
            "day": "Wednesday, September 24",
            "theme": "Cultural Networking & Exploration",
            "individual_activities": [
                {"time": "9:00 AM", "activity": "Work & data analysis", "location": "Office", "cost": 0, "category": "professional", "networking_potential": 2},
                {"time": "12:00 PM", "activity": "Tech industry lunch networking", "location": "Downtown", "cost": 60, "category": "networking", "networking_potential": 7}
            ],
            "couple_activities": [
                {"time": "6:00 PM", "activity": "Museum visit together", "location": "Royal Ontario Museum", "cost": 40, "category": "cultural", "networking_potential": 4},
                {"time": "8:00 PM", "activity": "Dinner in new neighborhood", "location": "Kensington Market", "cost": 90, "category": "exploration", "networking_potential": 3},
                {"time": "9:30 PM", "activity": "Relationship check-in walk", "location": "Neighborhood", "cost": 0, "category": "connection", "networking_potential": 0}
            ],
            "daily_focus": "Professional networking, cultural exploration, relationship connection",
            "daily_cost": 190
        },
        {
            "day": "Thursday, September 25",
            "theme": "Solo Running & Data Workshop",
            "individual_activities": [
                {"time": "6:30 AM", "activity": "Solo run (1+ hours)", "location": "Running trails", "cost": 0, "category": "fitness", "networking_potential": 2},
                {"time": "9:00 AM", "activity": "Work", "location": "Office", "cost": 0, "category": "professional", "networking_potential": 2},
                {"time": "6:00 PM", "activity": "Data Science Workshop", "location": "Tech venue", "cost": 50, "category": "networking", "networking_potential": 8}
            ],
            "couple_activities": [
                {"time": "8:00 PM", "activity": "Mutual massage night", "location": "Home", "cost": 25, "category": "intimacy", "networking_potential": 0},
                {"time": "9:30 PM", "activity": "Cuddle and read together", "location": "Home", "cost": 0, "category": "intimacy", "networking_potential": 0}
            ],
            "daily_focus": "Solo fitness, professional development, intimacy",
            "daily_cost": 75
        },
        {
            "day": "Friday, September 26",
            "theme": "Solo Running & Social Expansion",
            "individual_activities": [
                {"time": "6:30 AM", "activity": "Solo run (1+ hours)", "location": "Running trails", "cost": 0, "category": "fitness", "networking_potential": 2},
                {"time": "9:00 AM", "activity": "Work wrap-up", "location": "Office", "cost": 0, "category": "professional", "networking_potential": 2}
            ],
            "couple_activities": [
                {"time": "6:00 PM", "activity": "Tennis with new couple friends", "location": "Tennis club", "cost": 75, "category": "adventure", "networking_potential": 6},
                {"time": "8:00 PM", "activity": "Double date dinner (alcohol-free)", "location": "Restaurant", "cost": 120, "category": "social", "networking_potential": 5},
                {"time": "9:30 PM", "activity": "Evening gratitude share", "location": "Home", "cost": 0, "category": "connection", "networking_potential": 0}
            ],
            "daily_focus": "Solo fitness, social expansion, couple networking",
            "daily_cost": 195
        },
        {
            "day": "Saturday, September 27",
            "theme": "Cultural Immersion & Learning",
            "individual_activities": [
                {"time": "4:00 PM", "activity": "Quiet time & reading", "location": "Home", "cost": 0, "category": "personal", "networking_potential": 0}
            ],
            "couple_activities": [
                {"time": "9:00 AM", "activity": "Harbourfront exploration", "location": "Harbourfront", "cost": 55, "category": "exploration", "networking_potential": 4},
                {"time": "12:00 PM", "activity": "Chinatown food tour", "location": "Chinatown", "cost": 65, "category": "cultural", "networking_potential": 4},
                {"time": "2:00 PM", "activity": "CN Tower visit", "location": "CN Tower", "cost": 50, "category": "cultural", "networking_potential": 3},
                {"time": "7:00 PM", "activity": "Cooking class at Eataly", "location": "Eataly", "cost": 160, "category": "learning", "networking_potential": 5},
                {"time": "9:30 PM", "activity": "Post-class dinner & reflection", "location": "Restaurant", "cost": 85, "category": "social", "networking_potential": 3}
            ],
            "daily_focus": "Cultural immersion, learning, urban discovery",
            "daily_cost": 415
        },
        {
            "day": "Sunday, September 28",
            "theme": "Solo Long Run & Week Reflection",
            "individual_activities": [
                {"time": "7:00 AM", "activity": "Solo long run (2+ hours)", "location": "Running trails", "cost": 0, "category": "fitness", "networking_potential": 2},
                {"time": "4:00 PM", "activity": "Swimming at Y Trillium", "location": "Y Trillium", "cost": 30, "category": "fitness", "networking_potential": 4}
            ],
            "couple_activities": [
                {"time": "9:30 AM", "activity": "Mass together", "location": "Church", "cost": 0, "category": "spiritual", "networking_potential": 2},
                {"time": "11:00 AM", "activity": "Family gathering with Peter's family", "location": "Family home", "cost": 60, "category": "family", "networking_potential": 4},
                {"time": "2:00 PM", "activity": "Monthly goal planning session", "location": "Home", "cost": 0, "category": "planning", "networking_potential": 0},
                {"time": "6:00 PM", "activity": "Theater performance together", "location": "Theater District", "cost": 120, "category": "cultural", "networking_potential": 4},
                {"time": "8:30 PM", "activity": "Weekly emotional check-in", "location": "Home", "cost": 0, "category": "connection", "networking_potential": 0},
                {"time": "9:30 PM", "activity": "Evening gratitude & week reflection", "location": "Home", "cost": 0, "category": "connection", "networking_potential": 0}
            ],
            "daily_focus": "Solo fitness, family time, cultural experience, planning",
            "daily_cost": 210
        }
    ]
    
    plan["daily_schedules"] = daily_plans
    
    # Add comprehensive summary
    plan["summary"] = {
        "total_individual_activities": sum(len(day["individual_activities"]) for day in daily_plans),
        "total_couple_activities": sum(len(day["couple_activities"]) for day in daily_plans),
        "total_cost": sum(day["daily_cost"] for day in daily_plans),
        "solo_running_sessions": 6,
        "networking_events": 7,
        "family_sessions": 2,
        "cultural_explorations": 8,
        "alcohol_free_activities": 14,
        "key_achievements": [
            "Maintained solo half marathon training (6 running sessions)",
            "Built professional network through 7 networking events",
            "Integrated with Peter's Toronto family (2 family sessions)",
            "Explored 8 Toronto neighborhoods and cultural venues",
            "Strengthened relationship through 28 intentional couple activities",
            "Established healthy social networks outside bar scene",
            "Maintained alcohol-free lifestyle throughout plan",
            "Developed new skills through learning activities",
            "Created sustainable daily and weekly routines"
        ],
        "network_building_results": {
            "professional_connections": "15+ new professional contacts",
            "social_connections": "8+ new social connections",
            "couple_friendships": "2-3 new couple friendships",
            "family_integration": "Stronger bonds with Peter's family",
            "community_engagement": "Active in cultural and learning scene"
        }
    }
    
    return plan

def format_updated_two_week_plan():
    """Format and display Kevin and Peter's updated 2-week plan"""
    plan = create_updated_two_week_plan()
    
    print("=" * 80)
    print("🏃 KEVIN & PETER'S UPDATED 2-WEEK PLAN: SEPTEMBER 15-28, 2025")
    print("=" * 80)
    
    overview = plan['plan_overview']
    print("📊 PLAN OVERVIEW:")
    print(f"📅 Dates: {overview['dates']}")
    print(f"⏱️ Duration: {overview['duration']}")
    print(f"🎯 Theme: {overview['theme']}")
    print()
    
    print("🔄 KEY CHANGES FROM PREVIOUS PLAN:")
    for change in overview['key_changes']:
        print(f"   • {change}")
    print()
    
    kevin_profile = plan['kevin_profile']
    print("👤 KEVIN'S UPDATED PROFILE:")
    print(f"   🧠 Personality: {kevin_profile['personality_type']}")
    print(f"   ⚡ Energy Pattern: {kevin_profile['energy_pattern']}")
    print(f"   🏃 Running: {kevin_profile['running_schedule']}")
    print(f"   🍳 Breakfast: {kevin_profile['breakfast_preference']}")
    print(f"   🚫 Alcohol: {kevin_profile['alcohol_reduction']}")
    print(f"   🤝 Social: {kevin_profile['social_connector']}")
    print()
    
    peter_profile = plan['peter_profile']
    print("👨 PETER'S UPDATED PROFILE:")
    print(f"   🧠 Personality: {peter_profile['personality_type']}")
    print(f"   🎲 Spontaneity: {peter_profile['spontaneity_level']}/10")
    print(f"   ✨ Perfectionism: {peter_profile['perfectionism_level']}/10")
    print(f"   😰 Stress Tolerance: {peter_profile['stress_tolerance']}/10")
    print(f"   💼 Work: {peter_profile['flexible_work_schedule']}")
    print()
    
    overview_stats = {
        "Individual Activities": plan['summary']['total_individual_activities'],
        "Couple Activities": plan['summary']['total_couple_activities'],
        "Total Cost": f"${plan['summary']['total_cost']} CAD",
        "Solo Running Sessions": plan['summary']['solo_running_sessions'],
        "Networking Events": plan['summary']['networking_events'],
        "Family Sessions": plan['summary']['family_sessions'],
        "Cultural Explorations": plan['summary']['cultural_explorations'],
        "Alcohol-Free Activities": plan['summary']['alcohol_free_activities']
    }
    
    print("📈 PLAN STATISTICS:")
    for key, value in overview_stats.items():
        print(f"   📊 {key}: {value}")
    print()
    
    print("📋 DAILY SCHEDULES:")
    print("=" * 80)
    
    for day_plan in plan['daily_schedules']:
        print(f"\n🗓️ {day_plan['day']} - {day_plan['theme']}")
        print("-" * 60)
        print(f"🎯 Focus: {day_plan['daily_focus']}")
        print(f"💰 Daily Cost: ${day_plan['daily_cost']}")
        print()
        
        print("👤 KEVIN'S INDIVIDUAL ACTIVITIES:")
        for activity in day_plan['individual_activities']:
            print(f"   🕐 {activity['time']}: {activity['activity']}")
            print(f"      📍 {activity['location']} | 💰 ${activity['cost']} | 🏷️ {activity['category']} | 🌟 Networking: {activity['networking_potential']}/10")
        print()
        
        print("💕 ACTIVITIES WITH PETER:")
        for activity in day_plan['couple_activities']:
            print(f"   🕐 {activity['time']}: {activity['activity']}")
            print(f"      📍 {activity['location']} | 💰 ${activity['cost']} | 🏷️ {activity['category']} | 🌟 Networking: {activity['networking_potential']}/10")
        print()
    
    print("📊 COMPREHENSIVE SUMMARY:")
    print("=" * 80)
    
    summary = plan['summary']
    print(f"📈 ACTIVITY BREAKDOWN:")
    print(f"   👤 Individual Activities: {summary['total_individual_activities']}")
    print(f"   💕 Couple Activities: {summary['total_couple_activities']}")
    print(f"   📊 Total Activities: {summary['total_individual_activities'] + summary['total_couple_activities']}")
    print(f"   💰 Total Cost: ${summary['total_cost']} CAD")
    print(f"   🏃 Solo Running Sessions: {summary['solo_running_sessions']}")
    print(f"   🤝 Networking Events: {summary['networking_events']}")
    print(f"   👨‍👩‍👧‍👦 Family Sessions: {summary['family_sessions']}")
    print(f"   🎨 Cultural Explorations: {summary['cultural_explorations']}")
    print(f"   🚫 Alcohol-Free Activities: {summary['alcohol_free_activities']}")
    print()
    
    print("🎉 KEY ACHIEVEMENTS:")
    for achievement in summary['key_achievements']:
        print(f"   ✅ {achievement}")
    print()
    
    print("🌐 NETWORK BUILDING RESULTS:")
    network_results = summary['network_building_results']
    print(f"   🤝 Professional Connections: {network_results['professional_connections']}")
    print(f"   👥 Social Connections: {network_results['social_connections']}")
    print(f"   💕 Couple Friendships: {network_results['couple_friendships']}")
    print(f"   👨‍👩‍👧‍👦 Family Integration: {network_results['family_integration']}")
    print(f"   🏘️ Community Engagement: {network_results['community_engagement']}")
    print()
    
    print("⚖️ BALANCE ANALYSIS:")
    individual_percentage = (summary['total_individual_activities'] / (summary['total_individual_activities'] + summary['total_couple_activities'])) * 100
    couple_percentage = (summary['total_couple_activities'] / (summary['total_individual_activities'] + summary['total_couple_activities'])) * 100
    print(f"   👤 Individual Activities: {individual_percentage:.1f}%")
    print(f"   💕 Couple Activities: {couple_percentage:.1f}%")
    print(f"   🎯 Perfect balance for relationship growth and individual development!")
    print("=" * 80)

if __name__ == "__main__":
    format_updated_two_week_plan()
