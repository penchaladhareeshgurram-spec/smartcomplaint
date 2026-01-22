#!/usr/bin/env python3
"""
Simple HTTP Server for Smart Complaint System
Run this script to start the development server
"""

import http.server
import socketserver
import os
from pathlib import Path

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add headers to prevent caching during development
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Expires', '0')
        return super().end_headers()

if __name__ == "__main__":
    # Change to project directory
    os.chdir(Path(__file__).parent)
    
    # Create server
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🚀 Server running at http://localhost:{PORT}")
        print(f"📂 Serving from: {Path.cwd()}")
        print(f"\n🔗 Quick Links:")
        print(f"   Landing:     http://localhost:{PORT}")
        print(f"   Login:       http://localhost:{PORT}/login.html")
        print(f"   User Demo:   http://localhost:{PORT}/user-dashboard.html")
        print(f"   Admin Demo:  http://localhost:{PORT}/admin-dashboard.html")
        print(f"\n📝 Demo Credentials:")
        print(f"   User: john@example.com / password123")
        print(f"   Admin: admin@smartcomplaint.com / admin123456")
        print(f"\n💡 Tips:")
        print(f"   - Open DevTools (F12) to see console")
        print(f"   - Check Application > Local Storage for data")
        print(f"   - Press Ctrl+C to stop server")
        print()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n✓ Server stopped")
