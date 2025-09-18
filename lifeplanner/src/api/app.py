"""
Flask API application for LifePlanner
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import traceback

from ..features.application import LifePlannerApp
from ..shared.exceptions import PlannerError, ValidationError, PersonaNotFoundError
from ..shared.logging import get_logger
from .routes import register_routes


def create_app(config=None):
    """Create Flask application"""
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app)
    
    # Configure app
    app.config['JSON_SORT_KEYS'] = False
    app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
    
    if config:
        app.config.update(config)
    
    # Initialize logger
    logger = get_logger(__name__)
    
    # Initialize LifePlanner app
    life_planner = LifePlannerApp()
    app.life_planner = life_planner
    
    # Register routes
    register_routes(app)
    
    # Error handlers
    @app.errorhandler(ValidationError)
    def handle_validation_error(error):
        logger.warning(f"Validation error: {error}")
        return jsonify({
            "error": "Validation Error",
            "message": str(error),
            "timestamp": datetime.now().isoformat()
        }), 400
    
    @app.errorhandler(PersonaNotFoundError)
    def handle_persona_not_found(error):
        logger.warning(f"Persona not found: {error}")
        return jsonify({
            "error": "Persona Not Found",
            "message": str(error),
            "timestamp": datetime.now().isoformat()
        }), 404
    
    @app.errorhandler(PlannerError)
    def handle_planner_error(error):
        logger.error(f"Planner error: {error}")
        return jsonify({
            "error": "Planner Error",
            "message": str(error),
            "timestamp": datetime.now().isoformat()
        }), 500
    
    @app.errorhandler(404)
    def handle_not_found(error):
        return jsonify({
            "error": "Not Found",
            "message": "The requested resource was not found",
            "timestamp": datetime.now().isoformat()
        }), 404
    
    @app.errorhandler(500)
    def handle_internal_error(error):
        logger.error(f"Internal server error: {error}")
        logger.error(traceback.format_exc())
        return jsonify({
            "error": "Internal Server Error",
            "message": "An unexpected error occurred",
            "timestamp": datetime.now().isoformat()
        }), 500
    
    # Request logging
    @app.before_request
    def log_request():
        logger.info(f"API Request: {request.method} {request.path}")
    
    @app.after_request
    def log_response(response):
        logger.info(f"API Response: {response.status_code}")
        return response
    
    # Health check
    @app.route('/health')
    def health_check():
        return jsonify({
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "version": "1.0.0"
        })
    
    logger.info("LifePlanner API application created")
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)

