"""
Enhanced Life Planner Application with Phase 6 advanced features
"""

from typing import Dict, List, Optional
from datetime import datetime

from ...shared.models import Persona
from ...shared.exceptions import PlannerError, ValidationError, PersonaNotFoundError
from ...features.configuration import AppSettings, ConfigurationService
from ...features.personas import PersonaService
from ...features.activities import ActivityService
from ...features.scheduling import LifePlannerAgent
from ...features.intelligence import RecommendationEngine
from ...features.integrations import WeatherService, CalendarService
from ...features.analytics import AnalyticsEngine
from ...features.performance import CacheManager, cached
from ...shared.logging import get_logger


class EnhancedLifePlannerApp:
    """Enhanced Life Planner Application with AI, weather, analytics, and performance features"""
    
    def __init__(self, config_file: str = "data/settings.json"):
        self.logger = get_logger(__name__)
        
        # Initialize core services
        self.config_service = ConfigurationService(config_file)
        self.persona_service = PersonaService()
        self.activity_service = ActivityService()
        
        # Load settings
        self.settings = self.config_service.load_settings()
        
        # Initialize planner agent
        self.planner = LifePlannerAgent(
            settings=self.settings,
            activity_service=self.activity_service,
            persona_service=self.persona_service
        )
        
        # Initialize advanced features
        self.recommendation_engine = RecommendationEngine()
        self.weather_service = WeatherService()
        self.calendar_service = CalendarService()
        self.analytics_engine = AnalyticsEngine()
        self.cache_manager = CacheManager()
        
        self.logger.info("Enhanced LifePlanner application initialized with advanced features")
    
    @cached(ttl_seconds=1800, key_prefix="schedule_")  # Cache for 30 minutes
    def generate_schedule(self, start_date: str, duration: str, 
                         schedule_type: str = "integrated",
                         focus_areas: Optional[List[str]] = None,
                         use_weather: bool = True,
                         use_recommendations: bool = True) -> Dict:
        """Generate an enhanced schedule with AI recommendations and weather integration"""
        try:
            start_time = datetime.now()
            
            # Generate base schedule
            result = self.planner.generate_schedule(
                start_date=start_date,
                duration=duration,
                schedule_type=schedule_type,
                focus_areas=focus_areas
            )
            
            # Enhance with weather recommendations
            if use_weather:
                weather_recommendations = self.weather_service.get_outdoor_activity_recommendations()
                result["weather_recommendations"] = weather_recommendations
                result["weather_alerts"] = self.weather_service.get_weather_alerts()
            
            # Add AI-powered recommendations
            if use_recommendations and self.planner.persona:
                ai_recommendations = self.recommendation_engine.get_personalized_recommendations(
                    persona=self.planner.persona,
                    num_recommendations=5
                )
                result["ai_recommendations"] = ai_recommendations
            
            # Check for calendar conflicts
            calendar_conflicts = []
            try:
                from ...shared.models import Schedule
                schedule_obj = Schedule.from_dict(result["schedule"])
                calendar_conflicts = self.calendar_service.detect_conflicts(schedule_obj)
            except Exception as e:
                self.logger.warning(f"Calendar conflict detection failed: {e}")
            
            result["calendar_conflicts"] = calendar_conflicts
            
            # Add performance metrics
            generation_time = (datetime.now() - start_time).total_seconds() * 1000
            result["performance"] = {
                "generation_time_ms": generation_time,
                "cache_used": False,  # This would be True if loaded from cache
                "weather_integration": use_weather,
                "ai_recommendations": use_recommendations
            }
            
            # Log performance
            self.logger.log_schedule_generation(
                persona_id=self.planner.persona.id if self.planner.persona else "none",
                schedule_type=schedule_type,
                start_date=start_date,
                duration=duration,
                activity_count=len(result["schedule"].get("time_slots", [])),
                duration_ms=generation_time
            )
            
            return result
            
        except ValidationError:
            raise
        except Exception as e:
            raise PlannerError(f"Enhanced schedule generation failed: {e}")
    
    def get_personalized_recommendations(self, num_recommendations: int = 10,
                                       exclude_recent: bool = True) -> List[Dict]:
        """Get AI-powered personalized recommendations"""
        if not self.planner.persona:
            raise ValidationError("No active persona set. Set a persona first.")
        
        exclude_activities = set()
        if exclude_recent:
            # Get recently used activities
            recent_activities = self._get_recent_activities()
            exclude_activities.update(recent_activities)
        
        recommendations = self.recommendation_engine.get_personalized_recommendations(
            persona=self.planner.persona,
            exclude_activities=exclude_activities,
            num_recommendations=num_recommendations
        )
        
        # Record recommendation interaction
        for rec in recommendations:
            self.recommendation_engine.record_interaction(
                user_id=self.planner.persona.id,
                activity_name=rec["activity_name"],
                interaction_type="recommendation_shown"
            )
        
        return recommendations
    
    def get_weather_insights(self, days: int = 7) -> Dict:
        """Get weather insights and activity recommendations"""
        current_weather = self.weather_service.get_current_weather()
        forecast = self.weather_service.get_forecast(days)
        recommendations = self.weather_service.get_outdoor_activity_recommendations(days)
        alerts = self.weather_service.get_weather_alerts()
        
        return {
            "current_weather": current_weather,
            "forecast": forecast,
            "activity_recommendations": recommendations,
            "alerts": alerts,
            "outdoor_friendly_days": len([f for f in forecast if f["is_outdoor_friendly"]])
        }
    
    def get_analytics_dashboard(self, time_window_days: int = 30) -> Dict:
        """Get comprehensive analytics dashboard"""
        user_id = self.planner.persona.id if self.planner.persona else None
        
        # Generate analytics
        analytics = self.analytics_engine.generate_usage_analytics(
            user_id=user_id,
            time_window_days=time_window_days
        )
        
        # Generate insights
        insights = self.analytics_engine.generate_insights(analytics)
        
        # Get trending activities
        trending = self.recommendation_engine.get_trending_activities(time_window_days)
        
        # Get cache statistics
        cache_stats = self.cache_manager.get_cache_stats()
        
        return {
            "analytics": analytics,
            "insights": insights,
            "trending_activities": trending,
            "performance_metrics": {
                "cache_stats": cache_stats,
                "recommendation_engine_status": "active",
                "weather_service_status": "active",
                "calendar_service_status": "active"
            },
            "dashboard_generated": datetime.now().isoformat()
        }
    
    def sync_with_calendar(self, schedule: Dict, provider: str = None) -> Dict:
        """Sync generated schedule with external calendar"""
        try:
            from ...shared.models import Schedule
            schedule_obj = Schedule.from_dict(schedule)
            
            # Sync to calendar
            sync_results = self.calendar_service.sync_schedule_to_calendar(
                schedule=schedule_obj,
                provider=provider
            )
            
            # Detect and resolve conflicts
            conflicts = self.calendar_service.detect_conflicts(schedule_obj)
            resolutions = []
            
            if conflicts:
                resolutions = self.calendar_service.resolve_conflicts(conflicts)
            
            return {
                "sync_results": sync_results,
                "conflicts_detected": len(conflicts),
                "conflicts": conflicts,
                "resolutions": resolutions,
                "sync_timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Calendar sync failed: {e}")
            return {
                "error": str(e),
                "sync_results": {},
                "conflicts_detected": 0
            }
    
    def record_activity_feedback(self, activity_name: str, rating: float, 
                               feedback: str = "") -> bool:
        """Record user feedback on an activity"""
        if not self.planner.persona:
            return False
        
        try:
            # Record interaction with rating
            self.recommendation_engine.record_interaction(
                user_id=self.planner.persona.id,
                activity_name=activity_name,
                interaction_type="completed",
                rating=rating
            )
            
            # Log feedback
            self.logger.info(
                f"Activity feedback recorded: {activity_name} rated {rating}/5",
                persona_id=self.planner.persona.id,
                activity_name=activity_name,
                rating=rating
            )
            
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to record feedback: {e}")
            return False
    
    def get_smart_suggestions(self, context: str = "general") -> List[Dict]:
        """Get context-aware smart suggestions"""
        suggestions = []
        
        if not self.planner.persona:
            return suggestions
        
        # Weather-based suggestions
        current_weather = self.weather_service.get_current_weather()
        if current_weather and not current_weather["is_outdoor_friendly"]:
            suggestions.append({
                "type": "weather_alternative",
                "title": "Indoor Activity Suggested",
                "message": f"Weather isn't great ({current_weather['description']}). Consider indoor alternatives.",
                "priority": "medium"
            })
        
        # Analytics-based suggestions
        analytics = self.analytics_engine.generate_usage_analytics(
            user_id=self.planner.persona.id,
            time_window_days=7
        )
        
        engagement_score = analytics.get("engagement_analytics", {}).get("engagement_score", 0)
        if engagement_score < 0.5:
            suggestions.append({
                "type": "engagement_boost",
                "title": "Try Something New",
                "message": "Your engagement has been low recently. Consider exploring new activity types!",
                "priority": "high"
            })
        
        # Budget utilization suggestions
        preference_analytics = analytics.get("preference_analytics", {})
        budget_util = preference_analytics.get("budget_utilization", {})
        utilization_rate = budget_util.get("budget_utilization_rate", 0)
        
        if utilization_rate < 0.3:
            suggestions.append({
                "type": "budget_optimization",
                "title": "Budget Underutilized",
                "message": f"You're only using {utilization_rate:.1%} of your budget. Consider higher-value activities.",
                "priority": "low"
            })
        
        # Trending activity suggestions
        trending = self.recommendation_engine.get_trending_activities(30)
        if trending:
            top_trending = trending[0]
            suggestions.append({
                "type": "trending_activity",
                "title": "Trending Activity",
                "message": f"'{top_trending['activity_name']}' is trending with {top_trending['interaction_count']} recent interactions.",
                "priority": "low"
            })
        
        return suggestions
    
    def optimize_performance(self) -> Dict:
        """Optimize application performance"""
        optimization_results = {
            "cache_optimization": {},
            "data_cleanup": {},
            "performance_improvements": []
        }
        
        # Cache optimization
        cache_stats_before = self.cache_manager.get_cache_stats()
        
        # Clean up expired cache entries
        self.cache_manager._cleanup_expired_cache()
        
        cache_stats_after = self.cache_manager.get_cache_stats()
        
        optimization_results["cache_optimization"] = {
            "entries_before": cache_stats_before["total_entries"],
            "entries_after": cache_stats_after["total_entries"],
            "entries_cleaned": cache_stats_before["total_entries"] - cache_stats_after["total_entries"],
            "memory_freed_mb": (cache_stats_before["memory_usage_mb"] - cache_stats_after["memory_usage_mb"])
        }
        
        # Performance improvements
        if cache_stats_after["total_entries"] > 100:
            optimization_results["performance_improvements"].append(
                "Consider clearing old cache entries to improve performance"
            )
        
        if cache_stats_after["memory_usage_mb"] > 50:
            optimization_results["performance_improvements"].append(
                "High memory usage detected. Consider increasing cache cleanup frequency"
            )
        
        self.logger.info("Performance optimization completed", **optimization_results["cache_optimization"])
        
        return optimization_results
    
    def _get_recent_activities(self, days: int = 7) -> List[str]:
        """Get recently used activities"""
        # This would query the interaction history
        # For now, return empty list
        return []
    
    def export_comprehensive_report(self, format: str = "json") -> str:
        """Export comprehensive application report"""
        # Get all data
        analytics = self.get_analytics_dashboard()
        weather = self.get_weather_insights()
        recommendations = self.get_personalized_recommendations() if self.planner.persona else []
        suggestions = self.get_smart_suggestions()
        calendar_summary = self.calendar_service.get_calendar_summary()
        
        report = {
            "report_type": "comprehensive",
            "generated_at": datetime.now().isoformat(),
            "user_persona": self.planner.persona.name if self.planner.persona else None,
            "analytics": analytics,
            "weather_insights": weather,
            "ai_recommendations": recommendations,
            "smart_suggestions": suggestions,
            "calendar_integration": calendar_summary,
            "performance_metrics": {
                "cache_stats": self.cache_manager.get_cache_stats(),
                "total_activities": len(self.activity_service.get_all_activities()),
                "available_personas": len(self.persona_service.get_all_personas())
            }
        }
        
        if format.lower() == "json":
            import json
            return json.dumps(report, indent=2)
        elif format.lower() == "markdown":
            return self.analytics_engine._format_markdown_report(report)
        else:
            return str(report)
    
    # Inherit all methods from base LifePlannerApp
    def set_persona(self, persona_id: str) -> bool:
        """Set the active persona for planning"""
        try:
            persona = self.persona_service.get_persona_by_id(persona_id)
            if not persona:
                raise PersonaNotFoundError(persona_id)
            
            self.planner.persona = persona
            return True
        except PersonaNotFoundError:
            raise
        except Exception as e:
            raise PlannerError(f"Failed to set persona: {e}")
    
    def get_available_personas(self) -> List[Dict]:
        """Get list of available personas"""
        personas = self.persona_service.get_all_personas()
        return [
            {
                "id": persona.id,
                "name": persona.name,
                "description": persona.description,
                "personality_type": persona.personality_type.value,
                "networking_priority": persona.networking_priority
            }
            for persona in personas
        ]
    
    def get_activity_statistics(self) -> Dict:
        """Get activity statistics"""
        return self.activity_service.get_activity_statistics()
    
    def update_settings(self, **kwargs) -> bool:
        """Update application settings"""
        try:
            success = self.config_service.update_settings(**kwargs)
            if success:
                # Reload settings
                self.settings = self.config_service.load_settings()
                # Update planner with new settings
                self.planner.settings = self.settings
            return success
        except Exception as e:
            raise PlannerError(f"Failed to update settings: {e}")
    
    def reset_planner(self):
        """Reset planner state"""
        self.planner.reset_planner()
    
    def get_app_status(self) -> Dict:
        """Get enhanced application status"""
        base_status = {
            "settings_loaded": self.settings is not None,
            "active_persona": self.planner.persona.name if self.planner.persona else None,
            "total_activities": len(self.planner.activities),
            "used_activities": len(self.planner.used_activities),
            "available_personas": len(self.get_available_personas()),
            "last_updated": datetime.now().isoformat()
        }
        
        # Add enhanced status
        enhanced_status = {
            "ai_features": {
                "recommendation_engine": "active",
                "analytics_engine": "active",
                "ml_models_loaded": True
            },
            "integrations": {
                "weather_service": "active",
                "calendar_service": "active" if self.calendar_service.active_providers else "inactive"
            },
            "performance": {
                "cache_enabled": True,
                "cache_stats": self.cache_manager.get_cache_stats()
            }
        }
        
        return {**base_status, **enhanced_status}

