"""
Repository for persona data access
"""

import json
from typing import List, Optional, Dict, Any
from pathlib import Path

from ...shared.models import Persona


class PersonaRepository:
    """Repository for persona data persistence"""
    
    def __init__(self, data_file: str = "data/personas.json"):
        self.data_file = Path(data_file)
        self._ensure_data_file_exists()
    
    def _ensure_data_file_exists(self):
        """Ensure the data file exists, create if not"""
        if not self.data_file.exists():
            self.data_file.parent.mkdir(parents=True, exist_ok=True)
            # Create empty personas file
            with open(self.data_file, 'w') as f:
                json.dump({"personas": []}, f, indent=2)
    
    def load_all(self) -> List[Persona]:
        """Load all personas from storage"""
        try:
            with open(self.data_file, 'r') as f:
                data = json.load(f)
                return [Persona.from_dict(persona_data) for persona_data in data.get("personas", [])]
        except (FileNotFoundError, json.JSONDecodeError, KeyError) as e:
            print(f"Warning: Could not load personas from {self.data_file}: {e}")
            return []
    
    def load_by_id(self, persona_id: str) -> Optional[Persona]:
        """Load a specific persona by ID"""
        personas = self.load_all()
        for persona in personas:
            if persona.id == persona_id:
                return persona
        return None
    
    def save(self, persona: Persona) -> bool:
        """Save a persona to storage"""
        try:
            personas = self.load_all()
            
            # Update existing or add new
            existing_index = None
            for i, existing_persona in enumerate(personas):
                if existing_persona.id == persona.id:
                    existing_index = i
                    break
            
            if existing_index is not None:
                personas[existing_index] = persona
            else:
                personas.append(persona)
            
            # Save back to file
            data = {"personas": [p.to_dict() for p in personas]}
            with open(self.data_file, 'w') as f:
                json.dump(data, f, indent=2)
            
            return True
        except Exception as e:
            print(f"Error saving persona {persona.id}: {e}")
            return False
    
    def delete(self, persona_id: str) -> bool:
        """Delete a persona by ID"""
        try:
            personas = self.load_all()
            personas = [p for p in personas if p.id != persona_id]
            
            data = {"personas": [p.to_dict() for p in personas]}
            with open(self.data_file, 'w') as f:
                json.dump(data, f, indent=2)
            
            return True
        except Exception as e:
            print(f"Error deleting persona {persona_id}: {e}")
            return False
    
    def exists(self, persona_id: str) -> bool:
        """Check if a persona exists"""
        return self.load_by_id(persona_id) is not None

