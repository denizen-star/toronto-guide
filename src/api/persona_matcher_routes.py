#!/usr/bin/env python3
"""
API Routes for Persona Matcher
Handles onboarding questionnaire and persona matching
"""

from flask import Blueprint, request, jsonify, render_template, session
from typing import Dict, List, Optional, Any
import json
from datetime import datetime

from src.core.persona_matcher import PersonaMatcher, QuestionResponse, PersonaType

# Create blueprint
persona_matcher_bp = Blueprint('persona_matcher', __name__, url_prefix='/api/persona-matcher')

# Global matcher instance
persona_matcher = None

def get_persona_matcher():
    """Get or create persona matcher instance"""
    global persona_matcher
    if persona_matcher is None:
        persona_matcher = PersonaMatcher()
    return persona_matcher

@persona_matcher_bp.route('/questions', methods=['GET'])
def get_questions():
    """Get all onboarding questions"""
    try:
        matcher = get_persona_matcher()
        questions = matcher.get_questions()
        return jsonify({"questions": questions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@persona_matcher_bp.route('/match', methods=['POST'])
def calculate_match():
    """Calculate persona match based on responses"""
    try:
        data = request.get_json()
        responses_data = data.get('responses', {})
        
        if not responses_data:
            return jsonify({"error": "No responses provided"}), 400
        
        matcher = get_persona_matcher()
        
        # Convert responses to QuestionResponse objects
        responses = []
        for question_id, answer in responses_data.items():
            question = matcher._get_question_by_id(question_id)
            if question:
                question_text = question['text']
                
                if question['type'] == 'single_choice':
                    option = matcher._get_option_by_id(question, answer)
                    option_text = option['text'] if option else answer
                else:
                    option_text = str(answer)
                
                responses.append(QuestionResponse(
                    question_id=question_id,
                    question_text=question_text,
                    selected_option=answer,
                    option_text=option_text
                ))
        
        # Calculate match
        result = matcher.calculate_persona_match(responses)
        
        # Store in session
        session['persona_match_result'] = {
            'primary_persona': result.primary_persona.value,
            'confidence_score': result.confidence_score,
            'persona_scores': {k.value: v for k, v in result.persona_scores.items()},
            'supporting_factors': result.supporting_factors,
            'recommendations': result.recommendations,
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify({
            'primary_persona': result.primary_persona.value,
            'confidence_score': result.confidence_score,
            'persona_scores': {k.value: v for k, v in result.persona_scores.items()},
            'supporting_factors': result.supporting_factors,
            'recommendations': result.recommendations,
            'characteristics': matcher.get_persona_characteristics(result.primary_persona)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@persona_matcher_bp.route('/result', methods=['GET'])
def get_current_result():
    """Get current persona match result from session"""
    try:
        result = session.get('persona_match_result')
        if not result:
            return jsonify({"error": "No persona match result found"}), 404
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@persona_matcher_bp.route('/characteristics/<persona_type>', methods=['GET'])
def get_persona_characteristics_api(persona_type: str):
    """Get characteristics for a specific persona type"""
    try:
        matcher = get_persona_matcher()
        
        # Convert string to PersonaType enum
        if persona_type == 'working_kevin':
            persona_enum = PersonaType.WORKING_KEVIN
        elif persona_type == 'job_searching_kevin':
            persona_enum = PersonaType.JOB_SEARCHING_KEVIN
        else:
            return jsonify({"error": "Invalid persona type"}), 400
        
        characteristics = matcher.get_persona_characteristics(persona_enum)
        return jsonify(characteristics)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route for onboarding page
@persona_matcher_bp.route('/onboarding', methods=['GET'])
def onboarding_page():
    """Render onboarding questionnaire page"""
    return render_template('onboarding_questionnaire.html')

# Route for testing (shows available routes)
@persona_matcher_bp.route('/test', methods=['GET'])
def test_routes():
    """Test endpoint to show available routes"""
    return jsonify({
        "message": "Persona Matcher API is working",
        "available_routes": [
            "GET /api/persona-matcher/questions - Get all questions",
            "POST /api/persona-matcher/match - Submit responses and get match",
            "GET /api/persona-matcher/result - Get current result",
            "GET /api/persona-matcher/characteristics/<type> - Get persona characteristics",
            "GET /api/persona-matcher/onboarding - Onboarding questionnaire page"
        ]
    })
