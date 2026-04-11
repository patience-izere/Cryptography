"""
Production WSGI entry point for Gunicorn
Usage: gunicorn wsgi:app
"""

import os
from app import app

if __name__ == "__main__":
    app.run()
