#!/usr/bin/env python3
"""
API Routes for Persona Selector System
Handles persona selection, context management, and dynamic persona creation
"""

from flask import Blueprint, request, jsonify, render_template, session
from typing import Dict, List, Optional, Any
import json
from datetime import datetime

from ..core.persona_selector import PersonaSelectorManager, PersonaContext, PersonaTemplate
from ..core.personas import UserPersona, Demographics, PersonalityProfile, GoalsAndAspirations
from ..core.personas import Preferences, Constraints, BehavioralPatterns, NetworkingProfile

# Create blueprint
persona_bp = Blueprint('persona_selector', __name__, url_prefix='/api/persona-selector')

# Global manager instance
persona_manager = None

def get_persona_manager():
    """Get or create persona manager instance"""
    global persona_manager
    if persona_manager is None:
        persona_manager = PersonaSelectorManager()
    return persona_manager

@persona_bp.route('/options', methods=['GET'])
def get_selection_options():
    """Get all available persona selection options"""
    try:
        manager = get_persona_manager()
        options = manager.get_selection_options()
        return jsonify(options)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@persona_bp.route('/apply', methods=['POST'])
def apply_persona():
    """Apply selected persona with contexts"""
    try:
        data = request.get_json()
        persona_id = data.get('persona_id')
        contexts = data.get('contexts', [])
        
        if not persona_id:
            return jsonify({"error": "persona_id is required"}), 400
        
        manager = get_persona_manager()
        
        # Select persona
        if not manager.select_persona(persona_id):
            return jsonify({"error": "Invalid persona_id"}), 400
        
        # Clear existing contexts and add new ones
        manager.active_contexts = []
        for context_id in contexts:
            manager.add_context(context_id)
        
        # Store in session
        session['active_persona_id'] = persona_id
        session['active_contexts'] = contexts
        
        return jsonify({
            "success": True,
            "persona_id": persona_id,
            "contexts": contexts,
            "message": "Persona applied successfully"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@persona_bp.route('/create', methods=['POST'])
def create_persona():
    """Create new persona from form data or template"""
    try:
        data = request.get_json()
        
        # Extract basic info
        persona_name = data.get('persona_name')
        description = data.get('description', '')
        template = data.get('template')
        
        if not persona_name:
            return jsonify({"error": "persona_name is required"}), 400
        
        # Generate unique ID
        persona_id = f"custom_{persona_name.lower().replace(' ', '_')}_{int(datetime.now().timestamp())}"
        
        # Create persona from template or scratch
        if template and template in [t.value for t in PersonaTemplate]:
            persona = create_persona_from_template(persona_id, persona_name, description, template, data)
        else:
            persona = create_persona_from_scratch(persona_id, persona_name, description, data)
        
        # Add to manager
        manager = get_persona_manager()
        manager.persona_manager.add_persona(persona)
        
        return jsonify({
            "success": True,
            "persona_id": persona_id,
            "persona": persona.to_dict(),
            "message": "Persona created successfully"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@persona_bp.route('/update/<persona_id>', methods=['PUT'])
def update_persona(persona_id: str):
    """Update existing persona"""
    try:
        data = request.get_json()
        manager = get_persona_manager()
        
        # Update persona attributes
        updates = {}
        if 'persona_name' in data:
            updates['persona_name'] = data['persona_name']
        if 'description' in data:
            updates['description'] = data['description']
        
        manager.persona_manager.update_persona(persona_id, **updates)
        
        return jsonify({
            "success": True,
            "message": "Persona updated successfully"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@persona_bp.route('/duplicate/<persona_id>', methods=['POST'])
def duplicate_persona(persona_id: str):
    """Duplicate existing persona with modifications"""
    try:
        data = request.get_json()
        manager = get_persona_manager()
        
        # Get original persona
        original = manager.persona_manager.get_persona(persona_id)
        if not original:
            return jsonify({"error": "Persona not found"}), 404
        
        # Create new persona ID
        new_name = data.get('persona_name', f"{original.persona_name} (Copy)")
        new_id = f"copy_{persona_id}_{int(datetime.now().timestamp())}"
        
        # Create duplicate with modifications
        duplicate_data = original.to_dict()
        duplicate_data['persona_id'] = new_id
        duplicate_data['persona_name'] = new_name
        duplicate_data['description'] = data.get('description', original.description)
        
        # Apply any customizations from request
        if 'customizations' in data:
            apply_customizations(duplicate_data, data['customizations'])
        
        # Create new persona
        new_persona = UserPersona.from_dict(duplicate_data)
        manager.persona_manager.add_persona(new_persona)
        
        return jsonify({
            "success": True,
            "persona_id": new_id,
            "persona": new_persona.to_dict(),
            "message": "Persona duplicated successfully"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@persona_bp.route('/contexts', methods=['GET'])
def get_contexts():
    """Get available context modifiers"""
    try:
        manager = get_persona_manager()
        contexts = [
            {
                "context_id": ctx.context_id,
                "context_name": ctx.context_name,
                "description": ctx.description,
                "priority_activities": ctx.priority_activities,
                "deprioritized_activities": ctx.deprioritized_activities
            }
            for ctx in manager.contexts.values()
        ]
        return jsonify({"contexts": contexts})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@persona_bp.route('/families', methods=['GET'])
def get_families():
    """Get persona families"""
    try:
        manager = get_persona_manager()
        families = [
            {
                "family_id": fam.family_id,
                "family_name": fam.family_name,
                "description": fam.description,
                "base_location": fam.base_location,
                "persona_count": len(fam.persona_ids),
                "personas": [
                    manager.persona_manager.get_persona(pid).to_dict()
                    for pid in fam.persona_ids
                    if manager.persona_manager.get_persona(pid)
                ]
            }
            for fam in manager.families.values()
        ]
        return jsonify({"families": families})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@persona_bp.route('/current', methods=['GET'])
def get_current_persona():
    """Get currently active persona with contexts"""
    try:
        manager = get_persona_manager()
        
        # Get from session or manager
        persona_id = session.get('active_persona_id') or manager.active_persona_id
        contexts = session.get('active_contexts', []) or manager.active_contexts
        
        if not persona_id:
            return jsonify({"active_persona": None, "active_contexts": []})
        
        persona = manager.persona_manager.get_persona(persona_id)
        if not persona:
            return jsonify({"error": "Active persona not found"}), 404
        
        return jsonify({
            "active_persona": persona.to_dict(),
            "active_contexts": contexts,
            "effective_persona": manager.get_effective_persona().to_dict() if manager.get_effective_persona() else None
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Helper functions

def create_persona_from_template(persona_id: str, persona_name: str, description: str, 
                                template: str, data: Dict[str, Any]) -> UserPersona:
    """Create persona from template with customizations"""
    
    # Template defaults
    templates = {
        PersonaTemplate.TECH_EXECUTIVE.value: {
            "occupation": "Technology Executive",
            "income_level": "high",
            "life_stage": "mid_career",
            "preferred_activities": ["professional_networking", "fitness", "cultural"],
            "personality_type": "introvert-extrovert",
            "decision_making_style": "analytical"
        },
        PersonaTemplate.CREATIVE_PROFESSIONAL.value: {
            "occupation": "Creative Professional",
            "income_level": "moderate",
            "life_stage": "mid_career", 
            "preferred_activities": ["art_and_design", "cultural", "social"],
            "personality_type": "extrovert",
            "decision_making_style": "intuitive"
        },
        PersonaTemplate.RECENT_RELOCATOR.value: {
            "occupation": "Professional",
            "income_level": "moderate",
            "life_stage": "mid_career",
            "preferred_activities": ["exploration", "social", "networking"],
            "personality_type": "extrovert",
            "goals": ["Build new social network", "Explore new city", "Establish routines"]
        }
    }
    
    template_data = templates.get(template, {})
    
    # Create persona with template defaults and user customizations
    demographics = Demographics(
        age_range=data.get('demographics', {}).get('age_range', [25, 45]),
        life_stage=template_data.get('life_stage', 'mid_career'),
        occupation=template_data.get('occupation', 'Professional'),
        income_level=template_data.get('income_level', 'moderate'),
        location_preference=data.get('demographics', {}).get('location_preference', 'Toronto'),
        relationship_status=data.get('demographics', {}).get('relationship_status', 'single'),
        has_children=data.get('demographics', {}).get('has_children', False),
        education_level=data.get('demographics', {}).get('education_level', 'university')
    )
    
    personality = PersonalityProfile(
        personality_type=template_data.get('personality_type', 'extrovert'),
        energy_pattern='morning_person',
        social_style='connector',
        risk_tolerance=5,
        spontaneity_level=5,
        perfectionism_level=5,
        stress_tolerance=5,
        decision_making_style=template_data.get('decision_making_style', 'balanced'),
        optimism_level='optimistic',
        organization_style='organized'
    )
    
    goals = GoalsAndAspirations(
        primary_goals=template_data.get('goals', ['Personal growth', 'Professional success']),
        career_goals=['Excel in role', 'Build network'],
        personal_goals=['Maintain work-life balance', 'Stay healthy'],
        short_term_goals=['Weekly fitness', 'Monthly networking'],
        long_term_goals=['Career advancement', 'Strong relationships']
    )
    
    preferences = Preferences(
        activity_preferences=['balanced'],
        preferred_activity_types=template_data.get('preferred_activities', ['social', 'fitness']),
        avoided_activity_types=data.get('preferences', {}).get('avoided_activity_types', []),
        preferred_locations=['Urban areas', 'Cultural districts'],
        budget_preference=template_data.get('income_level', 'moderate'),
        time_preferences={'morning_start': '7:00 AM', 'bedtime': '10:30 PM'},
        group_size_preference='small_groups',
        frequency_preference='moderate'
    )
    
    constraints = Constraints(
        max_daily_budget=100.0,
        max_weekly_budget=500.0,
        available_weekdays=['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        available_weekends=['Saturday', 'Sunday'],
        time_constraints={},
        physical_limitations=[],
        dietary_restrictions=[],
        accessibility_needs=[]
    )
    
    behavioral_patterns = BehavioralPatterns(
        typical_morning_routine=['Wake up', 'Exercise', 'Breakfast', 'Work prep'],
        typical_evening_routine=['Work wrap-up', 'Dinner', 'Relaxation', 'Sleep prep'],
        weekend_habits=['Sleep in', 'Social activities', 'Personal time'],
        stress_management=['Exercise', 'Social time', 'Relaxation'],
        learning_preferences=['Hands-on', 'Visual', 'Group learning']
    )
    
    networking = NetworkingProfile(
        networking_priority=7,
        preferred_networking_venues=['Professional events', 'Social meetups'],
        networking_approach='balanced',
        relationship_depth_preference='mixed',
        follow_up_style='organized',
        communication_preference='in_person'
    )
    
    return UserPersona(
        persona_id=persona_id,
        persona_name=persona_name,
        description=description,
        demographics=demographics,
        personality=personality,
        goals=goals,
        preferences=preferences,
        constraints=constraints,
        behavioral_patterns=behavioral_patterns,
        networking=networking
    )

def create_persona_from_scratch(persona_id: str, persona_name: str, description: str, 
                               data: Dict[str, Any]) -> UserPersona:
    """Create persona from scratch with user data"""
    
    # Use minimal defaults and user-provided data
    demographics = Demographics(
        age_range=data.get('demographics', {}).get('age_range', [25, 45]),
        life_stage=data.get('demographics', {}).get('life_stage', 'mid_career'),
        occupation=data.get('demographics', {}).get('occupation', 'Professional'),
        income_level=data.get('demographics', {}).get('income_level', 'moderate'),
        location_preference=data.get('demographics', {}).get('location_preference', 'Toronto'),
        relationship_status=data.get('demographics', {}).get('relationship_status', 'single'),
        has_children=data.get('demographics', {}).get('has_children', False),
        education_level=data.get('demographics', {}).get('education_level', 'university')
    )
    
    # Create other components with defaults
    personality = PersonalityProfile(
        personality_type='balanced',
        energy_pattern='morning_person',
        social_style='balanced',
        risk_tolerance=5,
        spontaneity_level=5,
        perfectionism_level=5,
        stress_tolerance=5,
        decision_making_style='balanced',
        optimism_level='optimistic',
        organization_style='organized'
    )
    
    goals = GoalsAndAspirations(
        primary_goals=['Personal growth', 'Professional success'],
        career_goals=['Excel in role'],
        personal_goals=['Maintain balance'],
        short_term_goals=['Weekly goals'],
        long_term_goals=['Long-term success']
    )
    
    preferences = Preferences(
        activity_preferences=['balanced'],
        preferred_activity_types=data.get('preferences', {}).get('preferred_activity_types', ['social']),
        avoided_activity_types=data.get('preferences', {}).get('avoided_activity_types', []),
        preferred_locations=['Urban areas'],
        budget_preference=demographics.income_level,
        time_preferences={'morning_start': '7:00 AM', 'bedtime': '10:30 PM'},
        group_size_preference='small_groups',
        frequency_preference='moderate'
    )
    
    constraints = Constraints(
        max_daily_budget=100.0,
        max_weekly_budget=500.0,
        available_weekdays=['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        available_weekends=['Saturday', 'Sunday'],
        time_constraints={},
        physical_limitations=[],
        dietary_restrictions=[],
        accessibility_needs=[]
    )
    
    behavioral_patterns = BehavioralPatterns(
        typical_morning_routine=['Wake up', 'Breakfast', 'Work prep'],
        typical_evening_routine=['Work wrap-up', 'Dinner', 'Relaxation'],
        weekend_habits=['Relaxation', 'Social activities'],
        stress_management=['Exercise', 'Relaxation'],
        learning_preferences=['Visual', 'Hands-on']
    )
    
    networking = NetworkingProfile(
        networking_priority=5,
        preferred_networking_venues=['Social events'],
        networking_approach='balanced',
        relationship_depth_preference='mixed',
        follow_up_style='casual',
        communication_preference='mixed'
    )
    
    return UserPersona(
        persona_id=persona_id,
        persona_name=persona_name,
        description=description,
        demographics=demographics,
        personality=personality,
        goals=goals,
        preferences=preferences,
        constraints=constraints,
        behavioral_patterns=behavioral_patterns,
        networking=networking
    )

def apply_customizations(persona_data: Dict[str, Any], customizations: Dict[str, Any]):
    """Apply customizations to persona data"""
    for key, value in customizations.items():
        if key in persona_data:
            if isinstance(persona_data[key], dict) and isinstance(value, dict):
                persona_data[key].update(value)
            else:
                persona_data[key] = value

# Route for persona selector page
@persona_bp.route('/selector', methods=['GET'])
def persona_selector_page():
    """Render persona selector page"""
    return render_template('persona_selector.html')
