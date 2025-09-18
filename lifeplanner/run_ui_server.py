#!/usr/bin/env python3
"""
Simple script to run the UI server on a different port
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import and modify the ui_server
from ui_server import app

if __name__ == '__main__':
    port = 8081  # Different port
    print("🚀 Starting LifePlanner UI Server...")
    print(f"📁 Serving UI from: {os.path.abspath('ui')}")
    print(f"🔗 Backend API: http://localhost:5000")
    print()
    print("🌐 Access the application at:")
    print(f"   Main UI: http://localhost:{port}")
    print(f"   Simple Index: http://localhost:{port}/simple_index.html")
    print(f"   Test Page: http://localhost:{port}/test")
    print(f"   API Docs: http://localhost:{port}/api/v1/docs")
    print()
    
    app.run(host='0.0.0.0', port=port, debug=True)

