#!/usr/bin/env python3
"""
Simple Flask Server for Persona Onboarding
Self-contained server to test the interactive onboarding questionnaire
"""

import sys
import os
from flask import Flask, render_template, request, jsonify, session
import json
from datetime import datetime

# Add src to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from core.persona_matcher import PersonaMatcher, QuestionResponse, PersonaType

def create_app():
    """Create Flask app with persona matcher functionality"""
    app = Flask(__name__)
    
    # Set secret key for sessions
    app.secret_key = 'lifeplanner-persona-matcher-demo-key-2025'
    
    # Initialize persona matcher
    matcher = PersonaMatcher()
    
    @app.route('/')
    def index():
        """Main landing page"""
        return '''
        <!DOCTYPE html>
        <html>
        <head>
            <title>LifePlanner Persona Matcher</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    max-width: 800px; 
                    margin: 50px auto; 
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    text-align: center;
                }
                .container {
                    background: rgba(255,255,255,0.1);
                    padding: 40px;
                    border-radius: 12px;
                    backdrop-filter: blur(10px);
                }
                h1 { font-size: 2.5rem; margin-bottom: 20px; }
                p { font-size: 1.2rem; margin-bottom: 30px; }
                .btn {
                    display: inline-block;
                    background: white;
                    color: #667eea;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 25px;
                    font-weight: 600;
                    font-size: 1.1rem;
                    margin: 10px;
                    transition: transform 0.3s ease;
                }
                .btn:hover {
                    transform: translateY(-2px);
                }
                .api-links {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255,255,255,0.3);
                }
                .api-links a {
                    color: #fff;
                    text-decoration: none;
                    margin: 0 10px;
                    opacity: 0.8;
                }
                .api-links a:hover {
                    opacity: 1;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🎯 LifePlanner Persona Matcher</h1>
                <p>Find your perfect persona match with our intelligent questionnaire</p>
                
                <a href="/onboarding" class="btn">
                    🚀 Start Onboarding Questionnaire
                </a>
                
                <div class="api-links">
                    <p>API Endpoints:</p>
                    <a href="/api/test">Test API</a> |
                    <a href="/api/questions">View Questions</a>
                </div>
            </div>
        </body>
        </html>
        '''
    
    @app.route('/onboarding')
    def onboarding():
        """Render onboarding questionnaire page"""
        return render_template('onboarding_questionnaire.html')
    
    @app.route('/api/test')
    def api_test():
        """Test API endpoint"""
        return jsonify({
            "message": "Persona Matcher API is working!",
            "available_routes": [
                "GET /api/questions - Get all questions",
                "POST /api/match - Submit responses and get match",
                "GET /onboarding - Onboarding questionnaire page"
            ]
        })
    
    @app.route('/api/questions')
    def get_questions():
        """Get all onboarding questions"""
        try:
            questions = matcher.get_questions()
            return jsonify({"questions": questions})
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @app.route('/api/match', methods=['POST'])
    def calculate_match():
        """Calculate persona match based on responses"""
        try:
            data = request.get_json()
            responses_data = data.get('responses', {})
            
            if not responses_data:
                return jsonify({"error": "No responses provided"}), 400
            
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
    
    return app

def main():
    """Run the Flask development server"""
    print("🎯 Starting LifePlanner Persona Matcher Server")
    print("=" * 50)
    
    try:
        app = create_app()
        print("✅ Flask app created successfully")
        print()
        print("🌐 SERVER URLS:")
        print("   Main Page:      http://localhost:5001/")
        print("   Onboarding:     http://localhost:5001/onboarding")
        print("   Test API:       http://localhost:5001/api/test")
        print()
        print("🚀 Starting server on http://localhost:5001")
        print("   Press Ctrl+C to stop the server")
        print()
        
        app.run(
            host='localhost',
            port=5001,
            debug=True,
            use_reloader=False
        )
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Make sure you're running this from the LifePlanner root directory")
        print("and that the persona_matcher.py file exists in src/core/")
    except KeyboardInterrupt:
        print("\n👋 Server stopped. Thanks for testing the persona matcher!")
    except Exception as e:
        print(f"❌ Server error: {e}")

if __name__ == "__main__":
    main()
