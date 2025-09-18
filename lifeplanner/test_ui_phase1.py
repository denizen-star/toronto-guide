#!/usr/bin/env python3
"""
Test script for UI Phase 1
Simple validation that the UI server and API endpoints work
"""

import requests
import json
import time
import webbrowser
from datetime import datetime

API_BASE = 'http://localhost:8080'

def test_api_endpoints():
    """Test all API endpoints"""
    print("🧪 Testing API endpoints...")
    
    tests = [
        ('Health Check', 'GET', '/api/v1/health'),
        ('Get Status', 'GET', '/api/v1/status'),
        ('Get Personas', 'GET', '/api/v1/personas'),
        ('Set Kevin Persona', 'POST', '/api/v1/personas/kevin_head_of_data'),
        ('Get Activities', 'GET', '/api/v1/activities'),
    ]
    
    results = []
    
    for name, method, endpoint in tests:
        try:
            url = f"{API_BASE}{endpoint}"
            
            if method == 'GET':
                response = requests.get(url, timeout=10)
            elif method == 'POST':
                response = requests.post(url, timeout=10)
            
            if response.status_code == 200:
                print(f"✅ {name}: {response.status_code}")
                results.append((name, True, response.status_code))
            else:
                print(f"❌ {name}: {response.status_code}")
                results.append((name, False, response.status_code))
                
        except Exception as e:
            print(f"❌ {name}: {str(e)}")
            results.append((name, False, str(e)))
    
    return results

def test_schedule_generation():
    """Test schedule generation"""
    print("\n📅 Testing schedule generation...")
    
    schedule_data = {
        "start_date": "2024-01-15",
        "duration": "1 week",
        "schedule_type": "integrated",
        "focus_areas": []
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/api/v1/schedule",
            json=schedule_data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            time_slots = result.get('schedule', {}).get('time_slots', [])
            print(f"✅ Schedule generation: {len(time_slots)} activities generated")
            return True, result
        else:
            print(f"❌ Schedule generation failed: {response.status_code}")
            return False, None
            
    except Exception as e:
        print(f"❌ Schedule generation error: {str(e)}")
        return False, None

def main():
    """Main test function"""
    print("🎯 LifePlanner UI Phase 1 - Test Suite")
    print("=" * 50)
    
    # Test API endpoints
    api_results = test_api_endpoints()
    
    # Test schedule generation
    schedule_success, schedule_data = test_schedule_generation()
    
    # Summary
    print("\n📊 Test Summary:")
    print("-" * 30)
    
    api_passed = sum(1 for _, success, _ in api_results if success)
    api_total = len(api_results)
    
    print(f"API Endpoints: {api_passed}/{api_total} passed")
    print(f"Schedule Generation: {'✅ Passed' if schedule_success else '❌ Failed'}")
    
    if schedule_success and schedule_data:
        time_slots = schedule_data.get('schedule', {}).get('time_slots', [])
        print(f"Sample Schedule: {len(time_slots)} activities generated")
    
    print("\n🌐 Ready to test in browser!")
    print(f"Main UI: {API_BASE}")
    print(f"Simple UI: {API_BASE}/simple_index.html")
    
    # Optionally open browser
    try:
        webbrowser.open(f"{API_BASE}")
        print("🚀 Opened browser automatically")
    except:
        print("💡 Please open the URL manually in your browser")

if __name__ == "__main__":
    main()

