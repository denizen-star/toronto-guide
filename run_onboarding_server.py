#!/usr/bin/env python3
"""
Flask Server for Persona Onboarding
Run this to test the interactive onboarding questionnaire in your browser
"""

import sys
import os
from flask import Flask

# Add src to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

try:
    from src.api.persona_matcher_routes import persona_matcher_bp
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you're running this from the LifePlanner root directory")
    sys.exit(1)

def create_app():
    """Create Flask app with persona matcher routes"""
    app = Flask(__name__)
    
    # Set secret key for sessions
    app.secret_key = 'lifeplanner-persona-matcher-demo-key-2025'
    
    # Register persona matcher blueprint
    app.register_blueprint(persona_matcher_bp)
    
    # Add root route that redirects to onboarding
    @app.route('/')
    def index():
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
                
                <a href="/api/persona-matcher/onboarding" class="btn">
                    🚀 Start Onboarding Questionnaire
                </a>
                
                <div class="api-links">
                    <p>API Endpoints:</p>
                    <a href="/api/persona-matcher/test">Test API</a> |
                    <a href="/api/persona-matcher/questions">View Questions</a>
                </div>
            </div>
        </body>
        </html>
        '''
    
    return app

def main():
    """Run the Flask development server"""
    print("🎯 Starting LifePlanner Persona Matcher Server")
    print("=" * 50)
    
    app = create_app()
    
    print("✅ Flask app created with persona matcher routes")
    print()
    print("🌐 SERVER URLS:")
    print("   Main Page:      http://localhost:5001/")
    print("   Onboarding:     http://localhost:5001/api/persona-matcher/onboarding")
    print("   Test API:       http://localhost:5001/api/persona-matcher/test")
    print()
    print("🚀 Starting server on http://localhost:5001")
    print("   Press Ctrl+C to stop the server")
    print()
    
    try:
        app.run(
            host='localhost',
            port=5001,
            debug=True,
            use_reloader=False  # Avoid double startup messages
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped. Thanks for testing the persona matcher!")
    except Exception as e:
        print(f"❌ Server error: {e}")

if __name__ == "__main__":
    main()
