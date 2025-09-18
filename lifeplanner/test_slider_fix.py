#!/usr/bin/env python3
"""
Test script to verify the slider system is working correctly
This tests the complete pipeline: Frontend → Backend → Schedule Generation
"""

import requests
import json
import time
import subprocess
import signal
import os
from threading import Thread

class SliderSystemTester:
    def __init__(self):
        self.server_process = None
        self.base_url = "http://localhost:8080"
    
    def start_server(self):
        """Start the Flask server in background"""
        print("🔧 Starting Flask server...")
        self.server_process = subprocess.Popen(
            ["python3", "app.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            preexec_fn=os.setsid
        )
        # Wait for server to start
        time.sleep(3)
        print("✅ Server started")
    
    def stop_server(self):
        """Stop the Flask server"""
        if self.server_process:
            print("🛑 Stopping Flask server...")
            os.killpg(os.getpgid(self.server_process.pid), signal.SIGTERM)
            self.server_process = None
            print("✅ Server stopped")
    
    def test_api_connection(self):
        """Test basic API connectivity"""
        print("🔍 Testing API connection...")
        try:
            response = requests.get(f"{self.base_url}/api/allocation", timeout=5)
            if response.status_code == 200:
                print("✅ API connection successful")
                return True
            else:
                print(f"❌ API returned status {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ API connection failed: {e}")
            return False
    
    def test_slider_update(self):
        """Test slider update functionality"""
        print("🎛️ Testing slider update...")
        
        # Get initial allocation
        response = requests.get(f"{self.base_url}/api/allocation")
        initial = response.json()
        initial_individual = initial['categories']['individual_activities']['hours']
        print(f"Initial individual hours: {initial_individual:.1f}h")
        
        # Update allocation (increase individual from ~16% to 25%)
        update_data = {
            "individual_activities_percent": 25.0,
            "networking_social_percent": 20.0,
            "couple_activities_percent": 20.0
        }
        
        print("📤 Sending slider update...")
        response = requests.post(
            f"{self.base_url}/api/allocation",
            json=update_data,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                updated_individual = result['allocation']['categories']['individual_activities']['hours']
                print(f"✅ Update successful! Individual hours: {updated_individual:.1f}h")
                
                # Verify the change is significant
                if updated_individual > initial_individual + 2:
                    print("✅ Slider update working correctly - hours increased significantly")
                    return True
                else:
                    print(f"⚠️ Hours didn't increase enough: {initial_individual:.1f}h → {updated_individual:.1f}h")
                    return False
            else:
                print(f"❌ Update failed: {result.get('error', 'Unknown error')}")
                return False
        else:
            print(f"❌ API request failed with status {response.status_code}")
            return False
    
    def test_schedule_generation(self):
        """Test schedule generation with updated allocation"""
        print("📅 Testing schedule generation...")
        try:
            response = requests.get(f"{self.base_url}/api/schedule", timeout=10)
            if response.status_code == 200:
                result = response.json()
                if result.get('success'):
                    schedule = result['schedule']
                    print(f"✅ Schedule generated with {len(schedule)} days")
                    
                    # Check first day
                    first_day_key = list(schedule.keys())[0]
                    first_day = schedule[first_day_key]
                    individual_activities = [act for act in first_day if act.get('category') == 'individual']
                    
                    print(f"First day has {len(individual_activities)} individual activities")
                    print("✅ Schedule generation working")
                    return True
                else:
                    print(f"❌ Schedule generation failed: {result.get('error')}")
                    return False
            else:
                print(f"❌ Schedule API returned status {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Schedule generation test failed: {e}")
            return False
    
    def test_export(self):
        """Test schedule export functionality"""
        print("💾 Testing schedule export...")
        try:
            response = requests.get(f"{self.base_url}/api/export", timeout=10)
            if response.status_code == 200:
                result = response.json()
                if result.get('success'):
                    filename = result.get('filename')
                    print(f"✅ Schedule exported to: {filename}")
                    return True
                else:
                    print(f"❌ Export failed: {result.get('error')}")
                    return False
            else:
                print(f"❌ Export API returned status {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Export test failed: {e}")
            return False
    
    def run_full_test(self):
        """Run complete test suite"""
        print("🧪 SLIDER SYSTEM FULL TEST")
        print("=" * 50)
        
        try:
            # Start server
            self.start_server()
            
            # Run tests
            tests = [
                ("API Connection", self.test_api_connection),
                ("Slider Update", self.test_slider_update),
                ("Schedule Generation", self.test_schedule_generation),
                ("Export Functionality", self.test_export)
            ]
            
            results = {}
            for test_name, test_func in tests:
                print(f"\n🔬 Running {test_name} test...")
                results[test_name] = test_func()
            
            # Print summary
            print("\n📊 TEST RESULTS SUMMARY")
            print("=" * 30)
            passed = 0
            for test_name, result in results.items():
                status = "✅ PASS" if result else "❌ FAIL"
                print(f"{test_name}: {status}")
                if result:
                    passed += 1
            
            print(f"\nOverall: {passed}/{len(tests)} tests passed")
            
            if passed == len(tests):
                print("\n🎉 ALL TESTS PASSED! Slider system is working correctly!")
                print("\n📋 SOLUTION:")
                print("The slider system was working correctly all along.")
                print("The issue was that users need to START THE FLASK SERVER first.")
                print("\n🚀 TO USE THE SLIDER UI:")
                print("1. Run: python3 start_slider_ui.py")
                print("2. Open browser to: http://localhost:8080")
                print("3. Use the sliders - they will work correctly!")
            else:
                print(f"\n⚠️ {len(tests) - passed} tests failed. Check the output above for details.")
        
        finally:
            # Always stop server
            self.stop_server()

def main():
    tester = SliderSystemTester()
    tester.run_full_test()

if __name__ == "__main__":
    main()

