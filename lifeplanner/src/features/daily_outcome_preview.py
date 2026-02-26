#!/usr/bin/env python3
"""
Daily Outcome Preview System
Generates predictive summaries of expected outcomes for scheduled activities
"""

from dataclasses import dataclass
from datetime import datetime, date, timedelta
from typing import Dict, List, Optional, Any, Tuple
import json

from .outcome_system import ResearchBackedOutcomeDatabase, OutcomeDefinition, ActionOutcomeMapping
from .goal_tracking_database import GoalTrackingDatabase
from .rating_system import OutcomeBasedRatingSystem

@dataclass
class OutcomePreview:
    """Preview of expected outcomes for an activity"""
    outcome_name: str
    description: str
    category: str
    probability: float
    impact_score: float
    time_to_manifest: str
    confidence_level: str

@dataclass
class ActivityPreview:
    """Preview for a single activity"""
    activity_name: str
    time_slot: str
    duration_minutes: int
    expected_outcomes: List[OutcomePreview]
    potential_impact_score: float
    success_probability: float
    personalized_insights: List[str]

@dataclass
class DailyOutcomePreview:
    """Complete daily outcome preview"""
    date: str
    total_activities: int
    activity_previews: List[ActivityPreview]
    daily_impact_summary: Dict[str, float]
    compound_benefits: List[str]
    personalized_insights: List[str]
    success_probabilities: Dict[str, float]
    optimization_suggestions: List[str]

class DailyOutcomePreviewGenerator:
    """Generates comprehensive daily outcome previews"""
    
    def __init__(self, db_path: str = "data/goal_tracking.db"):
        self.outcome_db = ResearchBackedOutcomeDatabase()
        self.tracking_db = GoalTrackingDatabase(db_path)
        self.rating_system = OutcomeBasedRatingSystem()
        
        self.time_manifest_weights = {
            "immediate": 1.0,
            "short_term": 0.8,
            "long_term": 0.6
        }
        
        self.confidence_thresholds = {
            0.9: "Very High",
            0.8: "High", 
            0.7: "Moderate",
            0.6: "Fair",
            0.0: "Low"
        }
    
    def generate_tomorrow_preview(self, scheduled_activities: List[Dict[str, Any]], user_id: str = "kevin") -> DailyOutcomePreview:
        """Generate comprehensive preview for tomorrow's activities"""
        
        tomorrow = date.today() + timedelta(days=1)
        activity_previews = []
        
        # Process each scheduled activity
        for activity in scheduled_activities:
            preview = self._generate_activity_preview(activity, user_id)
            if preview:
                activity_previews.append(preview)
        
        # Calculate daily impact summary
        daily_impact = self._calculate_daily_impact(activity_previews)
        
        # Detect compound benefits
        compound_benefits = self._detect_compound_benefits(activity_previews)
        
        # Generate personalized insights
        insights = self._generate_personalized_insights(activity_previews, user_id)
        
        # Calculate success probabilities
        success_probs = self._calculate_success_probabilities(activity_previews, user_id)
        
        # Generate optimization suggestions
        optimizations = self._generate_optimization_suggestions(activity_previews, user_id)
        
        return DailyOutcomePreview(
            date=tomorrow.strftime("%B %d, %Y"),
            total_activities=len(activity_previews),
            activity_previews=activity_previews,
            daily_impact_summary=daily_impact,
            compound_benefits=compound_benefits,
            personalized_insights=insights,
            success_probabilities=success_probs,
            optimization_suggestions=optimizations
        )
    
    def _generate_activity_preview(self, activity: Dict[str, Any], user_id: str) -> Optional[ActivityPreview]:
        """Generate preview for a single activity"""
        
        activity_name = activity.get("name", "")
        
        # Map activity to outcome data
        action_mapping = self._map_activity_to_outcomes(activity)
        if not action_mapping:
            return None
        
        # Convert outcomes to previews
        outcome_previews = []
        for outcome in action_mapping.primary_outcomes + action_mapping.secondary_outcomes:
            preview = OutcomePreview(
                outcome_name=outcome.name,
                description=outcome.description,
                category=outcome.category,
                probability=outcome.probability,
                impact_score=outcome.impact_score,
                time_to_manifest=outcome.time_to_manifest,
                confidence_level=self._get_confidence_level(outcome.probability)
            )
            outcome_previews.append(preview)
        
        # Calculate potential impact
        impact_score = self._calculate_activity_impact(outcome_previews)
        
        # Get success probability based on user history
        success_prob = self._get_activity_success_probability(action_mapping.action_id, user_id)
        
        # Generate personalized insights
        insights = self._generate_activity_insights(action_mapping, user_id)
        
        return ActivityPreview(
            activity_name=activity_name,
            time_slot=f"{activity.get('start_time', '')} - {activity.get('end_time', '')}",
            duration_minutes=activity.get("duration_minutes", 0),
            expected_outcomes=outcome_previews,
            potential_impact_score=impact_score,
            success_probability=success_prob,
            personalized_insights=insights
        )
    
    def _map_activity_to_outcomes(self, activity: Dict[str, Any]) -> Optional[ActionOutcomeMapping]:
        """Map scheduled activity to outcome database"""
        
        activity_name = activity.get("name", "").lower()
        activity_type = activity.get("activity_type", "").lower()
        
        # Direct mapping based on activity names/types
        if "meditation" in activity_name or "progressive meditation" in activity_name:
            return self.outcome_db.get_action_outcomes("progressive_meditation")
        elif "wake up" in activity_name or "intention" in activity_name:
            return self.outcome_db.get_action_outcomes("wake_up_intention")
        elif "goal visualization" in activity_name or "begin with the end" in activity_name:
            return self.outcome_db.get_action_outcomes("goal_visualization")
        elif "running" in activity_name or activity_type == "fitness":
            return self.outcome_db.get_action_outcomes("physical_exercise")
        elif "networking" in activity_name or activity.get("networking_potential", 0) > 6:
            return self._create_networking_outcome_mapping(activity)
        else:
            return self._create_generic_outcome_mapping(activity)
    
    def _create_networking_outcome_mapping(self, activity: Dict[str, Any]) -> ActionOutcomeMapping:
        """Create outcome mapping for networking activities"""
        
        networking_outcomes = [
            OutcomeDefinition(
                outcome_id="professional_connections",
                name="New Professional Connections",
                description="2-5 new meaningful professional relationships",
                category="professional",
                measurement_type="behavioral",
                research_evidence=["Putnam, R. D. (2000). Bowling Alone: Social Capital"],
                time_to_manifest="immediate",
                probability=0.80,
                impact_score=4.2
            ),
            OutcomeDefinition(
                outcome_id="career_opportunities",
                name="Career Advancement Opportunities",
                description="Potential job leads, collaborations, or career insights",
                category="professional",
                measurement_type="behavioral",
                research_evidence=["Granovetter, M. (1973). The Strength of Weak Ties"],
                time_to_manifest="short_term",
                probability=0.65,
                impact_score=4.5
            ),
            OutcomeDefinition(
                outcome_id="industry_knowledge",
                name="Industry Knowledge Acquisition",
                description="New insights, trends, and industry information",
                category="cognitive",
                measurement_type="subjective",
                research_evidence=["Social Learning Theory - Bandura (1977)"],
                time_to_manifest="immediate",
                probability=0.90,
                impact_score=3.8
            )
        ]
        
        return ActionOutcomeMapping(
            action_id="networking_event",
            action_name=activity.get("name", "Networking Event"),
            frequency="weekly",
            duration_minutes=activity.get("duration_minutes", 120),
            primary_outcomes=networking_outcomes,
            secondary_outcomes=[],
            evidence_strength="strong",
            compound_effects=["Enhanced with follow_up_actions"]
        )
    
    def _create_generic_outcome_mapping(self, activity: Dict[str, Any]) -> ActionOutcomeMapping:
        """Create basic outcome mapping for generic activities"""
        
        # Determine category-based outcomes
        category = activity.get("category", "general")
        networking_potential = activity.get("networking_potential", 0)
        
        outcomes = []
        
        if networking_potential > 5:
            outcomes.append(OutcomeDefinition(
                outcome_id="social_connection",
                name="Social Connection",
                description="Meaningful social interaction and relationship building",
                category="social",
                measurement_type="subjective",
                research_evidence=["Holt-Lunstad et al. (2010). Social relationships and mortality"],
                time_to_manifest="immediate",
                probability=0.70,
                impact_score=3.5
            ))
        
        if "cultural" in category or "learning" in activity.get("name", "").lower():
            outcomes.append(OutcomeDefinition(
                outcome_id="cognitive_stimulation",
                name="Cognitive Stimulation",
                description="Mental engagement and learning opportunities",
                category="cognitive",
                measurement_type="subjective",
                research_evidence=["Park et al. (2014). The Impact of Sustained Engagement"],
                time_to_manifest="immediate",
                probability=0.75,
                impact_score=3.8
            ))
        
        if not outcomes:
            outcomes.append(OutcomeDefinition(
                outcome_id="general_wellbeing",
                name="General Well-being",
                description="Overall life satisfaction and positive experience",
                category="emotional",
                measurement_type="subjective",
                research_evidence=["Lyubomirsky et al. (2005). The benefits of frequent positive affect"],
                time_to_manifest="immediate",
                probability=0.60,
                impact_score=3.0
            ))
        
        return ActionOutcomeMapping(
            action_id="generic_activity",
            action_name=activity.get("name", "Activity"),
            frequency="weekly",
            duration_minutes=activity.get("duration_minutes", 60),
            primary_outcomes=outcomes,
            secondary_outcomes=[],
            evidence_strength="moderate",
            compound_effects=[]
        )
    
    def _calculate_activity_impact(self, outcome_previews: List[OutcomePreview]) -> float:
        """Calculate potential impact score for an activity"""
        
        if not outcome_previews:
            return 0.0
        
        total_impact = 0.0
        for outcome in outcome_previews:
            # Weight by probability, impact, and time to manifest
            time_weight = self.time_manifest_weights.get(outcome.time_to_manifest, 0.5)
            weighted_impact = outcome.probability * outcome.impact_score * time_weight
            total_impact += weighted_impact
        
        # Normalize to 0-10 scale
        max_possible_impact = len(outcome_previews) * 5.0  # Max impact score is 5
        normalized_impact = min((total_impact / max_possible_impact) * 10, 10.0)
        
        return round(normalized_impact, 1)
    
    def _get_activity_success_probability(self, action_id: str, user_id: str) -> float:
        """Get success probability based on user history"""
        
        # Get performance data from tracking database
        perf_data = self.tracking_db.get_performance_data("default_goal", action_id, weeks_back=4)
        
        if perf_data:
            # Base probability on recent completion rate
            base_prob = perf_data.completion_rate
            
            # Adjust for streak (positive momentum)
            streak_bonus = min(perf_data.current_streak * 0.02, 0.20)  # Up to 20% bonus
            
            # Adjust for consistency
            consistency_bonus = perf_data.consistency_score * 0.10  # Up to 10% bonus
            
            final_prob = min(base_prob + streak_bonus + consistency_bonus, 1.0)
            return round(final_prob, 2)
        else:
            # Default probability for new activities
            return 0.75
    
    def _calculate_daily_impact(self, activity_previews: List[ActivityPreview]) -> Dict[str, float]:
        """Calculate daily impact summary by category"""
        
        category_impacts = {
            "cognitive": 0.0,
            "physical": 0.0,
            "emotional": 0.0,
            "social": 0.0,
            "professional": 0.0
        }
        
        category_counts = {cat: 0 for cat in category_impacts.keys()}
        
        for activity in activity_previews:
            for outcome in activity.expected_outcomes:
                category = outcome.category
                if category in category_impacts:
                    impact = outcome.probability * outcome.impact_score
                    category_impacts[category] += impact
                    category_counts[category] += 1
        
        # Normalize to 0-10 scale
        for category in category_impacts:
            if category_counts[category] > 0:
                avg_impact = category_impacts[category] / category_counts[category]
                category_impacts[category] = min(avg_impact * 2, 10.0)  # Scale to 0-10
        
        # Calculate overall day rating
        overall_rating = sum(category_impacts.values()) / len([v for v in category_impacts.values() if v > 0])
        category_impacts["overall_day_rating"] = round(overall_rating, 1) if overall_rating else 0.0
        
        return {k: round(v, 1) for k, v in category_impacts.items()}
    
    def _detect_compound_benefits(self, activity_previews: List[ActivityPreview]) -> List[str]:
        """Detect synergistic effects between activities"""
        
        compound_benefits = []
        
        # Check for meditation + exercise combination
        has_meditation = any("meditation" in a.activity_name.lower() for a in activity_previews)
        has_exercise = any("running" in a.activity_name.lower() or "exercise" in a.activity_name.lower() for a in activity_previews)
        
        if has_meditation and has_exercise:
            compound_benefits.append("Meditation + Exercise = 45% better stress management (vs 25% each alone)")
        
        # Check for morning routine combination
        has_intention = any("intention" in a.activity_name.lower() for a in activity_previews)
        has_visualization = any("visualization" in a.activity_name.lower() for a in activity_previews)
        
        if has_intention and has_visualization:
            compound_benefits.append("Morning Routine + Goal Visualization = 67% higher daily goal completion")
        
        # Check for exercise + networking combination
        has_networking = any("networking" in a.activity_name.lower() for a in activity_previews)
        
        if has_exercise and has_networking:
            compound_benefits.append("Exercise + Networking = 23% more meaningful professional connections")
        
        return compound_benefits
    
    def _generate_personalized_insights(self, activity_previews: List[ActivityPreview], user_id: str) -> List[str]:
        """Generate personalized insights based on user patterns"""
        
        insights = []
        
        # Check for streak achievements
        for activity in activity_previews:
            if "meditation" in activity.activity_name.lower():
                perf_data = self.tracking_db.get_performance_data("default_goal", "progressive_meditation")
                if perf_data and perf_data.current_streak >= 18:
                    insights.append(f"🔥 Your {perf_data.current_streak}-day meditation streak is building significant neuroplasticity benefits")
        
        # Check for high-performance patterns
        total_impact = sum(a.potential_impact_score for a in activity_previews)
        if total_impact > 30:
            insights.append("🌟 Today's activities align strongly with your personal development goals")
        
        # Check for networking focus
        networking_activities = [a for a in activity_previews if "networking" in a.activity_name.lower()]
        if networking_activities:
            insights.append("🤝 Strong networking focus today - remember to follow up within 48 hours")
        
        # Check for balance
        categories = set()
        for activity in activity_previews:
            for outcome in activity.expected_outcomes:
                categories.add(outcome.category)
        
        if len(categories) >= 4:
            insights.append("⚖️ Excellent life balance: covering cognitive, physical, emotional, and social domains")
        
        return insights
    
    def _calculate_success_probabilities(self, activity_previews: List[ActivityPreview], user_id: str) -> Dict[str, float]:
        """Calculate success probabilities for different activity types"""
        
        probs = {}
        
        morning_activities = [a for a in activity_previews if "6:" in a.time_slot or "7:" in a.time_slot]
        if morning_activities:
            avg_prob = sum(a.success_probability for a in morning_activities) / len(morning_activities)
            probs["morning_routine_completion"] = f"{avg_prob:.0%}"
        
        exercise_activities = [a for a in activity_previews if "running" in a.activity_name.lower()]
        if exercise_activities:
            avg_prob = sum(a.success_probability for a in exercise_activities) / len(exercise_activities)
            probs["exercise_completion"] = f"{avg_prob:.0%}"
        
        networking_activities = [a for a in activity_previews if "networking" in a.activity_name.lower()]
        if networking_activities:
            avg_prob = sum(a.success_probability for a in networking_activities) / len(networking_activities)
            probs["networking_attendance"] = f"{avg_prob:.0%}"
        
        # Overall day success
        if activity_previews:
            overall_prob = sum(a.success_probability for a in activity_previews) / len(activity_previews)
            probs["overall_day_success"] = f"{overall_prob:.0%}"
        
        return probs
    
    def _generate_optimization_suggestions(self, activity_previews: List[ActivityPreview], user_id: str) -> List[str]:
        """Generate optimization suggestions for better outcomes"""
        
        suggestions = []
        
        # Check for low-impact activities
        low_impact = [a for a in activity_previews if a.potential_impact_score < 5.0]
        if low_impact:
            suggestions.append(f"Consider enhancing {len(low_impact)} activities with higher outcome potential")
        
        # Check for missing compound opportunities
        has_meditation = any("meditation" in a.activity_name.lower() for a in activity_previews)
        has_exercise = any("exercise" in a.activity_name.lower() or "running" in a.activity_name.lower() for a in activity_previews)
        
        if has_meditation and not has_exercise:
            suggestions.append("Add light exercise to amplify meditation benefits through compound effects")
        
        # Check for timing optimization
        evening_activities = [a for a in activity_previews if "PM" in a.time_slot]
        if len(evening_activities) > 3:
            suggestions.append("Consider moving some evening activities to morning for better energy utilization")
        
        return suggestions
    
    def _get_confidence_level(self, probability: float) -> str:
        """Get confidence level description from probability"""
        for threshold, level in sorted(self.confidence_thresholds.items(), reverse=True):
            if probability >= threshold:
                return level
        return "Low"
    
    def _generate_activity_insights(self, action_mapping: ActionOutcomeMapping, user_id: str) -> List[str]:
        """Generate activity-specific insights"""
        
        insights = []
        
        if action_mapping.compound_effects:
            insights.append(f"Synergistic with: {', '.join(action_mapping.compound_effects)}")
        
        if action_mapping.evidence_strength == "strong":
            insights.append("Backed by strong scientific evidence")
        
        return insights

def create_sample_daily_preview() -> DailyOutcomePreview:
    """Create a sample daily preview for testing"""
    
    generator = DailyOutcomePreviewGenerator()
    
    sample_activities = [
        {
            "name": "Wake Up & Intention Setting",
            "start_time": "6:00 AM",
            "end_time": "6:15 AM",
            "duration_minutes": 15,
            "activity_type": "morning_routine"
        },
        {
            "name": "Goal Visualization",
            "start_time": "6:15 AM", 
            "end_time": "6:45 AM",
            "duration_minutes": 30,
            "activity_type": "morning_routine"
        },
        {
            "name": "Progressive Meditation",
            "start_time": "6:45 AM",
            "end_time": "6:47 AM", 
            "duration_minutes": 2,
            "activity_type": "morning_routine"
        },
        {
            "name": "Tuesday Running",
            "start_time": "7:00 AM",
            "end_time": "8:00 AM",
            "duration_minutes": 60,
            "activity_type": "fitness"
        },
        {
            "name": "Toronto Data Science Meetup",
            "start_time": "6:30 PM",
            "end_time": "8:30 PM",
            "duration_minutes": 120,
            "networking_potential": 9
        }
    ]
    
    return generator.generate_tomorrow_preview(sample_activities)

if __name__ == "__main__":
    # Test the daily preview system
    preview = create_sample_daily_preview()
    
    print(f"📅 DAILY OUTCOME PREVIEW - {preview.date}")
    print("=" * 60)
    
    print(f"\n🎯 DAILY SUMMARY:")
    print(f"Total Activities: {preview.total_activities}")
    print(f"Overall Day Rating: {preview.daily_impact_summary.get('overall_day_rating', 0)}/10")
    
    print(f"\n📊 IMPACT BY CATEGORY:")
    for category, score in preview.daily_impact_summary.items():
        if category != "overall_day_rating" and score > 0:
            print(f"  {category.title()}: {score}/10")
    
    print(f"\n🔥 COMPOUND BENEFITS:")
    for benefit in preview.compound_benefits:
        print(f"  • {benefit}")
    
    print(f"\n💡 PERSONALIZED INSIGHTS:")
    for insight in preview.personalized_insights:
        print(f"  • {insight}")
    
    print(f"\n📈 SUCCESS PROBABILITIES:")
    for metric, prob in preview.success_probabilities.items():
        print(f"  {metric.replace('_', ' ').title()}: {prob}")
    
    print(f"\n🚀 OPTIMIZATION SUGGESTIONS:")
    for suggestion in preview.optimization_suggestions:
        print(f"  • {suggestion}")
