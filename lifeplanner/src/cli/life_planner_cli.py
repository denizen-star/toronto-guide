#!/usr/bin/env python3
"""
Command Line Interface for LifePlanner
"""

import argparse
import json
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Add the src directory to the path
sys.path.append(str(Path(__file__).parent.parent))

from features.application import LifePlannerApp
from shared.exceptions import PlannerError, ValidationError, PersonaNotFoundError


def main():
    """Main CLI entry point"""
    parser = argparse.ArgumentParser(
        description="LifePlanner - Intelligent Lifestyle Management System",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Generate a 1-week integrated schedule
  python -m src.cli.life_planner_cli generate --start-date 2024-01-15 --duration "1 week" --type integrated

  # List available personas
  python -m src.cli.life_planner_cli list-personas

  # Show activity statistics
  python -m src.cli.life_planner_cli stats

  # Export schedule to JSON
  python -m src.cli.life_planner_cli generate --start-date 2024-01-15 --duration "1 week" --output json

  # Generate with specific focus areas
  python -m src.cli.life_planner_cli generate --start-date 2024-01-15 --duration "1 week" --focus fitness,networking
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Generate command
    generate_parser = subparsers.add_parser('generate', help='Generate a schedule')
    generate_parser.add_argument('--start-date', required=True, help='Start date (YYYY-MM-DD)')
    generate_parser.add_argument('--duration', required=True, 
                               choices=['1 week', '2 weeks', '1 month', '3 months', '6 months'],
                               help='Schedule duration')
    generate_parser.add_argument('--type', default='integrated',
                               choices=['individual', 'couple', 'integrated'],
                               help='Schedule type')
    generate_parser.add_argument('--persona', help='Persona ID to use')
    generate_parser.add_argument('--focus', help='Comma-separated focus areas')
    generate_parser.add_argument('--output', choices=['markdown', 'json', 'csv'], 
                               default='markdown', help='Output format')
    generate_parser.add_argument('--file', help='Output file path')
    
    # List personas command
    list_parser = subparsers.add_parser('list-personas', help='List available personas')
    list_parser.add_argument('--format', choices=['table', 'json'], default='table',
                           help='Output format')
    
    # Stats command
    stats_parser = subparsers.add_parser('stats', help='Show activity statistics')
    stats_parser.add_argument('--format', choices=['table', 'json'], default='table',
                            help='Output format')
    
    # Config command
    config_parser = subparsers.add_parser('config', help='Configuration management')
    config_parser.add_argument('--show', action='store_true', help='Show current configuration')
    config_parser.add_argument('--set', nargs=2, metavar=('KEY', 'VALUE'), 
                             help='Set configuration value')
    config_parser.add_argument('--reset', action='store_true', help='Reset to defaults')
    
    # Status command
    status_parser = subparsers.add_parser('status', help='Show application status')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return 1
    
    try:
        # Initialize application
        app = LifePlannerApp()
        
        if args.command == 'generate':
            return handle_generate(app, args)
        elif args.command == 'list-personas':
            return handle_list_personas(app, args)
        elif args.command == 'stats':
            return handle_stats(app, args)
        elif args.command == 'config':
            return handle_config(app, args)
        elif args.command == 'status':
            return handle_status(app, args)
        else:
            parser.print_help()
            return 1
            
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        return 1


def handle_generate(app, args):
    """Handle generate command"""
    # Set persona if specified
    if args.persona:
        try:
            app.set_persona(args.persona)
            print(f"✅ Using persona: {args.persona}")
        except PersonaNotFoundError as e:
            print(f"❌ Persona not found: {e}", file=sys.stderr)
            return 1
    
    # Parse focus areas
    focus_areas = None
    if args.focus:
        focus_areas = [area.strip() for area in args.focus.split(',')]
    
    # Generate schedule
    try:
        result = app.generate_schedule(
            start_date=args.start_date,
            duration=args.duration,
            schedule_type=args.type,
            focus_areas=focus_areas
        )
        
        # Format output
        if args.output == 'json':
            output = json.dumps(result, indent=2)
        elif args.output == 'csv':
            output = format_schedule_csv(result)
        else:  # markdown
            output = format_schedule_markdown(result)
        
        # Write to file or stdout
        if args.file:
            with open(args.file, 'w') as f:
                f.write(output)
            print(f"✅ Schedule saved to {args.file}")
        else:
            print(output)
        
        return 0
        
    except ValidationError as e:
        print(f"❌ Validation error: {e}", file=sys.stderr)
        return 1
    except PlannerError as e:
        print(f"❌ Planning error: {e}", file=sys.stderr)
        return 1


def handle_list_personas(app, args):
    """Handle list-personas command"""
    personas = app.get_available_personas()
    
    if args.format == 'json':
        print(json.dumps(personas, indent=2))
    else:
        print("Available Personas:")
        print("-" * 50)
        for persona in personas:
            print(f"ID: {persona['id']}")
            print(f"Name: {persona['name']}")
            print(f"Personality: {persona['personality_type']}")
            print(f"Networking Priority: {persona['networking_priority']}/10")
            print()
    
    return 0


def handle_stats(app, args):
    """Handle stats command"""
    stats = app.get_activity_statistics()
    
    if args.format == 'json':
        print(json.dumps(stats, indent=2))
    else:
        print("Activity Statistics:")
        print("-" * 30)
        print(f"Total Activities: {stats['total_activities']}")
        print(f"Average Cost: ${stats['average_cost']:.2f}")
        print(f"Average Networking: {stats['average_networking_potential']:.1f}/10")
        print()
        print("By Type:")
        for activity_type, count in stats['by_type'].items():
            print(f"  {activity_type.replace('_', ' ').title()}: {count}")
    
    return 0


def handle_config(app, args):
    """Handle config command"""
    if args.show:
        settings = app.settings
        print("Current Configuration:")
        print("-" * 30)
        print(f"User Name: {settings.user_name}")
        print(f"Partner Name: {settings.partner_name}")
        print(f"Morning Start: {settings.morning_start}")
        print(f"Bedtime: {settings.bedtime}")
        print(f"Max Daily Budget: ${settings.max_daily_budget}")
        print(f"Max Weekly Budget: ${settings.max_weekly_budget}")
        return 0
    
    if args.set:
        key, value = args.set
        try:
            # Convert value to appropriate type
            if key in ['max_daily_budget', 'max_weekly_budget']:
                value = float(value)
            elif key in ['user_name', 'partner_name', 'morning_start', 'bedtime']:
                value = str(value)
            else:
                print(f"❌ Unknown setting: {key}", file=sys.stderr)
                return 1
            
            success = app.update_settings(**{key: value})
            if success:
                print(f"✅ Updated {key} to {value}")
            else:
                print(f"❌ Failed to update {key}", file=sys.stderr)
                return 1
        except Exception as e:
            print(f"❌ Error updating setting: {e}", file=sys.stderr)
            return 1
    
    if args.reset:
        try:
            success = app.config_service.reset_to_defaults()
            if success:
                print("✅ Configuration reset to defaults")
            else:
                print("❌ Failed to reset configuration", file=sys.stderr)
                return 1
        except Exception as e:
            print(f"❌ Error resetting configuration: {e}", file=sys.stderr)
            return 1
    
    return 0


def handle_status(app, args):
    """Handle status command"""
    status = app.get_app_status()
    
    print("Application Status:")
    print("-" * 30)
    print(f"Settings Loaded: {status['settings_loaded']}")
    print(f"Active Persona: {status['active_persona'] or 'None'}")
    print(f"Total Activities: {status['total_activities']}")
    print(f"Used Activities: {status['used_activities']}")
    print(f"Available Personas: {status['available_personas']}")
    print(f"Last Updated: {status['last_updated']}")
    
    return 0


def format_schedule_markdown(result):
    """Format schedule as Markdown"""
    schedule = result['schedule']
    time_slots = schedule.get('time_slots', [])
    
    output = []
    output.append(result['acknowledgment'])
    output.append("")
    
    if time_slots:
        output.append("## Schedule")
        output.append("")
        
        for slot in time_slots:
            activity = slot['activity']
            output.append(f"**{slot['start_time']} - {slot['end_time']}**: {activity['name']}")
            output.append(f"- 💰 ${activity['cost_cad']:.0f} | 🌟 Networking: {activity['networking_potential']}/10")
            if activity.get('connection_depth', 0) > 0:
                output.append(f"- 💝 Connection: {activity['connection_depth']}/10 | 🛡️ Safety: {activity['emotional_safety']}/10")
            output.append(f"- 📍 {activity['location']}")
            if slot.get('notes'):
                output.append(f"- 📝 {slot['notes']}")
            output.append("")
    
    output.append(result['summary'])
    
    return "\n".join(output)


def format_schedule_csv(result):
    """Format schedule as CSV"""
    schedule = result['schedule']
    time_slots = schedule.get('time_slots', [])
    
    output = []
    output.append("start_time,end_time,activity_name,activity_type,cost_cad,location,networking_potential,connection_depth,emotional_safety,notes")
    
    for slot in time_slots:
        activity = slot['activity']
        output.append(f"{slot['start_time']},{slot['end_time']},{activity['name']},{activity['activity_type']},{activity['cost_cad']},{activity['location']},{activity['networking_potential']},{activity.get('connection_depth', 0)},{activity.get('emotional_safety', 0)},{slot.get('notes', '')}")
    
    return "\n".join(output)


if __name__ == "__main__":
    sys.exit(main())

