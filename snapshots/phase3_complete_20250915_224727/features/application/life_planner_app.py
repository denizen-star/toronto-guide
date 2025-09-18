"""
Main Life Planner Application class
"""

from typing import Dict, List, Optional
from datetime import datetime

from ...shared.models import Persona
from ...shared.exceptions import PlannerError, ValidationError, PersonaNotFoundError
from ...features.configuration import AppSettings, ConfigurationService
from ...features.personas import PersonaService
from ...features.activities import ActivityService
from ...features.scheduling import LifePlannerAgent


class LifePlannerApp:
    """Main application class that orchestrates all services"""
    
    def __init__(self, config_file: str = "data/settings.json"):
        # Initialize services
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
    
    def generate_schedule(self, start_date: str, duration: str, 
                         schedule_type: str = "integrated",
                         focus_areas: Optional[List[str]] = None) -> Dict:
        """Generate a schedule using the planner agent"""
        try:
            return self.planner.generate_schedule(
                start_date=start_date,
                duration=duration,
                schedule_type=schedule_type,
                focus_areas=focus_areas
            )
        except ValidationError:
            raise
        except Exception as e:
            raise PlannerError(f"Failed to generate schedule: {e}")
    
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
    
    def get_persona_recommendations(self, persona_id: str) -> List[Dict]:
        """Get recommendations for a specific persona"""
        return self.persona_service.get_persona_recommendations(persona_id)
    
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
        """Get application status and statistics"""
        return {
            "settings_loaded": self.settings is not None,
            "active_persona": self.planner.persona.name if self.planner.persona else None,
            "total_activities": len(self.planner.activities),
            "used_activities": len(self.planner.used_activities),
            "available_personas": len(self.get_available_personas()),
            "last_updated": datetime.now().isoformat()
        }
