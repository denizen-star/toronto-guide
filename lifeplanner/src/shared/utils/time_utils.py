"""
Time utilities for scheduling and time calculations
"""

from typing import List, Tuple
from datetime import datetime, timedelta


class TimeUtils:
    """Utility class for time-related operations"""
    
    @staticmethod
    def time_to_minutes(time_str: str) -> int:
        """Convert time string to minutes since midnight"""
        time_str = time_str.replace(" AM", "").replace(" PM", "")
        hour, minute = map(int, time_str.split(":"))
        
        if "PM" in time_str and hour != 12:
            hour += 12
        elif "AM" in time_str and hour == 12:
            hour = 0
        
        return hour * 60 + minute
    
    @staticmethod
    def minutes_to_time(minutes: int) -> str:
        """Convert minutes since midnight to time string"""
        hour = minutes // 60
        minute = minutes % 60
        
        period = "AM" if hour < 12 else "PM"
        if hour > 12:
            hour -= 12
        elif hour == 0:
            hour = 12
        
        return f"{hour}:{minute:02d} {period}"
    
    @staticmethod
    def calculate_end_time(start_time: str, duration_hours: float) -> str:
        """Calculate end time based on start time and duration"""
        start_minutes = TimeUtils.time_to_minutes(start_time)
        end_minutes = start_minutes + int(duration_hours * 60)
        
        # Handle day overflow
        if end_minutes >= 1440:  # 24 hours = 1440 minutes
            end_minutes = end_minutes % 1440
        
        return TimeUtils.minutes_to_time(end_minutes)
    
    @staticmethod
    def has_time_conflict(slot1_start: str, slot1_end: str, 
                         slot2_start: str, slot2_end: str) -> bool:
        """Check if two time slots conflict"""
        start1 = TimeUtils.time_to_minutes(slot1_start)
        end1 = TimeUtils.time_to_minutes(slot1_end)
        start2 = TimeUtils.time_to_minutes(slot2_start)
        end2 = TimeUtils.time_to_minutes(slot2_end)
        
        # Check for overlap
        return not (end1 <= start2 or start1 >= end2)
    
    @staticmethod
    def sort_time_slots(time_slots: List) -> List:
        """Sort time slots by start time"""
        return sorted(time_slots, key=lambda x: TimeUtils.time_to_minutes(x.start_time))
    
    @staticmethod
    def resolve_time_conflicts(time_slots: List) -> List:
        """Resolve time conflicts by adjusting times"""
        if len(time_slots) <= 1:
            return time_slots
        
        resolved_slots = [time_slots[0]]
        
        for i in range(1, len(time_slots)):
            current_slot = time_slots[i]
            prev_slot = resolved_slots[-1]
            
            current_start = TimeUtils.time_to_minutes(current_slot.start_time)
            prev_end = TimeUtils.time_to_minutes(prev_slot.end_time)
            
            # If there's a conflict, adjust the current slot's start time
            if current_start < prev_end:
                # Move current slot to start after previous slot ends
                new_start_minutes = prev_end + 15  # Add 15-minute buffer
                current_slot.start_time = TimeUtils.minutes_to_time(new_start_minutes)
                current_slot.end_time = TimeUtils.calculate_end_time(
                    current_slot.start_time, 
                    current_slot.activity.duration_hours
                )
            
            resolved_slots.append(current_slot)
        
        return resolved_slots
    
    @staticmethod
    def get_duration_days(start_date: str, duration: str) -> int:
        """Get number of days for a given duration"""
        duration_map = {
            "1 week": 7,
            "2 weeks": 14,
            "1 month": 30,
            "3 months": 90,
            "6 months": 180
        }
        return duration_map.get(duration, 7)
    
    @staticmethod
    def is_weekend(date: datetime) -> bool:
        """Check if a date is a weekend"""
        return date.weekday() >= 5
    
    @staticmethod
    def get_day_name(date: datetime) -> str:
        """Get day name from date"""
        return date.strftime('%A')
    
    @staticmethod
    def format_date_key(day_num: int, date: datetime) -> str:
        """Format date key for schedule"""
        return f"Day {day_num}: {date.strftime('%A, %B %d, %Y')}"

