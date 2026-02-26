#!/usr/bin/env python3
"""
Outcome-Based Rating System
Calculates comprehensive ratings based on frequency, duration, outcomes, and research evidence
"""

from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple
import math
from datetime import datetime, timedelta

from .outcome_system import ActionOutcomeMapping, OutcomeDefinition

@dataclass
class ActivityPerformanceData:
    """Performance data for rating calculations"""
    action_id: str
    frequency: str
    duration_minutes: int
    completion_rate: float  # 0.0-1.0
    current_streak: int
    total_completions: int
    consistency_score: float  # 0.0-1.0
    user_satisfaction: float  # 1.0-5.0 scale
    weeks_active: int

@dataclass
class RatingResult:
    """Comprehensive rating result"""
    overall_rating: float
    grade: str
    base_rating: float
    outcome_multiplier: float
    consistency_bonus: float
    research_strength_bonus: float
    streak_bonus: float
    rating_breakdown: Dict[str, float]
    explanation: str
    improvement_suggestions: List[str]

class OutcomeBasedRatingSystem:
    """Advanced rating system that considers outcomes, research, and performance"""
    
    def __init__(self):
        self.frequency_weights = {
            "daily": 4.0,
            "4x_weekly": 3.5,
            "3x_weekly": 3.0,
            "weekly": 2.5,
            "bi_weekly": 2.0,
            "monthly": 1.5,
            "quarterly": 1.0,
            "yearly": 0.5
        }
        
        self.category_impact_weights = {
            "cognitive": 1.5,
            "physical": 1.3,
            "emotional": 1.4,
            "social": 1.2,
            "professional": 1.3
        }
        
        self.evidence_strength_multipliers = {
            "strong": 1.3,
            "moderate": 1.1,
            "emerging": 1.0
        }
        
        self.grade_thresholds = [
            (9.5, "A+"),
            (9.0, "A"),
            (8.5, "A-"),
            (8.0, "B+"),
            (7.5, "B"),
            (7.0, "B-"),
            (6.5, "C+"),
            (6.0, "C"),
            (5.5, "C-"),
            (5.0, "D"),
            (0.0, "F")
        ]
    
    def calculate_comprehensive_rating(
        self, 
        action_mapping: ActionOutcomeMapping, 
        performance_data: ActivityPerformanceData
    ) -> RatingResult:
        """Calculate comprehensive rating for an activity"""
        
        # Calculate component scores
        base_rating = self._calculate_base_rating(action_mapping, performance_data)
        outcome_multiplier = self._calculate_outcome_value(action_mapping)
        consistency_bonus = self._calculate_consistency_bonus(performance_data)
        research_bonus = self._calculate_research_strength_bonus(action_mapping)
        streak_bonus = self._calculate_streak_bonus(performance_data)
        
        # Calculate final rating
        weighted_base = base_rating * outcome_multiplier
        total_bonus = consistency_bonus + research_bonus + streak_bonus
        final_rating = min(weighted_base + total_bonus, 10.0)
        
        # Generate grade and explanation
        grade = self._get_grade(final_rating)
        explanation = self._generate_explanation(action_mapping, performance_data, final_rating)
        suggestions = self._generate_improvement_suggestions(action_mapping, performance_data, final_rating)
        
        return RatingResult(
            overall_rating=round(final_rating, 1),
            grade=grade,
            base_rating=round(base_rating, 1),
            outcome_multiplier=round(outcome_multiplier, 2),
            consistency_bonus=round(consistency_bonus, 1),
            research_strength_bonus=round(research_bonus, 1),
            streak_bonus=round(streak_bonus, 1),
            rating_breakdown={
                "base_score": base_rating,
                "outcome_value": outcome_multiplier,
                "consistency": consistency_bonus,
                "research_backing": research_bonus,
                "streak_achievement": streak_bonus,
                "final_score": final_rating
            },
            explanation=explanation,
            improvement_suggestions=suggestions
        )
    
    def _calculate_base_rating(
        self, 
        action_mapping: ActionOutcomeMapping, 
        performance_data: ActivityPerformanceData
    ) -> float:
        """Calculate base rating from frequency and duration"""
        
        # Frequency component
        frequency_score = self.frequency_weights.get(action_mapping.frequency, 2.0)
        
        # Duration component (progressive for meditation)
        if action_mapping.action_id == "progressive_meditation":
            # Progressive meditation: 1-5 minutes based on weeks
            duration_minutes = min(1 + (performance_data.weeks_active // 4), 5)
            duration_bonus = min(duration_minutes / 5.0, 1.0)  # 0.2 to 1.0
        else:
            duration_bonus = min(action_mapping.duration_minutes / 60.0, 2.0)  # Up to 2 points for 60+ min
        
        # User satisfaction component
        satisfaction_bonus = (performance_data.user_satisfaction - 1) / 4.0  # Convert 1-5 to 0-1 scale
        
        return frequency_score + duration_bonus + satisfaction_bonus
    
    def _calculate_outcome_value(self, action_mapping: ActionOutcomeMapping) -> float:
        """Calculate multiplier based on research-backed outcome strength"""
        
        all_outcomes = action_mapping.primary_outcomes + action_mapping.secondary_outcomes
        if not all_outcomes:
            return 1.0
        
        total_outcome_value = 0
        for outcome in all_outcomes:
            # Weight by probability and impact
            probability_weight = outcome.probability
            impact_weight = outcome.impact_score / 5.0  # Normalize to 0-1
            category_weight = self.category_impact_weights.get(outcome.category, 1.0)
            
            outcome_value = probability_weight * impact_weight * category_weight
            total_outcome_value += outcome_value
        
        # Average outcome value, with bonus for multiple outcomes
        avg_outcome_value = total_outcome_value / len(all_outcomes)
        multiple_outcomes_bonus = min(len(all_outcomes) * 0.1, 0.5)  # Up to 0.5 bonus
        
        return min(avg_outcome_value + multiple_outcomes_bonus, 2.0)
    
    def _calculate_consistency_bonus(self, performance_data: ActivityPerformanceData) -> float:
        """Calculate bonus points for consistent completion"""
        
        # Completion rate component (0-2 points)
        completion_bonus = performance_data.completion_rate * 2.0
        
        # Consistency score component (0-1 points)
        consistency_bonus = performance_data.consistency_score * 1.0
        
        # Long-term commitment bonus (0-0.5 points)
        commitment_bonus = min(performance_data.weeks_active / 52.0, 0.5)  # Up to 0.5 for year+
        
        return completion_bonus + consistency_bonus + commitment_bonus
    
    def _calculate_research_strength_bonus(self, action_mapping: ActionOutcomeMapping) -> float:
        """Calculate bonus for research evidence strength"""
        
        evidence_multiplier = self.evidence_strength_multipliers.get(action_mapping.evidence_strength, 1.0)
        
        # Count research citations
        total_citations = 0
        for outcome in action_mapping.primary_outcomes + action_mapping.secondary_outcomes:
            total_citations += len(outcome.research_evidence)
        
        citation_bonus = min(total_citations * 0.1, 1.0)  # Up to 1.0 for 10+ citations
        
        return (evidence_multiplier - 1.0) + citation_bonus
    
    def _calculate_streak_bonus(self, performance_data: ActivityPerformanceData) -> float:
        """Calculate bonus for current streak achievement"""
        
        if performance_data.current_streak == 0:
            return 0.0
        
        # Streak milestones with increasing bonuses
        streak_bonuses = [
            (365, 2.0),  # 1 year
            (180, 1.5),  # 6 months
            (90, 1.2),   # 3 months
            (60, 1.0),   # 2 months
            (30, 0.8),   # 1 month
            (14, 0.5),   # 2 weeks
            (7, 0.3),    # 1 week
            (3, 0.1)     # 3 days
        ]
        
        for days, bonus in streak_bonuses:
            if performance_data.current_streak >= days:
                return bonus
        
        return 0.0
    
    def _get_grade(self, rating: float) -> str:
        """Convert numeric rating to letter grade"""
        for threshold, grade in self.grade_thresholds:
            if rating >= threshold:
                return grade
        return "F"
    
    def _generate_explanation(
        self, 
        action_mapping: ActionOutcomeMapping, 
        performance_data: ActivityPerformanceData,
        final_rating: float
    ) -> str:
        """Generate human-readable explanation of the rating"""
        
        grade = self._get_grade(final_rating)
        frequency_desc = action_mapping.frequency.replace("_", " ").title()
        
        if final_rating >= 9.0:
            quality = "Outstanding"
        elif final_rating >= 8.0:
            quality = "Excellent"
        elif final_rating >= 7.0:
            quality = "Good"
        elif final_rating >= 6.0:
            quality = "Satisfactory"
        else:
            quality = "Needs Improvement"
        
        explanation = f"{quality}: {frequency_desc} habit with "
        
        # Add specific strengths
        strengths = []
        if performance_data.completion_rate >= 0.9:
            strengths.append("excellent consistency")
        elif performance_data.completion_rate >= 0.7:
            strengths.append("good consistency")
        
        if performance_data.current_streak >= 30:
            strengths.append("strong streak achievement")
        elif performance_data.current_streak >= 7:
            strengths.append("solid streak building")
        
        if action_mapping.evidence_strength == "strong":
            strengths.append("strong research backing")
        
        if len(action_mapping.primary_outcomes) >= 3:
            strengths.append("multiple proven benefits")
        
        if strengths:
            explanation += ", ".join(strengths)
        else:
            explanation += "room for improvement"
        
        return explanation
    
    def _generate_improvement_suggestions(
        self, 
        action_mapping: ActionOutcomeMapping, 
        performance_data: ActivityPerformanceData,
        final_rating: float
    ) -> List[str]:
        """Generate personalized improvement suggestions"""
        
        suggestions = []
        
        # Consistency improvements
        if performance_data.completion_rate < 0.8:
            suggestions.append(f"Improve consistency: Currently {performance_data.completion_rate:.0%}, target 80%+")
        
        # Streak building
        if performance_data.current_streak < 7:
            suggestions.append("Focus on building a 7-day streak for habit formation")
        elif performance_data.current_streak < 30:
            suggestions.append("Target a 30-day streak for compound benefits")
        
        # Duration optimization
        if action_mapping.action_id == "progressive_meditation" and performance_data.weeks_active >= 4:
            next_duration = min(1 + (performance_data.weeks_active // 4), 5)
            suggestions.append(f"Ready for {next_duration}-minute meditation sessions")
        
        # Satisfaction improvements
        if performance_data.user_satisfaction < 4.0:
            suggestions.append("Consider adjusting timing or approach to increase enjoyment")
        
        # Compound effects
        if action_mapping.compound_effects:
            suggestions.append(f"Combine with: {', '.join(action_mapping.compound_effects)} for synergistic benefits")
        
        return suggestions

def create_sample_performance_data() -> Dict[str, ActivityPerformanceData]:
    """Create sample performance data for testing"""
    
    return {
        "progressive_meditation": ActivityPerformanceData(
            action_id="progressive_meditation",
            frequency="daily",
            duration_minutes=2,  # Week 5-8 phase
            completion_rate=0.95,
            current_streak=18,
            total_completions=95,
            consistency_score=0.92,
            user_satisfaction=4.5,
            weeks_active=5
        ),
        
        "goal_visualization": ActivityPerformanceData(
            action_id="goal_visualization",
            frequency="daily",
            duration_minutes=30,
            completion_rate=1.0,
            current_streak=12,
            total_completions=60,
            consistency_score=1.0,
            user_satisfaction=4.2,
            weeks_active=8
        ),
        
        "physical_exercise": ActivityPerformanceData(
            action_id="physical_exercise",
            frequency="4x_weekly",
            duration_minutes=75,
            completion_rate=1.0,
            current_streak=28,  # 4 weeks perfect
            total_completions=32,
            consistency_score=1.0,
            user_satisfaction=4.8,
            weeks_active=8
        ),
        
        "wake_up_intention": ActivityPerformanceData(
            action_id="wake_up_intention",
            frequency="daily",
            duration_minutes=15,
            completion_rate=0.86,
            current_streak=8,
            total_completions=43,
            consistency_score=0.88,
            user_satisfaction=4.0,
            weeks_active=7
        )
    }

if __name__ == "__main__":
    # Test the rating system
    from outcome_system import ResearchBackedOutcomeDatabase
    
    db = ResearchBackedOutcomeDatabase()
    rating_system = OutcomeBasedRatingSystem()
    sample_data = create_sample_performance_data()
    
    print("🎯 COMPREHENSIVE ACTIVITY RATINGS")
    print("=" * 50)
    
    for action_id, performance in sample_data.items():
        action_mapping = db.get_action_outcomes(action_id)
        if action_mapping:
            result = rating_system.calculate_comprehensive_rating(action_mapping, performance)
            
            print(f"\n📊 {action_mapping.action_name}")
            print(f"Overall Rating: {result.overall_rating}/10 ({result.grade})")
            print(f"Explanation: {result.explanation}")
            
            print(f"\nBreakdown:")
            print(f"  Base Score: {result.base_rating}")
            print(f"  Outcome Value: {result.outcome_multiplier}x")
            print(f"  Consistency: +{result.consistency_bonus}")
            print(f"  Research Backing: +{result.research_strength_bonus}")
            print(f"  Streak Achievement: +{result.streak_bonus}")
            
            if result.improvement_suggestions:
                print(f"\nSuggestions:")
                for suggestion in result.improvement_suggestions:
                    print(f"  • {suggestion}")
            
            print("-" * 40)
