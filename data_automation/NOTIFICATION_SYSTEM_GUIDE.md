# Toronto Guide Notification System Guide

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Email Notifications](#email-notifications)
3. [Slack Notifications](#slack-notifications)
4. [Automatic Triggers](#automatic-triggers)
5. [Intelligent Report Generation](#intelligent-report-generation)
6. [Real-Time vs Scheduled Notifications](#real-time-vs-scheduled-notifications)
7. [Managing Notifications](#managing-notifications)
8. [Troubleshooting](#troubleshooting)
9. [Notification Flow Summary](#notification-flow-summary)

## Architecture Overview

The notification system is a comprehensive service that handles both **email** and **Slack** notifications for workflow events and system alerts.

### Key Components
- **NotificationService**: Main service class handling all notifications
- **WorkflowOrchestrator**: Integrates notifications into workflow execution
- **Configuration**: JSON-based setup for email/Slack settings
- **Report Generation**: Creates HTML and text reports for notifications

### System Integration
The notification system is automatically integrated into every workflow execution:
```javascript
// Notifications are sent after every workflow completion
await this.notifications.sendWorkflowReport(workflowResult);
```

---

## Email Notifications

### Setup & Configuration
The email system uses **Nodemailer** with SMTP configuration.

#### Configuration File
Edit `scripts/workflows/config/workflows.json`:
```json
{
  "notifications": {
    "email": {
      "enabled": true,
      "recipients": ["admin@yourdomain.com", "backup@yourdomain.com"],
      "smtp": {
        "host": "smtp.gmail.com",
        "port": 587,
        "secure": false
      }
    }
  }
}
```

#### Environment Variables
Set these required environment variables:
```bash
export SMTP_USER="your-email@gmail.com"
export SMTP_PASSWORD="your-app-password"  # Use app-specific password for Gmail
export SMTP_FROM="noreply@yourdomain.com"
```

#### Gmail Setup
For Gmail, you'll need to:
1. Enable 2-factor authentication
2. Generate an app-specific password
3. Use the app password in `SMTP_PASSWORD`

### Types of Email Notifications

#### 1. Workflow Completion Reports
**Trigger**: After every workflow execution (weekly, monthly, quarterly)

**Subject Format**: 
- `✅ Toronto Guide weekly Workflow - SUCCESS`
- `❌ Toronto Guide monthly Workflow - FAILURE`
- `⚠️ Toronto Guide quarterly Workflow - PARTIAL`

**Content Includes**:
- **Execution Summary**:
  - Workflow type and duration
  - Success rate percentage
  - Number of tasks executed
  - Start and end times

- **Detailed Task Breakdown**:
  - Individual task status and timing
  - Error details for failed tasks
  - Task output summaries

- **Intelligent Recommendations**:
  - Performance optimization suggestions
  - Data quality improvement recommendations
  - Error resolution guidance

- **Links and Artifacts**:
  - Links to full reports
  - Generated report file paths

#### 2. Critical System Alerts
**Trigger**: High-priority or critical issues

**Subject Format**: `🚨 Toronto Guide Alert: [alert-type]`

**Content Includes**:
- Priority level (HIGH/CRITICAL)
- Alert type and detailed message
- Timestamp and system metadata
- Additional troubleshooting information

**Example Alert**:
```
Priority: CRITICAL
Type: data_corruption
Message: Data integrity compromised in activities.csv
Time: 2024-01-15T10:30:00Z

Additional Details:
{
  "file": "activities.csv",
  "corruptedRecords": 15,
  "backupAvailable": true
}
```

---

## Slack Notifications

### Setup & Configuration
Slack notifications use **webhooks** for real-time alerts.

#### Slack Webhook Setup
1. Go to your Slack workspace
2. Create a new app or use existing one
3. Enable Incoming Webhooks
4. Create a webhook URL for your channel
5. Add to configuration:

```json
{
  "notifications": {
    "slack": {
      "enabled": true,
      "webhook": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
      "channel": "#toronto-guide-alerts"
    }
  }
}
```

### Slack Message Types

#### 1. Workflow Status Updates
Rich formatted messages with color-coded status:

**Success** (Green):
```
✅ Toronto Guide weekly Workflow Complete
Status: SUCCESS | Duration: 12m 34s | Success Rate: 100%
Tasks: 4/4 completed successfully
```

**Failure** (Red):
```
❌ Toronto Guide monthly Workflow Complete  
Status: FAILURE | Duration: 45m 12s | Success Rate: 60%
Tasks: 3/5 failed - requires attention
```

**Partial** (Yellow):
```
⚠️ Toronto Guide quarterly Workflow Complete
Status: PARTIAL | Duration: 1h 23m | Success Rate: 85%
Tasks: 7/8 completed with warnings
```

#### 2. Critical Alerts
Immediate notifications for system issues with structured fields:
- **Priority**: Visual indicator (red for critical, yellow for warning)
- **Type**: Category of alert
- **Message**: Detailed description
- **Time**: When the issue occurred

---

## Automatic Triggers

### When Notifications Are Sent

#### 1. Workflow Completion (Always)
Notifications are **automatically sent** after every workflow execution:
- Weekly maintenance workflows
- Monthly data processing workflows  
- Quarterly analysis workflows
- Manual workflow executions

#### 2. System Alerts (Conditional)
Based on priority level:
- **Critical Priority**: Both email AND Slack
- **High Priority**: Email only
- **Medium/Low Priority**: Logged only (no notifications)

### Alert Priority Examples

#### Critical Alerts (Email + Slack)
```javascript
await notifications.sendAlert('data_corruption', 'Database integrity compromised', 'critical');
await notifications.sendAlert('service_down', 'Workflow service unavailable', 'critical');
await notifications.sendAlert('security_breach', 'Unauthorized access detected', 'critical');
```

#### High Priority Alerts (Email only)
```javascript
await notifications.sendAlert('link_validation', '50+ broken links detected', 'high');
await notifications.sendAlert('data_quality', 'Validation success rate below 85%', 'high');
await notifications.sendAlert('performance', 'Workflow execution time exceeded 2 hours', 'high');
```

---

## Intelligent Report Generation

### Report Content Analysis
The system automatically generates **smart recommendations** based on workflow results.

#### Performance Analysis
- **Execution time > 1 hour** → "Workflow took longer than expected. Consider optimizing task execution."
- **Success rate < 90%** → "Workflow success rate is below 90%. Review recent failures and improve error handling."
- **Memory usage high** → "High memory usage detected. Consider processing data in smaller batches."

#### Data Quality Analysis
- **Validation rate < 95%** → "Data validation success rate is below 95%. Review data quality issues."
- **Broken links detected** → "X broken links found. Update or remove broken links."
- **Duplicate data found** → "Potential duplicates detected. Review similarity threshold settings."

#### Error Pattern Analysis
- **Failed tasks** → "X task(s) failed. Review error logs and consider manual intervention."
- **Network timeouts** → "Network connectivity issues detected. Check internet connection and retry settings."
- **File corruption** → "Data file corruption detected. Consider restoring from backup."

### Report Formats

#### HTML Report
- Professional email template with CSS styling
- Color-coded status indicators
- Expandable sections for detailed information
- Clickable links to full reports

#### Text Report
- Plain text format for email clients that don't support HTML
- Structured layout with clear sections
- Easy to read in terminal/console
- Includes direct links to web interface

---

## Real-Time vs Scheduled Notifications

### Immediate Notifications
Sent **instantly** when detected:
- Critical system failures
- Data corruption incidents
- Security breaches
- Service unavailability
- File system errors

### Scheduled Notifications
Sent **after scheduled workflow completion**:
- **Weekly Reports**: Every Monday after 6 AM workflow completion
- **Monthly Reports**: First Friday after 2 AM workflow completion
- **Quarterly Reports**: 15th of quarter months after 1 AM workflow completion

### Notification Timing
```
Weekly Workflow:    Monday 6:00 AM  → Report sent ~6:15 AM
Monthly Workflow:   Friday 2:00 AM  → Report sent ~3:00 AM  
Quarterly Workflow: 15th 1:00 AM    → Report sent ~4:00 AM
```

---

## Managing Notifications

### Enable/Disable Notifications

#### Disable All Notifications
```bash
# Edit configuration file
nano scripts/workflows/config/workflows.json

# Set enabled: false
{
  "notifications": {
    "email": { "enabled": false },
    "slack": { "enabled": false }
  }
}
```

#### Disable Specific Notification Types
```json
{
  "notifications": {
    "email": { 
      "enabled": true,
      "recipients": ["admin@domain.com"]
    },
    "slack": { 
      "enabled": false  // Slack disabled, email still active
    }
  }
}
```

### Update Recipients

#### Add/Remove Email Recipients
```json
{
  "notifications": {
    "email": {
      "recipients": [
        "admin@yourdomain.com",
        "backup@yourdomain.com", 
        "dev-team@yourdomain.com"
      ]
    }
  }
}
```

#### Change Slack Channel
```json
{
  "notifications": {
    "slack": {
      "webhook": "https://hooks.slack.com/services/NEW/WEBHOOK/URL",
      "channel": "#new-channel-name"
    }
  }
}
```

### Testing Notifications

#### Test Email Configuration
```bash
# Test basic workflow (triggers notification)
npm run workflow:test data-validation

# Run complete workflow to test full notification
npm run workflow:weekly
```

#### Test Slack Configuration
```bash
# Test webhook manually
curl -X POST "https://hooks.slack.com/services/YOUR/WEBHOOK/URL" \
  -H 'Content-type: application/json' \
  --data '{"text":"Test notification from Toronto Guide"}'

# Trigger workflow notification
npm run workflow:test link-checker
```

#### Verify Configuration
```bash
# Check current notification settings
npm run workflow:config

# Look for notification-related logs
tail -f logs/workflows/workflow.log | grep -i "notification"
```

---

## Troubleshooting

### Email Issues

#### Common Problems & Solutions

**1. Authentication Errors**
```bash
# Check environment variables
echo $SMTP_USER
echo $SMTP_PASSWORD

# Common issue: Using regular password instead of app password
# Solution: Generate app-specific password in Gmail settings
```

**2. SMTP Connection Issues**
```bash
# Test SMTP connectivity
telnet smtp.gmail.com 587

# Check firewall/network restrictions
curl -v telnet://smtp.gmail.com:587
```

**3. "535 Authentication Failed" Error**
- **Cause**: Incorrect credentials or 2FA not enabled
- **Solution**: 
  1. Enable 2-factor authentication
  2. Generate app-specific password
  3. Use app password in `SMTP_PASSWORD`

**4. Emails Not Received**
```bash
# Check spam/junk folders
# Verify recipient email addresses in config
cat scripts/workflows/config/workflows.json | grep recipients

# Check email logs for delivery confirmation
grep -i "Email notification sent" logs/workflows/workflow.log
```

### Slack Issues

#### Common Problems & Solutions

**1. Webhook URL Invalid**
```bash
# Test webhook manually
curl -X POST [your-webhook-url] \
  -H 'Content-type: application/json' \
  --data '{"text":"Test message"}'

# Expected response: "ok"
# Error response: Check URL and permissions
```

**2. Messages Not Appearing**
- **Check channel permissions**: Ensure app has permission to post
- **Verify webhook URL**: Regenerate if necessary
- **Check Slack app status**: Ensure app is not suspended

**3. "Invalid Payload" Errors**
```bash
# Check Slack configuration format
cat scripts/workflows/config/workflows.json | grep -A5 "slack"

# Verify JSON syntax
node -e "console.log(JSON.parse(require('fs').readFileSync('scripts/workflows/config/workflows.json')))"
```

### General Troubleshooting

#### Check Notification Service Status
```bash
# Look for notification service initialization
grep -i "notification.*initialized" logs/workflows/workflow.log

# Check for notification errors
grep -i "notification.*error\|failed.*notification" logs/workflows/error.log
```

#### Debug Notification Flow
```bash
# Enable debug logging (if implemented)
export LOG_LEVEL=debug

# Run workflow and monitor notification process
npm run workflow:weekly 2>&1 | grep -i notification
```

#### Validate Configuration
```bash
# Check configuration file syntax
node -c scripts/workflows/config/workflows.json

# Verify all required fields present
cat scripts/workflows/config/workflows.json | jq '.notifications'
```

### Configuration Recovery

#### Backup Configuration
```bash
# Create backup before changes
cp scripts/workflows/config/workflows.json scripts/workflows/config/workflows.json.backup

# Restore from backup if needed
cp scripts/workflows/config/workflows.json.backup scripts/workflows/config/workflows.json
```

#### Reset to Defaults
```bash
# Restore default notification settings
cat > scripts/workflows/config/workflows.json << 'EOF'
{
  "notifications": {
    "email": {
      "enabled": false,
      "recipients": ["admin@example.com"],
      "smtp": {
        "host": "smtp.gmail.com",
        "port": 587,
        "secure": false
      }
    },
    "slack": {
      "enabled": false,
      "webhook": "",
      "channel": "#general"
    }
  }
}
EOF
```

---

## Notification Flow Summary

### Complete Notification Process

1. **Workflow Executes** 
   - System runs scheduled or manual workflow
   - Collects execution results, timing, and metrics
   - Identifies any errors or performance issues

2. **Report Generation**
   - Creates comprehensive HTML and text reports
   - Analyzes workflow performance and data quality
   - Generates file artifacts and logs

3. **Intelligent Analysis**
   - Examines results for patterns and issues
   - Generates contextual recommendations
   - Determines notification priority level

4. **Delivery Decision**
   - Checks configuration for enabled notification types
   - Determines email/Slack delivery based on priority
   - Formats messages appropriately for each channel

5. **Message Formatting**
   - **Email**: Rich HTML with embedded styling and text fallback
   - **Slack**: JSON payload with structured attachments and color coding

6. **Delivery Execution**
   - **Email**: SMTP delivery via Nodemailer
   - **Slack**: HTTP POST to webhook URL
   - Handles authentication and connection management

7. **Logging & Confirmation**
   - Records delivery status and message IDs
   - Logs any delivery errors for troubleshooting
   - Updates system metrics and health status

### Notification Priorities & Routing

| Priority | Email | Slack | Example Triggers |
|----------|-------|-------|------------------|
| **Critical** | ✅ Yes | ✅ Yes | Data corruption, service down, security breach |
| **High** | ✅ Yes | ❌ No | 50+ broken links, low success rate, long execution |
| **Medium** | ❌ No | ❌ No | Minor warnings, performance tips |
| **Low** | ❌ No | ❌ No | Informational messages, debug info |

### Best Practices

1. **Monitor notification delivery logs** regularly
2. **Test notifications** after configuration changes
3. **Use app-specific passwords** for email authentication
4. **Keep webhook URLs secure** and regenerate periodically
5. **Configure multiple recipients** for critical alerts
6. **Review notification frequency** to avoid spam
7. **Maintain backup notification channels** for system reliability

The notification system ensures you're always informed about your Toronto Guide's data health, system performance, and any issues requiring attention - all automatically and intelligently prioritized based on the severity and type of event. 