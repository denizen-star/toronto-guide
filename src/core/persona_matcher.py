#!/usr/bin/env python3
"""
Persona Matching System
Matches users to appropriate personas based on onboarding questionnaire responses
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple, Any
from enum import Enum
import json


class PersonaType(Enum):
    """Available persona types"""
    WORKING_KEVIN = "working_kevin"
    JOB_SEARCHING_KEVIN = "job_searching_kevin"
    SUPPORTING_PETER = "supporting_peter"
    # Future personas
    ENTREPRENEUR_KEVIN = "entrepreneur_kevin"
    FREELANCER_KEVIN = "freelancer_kevin"
    CAREER_CHANGER_KEVIN = "career_changer_kevin"
    EXECUTIVE_KEVIN = "executive_kevin"
    RETIRED_KEVIN = "retired_kevin"


@dataclass
class QuestionResponse:
    """Individual question response"""
    question_id: str
    question_text: str
    selected_option: str
    option_text: str
    persona_weights: Dict[str, float] = field(default_factory=dict)


@dataclass
class MatchingResult:
    """Result of persona matching"""
    primary_persona: PersonaType
    confidence_score: float
    persona_scores: Dict[PersonaType, float]
    supporting_factors: List[str]
    recommendations: List[str]


class PersonaMatcher:
    """Matches users to personas based on questionnaire responses"""
    
    def __init__(self):
        self.questions = self._load_questions()
        self.persona_weights = self._load_persona_weights()
    
    def _load_questions(self) -> List[Dict[str, Any]]:
        """Load onboarding questions"""
        return [
            {
                "id": "employment_status",
                "text": "What best describes your current work situation?",
                "type": "single_choice",
                "required": True,
                "weight": 3.0,  # High weight for primary differentiator
                "options": [
                    {
                        "id": "employed_satisfied",
                        "text": "Employed and satisfied with my current role",
                        "persona_weights": {
                            "working_kevin": 3.0,
                            "job_searching_kevin": 0.0
                        }
                    },
                    {
                        "id": "employed_looking",
                        "text": "Employed but looking for new opportunities",
                        "persona_weights": {
                            "working_kevin": 0.5,
                            "job_searching_kevin": 2.5
                        }
                    },
                    {
                        "id": "unemployed_searching",
                        "text": "Unemployed and actively job searching",
                        "persona_weights": {
                            "working_kevin": 0.0,
                            "job_searching_kevin": 3.0
                        }
                    },
                    {
                        "id": "between_jobs",
                        "text": "Between jobs or career transitioning",
                        "persona_weights": {
                            "working_kevin": 0.0,
                            "job_searching_kevin": 3.0
                        }
                    },
                    {
                        "id": "self_employed",
                        "text": "Self-employed/entrepreneur",
                        "persona_weights": {
                            "working_kevin": 0.0,
                            "job_searching_kevin": 0.0,
                            "entrepreneur_kevin": 3.0
                        }
                    }
                ]
            },
            {
                "id": "job_satisfaction",
                "text": "How would you rate your current job satisfaction? (1-10)",
                "type": "scale",
                "required": True,
                "weight": 2.5,
                "scale_range": [1, 10],
                "persona_mapping": {
                    "1-4": {"job_searching_kevin": 2.5},
                    "5-7": {"working_kevin": 1.0, "job_searching_kevin": 1.5},
                    "8-10": {"working_kevin": 2.5}
                }
            },
            {
                "id": "career_goal",
                "text": "What's your primary career goal right now?",
                "type": "single_choice",
                "required": True,
                "weight": 2.5,
                "options": [
                    {
                        "id": "excel_current",
                        "text": "Excel in my current role and build my network",
                        "persona_weights": {
                            "working_kevin": 2.5,
                            "job_searching_kevin": 0.0
                        }
                    },
                    {
                        "id": "find_new_job",
                        "text": "Find a new job or career opportunity",
                        "persona_weights": {
                            "working_kevin": 0.0,
                            "job_searching_kevin": 2.5
                        }
                    },
                    {
                        "id": "get_promoted",
                        "text": "Get promoted within my current company",
                        "persona_weights": {
                            "working_kevin": 2.5,
                            "job_searching_kevin": 0.0
                        }
                    },
                    {
                        "id": "change_careers",
                        "text": "Change careers entirely",
                        "persona_weights": {
                            "working_kevin": 0.0,
                            "job_searching_kevin": 2.5,
                            "career_changer_kevin": 2.5
                        }
                    },
                    {
                        "id": "start_business",
                        "text": "Start my own business",
                        "persona_weights": {
                            "entrepreneur_kevin": 2.5
                        }
                    }
                ]
            },
            {
                "id": "schedule_flexibility",
                "text": "How flexible is your current schedule?",
                "type": "single_choice",
                "required": True,
                "weight": 2.0,
                "options": [
                    {
                        "id": "very_structured",
                        "text": "Very structured, fixed hours",
                        "persona_weights": {
                            "working_kevin": 2.0,
                            "job_searching_kevin": 0.0
                        }
                    },
                    {
                        "id": "somewhat_flexible",
                        "text": "Somewhat flexible within business hours",
                        "persona_weights": {
                            "working_kevin": 2.0,
                            "job_searching_kevin": 0.5
                        }
                    },
                    {
                        "id": "very_flexible",
                        "text": "Very flexible, I control my time",
                        "persona_weights": {
                            "working_kevin": 0.0,
                            "job_searching_kevin": 2.0
                        }
                    },
                    {
                        "id": "no_fixed_schedule",
                        "text": "No fixed schedule currently",
                        "persona_weights": {
                            "working_kevin": 0.0,
                            "job_searching_kevin": 2.0
                        }
                    }
                ]
            },
            {
                "id": "networking_time",
                "text": "How much time can you dedicate to networking/career activities per week?",
                "type": "single_choice",
                "required": True,
                "weight": 2.0,
                "options": [
                    {
                        "id": "1_2_hours",
                        "text": "1-2 hours (maintenance networking)",
                        "persona_weights": {
                            "working_kevin": 2.0,
                            "job_searching_kevin": 0.0
                        }
                    },
                    {
                        "id": "2_4_hours",
                        "text": "2-4 hours (after work/weekends)",
                        "persona_weights": {
                            "working_kevin": 2.0,
                            "job_searching_kevin": 0.5
                        }
                    },
                    {
                        "id": "5_10_hours",
                        "text": "5-10 hours (dedicated job search time)",
                        "persona_weights": {
                            "working_kevin": 0.0,
                            "job_searching_kevin": 2.0
                        }
                    },
                    {
                        "id": "10_plus_hours",
                        "text": "10+ hours (full-time job searching)",
                        "persona_weights": {
                            "working_kevin": 0.0,
                            "job_searching_kevin": 2.0
                        }
                    }
                ]
            },
            {
                "id": "financial_situation",
                "text": "How would you describe your current financial situation?",
                "type": "single_choice",
                "required": True,
                "weight": 2.0,
                "options": [
                    {
                        "id": "stable_comfortable",
                        "text": "Stable income, comfortable spending",
                        "persona_weights": {
                            "working_kevin": 2.0,
                            "job_searching_kevin": 0.0
                        }
                    },
                    {
                        "id": "stable_cautious",
                        "text": "Stable but being more cautious with spending",
                        "persona_weights": {
                            "working_kevin": 1.5,
                            "job_searching_kevin": 0.5
                        }
                    },
                    {
                        "id": "reduced_income",
                        "text": "Reduced income, need to budget carefully",
                        "persona_weights": {
                            "working_kevin": 0.0,
                            "job_searching_kevin": 2.0
                        }
                    },
                    {
                        "id": "tight_budget",
                        "text": "Very tight budget, minimal discretionary spending",
                        "persona_weights": {
                            "working_kevin": 0.0,
                            "job_searching_kevin": 2.0
                        }
                    }
                ]
            },
            {
                "id": "networking_priority",
                "text": "What's your main networking priority right now?",
                "type": "single_choice",
                "required": True,
                "weight": 2.0,
                "options": [
                    {
                        "id": "current_industry",
                        "text": "Building relationships in my current industry",
                        "persona_weights": {
                            "working_kevin": 2.0,
                            "job_searching_kevin": 0.5
                        }
                    },
                    {
                        "id": "new_industries",
                        "text": "Exploring new industries and opportunities",
                        "persona_weights": {
                            "working_kevin": 0.0,
                            "job_searching_kevin": 2.0
                        }
                    },
                    {
                        "id": "recruiters",
                        "text": "Meeting recruiters and hiring managers",
                        "persona_weights": {
                            "working_kevin": 0.0,
                            "job_searching_kevin": 2.0
                        }
                    },
                    {
                        "id": "maintaining_relationships",
                        "text": "Maintaining existing professional relationships",
                        "persona_weights": {
                            "working_kevin": 2.0,
                            "job_searching_kevin": 0.0
                        }
                    }
                ]
            },
            {
                "id": "urgency_level",
                "text": "How urgent do you feel about expanding your network?",
                "type": "single_choice",
                "required": True,
                "weight": 1.5,
                "options": [
                    {
                        "id": "not_urgent",
                        "text": "Not urgent, steady growth is fine",
                        "persona_weights": {
                            "working_kevin": 1.5,
                            "job_searching_kevin": 0.0
                        }
                    },
                    {
                        "id": "somewhat_urgent",
                        "text": "Somewhat urgent, want to accelerate",
                        "persona_weights": {
                            "working_kevin": 1.5,
                            "job_searching_kevin": 0.5
                        }
                    },
                    {
                        "id": "very_urgent",
                        "text": "Very urgent, need opportunities soon",
                        "persona_weights": {
                            "working_kevin": 0.0,
                            "job_searching_kevin": 1.5
                        }
                    },
                    {
                        "id": "extremely_urgent",
                        "text": "Extremely urgent, need results quickly",
                        "persona_weights": {
                            "working_kevin": 0.0,
                            "job_searching_kevin": 1.5
                        }
                    }
                ]
            },
            {
                "id": "stress_level",
                "text": "How are your stress levels lately?",
                "type": "single_choice",
                "required": True,
                "weight": 1.5,
                "options": [
                    {
                        "id": "low_manageable",
                        "text": "Low to moderate, manageable",
                        "persona_weights": {
                            "working_kevin": 1.5,
                            "job_searching_kevin": 0.0
                        }
                    },
                    {
                        "id": "moderate_work",
                        "text": "Moderate, some work pressure",
                        "persona_weights": {
                            "working_kevin": 1.5,
                            "job_searching_kevin": 0.5
                        }
                    },
                    {
                        "id": "high_uncertainty",
                        "text": "High due to job uncertainty",
                        "persona_weights": {
                            "working_kevin": 0.0,
                            "job_searching_kevin": 1.5
                        }
                    },
                    {
                        "id": "very_high_career",
                        "text": "Very high, career situation is stressful",
                        "persona_weights": {
                            "working_kevin": 0.0,
                            "job_searching_kevin": 1.5
                        }
                    }
                ]
            },
            {
                "id": "activity_focus",
                "text": "What's your main focus for personal activities?",
                "type": "single_choice",
                "required": True,
                "weight": 1.5,
                "options": [
                    {
                        "id": "work_life_balance",
                        "text": "Maintaining work-life balance",
                        "persona_weights": {
                            "working_kevin": 1.5,
                            "job_searching_kevin": 0.0
                        }
                    },
                    {
                        "id": "skill_building",
                        "text": "Building skills for career advancement",
                        "persona_weights": {
                            "working_kevin": 1.5,
                            "job_searching_kevin": 0.5
                        }
                    },
                    {
                        "id": "stress_relief",
                        "text": "Stress relief and staying positive",
                        "persona_weights": {
                            "working_kevin": 0.0,
                            "job_searching_kevin": 1.5
                        }
                    },
                    {
                        "id": "opportunity_creation",
                        "text": "Networking and opportunity creation",
                        "persona_weights": {
                            "working_kevin": 0.0,
                            "job_searching_kevin": 1.5
                        }
                    }
                ]
            }
        ]
    
    def _load_persona_weights(self) -> Dict[PersonaType, Dict[str, float]]:
        """Load persona weighting configuration"""
        return {
            PersonaType.WORKING_KEVIN: {
                "employment_status": 3.0,
                "job_satisfaction": 2.5,
                "career_goal": 2.5,
                "schedule_flexibility": 2.0,
                "networking_time": 2.0,
                "financial_situation": 2.0,
                "networking_priority": 2.0,
                "urgency_level": 1.5,
                "stress_level": 1.5,
                "activity_focus": 1.5
            },
            PersonaType.JOB_SEARCHING_KEVIN: {
                "employment_status": 3.0,
                "job_satisfaction": 2.5,
                "career_goal": 2.5,
                "schedule_flexibility": 2.0,
                "networking_time": 2.0,
                "financial_situation": 2.0,
                "networking_priority": 2.0,
                "urgency_level": 1.5,
                "stress_level": 1.5,
                "activity_focus": 1.5
            }
        }
    
    def get_questions(self) -> List[Dict[str, Any]]:
        """Get all onboarding questions"""
        return self.questions
    
    def calculate_persona_match(self, responses: List[QuestionResponse]) -> MatchingResult:
        """Calculate persona match based on responses"""
        
        # Initialize scores
        persona_scores = {
            PersonaType.WORKING_KEVIN: 0.0,
            PersonaType.JOB_SEARCHING_KEVIN: 0.0
        }
        
        max_possible_score = {
            PersonaType.WORKING_KEVIN: 0.0,
            PersonaType.JOB_SEARCHING_KEVIN: 0.0
        }
        
        supporting_factors = []
        
        # Calculate scores based on responses
        for response in responses:
            question = self._get_question_by_id(response.question_id)
            if not question:
                continue
            
            question_weight = question.get("weight", 1.0)
            
            # Handle different question types
            if question["type"] == "single_choice":
                option = self._get_option_by_id(question, response.selected_option)
                if option and "persona_weights" in option:
                    for persona_key, weight in option["persona_weights"].items():
                        persona_type = PersonaType(persona_key)
                        if persona_type in persona_scores:
                            weighted_score = weight * question_weight
                            persona_scores[persona_type] += weighted_score
                            
                            # Track supporting factors
                            if weighted_score > 1.0:
                                supporting_factors.append(f"{question['text']}: {option['text']}")
            
            elif question["type"] == "scale":
                scale_value = int(response.selected_option)
                persona_mapping = question.get("persona_mapping", {})
                
                for range_key, weights in persona_mapping.items():
                    range_parts = range_key.split("-")
                    range_min, range_max = int(range_parts[0]), int(range_parts[1])
                    
                    if range_min <= scale_value <= range_max:
                        for persona_key, weight in weights.items():
                            persona_type = PersonaType(persona_key)
                            if persona_type in persona_scores:
                                weighted_score = weight * question_weight
                                persona_scores[persona_type] += weighted_score
                                
                                if weighted_score > 1.0:
                                    supporting_factors.append(f"{question['text']}: {scale_value}/10")
            
            # Calculate max possible scores
            for persona_type in persona_scores.keys():
                max_possible_score[persona_type] += question_weight * 3.0  # Assuming max weight is 3.0
        
        # Determine primary persona
        primary_persona = max(persona_scores.keys(), key=lambda k: persona_scores[k])
        
        # Calculate confidence score
        max_score = persona_scores[primary_persona]
        max_possible = max_possible_score[primary_persona]
        confidence_score = (max_score / max_possible) if max_possible > 0 else 0.0
        
        # Generate recommendations
        recommendations = self._generate_recommendations(primary_persona, confidence_score, persona_scores)
        
        return MatchingResult(
            primary_persona=primary_persona,
            confidence_score=confidence_score,
            persona_scores=persona_scores,
            supporting_factors=supporting_factors,
            recommendations=recommendations
        )
    
    def _get_question_by_id(self, question_id: str) -> Optional[Dict[str, Any]]:
        """Get question by ID"""
        for question in self.questions:
            if question["id"] == question_id:
                return question
        return None
    
    def _get_option_by_id(self, question: Dict[str, Any], option_id: str) -> Optional[Dict[str, Any]]:
        """Get option by ID within a question"""
        for option in question.get("options", []):
            if option["id"] == option_id:
                return option
        return None
    
    def _generate_recommendations(self, primary_persona: PersonaType, 
                                confidence_score: float, 
                                persona_scores: Dict[PersonaType, float]) -> List[str]:
        """Generate recommendations based on matching results"""
        
        recommendations = []
        
        if confidence_score < 0.6:
            recommendations.append("Consider retaking the assessment if your situation changes")
        
        if primary_persona == PersonaType.WORKING_KEVIN:
            recommendations.extend([
                "Focus on strategic networking within your industry",
                "Maintain work-life balance while building relationships",
                "Consider industry events and professional development",
                "Budget for moderate networking and social activities"
            ])
        
        elif primary_persona == PersonaType.JOB_SEARCHING_KEVIN:
            recommendations.extend([
                "Prioritize networking events and informational interviews",
                "Focus on stress management and staying positive",
                "Be strategic about spending on networking activities",
                "Dedicate significant time to career-focused activities"
            ])
        
        # Check for close scores
        scores_list = list(persona_scores.values())
        scores_list.sort(reverse=True)
        
        if len(scores_list) > 1 and (scores_list[0] - scores_list[1]) < 2.0:
            recommendations.append("Your profile shows mixed characteristics - consider context switching as your situation changes")
        
        return recommendations
    
    def get_persona_characteristics(self, persona_type: PersonaType) -> Dict[str, Any]:
        """Get detailed characteristics for a persona type"""
        
        characteristics = {
            PersonaType.WORKING_KEVIN: {
                "name": "Working Kevin",
                "description": "Employed professional focused on career advancement and strategic networking",
                "key_traits": [
                    "Currently employed and satisfied",
                    "Structured schedule with limited flexibility",
                    "Stable income and moderate spending",
                    "Strategic, long-term networking approach",
                    "Focus on work-life balance and advancement"
                ],
                "typical_activities": [
                    "Industry networking events",
                    "Professional development workshops",
                    "After-work social activities",
                    "Weekend skill-building activities"
                ],
                "budget_range": "$150-200/day",
                "time_commitment": "2-4 hours/week for networking",
                "stress_level": "Moderate, manageable",
                "primary_goals": [
                    "Excel in current role",
                    "Build strategic professional network",
                    "Maintain work-life balance",
                    "Advance career within current path"
                ]
            },
            PersonaType.JOB_SEARCHING_KEVIN: {
                "name": "Job Searching Kevin",
                "description": "Professional in career transition focused on finding new opportunities",
                "key_traits": [
                    "Unemployed or unsatisfied with current role",
                    "Flexible schedule with urgent timeline",
                    "Reduced income requiring careful budgeting",
                    "Opportunity-focused, broad networking approach",
                    "High stress due to career uncertainty"
                ],
                "typical_activities": [
                    "Job search networking events",
                    "Informational interviews",
                    "Career transition workshops",
                    "Stress management activities"
                ],
                "budget_range": "$50-100/day",
                "time_commitment": "5-10+ hours/week for networking",
                "stress_level": "High due to uncertainty",
                "primary_goals": [
                    "Find new employment opportunity",
                    "Build broad professional network",
                    "Manage stress and stay positive",
                    "Transition to new career path"
                ]
            }
        }
        
        return characteristics.get(persona_type, {})


def create_sample_responses() -> List[QuestionResponse]:
    """Create sample responses for testing"""
    return [
        QuestionResponse(
            question_id="employment_status",
            question_text="What best describes your current work situation?",
            selected_option="employed_satisfied",
            option_text="Employed and satisfied with my current role"
        ),
        QuestionResponse(
            question_id="job_satisfaction",
            question_text="How would you rate your current job satisfaction? (1-10)",
            selected_option="8",
            option_text="8"
        ),
        QuestionResponse(
            question_id="career_goal",
            question_text="What's your primary career goal right now?",
            selected_option="excel_current",
            option_text="Excel in my current role and build my network"
        )
    ]


if __name__ == "__main__":
    # Test the persona matcher
    matcher = PersonaMatcher()
    
    # Test with sample responses
    sample_responses = create_sample_responses()
    result = matcher.calculate_persona_match(sample_responses)
    
    print(f"Primary Persona: {result.primary_persona.value}")
    print(f"Confidence Score: {result.confidence_score:.2f}")
    print(f"Persona Scores: {result.persona_scores}")
    print(f"Supporting Factors: {result.supporting_factors}")
    print(f"Recommendations: {result.recommendations}")
