#!/usr/bin/env python3
"""
Setup script for the portfolio backend
"""

import os
import subprocess
import sys

def install_requirements():
    """Install Python requirements"""
    print("Installing Python requirements...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

def create_env_file():
    """Create .env file if it doesn't exist"""
    if not os.path.exists('.env'):
        print("Creating .env file...")
        with open('.env', 'w') as f:
            f.write("SENDER_EMAIL=your-gmail@gmail.com\n")
            f.write("SENDER_PASSWORD=your-app-password\n")
            f.write("RECIPIENT_EMAIL=donghyeunlee1@gmail.com\n")
        print("Please update the .env file with your email credentials!")
    else:
        print(".env file already exists")

def initialize_database():
    """Initialize the database"""
    print("Initializing database...")
    from app import init_db
    init_db()
    print("Database initialized successfully!")

def main():
    print("Setting up Portfolio Backend...")
    
    try:
        install_requirements()
        create_env_file()
        initialize_database()
        
        print("\n✅ Setup completed successfully!")
        print("\nNext steps:")
        print("1. Update the .env file with your email credentials")
        print("2. Run: python app.py")
        print("3. Your backend will be available at http://localhost:5000")
        
    except Exception as e:
        print(f"\n❌ Setup failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()