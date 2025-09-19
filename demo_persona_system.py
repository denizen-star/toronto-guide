#!/usr/bin/env python3
"""
Demo Script for Persona Selector System
Run this to test and demonstrate the persona functionality
"""

import sys
import os
import json
from datetime import datetime

# Add src to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

try:
    from core.persona_selector import PersonaSelectorManager, PersonaContextModifier
    from core.personas import UserPersona
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you're running this from the LifePlanner root directory")
    sys.exit(1)


class PersonaSystemDemo:
    """Demo class to showcase persona system functionality"""
    
    def __init__(self):
        self.manager = None
        self.demo_personas_created = []
    
    def run_full_demo(self):
        """Run complete demo of persona system"""
        print("🎭 LifePlanner Persona System Demo")
        print("=" * 50)
        
        try:
            self.initialize_system()
            self.demo_existing_personas()
            self.demo_context_system()
            self.demo_persona_selection()
            self.demo_persona_creation()
            self.demo_persona_families()
            self.demo_api_simulation()
            
            print("\n🎉 Demo completed successfully!")
            print("✨ The persona system is ready for integration!")
            
        except Exception as e:
            print(f"\n❌ Demo failed with error: {e}")
            import traceback
            traceback.print_exc()
    
    def initialize_system(self):
        """Initialize the persona system"""
        print("\n1️⃣ Initializing Persona System...")
        
        self.manager = PersonaSelectorManager()
        
        print(f"✅ System initialized")
        print(f"   📊 Found {len(self.manager.persona_manager.personas)} existing personas")
        print(f"   🎯 Found {len(self.manager.contexts)} contexts")
        print(f"   👥 Found {len(self.manager.families)} persona families")
    
    def demo_existing_personas(self):
        """Demo existing personas"""
        print("\n2️⃣ Existing Personas...")
        
        personas = self.manager.persona_manager.get_all_personas()
        
        if not personas:
            print("   ℹ️  No existing personas found")
            return
        
        for persona in personas:
            print(f"   👤 {persona.persona_name}")
            print(f"      📝 {persona.description}")
            print(f"      💰 Budget: ${persona.constraints.max_daily_budget}/day")
            print(f"      🎯 Goals: {', '.join(persona.goals.primary_goals[:3])}")
            print()
    
    def demo_context_system(self):
        """Demo context system functionality"""
        print("\n3️⃣ Context System Demo...")
        
        print("   Available Contexts:")
        for context_id, context in self.manager.contexts.items():
            print(f"   🎯 {context.context_name}")
            print(f"      📝 {context.description}")
            print(f"      💡 Priorities: {', '.join(context.priority_activities[:3])}")
            print()
        
        # Demo adding contexts
        print("   Testing Context Application:")
        
        contexts_to_test = ["work_focus", "fitness_training"]
        for context_id in contexts_to_test:
            result = self.manager.add_context(context_id)
            if result:
                print(f"   ✅ Added context: {context_id}")
            else:
                print(f"   ❌ Failed to add context: {context_id}")
        
        print(f"   📊 Active contexts: {self.manager.active_contexts}")
        
        # Remove contexts
        for context_id in contexts_to_test:
            self.manager.remove_context(context_id)
        
        print(f"   🧹 Cleared contexts: {self.manager.active_contexts}")
    
    def demo_persona_selection(self):
        """Demo persona selection"""
        print("\n4️⃣ Persona Selection Demo...")
        
        personas = self.manager.persona_manager.get_all_personas()
        
        if not personas:
            print("   ℹ️  No personas available for selection")
            return
        
        # Select first persona
        test_persona = personas[0]
        result = self.manager.select_persona(test_persona.persona_id)
        
        if result:
            print(f"   ✅ Selected persona: {test_persona.persona_name}")
            print(f"   📊 Active persona ID: {self.manager.active_persona_id}")
            
            # Add some contexts
            self.manager.add_context("work_focus")
            self.manager.add_context("social_building")
            
            print(f"   🎯 Applied contexts: {self.manager.active_contexts}")
            
            # Get effective persona
            effective = self.manager.get_effective_persona()
            if effective:
                print(f"   ✨ Effective persona ready for recommendations")
            else:
                print(f"   ❌ Failed to get effective persona")
        else:
            print(f"   ❌ Failed to select persona")
    
    def demo_persona_creation(self):
        """Demo creating new personas"""
        print("\n5️⃣ Persona Creation Demo...")
        
        # Create a demo persona
        demo_persona_data = {
            "persona_name": f"Demo User {datetime.now().strftime('%H%M')}",
            "description": "Created during demo for testing purposes",
            "demographics": {
                "age_range": [28, 35],
                "life_stage": "mid_career",
                "occupation": "Software Developer",
                "income_level": "high",
                "location_preference": "Toronto"
            },
            "goals": {
                "primary_goals": ["Career advancement", "Work-life balance", "Build network"],
                "career_goals": ["Get promotion", "Learn new technologies"],
                "personal_goals": ["Stay fit", "Travel more"]
            },
            "preferences": {
                "preferred_activity_types": ["fitness", "professional_networking", "cultural"],
                "budget_preference": "moderate"
            }
        }
        
        try:
            # This would normally use the API, but we'll simulate it
            persona_id = f"demo_user_{int(datetime.now().timestamp())}"
            print(f"   🏗️  Creating persona: {demo_persona_data['persona_name']}")
            print(f"   📝 Description: {demo_persona_data['description']}")
            print(f"   🎯 Goals: {', '.join(demo_persona_data['goals']['primary_goals'])}")
            print(f"   ✅ Persona creation simulated successfully")
            print(f"   🆔 Generated ID: {persona_id}")
            
            self.demo_personas_created.append(persona_id)
            
        except Exception as e:
            print(f"   ❌ Persona creation failed: {e}")
    
    def demo_persona_families(self):
        """Demo persona families"""
        print("\n6️⃣ Persona Families Demo...")
        
        for family_id, family in self.manager.families.items():
            print(f"   👥 {family.family_name}")
            print(f"      📝 {family.description}")
            print(f"      📍 Location: {family.base_location}")
            print(f"      👤 Personas: {len(family.persona_ids)}")
            print(f"      🎯 Demographics: {', '.join(family.target_demographics)}")
            print()
    
    def demo_api_simulation(self):
        """Demo API endpoints simulation"""
        print("\n7️⃣ API Simulation Demo...")
        
        try:
            # Simulate getting selection options
            options = self.manager.get_selection_options()
            
            print("   🔌 API Endpoint: /api/persona-selector/options")
            print(f"   📊 Response: {len(options['personas'])} personas, {len(options['contexts'])} contexts")
            
            # Simulate applying persona
            if options['personas']:
                persona_id = options['personas'][0]['persona_id']
                contexts = ['work_focus', 'fitness_training']
                
                print(f"   🔌 API Endpoint: /api/persona-selector/apply")
                print(f"   📊 Request: persona_id='{persona_id}', contexts={contexts}")
                
                # Apply the selection
                self.manager.select_persona(persona_id)
                for context in contexts:
                    self.manager.add_context(context)
                
                print(f"   ✅ Simulation successful")
            
        except Exception as e:
            print(f"   ❌ API simulation failed: {e}")
    
    def interactive_demo(self):
        """Run interactive demo with user input"""
        print("\n🎮 Interactive Demo Mode")
        print("=" * 30)
        
        if not self.manager:
            self.initialize_system()
        
        while True:
            print("\nChoose an option:")
            print("1. List all personas")
            print("2. Select a persona")
            print("3. Add/remove contexts")
            print("4. View current selection")
            print("5. Create new persona (simulation)")
            print("6. View persona families")
            print("0. Exit")
            
            choice = input("\nEnter your choice (0-6): ").strip()
            
            if choice == "0":
                break
            elif choice == "1":
                self.list_personas()
            elif choice == "2":
                self.interactive_persona_selection()
            elif choice == "3":
                self.interactive_context_management()
            elif choice == "4":
                self.show_current_selection()
            elif choice == "5":
                self.interactive_persona_creation()
            elif choice == "6":
                self.show_families()
            else:
                print("Invalid choice. Please try again.")
    
    def list_personas(self):
        """List all available personas"""
        personas = self.manager.persona_manager.get_all_personas()
        
        if not personas:
            print("No personas found.")
            return
        
        print(f"\nFound {len(personas)} personas:")
        for i, persona in enumerate(personas, 1):
            print(f"{i}. {persona.persona_name}")
            print(f"   📝 {persona.description}")
            print(f"   💰 Budget: ${persona.constraints.max_daily_budget}/day")
    
    def interactive_persona_selection(self):
        """Interactive persona selection"""
        personas = self.manager.persona_manager.get_all_personas()
        
        if not personas:
            print("No personas available for selection.")
            return
        
        print("\nSelect a persona:")
        for i, persona in enumerate(personas, 1):
            print(f"{i}. {persona.persona_name}")
        
        try:
            choice = int(input(f"\nEnter choice (1-{len(personas)}): "))
            if 1 <= choice <= len(personas):
                selected_persona = personas[choice - 1]
                result = self.manager.select_persona(selected_persona.persona_id)
                
                if result:
                    print(f"✅ Selected: {selected_persona.persona_name}")
                else:
                    print("❌ Selection failed")
            else:
                print("Invalid choice.")
        except ValueError:
            print("Please enter a valid number.")
    
    def interactive_context_management(self):
        """Interactive context management"""
        print("\nAvailable contexts:")
        contexts = list(self.manager.contexts.keys())
        
        for i, context_id in enumerate(contexts, 1):
            context = self.manager.contexts[context_id]
            active = "✅" if context_id in self.manager.active_contexts else "⭕"
            print(f"{i}. {active} {context.context_name}")
        
        try:
            choice = int(input(f"\nToggle context (1-{len(contexts)}): "))
            if 1 <= choice <= len(contexts):
                context_id = contexts[choice - 1]
                
                if context_id in self.manager.active_contexts:
                    self.manager.remove_context(context_id)
                    print(f"❌ Removed: {context_id}")
                else:
                    self.manager.add_context(context_id)
                    print(f"✅ Added: {context_id}")
            else:
                print("Invalid choice.")
        except ValueError:
            print("Please enter a valid number.")
    
    def show_current_selection(self):
        """Show current persona and context selection"""
        print(f"\nCurrent Selection:")
        print(f"👤 Active Persona: {self.manager.active_persona_id or 'None'}")
        print(f"🎯 Active Contexts: {self.manager.active_contexts or 'None'}")
        
        if self.manager.active_persona_id:
            persona = self.manager.persona_manager.get_persona(self.manager.active_persona_id)
            if persona:
                print(f"📝 Description: {persona.description}")
    
    def interactive_persona_creation(self):
        """Interactive persona creation simulation"""
        print("\n🏗️  Persona Creation Simulation")
        
        name = input("Enter persona name: ").strip()
        if not name:
            print("Name is required.")
            return
        
        description = input("Enter description: ").strip()
        
        print("✅ Persona creation simulated successfully!")
        print(f"📝 Name: {name}")
        print(f"📝 Description: {description}")
        print("ℹ️  In real implementation, this would create a full persona.")
    
    def show_families(self):
        """Show persona families"""
        print(f"\nPersona Families ({len(self.manager.families)}):")
        
        for family in self.manager.families.values():
            print(f"👥 {family.family_name}")
            print(f"   📝 {family.description}")
            print(f"   📍 {family.base_location}")
            print(f"   👤 {len(family.persona_ids)} personas")
            print()


def main():
    """Main function to run demo"""
    if len(sys.argv) > 1 and sys.argv[1] == "interactive":
        # Run interactive demo
        demo = PersonaSystemDemo()
        demo.interactive_demo()
    else:
        # Run full automated demo
        demo = PersonaSystemDemo()
        demo.run_full_demo()
        
        # Ask if user wants interactive mode
        response = input("\nWould you like to try interactive mode? (y/n): ").strip().lower()
        if response in ['y', 'yes']:
            demo.interactive_demo()


if __name__ == "__main__":
    main()
