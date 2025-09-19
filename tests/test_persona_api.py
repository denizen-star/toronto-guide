#!/usr/bin/env python3
"""
API Integration Tests for Persona Selector
"""

import pytest
import json
import sys
import os

# Add src to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from flask import Flask
from api.persona_routes import persona_bp


@pytest.fixture
def app():
    """Create Flask app for testing"""
    app = Flask(__name__)
    app.config['TESTING'] = True
    app.secret_key = 'test_secret_key'
    app.register_blueprint(persona_bp)
    return app


@pytest.fixture
def client(app):
    """Create test client"""
    return app.test_client()


class TestPersonaAPI:
    """Test persona API endpoints"""
    
    def test_get_selection_options(self, client):
        """Test getting selection options"""
        response = client.get('/api/persona-selector/options')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert 'personas' in data
        assert 'families' in data
        assert 'contexts' in data
        assert 'active_persona' in data
        assert 'active_contexts' in data
        
        assert isinstance(data['personas'], list)
        assert isinstance(data['families'], list)
        assert isinstance(data['contexts'], list)
    
    def test_apply_persona_missing_id(self, client):
        """Test applying persona without ID"""
        response = client.post('/api/persona-selector/apply',
                              json={})
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
        assert 'persona_id is required' in data['error']
    
    def test_apply_persona_invalid_id(self, client):
        """Test applying invalid persona ID"""
        response = client.post('/api/persona-selector/apply',
                              json={'persona_id': 'invalid_persona'})
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
    
    def test_create_persona_missing_name(self, client):
        """Test creating persona without name"""
        response = client.post('/api/persona-selector/create',
                              json={})
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
        assert 'persona_name is required' in data['error']
    
    def test_create_persona_success(self, client):
        """Test successful persona creation"""
        persona_data = {
            'persona_name': 'Test User',
            'description': 'Test persona for API testing',
            'demographics': {
                'age_range': [25, 35],
                'life_stage': 'mid_career',
                'income_level': 'moderate',
                'location_preference': 'Toronto'
            },
            'preferences': {
                'preferred_activity_types': ['fitness', 'social']
            }
        }
        
        response = client.post('/api/persona-selector/create',
                              json=persona_data)
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert data['success'] is True
        assert 'persona_id' in data
        assert 'persona' in data
        assert data['persona']['persona_name'] == 'Test User'
    
    def test_get_contexts(self, client):
        """Test getting available contexts"""
        response = client.get('/api/persona-selector/contexts')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert 'contexts' in data
        assert isinstance(data['contexts'], list)
        
        if data['contexts']:
            context = data['contexts'][0]
            assert 'context_id' in context
            assert 'context_name' in context
            assert 'description' in context
    
    def test_get_families(self, client):
        """Test getting persona families"""
        response = client.get('/api/persona-selector/families')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert 'families' in data
        assert isinstance(data['families'], list)
        
        if data['families']:
            family = data['families'][0]
            assert 'family_id' in family
            assert 'family_name' in family
            assert 'description' in family
            assert 'persona_count' in family
    
    def test_get_current_persona_none_active(self, client):
        """Test getting current persona when none active"""
        response = client.get('/api/persona-selector/current')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert 'active_persona' in data
        assert 'active_contexts' in data
        assert data['active_persona'] is None
        assert isinstance(data['active_contexts'], list)


def run_api_integration_test():
    """Run API integration test manually"""
    print("🧪 Running Persona API Integration Test...")
    
    # Create Flask app
    app = Flask(__name__)
    app.config['TESTING'] = True
    app.secret_key = 'test_secret_key'
    app.register_blueprint(persona_bp)
    
    with app.test_client() as client:
        print("✅ Flask app created")
        
        # Test getting options
        response = client.get('/api/persona-selector/options')
        if response.status_code == 200:
            data = json.loads(response.data)
            print(f"✅ Options endpoint: {len(data.get('personas', []))} personas")
        else:
            print(f"❌ Options endpoint failed: {response.status_code}")
        
        # Test creating persona
        persona_data = {
            'persona_name': 'API Test User',
            'description': 'Created via API test',
            'demographics': {
                'age_range': [30, 40],
                'life_stage': 'mid_career',
                'income_level': 'high'
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
                'contexts': ['work_focus']
            }
            
            response = client.post('/api/persona-selector/apply',
                                  json=apply_data,
                                  content_type='application/json')
            
            if response.status_code == 200:
                print("✅ Applied persona successfully")
            else:
                print(f"❌ Failed to apply persona: {response.status_code}")
        else:
            print(f"❌ Failed to create persona: {response.status_code}")
        
        # Test contexts endpoint
        response = client.get('/api/persona-selector/contexts')
        if response.status_code == 200:
            data = json.loads(response.data)
            print(f"✅ Contexts endpoint: {len(data.get('contexts', []))} contexts")
        else:
            print(f"❌ Contexts endpoint failed: {response.status_code}")
    
    print("🎉 API integration test completed!")


if __name__ == "__main__":
    # Run integration test if called directly
    run_api_integration_test()
