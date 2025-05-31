# 🔧 Troubleshooting Guide - Toronto Guide Curator

This guide helps you solve common issues when running the curator system.

## 🚨 Quick Fix Checklist

Before diving deep, try these quick fixes:

- ✅ **App running?** Check `npm start` is active
- ✅ **Correct URL?** Use `http://localhost:3002/admin/content-review`
- ✅ **CSV files present?** Verify `public/data/` has all 6 files
- ✅ **Browser updated?** Try hard refresh (Ctrl+F5 / Cmd+Shift+R)

---

## 🔍 Common Issues & Solutions

### **1. Cannot Access Admin Interface**

#### ❌ **Symptom:**
- Page not found (404 error)
- Blank page or loading forever
- "This site can't be reached"

#### 🔧 **Solutions:**

##### **Check App Status**
```bash
# Is your app running?
# You should see: "webpack compiled successfully"
npm start
```

##### **Verify URL**
```bash
# Correct URL format:
http://localhost:3002/admin/content-review

# NOT:
http://localhost:3000/admin/content-review  # Wrong port
http://localhost:3002/admin/review          # Wrong path
```

##### **Check Browser Console**
1. Press F12 to open developer tools
2. Look for red error messages
3. Common errors and fixes:
   - **"Module not found"** → Restart app with `npm start`
   - **"Network error"** → Check app is running
   - **"Parsing error"** → Clear browser cache

---

### **2. Validation Not Starting**

#### ❌ **Symptom:**
- Click "Run New Validation" but nothing happens
- Button stays disabled
- No progress bar appears

#### 🔧 **Solutions:**

##### **Check CSV Files**
```bash
# Verify all required files exist:
ls -la public/data/

# You should see:
# activities.csv
# day_trips_standardized.csv
# amateur_sports_standardized.csv
# sporting_events_standardized.csv
# special_events_standardized.csv
# happy_hours.csv
```

##### **Check File Permissions**
```bash
# Ensure files are readable:
chmod 644 public/data/*.csv
```

##### **Restart App**
```bash
# Stop current app (Ctrl+C)
npm start
```

---

### **3. Validation Takes Too Long**

#### ❌ **Symptom:**
- Progress bar stuck for 2+ minutes
- Browser appears frozen
- Console shows memory warnings

#### 🔧 **Solutions:**

##### **Large Dataset Handling**
- **Expected time**: 10-60 seconds for 739 items
- **If longer**: Close other browser tabs to free memory
- **If stuck**: Refresh page and try again

##### **Performance Tips**
```javascript
// If you have custom large datasets, consider:
// 1. Processing files individually
// 2. Reducing batch size in contentValidator.ts
// 3. Adding progress callbacks
```

---

### **4. No Items in Quarantine**

#### ❌ **Symptom:**
- "No items in quarantine!" message appears
- Statistics show all zeros
- No problematic content found

#### ✅ **This is Actually Good!**

This means your content is already high quality! But if you expected issues:

##### **Verification Steps**
1. **Check validation rules** are appropriate for your data
2. **Lower validation threshold** in `contentValidator.ts` (currently 70)
3. **Add custom validation rules** for your specific needs

##### **Manual Check**
```bash
# Look for obvious issues in your data:
grep -i "montreal" public/data/activities.csv
grep -i "thunder bay" public/data/day_trips_standardized.csv
```

---

### **5. Review Dialog Issues**

#### ❌ **Symptoms:**
- Review dialog won't open
- Can't click approve/reject buttons
- Dialog appears blank

#### 🔧 **Solutions:**

##### **Browser Compatibility**
- **Modern browsers required**: Chrome 80+, Firefox 75+, Safari 13+
- **Try different browser** if issues persist

##### **JavaScript Errors**
1. Open browser console (F12)
2. Look for React/JavaScript errors
3. Common fixes:
   - Clear browser cache
   - Disable browser extensions
   - Check ad blockers aren't interfering

---

### **6. CSV Update Script Failures**

#### ❌ **Symptom:**
```bash
❌ Quarantine export file not found!
❌ Failed to parse quarantine file
❌ No approved or rejected items to process
```

#### 🔧 **Solutions:**

##### **Missing Export File**
```bash
# Steps to create quarantine export:
# 1. Go to admin interface
# 2. Review some items (approve/reject)
# 3. Click "Export Data" button
# 4. Save as "quarantine-export.json" in project root
```

##### **Invalid Export File**
```bash
# Check file format:
cat quarantine-export.json | head -10

# Should start with: {"metadata":{"exportedAt":...
# If malformed, re-export from admin interface
```

##### **No Decisions Made**
```bash
# You need to approve OR reject items before updating
# Solution: Review items in admin interface first
```

---

### **7. File Permission Errors**

#### ❌ **Symptom:**
```bash
Error: EACCES: permission denied, open 'public/data/activities.csv'
Error: ENOENT: no such file or directory
```

#### 🔧 **Solutions:**

##### **Fix Permissions**
```bash
# Make files writable:
chmod 644 public/data/*.csv

# Make directories accessible:
chmod 755 public/data/
```

##### **Check File Paths**
```bash
# Verify you're in project root:
pwd
# Should end with: /toronto-guide

# Check relative paths:
ls public/data/
```

---

### **8. Memory/Performance Issues**

#### ❌ **Symptoms:**
- Browser becomes slow/unresponsive
- "Out of memory" errors
- App crashes during validation

#### 🔧 **Solutions:**

##### **Reduce Memory Usage**
```bash
# Close other applications
# Close unnecessary browser tabs
# Restart browser

# For large datasets, process in batches:
# Edit contentValidator.ts to process fewer items at once
```

##### **Increase Node.js Memory**
```bash
# If using update script:
node --max-old-space-size=4096 scripts/apply-csv-updates.js
```

---

### **9. Data Inconsistency Issues**

#### ❌ **Symptoms:**
- Items appear multiple times
- Approved items still show as pending
- Statistics don't match visible items

#### 🔧 **Solutions:**

##### **Clear Browser Storage**
```bash
# Clear local storage (browser cache):
# 1. Open browser dev tools (F12)
# 2. Go to Application/Storage tab
# 3. Clear localStorage for localhost:3002
```

##### **Reset Quarantine System**
```bash
# If data is corrupted, reset:
rm quarantine-export.json
# Then run validation again
```

---

### **10. Network/Loading Issues**

#### ❌ **Symptoms:**
- CSV files won't load
- Validation fails with network errors
- Admin interface partially loads

#### 🔧 **Solutions:**

##### **Check Development Server**
```bash
# Ensure React dev server is healthy:
npm start

# Look for these messages:
# "webpack compiled successfully"
# "No issues found"
```

##### **Port Conflicts**
```bash
# If port 3002 is busy:
# Kill other processes:
lsof -ti:3002 | xargs kill -9

# Or use different port:
PORT=3003 npm start
```

---

## 🔍 Advanced Debugging

### **Enable Debug Mode**

Add to your browser console:
```javascript
localStorage.setItem('curator-debug', 'true');
```

This enables additional logging for troubleshooting.

### **Check Component State**

In browser console:
```javascript
// Check quarantine manager state:
window.quarantineManager?.getReviewStats()

// Check validation results:
window.contentValidator?.getValidationSummary()
```

### **Inspect Network Requests**

1. Open browser dev tools (F12)
2. Go to Network tab
3. Run validation
4. Look for failed requests (red entries)

---

## 🆘 Getting Help

### **Self-Service Options**

1. **[Understanding Results](./UNDERSTANDING_RESULTS.md)** - Interpret validation output
2. **[Advanced Configuration](./ADVANCED_CONFIG.md)** - Customize validation rules
3. **[Update Workflows](./UPDATE_WORKFLOWS.md)** - File update processes

### **Diagnostic Information**

When reporting issues, include:

```bash
# System info:
npm --version
node --version
ls -la public/data/

# Browser console errors (F12 → Console tab)
# Network errors (F12 → Network tab)
# Any error messages from terminal
```

### **Common Fixes Summary**

| Issue | Quick Fix |
|-------|-----------|
| **Can't access admin** | Check URL: `localhost:3002/admin/content-review` |
| **Validation won't start** | Verify CSV files exist in `public/data/` |
| **No quarantined items** | Content is good! Or lower validation threshold |
| **Script fails** | Export quarantine data first, then run script |
| **Performance issues** | Close other apps, restart browser |
| **File errors** | Check permissions: `chmod 644 public/data/*.csv` |

Remember: Most issues are solved by restarting the app and ensuring all files are in the correct locations! 🚀 