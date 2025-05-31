# 🔄 CSV Update Workflows

This guide covers the complete workflow for applying curator decisions to your CSV files.

## 🎯 Overview: Two Update Methods

| Method | Speed | Safety | Automation | Best For |
|--------|-------|--------|------------|----------|
| **🖥️ Browser Download** | Medium | Highest | Manual | First-time users, production |
| **⚡ Node.js Script** | Fast | High | Automatic | Regular users, development |

---

## 🖥️ Method 1: Browser Download Workflow

### **Step 1: Complete Review Process**
1. Access admin interface: `http://localhost:3002/admin/content-review`
2. Run validation to identify issues
3. Review all quarantined items
4. Make approve/reject decisions

### **Step 2: Preview Changes**
```
Click: "Preview CSV Updates" button
```

**What you'll see:**
- Summary of changes to be made
- Number of items to remove/move
- Files that will be affected
- Sample changes preview

### **Step 3: Download Updated Files**
```
Click: "Download Updated CSVs" button
```

**Downloads include:**
- `updated_activities.csv`
- `updated_day_trips_standardized.csv`
- `updated_amateur_sports_standardized.csv`
- `updated_sporting_events_standardized.csv`
- `updated_special_events_standardized.csv`
- `updated_happy_hours.csv`
- `reconciliation_report.md`
- `update_summary.json`

### **Step 4: Create Backup**
```bash
# Create timestamped backup
cp -r public/data public/data_backup_$(date +%Y%m%d_%H%M%S)

# Verify backup
ls -la public/data_backup_*
```

### **Step 5: Apply Updated Files**
```bash
# Navigate to downloads
cd ~/Downloads

# Replace original files (remove 'updated_' prefix)
mv updated_activities.csv ~/path/to/project/public/data/activities.csv
mv updated_day_trips_standardized.csv ~/path/to/project/public/data/day_trips_standardized.csv
mv updated_amateur_sports_standardized.csv ~/path/to/project/public/data/amateur_sports_standardized.csv
mv updated_sporting_events_standardized.csv ~/path/to/project/public/data/sporting_events_standardized.csv
mv updated_special_events_standardized.csv ~/path/to/project/public/data/special_events_standardized.csv
mv updated_happy_hours.csv ~/path/to/project/public/data/happy_hours.csv
```

### **Step 6: Verify Changes**
```bash
# Restart your app to load new data
npm start

# Check for improvements in content quality
# Browse pages to verify changes took effect
```

---

## ⚡ Method 2: Node.js Script Workflow

### **Step 1: Complete Review Process**
Same as Method 1 - review items in the admin interface.

### **Step 2: Export Quarantine Data**
```
In admin interface:
1. Click "Export Data" button
2. Save file as "quarantine-export.json" in project root
```

### **Step 3: Run Update Script**
```bash
# Apply changes directly to CSV files
npm run apply-csv-updates

# Or run directly:
node scripts/apply-csv-updates.js
```

### **Expected Output:**
```bash
🤵 CSV Update Script Starting...

📊 Quarantine Summary:
   ✅ Approved: 8
   ❌ Rejected: 15
   ⏳ Pending: 0

✅ Backed up: activities.csv
✅ Backed up: day_trips_standardized.csv
✅ Backed up: amateur_sports_standardized.csv
✅ Backed up: sporting_events_standardized.csv
✅ Backed up: special_events_standardized.csv
✅ Backed up: happy_hours.csv
📁 Backup created at: public/data_backups/backup_2024-01-15

📄 activities.csv:
   Original: 120 items
   Updated: 97 items
   Removed: 23 items

📄 day_trips_standardized.csv:
   Original: 107 items
   Updated: 104 items
   Removed: 3 items

🎉 Update Complete!
📊 Final Summary:
   Total items processed: 739
   Total items removed: 26
   Total items moved: 8
   Backup location: public/data_backups/backup_2024-01-15

📄 Report saved: csv-update-report.md
```

### **Step 4: Review Generated Reports**
```bash
# Main update report
cat csv-update-report.md

# Check backup location
ls -la public/data_backups/backup_$(date +%Y-%m-%d)/
```

---

## 📋 What Changes Are Applied

### **🗑️ Rejected Items (Removed)**
Items you marked as "Reject" are completely removed from CSV files.

**Example removals:**
- Montreal activities from Toronto activities
- Excessive distance day trips (Thunder Bay, etc.)
- Duplicate or broken entries

### **📁 Approved Items (Moved)**
Items you approved with category changes are moved between files.

**Example moves:**
- Bar crawls: activities → happy-hours
- Professional sports: amateur-sports → sporting-events
- Cultural events: sporting-events → special-events

### **✅ Approved Items (Kept)**
Items you approved without category changes remain in their original files.

---

## 🛡️ Safety Features

### **Automatic Backups**
Both methods create backups before making changes:

```
public/data_backups/
├── backup_2024-01-15/
│   ├── activities.csv
│   ├── day_trips_standardized.csv
│   ├── amateur_sports_standardized.csv
│   ├── sporting_events_standardized.csv
│   ├── special_events_standardized.csv
│   └── happy_hours.csv
└── backup_2024-01-16/
    └── ...
```

### **Detailed Reporting**
Every update generates comprehensive reports:

#### **Reconciliation Report (`reconciliation_report.md`)**
```markdown
# CSV Update Report

Generated: 2024-01-15T10:30:00.000Z
Backup Location: public/data_backups/backup_2024-01-15

## Summary
- Items removed: 26
- Items moved: 8

## Removed Items
- **Old Montreal Walking Tour** (activities)
  - ID: act_123
  - Reason: Montreal content in Toronto guide

## Moved Items
- **Ossington Strip Bar Crawl**
  - From: activities
  - To: happy-hours
  - Notes: Category reassignment
```

#### **Update Summary (`update_summary.json`)**
```json
{
  "totalProcessed": 739,
  "totalRemoved": 26,
  "totalMoved": 8,
  "categoryMoves": {
    "activities → happy-hours": 5,
    "amateur-sports → sporting-events": 3
  },
  "updatedFiles": [
    {
      "filename": "activities.csv",
      "originalCount": 120,
      "updatedCount": 97,
      "removedCount": 23,
      "movedCount": 0
    }
  ]
}
```

---

## 🔄 Rollback Procedures

### **If Something Goes Wrong**

#### **Method 1: Restore from Backup**
```bash
# Find your backup
ls -la public/data_backup_*

# Restore from most recent backup
cp -r public/data_backup_YYYYMMDD_HHMMSS/* public/data/

# Restart app
npm start
```

#### **Method 2: Use Git (if version controlled)**
```bash
# Reset to last commit
git checkout -- public/data/

# Or restore specific files
git checkout -- public/data/activities.csv
```

#### **Method 3: Re-download Original Data**
If you have the original data source, re-download and replace files.

---

## 📊 Verification & Quality Checks

### **After Applying Updates**

#### **1. Restart Application**
```bash
# Stop current server (Ctrl+C)
npm start
```

#### **2. Browse Your Pages**
- Visit activities page: Check Montreal content is gone
- Visit day trips: Verify reasonable travel times
- Visit happy hours: Confirm bar crawls are present
- Visit sporting events: Check professional sports are there

#### **3. Run Validation Again**
```bash
# In admin interface:
# Click "Run New Validation"
# Should see improved quality scores
```

#### **4. Expected Improvements**
```
Before Curator:
📊 Quality Score: 91.6%
❌ Montreal activities: 23 items
❌ Excessive distances: 3 items
❌ Category mismatches: 15 items

After Curator:
📊 Quality Score: 98.4%
✅ Montreal content: Removed
✅ All day trips: <8 hours travel
✅ Proper categorization: Fixed
```

---

## 🔧 Advanced Workflows

### **Selective Updates**
If you only want to update specific files:

#### **Edit Script Configuration**
```javascript
// In scripts/apply-csv-updates.js
// Comment out files you don't want to update:
const csvFiles = [
  { filename: 'activities.csv', category: 'activities' },
  // { filename: 'day_trips_standardized.csv', category: 'day-trips' },
  // { filename: 'amateur_sports_standardized.csv', category: 'amateur-sports' },
  { filename: 'sporting_events_standardized.csv', category: 'sporting-events' },
  // { filename: 'special_events_standardized.csv', category: 'special-events' },
  // { filename: 'happy_hours.csv', category: 'happy-hours' }
];
```

### **Batch Processing**
For large datasets or multiple review sessions:

```bash
# Process reviews in batches
# 1. Review 20-30 items
# 2. Export and apply changes
# 3. Verify results
# 4. Repeat for next batch
```

### **Integration with Version Control**
```bash
# Before changes
git add public/data/
git commit -m "Before curator updates"

# After changes
git add public/data/
git commit -m "Applied curator updates: removed Montreal content, fixed categories"

# Track report files
git add csv-update-report.md
git commit -m "Add curator update report"
```

---

## 📅 Regular Maintenance Workflow

### **Weekly Maintenance**
```bash
# 1. Quick validation check
npm start
# Go to admin interface, run validation

# 2. Review any new issues
# 3. Apply minor updates if needed
```

### **Monthly Review**
```bash
# 1. Full validation of all content
# 2. Review validation rules for relevance
# 3. Update any systematic issues
# 4. Generate quality report
```

### **Quarterly Audit**
```bash
# 1. Comprehensive content review
# 2. Update validation rules if needed
# 3. Plan content improvements
# 4. Archive old backups
```

---

## 🆘 Troubleshooting Updates

### **Common Issues**

#### **"No approved or rejected items to process"**
- **Solution**: Review items in admin interface first
- Make approve/reject decisions before running updates

#### **"Quarantine export file not found"**
- **Solution**: Export data from admin interface
- Save as `quarantine-export.json` in project root

#### **File permission errors**
```bash
# Fix file permissions
chmod 644 public/data/*.csv
chmod 755 public/data/
```

#### **Updates didn't take effect**
```bash
# Clear browser cache
# Restart React app
npm start
```

### **Verification Checklist**
- ✅ Backup created successfully
- ✅ All expected files updated
- ✅ Item counts match expectations
- ✅ App loads without errors
- ✅ Content changes visible in browser
- ✅ Quality scores improved

Ready to apply your updates? Choose your preferred method and start improving your content quality! 🚀 