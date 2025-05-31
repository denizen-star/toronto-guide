# 🚀 How to Run the Toronto Guide Curator

This guide provides **step-by-step instructions** for running the curator system to validate and improve your Toronto Guide content.

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ React app running (`npm start`)
- ✅ CSV files in `public/data/` directory
- ✅ Web browser open

## 🎯 Overview: What We'll Do

1. **Access** the curator admin interface
2. **Run** content validation across all CSV files
3. **Review** quarantined items that need attention
4. **Make decisions** (approve/reject) on problematic content
5. **Apply changes** to update your CSV files

**⏱️ Time Required**: 10-30 minutes (depending on content issues found)

---

## 📖 Step-by-Step Instructions

### **Step 1: Access the Curator Interface**

#### 🌐 **In Your Browser:**
```
http://localhost:3002/admin/content-review
```

> **💡 Note**: Your app is running on port 3002, so use that URL.

#### 🖥️ **What You'll See:**
- **Content Review Administration** page header
- **Statistics cards** showing current quarantine status
- **Action buttons** for running validation and managing content
- If this is your first time, most stats will show "0"

---

### **Step 2: Run Content Validation**

#### 🔘 **Click the "Run New Validation" Button**

**Location**: Top-left action button (blue button with refresh icon)

#### ⏳ **What Happens:**
- Progress bar appears with "Running content validation across all CSV files..."
- The system validates all 6 CSV files:
  - `activities.csv` (120+ items)
  - `day_trips_standardized.csv` (107+ items)  
  - `amateur_sports_standardized.csv` (56+ items)
  - `sporting_events_standardized.csv` (45+ items)
  - `special_events_standardized.csv` (46+ items)
  - `happy_hours.csv` (371+ items)

#### ⏱️ **Expected Time**: 10-30 seconds

---

### **Step 3: Review Validation Results**

#### 📊 **Updated Statistics Cards:**

After validation completes, you'll see updated numbers:

| Card | What It Shows |
|------|---------------|
| **Total Items** | Items in quarantine system |
| **Pending Review** | Items needing your decision |
| **Approved** | Items you've approved |
| **Completion** | Percentage of items reviewed |

#### 🎯 **Expected Results (Based on Testing):**
- **Total Items**: ~60-70 quarantined items
- **Pending Review**: Same as total (on first run)
- **Common Issues Found**:
  - 🗺️ Montreal activities in Toronto files (~23 items)
  - 🚗 Excessive distance day trips (~3 items)
  - 📁 Category mismatches (~5-10 items)
  - 🍺 Happy hour items in wrong sections (~5 items)

---

### **Step 4: Review Individual Items**

#### 📋 **Quarantined Items List:**

Below the statistics, you'll see cards for each problematic item:

#### 🔍 **Each Item Card Shows:**
- **📝 Title** and description excerpt
- **🏷️ Category tags** (current category, quality score)
- **⚠️ Issue chips** showing specific problems
- **🔵 Review button** to make decisions

#### 📊 **Issue Types You'll See:**

| Issue Type | Color | Meaning |
|------------|-------|---------|
| **location_mismatch** | Red | Wrong city/location |
| **category_mismatch** | Orange | Wrong section |
| **tag_mismatch** | Yellow | Missing proper tags |
| **description_mismatch** | Blue | Content doesn't fit |

---

### **Step 5: Make Review Decisions**

#### 🔘 **Click "Review" on Any Item**

This opens the **Review Dialog** with:

#### 📋 **Item Details Section:**
- **Quarantine Reason**: Why it was flagged
- **Validation Issues**: Specific problems found
- **Item Details**: Category, score, full description

#### ✏️ **Decision Section:**
- **Review Notes**: Add your reasoning (optional)
- **Target Category**: Choose new category if moving item

#### 🎯 **Two Decision Options:**

##### ✅ **Approve Button** (Green)
**Use when**: Content is good, just needs category change or is fine as-is
- Keeps the item in the dataset
- Moves to different category if specified
- Marks as "approved" for future reference

##### ❌ **Reject Button** (Red)  
**Use when**: Content should be removed
- Removes item from the dataset completely
- Common for: Montreal content, broken entries, duplicates

#### 💡 **Decision Examples:**

| Item Example | Decision | Reason |
|--------------|----------|--------|
| "Old Montreal Walking Tour" | **❌ Reject** | Montreal content in Toronto guide |
| "Thunder Bay Adventure" | **❌ Reject** | 15+ hours travel time |
| "Ossington Bar Crawl" | **✅ Approve** → happy-hours | Move from activities to correct section |
| "Blue Jays Game" | **✅ Approve** → sporting-events | Move from amateur-sports to professional |

---

### **Step 6: Monitor Progress**

#### 📊 **Statistics Update Live:**
- **Completion percentage** increases as you review items
- **Pending count** decreases
- **Approved/Rejected counts** increase

#### 🎯 **Goal**: Get completion to 100%

You don't have to review everything in one session - progress is saved automatically.

---

### **Step 7: Apply Changes to CSV Files**

Once you've reviewed items and made decisions:

#### 🔘 **Option A: Preview Changes First (Recommended)**
1. Click **"Preview CSV Updates"** button
2. Review the preview dialog showing:
   - How many items will be removed
   - How many items will be moved
   - Which files will be affected
3. Click **"Download Updates"** if satisfied

#### 🔘 **Option B: Direct Download**  
1. Click **"Download Updated CSVs"** button
2. Files download immediately to your computer

#### 📁 **What Gets Downloaded:**
- **Updated CSV files** (with `updated_` prefix)
- **Reconciliation report** (.md file with changes)
- **Update summary** (.json file with statistics)

---

### **Step 8: Apply Updated Files**

#### 🔄 **Option A: Manual Replacement**
```bash
# Backup originals
cp -r public/data public/data_backup_$(date +%Y%m%d)

# Replace with updated files (remove 'updated_' prefix)
mv ~/Downloads/updated_activities.csv public/data/activities.csv
# ... repeat for other files
```

#### ⚡ **Option B: Automated Script (Recommended)**
```bash
# 1. Export quarantine data from admin interface
# Click "Export Data" → save as quarantine-export.json

# 2. Run update script
npm run apply-csv-updates

# This automatically:
# - Creates backups
# - Updates all CSV files  
# - Generates detailed reports
```

---

### **Step 9: Verify Results**

#### 🔄 **Restart Your App:**
```bash
# Stop current server (Ctrl+C)
# Start again
npm start
```

#### ✅ **Check Results:**
- Browse your Toronto Guide pages
- Verify problematic content is gone
- Confirm items moved to correct sections
- Run validation again to see improved scores

#### 📊 **Expected Improvements:**
- **Quality Score**: 91.6% → 98%+
- **Montreal Content**: Removed from Toronto files  
- **Category Accuracy**: Items in correct sections
- **Distance Validation**: Reasonable day trip times

---

## 🎉 Success! What You've Accomplished

After completing this process:

✅ **Identified** all content quality issues across 739+ items  
✅ **Removed** inappropriate content (Montreal activities, excessive distances)  
✅ **Reorganized** misplaced content into correct categories  
✅ **Improved** overall content quality score by 6-8%  
✅ **Enhanced** user experience with accurate, well-categorized content  

## 🔄 Regular Maintenance

**Recommended Schedule:**
- **Weekly**: Quick validation run during content updates
- **Monthly**: Full review of any new quarantined items  
- **Quarterly**: Review and update validation rules

## 🆘 Troubleshooting

**Common Issues:**
- **"No items in quarantine"**: Your content is already high quality! 🎉
- **Validation taking too long**: Large datasets may take 30-60 seconds
- **Can't access admin page**: Check URL and ensure app is running
- **Update script fails**: See [Troubleshooting Guide](./TROUBLESHOOTING.md)

## 📚 Next Steps

- **[Understanding Results](./UNDERSTANDING_RESULTS.md)** - Learn to interpret validation scores
- **[Update Workflows](./UPDATE_WORKFLOWS.md)** - Master the file update process  
- **[Advanced Configuration](./ADVANCED_CONFIG.md)** - Customize validation rules

Ready to run the curator? **Go to [http://localhost:3002/admin/content-review](http://localhost:3002/admin/content-review)** and click "Run New Validation"! 🚀 