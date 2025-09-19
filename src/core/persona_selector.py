#!/usr/bin/env python3
"""
Dynamic Persona Selector Framework
Provides flexible persona selection, context switching, and template management
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Set, Tuple, Any
from enum import Enum
import json
from datetime import datetime
from .personas import UserPersona, PersonaManager

class PersonaContext(Enum):
    """Context modifiers for persona behavior"""
    WORK_FOCUS = "work_focus"
    JOB_SEARCH = "job_search" 
    SOCIAL_BUILDING = "social_building"
    FITNESS_TRAINING = "fitness_training"
    RELATIONSHIP_FOCUS = "relationship_focus"
    FAMILY_TIME = "family_time"
    TRAVEL_MODE = "travel_mode"
    RECOVERY_MODE = "recovery_mode"

class PersonaTemplate(Enum):
    """Base persona templates for different user types"""
    TECH_EXECUTIVE = "tech_executive"
    CREATIVE_PROFESSIONAL = "creative_professional"
    RECENT_RELOCATOR = "recent_relocator"
    ENTREPRENEUR = "entrepreneur"
    STUDENT = "student"
    PARENT = "parent"
    RETIREE = "retiree"
    FREELANCER = "freelancer"

@dataclass
class PersonaContextModifier:
    """Modifies persona behavior based on current context"""
    context_id: str
    context_name: str
    description: str
    
    # Temporary adjustments to persona attributes
    goal_adjustments: Dict[str, List[str]] = field(default_factory=dict)
    preference_adjustments: Dict[str, Any] = field(default_factory=dict)
    constraint_adjustments: Dict[str, Any] = field(default_factory=dict)
    budget_multiplier: float = 1.0
    priority_activities: List[str] = field(default_factory=list)
    deprioritized_activities: List[str] = field(default_factory=list)
    
    # Time-based modifications
    duration_days: Optional[int] = None  # How long this context lasts
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

@dataclass
class PersonaFamily:
    """Groups related personas together"""
    family_id: str
    family_name: str
    description: str
    base_location: str
    target_demographics: List[str]
    persona_ids: List[str] = field(default_factory=list)
    shared_preferences: Dict[str, Any] = field(default_factory=dict)
    shared_constraints: Dict[str, Any] = field(default_factory=dict)

class PersonaSelectorManager:
    """Enhanced persona management with selection, contexts, and templates"""
    
    def __init__(self, personas_file: str = "personas.json", 
                 contexts_file: str = "persona_contexts.json",
                 families_file: str = "persona_families.json"):
        self.persona_manager = PersonaManager(personas_file)
        self.contexts_file = contexts_file
        self.families_file = families_file
        
        # Current selection state
        self.active_persona_id: Optional[str] = None
        self.active_contexts: List[str] = []
        
        # Context and family management
        self.contexts: Dict[str, PersonaContextModifier] = {}
        self.families: Dict[str, PersonaFamily] = {}
        
        self.load_contexts()
        self.load_families()
        self.create_default_contexts()
        self.create_default_families()
    
    def load_contexts(self):
        """Load context modifiers from file"""
        try:
            with open(self.contexts_file, 'r') as f:
                data = json.load(f)
                for context_data in data.get("contexts", []):
                    context = PersonaContextModifier(**context_data)
                    self.contexts[context.context_id] = context
        except (FileNotFoundError, json.JSONDecodeError):
            pass
    
    def load_families(self):
        """Load persona families from file"""
        try:
            with open(self.families_file, 'r') as f:
                data = json.load(f)
                for family_data in data.get("families", []):
                    family = PersonaFamily(**family_data)
                    self.families[family.family_id] = family
        except (FileNotFoundError, json.JSONDecodeError):
            pass
    
    def save_contexts(self):
        """Save context modifiers to file"""
        data = {
            "contexts": [
                {
                    "context_id": ctx.context_id,
                    "context_name": ctx.context_name,
                    "description": ctx.description,
                    "goal_adjustments": ctx.goal_adjustments,
                    "preference_adjustments": ctx.preference_adjustments,
                    "constraint_adjustments": ctx.constraint_adjustments,
                    "budget_multiplier": ctx.budget_multiplier,
                    "priority_activities": ctx.priority_activities,
                    "deprioritized_activities": ctx.deprioritized_activities,
                    "duration_days": ctx.duration_days,
                    "start_date": ctx.start_date.isoformat() if ctx.start_date else None,
                    "end_date": ctx.end_date.isoformat() if ctx.end_date else None
                }
                for ctx in self.contexts.values()
            ]
        }
        with open(self.contexts_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def save_families(self):
        """Save persona families to file"""
        data = {
            "families": [
                {
                    "family_id": fam.family_id,
                    "family_name": fam.family_name,
                    "description": fam.description,
                    "base_location": fam.base_location,
                    "target_demographics": fam.target_demographics,
                    "persona_ids": fam.persona_ids,
                    "shared_preferences": fam.shared_preferences,
                    "shared_constraints": fam.shared_constraints
                }
                for fam in self.families.values()
            ]
        }
        with open(self.families_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def create_default_contexts(self):
        """Create default context modifiers"""
        if self.contexts:
            return  # Already have contexts
        
        contexts = [
            PersonaContextModifier(
                context_id="work_focus",
                context_name="Work Focus Mode",
                description="Prioritizes professional networking and career advancement",
                goal_adjustments={"primary_goals": ["Excel in current role", "Build professional network"]},
                preference_adjustments={"preferred_activity_types": ["professional_networking", "skill_development"]},
                budget_multiplier=1.2,
                priority_activities=["professional_networking", "industry_events", "skill_development"],
                deprioritized_activities=["social_activities", "entertainment"]
            ),
            PersonaContextModifier(
                context_id="job_search",
                context_name="Job Search Mode", 
                description="Focused on career transition and opportunity exploration",
                goal_adjustments={"primary_goals": ["Find new role", "Network with recruiters", "Skill development"]},
                preference_adjustments={"preferred_activity_types": ["professional_networking", "interviews", "career_development"]},
                budget_multiplier=0.8,  # More conservative spending
                priority_activities=["networking_events", "informational_interviews", "skill_building"],
                deprioritized_activities=["expensive_entertainment", "time_intensive_hobbies"]
            ),
            PersonaContextModifier(
                context_id="social_building",
                context_name="Social Network Building",
                description="Focus on building personal friendships and social connections",
                goal_adjustments={"primary_goals": ["Build friendships", "Explore social activities", "Community involvement"]},
                preference_adjustments={"preferred_activity_types": ["social", "community", "group_activities"]},
                priority_activities=["meetups", "social_events", "community_activities"],
                deprioritized_activities=["solo_activities", "work_events"]
            ),
            PersonaContextModifier(
                context_id="fitness_training",
                context_name="Fitness Training Focus",
                description="Prioritizes physical fitness and training goals",
                goal_adjustments={"primary_goals": ["Achieve fitness goals", "Maintain training schedule"]},
                preference_adjustments={"preferred_activity_types": ["fitness", "sports", "outdoor_activities"]},
                priority_activities=["running", "gym", "sports", "outdoor_fitness"],
                deprioritized_activities=["sedentary_activities", "late_night_events"]
            )
        ]
        
        for context in contexts:
            self.contexts[context.context_id] = context
        
        self.save_contexts()
    
    def create_default_families(self):
        """Create default persona families"""
        if self.families:
            return  # Already have families
        
        families = [
            PersonaFamily(
                family_id="toronto_professionals",
                family_name="Toronto Professionals",
                description="Working professionals living in Toronto",
                base_location="Toronto",
                target_demographics=["mid_career", "high_income", "urban"],
                shared_preferences={"location_preference": "Toronto", "budget_preference": "high"},
                shared_constraints={"work_start": "9:00 AM", "work_end": "6:00 PM"}
            ),
            PersonaFamily(
                family_id="recent_relocators", 
                family_name="Recent Relocators",
                description="People who recently moved to a new city",
                base_location="Toronto",
                target_demographics=["new_to_city", "network_building"],
                shared_preferences={"exploration_priority": "high", "networking_priority": "high"},
                shared_constraints={"local_knowledge": "limited"}
            ),
            PersonaFamily(
                family_id="creative_professionals",
                family_name="Creative Industry Professionals", 
                description="People working in creative fields",
                base_location="Toronto",
                target_demographics=["creative", "flexible_schedule", "artistic"],
                shared_preferences={"preferred_activity_types": ["art", "culture", "creative"]},
                shared_constraints={"schedule_flexibility": "high"}
            )
        ]
        
        for family in families:
            self.families[family.family_id] = family
        
        self.save_families()
    
    def select_persona(self, persona_id: str) -> bool:
        """Select active persona"""
        if self.persona_manager.get_persona(persona_id):
            self.active_persona_id = persona_id
            return True
        return False
    
    def add_context(self, context_id: str, duration_days: Optional[int] = None) -> bool:
        """Add context modifier to active persona"""
        if context_id in self.contexts:
            if context_id not in self.active_contexts:
                self.active_contexts.append(context_id)
                
                # Set duration if specified
                if duration_days:
                    context = self.contexts[context_id]
                    context.start_date = datetime.now()
                    context.end_date = datetime.now() + timedelta(days=duration_days)
                    context.duration_days = duration_days
                
                return True
        return False
    
    def remove_context(self, context_id: str) -> bool:
        """Remove context modifier from active persona"""
        if context_id in self.active_contexts:
            self.active_contexts.remove(context_id)
            return True
        return False
    
    def get_effective_persona(self) -> Optional[UserPersona]:
        """Get persona with context modifications applied"""
        if not self.active_persona_id:
            return None
        
        base_persona = self.persona_manager.get_persona(self.active_persona_id)
        if not base_persona:
            return None
        
        # Apply context modifications
        effective_persona = base_persona  # Start with base
        
        for context_id in self.active_contexts:
            context = self.contexts.get(context_id)
            if context:
                # Apply context modifications (simplified - in real implementation, 
                # you'd want to create a modified copy)
                pass
        
        return effective_persona
    
    def get_personas_by_family(self, family_id: str) -> List[UserPersona]:
        """Get all personas in a family"""
        family = self.families.get(family_id)
        if not family:
            return []
        
        personas = []
        for persona_id in family.persona_ids:
            persona = self.persona_manager.get_persona(persona_id)
            if persona:
                personas.append(persona)
        
        return personas
    
    def create_persona_from_template(self, template: PersonaTemplate, 
                                   customizations: Dict[str, Any]) -> UserPersona:
        """Create new persona from template with customizations"""
        # Template-based persona creation logic
        # This would be implemented based on specific template requirements
        pass
    
    def get_selection_options(self) -> Dict[str, Any]:
        """Get all available selection options for UI"""
        return {
            "personas": [p.to_dict() for p in self.persona_manager.get_all_personas()],
            "families": [
                {
                    "family_id": f.family_id,
                    "family_name": f.family_name, 
                    "description": f.description,
                    "persona_count": len(f.persona_ids)
                }
                for f in self.families.values()
            ],
            "contexts": [
                {
                    "context_id": c.context_id,
                    "context_name": c.context_name,
                    "description": c.description
                }
                for c in self.contexts.values()
            ],
            "active_persona": self.active_persona_id,
            "active_contexts": self.active_contexts
        }
