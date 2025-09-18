#!/usr/bin/env python3
"""
Kevin's Time Allocation Tuner
Interactive system to adjust time percentages and automatically refactor the schedule
"""

import json
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional
from datetime import datetime, timedelta


@dataclass
class TimeAllocation:
    """Time allocation configuration for different activity categories"""
    # Core Requirements (Fixed - cannot be adjusted)
    work_hours_per_week: float = 45.0
    morning_routine_hours_per_week: float = 21.0
    evening_wind_down_hours_per_week: float = 7.0
    commute_hours_per_week: float = 1.7
    
    # Adjustable Categories (as percentages of remaining time)
    individual_activities_percent: float = 16.0
    networking_social_percent: float = 21.6
    couple_activities_percent: float = 23.8
    
    # Individual Activities Breakdown (as percentages of individual time)
    running_percent: float = 27.0  # 5.0h out of 18.5h
    personal_development_percent: float = 19.0  # 3.5h out of 18.5h
    fitness_grooming_percent: float = 35.0  # 6.5h out of 18.5h
    reflection_planning_percent: float = 19.0  # 3.5h out of 18.5h
    
    # Networking/Social Breakdown (as percentages of networking time)
    professional_networking_percent: float = 24.0  # 6.0h out of 25.0h
    social_activities_percent: float = 50.0  # 12.5h out of 25.0h
    professional_dev_networking_percent: float = 18.0  # 4.5h out of 25.0h
    other_social_percent: float = 8.0  # 2.0h out of 25.0h
    
    # Couple Activities Breakdown (as percentages of couple time)
    daily_meals_percent: float = 29.0  # 8.0h out of 27.5h
    evening_together_percent: float = 25.0  # 7.0h out of 27.5h
    weekend_activities_percent: float = 25.0  # 7.0h out of 27.5h
    breakfast_together_percent: float = 13.0  # 3.5h out of 27.5h
    household_together_percent: float = 8.0  # 2.0h out of 27.5h


class TimeAllocationTuner:
    """Main class for tuning time allocations and generating schedules"""
    
    def __init__(self):
        self.total_weekly_hours = 115.5  # 16.5 hours/day × 7 days
        self.allocation = TimeAllocation()
        self.schedule_generator = None
    
    def calculate_available_time(self) -> float:
        """Calculate time available for adjustable categories"""
        fixed_time = (
            self.allocation.work_hours_per_week +
            self.allocation.morning_routine_hours_per_week +
            self.allocation.evening_wind_down_hours_per_week +
            self.allocation.commute_hours_per_week
        )
        return self.total_weekly_hours - fixed_time
    
    def calculate_category_hours(self) -> Dict[str, float]:
        """Calculate actual hours for each category based on percentages"""
        available_time = self.calculate_available_time()
        
        # Normalize percentages to ensure they add up to 100%
        total_adjustable_percent = (
            self.allocation.individual_activities_percent +
            self.allocation.networking_social_percent +
            self.allocation.couple_activities_percent
        )
        
        if total_adjustable_percent == 0:
            return {}
        
        # Calculate hours for each category
        individual_hours = (available_time * self.allocation.individual_activities_percent) / total_adjustable_percent
        networking_hours = (available_time * self.allocation.networking_social_percent) / total_adjustable_percent
        couple_hours = (available_time * self.allocation.couple_activities_percent) / total_adjustable_percent
        
        return {
            'individual_activities': individual_hours,
            'networking_social': networking_hours,
            'couple_activities': couple_hours
        }
    
    def calculate_detailed_breakdown(self) -> Dict[str, Dict[str, float]]:
        """Calculate detailed breakdown of all activities"""
        category_hours = self.calculate_category_hours()
        
        # Individual activities breakdown
        individual_hours = category_hours.get('individual_activities', 0)
        individual_breakdown = {
            'running': (individual_hours * self.allocation.running_percent) / 100,
            'personal_development': (individual_hours * self.allocation.personal_development_percent) / 100,
            'fitness_grooming': (individual_hours * self.allocation.fitness_grooming_percent) / 100,
            'reflection_planning': (individual_hours * self.allocation.reflection_planning_percent) / 100,
        }
        
        # Networking/Social breakdown
        networking_hours = category_hours.get('networking_social', 0)
        networking_breakdown = {
            'professional_networking': (networking_hours * self.allocation.professional_networking_percent) / 100,
            'social_activities': (networking_hours * self.allocation.social_activities_percent) / 100,
            'professional_dev_networking': (networking_hours * self.allocation.professional_dev_networking_percent) / 100,
            'other_social': (networking_hours * self.allocation.other_social_percent) / 100,
        }
        
        # Couple activities breakdown
        couple_hours = category_hours.get('couple_activities', 0)
        couple_breakdown = {
            'daily_meals': (couple_hours * self.allocation.daily_meals_percent) / 100,
            'evening_together': (couple_hours * self.allocation.evening_together_percent) / 100,
            'weekend_activities': (couple_hours * self.allocation.weekend_activities_percent) / 100,
            'breakfast_together': (couple_hours * self.allocation.breakfast_together_percent) / 100,
            'household_together': (couple_hours * self.allocation.household_together_percent) / 100,
        }
        
        return {
            'individual_activities': individual_breakdown,
            'networking_social': networking_breakdown,
            'couple_activities': couple_breakdown
        }
    
    def update_allocation(self, **kwargs):
        """Update allocation percentages"""
        for key, value in kwargs.items():
            if hasattr(self.allocation, key):
                setattr(self.allocation, key, value)
    
    def get_allocation_summary(self) -> Dict:
        """Get complete allocation summary with hours and percentages"""
        category_hours = self.calculate_category_hours()
        detailed_breakdown = self.calculate_detailed_breakdown()
        
        # Calculate total percentages
        total_individual = sum(detailed_breakdown['individual_activities'].values())
        total_networking = sum(detailed_breakdown['networking_social'].values())
        total_couple = sum(detailed_breakdown['couple_activities'].values())
        
        return {
            'total_weekly_hours': self.total_weekly_hours,
            'fixed_time': (
                self.allocation.work_hours_per_week +
                self.allocation.morning_routine_hours_per_week +
                self.allocation.evening_wind_down_hours_per_week +
                self.allocation.commute_hours_per_week
            ),
            'available_time': self.calculate_available_time(),
            'categories': {
                'individual_activities': {
                    'hours': total_individual,
                    'percentage': (total_individual / self.total_weekly_hours) * 100,
                    'breakdown': detailed_breakdown['individual_activities']
                },
                'networking_social': {
                    'hours': total_networking,
                    'percentage': (total_networking / self.total_weekly_hours) * 100,
                    'breakdown': detailed_breakdown['networking_social']
                },
                'couple_activities': {
                    'hours': total_couple,
                    'percentage': (total_couple / self.total_weekly_hours) * 100,
                    'breakdown': detailed_breakdown['couple_activities']
                }
            }
        }
    
    def export_allocation(self, filename: str = None) -> str:
        """Export current allocation to JSON file"""
        if filename is None:
            filename = f"time_allocation_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        data = {
            'allocation': asdict(self.allocation),
            'summary': self.get_allocation_summary(),
            'exported_at': datetime.now().isoformat()
        }
        
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
        
        return filename
    
    def import_allocation(self, filename: str):
        """Import allocation from JSON file"""
        with open(filename, 'r') as f:
            data = json.load(f)
        
        allocation_data = data['allocation']
        for key, value in allocation_data.items():
            if hasattr(self.allocation, key):
                setattr(self.allocation, key, value)
    
    def print_allocation_report(self):
        """Print a detailed allocation report"""
        summary = self.get_allocation_summary()
        
        print("🎯 KEVIN'S TIME ALLOCATION REPORT")
        print("=" * 60)
        print(f"Total Weekly Hours: {summary['total_weekly_hours']:.1f}")
        print(f"Fixed Time (Work + Routines): {summary['fixed_time']:.1f}h ({(summary['fixed_time']/summary['total_weekly_hours'])*100:.1f}%)")
        print(f"Available for Tuning: {summary['available_time']:.1f}h ({(summary['available_time']/summary['total_weekly_hours'])*100:.1f}%)")
        print()
        
        for category, data in summary['categories'].items():
            print(f"📊 {category.upper().replace('_', ' ')}:")
            print(f"   Total: {data['hours']:.1f}h ({data['percentage']:.1f}%)")
            for activity, hours in data['breakdown'].items():
                activity_percent = (hours / data['hours']) * 100 if data['hours'] > 0 else 0
                print(f"   • {activity.replace('_', ' ').title()}: {hours:.1f}h ({activity_percent:.1f}%)")
            print()
    
    def generate_schedule_parameters(self) -> Dict:
        """Generate parameters for the schedule generator"""
        summary = self.get_allocation_summary()
        
        # Convert weekly hours to daily activities
        daily_individual = summary['categories']['individual_activities']['hours'] / 7
        daily_networking = summary['categories']['networking_social']['hours'] / 7
        daily_couple = summary['categories']['couple_activities']['hours'] / 7
        
        return {
            'daily_individual_hours': daily_individual,
            'daily_networking_hours': daily_networking,
            'daily_couple_hours': daily_couple,
            'weekly_breakdown': summary['categories'],
            'allocation_config': asdict(self.allocation)
        }


def main():
    """Demo the time allocation tuner"""
    tuner = TimeAllocationTuner()
    
    print("🎛️ TIME ALLOCATION TUNER DEMO")
    print("=" * 50)
    print()
    
    # Show current allocation
    print("📊 CURRENT ALLOCATION:")
    tuner.print_allocation_report()
    
    # Demo: Adjust percentages
    print("🔧 ADJUSTING ALLOCATIONS...")
    print("Increasing couple time and decreasing individual time...")
    print()
    
    # Update allocations
    tuner.update_allocation(
        individual_activities_percent=12.0,  # Decrease from 16.0%
        couple_activities_percent=28.0,      # Increase from 23.8%
        networking_social_percent=21.6       # Keep same
    )
    
    print("📊 UPDATED ALLOCATION:")
    tuner.print_allocation_report()
    
    # Export configuration
    filename = tuner.export_allocation()
    print(f"💾 Configuration exported to: {filename}")
    
    # Generate schedule parameters
    params = tuner.generate_schedule_parameters()
    print("\n🎯 SCHEDULE GENERATOR PARAMETERS:")
    print(f"Daily Individual Hours: {params['daily_individual_hours']:.1f}")
    print(f"Daily Networking Hours: {params['daily_networking_hours']:.1f}")
    print(f"Daily Couple Hours: {params['daily_couple_hours']:.1f}")


if __name__ == "__main__":
    main()

