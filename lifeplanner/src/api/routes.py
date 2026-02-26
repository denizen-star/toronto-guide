"""
API routes for LifePlanner
"""

from flask import request, jsonify, current_app
from datetime import datetime

from ..shared.exceptions import ValidationError, PersonaNotFoundError


def register_routes(app):
    """Register all API routes"""
    
    @app.route('/api/v1/personas', methods=['GET'])
    def get_personas():
        """Get all available personas"""
        personas = app.life_planner.get_available_personas()
        return jsonify({
            "personas": personas,
            "count": len(personas),
            "timestamp": datetime.now().isoformat()
        })
    
    @app.route('/api/v1/personas/<persona_id>', methods=['POST'])
    def set_persona(persona_id):
        """Set active persona"""
        try:
            success = app.life_planner.set_persona(persona_id)
            if success:
                return jsonify({
                    "message": f"Persona {persona_id} set successfully",
                    "persona_id": persona_id,
                    "timestamp": datetime.now().isoformat()
                })
            else:
                raise PersonaNotFoundError(persona_id)
        except PersonaNotFoundError:
            raise
    
    @app.route('/api/v1/schedule', methods=['POST'])
    def generate_schedule():
        """Generate a schedule"""
        data = request.get_json()
        
        if not data:
            raise ValidationError("Request body is required")
        
        # Validate required fields
        required_fields = ['start_date', 'duration']
        for field in required_fields:
            if field not in data:
                raise ValidationError(f"Missing required field: {field}")
        
        # Extract parameters
        start_date = data['start_date']
        duration = data['duration']
        schedule_type = data.get('schedule_type', 'integrated')
        focus_areas = data.get('focus_areas', [])
        
        # Generate schedule
        result = app.life_planner.generate_schedule(
            start_date=start_date,
            duration=duration,
            schedule_type=schedule_type,
            focus_areas=focus_areas
        )
        
        return jsonify({
            "result": result,
            "timestamp": datetime.now().isoformat()
        })
    
    @app.route('/api/v1/activities', methods=['GET'])
    def get_activities():
        """Get all activities"""
        stats = app.life_planner.get_activity_statistics()
        activities = app.life_planner.activity_service.get_all_activities()
        
        # Convert activities to dict format
        activities_data = [activity.to_dict() for activity in activities]
        
        return jsonify({
            "activities": activities_data,
            "statistics": stats,
            "count": len(activities_data),
            "timestamp": datetime.now().isoformat()
        })
    
    @app.route('/api/v1/activities/recommendations', methods=['GET'])
    def get_activity_recommendations():
        """Get personalized activity recommendations"""
        # Check if persona is set
        if not app.life_planner.planner.persona:
            raise ValidationError("No active persona set. Set a persona first.")
        
        # Get parameters
        num_recommendations = request.args.get('limit', 10, type=int)
        exclude_activities = request.args.getlist('exclude')
        
        # Get recommendations (would need to implement this in the app)
        # For now, return mock recommendations
        recommendations = [
            {
                "activity_name": "Art Gallery Opening",
                "score": 0.85,
                "reason": "matches your interests, great for networking",
                "confidence": 0.85,
                "recommendation_type": "content_based"
            },
            {
                "activity_name": "Morning Exercise",
                "score": 0.78,
                "reason": "fits your routine, good for health goals",
                "confidence": 0.78,
                "recommendation_type": "collaborative"
            }
        ]
        
        return jsonify({
            "recommendations": recommendations[:num_recommendations],
            "persona_id": app.life_planner.planner.persona.id,
            "count": len(recommendations[:num_recommendations]),
            "timestamp": datetime.now().isoformat()
        })
    
    @app.route('/api/v1/analytics', methods=['GET'])
    def get_analytics():
        """Get usage analytics"""
        # Get parameters
        user_id = request.args.get('user_id')
        time_window_days = request.args.get('time_window_days', 30, type=int)
        
        # Mock analytics data (would integrate with analytics engine)
        analytics = {
            "time_period": {
                "start_date": (datetime.now() - datetime.timedelta(days=time_window_days)).isoformat(),
                "end_date": datetime.now().isoformat(),
                "days": time_window_days
            },
            "user_id": user_id,
            "total_interactions": 42,
            "activity_analytics": {
                "most_popular_activities": [["Morning Exercise", 8], ["Art Gallery Opening", 6]],
                "activity_type_distribution": {"fitness": 15, "social": 12, "cultural": 8},
                "total_unique_activities": 25
            },
            "engagement_analytics": {
                "engagement_score": 0.75,
                "average_session_length_minutes": 15.5,
                "total_users": 1
            }
        }
        
        return jsonify({
            "analytics": analytics,
            "timestamp": datetime.now().isoformat()
        })
    
    @app.route('/api/v1/weather', methods=['GET'])
    def get_weather():
        """Get weather information"""
        city = request.args.get('city', 'Toronto')
        forecast_days = request.args.get('days', 3, type=int)
        
        # Mock weather data (would integrate with weather service)
        weather_data = {
            "current": {
                "temperature": 22.0,
                "description": "partly cloudy",
                "is_outdoor_friendly": True
            },
            "forecast": [
                {
                    "date": (datetime.now() + datetime.timedelta(days=i)).date().isoformat(),
                    "temperature_min": 18.0 + i,
                    "temperature_max": 25.0 + i,
                    "description": "clear sky" if i % 2 == 0 else "few clouds",
                    "is_outdoor_friendly": True
                }
                for i in range(forecast_days)
            ],
            "recommendations": [
                {
                    "date": datetime.now().date().isoformat(),
                    "recommended_activities": [
                        {"activity": "Outdoor dining", "reason": "Perfect temperature for patio dining"},
                        {"activity": "Park picnic", "reason": "Great weather for outdoor meals"}
                    ]
                }
            ]
        }
        
        return jsonify({
            "city": city,
            "weather": weather_data,
            "timestamp": datetime.now().isoformat()
        })
    
    @app.route('/api/v1/settings', methods=['GET'])
    def get_settings():
        """Get current settings"""
        settings = app.life_planner.settings
        return jsonify({
            "settings": settings.to_dict(),
            "timestamp": datetime.now().isoformat()
        })
    
    @app.route('/api/v1/settings', methods=['PUT'])
    def update_settings():
        """Update settings"""
        data = request.get_json()
        
        if not data:
            raise ValidationError("Request body is required")
        
        # Update settings
        success = app.life_planner.update_settings(**data)
        
        if success:
            return jsonify({
                "message": "Settings updated successfully",
                "updated_fields": list(data.keys()),
                "timestamp": datetime.now().isoformat()
            })
        else:
            raise ValidationError("Failed to update settings")
    
    @app.route('/api/v1/status', methods=['GET'])
    def get_status():
        """Get application status"""
        status = app.life_planner.get_app_status()
        return jsonify({
            "status": status,
            "timestamp": datetime.now().isoformat()
        })
    
    @app.route('/api/v1/cache/stats', methods=['GET'])
    def get_cache_stats():
        """Get cache statistics"""
        from ..features.performance import cache_manager
        stats = cache_manager.get_cache_stats()
        
        return jsonify({
            "cache_stats": stats,
            "timestamp": datetime.now().isoformat()
        })
    
    @app.route('/api/v1/cache/clear', methods=['POST'])
    def clear_cache():
        """Clear application cache"""
        from ..features.performance import cache_manager
        cache_manager.clear()
        
        return jsonify({
            "message": "Cache cleared successfully",
            "timestamp": datetime.now().isoformat()
        })
    
    # API documentation endpoint
    @app.route('/api/v1/docs', methods=['GET'])
    def api_docs():
        """API documentation"""
        docs = {
            "title": "LifePlanner API",
            "version": "1.0.0",
            "description": "REST API for the LifePlanner application",
            "base_url": "/api/v1",
            "endpoints": {
                "GET /personas": "Get all available personas",
                "POST /personas/<id>": "Set active persona",
                "POST /schedule": "Generate a schedule",
                "GET /activities": "Get all activities",
                "GET /activities/recommendations": "Get activity recommendations",
                "GET /analytics": "Get usage analytics",
                "GET /weather": "Get weather information",
                "GET /settings": "Get current settings",
                "PUT /settings": "Update settings",
                "GET /status": "Get application status",
                "GET /cache/stats": "Get cache statistics",
                "POST /cache/clear": "Clear application cache"
            },
            "examples": {
                "generate_schedule": {
                    "method": "POST",
                    "url": "/api/v1/schedule",
                    "body": {
                        "start_date": "2024-01-15",
                        "duration": "1 week",
                        "schedule_type": "integrated",
                        "focus_areas": ["fitness", "networking"]
                    }
                },
                "set_persona": {
                    "method": "POST",
                    "url": "/api/v1/personas/kevin_head_of_data",
                    "body": {}
                },
                "update_settings": {
                    "method": "PUT",
                    "url": "/api/v1/settings",
                    "body": {
                        "user_name": "New Name",
                        "max_daily_budget": 250.0
                    }
                }
            }
        }
        
        return jsonify(docs)

