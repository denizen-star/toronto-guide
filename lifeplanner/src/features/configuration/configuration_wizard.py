"""
Interactive configuration wizard for LifePlanner
"""

import json
from typing import Dict, Any, List
from pathlib import Path

from .settings import AppSettings
from .configuration_service import ConfigurationService


class ConfigurationWizard:
    """Interactive wizard for setting up LifePlanner configuration"""
    
    def __init__(self, config_file: str = "data/settings.json"):
        self.config_service = ConfigurationService(config_file)
        self.settings = self.config_service.load_settings()
    
    def run(self) -> bool:
        """Run the configuration wizard"""
        print("🎯 LifePlanner Configuration Wizard")
        print("=" * 50)
        print("Let's set up your LifePlanner configuration!")
        print()
        
        try:
            # Basic information
            self._configure_basic_info()
            
            # Schedule preferences
            self._configure_schedule_preferences()
            
            # Budget settings
            self._configure_budget_settings()
            
            # Core requirements
            self._configure_core_requirements()
            
            # Save configuration
            success = self.config_service.save_settings(self.settings)
            
            if success:
                print("\n✅ Configuration saved successfully!")
                print(f"📁 Configuration file: {self.config_service.config_file}")
                return True
            else:
                print("\n❌ Failed to save configuration")
                return False
                
        except KeyboardInterrupt:
            print("\n\n⚠️ Configuration cancelled by user")
            return False
        except Exception as e:
            print(f"\n❌ Error during configuration: {e}")
            return False
    
    def _configure_basic_info(self):
        """Configure basic user information"""
        print("👤 Basic Information")
        print("-" * 30)
        
        # User name
        current_name = self.settings.user_name
        user_name = input(f"Your name [{current_name}]: ").strip()
        if user_name:
            self.settings.user_name = user_name
        
        # Partner name
        current_partner = self.settings.partner_name
        partner_name = input(f"Partner's name [{current_partner}]: ").strip()
        if partner_name:
            self.settings.partner_name = partner_name
        
        print()
    
    def _configure_schedule_preferences(self):
        """Configure schedule preferences"""
        print("⏰ Schedule Preferences")
        print("-" * 30)
        
        # Morning start time
        current_morning = self.settings.morning_start
        morning_start = input(f"Morning start time (e.g., 6:00 AM) [{current_morning}]: ").strip()
        if morning_start:
            self.settings.morning_start = morning_start
        
        # Bedtime
        current_bedtime = self.settings.bedtime
        bedtime = input(f"Bedtime (e.g., 10:30 PM) [{current_bedtime}]: ").strip()
        if bedtime:
            self.settings.bedtime = bedtime
        
        print()
    
    def _configure_budget_settings(self):
        """Configure budget settings"""
        print("💰 Budget Settings")
        print("-" * 30)
        
        # Daily budget
        current_daily = self.settings.max_daily_budget
        daily_budget = input(f"Maximum daily budget (CAD) [{current_daily}]: ").strip()
        if daily_budget:
            try:
                self.settings.max_daily_budget = float(daily_budget)
            except ValueError:
                print("⚠️ Invalid budget amount, keeping current value")
        
        # Weekly budget
        current_weekly = self.settings.max_weekly_budget
        weekly_budget = input(f"Maximum weekly budget (CAD) [{current_weekly}]: ").strip()
        if weekly_budget:
            try:
                self.settings.max_weekly_budget = float(weekly_budget)
            except ValueError:
                print("⚠️ Invalid budget amount, keeping current value")
        
        print()
    
    def _configure_core_requirements(self):
        """Configure core requirements"""
        print("🎯 Core Requirements")
        print("-" * 30)
        print("Let's set up your core requirements. Press Enter to skip any requirement.")
        print()
        
        # Work hours
        self._configure_work_hours()
        
        # Fitness routine
        self._configure_fitness_routine()
        
        # Other requirements
        self._configure_other_requirements()
        
        print()
    
    def _configure_work_hours(self):
        """Configure work hours"""
        print("💼 Work Hours")
        
        # Work start time
        current_start = self.settings.core_requirements.get('work_hours', {}).get('start', '9:00 AM')
        work_start = input(f"Work start time [{current_start}]: ").strip()
        
        # Work end time
        current_end = self.settings.core_requirements.get('work_hours', {}).get('end', '6:00 PM')
        work_end = input(f"Work end time [{current_end}]: ").strip()
        
        # Work days
        current_days = self.settings.core_requirements.get('work_hours', {}).get('days', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
        work_days_input = input(f"Work days (comma-separated) [{', '.join(current_days)}]: ").strip()
        
        if work_start or work_end or work_days_input:
            if 'work_hours' not in self.settings.core_requirements:
                self.settings.core_requirements['work_hours'] = {}
            
            if work_start:
                self.settings.core_requirements['work_hours']['start'] = work_start
            if work_end:
                self.settings.core_requirements['work_hours']['end'] = work_end
            if work_days_input:
                work_days = [day.strip() for day in work_days_input.split(',')]
                self.settings.core_requirements['work_hours']['days'] = work_days
        
        print()
    
    def _configure_fitness_routine(self):
        """Configure fitness routine"""
        print("🏃 Fitness Routine")
        
        # Running schedule
        print("Running schedule (enter minutes for each day, 0 to skip):")
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        running_schedule = {}
        
        for day in days:
            current_minutes = self.settings.core_requirements.get('running', {}).get('schedule', {}).get(day, 0)
            minutes = input(f"{day} [{current_minutes}]: ").strip()
            if minutes:
                try:
                    running_schedule[day] = int(minutes)
                except ValueError:
                    print("⚠️ Invalid minutes, skipping")
        
        if running_schedule:
            if 'running' not in self.settings.core_requirements:
                self.settings.core_requirements['running'] = {}
            self.settings.core_requirements['running']['schedule'] = running_schedule
        
        print()
    
    def _configure_other_requirements(self):
        """Configure other requirements"""
        print("📚 Other Requirements")
        
        # Professional development
        current_pd = self.settings.core_requirements.get('professional_development', {}).get('hours_per_week', 5)
        pd_hours = input(f"Professional development hours per week [{current_pd}]: ").strip()
        if pd_hours:
            try:
                if 'professional_development' not in self.settings.core_requirements:
                    self.settings.core_requirements['professional_development'] = {}
                self.settings.core_requirements['professional_development']['hours_per_week'] = int(pd_hours)
            except ValueError:
                print("⚠️ Invalid hours, keeping current value")
        
        # Immigration work
        current_immigration = self.settings.core_requirements.get('immigration_work', {}).get('hours_per_week', 3)
        immigration_hours = input(f"Immigration work hours per week [{current_immigration}]: ").strip()
        if immigration_hours:
            try:
                if 'immigration_work' not in self.settings.core_requirements:
                    self.settings.core_requirements['immigration_work'] = {}
                self.settings.core_requirements['immigration_work']['hours_per_week'] = int(immigration_hours)
            except ValueError:
                print("⚠️ Invalid hours, keeping current value")
        
        print()
    
    def show_current_config(self):
        """Show current configuration"""
        print("📋 Current Configuration")
        print("=" * 50)
        print(f"User Name: {self.settings.user_name}")
        print(f"Partner Name: {self.settings.partner_name}")
        print(f"Morning Start: {self.settings.morning_start}")
        print(f"Bedtime: {self.settings.bedtime}")
        print(f"Max Daily Budget: ${self.settings.max_daily_budget}")
        print(f"Max Weekly Budget: ${self.settings.max_weekly_budget}")
        print()
        print("Core Requirements:")
        for key, value in self.settings.core_requirements.items():
            print(f"  {key}: {value}")
        print()
    
    def reset_to_defaults(self) -> bool:
        """Reset configuration to defaults"""
        print("⚠️ This will reset all configuration to defaults. Are you sure? (y/N): ", end="")
        confirm = input().strip().lower()
        
        if confirm in ['y', 'yes']:
            self.settings = AppSettings()
            success = self.config_service.save_settings(self.settings)
            if success:
                print("✅ Configuration reset to defaults")
                return True
            else:
                print("❌ Failed to reset configuration")
                return False
        else:
            print("Configuration reset cancelled")
            return False


def main():
    """Main entry point for configuration wizard"""
    wizard = ConfigurationWizard()
    
    print("Choose an option:")
    print("1. Run configuration wizard")
    print("2. Show current configuration")
    print("3. Reset to defaults")
    print("4. Exit")
    
    choice = input("\nEnter your choice (1-4): ").strip()
    
    if choice == '1':
        wizard.run()
    elif choice == '2':
        wizard.show_current_config()
    elif choice == '3':
        wizard.reset_to_defaults()
    elif choice == '4':
        print("Goodbye!")
    else:
        print("Invalid choice")


if __name__ == "__main__":
    main()

