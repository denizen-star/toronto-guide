#!/usr/bin/env python3
"""
Integration Test Script for Persona System with Flask App
This tests the persona system integrated with your existing Flask application
"""

import sys
import os
import json
from flask import Flask

# Add src to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

try:
    from api.persona_routes import persona_bp
    from core.persona_selector import PersonaSelectorManager
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure the persona system files are in the correct locations")
    sys.exit(1)


def create_test_app():
    """Create Flask app with persona routes for testing"""
    app = Flask(__name__)
    app.config['TESTING'] = True
    app.secret_key = 'test_secret_key_for_personas'
    
    # Register persona blueprint
    app.register_blueprint(persona_bp)
    
    # Add a simple test route
    @app.route('/test')
    def test_route():
        return {"message": "Persona system integration test"}
    
    return app


def test_flask_integration():
    """Test persona system integration with Flask"""
    print("🧪 Testing Persona System Flask Integration")
    print("=" * 50)
    
    try:
        # Create Flask app
        app = create_test_app()
        print("✅ Flask app created with persona routes")
        
        with app.test_client() as client:
            # Test basic route
            response = client.get('/test')
            if response.status_code == 200:
                print("✅ Basic Flask routing works")
            else:
                print(f"❌ Basic routing failed: {response.status_code}")
                return False
            
            # Test persona options endpoint
            print("\n🔍 Testing Persona API Endpoints:")
            
            response = client.get('/api/persona-selector/options')
            if response.status_code == 200:
                data = json.loads(response.data)
                print(f"✅ Options endpoint: Found {len(data.get('personas', []))} personas")
                print(f"   🎯 Contexts: {len(data.get('contexts', []))}")
                print(f"   👥 Families: {len(data.get('families', []))}")
            else:
                print(f"❌ Options endpoint failed: {response.status_code}")
                return False
            
            # Test persona creation
            print("\n🏗️  Testing Persona Creation:")
            
            persona_data = {
                'persona_name': 'Integration Test User',
                'description': 'Created during Flask integration test',
                'demographics': {
                    'age_range': [25, 35],
                    'life_stage': 'mid_career',
                    'income_level': 'moderate',
                    'location_preference': 'Toronto'
                },
                'preferences': {
                    'preferred_activity_types': ['fitness', 'social', 'professional_networking']
                }
            }
            
            response = client.post('/api/persona-selector/create',
                                  json=persona_data,
                                  content_type='application/json')
            
            if response.status_code == 200:
                data = json.loads(response.data)
                print(f"✅ Created persona: {data.get('persona_id')}")
                
                # Test applying the created persona
                apply_data = {
                    'persona_id': data['persona_id'],
                    'contexts': ['work_focus', 'fitness_training']
                }
                
                response = client.post('/api/persona-selector/apply',
                                      json=apply_data,
                                      content_type='application/json')
                
                if response.status_code == 200:
                    apply_result = json.loads(response.data)
                    print(f"✅ Applied persona with contexts: {apply_result.get('contexts')}")
                else:
                    print(f"❌ Failed to apply persona: {response.status_code}")
                    return False
            else:
                print(f"❌ Failed to create persona: {response.status_code}")
                print(f"   Response: {response.data}")
                return False
            
            # Test contexts endpoint
            print("\n🎯 Testing Contexts Endpoint:")
            
            response = client.get('/api/persona-selector/contexts')
            if response.status_code == 200:
                data = json.loads(response.data)
                contexts = data.get('contexts', [])
                print(f"✅ Contexts endpoint: Found {len(contexts)} contexts")
                
                if contexts:
                    print("   Available contexts:")
                    for context in contexts[:3]:  # Show first 3
                        print(f"   - {context.get('context_name')}: {context.get('description')}")
            else:
                print(f"❌ Contexts endpoint failed: {response.status_code}")
                return False
            
            # Test families endpoint
            print("\n👥 Testing Families Endpoint:")
            
            response = client.get('/api/persona-selector/families')
            if response.status_code == 200:
                data = json.loads(response.data)
                families = data.get('families', [])
                print(f"✅ Families endpoint: Found {len(families)} families")
                
                if families:
                    print("   Available families:")
                    for family in families:
                        print(f"   - {family.get('family_name')}: {family.get('persona_count')} personas")
            else:
                print(f"❌ Families endpoint failed: {response.status_code}")
                return False
            
            print("\n🎉 Flask integration test completed successfully!")
            return True
            
    except Exception as e:
        print(f"❌ Integration test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_persona_manager_standalone():
    """Test PersonaSelectorManager standalone functionality"""
    print("\n🧪 Testing PersonaSelectorManager Standalone")
    print("=" * 50)
    
    try:
        # Create manager
        manager = PersonaSelectorManager()
        print("✅ PersonaSelectorManager created")
        
        # Test basic functionality
        options = manager.get_selection_options()
        print(f"✅ Selection options: {len(options['personas'])} personas")
        
        # Test context management
        result = manager.add_context("work_focus")
        print(f"✅ Added context: {result}")
        
        result = manager.add_context("fitness_training")
        print(f"✅ Added context: {result}")
        
        print(f"✅ Active contexts: {manager.active_contexts}")
        
        # Test persona selection if available
        personas = manager.persona_manager.get_all_personas()
        if personas:
            test_persona = personas[0]
            result = manager.select_persona(test_persona.persona_id)
            print(f"✅ Selected persona: {result} ({test_persona.persona_name})")
        else:
            print("ℹ️  No personas available for selection test")
        
        print("✅ Standalone manager test completed!")
        return True
        
    except Exception as e:
        print(f"❌ Standalone test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def run_full_integration_test():
    """Run complete integration test suite"""
    print("🚀 LifePlanner Persona System Integration Test")
    print("=" * 60)
    
    success = True
    
    # Test standalone manager
    if not test_persona_manager_standalone():
        success = False
    
    # Test Flask integration
    if not test_flask_integration():
        success = False
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 ALL INTEGRATION TESTS PASSED!")
        print("\n✨ Your persona system is ready for integration!")
        print("\nNext steps:")
        print("1. Add persona routes to your main Flask app")
        print("2. Update your UI to include persona selector")
        print("3. Connect persona recommendations to your planner logic")
    else:
        print("❌ SOME TESTS FAILED!")
        print("\n🔧 Please check the errors above and fix any issues.")
    
    return success


def main():
    """Main function"""
    if len(sys.argv) > 1 and sys.argv[1] == "flask-only":
        # Test only Flask integration
        test_flask_integration()
    elif len(sys.argv) > 1 and sys.argv[1] == "manager-only":
        # Test only standalone manager
        test_persona_manager_standalone()
    else:
        # Run full integration test
        run_full_integration_test()


if __name__ == "__main__":
    main()
