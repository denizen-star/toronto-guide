#!/usr/bin/env python3
"""
Start the Time Allocation Slider UI
Simple script to start the Flask server for the time allocation tuner
"""

import os
import sys
import webbrowser
import time
from threading import Timer

def open_browser():
    """Open browser to the UI after a short delay"""
    webbrowser.open('http://localhost:8080')

def main():
    """Start the Flask server and open browser"""
    print("🎛️ STARTING KEVIN'S TIME ALLOCATION SLIDER UI")
    print("=" * 60)
    print()
    print("🔧 Starting Flask server...")
    print("📱 Will open browser automatically in 3 seconds...")
    print("🌐 Manual URL: http://localhost:8080")
    print()
    print("💡 To stop: Press CTRL+C")
    print("=" * 60)
    
    # Open browser after 3 seconds
    Timer(3.0, open_browser).start()
    
    # Start Flask app
    os.system("python3 app.py")

if __name__ == "__main__":
    main()
