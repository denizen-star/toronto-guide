# CSV Update Guide - Toronto Guide Curator

## Overview
The CSV Update system allows you to apply approved curator changes directly to your CSV files, ensuring your content stays clean and properly categorized.

## How It Works

### 1. **Review and Approve Items**
- Run validation to identify problematic content
- Review quarantined items in the admin interface
- **Approve** items to keep (optionally moving to different categories)
- **Reject** items to remove from your datasets

### 2. **Preview Changes**
- Click **"Preview CSV Updates"** to see what will change
- Review which items will be:
  - 🗑️ **Removed** (rejected items)
  - 📁 **Moved** (category reassignments)
  - ✅ **Updated** (file statistics)

### 3. **Download Updated Files**
- Click **"Download Updated CSVs"** to get cleaned files
- Downloads include:
  - **Updated CSV files** with changes applied
  - **Reconciliation report** showing all changes made
  - **Update summary** with statistics

## What Gets Downloaded

### Updated CSV Files
- `updated_activities.csv` - Montreal activities removed, bar crawls moved out
- `updated_day_trips_standardized.csv` - Excessive distance trips removed
- `updated_amateur_sports_standardized.csv` - Professional sports moved out
- `updated_sporting_events_standardized.csv` - Amateur activities moved out
- `updated_special_events_standardized.csv` - Sports events moved out
- `updated_happy_hours.csv` - Bar crawls moved in from activities

### Reports
- `reconciliation_report.md` - Detailed list of all changes
- `update_summary.json` - Statistics and metadata

## Manual Steps Required

### 1. **Backup Original Files**
```bash
# Create backup of your original data
cp -r public/data public/data_backup_$(date +%Y%m%d)
```

### 2. **Replace CSV Files**
```bash
# Replace with updated versions (remove 'updated_' prefix)
mv ~/Downloads/updated_activities.csv public/data/activities.csv
mv ~/Downloads/updated_day_trips_standardized.csv public/data/day_trips_standardized.csv
# ... etc for other files
```

### 3. **Verify Changes**
- Refresh your React app
- Check that problematic content is resolved
- Run validation again to confirm improvements

## Example Workflow

### Step 1: Initial State
```
📊 Content Quality: 91.6%
❌ 23 Montreal activities in Toronto files
❌ 3 excessive distance day trips
❌ 5 category mismatches
```

### Step 2: Review Process
- **Reject**: "Old Montreal Walking Tour" (Montreal location)
- **Reject**: "Thunder Bay Adventure" (15+ hours travel)
- **Approve & Move**: "Ossington Strip Bar Crawl" → happy-hours
- **Approve & Move**: "Blue Jays Game" → sporting-events

### Step 3: Apply Updates
- Download updated CSV files
- Replace original files with updated versions
- Montreal activities removed
- Bar crawl moved to happy hours section
- Excessive trips removed

### Step 4: Verification
```
📊 Content Quality: 98.5%
✅ No Montreal activities in Toronto files
✅ All day trips under 8 hours travel
✅ Proper content categorization
```

## Benefits

### 🎯 **Automatic Content Cleaning**
- Removes location mismatches (Montreal vs Toronto)
- Eliminates excessive distance day trips
- Fixes category misalignments

### 📊 **Quality Improvement**
- Increases overall content quality score
- Ensures consistent categorization
- Maintains data integrity

### 🔄 **Repeatable Process**
- Can be run regularly as content is added
- Maintains high standards over time
- Scales with content growth

### 🛡️ **Data Safety**
- Preview changes before applying
- Detailed reconciliation reports
- Original data remains untouched until manual replacement

## Best Practices

### 1. **Regular Curation**
- Run validation weekly/monthly
- Review new content additions
- Maintain quality standards

### 2. **Backup Strategy**
- Always backup before applying updates
- Keep reconciliation reports for audit trail
- Version control your CSV files

### 3. **Team Coordination**
- Share reconciliation reports with team
- Document major content changes
- Coordinate updates with content creators

### 4. **Quality Monitoring**
- Track quality scores over time
- Monitor category distribution
- Watch for recurring issues

## Troubleshooting

### Q: What if I need to undo changes?
**A:** Restore from your backup files and re-run the review process with different decisions.

### Q: Can I selectively apply some changes?
**A:** Yes! Only approve the items you want to change. Rejected items will be removed, approved items will be kept/moved.

### Q: What about data not in the quarantine system?
**A:** The update system only affects items that went through the review process. Other data remains unchanged.

### Q: How do I handle new content categories?
**A:** Update the validation rules in `contentValidator.ts` to include new expected categories and tags.

## Next Steps

1. **Run the curator** on your current data
2. **Review quarantined items** and make approval decisions  
3. **Preview updates** to see what will change
4. **Download and apply** the cleaned CSV files
5. **Verify improvements** in content quality

The curator will help you maintain high-quality, well-organized content that provides the best experience for Toronto Guide users! 🚀 