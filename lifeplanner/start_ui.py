#!/usr/bin/env python3
"""
Startup script for Kevin's Time Allocation Tuner Web UI
"""

import subprocess
import sys
import time
import webbrowser
from threading import Timer

def open_browser():
    """Open browser after a short delay"""
    time.sleep(2)
    webbrowser.open('http://localhost:8080')

def main():
    print("🎛️ KEVIN'S TIME ALLOCATION TUNER")
    print("=" * 50)
    print("🚀 Starting web application...")
    print("📱 The UI will open in your browser automatically")
    print("🔗 Manual access: http://localhost:8080")
    print("⏹️  Press Ctrl+C to stop the server")
    print("=" * 50)
    
    # Open browser after delay
    Timer(2.0, open_browser).start()
    
    try:
        # Start Flask app
        subprocess.run([sys.executable, 'app.py'])
    except KeyboardInterrupt:
        print("\n👋 Shutting down...")
        sys.exit(0)

if __name__ == "__main__":
    main()
