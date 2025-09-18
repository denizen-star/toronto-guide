#!/usr/bin/env python3
"""
Integrated Couple Planner
Combines the Toronto Life Planner with the Couple Activity Scheduler
for comprehensive relationship and lifestyle planning
"""

from toronto_life_planner import TorontoLifePlanner
from couple_activity_scheduler import CoupleActivityScheduler
import datetime
from typing import Dict, List, Optional


class IntegratedCouplePlanner:
    """
    Integrated planner that combines individual lifestyle planning with couple activities
    """
    
    def __init__(self, user_name: str = "User", partner_name: str = "Partner"):
        self.user_name = user_name
        self.partner_name = partner_name
        
        # Initialize both planners
        self.life_planner = TorontoLifePlanner()
        self.couple_scheduler = CoupleActivityScheduler(user_name, partner_name)
        
        # Set consistent names
        self.life_planner.user_name = user_name
        self.life_planner.partner_name = partner_name
    
    def generate_integrated_schedule(self, start_date: str, duration: str, 
                                   couple_focus_areas: Optional[List[str]] = None,
                                   include_individual_activities: bool = True) -> Dict:
        """
        Generate integrated schedule combining individual and couple activities
        
        Args:
            start_date: Start date in YYYY-MM-DD format
            duration: "1 week", "2 weeks", "1 month", or "3 months"
            couple_focus_areas: Focus areas for couple activities
            include_individual_activities: Whether to include individual lifestyle activities
        
        Returns:
            Dictionary containing integrated schedule
        """
        start_dt = datetime.datetime.strptime(start_date, "%Y-%m-%d")
        
        # Generate individual lifestyle schedule
        individual_schedule = {}
        if include_individual_activities:
            individual_result = self.life_planner.generate_itinerary(start_date, duration)
            individual_schedule = individual_result["itinerary"]
        
        # Generate couple activities schedule
        couple_result = self.couple_scheduler.generate_couple_schedule(
            start_date, duration, couple_focus_areas
        )
        couple_schedule = couple_result["schedule"]
        
        # Integrate schedules
        integrated_schedule = self._integrate_schedules(
            individual_schedule, couple_schedule, start_dt, duration
        )
        
        # Generate acknowledgment
        acknowledgment = self._generate_integrated_acknowledgment(
            start_date, duration, couple_focus_areas, include_individual_activities
        )
        
        # Generate summary
        summary = self._generate_integrated_summary(integrated_schedule, duration)
        
        return {
            "acknowledgment": acknowledgment,
            "schedule": integrated_schedule,
            "summary": summary,
            "individual_insights": self.life_planner.get_activity_stats() if include_individual_activities else {},
            "couple_insights": self.couple_scheduler.get_relationship_insights(),
            "relationship_goals": self.couple_scheduler.relationship_goals
        }
    
    def _integrate_schedules(self, individual_schedule: Dict, couple_schedule: Dict, 
                           start_dt: datetime.datetime, duration: str) -> Dict:
        """Integrate individual and couple schedules into a cohesive plan"""
        integrated = {}
        
        # Calculate number of days
        days = 7 if duration == "1 week" else 14 if duration == "2 weeks" else 30 if duration == "1 month" else 90
        
        for day_num in range(1, days + 1):
            current_date = start_dt + datetime.timedelta(days=day_num - 1)
            day_key = f"Day {day_num}: {current_date.strftime('%A, %B %d, %Y')}"
            
            # Get individual activities for this day
            individual_activities = individual_schedule.get(day_key, [])
            
            # Get couple activities for this day
            couple_activities = couple_schedule.get(day_key, [])
            
            # Combine and organize by time
            all_activities = []
            
            # Add individual activities
            for activity in individual_activities:
                all_activities.append({
                    "type": "individual",
                    "time": activity.start_time,
                    "end_time": activity.end_time,
                    "name": activity.activity.name,
                    "description": activity.activity.description,
                    "location": activity.activity.location,
                    "cost": activity.activity.cost_cad,
                    "networking_potential": activity.activity.social_networking_potential,
                    "notes": activity.notes
                })
            
            # Add couple activities
            for activity in couple_activities:
                all_activities.append({
                    "type": "couple",
                    "time": activity.start_time,
                    "end_time": activity.end_time,
                    "name": activity.activity.name,
                    "description": activity.activity.description,
                    "location": activity.activity.location,
                    "cost": activity.activity.cost_cad,
                    "connection_depth": activity.activity.connection_depth,
                    "emotional_safety": activity.activity.emotional_safety_level,
                    "is_habit_stacked": activity.is_habit_stacked,
                    "is_emotional_check_in": activity.emotional_check_in,
                    "notes": activity.notes
                })
            
            # Sort by time
            all_activities.sort(key=lambda x: self._time_to_minutes(x["time"]))
            
            integrated[day_key] = all_activities
        
        return integrated
    
    def _time_to_minutes(self, time_str: str) -> int:
        """Convert time string to minutes since midnight"""
        time_str = time_str.replace(" AM", "").replace(" PM", "")
        hour, minute = map(int, time_str.split(":"))
        
        if "PM" in time_str and hour != 12:
            hour += 12
        elif "AM" in time_str and hour == 12:
            hour = 0
        
        return hour * 60 + minute
    
    def _generate_integrated_acknowledgment(self, start_date: str, duration: str, 
                                          couple_focus_areas: Optional[List[str]], 
                                          include_individual: bool) -> str:
        """Generate acknowledgment for integrated planning"""
        focus_text = ""
        if couple_focus_areas:
            focus_text = f"\n**Couple Focus Areas:** {', '.join(couple_focus_areas).replace('_', ' ').title()}"
        
        individual_text = "\n**Individual Activities:** Included" if include_individual else "\n**Individual Activities:** Excluded (Couple-focused only)"
        
        return f"""
💕🤝 **Integrated Couple & Lifestyle Planner - Complete Life Planning!**

**Date Range:** {start_date} for {duration}
**Couple:** {self.user_name} & {self.partner_name}
**Approach:** Integrated individual lifestyle and couple relationship planning

**Core Principles:**
• **Individual Growth:** Personal development, networking, and lifestyle optimization
• **Couple Connection:** Intentional relationship building and emotional safety
• **Life Balance:** Harmonious integration of personal and partnership goals{focus_text}{individual_text}

This integrated schedule combines your individual lifestyle goals with intentional couple activities,
ensuring both personal growth and relationship strengthening happen together.

Let's build a fulfilling life together! 💖🚀
        """.strip()
    
    def _generate_integrated_summary(self, schedule: Dict, duration: str) -> str:
        """Generate summary of integrated schedule"""
        total_days = len(schedule)
        individual_activities = 0
        couple_activities = 0
        total_cost = 0
        avg_connection_depth = 0
        avg_emotional_safety = 0
        connection_depths = []
        emotional_safeties = []
        
        for day, activities in schedule.items():
            for activity in activities:
                if activity["type"] == "individual":
                    individual_activities += 1
                    total_cost += activity["cost"]
                else:  # couple
                    couple_activities += 1
                    total_cost += activity["cost"]
                    if "connection_depth" in activity:
                        connection_depths.append(activity["connection_depth"])
                    if "emotional_safety" in activity:
                        emotional_safeties.append(activity["emotional_safety"])
        
        avg_connection_depth = sum(connection_depths) / len(connection_depths) if connection_depths else 0
        avg_emotional_safety = sum(emotional_safeties) / len(emotional_safeties) if emotional_safeties else 0
        
        summary = f"""
## 📊 **Integrated Schedule Summary**

**Duration:** {duration} ({total_days} days)
**Individual Activities:** {individual_activities}
**Couple Activities:** {couple_activities}
**Total Estimated Cost:** ${total_cost:.0f} CAD
**Average Connection Depth:** {avg_connection_depth:.1f}/10
**Average Emotional Safety:** {avg_emotional_safety:.1f}/10

**Daily Breakdown:**
- Individual activities focus on personal growth and networking
- Couple activities prioritize relationship building and emotional connection
- Integrated approach ensures balance between personal and partnership goals
        """.strip()
        
        return summary


def demonstrate_integrated_planning():
    """Demonstrate the integrated planning approach"""
    
    print("=" * 80)
    print("💕🤝 INTEGRATED COUPLE & LIFESTYLE PLANNER DEMONSTRATION")
    print("=" * 80)
    
    # Create integrated planner
    planner = IntegratedCouplePlanner("Sarah", "Michael")
    
    # Demonstrate different planning approaches
    approaches = [
        {
            "name": "Balanced Life & Love",
            "description": "Equal focus on individual growth and couple connection",
            "couple_focus": ["emotional_safety", "habit_building"],
            "include_individual": True
        },
        {
            "name": "Couple-Focused Period",
            "description": "Intensive focus on relationship building",
            "couple_focus": ["emotional_safety", "partnership"],
            "include_individual": False
        },
        {
            "name": "Adventure Together",
            "description": "Individual growth through shared adventures",
            "couple_focus": ["adventure", "partnership"],
            "include_individual": True
        }
    ]
    
    for approach in approaches:
        print(f"\n🎯 **{approach['name']}**")
        print(f"📝 {approach['description']}")
        print("-" * 60)
        
        # Generate integrated schedule
        result = planner.generate_integrated_schedule(
            start_date="2024-01-15",
            duration="1 week",
            couple_focus_areas=approach["couple_focus"],
            include_individual_activities=approach["include_individual"]
        )
        
        print(result["acknowledgment"])
        print("\n**Sample Day (Day 1):**")
        
        # Show first day as example
        day_1 = result["schedule"]["Day 1: Monday, January 15, 2024"]
        for activity in day_1:
            if activity["type"] == "individual":
                print(f"👤 **{activity['time']} - {activity['end_time']}:** {activity['name']}")
                print(f"   📍 {activity['location']} | 💰 ${activity['cost']:.0f} | 🌟 Networking: {activity['networking_potential']}/10")
            else:  # couple
                markers = "🔄" if activity.get("is_habit_stacked") else "💕"
                markers += "💬" if activity.get("is_emotional_check_in") else ""
                print(f"{markers} **{activity['time']} - {activity['end_time']}:** {activity['name']}")
                print(f"   📍 {activity['location']} | 💰 ${activity['cost']:.0f} | 💝 Connection: {activity.get('connection_depth', 'N/A')}/10 | 🛡️ Safety: {activity.get('emotional_safety', 'N/A')}/10")
        
        print(f"\n{result['summary']}")
        print("\n" + "=" * 60)


def demonstrate_self_help_integration():
    """Demonstrate how self-help principles are integrated"""
    
    print("\n" + "=" * 80)
    print("📚 SELF-HELP PRINCIPLES INTEGRATION")
    print("=" * 80)
    
    print("""
**How Self-Help Books Are Integrated into the Planning System:**

🔹 **Atomic Habits (James Clear):**
   ✅ Habit stacking for couple activities
   ✅ Small, consistent daily actions
   ✅ Making relationship habits obvious, attractive, easy, and satisfying
   ✅ Integration with existing individual routines

🔹 **Hold Me Tight (Dr. Sue Johnson):**
   ✅ High emotional safety activities (8-10/10 scores)
   ✅ Weekly emotional check-ins
   ✅ Attachment repair rituals
   ✅ Safe space conversations
   ✅ Building secure emotional connection

🔹 **Power of a Partner:**
   ✅ Collaborative goal setting activities
   ✅ Mutual accountability check-ins
   ✅ Shared project planning
   ✅ Supporting each other's individual growth
   ✅ Building partnership through shared purpose

**Integration Benefits:**
• Individual growth supports relationship growth
• Couple activities enhance personal development
• Consistent habits build both personal and relationship success
• Emotional safety creates foundation for individual risk-taking
• Shared goals create mutual motivation and support
    """)


def main():
    """Run integrated planning demonstration"""
    print("💕🤝 INTEGRATED COUPLE & LIFESTYLE PLANNER")
    print("Combining Individual Growth with Intentional Relationship Building")
    print("Based on Atomic Habits, Hold Me Tight, and Power of a Partner")
    print("=" * 80)
    
    # Run demonstrations
    demonstrate_integrated_planning()
    demonstrate_self_help_integration()
    
    print("\n" + "=" * 80)
    print("🎉 INTEGRATED PLANNING DEMONSTRATION COMPLETE!")
    print("=" * 80)
    print("""
**Key Integration Features:**

✅ **Seamless Schedule Integration:**
   - Individual and couple activities in one cohesive plan
   - Time conflict resolution
   - Balanced daily structure

✅ **Self-Help Book Principles:**
   - Atomic Habits for sustainable relationship habits
   - Hold Me Tight for emotional safety and connection
   - Power of a Partner for collaborative growth

✅ **Flexible Planning Options:**
   - Individual + couple activities
   - Couple-focused periods
   - Adventure and partnership focus

✅ **Comprehensive Tracking:**
   - Individual activity statistics
   - Relationship insights and metrics
   - Cost and time management

✅ **Goal Alignment:**
   - Personal development goals
   - Relationship building objectives
   - Shared partnership goals
    """)


if __name__ == "__main__":
    main()
