#!/usr/bin/env python3
"""
User Personas System for Toronto Life Planner
Structured data format for persona-driven recommendations, routines, and goal-setting
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Set, Tuple
from enum import Enum
import json
from datetime import datetime, time


class LifeStage(Enum):
    """Life stage categories"""
    EARLY_CAREER = "early_career"  # 22-28
    MID_CAREER = "mid_career"      # 29-40
    SENIOR_CAREER = "senior_career" # 41-55
    TRANSITION = "transition"       # Career change, sabbatical
    RETIREMENT = "retirement"       # 55+


class PersonalityType(Enum):
    """Personality types based on common frameworks"""
    EXTROVERT = "extrovert"
    INTROVERT = "introvert"
    AMBIVERT = "ambivert"


class EnergyPattern(Enum):
    """Energy patterns throughout the day"""
    MORNING_PERSON = "morning_person"
    EVENING_PERSON = "evening_person"
    STEADY_ENERGY = "steady_energy"
    VARIABLE_ENERGY = "variable_energy"


class SocialStyle(Enum):
    """Social interaction preferences"""
    NETWORKER = "networker"           # Loves meeting new people
    CONNECTOR = "connector"           # Prefers deep relationships
    BALANCED = "balanced"             # Mix of both
    SELECTIVE = "selective"           # Very choosy about connections


class ActivityPreference(Enum):
    """Activity preference categories"""
    ADVENTURE_SEEKER = "adventure_seeker"
    CULTURE_LOVER = "culture_lover"
    FITNESS_FOCUSED = "fitness_focused"
    PROFESSIONAL_DRIVEN = "professional_driven"
    CREATIVE_SOUL = "creative_soul"
    WELLNESS_ORIENTED = "wellness_oriented"
    SOCIAL_BUTTERFLY = "social_butterfly"
    HOME_BODY = "home_body"


@dataclass
class Demographics:
    """Basic demographic information"""
    age_range: Tuple[int, int] = (25, 35)
    life_stage: LifeStage = LifeStage.MID_CAREER
    occupation: str = "Professional"
    income_level: str = "moderate"  # low, moderate, high, premium
    location_preference: str = "Toronto"
    relationship_status: str = "couple"
    has_children: bool = False
    education_level: str = "university"


@dataclass
class PersonalityProfile:
    """Personality and behavioral characteristics"""
    personality_type: PersonalityType = PersonalityType.AMBIVERT
    energy_pattern: EnergyPattern = EnergyPattern.MORNING_PERSON
    social_style: SocialStyle = SocialStyle.BALANCED
    risk_tolerance: int = 5  # 1-10 scale
    spontaneity_level: int = 6  # 1-10 scale
    perfectionism_level: int = 5  # 1-10 scale
    stress_tolerance: int = 7  # 1-10 scale
    decision_making_style: str = "analytical"  # analytical, intuitive, collaborative


@dataclass
class GoalsAndAspirations:
    """Personal and professional goals"""
    primary_goals: List[str] = field(default_factory=lambda: [
        "Build professional network",
        "Maintain work-life balance",
        "Explore new experiences"
    ])
    career_goals: List[str] = field(default_factory=lambda: [
        "Advance in current field",
        "Build industry connections",
        "Develop new skills"
    ])
    personal_goals: List[str] = field(default_factory=lambda: [
        "Stay healthy and fit",
        "Cultivate meaningful relationships",
        "Learn new things"
    ])
    short_term_goals: List[str] = field(default_factory=lambda: [
        "Meet 5 new people this month",
        "Try 3 new activities",
        "Improve morning routine"
    ])
    long_term_goals: List[str] = field(default_factory=lambda: [
        "Build strong professional network",
        "Achieve career advancement",
        "Maintain healthy lifestyle"
    ])


@dataclass
class Preferences:
    """Activity and lifestyle preferences"""
    activity_preferences: Set[ActivityPreference] = field(default_factory=lambda: {
        ActivityPreference.SOCIAL_BUTTERFLY,
        ActivityPreference.PROFESSIONAL_DRIVEN
    })
    preferred_activity_types: Set[str] = field(default_factory=lambda: {
        "social", "professional", "cultural", "fitness"
    })
    avoided_activity_types: Set[str] = field(default_factory=lambda: set())
    preferred_locations: Set[str] = field(default_factory=lambda: {
        "Downtown", "Entertainment District", "Fashion District"
    })
    budget_preference: str = "moderate"  # budget, moderate, premium
    time_preferences: Dict[str, str] = field(default_factory=lambda: {
        "morning_start": "6:00 AM",
        "bedtime": "10:30 PM",
        "preferred_breakfast": "7:00 AM",
        "preferred_dinner": "6:00 PM"
    })
    group_size_preference: str = "small_groups"  # solo, small_groups, large_groups, mixed
    frequency_preference: str = "moderate"  # low, moderate, high


@dataclass
class Constraints:
    """Time, financial, and other constraints"""
    max_daily_budget: float = 200.0
    max_weekly_budget: float = 1000.0
    available_weekdays: Set[str] = field(default_factory=lambda: {
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
    })
    available_weekends: Set[str] = field(default_factory=lambda: {
        "Saturday", "Sunday"
    })
    time_constraints: Dict[str, str] = field(default_factory=lambda: {
        "work_start": "9:00 AM",
        "work_end": "5:00 PM",
        "lunch_break": "12:00 PM - 1:00 PM"
    })
    physical_limitations: List[str] = field(default_factory=list)
    dietary_restrictions: List[str] = field(default_factory=list)
    accessibility_needs: List[str] = field(default_factory=list)


@dataclass
class BehavioralPatterns:
    """Observed behavioral patterns and habits"""
    typical_morning_routine: List[str] = field(default_factory=lambda: [
        "Wake up early",
        "Exercise or meditation",
        "Healthy breakfast",
        "Review daily goals"
    ])
    typical_evening_routine: List[str] = field(default_factory=lambda: [
        "Wind down activities",
        "Reflect on day",
        "Prepare for tomorrow",
        "Quality time with partner"
    ])
    weekend_habits: List[str] = field(default_factory=lambda: [
        "Social activities",
        "Cultural events",
        "Fitness activities",
        "Relaxation time"
    ])
    stress_management: List[str] = field(default_factory=lambda: [
        "Exercise",
        "Social connection",
        "Creative activities",
        "Nature time"
    ])
    learning_preferences: List[str] = field(default_factory=lambda: [
        "Hands-on experiences",
        "Social learning",
        "Visual learning",
        "Practical application"
    ])


@dataclass
class NetworkingProfile:
    """Networking and social connection preferences"""
    networking_priority: int = 8  # 1-10 scale
    preferred_networking_venues: List[str] = field(default_factory=lambda: [
        "Professional events",
        "Industry mixers",
        "Cultural events",
        "Fitness classes"
    ])
    networking_approach: str = "balanced"  # aggressive, balanced, selective, organic
    relationship_depth_preference: str = "mixed"  # surface, deep, mixed
    follow_up_style: str = "professional"  # casual, professional, personal, mixed
    communication_preference: str = "in_person"  # in_person, digital, mixed


@dataclass
class UserPersona:
    """Complete user persona with all characteristics"""
    # Basic identification
    persona_id: str
    persona_name: str
    description: str
    
    # Core characteristics
    demographics: Demographics
    personality: PersonalityProfile
    goals: GoalsAndAspirations
    preferences: Preferences
    constraints: Constraints
    behavioral_patterns: BehavioralPatterns
    networking: NetworkingProfile
    
    # Metadata
    created_date: datetime = field(default_factory=datetime.now)
    last_updated: datetime = field(default_factory=datetime.now)
    is_active: bool = True
    usage_count: int = 0
    
    def to_dict(self) -> Dict:
        """Convert persona to dictionary for JSON serialization"""
        return {
            "persona_id": self.persona_id,
            "persona_name": self.persona_name,
            "description": self.description,
            "demographics": {
                "age_range": self.demographics.age_range,
                "life_stage": self.demographics.life_stage.value,
                "occupation": self.demographics.occupation,
                "income_level": self.demographics.income_level,
                "location_preference": self.demographics.location_preference,
                "relationship_status": self.demographics.relationship_status,
                "has_children": self.demographics.has_children,
                "education_level": self.demographics.education_level
            },
            "personality": {
                "personality_type": self.personality.personality_type.value,
                "energy_pattern": self.personality.energy_pattern.value,
                "social_style": self.personality.social_style.value,
                "risk_tolerance": self.personality.risk_tolerance,
                "spontaneity_level": self.personality.spontaneity_level,
                "perfectionism_level": self.personality.perfectionism_level,
                "stress_tolerance": self.personality.stress_tolerance,
                "decision_making_style": self.personality.decision_making_style
            },
            "goals": {
                "primary_goals": self.goals.primary_goals,
                "career_goals": self.goals.career_goals,
                "personal_goals": self.goals.personal_goals,
                "short_term_goals": self.goals.short_term_goals,
                "long_term_goals": self.goals.long_term_goals
            },
            "preferences": {
                "activity_preferences": [p.value for p in self.preferences.activity_preferences],
                "preferred_activity_types": list(self.preferences.preferred_activity_types),
                "avoided_activity_types": list(self.preferences.avoided_activity_types),
                "preferred_locations": list(self.preferences.preferred_locations),
                "budget_preference": self.preferences.budget_preference,
                "time_preferences": self.preferences.time_preferences,
                "group_size_preference": self.preferences.group_size_preference,
                "frequency_preference": self.preferences.frequency_preference
            },
            "constraints": {
                "max_daily_budget": self.constraints.max_daily_budget,
                "max_weekly_budget": self.constraints.max_weekly_budget,
                "available_weekdays": list(self.constraints.available_weekdays),
                "available_weekends": list(self.constraints.available_weekends),
                "time_constraints": self.constraints.time_constraints,
                "physical_limitations": self.constraints.physical_limitations,
                "dietary_restrictions": self.constraints.dietary_restrictions,
                "accessibility_needs": self.constraints.accessibility_needs
            },
            "behavioral_patterns": {
                "typical_morning_routine": self.behavioral_patterns.typical_morning_routine,
                "typical_evening_routine": self.behavioral_patterns.typical_evening_routine,
                "weekend_habits": self.behavioral_patterns.weekend_habits,
                "stress_management": self.behavioral_patterns.stress_management,
                "learning_preferences": self.behavioral_patterns.learning_preferences
            },
            "networking": {
                "networking_priority": self.networking.networking_priority,
                "preferred_networking_venues": self.networking.preferred_networking_venues,
                "networking_approach": self.networking.networking_approach,
                "relationship_depth_preference": self.networking.relationship_depth_preference,
                "follow_up_style": self.networking.follow_up_style,
                "communication_preference": self.networking.communication_preference
            },
            "metadata": {
                "created_date": self.created_date.isoformat(),
                "last_updated": self.last_updated.isoformat(),
                "is_active": self.is_active,
                "usage_count": self.usage_count
            }
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'UserPersona':
        """Create persona from dictionary"""
        demographics_data = data.get("demographics", {})
        personality_data = data.get("personality", {})
        goals_data = data.get("goals", {})
        preferences_data = data.get("preferences", {})
        constraints_data = data.get("constraints", {})
        behavioral_data = data.get("behavioral_patterns", {})
        networking_data = data.get("networking", {})
        metadata = data.get("metadata", {})
        
        return cls(
            persona_id=data.get("persona_id", ""),
            persona_name=data.get("persona_name", ""),
            description=data.get("description", ""),
            demographics=Demographics(
                age_range=tuple(demographics_data.get("age_range", (25, 35))),
                life_stage=LifeStage(demographics_data.get("life_stage", "mid_career")),
                occupation=demographics_data.get("occupation", "Professional"),
                income_level=demographics_data.get("income_level", "moderate"),
                location_preference=demographics_data.get("location_preference", "Toronto"),
                relationship_status=demographics_data.get("relationship_status", "couple"),
                has_children=demographics_data.get("has_children", False),
                education_level=demographics_data.get("education_level", "university")
            ),
            personality=PersonalityProfile(
                personality_type=PersonalityType(personality_data.get("personality_type", "ambivert")),
                energy_pattern=EnergyPattern(personality_data.get("energy_pattern", "morning_person")),
                social_style=SocialStyle(personality_data.get("social_style", "balanced")),
                risk_tolerance=personality_data.get("risk_tolerance", 5),
                spontaneity_level=personality_data.get("spontaneity_level", 6),
                perfectionism_level=personality_data.get("perfectionism_level", 5),
                stress_tolerance=personality_data.get("stress_tolerance", 7),
                decision_making_style=personality_data.get("decision_making_style", "analytical")
            ),
            goals=GoalsAndAspirations(
                primary_goals=goals_data.get("primary_goals", []),
                career_goals=goals_data.get("career_goals", []),
                personal_goals=goals_data.get("personal_goals", []),
                short_term_goals=goals_data.get("short_term_goals", []),
                long_term_goals=goals_data.get("long_term_goals", [])
            ),
            preferences=Preferences(
                activity_preferences={ActivityPreference(p) for p in preferences_data.get("activity_preferences", [])},
                preferred_activity_types=set(preferences_data.get("preferred_activity_types", [])),
                avoided_activity_types=set(preferences_data.get("avoided_activity_types", [])),
                preferred_locations=set(preferences_data.get("preferred_locations", [])),
                budget_preference=preferences_data.get("budget_preference", "moderate"),
                time_preferences=preferences_data.get("time_preferences", {}),
                group_size_preference=preferences_data.get("group_size_preference", "small_groups"),
                frequency_preference=preferences_data.get("frequency_preference", "moderate")
            ),
            constraints=Constraints(
                max_daily_budget=constraints_data.get("max_daily_budget", 200.0),
                max_weekly_budget=constraints_data.get("max_weekly_budget", 1000.0),
                available_weekdays=set(constraints_data.get("available_weekdays", [])),
                available_weekends=set(constraints_data.get("available_weekends", [])),
                time_constraints=constraints_data.get("time_constraints", {}),
                physical_limitations=constraints_data.get("physical_limitations", []),
                dietary_restrictions=constraints_data.get("dietary_restrictions", []),
                accessibility_needs=constraints_data.get("accessibility_needs", [])
            ),
            behavioral_patterns=BehavioralPatterns(
                typical_morning_routine=behavioral_data.get("typical_morning_routine", []),
                typical_evening_routine=behavioral_data.get("typical_evening_routine", []),
                weekend_habits=behavioral_data.get("weekend_habits", []),
                stress_management=behavioral_data.get("stress_management", []),
                learning_preferences=behavioral_data.get("learning_preferences", [])
            ),
            networking=NetworkingProfile(
                networking_priority=networking_data.get("networking_priority", 8),
                preferred_networking_venues=networking_data.get("preferred_networking_venues", []),
                networking_approach=networking_data.get("networking_approach", "balanced"),
                relationship_depth_preference=networking_data.get("relationship_depth_preference", "mixed"),
                follow_up_style=networking_data.get("follow_up_style", "professional"),
                communication_preference=networking_data.get("communication_preference", "in_person")
            ),
            created_date=datetime.fromisoformat(metadata.get("created_date", datetime.now().isoformat())),
            last_updated=datetime.fromisoformat(metadata.get("last_updated", datetime.now().isoformat())),
            is_active=metadata.get("is_active", True),
            usage_count=metadata.get("usage_count", 0)
        )


class PersonaManager:
    """Manages user personas and provides persona-driven recommendations"""
    
    def __init__(self, personas_file: str = "personas.json"):
        self.personas_file = personas_file
        self.personas: Dict[str, UserPersona] = {}
        self.load_personas()
    
    def load_personas(self):
        """Load personas from file"""
        try:
            with open(self.personas_file, 'r') as f:
                data = json.load(f)
                for persona_data in data.get("personas", []):
                    persona = UserPersona.from_dict(persona_data)
                    self.personas[persona.persona_id] = persona
        except (FileNotFoundError, json.JSONDecodeError):
            # Create default personas if file doesn't exist
            self.create_default_personas()
    
    def save_personas(self):
        """Save personas to file"""
        data = {
            "personas": [persona.to_dict() for persona in self.personas.values()]
        }
        with open(self.personas_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def create_default_personas(self):
        """Create default personas for demonstration"""
        # Fashion Industry Professional
        fashion_persona = UserPersona(
            persona_id="fashion_professional",
            persona_name="Fashion Industry Professional",
            description="Ambitious fashion professional focused on networking and industry advancement",
            demographics=Demographics(
                age_range=(28, 35),
                life_stage=LifeStage.MID_CAREER,
                occupation="Fashion Professional",
                income_level="high",
                relationship_status="couple"
            ),
            personality=PersonalityProfile(
                personality_type=PersonalityType.EXTROVERT,
                energy_pattern=EnergyPattern.MORNING_PERSON,
                social_style=SocialStyle.NETWORKER,
                risk_tolerance=7,
                spontaneity_level=8,
                stress_tolerance=6
            ),
            goals=GoalsAndAspirations(
                primary_goals=["Build industry network", "Advance career", "Stay current with trends"],
                career_goals=["Become industry influencer", "Build strong professional network", "Launch own brand"],
                personal_goals=["Maintain work-life balance", "Stay creative", "Build meaningful relationships"]
            ),
            preferences=Preferences(
                activity_preferences={ActivityPreference.PROFESSIONAL_DRIVEN, ActivityPreference.CREATIVE_SOUL},
                preferred_activity_types={"professional", "social", "creative", "cultural"},
                preferred_locations={"Fashion District", "Entertainment District", "Yorkville", "Queen West"},
                budget_preference="premium"
            ),
            constraints=Constraints(
                max_daily_budget=300.0,
                max_weekly_budget=1500.0
            ),
            behavioral_patterns=BehavioralPatterns(
                typical_morning_routine=["Early wake up", "Industry news review", "Exercise", "Professional breakfast"],
                typical_evening_routine=["Network follow-up", "Trend research", "Social media", "Early bedtime"],
                weekend_habits=["Fashion events", "Gallery visits", "Professional networking", "Creative projects"],
                stress_management=["Exercise", "Social connection", "Creative activities", "Industry research"],
                learning_preferences=["Hands-on experiences", "Social learning", "Visual learning", "Industry events"]
            ),
            networking=NetworkingProfile(
                networking_priority=9,
                preferred_networking_venues=["Fashion shows", "Industry events", "Gallery openings", "Professional mixers"],
                networking_approach="aggressive"
            )
        )
        
        # Creative Entrepreneur
        creative_persona = UserPersona(
            persona_id="creative_entrepreneur",
            persona_name="Creative Entrepreneur",
            description="Independent creative professional balancing business growth with personal fulfillment",
            demographics=Demographics(
                age_range=(25, 40),
                life_stage=LifeStage.MID_CAREER,
                occupation="Creative Entrepreneur",
                income_level="moderate",
                relationship_status="single"
            ),
            personality=PersonalityProfile(
                personality_type=PersonalityType.AMBIVERT,
                energy_pattern=EnergyPattern.VARIABLE_ENERGY,
                social_style=SocialStyle.CONNECTOR,
                risk_tolerance=8,
                spontaneity_level=9,
                stress_tolerance=5
            ),
            goals=GoalsAndAspirations(
                primary_goals=["Grow business", "Build creative community", "Maintain artistic integrity"],
                career_goals=["Scale creative business", "Build client base", "Develop new skills"],
                personal_goals=["Stay inspired", "Build creative network", "Maintain work-life balance"]
            ),
            preferences=Preferences(
                activity_preferences={ActivityPreference.CREATIVE_SOUL, ActivityPreference.CULTURE_LOVER},
                preferred_activity_types={"creative", "cultural", "social", "fitness"},
                preferred_locations={"Queen West", "Kensington Market", "Distillery District", "Harbourfront"},
                budget_preference="moderate"
            ),
            constraints=Constraints(
                max_daily_budget=150.0,
                max_weekly_budget=800.0
            ),
            behavioral_patterns=BehavioralPatterns(
                typical_morning_routine=["Flexible start", "Creative work", "Coffee", "Inspiration time"],
                typical_evening_routine=["Client work", "Creative projects", "Social time", "Reflection"],
                weekend_habits=["Art galleries", "Creative workshops", "Networking events", "Personal projects"],
                stress_management=["Creative expression", "Nature time", "Social connection", "Physical activity"],
                learning_preferences=["Hands-on experiences", "Visual learning", "Collaborative learning", "Trial and error"]
            ),
            networking=NetworkingProfile(
                networking_priority=7,
                preferred_networking_venues=["Art galleries", "Creative workshops", "Cafes", "Co-working spaces"],
                networking_approach="organic"
            )
        )
        
        # Wellness-Focused Professional
        wellness_persona = UserPersona(
            persona_id="wellness_professional",
            persona_name="Wellness-Focused Professional",
            description="Health-conscious professional prioritizing wellness and meaningful connections",
            demographics=Demographics(
                age_range=(30, 45),
                life_stage=LifeStage.MID_CAREER,
                occupation="Wellness Professional",
                income_level="moderate",
                relationship_status="couple",
                has_children=True
            ),
            personality=PersonalityProfile(
                personality_type=PersonalityType.INTROVERT,
                energy_pattern=EnergyPattern.MORNING_PERSON,
                social_style=SocialStyle.SELECTIVE,
                risk_tolerance=4,
                spontaneity_level=5,
                stress_tolerance=8
            ),
            goals=GoalsAndAspirations(
                primary_goals=["Maintain health", "Build quality relationships", "Achieve work-life balance"],
                career_goals=["Advance in wellness field", "Help others", "Build professional reputation"],
                personal_goals=["Stay healthy", "Spend quality time with family", "Continue learning"]
            ),
            preferences=Preferences(
                activity_preferences={ActivityPreference.WELLNESS_ORIENTED, ActivityPreference.FITNESS_FOCUSED},
                preferred_activity_types={"fitness", "wellness", "cultural", "social"},
                preferred_locations={"Harbourfront", "High Park", "Beaches", "Yoga studios"},
                budget_preference="moderate"
            ),
            constraints=Constraints(
                max_daily_budget=100.0,
                max_weekly_budget=500.0,
                time_constraints={"family_time": "6:00 PM - 8:00 PM"}
            ),
            behavioral_patterns=BehavioralPatterns(
                typical_morning_routine=["Early wake up", "Meditation", "Exercise", "Healthy breakfast"],
                typical_evening_routine=["Family time", "Wind down", "Reading", "Early bedtime"],
                weekend_habits=["Nature walks", "Yoga classes", "Family activities", "Wellness workshops"],
                stress_management=["Exercise", "Meditation", "Nature time", "Deep breathing"],
                learning_preferences=["Hands-on experiences", "Visual learning", "Group learning", "Practical application"]
            ),
            networking=NetworkingProfile(
                networking_priority=6,
                preferred_networking_venues=["Yoga classes", "Wellness workshops", "Health food cafes", "Nature groups"],
                networking_approach="selective"
            )
        )
        
        self.personas = {
            fashion_persona.persona_id: fashion_persona,
            creative_persona.persona_id: creative_persona,
            wellness_persona.persona_id: wellness_persona
        }
        self.save_personas()
    
    def get_persona(self, persona_id: str) -> Optional[UserPersona]:
        """Get persona by ID"""
        return self.personas.get(persona_id)
    
    def get_all_personas(self) -> List[UserPersona]:
        """Get all active personas"""
        return [p for p in self.personas.values() if p.is_active]
    
    def add_persona(self, persona: UserPersona):
        """Add new persona"""
        self.personas[persona.persona_id] = persona
        self.save_personas()
    
    def update_persona(self, persona_id: str, **kwargs):
        """Update persona attributes"""
        if persona_id in self.personas:
            persona = self.personas[persona_id]
            for key, value in kwargs.items():
                if hasattr(persona, key):
                    setattr(persona, key, value)
            persona.last_updated = datetime.now()
            self.save_personas()
    
    def get_persona_recommendations(self, persona_id: str, activity_type: str = None) -> List[Dict]:
        """Get activity recommendations based on persona"""
        persona = self.get_persona(persona_id)
        if not persona:
            return []
        
        recommendations = []
        
        # Filter activities based on persona preferences
        if activity_type:
            # Filter by specific activity type
            if activity_type in persona.preferences.preferred_activity_types:
                recommendations.append({
                    "type": activity_type,
                    "priority": "high",
                    "reason": f"Matches {persona.persona_name}'s preferred activity types"
                })
        else:
            # Get all preferred activity types
            for activity_type in persona.preferences.preferred_activity_types:
                recommendations.append({
                    "type": activity_type,
                    "priority": "high",
                    "reason": f"Matches {persona.persona_name}'s preferred activity types"
                })
        
        # Add networking recommendations
        if persona.networking.networking_priority >= 7:
            recommendations.append({
                "type": "networking",
                "priority": "high",
                "reason": f"High networking priority ({persona.networking.networking_priority}/10)"
            })
        
        # Add budget considerations
        budget_level = persona.preferences.budget_preference
        recommendations.append({
            "type": "budget",
            "priority": "medium",
            "reason": f"Budget preference: {budget_level} (max ${persona.constraints.max_daily_budget}/day)"
        })
        
        return recommendations
    
    def get_persona_routine_suggestions(self, persona_id: str) -> Dict[str, List[str]]:
        """Get routine suggestions based on persona"""
        persona = self.get_persona(persona_id)
        if not persona:
            return {}
        
        suggestions = {
            "morning_routine": persona.behavioral_patterns.typical_morning_routine.copy(),
            "evening_routine": persona.behavioral_patterns.typical_evening_routine.copy(),
            "weekend_activities": persona.behavioral_patterns.weekend_habits.copy()
        }
        
        # Customize based on personality
        if persona.personality.energy_pattern == EnergyPattern.MORNING_PERSON:
            suggestions["morning_routine"].insert(0, "Early morning exercise or meditation")
        elif persona.personality.energy_pattern == EnergyPattern.EVENING_PERSON:
            suggestions["evening_routine"].insert(0, "Evening workout or creative time")
        
        # Add stress management based on personality
        if persona.personality.stress_tolerance < 6:
            suggestions["evening_routine"].append("Stress relief activities")
        
        return suggestions


# Predefined persona templates for quick creation
def create_fashion_professional_persona() -> UserPersona:
    """Create a fashion industry professional persona"""
    return UserPersona(
        persona_id="fashion_pro_001",
        persona_name="Fashion Industry Professional",
        description="Ambitious fashion professional focused on networking and industry advancement",
        demographics=Demographics(
            age_range=(28, 35),
            life_stage=LifeStage.MID_CAREER,
            occupation="Fashion Professional",
            income_level="high",
            relationship_status="couple"
        ),
        personality=PersonalityProfile(
            personality_type=PersonalityType.EXTROVERT,
            energy_pattern=EnergyPattern.MORNING_PERSON,
            social_style=SocialStyle.NETWORKER,
            risk_tolerance=7,
            spontaneity_level=8,
            stress_tolerance=6
        ),
        goals=GoalsAndAspirations(
            primary_goals=["Build industry network", "Advance career", "Stay current with trends"],
            career_goals=["Become industry influencer", "Build strong professional network", "Launch own brand"],
            personal_goals=["Maintain work-life balance", "Stay creative", "Build meaningful relationships"]
        ),
        preferences=Preferences(
            activity_preferences={ActivityPreference.PROFESSIONAL_DRIVEN, ActivityPreference.CREATIVE_SOUL},
            preferred_activity_types={"professional", "social", "creative", "cultural"},
            preferred_locations={"Fashion District", "Entertainment District", "Yorkville", "Queen West"},
            budget_preference="premium"
        ),
        constraints=Constraints(
            max_daily_budget=300.0,
            max_weekly_budget=1500.0
        ),
        behavioral_patterns=BehavioralPatterns(
            typical_morning_routine=["Early wake up", "Industry news review", "Exercise", "Professional breakfast"],
            typical_evening_routine=["Network follow-up", "Trend research", "Social media", "Early bedtime"],
            weekend_habits=["Fashion events", "Gallery visits", "Professional networking", "Creative projects"],
            stress_management=["Exercise", "Social connection", "Creative activities", "Industry research"],
            learning_preferences=["Hands-on experiences", "Social learning", "Visual learning", "Industry events"]
        ),
        networking=NetworkingProfile(
            networking_priority=9,
            preferred_networking_venues=["Fashion shows", "Industry events", "Gallery openings", "Professional mixers"],
            networking_approach="aggressive"
        )
    )


def create_creative_entrepreneur_persona() -> UserPersona:
    """Create a creative entrepreneur persona"""
    return UserPersona(
        persona_id="creative_entrepreneur_001",
        persona_name="Creative Entrepreneur",
        description="Independent creative professional balancing business growth with personal fulfillment",
        demographics=Demographics(
            age_range=(25, 40),
            life_stage=LifeStage.MID_CAREER,
            occupation="Creative Entrepreneur",
            income_level="moderate",
            relationship_status="single"
        ),
        personality=PersonalityProfile(
            personality_type=PersonalityType.AMBIVERT,
            energy_pattern=EnergyPattern.VARIABLE_ENERGY,
            social_style=SocialStyle.CONNECTOR,
            risk_tolerance=8,
            spontaneity_level=9,
            stress_tolerance=5
        ),
        goals=GoalsAndAspirations(
            primary_goals=["Grow business", "Build creative community", "Maintain artistic integrity"],
            career_goals=["Scale creative business", "Build client base", "Develop new skills"],
            personal_goals=["Stay inspired", "Build creative network", "Maintain work-life balance"]
        ),
        preferences=Preferences(
            activity_preferences={ActivityPreference.CREATIVE_SOUL, ActivityPreference.CULTURE_LOVER},
            preferred_activity_types={"creative", "cultural", "social", "fitness"},
            preferred_locations={"Queen West", "Kensington Market", "Distillery District", "Harbourfront"},
            budget_preference="moderate"
        ),
        constraints=Constraints(
            max_daily_budget=150.0,
            max_weekly_budget=800.0
        ),
        behavioral_patterns=BehavioralPatterns(
            typical_morning_routine=["Flexible start", "Creative work", "Coffee", "Inspiration time"],
            typical_evening_routine=["Client work", "Creative projects", "Social time", "Reflection"],
            weekend_habits=["Art galleries", "Creative workshops", "Networking events", "Personal projects"],
            stress_management=["Creative expression", "Nature time", "Social connection", "Physical activity"],
            learning_preferences=["Hands-on experiences", "Visual learning", "Collaborative learning", "Trial and error"]
        ),
        networking=NetworkingProfile(
            networking_priority=7,
            preferred_networking_venues=["Art galleries", "Creative workshops", "Cafes", "Co-working spaces"],
            networking_approach="organic"
        )
    )


def create_wellness_professional_persona() -> UserPersona:
    """Create a wellness-focused professional persona"""
    return UserPersona(
        persona_id="wellness_pro_001",
        persona_name="Wellness-Focused Professional",
        description="Health-conscious professional prioritizing wellness and meaningful connections",
        demographics=Demographics(
            age_range=(30, 45),
            life_stage=LifeStage.MID_CAREER,
            occupation="Wellness Professional",
            income_level="moderate",
            relationship_status="couple",
            has_children=True
        ),
        personality=PersonalityProfile(
            personality_type=PersonalityType.INTROVERT,
            energy_pattern=EnergyPattern.MORNING_PERSON,
            social_style=SocialStyle.SELECTIVE,
            risk_tolerance=4,
            spontaneity_level=5,
            stress_tolerance=8
        ),
        goals=GoalsAndAspirations(
            primary_goals=["Maintain health", "Build quality relationships", "Achieve work-life balance"],
            career_goals=["Advance in wellness field", "Help others", "Build professional reputation"],
            personal_goals=["Stay healthy", "Spend quality time with family", "Continue learning"]
        ),
        preferences=Preferences(
            activity_preferences={ActivityPreference.WELLNESS_ORIENTED, ActivityPreference.FITNESS_FOCUSED},
            preferred_activity_types={"fitness", "wellness", "cultural", "social"},
            preferred_locations={"Harbourfront", "High Park", "Beaches", "Yoga studios"},
            budget_preference="moderate"
        ),
        constraints=Constraints(
            max_daily_budget=100.0,
            max_weekly_budget=500.0,
            time_constraints={"family_time": "6:00 PM - 8:00 PM"}
        ),
        behavioral_patterns=BehavioralPatterns(
            typical_morning_routine=["Early wake up", "Meditation", "Exercise", "Healthy breakfast"],
            typical_evening_routine=["Family time", "Wind down", "Reading", "Early bedtime"],
            weekend_habits=["Nature walks", "Yoga classes", "Family activities", "Wellness workshops"],
            stress_management=["Exercise", "Meditation", "Nature time", "Deep breathing"],
            learning_preferences=["Hands-on experiences", "Visual learning", "Group learning", "Practical application"]
        ),
        networking=NetworkingProfile(
            networking_priority=6,
            preferred_networking_venues=["Yoga classes", "Wellness workshops", "Health food cafes", "Nature groups"],
            networking_approach="selective"
        )
    )


if __name__ == "__main__":
    # Example usage
    manager = PersonaManager()
    
    # Get all personas
    personas = manager.get_all_personas()
    print(f"Loaded {len(personas)} personas:")
    for persona in personas:
        print(f"- {persona.persona_name}: {persona.description}")
    
    # Get recommendations for a specific persona
    if personas:
        persona_id = personas[0].persona_id
        recommendations = manager.get_persona_recommendations(persona_id)
        print(f"\nRecommendations for {personas[0].persona_name}:")
        for rec in recommendations:
            print(f"- {rec['type']}: {rec['reason']}")
        
        # Get routine suggestions
        routines = manager.get_persona_routine_suggestions(persona_id)
        print(f"\nRoutine suggestions for {personas[0].persona_name}:")
        for routine_type, activities in routines.items():
            print(f"{routine_type}: {', '.join(activities)}")
