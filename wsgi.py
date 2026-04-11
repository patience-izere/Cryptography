"""
Production WSGI entry point for Gunicorn
Usage: gunicorn wsgi:application
"""

import os
from app import app

# Standard WSGI entry point name expected by hosting platforms
application = app

if __name__ == "__main__":
    app.run()
