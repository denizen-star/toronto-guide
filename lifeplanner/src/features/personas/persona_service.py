"""
Service layer for persona management
"""

from typing import List, Optional
from datetime import datetime

from ...shared.models import Persona
from .persona_repository import PersonaRepository


class PersonaService:
    """Service layer for persona business logic"""
    
    def __init__(self, repository: Optional[PersonaRepository] = None):
        self.repository = repository or PersonaRepository()
    
    def get_all_personas(self) -> List[Persona]:
        """Get all active personas"""
        personas = self.repository.load_all()
        return [p for p in personas if p.is_active]
    
    def get_persona_by_id(self, persona_id: str) -> Optional[Persona]:
        """Get a specific persona by ID"""
        return self.repository.load_by_id(persona_id)
    
    def create_persona(self, persona: Persona) -> bool:
        """Create a new persona"""
        if self.repository.exists(persona.id):
            raise ValueError(f"Persona with ID '{persona.id}' already exists")
        
        # Set creation metadata
        persona.created_date = datetime.now()
        persona.last_updated = datetime.now()
        persona.is_active = True
        persona.usage_count = 0
        
        return self.repository.save(persona)
    
    def update_persona(self, persona: Persona) -> bool:
        """Update an existing persona"""
        if not self.repository.exists(persona.id):
            raise ValueError(f"Persona with ID '{persona.id}' does not exist")
        
        # Update metadata
        persona.last_updated = datetime.now()
        
        return self.repository.save(persona)
    
    def delete_persona(self, persona_id: str) -> bool:
        """Delete a persona (soft delete by setting inactive)"""
        persona = self.repository.load_by_id(persona_id)
        if not persona:
            raise ValueError(f"Persona with ID '{persona_id}' does not exist")
        
        persona.is_active = False
        persona.last_updated = datetime.now()
        
        return self.repository.save(persona)
    
    def get_persona_recommendations(self, persona_id: str) -> List[dict]:
        """Get activity recommendations for a persona"""
        persona = self.get_persona_by_id(persona_id)
        if not persona:
            return []
        
        recommendations = []
        
        # Activity type recommendations
        for activity_type in persona.preferred_activities:
            recommendations.append({
                "type": "activity_type",
                "value": activity_type,
                "priority": "high",
                "reason": f"Matches {persona.name}'s preferred activity types"
            })
        
        # Location recommendations
        for location in persona.preferred_locations:
            recommendations.append({
                "type": "location",
                "value": location,
                "priority": "high",
                "reason": f"Preferred location for {persona.name}"
            })
        
        # Budget recommendations
        recommendations.append({
            "type": "budget",
            "value": f"${persona.max_daily_budget}/day",
            "priority": "medium",
            "reason": f"Budget constraint for {persona.name}"
        })
        
        # Networking recommendations
        if persona.networking_priority >= 7:
            recommendations.append({
                "type": "networking",
                "value": "High priority",
                "priority": "high",
                "reason": f"Networking priority: {persona.networking_priority}/10"
            })
        
        return recommendations
    
    def increment_usage(self, persona_id: str) -> bool:
        """Increment usage count for a persona"""
        persona = self.get_persona_by_id(persona_id)
        if not persona:
            return False
        
        persona.usage_count += 1
        persona.last_updated = datetime.now()
        
        return self.repository.save(persona)

