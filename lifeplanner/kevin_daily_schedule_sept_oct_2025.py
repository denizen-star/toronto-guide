#!/usr/bin/env python3
"""
Kevin's Daily Play-by-Play Schedule
September 15 - October 15, 2025

A comprehensive daily schedule for Kevin integrating:
- Core requirements (work, running, meditation, etc.)
- Professional networking activities
- Social activities and relationship building
- Personal development and wellness
- Toronto exploration and cultural activities
"""

import datetime
from typing import Dict, List, Optional
from dataclasses import dataclass
from enum import Enum


class ActivityType(Enum):
    MORNING_ROUTINE = "morning_routine"
    WORK = "work"
    FITNESS = "fitness"
    NETWORKING = "networking"
    SOCIAL = "social"
    CULTURAL = "cultural"
    PERSONAL_DEVELOPMENT = "personal_development"
    COUPLE_TIME = "couple_time"
    EVENING_ROUTINE = "evening_routine"
    HOUSEHOLD = "household"


@dataclass
class DailyActivity:
    time: str
    duration: str
    activity: str
    location: str
    cost: float
    networking_potential: int  # 1-10 scale
    energy_level: str  # low, medium, high
    description: str
    tags: List[str]
    is_core_requirement: bool = False


class KevinDailyScheduler:
    """Generate Kevin's detailed daily schedule for September 15 - October 15, 2025"""
    
    def __init__(self):
        self.start_date = datetime.date(2025, 9, 15)
        self.end_date = datetime.date(2025, 10, 15)
        self.meditation_week = 0
        self.entertainment_cycle = 0
        
    def generate_monthly_schedule(self) -> Dict[str, List[DailyActivity]]:
        """Generate complete monthly schedule"""
        schedule = {}
        current_date = self.start_date
        
        while current_date <= self.end_date:
            day_key = current_date.strftime("%A, %B %d, %Y")
            daily_activities = self._generate_daily_activities(current_date)
            schedule[day_key] = daily_activities
            current_date += datetime.timedelta(days=1)
            
        return schedule
    
    def _generate_daily_activities(self, date: datetime.date) -> List[DailyActivity]:
        """Generate activities for a specific day"""
        activities = []
        is_weekend = date.weekday() >= 5
        day_name = date.strftime("%A")
        
        # Morning Routine (6:00 AM - 9:45 AM) - Based on 7 Habits
        activities.extend(self._get_morning_routine(date, is_weekend))
        
        # Work Hours (9:45 AM - 6:00 PM) - Weekdays only
        if not is_weekend:
            activities.extend(self._get_work_schedule(date))
        
        # Afternoon/Evening Activities
        if is_weekend:
            activities.extend(self._get_weekend_activities(date))
        else:
            activities.extend(self._get_weekday_evening_activities(date))
        
        # Evening Routine (9:30 PM - 10:30 PM)
        activities.extend(self._get_evening_routine(date))
        
        return activities
    
    def _get_morning_routine(self, date: datetime.date, is_weekend: bool) -> List[DailyActivity]:
        """Generate morning routine based on 7 Habits of Highly Effective People (6:00 AM - 9:00 AM)"""
        activities = []
        
        # Phase 1: Be Proactive - Wake Up & Intention (6:00 AM - 6:15 AM)
        activities.append(DailyActivity(
            time="6:00 AM - 6:15 AM",
            duration="15 min",
            activity="Be Proactive - Wake Up & Intention",
            location="Home",
            cost=0,
            networking_potential=0,
            energy_level="low",
            description="Wake up, drink water, and consciously choose your attitude and approach for the day",
            tags=["wake-up", "hydration", "proactive", "intention"],
            is_core_requirement=True
        ))
        
        # Phase 2: Begin with the End in Mind - Goal Visualization (6:15 AM - 6:45 AM)
        activities.append(DailyActivity(
            time="6:15 AM - 6:45 AM",
            duration="30 min",
            activity="Begin with the End in Mind - Goal Visualization",
            location="Home",
            cost=0,
            networking_potential=0,
            energy_level="low",
            description="Review personal mission statement, visualize daily goals, and align actions with long-term objectives",
            tags=["goals", "mission", "visualization", "planning"],
            is_core_requirement=True
        ))
        
        # Phase 3: Physical Exercise - Sharpen the Saw (6:45 AM - 7:15 AM)
        if not is_weekend or date.weekday() == 6:  # Daily except Saturday
            activities.append(DailyActivity(
                time="6:45 AM - 7:15 AM",
                duration="30 min",
                activity="Sharpen the Saw - Physical Exercise",
                location="Home",
                cost=0,
                networking_potential=0,
                energy_level="medium",
                description="30 minutes of exercise: yoga, stretching, or cardio to maintain physical health and energy",
                tags=["fitness", "exercise", "wellness", "renewal"],
                is_core_requirement=True
            ))
        
        # Phase 4: Morning Shower & Grooming (7:15 AM - 7:45 AM)
        activities.append(DailyActivity(
            time="7:15 AM - 7:45 AM",
            duration="30 min",
            activity="Morning Shower & Grooming",
            location="Home",
            cost=0,
            networking_potential=0,
            energy_level="low",
            description="Morning shower, skincare routine, and personal grooming to start the day fresh",
            tags=["grooming", "shower", "personal-care", "morning"],
            is_core_requirement=True
        ))
        
        # Phase 5: Personal Development - Continuous Learning (7:45 AM - 8:15 AM)
        activities.append(DailyActivity(
            time="7:45 AM - 8:15 AM",
            duration="30 min",
            activity="Personal Development - Continuous Learning",
            location="Home",
            cost=0,
            networking_potential=2,
            energy_level="low",
            description="Read industry news, listen to educational content, or study to enhance skills and knowledge",
            tags=["learning", "development", "education", "growth"],
            is_core_requirement=True
        ))
        
        # Phase 6: Family Time & Breakfast - Relationship Building (8:15 AM - 8:45 AM)
        activities.append(DailyActivity(
            time="8:15 AM - 8:45 AM",
            duration="30 min",
            activity="Family Time & Breakfast",
            location="Home",
            cost=10,
            networking_potential=0,
            energy_level="low",
            description="Enjoy breakfast together, strengthen relationships, and start the day with positive interactions",
            tags=["family", "breakfast", "relationships", "connection"],
            is_core_requirement=True
        ))
        
        # Phase 7: Put First Things First - Priority Planning (8:45 AM - 9:15 AM)
        activities.append(DailyActivity(
            time="8:45 AM - 9:15 AM",
            duration="30 min",
            activity="Put First Things First - Priority Planning",
            location="Home",
            cost=0,
            networking_potential=0,
            energy_level="low",
            description="Identify urgent vs important tasks, prioritize high-impact activities, and plan your day strategically",
            tags=["priorities", "planning", "organization", "focus"],
            is_core_requirement=True
        ))
        
        # Phase 8: Think Win-Win - Collaborative Preparation (9:15 AM - 9:30 AM)
        activities.append(DailyActivity(
            time="9:15 AM - 9:30 AM",
            duration="15 min",
            activity="Think Win-Win - Collaborative Preparation",
            location="Home",
            cost=0,
            networking_potential=0,
            energy_level="low",
            description="Plan collaborative efforts, consider mutual benefits, and prepare for win-win interactions",
            tags=["collaboration", "win-win", "cooperation", "networking"],
            is_core_requirement=True
        ))
        
        # Phase 9: Quick Commute & Positive Content (8:50 AM - 9:00 AM)
        if not is_weekend:
            activities.append(DailyActivity(
                time="8:50 AM - 9:00 AM",
                duration="10 min",
                activity="Quick Commute & Positive Content",
                location="Transit",
                cost=0,
                networking_potential=0,
                energy_level="low",
                description="10-minute commute while listening to uplifting music, podcasts, or positive content",
                tags=["commute", "positive", "uplifting", "personal"],
                is_core_requirement=True
            ))
        
        return activities
    
    def _get_work_schedule(self, date: datetime.date) -> List[DailyActivity]:
        """Generate work schedule for weekdays"""
        activities = []
        day_name = date.strftime("%A")
        
        # Work Hours (9:00 AM - 6:00 PM)
        activities.append(DailyActivity(
            time="9:00 AM - 6:00 PM",
            duration="9 hours",
            activity="Work Hours - Head of Data",
            location="Office",
            cost=0,
            networking_potential=0,
            energy_level="medium",
            description="Regular work hours: 9:00 AM - 6:00 PM. Focus on data initiatives and team leadership",
            tags=["work", "professional", "office", "leadership"],
            is_core_requirement=True
        ))
        
        # Immigration Work (Tuesday, Thursday - 1.5 hours each)
        if day_name in ["Tuesday", "Thursday"]:
            activities.append(DailyActivity(
                time="10:00 AM - 11:30 AM",
                duration="1.5 hours",
                activity="Immigration Application Work",
                location="Office",
                cost=0,
                networking_potential=0,
                energy_level="medium",
                description="Work on finalizing Canada immigration application during work hours",
                tags=["immigration", "work", "professional", "legal"],
                is_core_requirement=True
            ))
        
        # Professional Development (Tuesday, Thursday, Friday)
        if day_name in ["Tuesday", "Thursday", "Friday"]:
            dev_hours = 1.5 if day_name == "Friday" else 1.0
            start_time = "2:00 PM" if day_name == "Friday" else "1:00 PM"
            end_time = "3:30 PM" if day_name == "Friday" else "2:00 PM"
            
            activities.append(DailyActivity(
                time=f"{start_time} - {end_time}",
                duration=f"{dev_hours} hours",
                activity="Professional Development",
                location="Office/Cafe",
                cost=20,
                networking_potential=6,
                energy_level="medium",
                description="Training, 1:1 coffee meetings, career expansion techniques",
                tags=["professional-development", "networking", "career", "learning"],
                is_core_requirement=True
            ))
        
        # Evening Commute (6:00 PM - 6:10 PM)
        activities.append(DailyActivity(
            time="6:00 PM - 6:10 PM",
            duration="10 min",
            activity="Evening Commute",
            location="Transit",
            cost=0,
            networking_potential=0,
            energy_level="low",
            description="10-minute commute from work",
            tags=["commute", "work", "transit"],
            is_core_requirement=True
        ))
        
        return activities
    
    def _get_weekday_evening_activities(self, date: datetime.date) -> List[DailyActivity]:
        """Generate evening activities for weekdays"""
        activities = []
        day_name = date.strftime("%A")
        
        # Running Schedule (Tuesday, Thursday, Friday)
        if day_name in ["Tuesday", "Thursday", "Friday"]:
            activities.append(DailyActivity(
                time="7:00 AM - 8:00 AM",
                duration="1 hour",
                activity=f"{day_name} Run",
                location="Running Route",
                cost=0,
                networking_potential=0,
                energy_level="high",
                description=f"{day_name} run - 1+ hour solo training for half marathon",
                tags=["running", "fitness", "half-marathon", "solo"],
                is_core_requirement=True
            ))
        
        # Evening Activities (6:10 PM - 9:30 PM)
        if day_name == "Monday":
            activities.append(DailyActivity(
                time="6:30 PM - 8:30 PM",
                duration="2 hours",
                activity="Toronto Data Science Meetup",
                location="Downtown Toronto",
                cost=25,
                networking_potential=8,
                energy_level="medium",
                description="Professional networking with data science professionals in Toronto",
                tags=["networking", "data-science", "professional", "tech"],
                is_core_requirement=False
            ))
        
        elif day_name == "Tuesday":
            activities.append(DailyActivity(
                time="6:30 PM - 8:30 PM",
                duration="2 hours",
                activity="Frontrunners Running Club",
                location="High Park",
                cost=15,
                networking_potential=7,
                energy_level="high",
                description="Join Frontrunners or another queer run club for social running",
                tags=["running", "social", "lgbtq", "fitness", "networking"],
                is_core_requirement=False
            ))
        
        elif day_name == "Wednesday":
            activities.append(DailyActivity(
                time="6:30 PM - 8:30 PM",
                duration="2 hours",
                activity="Toronto AI & Fintech Networking Event",
                location="Financial District",
                cost=40,
                networking_potential=9,
                energy_level="medium",
                description="Professional networking in AI and fintech industries",
                tags=["networking", "fintech", "ai", "professional", "career"],
                is_core_requirement=False
            ))
        
        elif day_name == "Thursday":
            activities.append(DailyActivity(
                time="6:30 PM - 8:30 PM",
                duration="2 hours",
                activity="Swimming at Y Trillium",
                location="Y Trillium",
                cost=15,
                networking_potential=4,
                energy_level="medium",
                description="Swimming session with Downtown Swim Club or solo",
                tags=["swimming", "fitness", "aquatic", "wellness"],
                is_core_requirement=False
            ))
        
        elif day_name == "Friday":
            activities.append(DailyActivity(
                time="6:30 PM - 9:00 PM",
                duration="2.5 hours",
                activity="Tennis at THE PAD",
                location="THE PAD",
                cost=25,
                networking_potential=5,
                energy_level="high",
                description="Tennis playing, clinics, or private instruction",
                tags=["tennis", "sport", "fitness", "social", "competitive"],
                is_core_requirement=False
            ))
        
        # Dinner (8:30 PM - 9:30 PM)
        activities.append(DailyActivity(
            time="8:30 PM - 9:30 PM",
            duration="1 hour",
            activity="Dinner with Peter",
            location="Home/Restaurant",
            cost=30,
            networking_potential=0,
            energy_level="low",
            description="Dinner together to connect and discuss the day",
            tags=["dinner", "couple", "connection", "family"],
            is_core_requirement=True
        ))
        
        return activities
    
    def _get_weekend_activities(self, date: datetime.date) -> List[DailyActivity]:
        """Generate weekend activities"""
        activities = []
        day_name = date.strftime("%A")
        
        if day_name == "Saturday":
            # Saturday Morning Activities
            activities.append(DailyActivity(
                time="9:00 AM - 10:00 AM",
                duration="1 hour",
                activity="Grocery Shopping",
                location="St. Lawrence Market",
                cost=50,
                networking_potential=2,
                energy_level="low",
                description="Weekly grocery shopping and meal planning",
                tags=["grocery", "shopping", "household", "planning"],
                is_core_requirement=True
            ))
            
            activities.append(DailyActivity(
                time="10:00 AM - 11:00 AM",
                duration="1 hour",
                activity="Household Budgeting",
                location="Home",
                cost=0,
                networking_potential=0,
                energy_level="low",
                description="Weekly expense tracking and bill payments",
                tags=["budgeting", "finance", "household", "planning"],
                is_core_requirement=True
            ))
            
            # Saturday Afternoon Activities
            activities.append(DailyActivity(
                time="2:00 PM - 4:00 PM",
                duration="2 hours",
                activity="Art Workshop at Toronto School of Art",
                location="Toronto School of Art",
                cost=85,
                networking_potential=6,
                energy_level="medium",
                description="Hands-on creative experience with other artists",
                tags=["art", "workshop", "creative", "learning", "social"],
                is_core_requirement=False
            ))
            
            # Saturday Evening
            activities.append(DailyActivity(
                time="6:00 PM - 8:00 PM",
                duration="2 hours",
                activity="Cooking Class at Eataly",
                location="Eataly",
                cost=95,
                networking_potential=6,
                energy_level="medium",
                description="Learn new culinary skills while meeting food enthusiasts",
                tags=["cooking", "learning", "social", "culinary", "couple"],
                is_core_requirement=False
            ))
        
        elif day_name == "Sunday":
            # Sunday Morning - Long Run
            activities.append(DailyActivity(
                time="8:00 AM - 10:00 AM",
                duration="2 hours",
                activity="Sunday Long Run",
                location="Running Route",
                cost=0,
                networking_potential=0,
                energy_level="high",
                description="Sunday long run - 2+ hours solo training for half marathon",
                tags=["running", "fitness", "half-marathon", "long-run", "solo"],
                is_core_requirement=True
            ))
            
            # Mass (9:30 AM - 10:30 AM)
            activities.append(DailyActivity(
                time="10:30 AM - 11:30 AM",
                duration="1 hour",
                activity="Mass",
                location="Church",
                cost=0,
                networking_potential=3,
                energy_level="low",
                description="Weekly mass service",
                tags=["religious", "spiritual", "community", "family"],
                is_core_requirement=True
            ))
            
            # Sunday Afternoon Activities
            activities.append(DailyActivity(
                time="2:00 PM - 4:00 PM",
                duration="2 hours",
                activity="Urban Discovery - New Neighborhood",
                location="Distillery District",
                cost=30,
                networking_potential=4,
                energy_level="medium",
                description="Explore new Toronto neighborhoods and cultural areas",
                tags=["exploration", "cultural", "urban", "discovery", "couple"],
                is_core_requirement=False
            ))
            
            # Sunday Evening
            activities.append(DailyActivity(
                time="6:00 PM - 8:00 PM",
                duration="2 hours",
                activity="Improv Class at The Second City",
                location="The Second City",
                cost=65,
                networking_potential=7,
                energy_level="high",
                description="Improv classes for creative expression and social connection",
                tags=["improv", "comedy", "creative", "social", "learning", "couple"],
                is_core_requirement=False
            ))
        
        # Weekend Dinner
        activities.append(DailyActivity(
            time="8:00 PM - 9:30 PM",
            duration="1.5 hours",
            activity="Weekend Dinner with Peter",
            location="Restaurant/Home",
            cost=60,
            networking_potential=0,
            energy_level="low",
            description="Extended dinner time to connect and plan upcoming week",
            tags=["dinner", "couple", "connection", "planning", "family"],
            is_core_requirement=True
        ))
        
        return activities
    
    def _get_evening_routine(self, date: datetime.date) -> List[DailyActivity]:
        """Generate evening wind-down routine based on 7 Habits"""
        activities = []
        
        # Phase 1: Seek First to Understand - Daily Reflection (9:30 PM - 9:45 PM)
        activities.append(DailyActivity(
            time="9:30 PM - 9:45 PM",
            duration="15 min",
            activity="Seek First to Understand - Daily Reflection",
            location="Home",
            cost=0,
            networking_potential=0,
            energy_level="low",
            description="Reflect on daily interactions, assess listening skills, and consider others' perspectives from today",
            tags=["reflection", "understanding", "empathy", "communication"],
            is_core_requirement=True
        ))
        
        # Phase 2: Think Win-Win - Relationship Review (9:45 PM - 10:00 PM)
        activities.append(DailyActivity(
            time="9:45 PM - 10:00 PM",
            duration="15 min",
            activity="Think Win-Win - Relationship Review",
            location="Home",
            cost=0,
            networking_potential=0,
            energy_level="low",
            description="Review relationships and collaborations, identify win-win opportunities, and plan for mutual benefits",
            tags=["relationships", "win-win", "collaboration", "connection"],
            is_core_requirement=True
        ))
        
        # Phase 3: Evening Shower & Face Routine (10:00 PM - 10:15 PM)
        activities.append(DailyActivity(
            time="10:00 PM - 10:15 PM",
            duration="15 min",
            activity="Evening Shower & Face Routine",
            location="Home",
            cost=0,
            networking_potential=0,
            energy_level="low",
            description="Evening shower, complete face cleansing routine, skincare, and personal grooming before bed",
            tags=["shower", "face-routine", "skincare", "grooming", "bedtime"],
            is_core_requirement=True
        ))
        
        # Phase 4: Sharpen the Saw - Renewal & Rest (10:15 PM - 10:30 PM)
        activities.append(DailyActivity(
            time="10:15 PM - 10:30 PM",
            duration="15 min",
            activity="Sharpen the Saw - Renewal & Rest",
            location="Home",
            cost=0,
            networking_potential=0,
            energy_level="low",
            description="Engage in relaxing activities, practice gratitude, and prepare for restorative sleep",
            tags=["renewal", "rest", "gratitude", "relaxation", "sleep-preparation"],
            is_core_requirement=True
        ))
        
        return activities
    
    def format_schedule_output(self, schedule: Dict[str, List[DailyActivity]]) -> str:
        """Format the schedule for readable output"""
        output = []
        output.append("🎯 **KEVIN'S DAILY PLAY-BY-PLAY SCHEDULE**")
        output.append("📅 **September 15 - October 15, 2025**")
        output.append("=" * 80)
        output.append("")
        
        for day, activities in schedule.items():
            output.append(f"## {day}")
            output.append("")
            
            total_cost = sum(activity.cost for activity in activities)
            networking_activities = [a for a in activities if a.networking_potential > 0]
            core_requirements = [a for a in activities if a.is_core_requirement]
            
            # Day summary
            output.append(f"**📊 Day Summary:**")
            output.append(f"- Total Activities: {len(activities)}")
            output.append(f"- Core Requirements: {len(core_requirements)}")
            output.append(f"- Networking Activities: {len(networking_activities)}")
            output.append(f"- Total Cost: ${total_cost:.0f} CAD")
            output.append("")
            
            # Activities
            for activity in activities:
                priority_marker = "🎯" if activity.is_core_requirement else "📅"
                networking_marker = f" (Networking: {activity.networking_potential}/10)" if activity.networking_potential > 0 else ""
                cost_marker = f" - ${activity.cost:.0f}" if activity.cost > 0 else ""
                
                output.append(f"{priority_marker} **{activity.time}** - {activity.activity}")
                output.append(f"   📍 {activity.location}{cost_marker}{networking_marker}")
                output.append(f"   ⚡ Energy Level: {activity.energy_level.title()}")
                output.append(f"   📝 {activity.description}")
                output.append(f"   🏷️ Tags: {', '.join(activity.tags)}")
                output.append("")
            
            output.append("-" * 80)
            output.append("")
        
        return "\n".join(output)


def main():
    """Generate and display Kevin's daily schedule"""
    scheduler = KevinDailyScheduler()
    schedule = scheduler.generate_monthly_schedule()
    
    # Format and display
    formatted_output = scheduler.format_schedule_output(schedule)
    print(formatted_output)
    
    # Save to file
    with open("kevin_daily_schedule_sept_oct_2025.md", "w") as f:
        f.write(formatted_output)
    
    print("✅ Schedule saved to 'kevin_daily_schedule_sept_oct_2025.md'")
    
    # Generate summary statistics
    total_activities = sum(len(activities) for activities in schedule.values())
    total_cost = sum(sum(activity.cost for activity in activities) for activities in schedule.values())
    networking_activities = sum(len([a for a in activities if a.networking_potential > 0]) for activities in schedule.values())
    core_requirements = sum(len([a for a in activities if a.is_core_requirement]) for activities in schedule.values())
    
    print("\n" + "=" * 50)
    print("📊 **MONTHLY SUMMARY STATISTICS**")
    print("=" * 50)
    print(f"Total Days Scheduled: {len(schedule)}")
    print(f"Total Activities: {total_activities}")
    print(f"Core Requirements: {core_requirements}")
    print(f"Networking Activities: {networking_activities}")
    print(f"Total Estimated Cost: ${total_cost:.0f} CAD")
    print(f"Average Daily Cost: ${total_cost/len(schedule):.0f} CAD")
    print(f"Average Activities per Day: {total_activities/len(schedule):.1f}")


if __name__ == "__main__":
    main()
