#!/usr/bin/env python3
"""
Simple Flask server to serve the LifePlanner UI
Phase 1: Basic static file serving with API proxy
"""

import os
from flask import Flask, send_from_directory, jsonify, request, send_file
from flask_cors import CORS
import requests

# Import the enhanced LifePlanner app
import sys
sys.path.append('src')

try:
    from features.application.enhanced_life_planner_app import EnhancedLifePlannerApp
    ENHANCED_APP_AVAILABLE = True
except ImportError:
    from features.application.life_planner_app import LifePlannerApp
    ENHANCED_APP_AVAILABLE = False
    print("⚠️ Enhanced app not available, using basic app")

app = Flask(__name__)
CORS(app)

# Initialize LifePlanner
if ENHANCED_APP_AVAILABLE:
    life_planner = EnhancedLifePlannerApp()
else:
    life_planner = LifePlannerApp()

# Configuration
UI_DIR = 'ui'
API_BASE_URL = 'http://localhost:5000'  # Backend API server

@app.route('/')
def index():
    """Serve the main UI"""
    return send_from_directory(UI_DIR, 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files (CSS, JS, etc.)"""
    try:
        return send_from_directory(UI_DIR, filename)
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404

@app.route('/test')
def test_page():
    """Serve the test page"""
    return send_from_directory(os.path.join(UI_DIR, 'tests'), 'test.html')

# API Proxy Routes (for development)
@app.route('/api/v1/<path:endpoint>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def api_proxy(endpoint):
    """Proxy API requests to the backend server"""
    try:
        # Build the target URL
        target_url = f"{API_BASE_URL}/api/v1/{endpoint}"
        
        # Forward query parameters
        if request.args:
            target_url += '?' + request.query_string.decode()
        
        # Make the request to the backend
        if request.method == 'GET':
            response = requests.get(target_url, timeout=30)
        elif request.method == 'POST':
            response = requests.post(target_url, json=request.get_json(), timeout=30)
        elif request.method == 'PUT':
            response = requests.put(target_url, json=request.get_json(), timeout=30)
        elif request.method == 'DELETE':
            response = requests.delete(target_url, timeout=30)
        
        # Return the response
        return jsonify(response.json()), response.status_code
        
    except requests.exceptions.ConnectionError:
        return jsonify({
            'error': 'Backend API not available',
            'message': 'Make sure the backend API server is running on port 5000',
            'backend_url': API_BASE_URL
        }), 503
    except requests.exceptions.Timeout:
        return jsonify({
            'error': 'Backend API timeout',
            'message': 'The backend API took too long to respond'
        }), 504
    except Exception as e:
        return jsonify({
            'error': 'API proxy error',
            'message': str(e)
        }), 500

# Direct API endpoints (bypass proxy for testing)
@app.route('/api/v1/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'LifePlanner UI Server',
        'version': '1.0.0',
        'backend_available': check_backend_health()
    })

@app.route('/api/v1/status')
def get_status():
    """Get application status"""
    try:
        status = life_planner.get_app_status()
        return jsonify({
            'status': status,
            'timestamp': status.get('last_updated')
        })
    except Exception as e:
        return jsonify({
            'error': 'Failed to get status',
            'message': str(e)
        }), 500

@app.route('/api/v1/personas')
def get_personas():
    """Get available personas"""
    try:
        personas = life_planner.get_available_personas()
        return jsonify({
            'personas': personas,
            'count': len(personas)
        })
    except Exception as e:
        return jsonify({
            'error': 'Failed to get personas',
            'message': str(e)
        }), 500

@app.route('/api/v1/personas/<persona_id>', methods=['POST'])
def set_persona(persona_id):
    """Set active persona"""
    try:
        success = life_planner.set_persona(persona_id)
        if success:
            return jsonify({
                'message': f'Persona {persona_id} set successfully',
                'persona_id': persona_id
            })
        else:
            return jsonify({
                'error': 'Failed to set persona',
                'persona_id': persona_id
            }), 400
    except Exception as e:
        return jsonify({
            'error': 'Failed to set persona',
            'message': str(e)
        }), 500

@app.route('/api/v1/schedule', methods=['POST'])
def generate_schedule():
    """Generate a schedule"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request body required'}), 400
        
        result = life_planner.generate_schedule(
            start_date=data.get('start_date'),
            duration=data.get('duration'),
            schedule_type=data.get('schedule_type', 'integrated'),
            focus_areas=data.get('focus_areas', [])
        )
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to generate schedule',
            'message': str(e)
        }), 500

@app.route('/api/v1/activities')
def get_activities():
    """Get all activities"""
    try:
        stats = life_planner.get_activity_statistics()
        return jsonify({
            'activities': [],  # Would need to implement in life_planner
            'statistics': stats
        })
    except Exception as e:
        return jsonify({
            'error': 'Failed to get activities',
            'message': str(e)
        }), 500

@app.route('/api/v1/activities/recommendations')
def get_recommendations():
    """Get activity recommendations"""
    try:
        if hasattr(life_planner, 'get_personalized_recommendations'):
            # Enhanced app
            recommendations = life_planner.get_personalized_recommendations(
                num_recommendations=int(request.args.get('limit', 10))
            )
        else:
            # Basic app - return mock data
            recommendations = [
                {
                    'activity_name': 'Morning Exercise',
                    'score': 0.85,
                    'reason': 'Great for your fitness goals',
                    'confidence': 0.85
                }
            ]
        
        return jsonify({
            'recommendations': recommendations,
            'count': len(recommendations)
        })
    except Exception as e:
        return jsonify({
            'error': 'Failed to get recommendations',
            'message': str(e)
        }), 500

@app.route('/api/v1/weather')
def get_weather():
    """Get weather information"""
    try:
        if hasattr(life_planner, 'get_weather_insights'):
            # Enhanced app
            weather = life_planner.get_weather_insights()
        else:
            # Basic app - return mock data
            weather = {
                'current': {
                    'temperature': 22.0,
                    'description': 'partly cloudy',
                    'is_outdoor_friendly': True
                },
                'forecast': []
            }
        
        return jsonify({
            'weather': weather,
            'city': 'Toronto'
        })
    except Exception as e:
        return jsonify({
            'error': 'Failed to get weather',
            'message': str(e)
        }), 500

@app.route('/api/v1/settings')
def get_settings():
    """Get current settings"""
    try:
        settings = life_planner.settings
        return jsonify({
            'settings': settings.to_dict() if hasattr(settings, 'to_dict') else {}
        })
    except Exception as e:
        return jsonify({
            'error': 'Failed to get settings',
            'message': str(e)
        }), 500

@app.route('/api/v1/settings', methods=['PUT'])
def update_settings():
    """Update settings"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request body required'}), 400
        
        success = life_planner.update_settings(**data)
        
        if success:
            return jsonify({
                'message': 'Settings updated successfully',
                'updated_fields': list(data.keys())
            })
        else:
            return jsonify({'error': 'Failed to update settings'}), 500
            
    except Exception as e:
        return jsonify({
            'error': 'Failed to update settings',
            'message': str(e)
        }), 500

@app.route('/api/v1/cache/stats')
def get_cache_stats():
    """Get cache statistics"""
    try:
        if hasattr(life_planner, 'cache_manager'):
            stats = life_planner.cache_manager.get_cache_stats()
        else:
            stats = {'message': 'Cache not available in basic app'}
        
        return jsonify({'cache_stats': stats})
    except Exception as e:
        return jsonify({
            'error': 'Failed to get cache stats',
            'message': str(e)
        }), 500

@app.route('/api/v1/cache/clear', methods=['POST'])
def clear_cache():
    """Clear cache"""
    try:
        if hasattr(life_planner, 'cache_manager'):
            life_planner.cache_manager.clear()
            message = 'Cache cleared successfully'
        else:
            message = 'Cache not available in basic app'
        
        return jsonify({'message': message})
    except Exception as e:
        return jsonify({
            'error': 'Failed to clear cache',
            'message': str(e)
        }), 500

@app.route('/api/v1/docs')
def api_docs():
    """API documentation"""
    return jsonify({
        'title': 'LifePlanner UI Server API',
        'version': '1.0.0',
        'description': 'API endpoints for the LifePlanner UI',
        'endpoints': {
            'GET /': 'Serve main UI',
            'GET /test': 'Serve test page',
            'GET /api/v1/health': 'Health check',
            'GET /api/v1/status': 'Get app status',
            'GET /api/v1/personas': 'Get personas',
            'POST /api/v1/personas/<id>': 'Set persona',
            'POST /api/v1/schedule': 'Generate schedule',
            'GET /api/v1/activities': 'Get activities',
            'GET /api/v1/activities/recommendations': 'Get recommendations',
            'GET /api/v1/weather': 'Get weather',
            'GET /api/v1/settings': 'Get settings',
            'PUT /api/v1/settings': 'Update settings',
            'GET /api/v1/cache/stats': 'Get cache stats',
            'POST /api/v1/cache/clear': 'Clear cache'
        }
    })

def check_backend_health():
    """Check if backend API is available"""
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=5)
        return response.status_code == 200
    except:
        return False

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'error': 'Not Found',
        'message': 'The requested resource was not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'error': 'Internal Server Error',
        'message': 'An unexpected error occurred'
    }), 500

if __name__ == '__main__':
    print("🚀 Starting LifePlanner UI Server...")
    print(f"📁 Serving UI from: {os.path.abspath(UI_DIR)}")
    print(f"🔗 Backend API: {API_BASE_URL}")
    print(f"🎯 Enhanced app: {'Yes' if ENHANCED_APP_AVAILABLE else 'No'}")
    print()
    print("🌐 Access the application at:")
    print("   Main UI: http://localhost:8081")
    print("   Simple UI: http://localhost:8081/simple_index.html")
    print("   Test Page: http://localhost:8081/test")
    print("   API Docs: http://localhost:8081/api/v1/docs")
    print()
    
    app.run(host='0.0.0.0', port=8081, debug=True)
