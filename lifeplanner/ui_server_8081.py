#!/usr/bin/env python3
"""
Simple Flask server to serve the LifePlanner UI on port 8081
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
    try:
        from features.application.life_planner_app import LifePlannerApp
        ENHANCED_APP_AVAILABLE = False
        print("⚠️ Enhanced app not available, using basic app")
    except ImportError:
        print("⚠️ LifePlanner app not available, running in standalone mode")
        ENHANCED_APP_AVAILABLE = False
        life_planner = None

app = Flask(__name__)
CORS(app)

# Initialize LifePlanner
if ENHANCED_APP_AVAILABLE:
    life_planner = EnhancedLifePlannerApp()
elif not ENHANCED_APP_AVAILABLE and 'life_planner' not in locals():
    life_planner = None

# Configuration
UI_DIR = 'ui'
API_BASE_URL = 'http://localhost:5000'  # Backend API server

@app.route('/')
def index():
    """Serve the main UI"""
    return send_from_directory(UI_DIR, 'index.html')

@app.route('/simple_index.html')
def simple_index():
    """Serve the simple index page"""
    return send_from_directory(UI_DIR, 'simple_index.html')

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
    if life_planner is None:
        return jsonify({
            'status': 'standalone',
            'message': 'Running in standalone mode without LifePlanner backend'
        })
    
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
    if life_planner is None:
        return jsonify({
            'personas': [],
            'count': 0,
            'message': 'LifePlanner not available'
        })
    
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
    print("🚀 Starting LifePlanner UI Server on port 8081...")
    print(f"📁 Serving UI from: {os.path.abspath(UI_DIR)}")
    print(f"🔗 Backend API: {API_BASE_URL}")
    print(f"🎯 Enhanced app: {'Yes' if ENHANCED_APP_AVAILABLE else 'No'}")
    print(f"🎯 LifePlanner available: {'Yes' if life_planner is not None else 'No'}")
    print()
    print("🌐 Access the application at:")
    print("   Main UI: http://localhost:8081")
    print("   Simple Index: http://localhost:8081/simple_index.html")
    print("   Test Page: http://localhost:8081/test")
    print("   API Docs: http://localhost:8081/api/v1/docs")
    print()
    
    app.run(host='0.0.0.0', port=8081, debug=True)

