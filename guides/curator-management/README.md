# 🤵 Toronto Guide Curator Management

Welcome to the **Toronto Guide Curator Management** documentation! This folder contains comprehensive guides for running and managing the content curation system.

## 📋 Quick Navigation

| Guide | Purpose | When to Use |
|-------|---------|-------------|
| **[🚀 How to Run the Curator](./HOW_TO_RUN_CURATOR.md)** | Step-by-step instructions | First time setup & regular use |
| **[🔧 Troubleshooting Guide](./TROUBLESHOOTING.md)** | Common issues & solutions | When something goes wrong |
| **[📊 Understanding Results](./UNDERSTANDING_RESULTS.md)** | Interpret validation results | Review quarantined content |
| **[⚙️ Advanced Configuration](./ADVANCED_CONFIG.md)** | Customize validation rules | Fine-tune the system |
| **[🔄 Update Workflows](./UPDATE_WORKFLOWS.md)** | Apply changes to CSV files | After reviewing content |

## 🎯 What is the Curator?

The **Toronto Guide Curator** is an intelligent content validation system that:

- ✅ **Validates** all your CSV content for quality issues
- 🔍 **Identifies** misplaced content (e.g., Montreal activities in Toronto files)
- 📊 **Scores** content quality (0-100 points)
- 🚨 **Quarantines** problematic items for review
- 🤖 **Provides** AI-powered insights and recommendations
- 📄 **Updates** CSV files based on your decisions

## 🚀 Quick Start (30 seconds)

```bash
# 1. Start your app (if not already running)
npm start

# 2. Open curator in browser
# Go to: http://localhost:3002/admin/content-review

# 3. Click "Run New Validation"
# 4. Review any quarantined items
# 5. Apply updates if needed
```

## 📊 Current Content Quality

Based on our testing with your Toronto Guide data:

- **Total Items**: 739 across 6 CSV files
- **Quality Score**: 91.6% (before curation)
- **Issues Found**: 62 items needing attention
- **Main Problems**: Montreal content, excessive distances, category mismatches

## 🛠️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CSV Files     │───▶│   Validator     │───▶│   Quarantine    │
│  (Your Data)    │    │  (Rule Engine)  │    │   (Review)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Updated CSVs   │◀───│   CSV Updater   │◀───│  Admin Panel    │
│ (Clean Data)    │    │   (Applies)     │    │  (Your Review)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 File Structure

```
guides/curator-management/
├── README.md                    # This overview file
├── HOW_TO_RUN_CURATOR.md       # Step-by-step instructions
├── TROUBLESHOOTING.md          # Problem solving
├── UNDERSTANDING_RESULTS.md    # Interpret validation results
├── ADVANCED_CONFIG.md          # Customize the system
├── UPDATE_WORKFLOWS.md         # Apply changes
└── examples/                   # Example outputs and files
    ├── sample-validation-results.json
    ├── sample-quarantine-export.json
    └── sample-update-report.md
```

## 🎓 Learning Path

### **Beginner** (New to the curator)
1. Read [How to Run the Curator](./HOW_TO_RUN_CURATOR.md)
2. Try the basic validation workflow
3. Review [Understanding Results](./UNDERSTANDING_RESULTS.md)

### **Intermediate** (Regular user)
1. Master [Update Workflows](./UPDATE_WORKFLOWS.md)
2. Learn [Troubleshooting](./TROUBLESHOOTING.md) common issues
3. Explore basic customization options

### **Advanced** (Power user)
1. Study [Advanced Configuration](./ADVANCED_CONFIG.md)
2. Customize validation rules for your needs
3. Integrate with your development workflow

## 🆘 Need Help?

- **Quick Issue?** → Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
- **Don't understand results?** → See [Understanding Results](./UNDERSTANDING_RESULTS.md)
- **Want to customize?** → Read [Advanced Configuration](./ADVANCED_CONFIG.md)
- **First time user?** → Start with [How to Run the Curator](./HOW_TO_RUN_CURATOR.md)

## 📈 Benefits You'll See

After running the curator regularly:

- **🎯 Higher Quality Content** - Remove problematic items
- **📍 Correct Categorization** - Items in the right sections  
- **🗺️ Location Accuracy** - Only Toronto content in Toronto files
- **⚡ Better User Experience** - Visitors find what they expect
- **🔧 Easier Maintenance** - Automated quality checks

Ready to get started? **[Begin with the Step-by-Step Guide →](./HOW_TO_RUN_CURATOR.md)** 