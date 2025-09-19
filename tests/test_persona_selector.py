#!/usr/bin/env python3
"""
Unit Tests for Persona Selector Framework
"""

import pytest
import json
import tempfile
import os
from datetime import datetime, timedelta
from unittest.mock import Mock, patch

# Add src to path for imports
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from core.persona_selector import (
    PersonaSelectorManager, PersonaContextModifier, PersonaFamily,
    PersonaContext, PersonaTemplate
)
from core.personas import UserPersona, Demographics, PersonalityProfile, GoalsAndAspirations


class TestPersonaContextModifier:
    """Test PersonaContextModifier functionality"""
    
    def test_context_modifier_creation(self):
        """Test creating a context modifier"""
        context = PersonaContextModifier(
            context_id="test_context",
            context_name="Test Context",
            description="Test description",
            priority_activities=["fitness", "networking"],
            budget_multiplier=1.2
        )
        
        assert context.context_id == "test_context"
        assert context.context_name == "Test Context"
        assert context.budget_multiplier == 1.2
        assert "fitness" in context.priority_activities
        assert "networking" in context.priority_activities


class TestPersonaFamily:
    """Test PersonaFamily functionality"""
    
    def test_family_creation(self):
        """Test creating a persona family"""
        family = PersonaFamily(
            family_id="test_family",
            family_name="Test Family",
            description="Test family description",
            base_location="Toronto",
            target_demographics=["mid_career", "high_income"],
            persona_ids=["persona1", "persona2"]
        )
        
        assert family.family_id == "test_family"
        assert family.base_location == "Toronto"
        assert len(family.persona_ids) == 2
        assert "mid_career" in family.target_demographics


class TestPersonaSelectorManager:
    """Test PersonaSelectorManager functionality"""
    
    @pytest.fixture
    def temp_files(self):
        """Create temporary files for testing"""
        with tempfile.TemporaryDirectory() as temp_dir:
            personas_file = os.path.join(temp_dir, "test_personas.json")
            contexts_file = os.path.join(temp_dir, "test_contexts.json")
            families_file = os.path.join(temp_dir, "test_families.json")
            
            yield {
                'personas_file': personas_file,
                'contexts_file': contexts_file,
                'families_file': families_file
            }
    
    @pytest.fixture
    def manager(self, temp_files):
        """Create PersonaSelectorManager instance for testing"""
        return PersonaSelectorManager(
            personas_file=temp_files['personas_file'],
            contexts_file=temp_files['contexts_file'],
            families_file=temp_files['families_file']
        )
    
    def test_manager_initialization(self, manager):
        """Test manager initializes correctly"""
        assert manager is not None
        assert manager.active_persona_id is None
        assert manager.active_contexts == []
        assert len(manager.contexts) > 0  # Should have default contexts
        assert len(manager.families) > 0  # Should have default families
    
    def test_context_management(self, manager):
        """Test adding and removing contexts"""
        # Test adding context
        result = manager.add_context("work_focus")
        assert result is True
        assert "work_focus" in manager.active_contexts
        
        # Test adding invalid context
        result = manager.add_context("invalid_context")
        assert result is False
        
        # Test removing context
        result = manager.remove_context("work_focus")
        assert result is True
        assert "work_focus" not in manager.active_contexts
        
        # Test removing non-existent context
        result = manager.remove_context("work_focus")
        assert result is True  # Should handle gracefully
    
    def test_persona_selection(self, manager):
        """Test persona selection"""
        # Create a test persona first
        test_persona = self.create_test_persona()
        manager.persona_manager.add_persona(test_persona)
        
        # Test selecting valid persona
        result = manager.select_persona(test_persona.persona_id)
        assert result is True
        assert manager.active_persona_id == test_persona.persona_id
        
        # Test selecting invalid persona
        result = manager.select_persona("invalid_persona")
        assert result is False
    
    def test_get_selection_options(self, manager):
        """Test getting selection options"""
        options = manager.get_selection_options()
        
        assert "personas" in options
        assert "families" in options
        assert "contexts" in options
        assert "active_persona" in options
        assert "active_contexts" in options
        
        assert isinstance(options["personas"], list)
        assert isinstance(options["families"], list)
        assert isinstance(options["contexts"], list)
    
    def test_save_and_load_contexts(self, manager, temp_files):
        """Test saving and loading contexts"""
        # Add a context
        manager.add_context("work_focus")
        
        # Save contexts
        manager.save_contexts()
        
        # Verify file was created
        assert os.path.exists(temp_files['contexts_file'])
        
        # Create new manager and verify contexts loaded
        new_manager = PersonaSelectorManager(
            personas_file=temp_files['personas_file'],
            contexts_file=temp_files['contexts_file'],
            families_file=temp_files['families_file']
        )
        
        assert len(new_manager.contexts) > 0
        assert "work_focus" in new_manager.contexts
    
    def create_test_persona(self):
        """Create a test persona for testing"""
        from core.personas import (
            Demographics, PersonalityProfile, GoalsAndAspirations,
            Preferences, Constraints, BehavioralPatterns, NetworkingProfile
        )
        
        return UserPersona(
            persona_id="test_persona",
            persona_name="Test Persona",
            description="Test persona for unit tests",
            demographics=Demographics(
                age_range=[25, 35],
                life_stage="mid_career",
                occupation="Software Developer",
                income_level="high",
                location_preference="Toronto",
                relationship_status="single",
                has_children=False,
                education_level="university"
            ),
            personality=PersonalityProfile(
                personality_type="introvert",
                energy_pattern="morning_person",
                social_style="selective",
                risk_tolerance=5,
                spontaneity_level=3,
                perfectionism_level=7,
                stress_tolerance=6,
                decision_making_style="analytical",
                optimism_level="optimistic",
                organization_style="organized"
            ),
            goals=GoalsAndAspirations(
                primary_goals=["Career growth", "Work-life balance"],
                career_goals=["Get promotion", "Learn new skills"],
                personal_goals=["Stay healthy", "Build relationships"],
                short_term_goals=["Complete project", "Exercise regularly"],
                long_term_goals=["Become team lead", "Buy house"]
            ),
            preferences=Preferences(
                activity_preferences=["fitness_focused", "explorer"],
                preferred_activity_types=["fitness", "professional_networking", "cultural"],
                avoided_activity_types=["large_crowds", "late_nights"],
                preferred_locations=["Gym", "Coffee shops", "Museums"],
                budget_preference="moderate",
                time_preferences={"morning_start": "7:00 AM", "bedtime": "10:00 PM"},
                group_size_preference="small_groups",
                frequency_preference="moderate"
            ),
            constraints=Constraints(
                max_daily_budget=150.0,
                max_weekly_budget=800.0,
                available_weekdays=["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                available_weekends=["Saturday", "Sunday"],
                time_constraints={"work_start": "9:00 AM", "work_end": "6:00 PM"},
                physical_limitations=[],
                dietary_restrictions=[],
                accessibility_needs=[]
            ),
            behavioral_patterns=BehavioralPatterns(
                typical_morning_routine=["Exercise", "Breakfast", "Commute"],
                typical_evening_routine=["Work wrap-up", "Dinner", "Relaxation"],
                weekend_habits=["Sleep in", "Hobbies", "Social time"],
                stress_management=["Exercise", "Meditation", "Music"],
                learning_preferences=["Visual", "Hands-on", "Self-paced"]
            ),
            networking=NetworkingProfile(
                networking_priority=7,
                preferred_networking_venues=["Tech meetups", "Coffee shops", "Conferences"],
                networking_approach="selective",
                relationship_depth_preference="deep",
                follow_up_style="organized",
                communication_preference="in_person"
            )
        )


class TestPersonaTemplates:
    """Test persona template functionality"""
    
    def test_template_enum_values(self):
        """Test that template enum has expected values"""
        expected_templates = [
            "tech_executive",
            "creative_professional", 
            "recent_relocator",
            "entrepreneur",
            "student",
            "parent",
            "retiree",
            "freelancer"
        ]
        
        actual_templates = [template.value for template in PersonaTemplate]
        
        for expected in expected_templates:
            assert expected in actual_templates


class TestContextEnum:
    """Test context enum functionality"""
    
    def test_context_enum_values(self):
        """Test that context enum has expected values"""
        expected_contexts = [
            "work_focus",
            "job_search",
            "social_building", 
            "fitness_training",
            "relationship_focus",
            "family_time",
            "travel_mode",
            "recovery_mode"
        ]
        
        actual_contexts = [context.value for context in PersonaContext]
        
        for expected in expected_contexts:
            assert expected in actual_contexts


# Integration test helper
def run_integration_test():
    """Run a basic integration test"""
    print("🧪 Running Persona Selector Integration Test...")
    
    # Create manager
    manager = PersonaSelectorManager()
    
    # Test basic functionality
    print("✅ Manager created successfully")
    
    # Test getting options
    options = manager.get_selection_options()
    print(f"✅ Found {len(options['personas'])} personas")
    print(f"✅ Found {len(options['contexts'])} contexts")
    print(f"✅ Found {len(options['families'])} families")
    
    # Test context management
    manager.add_context("work_focus")
    print("✅ Added work_focus context")
    
    manager.add_context("fitness_training")
    print("✅ Added fitness_training context")
    
    print(f"✅ Active contexts: {manager.active_contexts}")
    
    # Test persona selection if personas exist
    personas = manager.persona_manager.get_all_personas()
    if personas:
        test_persona = personas[0]
        result = manager.select_persona(test_persona.persona_id)
        if result:
            print(f"✅ Selected persona: {test_persona.persona_name}")
        else:
            print("❌ Failed to select persona")
    else:
        print("ℹ️  No personas found for selection test")
    
    print("🎉 Integration test completed successfully!")


if __name__ == "__main__":
    # Run integration test if called directly
    run_integration_test()
