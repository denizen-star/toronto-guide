"""
Service layer for configuration management
"""

import json
from typing import Optional
from pathlib import Path

from .settings import AppSettings


class ConfigurationService:
    """Service layer for configuration management"""
    
    def __init__(self, config_file: str = "data/settings.json"):
        self.config_file = Path(config_file)
        self._ensure_config_file_exists()
    
    def _ensure_config_file_exists(self):
        """Ensure the config file exists, create if not"""
        if not self.config_file.exists():
            self.config_file.parent.mkdir(parents=True, exist_ok=True)
            # Create default settings file
            default_settings = AppSettings()
            self.save_settings(default_settings)
    
    def load_settings(self) -> AppSettings:
        """Load settings from storage"""
        try:
            with open(self.config_file, 'r') as f:
                data = json.load(f)
                return AppSettings.from_dict(data)
        except (FileNotFoundError, json.JSONDecodeError, KeyError) as e:
            print(f"Warning: Could not load settings from {self.config_file}: {e}")
            return AppSettings()
    
    def save_settings(self, settings: AppSettings) -> bool:
        """Save settings to storage"""
        try:
            with open(self.config_file, 'w') as f:
                json.dump(settings.to_dict(), f, indent=2)
            return True
        except Exception as e:
            print(f"Error saving settings: {e}")
            return False
    
    def update_settings(self, **kwargs) -> bool:
        """Update specific settings"""
        settings = self.load_settings()
        
        # Update settings with provided values
        for key, value in kwargs.items():
            if hasattr(settings, key):
                setattr(settings, key, value)
            else:
                print(f"Warning: Unknown setting '{key}'")
        
        return self.save_settings(settings)
    
    def validate_settings(self, settings: AppSettings) -> list:
        """Validate settings and return list of issues"""
        return settings.validate()
    
    def reset_to_defaults(self) -> bool:
        """Reset settings to defaults"""
        default_settings = AppSettings()
        return self.save_settings(default_settings)
