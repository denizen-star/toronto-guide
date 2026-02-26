#!/usr/bin/env python3
"""
LifePlanner Setup Script
"""

import os
import sys
import subprocess
from pathlib import Path


def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False


def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    return True


def create_directories():
    """Create necessary directories"""
    directories = [
        "data",
        "logs",
        "output",
        "tests/unit",
        "tests/integration",
        "tests/performance",
        "tests/fixtures"
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"✅ Created directory: {directory}")


def install_dependencies():
    """Install Python dependencies"""
    if not run_command("pip install -r requirements.txt", "Installing dependencies"):
        return False
    return True


def setup_git_hooks():
    """Setup git hooks for code quality"""
    hooks_dir = Path(".git/hooks")
    if hooks_dir.exists():
        # Pre-commit hook
        pre_commit_hook = """#!/bin/sh
# Run code quality checks
echo "Running code quality checks..."
black --check src/
flake8 src/
mypy src/
"""
        with open(hooks_dir / "pre-commit", "w") as f:
            f.write(pre_commit_hook)
        os.chmod(hooks_dir / "pre-commit", 0o755)
        print("✅ Git hooks configured")


def run_initial_tests():
    """Run initial tests to verify setup"""
    if not run_command("python -m pytest tests/ -v", "Running initial tests"):
        print("⚠️ Some tests failed, but setup can continue")
    return True


def create_sample_data():
    """Create sample data if it doesn't exist"""
    data_dir = Path("data")
    if not (data_dir / "personas.json").exists():
        print("📝 Creating sample data...")
        # The application will create default data on first run
        print("✅ Sample data will be created on first run")


def main():
    """Main setup function"""
    print("🎯 LifePlanner Setup")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        return 1
    
    # Create directories
    create_directories()
    
    # Install dependencies
    if not install_dependencies():
        print("❌ Setup failed during dependency installation")
        return 1
    
    # Setup git hooks
    setup_git_hooks()
    
    # Create sample data
    create_sample_data()
    
    # Run initial tests
    run_initial_tests()
    
    print("\n🎉 Setup completed successfully!")
    print("\nNext steps:")
    print("1. Run the configuration wizard: python -m src.features.configuration.configuration_wizard")
    print("2. Generate a sample schedule: python -m src.cli.life_planner_cli generate --start-date 2024-01-15 --duration '1 week'")
    print("3. Check the documentation: docs/")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())

