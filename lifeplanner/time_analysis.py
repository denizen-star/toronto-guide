#!/usr/bin/env python3
"""
Kevin's Complete Time Breakdown Analysis
September 15 - October 15, 2025
"""

print('📊 KEVIN\'S COMPLETE TIME BREAKDOWN ANALYSIS')
print('📅 September 15 - October 15, 2025')
print('=' * 70)
print()

# Total available time per week
total_weekly_hours = 16.5 * 7  # 16.5 hours per day × 7 days
print(f'⏰ TOTAL AVAILABLE TIME PER WEEK: {total_weekly_hours} hours')
print()

# Core requirements breakdown
core_requirements = {
    'Work Hours': 9 * 5,  # 9 hours × 5 weekdays
    'Morning Routine (7 Habits)': 3 * 7,  # 3 hours × 7 days
    'Evening Wind-down': 1 * 7,  # 1 hour × 7 days
    'Commute': (20/60) * 5,  # 20 minutes × 5 weekdays
    'Running (Individual)': (1 * 3) + (2 * 1),  # 1hr × 3 days + 2hr × 1 day
    'Immigration Work': 1.5 * 2,  # 1.5 hours × 2 days
    'Professional Development': 1.5 * 3,  # 1.5 hours × 3 days
    'Grocery Shopping': 1 * 1,  # 1 hour × 1 day
    'Household Budgeting': 1 * 1,  # 1 hour × 1 day
    'Mass': 1 * 1,  # 1 hour × 1 day
}

print('🔧 CORE REQUIREMENTS BREAKDOWN:')
print('-' * 40)
total_core = 0
for activity, hours in core_requirements.items():
    percentage = (hours / total_weekly_hours) * 100
    print(f'{activity:.<30} {hours:>6.1f}h ({percentage:>5.1f}%)')
    total_core += hours

print(f'{"TOTAL CORE REQUIREMENTS":.<30} {total_core:>6.1f}h ({(total_core/total_weekly_hours)*100:>5.1f}%)')
print()

# Individual activities (non-work, non-couple)
individual_activities = {
    'Running (Solo)': (1 * 3) + (2 * 1),  # 1hr × 3 days + 2hr × 1 day
    'Personal Development (Learning)': 0.5 * 7,  # 30 min × 7 days
    'Individual Fitness (Morning Exercise)': 0.5 * 6,  # 30 min × 6 days (not Saturday)
    'Personal Grooming': 0.5 * 7,  # 30 min × 7 days
    'Individual Reflection/Planning': 0.5 * 7,  # 30 min × 7 days
}

print('🏃‍♂️ INDIVIDUAL ACTIVITIES (Non-Work, Non-Couple):')
print('-' * 50)
total_individual = 0
for activity, hours in individual_activities.items():
    percentage = (hours / total_weekly_hours) * 100
    print(f'{activity:.<40} {hours:>6.1f}h ({percentage:>5.1f}%)')
    total_individual += hours

print(f'{"TOTAL INDIVIDUAL ACTIVITIES":.<40} {total_individual:>6.1f}h ({(total_individual/total_weekly_hours)*100:>5.1f}%)')
print()

# Networking and social activities
networking_activities = {
    'Professional Networking Events': 2 * 3,  # 2 hours × 3 days (Mon, Wed, Fri)
    'Running Club (Social)': 2 * 1,  # 2 hours × 1 day (Tuesday)
    'Swimming (Social)': 2 * 1,  # 2 hours × 1 day (Thursday)
    'Tennis (Social)': 2.5 * 1,  # 2.5 hours × 1 day (Friday)
    'Art Workshop (Social)': 2 * 1,  # 2 hours × 1 day (Saturday)
    'Cooking Class (Social)': 2 * 1,  # 2 hours × 1 day (Saturday)
    'Urban Discovery (Social)': 2 * 1,  # 2 hours × 1 day (Sunday)
    'Improv Class (Social)': 2 * 1,  # 2 hours × 1 day (Sunday)
    'Professional Development (Networking)': 1.5 * 3,  # 1.5 hours × 3 days
}

print('🤝 NETWORKING & SOCIAL ACTIVITIES:')
print('-' * 40)
total_networking = 0
for activity, hours in networking_activities.items():
    percentage = (hours / total_weekly_hours) * 100
    print(f'{activity:.<30} {hours:>6.1f}h ({percentage:>5.1f}%)')
    total_networking += hours

print(f'{"TOTAL NETWORKING/SOCIAL":.<30} {total_networking:>6.1f}h ({(total_networking/total_weekly_hours)*100:>5.1f}%)')
print()

# Couple activities
couple_activities = {
    'Daily Breakfast Together': 0.5 * 7,  # 30 min × 7 days
    'Daily Dinner Together': (1 * 5) + (1.5 * 2),  # 1hr × 5 days + 1.5hr × 2 days
    'Evening Wind-down Together': 1 * 7,  # 1 hour × 7 days
    'Weekend Couple Activities': 7,  # Art + Cooking + Urban + Improv + Mass
    'Household Activities Together': 2,  # Grocery + Budgeting
}

print('💕 COUPLE ACTIVITIES:')
print('-' * 30)
total_couple = 0
for activity, hours in couple_activities.items():
    percentage = (hours / total_weekly_hours) * 100
    print(f'{activity:.<25} {hours:>6.1f}h ({percentage:>5.1f}%)')
    total_couple += hours

print(f'{"TOTAL COUPLE ACTIVITIES":.<25} {total_couple:>6.1f}h ({(total_couple/total_weekly_hours)*100:>5.1f}%)')
print()

# Summary
print('📈 WEEKLY TIME SUMMARY:')
print('=' * 50)
print(f'Total Available Time: {total_weekly_hours:.1f} hours (100.0%)')
print(f'Core Requirements: {total_core:.1f} hours ({(total_core/total_weekly_hours)*100:.1f}%)')
print(f'Individual Activities: {total_individual:.1f} hours ({(total_individual/total_weekly_hours)*100:.1f}%)')
print(f'Networking/Social: {total_networking:.1f} hours ({(total_networking/total_weekly_hours)*100:.1f}%)')
print(f'Couple Activities: {total_couple:.1f} hours ({(total_couple/total_weekly_hours)*100:.1f}%)')

# Verify totals
total_accounted = total_core + total_individual + total_networking + total_couple
unaccounted = total_weekly_hours - total_accounted
print(f'Unaccounted Time: {unaccounted:.1f} hours ({(unaccounted/total_weekly_hours)*100:.1f}%)')
print()

print('🎯 KEY INSIGHTS:')
print('-' * 20)
print(f'• Work dominates: {(total_core/total_weekly_hours)*100:.1f}% of total time')
print(f'• Individual time: {(total_individual/total_weekly_hours)*100:.1f}% of total time')
print(f'• Social/Networking: {(total_networking/total_weekly_hours)*100:.1f}% of total time')
print(f'• Couple time: {(total_couple/total_weekly_hours)*100:.1f}% of total time')
print(f'• Balance ratio (Work:Individual:Social:Couple): {total_core/total_individual:.1f}:1:{total_networking/total_individual:.1f}:{total_couple/total_individual:.1f}')
print()

print('📊 DETAILED BREAKDOWN BY CATEGORY:')
print('=' * 50)
print(f'1. WORK & CORE REQUIREMENTS: {(total_core/total_weekly_hours)*100:.1f}%')
print(f'   - Work Hours: {(45/total_weekly_hours)*100:.1f}%')
print(f'   - Morning Routine: {(21/total_weekly_hours)*100:.1f}%')
print(f'   - Evening Wind-down: {(7/total_weekly_hours)*100:.1f}%')
print(f'   - Other Core: {((total_core-45-21-7)/total_weekly_hours)*100:.1f}%')
print()
print(f'2. INDIVIDUAL ACTIVITIES: {(total_individual/total_weekly_hours)*100:.1f}%')
print(f'   - Running: {(5/total_weekly_hours)*100:.1f}%')
print(f'   - Personal Development: {(3.5/total_weekly_hours)*100:.1f}%')
print(f'   - Fitness & Grooming: {(6.5/total_weekly_hours)*100:.1f}%')
print()
print(f'3. NETWORKING & SOCIAL: {(total_networking/total_weekly_hours)*100:.1f}%')
print(f'   - Professional Networking: {(6/total_weekly_hours)*100:.1f}%')
print(f'   - Social Activities: {(total_networking-6)/total_weekly_hours*100:.1f}%')
print()
print(f'4. COUPLE ACTIVITIES: {(total_couple/total_weekly_hours)*100:.1f}%')
print(f'   - Daily Meals: {(8/total_weekly_hours)*100:.1f}%')
print(f'   - Weekend Activities: {(7/total_weekly_hours)*100:.1f}%')
print(f'   - Household Together: {(2/total_weekly_hours)*100:.1f}%')

