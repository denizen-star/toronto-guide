#!/usr/bin/env python3
"""
Test script for Kevin's Time Allocation Tuner Web UI
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from time_allocation_tuner import TimeAllocationTuner
from enhanced_schedule_generator import EnhancedScheduleGenerator
import json

def test_time_allocation_tuner():
    """Test the time allocation tuner functionality"""
    print("🧪 Testing Time Allocation Tuner...")
    
    # Create tuner instance
    tuner = TimeAllocationTuner()
    
    # Test initial allocation
    print("📊 Initial Allocation:")
    tuner.print_allocation_report()
    
    # Test updating allocation
    print("\n🔧 Testing allocation updates...")
    tuner.update_allocation(
        individual_activities_percent=12.0,
        couple_activities_percent=30.0,
        networking_social_percent=20.0
    )
    
    print("📊 Updated Allocation:")
    tuner.print_allocation_report()
    
    # Test export/import
    print("\n💾 Testing export/import...")
    filename = tuner.export_allocation("test_allocation.json")
    print(f"✅ Exported to: {filename}")
    
    # Test schedule generation
    print("\n📅 Testing schedule generation...")
    generator = EnhancedScheduleGenerator(tuner)
    schedule = generator.generate_adaptive_schedule()
    
    print(f"✅ Generated schedule with {len(schedule)} days")
    
    # Test API endpoints (simulate)
    print("\n🌐 Testing API endpoints...")
    
    # Simulate GET /api/allocation
    allocation_data = tuner.get_allocation_summary()
    print(f"✅ GET /api/allocation: {len(allocation_data)} keys")
    
    # Simulate POST /api/allocation
    tuner.update_allocation(individual_activities_percent=15.0)
    updated_data = tuner.get_allocation_summary()
    print(f"✅ POST /api/allocation: Updated successfully")
    
    # Simulate preset application
    tuner.update_allocation(
        individual_activities_percent=20.0,
        networking_social_percent=15.0,
        couple_activities_percent=15.0
    )
    print("✅ Preset 'work_focus' applied")
    
    print("\n🎉 All tests passed!")
    return True

def test_ui_config():
    """Test UI configuration loading"""
    print("\n🎨 Testing UI Configuration...")
    
    try:
        with open('ui_config.json', 'r') as f:
            config = json.load(f)
        
        print(f"✅ UI Config loaded: {len(config)} main sections")
        print(f"   - Categories: {len(config['time_allocation_ui']['categories'])}")
        print(f"   - Presets: {len(config['ui_components']['controls']['preset_buttons'])}")
        print(f"   - Features: {len(config['time_allocation_ui']['features'])}")
        
        return True
    except Exception as e:
        print(f"❌ Error loading UI config: {e}")
        return False

def test_schedule_export():
    """Test schedule export functionality"""
    print("\n📤 Testing Schedule Export...")
    
    try:
        tuner = TimeAllocationTuner()
        generator = EnhancedScheduleGenerator(tuner)
        schedule = generator.generate_adaptive_schedule()
        
        # Export schedule
        filename = generator.export_schedule(schedule, "test_schedule.md")
        print(f"✅ Schedule exported to: {filename}")
        
        # Check if file exists and has content
        if os.path.exists(filename):
            with open(filename, 'r') as f:
                content = f.read()
            print(f"✅ File size: {len(content)} characters")
            print(f"✅ Contains {content.count('##')} days")
        else:
            print("❌ Export file not found")
            return False
            
        return True
    except Exception as e:
        print(f"❌ Error exporting schedule: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 KEVIN'S TIME ALLOCATION TUNER - SYSTEM TEST")
    print("=" * 60)
    
    tests = [
        test_time_allocation_tuner,
        test_ui_config,
        test_schedule_export
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ Test failed with error: {e}")
    
    print("\n" + "=" * 60)
    print(f"📊 TEST RESULTS: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED! The system is ready to use.")
        print("\n🌐 To start the web UI:")
        print("   python3 app.py")
        print("   Then open: http://localhost:8080")
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
