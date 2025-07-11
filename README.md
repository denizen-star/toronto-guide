# Toronto Guide Project

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-stable-green.svg)

## Overview
A comprehensive guide to Toronto's LGBTQ+ friendly spaces and activities, with a focus on sports and recreational activities.

## Project Structure
- `/src/data_staging/` - Contains raw data files for processing
  - `tor_lgbt1.txt` - Primary LGBTQ+ sports and recreation data
  - `tor_lgbt2.txt` - Additional LGBTQ+ venue data
  - `tor_lgbt3.txt` - Extended community resources data

## Development Setup

### Prerequisites
- Node.js (latest LTS version)
- npm (comes with Node.js)

### Installation
```bash
npm install
```

### Running the Development Server
```bash
npm start
```
The application will be available at:
- Local: http://localhost:3004
- Network: http://192.168.1.84:3004

## 🔗 The Linker - Comprehensive Link Management Tool

The Linker is a powerful tool for checking and cleaning all URLs in your Toronto Guide data files. It provides comprehensive link validation, automatic fixing, and detailed reporting.

### Quick Start

```bash
# Basic link checking
npm run linker

# Fast scan (reduced timeouts)
npm run linker:fast

# Thorough scan (increased timeouts & retries)
npm run linker:thorough

# CHECK and FIX issues automatically
npm run linker:cleanup

# Preview fixes without applying them
npm run linker:cleanup:dry

# Fast cleanup mode
npm run linker:cleanup:fast

# Show help and all options
npm run linker:help
```

### What The Linker Does

#### **🔍 Link Checking:**
- Validates **all URLs** across all CSV data files
- Checks HTTP status codes (200, 301, 404, etc.)
- Measures response times and detects timeouts
- Provides detailed health scoring and reporting

#### **🛠️ Automatic Cleanup:**
- **Fixes fake Google Maps URLs**: Converts `goo.gl/maps/location` to proper search URLs
- **Updates redirects**: Changes redirect URLs to their final destinations  
- **Removes broken links**: Cleans out clearly fake or dead URLs
- **Creates backups**: Always preserves original files before making changes

#### **📊 Comprehensive Reporting:**
- Console summary with health scores and statistics
- Detailed JSON reports with all findings
- Markdown reports for easy reading
- Cleanup reports showing all changes made

### Advanced Usage

```bash
# Custom parameters
node scripts/the-linker.js --timeout 15000 --retries 5 --cleanup

# Dry run to see what would be fixed
node scripts/the-linker.js --cleanup --dry-run

# Cleanup without creating backups  
node scripts/the-linker.js --cleanup --no-backup

# Verbose logging for debugging
node scripts/the-linker.js --verbose
```

### Example Results

Recent cleanup run fixed **397 issues** across 10 files:
- ✅ Converted 150+ fake Google Maps URLs to working search links
- ✅ Updated 50+ redirect URLs to final destinations
- ✅ Removed 200+ broken/fake URLs
- ✅ Created automatic backups of all modified files
- ✅ Generated detailed reports for audit trail

### Report Files

All reports are saved in the `reports/` directory:
- `linker-report-YYYY-MM-DD.json` - Detailed JSON report
- `linker-report-YYYY-MM-DD.md` - Human-readable markdown report  
- `cleanup-report-YYYY-MM-DD.json` - Cleanup actions performed

## Logging System
The project implements a comprehensive logging system that tracks:
- Data processing events
- User interactions
- System health metrics
- API integrations
- Error tracking and debugging information

Logs are stored in structured format and can be accessed through the admin dashboard.

## Available Scripts

### `npm start`
Runs the app in development mode at http://localhost:3004

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run workflow:status`
Shows the current status of data processing workflows.

### `npm run linker`
Runs The Linker to check all links in your data files.

## Documentation
- Main documentation: `/README.md`
- Data automation: `/data_automation/README.md`
- Data staging: `/src/data_staging/README.md`
- Workflow system: `/docs/WORKFLOW_SYSTEM_README.md`
- Curator management: `/guides/curator-management/README.md`

## Contributing
Please refer to the curator management guide for information on how to contribute data or make updates to existing entries.

## License
This project is proprietary and confidential.
