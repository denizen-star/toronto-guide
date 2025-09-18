#!/usr/bin/env python3
"""
Persona Integration Module for Toronto Life Planner
Integrates user personas with the existing planning system for personalized recommendations
"""

from typing import Dict, List, Optional, Set, Tuple
from dataclasses import dataclass
import json
from datetime import datetime, timedelta

from personas import UserPersona, PersonaManager, ActivityPreference, LifeStage, PersonalityType, Demographics, PersonalityProfile, GoalsAndAspirations, Preferences, Constraints, BehavioralPatterns, NetworkingProfile, EnergyPattern, SocialStyle
from toronto_life_planner import TorontoLifePlanner, Activity, ActivityType, TimeSlot
from config import UserPreferences, PlannerConfig, ConfigManager


@dataclass
class PersonaBasedRecommendation:
    """Recommendation based on persona analysis"""
    activity: Activity
    persona_id: str
    match_score: float  # 0-1 scale
    match_reasons: List[str]
    priority: str  # "high", "medium", "low"
    customization_notes: str = ""


class PersonaIntegratedPlanner:
    """Enhanced Toronto Life Planner with persona-driven recommendations"""
    
    def __init__(self, persona_manager: PersonaManager = None):
        self.persona_manager = persona_manager or PersonaManager()
        self.base_planner = TorontoLifePlanner()
        self.current_persona: Optional[UserPersona] = None
    
    def set_persona(self, persona_id: str) -> bool:
        """Set the active persona for planning"""
        persona = self.persona_manager.get_persona(persona_id)
        if persona:
            self.current_persona = persona
            self._apply_persona_to_planner()
            return True
        return False
    
    def _apply_persona_to_planner(self):
        """Apply persona preferences to the base planner"""
        if not self.current_persona:
            return
        
        # Update planner settings based on persona
        self.base_planner.user_name = self.current_persona.persona_name
        self.base_planner.morning_start = self.current_persona.preferences.time_preferences.get("morning_start", "6:00 AM")
        self.base_planner.bedtime = self.current_persona.preferences.time_preferences.get("bedtime", "10:30 PM")
        
        # Set weather conditions based on persona preferences
        if self.current_persona.preferences.budget_preference == "premium":
            # Premium personas might prefer indoor activities in bad weather
            self.base_planner.set_weather_conditions("sunny")
    
    def generate_persona_itinerary(self, start_date: str, duration: str, 
                                 specific_activities: Optional[List[Dict]] = None) -> Dict:
        """Generate itinerary tailored to the current persona"""
        if not self.current_persona:
            raise ValueError("No persona set. Call set_persona() first.")
        
        # Generate base itinerary
        base_result = self.base_planner.generate_itinerary(start_date, duration, specific_activities)
        
        # Enhance with persona-specific recommendations
        enhanced_itinerary = self._enhance_itinerary_with_persona(base_result["itinerary"])
        
        # Add persona-specific summary
        persona_summary = self._generate_persona_summary()
        
        return {
            "acknowledgment": base_result["acknowledgment"],
            "itinerary": enhanced_itinerary,
            "summary_table": base_result["summary_table"],
            "persona_summary": persona_summary,
            "persona_recommendations": self._get_persona_recommendations()
        }
    
    def _enhance_itinerary_with_persona(self, itinerary: Dict) -> Dict:
        """Enhance itinerary with persona-specific activities and modifications"""
        if not self.current_persona:
            return itinerary
        
        enhanced = {}
        
        for day_key, time_slots in itinerary.items():
            # Check if time_slots is a list of TimeSlot objects or something else
            if isinstance(time_slots, list) and time_slots and hasattr(time_slots[0], 'activity'):
                # It's a list of TimeSlot objects
                enhanced_slots = []
                
                for slot in time_slots:
                    # Get persona-based recommendation for this activity
                    recommendation = self._get_activity_recommendation(slot.activity)
                    
                    # Create enhanced time slot with persona information
                    enhanced_slot = TimeSlot(
                        start_time=slot.start_time,
                        end_time=slot.end_time,
                        activity=slot.activity,
                        notes=slot.notes + f" | Persona Match: {recommendation.match_score:.2f}",
                        is_specific_activity=slot.is_specific_activity
                    )
                    
                    # Add persona-specific notes
                    if recommendation.match_reasons:
                        enhanced_slot.notes += f" | Reasons: {', '.join(recommendation.match_reasons)}"
                    
                    enhanced_slots.append(enhanced_slot)
                
                enhanced[day_key] = enhanced_slots
            else:
                # It's not a list of TimeSlot objects, pass through unchanged
                enhanced[day_key] = time_slots
        
        return enhanced
    
    def _get_activity_recommendation(self, activity: Activity) -> PersonaBasedRecommendation:
        """Get persona-based recommendation for an activity"""
        if not self.current_persona:
            return PersonaBasedRecommendation(activity, "", 0.0, [], "low")
        
        match_score = 0.0
        match_reasons = []
        
        # Check activity type preference
        if activity.activity_type.value in self.current_persona.preferences.preferred_activity_types:
            match_score += 0.3
            match_reasons.append("Matches preferred activity type")
        
        # Check location preference
        if any(loc in activity.location for loc in self.current_persona.preferences.preferred_locations):
            match_score += 0.2
            match_reasons.append("Matches preferred location")
        
        # Check budget alignment
        if activity.cost_cad <= self.current_persona.constraints.max_daily_budget:
            match_score += 0.2
            match_reasons.append("Fits within budget")
        else:
            match_score -= 0.1
            match_reasons.append("Exceeds budget")
        
        # Check networking alignment
        if (activity.social_networking_potential >= self.current_persona.networking.networking_priority - 2 and
            self.current_persona.networking.networking_priority >= 7):
            match_score += 0.2
            match_reasons.append("Good networking opportunity")
        
        # Check personality alignment
        if self.current_persona.personality.personality_type == PersonalityType.EXTROVERT:
            if activity.social_networking_potential >= 6:
                match_score += 0.1
                match_reasons.append("Suits extroverted personality")
        elif self.current_persona.personality.personality_type == PersonalityType.INTROVERT:
            if activity.social_networking_potential <= 4:
                match_score += 0.1
                match_reasons.append("Suits introverted personality")
        
        # Determine priority
        if match_score >= 0.7:
            priority = "high"
        elif match_score >= 0.4:
            priority = "medium"
        else:
            priority = "low"
        
        return PersonaBasedRecommendation(
            activity=activity,
            persona_id=self.current_persona.persona_id,
            match_score=match_score,
            match_reasons=match_reasons,
            priority=priority,
            customization_notes=self._get_customization_notes(activity)
        )
    
    def _get_customization_notes(self, activity: Activity) -> str:
        """Get customization notes based on persona"""
        if not self.current_persona:
            return ""
        
        notes = []
        
        # Time customization
        if self.current_persona.personality.energy_pattern.value == "morning_person":
            if "morning" in activity.name.lower():
                notes.append("Perfect for morning person")
        elif self.current_persona.personality.energy_pattern.value == "evening_person":
            if "evening" in activity.name.lower():
                notes.append("Ideal for evening person")
        
        # Social customization
        if self.current_persona.personality.social_style.value == "networker":
            if activity.social_networking_potential >= 7:
                notes.append("Great for networking-focused person")
        elif self.current_persona.personality.social_style.value == "selective":
            if activity.social_networking_potential <= 5:
                notes.append("Suitable for selective socializer")
        
        # Budget customization
        if self.current_persona.preferences.budget_preference == "budget":
            if activity.cost_cad <= 25:
                notes.append("Budget-friendly option")
        elif self.current_persona.preferences.budget_preference == "premium":
            if activity.cost_cad >= 75:
                notes.append("Premium experience")
        
        return "; ".join(notes)
    
    def _get_persona_recommendations(self) -> List[Dict]:
        """Get general recommendations based on current persona"""
        if not self.current_persona:
            return []
        
        recommendations = []
        
        # Activity type recommendations
        for activity_type in self.current_persona.preferences.preferred_activity_types:
            recommendations.append({
                "type": "activity_type",
                "value": activity_type,
                "priority": "high",
                "reason": f"Matches {self.current_persona.persona_name}'s preferred activity types"
            })
        
        # Location recommendations
        for location in self.current_persona.preferences.preferred_locations:
            recommendations.append({
                "type": "location",
                "value": location,
                "priority": "high",
                "reason": f"Preferred location for {self.current_persona.persona_name}"
            })
        
        # Budget recommendations
        recommendations.append({
            "type": "budget",
            "value": f"${self.current_persona.constraints.max_daily_budget}/day",
            "priority": "medium",
            "reason": f"Budget constraint for {self.current_persona.persona_name}"
        })
        
        # Networking recommendations
        if self.current_persona.networking.networking_priority >= 7:
            recommendations.append({
                "type": "networking",
                "value": "High priority",
                "priority": "high",
                "reason": f"Networking priority: {self.current_persona.networking.networking_priority}/10"
            })
        
        return recommendations
    
    def _generate_persona_summary(self) -> str:
        """Generate summary of persona characteristics and recommendations"""
        if not self.current_persona:
            return "No persona selected"
        
        persona = self.current_persona
        
        summary = f"""
## 👤 **Persona Profile: {persona.persona_name}**

**Description:** {persona.description}

### 🎯 **Key Characteristics**
- **Life Stage:** {persona.demographics.life_stage.value.replace('_', ' ').title()}
- **Personality:** {persona.personality.personality_type.value.title()}
- **Energy Pattern:** {persona.personality.energy_pattern.value.replace('_', ' ').title()}
- **Social Style:** {persona.personality.social_style.value.title()}
- **Budget Level:** {persona.preferences.budget_preference.title()}

### 🎯 **Primary Goals**
{chr(10).join(f"- {goal}" for goal in persona.goals.primary_goals[:3])}

### 🏷️ **Preferred Activity Types**
{', '.join(persona.preferences.preferred_activity_types)}

### 📍 **Preferred Locations**
{', '.join(persona.preferences.preferred_locations)}

### 💰 **Budget Constraints**
- Daily Max: ${persona.constraints.max_daily_budget}
- Weekly Max: ${persona.constraints.max_weekly_budget}

### 🤝 **Networking Profile**
- Priority: {persona.networking.networking_priority}/10
- Approach: {persona.networking.networking_approach.title()}
- Preferred Venues: {', '.join(persona.networking.preferred_networking_venues[:3])}
        """.strip()
        
        return summary
    
    def get_persona_activity_suggestions(self, activity_type: str = None) -> List[PersonaBasedRecommendation]:
        """Get activity suggestions tailored to current persona"""
        if not self.current_persona:
            return []
        
        # Get all activities from base planner
        all_activities = self.base_planner.activities_db
        
        # Filter by activity type if specified
        if activity_type:
            all_activities = [a for a in all_activities if a.activity_type.value == activity_type]
        
        # Score and rank activities
        recommendations = []
        for activity in all_activities:
            rec = self._get_activity_recommendation(activity)
            recommendations.append(rec)
        
        # Sort by match score (descending)
        recommendations.sort(key=lambda x: x.match_score, reverse=True)
        
        # Return top recommendations
        return recommendations[:10]
    
    def get_persona_routine_suggestions(self) -> Dict[str, List[str]]:
        """Get routine suggestions based on current persona"""
        if not self.current_persona:
            return {}
        
        return self.persona_manager.get_persona_routine_suggestions(self.current_persona.persona_id)
    
    def create_persona_from_config(self, config: PlannerConfig) -> UserPersona:
        """Create a persona from existing planner configuration"""
        user_prefs = config.user_preferences
        
        # Map config to persona structure
        demographics = Demographics(
            age_range=(25, 35),  # Default range
            life_stage=LifeStage.MID_CAREER,
            occupation="Professional",
            income_level=user_prefs.budget_level.value,
            relationship_status="couple" if "partner" in user_prefs.partner_name.lower() else "single"
        )
        
        personality = PersonalityProfile(
            personality_type=PersonalityType.AMBIVERT,  # Default
            energy_pattern=EnergyPattern.MORNING_PERSON,  # Based on morning_start
            social_style=SocialStyle.BALANCED,  # Default
            risk_tolerance=5,  # Default
            spontaneity_level=6,  # Default
            stress_tolerance=7,  # Default
            decision_making_style="analytical"  # Default
        )
        
        goals = GoalsAndAspirations(
            primary_goals=["Build professional network", "Maintain work-life balance"],
            career_goals=["Advance in current field", "Build industry connections"],
            personal_goals=["Stay healthy", "Cultivate relationships"]
        )
        
        preferences = Preferences(
            activity_preferences=set(),  # Will be populated from preferred_activity_types
            preferred_activity_types=user_prefs.preferred_activity_types,
            avoided_activity_types=user_prefs.avoided_activity_types,
            preferred_locations=user_prefs.preferred_locations,
            budget_preference=user_prefs.budget_level.value,
            time_preferences={
                "morning_start": user_prefs.morning_start,
                "bedtime": user_prefs.bedtime,
                "preferred_breakfast": user_prefs.preferred_breakfast_time,
                "preferred_dinner": user_prefs.preferred_dinner_time
            }
        )
        
        constraints = Constraints(
            max_daily_budget=user_prefs.max_daily_cost,
            max_weekly_budget=user_prefs.max_daily_cost * 5,  # Estimate
            available_weekdays={"Monday", "Tuesday", "Wednesday", "Thursday", "Friday"},
            available_weekends={"Saturday", "Sunday"}
        )
        
        networking = NetworkingProfile(
            networking_priority=user_prefs.networking_priority,
            preferred_networking_venues=["Professional events", "Industry mixers"],
            networking_approach="balanced"
        )
        
        persona = UserPersona(
            persona_id=f"config_based_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            persona_name=f"Config-Based Persona ({user_prefs.user_name})",
            description="Persona created from existing planner configuration",
            demographics=demographics,
            personality=personality,
            goals=goals,
            preferences=preferences,
            constraints=constraints,
            networking=networking
        )
        
        return persona


def main():
    """Demonstrate persona integration"""
    print("🎭 Persona Integration Demo")
    print("=" * 50)
    
    # Initialize persona-integrated planner
    planner = PersonaIntegratedPlanner()
    
    # Get available personas
    personas = planner.persona_manager.get_all_personas()
    print(f"Available personas: {len(personas)}")
    for persona in personas:
        print(f"- {persona.persona_name}: {persona.description}")
    
    if personas:
        # Set first persona as active
        persona = personas[0]
        planner.set_persona(persona.persona_id)
        print(f"\n✅ Active persona: {persona.persona_name}")
        
        # Generate persona-based itinerary
        result = planner.generate_persona_itinerary("2024-01-15", "1 week")
        
        print("\n📅 Persona-Based Itinerary:")
        print("-" * 30)
        
        # Show first day with persona enhancements
        first_day = list(result["itinerary"].values())[0]
        for slot in first_day[:3]:  # Show first 3 activities
            print(f"{slot.start_time} - {slot.end_time}: {slot.activity.name}")
            print(f"  Notes: {slot.notes}")
            print()
        
        # Show persona summary
        print("\n👤 Persona Summary:")
        print(result["persona_summary"])
        
        # Show recommendations
        print("\n🎯 Persona Recommendations:")
        for rec in result["persona_recommendations"]:
            print(f"- {rec['type']}: {rec['value']} ({rec['priority']} priority)")
            print(f"  Reason: {rec['reason']}")
        
        # Show activity suggestions
        print("\n💡 Top Activity Suggestions:")
        suggestions = planner.get_persona_activity_suggestions("social")
        for i, suggestion in enumerate(suggestions[:5], 1):
            print(f"{i}. {suggestion.activity.name} (Match: {suggestion.match_score:.2f})")
            print(f"   Reasons: {', '.join(suggestion.match_reasons)}")
            print()


if __name__ == "__main__":
    main()
