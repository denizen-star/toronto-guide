# Toronto Guide Automation System Recreation Guide

## Overview
This guide provides step-by-step instructions to recreate the complete Toronto Guide workflow automation system that was built in this session. Follow these instructions to rebuild the entire system from commit `450cf8bc3b0fb27dab397d8956e2290245002c2f`.

## Prerequisites
- Node.js (v14 or higher)
- npm package manager
- Git repository at commit `450cf8bc3b0fb27dab397d8956e2290245002c2f`

---

## Step 1: Install Required Dependencies

Add the following dependencies to your `package.json`:

```bash
npm install --save-dev agenda joi axios nodemailer winston node-cron fs-extra uuid commander
```

### Dependencies Added:
- **agenda**: Job scheduling and task management
- **joi**: Data validation and schema validation
- **axios**: HTTP client for link checking and API calls
- **nodemailer**: Email notification system
- **winston**: Comprehensive logging system
- **node-cron**: Cron-based scheduling
- **fs-extra**: Enhanced file system operations
- **uuid**: Unique identifier generation
- **commander**: CLI command parsing

---

## Step 2: Create Directory Structure

Create the complete workflow system directory structure:

```bash
mkdir -p scripts/workflows/{config,tasks,services,utils,schedulers}
mkdir -p logs/workflows
mkdir -p reports/{json,markdown}
mkdir -p backups
mkdir -p scripts/workflows/notifications/templates
```

### Directory Purpose:
- `scripts/workflows/` - Main workflow system
- `scripts/workflows/config/` - Configuration files
- `scripts/workflows/tasks/` - Individual task modules
- `scripts/workflows/services/` - Support services
- `scripts/workflows/utils/` - Utility functions
- `scripts/workflows/schedulers/` - Scheduling modules
- `logs/workflows/` - System logs
- `reports/` - Generated reports
- `backups/` - Data backups

---

## Step 3: Configuration Files

### Create `scripts/workflows/config/workflows.json`:
```json
{
  "schedules": {
    "weekly": {
      "cron": "0 6 * * 1",
      "timezone": "America/Toronto",
      "enabled": true,
      "timeout": 900000,
      "tasks": [
        "data-validation",
        "link-checker",
        "backup-verification",
        "recent-changes"
      ]
    },
    "monthly": {
      "cron": "0 2 1-7 * 5",
      "timezone": "America/Toronto",
      "enabled": true,
      "timeout": 3600000,
      "tasks": [
        "pre-processing",
        "data-integration",
        "content-enrichment",
        "analytics",
        "post-processing"
      ]
    },
    "quarterly": {
      "cron": "0 1 15 1,4,7,10 *",
      "timezone": "America/Toronto",
      "enabled": true,
      "timeout": 10800000,
      "tasks": [
        "deep-audit",
        "schema-review",
        "optimization",
        "strategic-analysis"
      ]
    }
  },
  "validation": {
    "similarityThreshold": 0.85,
    "maxFileSize": "10MB",
    "allowedFileTypes": [".csv", ".txt"],
    "requiredFields": [
      "id", "title", "description", "location", "type", "lastUpdated"
    ]
  },
  "notifications": {
    "email": {
      "enabled": true,
      "recipients": ["admin@torontoguide.com"],
      "smtp": {
        "host": "smtp.gmail.com",
        "port": 587,
        "secure": false
      }
    },
    "slack": {
      "enabled": false,
      "webhook": "",
      "channel": "#data-maintenance"
    }
  },
  "paths": {
    "dataDir": "public/data",
    "newDataDir": "src/new_data",
    "backupDir": "backups",
    "reportsDir": "reports",
    "logsDir": "logs/workflows"
  },
  "retryPolicy": {
    "maxRetries": 3,
    "retryDelay": 5000,
    "exponentialBackoff": true
  }
}
```

### Create `scripts/workflows/config/validation-rules.json`:
```json
{
  "fileFormats": {
    "csv": {
      "delimiter": "|",
      "encoding": "utf8",
      "skipEmptyLines": true,
      "headers": true
    }
  },
  "fieldValidation": {
    "id": {
      "required": true,
      "type": "string",
      "pattern": "^[a-z]{2}\\d{6}_\\d{3}$"
    },
    "title": {
      "required": true,
      "type": "string",
      "minLength": 3,
      "maxLength": 200
    },
    "description": {
      "required": true,
      "type": "string",
      "minLength": 10,
      "maxLength": 1000
    },
    "location": {
      "required": true,
      "type": "string",
      "minLength": 3
    },
    "type": {
      "required": true,
      "type": "string",
      "enum": ["activity", "restaurant", "event", "attraction", "service"]
    },
    "lastUpdated": {
      "required": true,
      "type": "date",
      "format": "YYYY-MM-DD"
    }
  },
  "dataQuality": {
    "duplicateThreshold": 0.85,
    "minimumFields": 6,
    "maximumFieldLength": 1000,
    "urlValidation": true,
    "dateValidation": true
  }
}
```

---

## Step 4: Core System Files

### Create `scripts/workflows/index.js` (Workflow Orchestrator):
This is the main orchestration engine. Key features:
- Manages workflow execution
- Handles task scheduling
- Provides error handling and recovery
- Integrates notification system
- Manages logging and reporting

### Create `scripts/workflows/cli.js` (Command Line Interface):
Provides command-line management tools:
- `npm run workflow:config` - Show configuration
- `npm run workflow:weekly/monthly/quarterly` - Run workflows
- `npm run workflow:test [task]` - Test individual tasks
- `npm run workflow:status` - Check system status
- `npm run workflow:report` - Generate reports

---

## Step 5: Task Modules

Create the following task files in `scripts/workflows/tasks/`:

### `data-validation.js`
- Validates CSV file structure and content
- Checks pipe-delimited format compliance
- Validates required fields and data types
- Detects duplicate records
- Generates detailed error reports

### `link-checker.js`
- Validates URLs in data files
- Checks Google Maps links
- Detects broken or redirected links
- Supports retry mechanisms with exponential backoff
- Generates link health reports

### `backup-manager.js`
- Creates automated backups of data files
- Verifies backup integrity
- Manages backup retention policies
- Supports incremental and full backups
- Provides backup restoration capabilities

### `content-enricher.js`
- Enhances existing records with additional metadata
- Updates seasonal information automatically
- Adds intelligent tags based on content analysis
- Enriches location data with coordinates
- Improves content quality scores

### `report-generator.js`
- Creates comprehensive system reports
- Generates JSON and Markdown formats
- Provides data health analytics
- Creates performance metrics
- Supports custom report templates

---

## Step 6: Service Modules

Create the following service files in `scripts/workflows/services/`:

### `notification.js`
- Email notification system using Nodemailer
- Slack webhook integration
- Intelligent report generation with recommendations
- Priority-based notification routing
- HTML and text email templates

### `datarian-service.js`
- Integration with existing Datarian data processing
- Handles data transformation and standardization
- Manages data file parsing and conversion
- Provides data quality assessment
- Supports multiple data source formats

### `metrics-collector.js`
- Collects system performance metrics
- Tracks workflow execution statistics
- Monitors data quality trends
- Provides health check capabilities
- Generates analytics dashboards

---

## Step 7: Utility Modules

Create the following utility files in `scripts/workflows/utils/`:

### `logger.js`
- Winston-based logging system
- Multiple log levels (debug, info, warn, error)
- File and console output
- Log rotation and archiving
- Structured logging with metadata

### `error-handler.js`
- Centralized error handling
- Exponential backoff retry logic
- Error categorization and prioritization
- Automatic error recovery mechanisms
- Error reporting and alerting

---

## Step 8: NPM Scripts

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "workflow:weekly": "node scripts/workflows/cli.js run weekly",
    "workflow:monthly": "node scripts/workflows/cli.js run monthly", 
    "workflow:quarterly": "node scripts/workflows/cli.js run quarterly",
    "workflow:config": "node scripts/workflows/cli.js config",
    "workflow:status": "node scripts/workflows/cli.js status",
    "workflow:report": "node scripts/workflows/cli.js report",
    "workflow:test": "node scripts/workflows/cli.js test",
    "workflow:schedule": "node scripts/workflows/cli.js schedule"
  }
}
```

---

## Step 9: Environment Configuration

Set up the following environment variables:

```bash
# Email Configuration
export SMTP_USER="your-email@gmail.com"
export SMTP_PASSWORD="your-app-password"
export SMTP_FROM="noreply@yourdomain.com"

# Slack Configuration (optional)
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

# System Configuration
export NODE_ENV="production"
export LOG_LEVEL="info"
```

---

## Step 10: Documentation Files

The following documentation files were created and should be preserved:

### In `docs/` directory:
1. **`DATA_MAINTENANCE_GUIDE.md`** - Comprehensive data management procedures
2. **`DATA_MANAGEMENT_GUIDE.md`** - Data types, sources, and workflow management
3. **`WORKFLOW_AUTOMATION_SPEC.md`** - Technical specifications
4. **`WORKFLOW_SYSTEM_README.md`** - Complete system documentation
5. **`WORKFLOW_OPERATIONS_GUIDE.md`** - Running, monitoring, and testing
6. **`NOTIFICATION_SYSTEM_GUIDE.md`** - Notification system details

---

## Step 11: Testing the System

After recreation, test the system:

```bash
# Check configuration
npm run workflow:config

# Test individual components
npm run workflow:test data-validation
npm run workflow:test link-checker

# Run a complete workflow
npm run workflow:weekly

# Check system status
npm run workflow:status

# Generate reports
npm run workflow:report
```

---

## Step 12: Scheduling Automation

The system includes three automated schedules:

### Weekly Schedule (Mondays 6 AM):
- Data validation
- Link checking
- Backup verification
- Recent changes analysis

### Monthly Schedule (First Friday 2 AM):
- Data integration from `src/new_data/`
- Content enrichment
- Analytics generation
- System optimization

### Quarterly Schedule (15th of Jan/Apr/Jul/Oct 1 AM):
- Deep system audit
- Schema review and updates
- Performance optimization
- Strategic analysis

---

## Key Features Implemented

### ✅ Automated Data Quality Management
- Pipe-delimited CSV validation
- Duplicate detection and prevention
- Field requirement enforcement
- Data type validation

### ✅ Intelligent Notification System
- Priority-based email alerts
- Slack integration capability
- Rich HTML reports with recommendations
- Automatic error classification

### ✅ Comprehensive Monitoring
- Real-time system health checks
- Performance metrics collection
- Error tracking and recovery
- Detailed audit trails

### ✅ Flexible Workflow Engine
- Cron-based scheduling
- Task dependency management
- Error handling and retry logic
- Parallel task execution

### ✅ Data Integration Pipeline
- Automatic new data processing
- Backup and recovery systems
- Content enrichment capabilities
- Multi-format data support

---

## Maintenance and Support

### Regular Tasks:
1. **Monitor logs** in `logs/workflows/`
2. **Review reports** in `reports/`
3. **Check email notifications** for system alerts
4. **Update configuration** as needed in `scripts/workflows/config/`

### Troubleshooting:
1. **Check system status**: `npm run workflow:status`
2. **Review error logs**: `tail -f logs/workflows/error.log`
3. **Test individual components**: `npm run workflow:test [component]`
4. **Verify configuration**: `npm run workflow:config`

---

## Files Created During Implementation

### Core System:
- `scripts/workflows/index.js` - Main orchestrator
- `scripts/workflows/cli.js` - Command line interface
- `scripts/workflows/config/workflows.json` - Main configuration
- `scripts/workflows/config/validation-rules.json` - Validation rules

### Task Modules:
- `scripts/workflows/tasks/data-validation.js`
- `scripts/workflows/tasks/link-checker.js`
- `scripts/workflows/tasks/backup-manager.js`
- `scripts/workflows/tasks/content-enricher.js`
- `scripts/workflows/tasks/report-generator.js`

### Services:
- `scripts/workflows/services/notification.js`
- `scripts/workflows/services/datarian-service.js`
- `scripts/workflows/services/metrics-collector.js`

### Utilities:
- `scripts/workflows/utils/logger.js`
- `scripts/workflows/utils/error-handler.js`

### Documentation:
- All markdown files in `docs/` directory (preserved in `data_automation/`)

---

## System Architecture

```
Toronto Guide Workflow System
├── Workflow Orchestrator (index.js)
│   ├── Scheduling Engine
│   ├── Task Manager
│   ├── Error Handler
│   └── Notification Manager
├── CLI Interface (cli.js)
├── Configuration (config/)
├── Task Modules (tasks/)
├── Services (services/)
├── Utilities (utils/)
└── Documentation (docs/)
```

This system provides a production-ready, automated data management solution for the Toronto Guide application with comprehensive monitoring, error handling, and reporting capabilities. 