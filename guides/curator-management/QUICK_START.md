# ⚡ Quick Start - Run the Curator NOW

**Goal**: Validate and improve your Toronto Guide content in under 5 minutes.

## 🚀 Steps (30 seconds each)

### **1. Open Curator** (30s)
```
Your app is running at: http://localhost:3002
Go to: http://localhost:3002/admin/content-review
```

### **2. Run Validation** (30s)
```
Click: "Run New Validation" button (blue button)
Wait: 10-30 seconds for completion
```

### **3. Check Results** (30s)
Look at the statistics cards:
- **Total Items**: How many issues found
- **Pending Review**: Items needing your decision

### **4. Review Items** (2-4 minutes)
For each problematic item:
- **Click "Review"** button
- **Read the issue** description
- **Choose action**:
  - **❌ Reject**: Remove from dataset (Montreal content, bad data)
  - **✅ Approve**: Keep item (possibly move to different category)

### **5. Apply Changes** (1 minute)
Two options:

#### **Option A: Download & Replace**
```
1. Click "Download Updated CSVs"
2. Backup: cp -r public/data public/data_backup
3. Replace files from Downloads folder
```

#### **Option B: Automated Script**
```
1. Click "Export Data" → save as quarantine-export.json
2. Run: npm run apply-csv-updates
```

---

## 🎯 Expected Results

**Before**: 739 items, 91.6% quality, Montreal content mixed in
**After**: ~680 items, 98%+ quality, clean Toronto-only content

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| **Can't access admin page** | Check URL: `localhost:3002/admin/content-review` |
| **No items found** | Your content is already great! 🎉 |
| **Validation stuck** | Refresh page, try again |
| **Script fails** | Export quarantine data first |

**Ready? Go to**: [http://localhost:3002/admin/content-review](http://localhost:3002/admin/content-review) 🚀

**Need more details?** See [Full How-To Guide](./HOW_TO_RUN_CURATOR.md) 