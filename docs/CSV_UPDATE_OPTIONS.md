# CSV Update Options - Toronto Guide Curator

## Summary: **Can it update existing CSVs directly?**

**Yes!** We now have multiple approaches for updating your CSV files:

| Method | Direct Updates | Backup | Safety | Ease of Use |
|--------|---------------|--------|--------|-------------|
| **Browser Download** | ❌ No | Manual | 🛡️ High | ⭐⭐⭐ Easy |
| **Node.js Script** | ✅ Yes | Automatic | 🛡️ High | ⭐⭐ Medium |
| **Future: API** | ✅ Yes | Automatic | 🛡️ Medium | ⭐⭐⭐ Easy |

---

## **Option 1: Direct File Updates with Node.js Script (NEW!)**

### ✅ **What it does:**
- **Directly modifies** CSV files in `public/data/`
- **Automatic backup** before changes
- **Full audit trail** with detailed reports
- **Safe execution** with error handling

### 🚀 **How to Use:**

#### **Step 1: Review Content in Browser**
```bash
# Start your app
npm start

# Go to: http://localhost:3000/admin/content-review
# Review and approve/reject quarantined items
# Click "Export Data" button
# Save as "quarantine-export.json" in project root
```

#### **Step 2: Run Update Script**
```bash
# Apply changes directly to CSV files
npm run apply-csv-updates

# Or run directly:
node scripts/apply-csv-updates.js
```

#### **Step 3: See Results**
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

### 🛡️ **Built-in Safety:**
- **Automatic backups** before any changes
- **Detailed reports** of all modifications
- **Error handling** with rollback capability
- **Verification** before execution

---

## **Option 2: Browser Download (Original)**

### ✅ **What it does:**
- **Generates updated CSV files** 
- **Downloads to your computer**
- **Manual replacement** required

### 🚀 **How to Use:**
1. Go to admin interface
2. Review and approve/reject items
3. Click **"Download Updated CSVs"**
4. Manually replace files in `public/data/`

### ✅ **Benefits:**
- **Maximum control** - review files before applying
- **Cross-platform** - works in any browser
- **Safe** - originals never touched automatically

---

## **Option 3: Future Server-Side API**

### 🔮 **Potential Enhancement:**
```typescript
// Future: REST API endpoint
POST /api/curator/apply-updates
{
  "approved": [...],
  "rejected": [...],
  "createBackup": true
}
```

This would enable:
- **Real-time updates** without downloads
- **Multi-user collaboration** 
- **Version control integration**
- **Cloud deployment compatibility**

---

## **Comparison: When to Use Each Method**

### **Use Node.js Script When:**
- ✅ You want **direct file updates**
- ✅ You're **developing locally**
- ✅ You want **automatic backups**
- ✅ You prefer **command-line workflows**

### **Use Browser Download When:**
- ✅ You want **maximum safety**
- ✅ You need to **review changes first**
- ✅ You're **not comfortable with scripts**
- ✅ You're on a **production environment**

---

## **Safety Features in Node.js Script**

### 🔒 **Automatic Backups**
```
public/data_backups/
├── backup_2024-01-15/
│   ├── activities.csv
│   ├── day_trips_standardized.csv
│   └── ...
└── backup_2024-01-16/
    └── ...
```

### 📋 **Detailed Reports**
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
  - Reason: This appears to be a Montreal activity in Toronto activities list

## Moved Items
- **Ossington Strip Bar Crawl**
  - From: activities
  - To: happy-hours
  - Notes: Category reassignment to proper section
```

### 🚨 **Error Handling**
- **Pre-flight checks** for file existence
- **Validation** of quarantine data format
- **Graceful failures** with detailed error messages
- **Partial update protection** - all or nothing approach

---

## **Quick Start Guide**

### **For Direct Updates (Recommended):**
```bash
# 1. Start app and review content
npm start
# Visit: http://localhost:3000/admin/content-review

# 2. Export decisions
# Click "Export Data" → save as quarantine-export.json

# 3. Apply updates
npm run apply-csv-updates

# 4. Restart app to see changes
npm start
```

### **Troubleshooting:**

#### **"Quarantine export file not found!"**
- Go to admin interface
- Review and approve/reject items
- Click "Export Data" button
- Save file as `quarantine-export.json` in project root

#### **"No approved or rejected items to process"**
- Ensure you've made approval/rejection decisions
- Check that export file contains reviewed items

#### **"Failed to parse quarantine file"**
- Verify the exported JSON file is valid
- Re-export from the admin interface

---

## **Advanced Usage**

### **Custom Backup Location:**
```javascript
// Modify script for custom backup path
this.backupDir = path.join(process.cwd(), 'my-custom-backups');
```

### **Selective File Updates:**
```javascript
// Update only specific files
const csvFiles = [
  { filename: 'activities.csv', category: 'activities' }
  // Comment out files you don't want to update
];
```

### **Integration with Git:**
```bash
# Track changes in version control
git add public/data/
git commit -m "Apply curator updates: removed Montreal content, fixed categories"
```

This gives you the **best of both worlds**: direct file updates when you want them, with all the safety and control you need! 🚀 