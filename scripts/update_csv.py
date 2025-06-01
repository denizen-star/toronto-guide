#!/usr/bin/env python3
import csv
import shutil
from datetime import datetime

def backup_files():
    """Create backups of the CSV files."""
    shutil.copy2('public/data/day_trips_standardized.csv', 'public/data/day_trips_standardized.csv.bak')
    shutil.copy2('public/data/special_events_standardized.csv', 'public/data/special_events_standardized.csv.bak')

def read_csv(filename):
    """Read a CSV file and return its contents as a list of dictionaries."""
    with open(filename, 'r', encoding='utf-8') as f:
        return list(csv.DictReader(f, delimiter='|'))

def write_csv(filename, fieldnames, rows):
    """Write rows to a CSV file with the specified fieldnames."""
    with open(filename, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, delimiter='|')
        writer.writeheader()
        writer.writerows(rows)

def main():
    # Source and target files
    source_file = 'public/data/day_trips_standardized.csv'
    target_file = 'public/data/special_events_standardized.csv'
    
    # Create backups
    backup_files()
    
    # Read both files
    day_trips = read_csv(source_file)
    special_events = read_csv(target_file)
    
    # Find the item to move
    item_id = 'dt733250_dragshowsa'
    item_to_move = None
    remaining_day_trips = []
    
    for item in day_trips:
        if item['id'] == item_id:
            item_to_move = item.copy()
            # Update category-specific fields
            item_to_move['id'] = item_id.replace('dt', 'sp')  # Update ID prefix
            item_to_move['type'] = 'special events'
        else:
            remaining_day_trips.append(item)
    
    if not item_to_move:
        print(f"Error: Item with ID {item_id} not found in source file")
        return
    
    # Add the item to special events
    special_events.append(item_to_move)
    
    # Write back the updated files
    write_csv(source_file, day_trips[0].keys(), remaining_day_trips)
    write_csv(target_file, special_events[0].keys(), special_events)
    
    print("CSV files have been updated successfully!")

if __name__ == '__main__':
    main() 