#!/usr/bin/env python3
"""
Startup script for Dual Kevin LifePlanner System
Starts both the original system (port 8080) and dual system (port 8082)
"""

import subprocess
import time
import webbrowser
import sys
import os

def start_dual_kevin_system():
    """Start both Kevin systems"""
    
    print("🚀 STARTING DUAL KEVIN LIFEPLANNER SYSTEM")
    print("=" * 60)
    
    try:
        # Start original system on port 8080 (for Working Kevin sliders)
        print("📡 Starting Working Kevin system (port 8080)...")
        original_process = subprocess.Popen([
            sys.executable, 'start_slider_ui.py'
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Wait a moment for it to start
        time.sleep(2)
        
        # Start dual system on port 8082
        print("📡 Starting Dual Kevin dashboard (port 8082)...")
        dual_process = subprocess.Popen([
            sys.executable, 'dual_kevin_app.py'
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Wait for systems to start
        time.sleep(3)
        
        # Display completion message from file to avoid echo issues
        try:
            with open('completion_message.txt', 'r') as f:
                print(f.read())
        except FileNotFoundError:
            print("DUAL KEVIN SYSTEM STARTED SUCCESSFULLY!")
            print("Visit http://localhost:8082 to access your dual LifePlanner")
        print("")
        
        # Open main dashboard
        print("Opening main dashboard...")
        webbrowser.open('http://localhost:8082')
        
        print("TIP: Keep this terminal window open to keep servers running")
        print("Press Ctrl+C to stop both servers")
        
        # Wait for user to stop
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 Stopping Dual Kevin system...")
            original_process.terminate()
            dual_process.terminate()
            print("✅ All servers stopped. Goodbye!")
            
    except Exception as e:
        print(f"❌ Error starting Dual Kevin system: {e}")
        return False
    
    return True

if __name__ == "__main__":
    start_dual_kevin_system()
