"""
Calendar integration service for LifePlanner
"""

import json
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
from pathlib import Path

from ...shared.models import Schedule, TimeSlot
from ...shared.logging import get_logger


class CalendarService:
    """Calendar integration service for syncing with external calendars"""
    
    def __init__(self, config_file: str = "data/calendar_config.json"):
        self.config_file = Path(config_file)
        self.logger = get_logger(__name__)
        
        # Load configuration
        self.config = self._load_config()
        
        # Calendar providers
        self.providers = {
            "google": self._init_google_calendar,
            "outlook": self._init_outlook_calendar,
            "ical": self._init_ical_calendar
        }
        
        # Initialize enabled providers
        self.active_providers = {}
        self._initialize_providers()
    
    def _load_config(self) -> Dict:
        """Load calendar configuration"""
        if self.config_file.exists():
            try:
                with open(self.config_file, 'r') as f:
                    return json.load(f)
            except Exception as e:
                self.logger.warning(f"Failed to load calendar config: {e}")
        
        # Default configuration
        return {
            "enabled_providers": [],
            "sync_settings": {
                "auto_sync": False,
                "sync_interval_hours": 24,
                "conflict_resolution": "manual"  # "manual", "lifeplanner_priority", "calendar_priority"
            },
            "google": {
                "credentials_file": "data/google_credentials.json",
                "calendar_id": "primary"
            },
            "outlook": {
                "client_id": "",
                "client_secret": "",
                "calendar_id": "primary"
            },
            "ical": {
                "calendar_urls": []
            }
        }
    
    def _save_config(self):
        """Save calendar configuration"""
        try:
            self.config_file.parent.mkdir(exist_ok=True)
            with open(self.config_file, 'w') as f:
                json.dump(self.config, f, indent=2)
        except Exception as e:
            self.logger.error(f"Failed to save calendar config: {e}")
    
    def _initialize_providers(self):
        """Initialize enabled calendar providers"""
        for provider in self.config.get("enabled_providers", []):
            if provider in self.providers:
                try:
                    self.active_providers[provider] = self.providers[provider]()
                    self.logger.info(f"Initialized {provider} calendar provider")
                except Exception as e:
                    self.logger.error(f"Failed to initialize {provider} provider: {e}")
    
    def _init_google_calendar(self):
        """Initialize Google Calendar integration"""
        # This would require google-auth and google-api-python-client
        # For now, return a mock implementation
        return MockCalendarProvider("Google Calendar")
    
    def _init_outlook_calendar(self):
        """Initialize Outlook Calendar integration"""
        # This would require microsoft-graph-auth
        # For now, return a mock implementation
        return MockCalendarProvider("Outlook Calendar")
    
    def _init_ical_calendar(self):
        """Initialize iCal integration"""
        # This would require icalendar library
        # For now, return a mock implementation
        return MockCalendarProvider("iCal")
    
    def sync_schedule_to_calendar(self, schedule: Schedule, 
                                provider: str = None) -> Dict[str, any]:
        """Sync LifePlanner schedule to external calendar"""
        results = {}
        
        # Determine which providers to sync to
        providers_to_sync = [provider] if provider else list(self.active_providers.keys())
        
        for provider_name in providers_to_sync:
            if provider_name not in self.active_providers:
                results[provider_name] = {"error": f"Provider {provider_name} not available"}
                continue
            
            try:
                provider_instance = self.active_providers[provider_name]
                
                # Convert schedule to calendar events
                events = self._schedule_to_events(schedule)
                
                # Sync events
                sync_result = provider_instance.create_events(events)
                results[provider_name] = sync_result
                
                self.logger.info(f"Synced schedule to {provider_name}: {len(events)} events")
                
            except Exception as e:
                self.logger.error(f"Failed to sync to {provider_name}: {e}")
                results[provider_name] = {"error": str(e)}
        
        return results
    
    def import_calendar_events(self, provider: str = None, 
                             start_date: datetime = None, 
                             end_date: datetime = None) -> List[Dict]:
        """Import events from external calendar"""
        if start_date is None:
            start_date = datetime.now()
        if end_date is None:
            end_date = start_date + timedelta(days=7)
        
        all_events = []
        
        # Determine which providers to import from
        providers_to_import = [provider] if provider else list(self.active_providers.keys())
        
        for provider_name in providers_to_import:
            if provider_name not in self.active_providers:
                continue
            
            try:
                provider_instance = self.active_providers[provider_name]
                events = provider_instance.get_events(start_date, end_date)
                
                # Add provider info to events
                for event in events:
                    event["source_provider"] = provider_name
                
                all_events.extend(events)
                
                self.logger.info(f"Imported {len(events)} events from {provider_name}")
                
            except Exception as e:
                self.logger.error(f"Failed to import from {provider_name}: {e}")
        
        return all_events
    
    def detect_conflicts(self, schedule: Schedule) -> List[Dict]:
        """Detect conflicts between LifePlanner schedule and calendar events"""
        conflicts = []
        
        # Import calendar events for the schedule period
        schedule_start = datetime.strptime(schedule.start_date, "%Y-%m-%d")
        schedule_end = schedule_start + timedelta(days=7)  # Assume 1 week
        
        calendar_events = self.import_calendar_events(
            start_date=schedule_start,
            end_date=schedule_end
        )
        
        # Check each time slot for conflicts
        for time_slot in schedule.time_slots:
            slot_start = self._parse_time_slot_datetime(time_slot, schedule_start)
            slot_end = slot_start + timedelta(hours=time_slot.activity.duration_hours)
            
            for event in calendar_events:
                event_start = datetime.fromisoformat(event["start_time"])
                event_end = datetime.fromisoformat(event["end_time"])
                
                # Check for time overlap
                if self._times_overlap(slot_start, slot_end, event_start, event_end):
                    conflict = {
                        "lifeplanner_activity": {
                            "name": time_slot.activity.name,
                            "start_time": slot_start.isoformat(),
                            "end_time": slot_end.isoformat()
                        },
                        "calendar_event": {
                            "title": event["title"],
                            "start_time": event["start_time"],
                            "end_time": event["end_time"],
                            "provider": event["source_provider"]
                        },
                        "conflict_type": "time_overlap",
                        "severity": self._calculate_conflict_severity(time_slot, event)
                    }
                    conflicts.append(conflict)
        
        self.logger.info(f"Detected {len(conflicts)} calendar conflicts")
        return conflicts
    
    def resolve_conflicts(self, conflicts: List[Dict], 
                         resolution_strategy: str = None) -> List[Dict]:
        """Resolve calendar conflicts based on strategy"""
        if resolution_strategy is None:
            resolution_strategy = self.config["sync_settings"]["conflict_resolution"]
        
        resolutions = []
        
        for conflict in conflicts:
            if resolution_strategy == "lifeplanner_priority":
                resolution = self._resolve_with_lifeplanner_priority(conflict)
            elif resolution_strategy == "calendar_priority":
                resolution = self._resolve_with_calendar_priority(conflict)
            else:  # manual
                resolution = self._suggest_manual_resolution(conflict)
            
            resolutions.append(resolution)
        
        return resolutions
    
    def _schedule_to_events(self, schedule: Schedule) -> List[Dict]:
        """Convert LifePlanner schedule to calendar events"""
        events = []
        schedule_start = datetime.strptime(schedule.start_date, "%Y-%m-%d")
        
        for time_slot in schedule.time_slots:
            # Calculate event datetime
            event_start = self._parse_time_slot_datetime(time_slot, schedule_start)
            event_end = event_start + timedelta(hours=time_slot.activity.duration_hours)
            
            # Create calendar event
            event = {
                "title": time_slot.activity.name,
                "description": time_slot.activity.description + (f"\n\nNotes: {time_slot.notes}" if time_slot.notes else ""),
                "start_time": event_start.isoformat(),
                "end_time": event_end.isoformat(),
                "location": time_slot.activity.location,
                "all_day": False,
                "source": "LifePlanner",
                "activity_type": time_slot.activity.activity_type.value,
                "cost": time_slot.activity.cost_cad
            }
            
            events.append(event)
        
        return events
    
    def _parse_time_slot_datetime(self, time_slot: TimeSlot, base_date: datetime) -> datetime:
        """Parse time slot start time into datetime"""
        # This is a simplified implementation
        # In reality, you'd need to handle the schedule's date progression
        time_str = time_slot.start_time
        
        # Parse time (assumes format like "6:00 AM")
        try:
            time_obj = datetime.strptime(time_str, "%I:%M %p").time()
            return datetime.combine(base_date.date(), time_obj)
        except ValueError:
            # Fallback to current time
            return base_date
    
    def _times_overlap(self, start1: datetime, end1: datetime, 
                      start2: datetime, end2: datetime) -> bool:
        """Check if two time periods overlap"""
        return not (end1 <= start2 or start1 >= end2)
    
    def _calculate_conflict_severity(self, time_slot: TimeSlot, event: Dict) -> str:
        """Calculate the severity of a conflict"""
        # High severity for work meetings, important events
        if "meeting" in event.get("title", "").lower() or "important" in event.get("title", "").lower():
            return "high"
        
        # Medium severity for activities that require planning
        if time_slot.activity.requires_planning:
            return "medium"
        
        return "low"
    
    def _resolve_with_lifeplanner_priority(self, conflict: Dict) -> Dict:
        """Resolve conflict by prioritizing LifePlanner activity"""
        return {
            "conflict": conflict,
            "resolution": "keep_lifeplanner_activity",
            "action": "Move or cancel calendar event",
            "recommendation": f"Consider rescheduling '{conflict['calendar_event']['title']}' to avoid conflict with '{conflict['lifeplanner_activity']['name']}'"
        }
    
    def _resolve_with_calendar_priority(self, conflict: Dict) -> Dict:
        """Resolve conflict by prioritizing calendar event"""
        return {
            "conflict": conflict,
            "resolution": "keep_calendar_event",
            "action": "Reschedule LifePlanner activity",
            "recommendation": f"Reschedule '{conflict['lifeplanner_activity']['name']}' to avoid conflict with '{conflict['calendar_event']['title']}'"
        }
    
    def _suggest_manual_resolution(self, conflict: Dict) -> Dict:
        """Suggest manual resolution options"""
        suggestions = [
            f"Reschedule '{conflict['lifeplanner_activity']['name']}' to a different time",
            f"Move '{conflict['calendar_event']['title']}' if possible",
            f"Combine activities if they are compatible",
            f"Cancel one of the conflicting activities"
        ]
        
        return {
            "conflict": conflict,
            "resolution": "manual_review_required",
            "action": "User decision needed",
            "suggestions": suggestions
        }
    
    def get_calendar_summary(self) -> Dict:
        """Get summary of calendar integration status"""
        return {
            "active_providers": list(self.active_providers.keys()),
            "sync_settings": self.config["sync_settings"],
            "last_sync": self.config.get("last_sync"),
            "total_synced_events": self.config.get("total_synced_events", 0),
            "pending_conflicts": self.config.get("pending_conflicts", 0)
        }
    
    def configure_provider(self, provider: str, settings: Dict) -> bool:
        """Configure a calendar provider"""
        if provider not in self.providers:
            return False
        
        try:
            # Update configuration
            self.config[provider].update(settings)
            
            # Add to enabled providers if not already there
            if provider not in self.config["enabled_providers"]:
                self.config["enabled_providers"].append(provider)
            
            # Reinitialize provider
            self.active_providers[provider] = self.providers[provider]()
            
            # Save configuration
            self._save_config()
            
            self.logger.info(f"Configured {provider} calendar provider")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to configure {provider}: {e}")
            return False


class MockCalendarProvider:
    """Mock calendar provider for testing"""
    
    def __init__(self, name: str):
        self.name = name
        self.events = []
    
    def create_events(self, events: List[Dict]) -> Dict:
        """Mock create events"""
        self.events.extend(events)
        return {
            "success": True,
            "created_events": len(events),
            "message": f"Created {len(events)} events in {self.name}"
        }
    
    def get_events(self, start_date: datetime, end_date: datetime) -> List[Dict]:
        """Mock get events"""
        # Return some mock events
        mock_events = [
            {
                "title": "Team Meeting",
                "start_time": (start_date + timedelta(hours=10)).isoformat(),
                "end_time": (start_date + timedelta(hours=11)).isoformat(),
                "location": "Office",
                "description": "Weekly team meeting"
            },
            {
                "title": "Doctor Appointment",
                "start_time": (start_date + timedelta(days=1, hours=14)).isoformat(),
                "end_time": (start_date + timedelta(days=1, hours=15)).isoformat(),
                "location": "Medical Center",
                "description": "Annual checkup"
            }
        ]
        
        return mock_events

