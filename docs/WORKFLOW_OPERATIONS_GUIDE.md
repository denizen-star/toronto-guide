# Toronto Guide Workflow Operations Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Running the System](#running-the-system)
3. [Monitoring Operations](#monitoring-operations)
4. [Testing and Validation](#testing-and-validation)
5. [System Management](#system-management)
6. [Troubleshooting](#troubleshooting)
7. [Maintenance Tasks](#maintenance-tasks)

## Quick Start

### Prerequisites
Ensure you have:
- Node.js installed (v14 or higher)
- All dependencies installed (`npm install`)
- Proper directory structure in place

### Basic Setup Check
```bash
# Verify system is ready
npm run workflow:config

# Test basic functionality
npm run workflow:test data-validation
```

---

## Running the System

### 1. Automated Scheduling (Recommended)

#### Start Full Automation
```bash
# Start the scheduler daemon (keeps running in background)
npm run workflow:schedule
```

**What this does:**
- Runs weekly maintenance every Monday at 6 AM
- Processes new data monthly on first Friday at 2 AM  
- Performs quarterly deep analysis on 15th of Jan/Apr/Jul/Oct at 1 AM
- Sends email notifications on completion/errors

#### Stop Automation
```bash
# Kill the scheduler process
pkill -f "workflow.*schedule"

# Or use Ctrl+C if running in foreground
```

### 2. Manual Workflow Execution

#### Weekly Maintenance
```bash
# Run complete weekly workflow
npm run workflow:weekly

# Run with error continuation (doesn't stop on failures)
npm run workflow:weekly -- --continue-on-error
```

**Weekly tasks include:**
- Data validation and integrity checks
- Link verification (websites, Google Maps)
- Backup verification
- Recent changes analysis

#### Monthly Data Processing
```bash
# Process new data and enrich content
npm run workflow:monthly
```

**Monthly tasks include:**
- New data integration from `src/new_data/`
- Content enrichment (tags, seasonal dates)
- Analytics generation
- Data quality improvements

#### Quarterly Analysis
```bash
# Deep system analysis and optimization
npm run workflow:quarterly
```

**Quarterly tasks include:**
- Deep data audits
- Schema reviews
- Performance optimization
- Strategic analysis

### 3. Background Service Setup (Production)

#### Using PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start workflow scheduler with PM2
pm2 start npm --name "toronto-guide-workflows" -- run workflow:schedule

# Save PM2 configuration
pm2 save

# Setup auto-restart on system reboot
pm2 startup
```

#### Using Systemd (Linux)
```bash
# Create service file
sudo nano /etc/systemd/system/toronto-guide-workflows.service
```

Add this configuration:
```ini
[Unit]
Description=Toronto Guide Workflow Scheduler
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/toronto-guide
ExecStart=/usr/bin/node scripts/workflows/cli.js schedule
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable toronto-guide-workflows
sudo systemctl start toronto-guide-workflows
sudo systemctl status toronto-guide-workflows
```

---

## Monitoring Operations

### 1. Real-Time Status Monitoring

#### Check Active Workflows
```bash
# See currently running workflows
npm run workflow:status
```

**Output shows:**
- Active workflow IDs and types
- Current execution status
- Duration running
- Tasks completed

#### Live Log Monitoring
```bash
# Monitor live workflow execution
tail -f logs/workflows/workflow.log

# Monitor errors only
tail -f logs/workflows/error.log

# Monitor today's activity
tail -f logs/workflows/workflow-$(date +%Y-%m-%d).log
```

### 2. Historical Analysis

#### Workflow Reports
```bash
# Generate summary report (last 50 workflows)
npm run workflow:report

# Generate detailed report with full task breakdown
npm run workflow:report:detailed
```

**Reports include:**
- Success/failure rates
- Average execution times
- Error patterns
- Performance trends

#### System Health Check
```bash
# View overall system health metrics
npm run workflow:config
```

### 3. Performance Monitoring

#### Key Metrics to Watch
- **Success Rate**: Should be >90%
- **Execution Time**: Weekly <15min, Monthly <1hr, Quarterly <3hr
- **Error Frequency**: <5% of total executions
- **Data Quality Score**: Should be >85%

#### Log Analysis Commands
```bash
# Count workflow executions today
grep "$(date +%Y-%m-%d)" logs/workflows/workflow.log | grep "Workflow started" | wc -l

# Check for recent errors
grep "ERROR" logs/workflows/workflow.log | tail -10

# Monitor system resource usage during workflows
top -p $(pgrep -f workflow)
```

### 4. Notification Setup

#### Email Notifications
Configure in `scripts/workflows/config/workflows.json`:
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

Set environment variables:
```bash
# Add to your .bashrc or .env file
export SMTP_USER="your-email@gmail.com"
export SMTP_PASSWORD="your-app-password"
export SMTP_FROM="noreply@yourdomain.com"
```

#### Slack Notifications (Optional)
```json
{
  "slack": {
    "enabled": true,
    "webhook": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
    "channel": "#toronto-guide-alerts"
  }
}
```

---

## Testing and Validation

### 1. Individual Task Testing

#### Data Validation Testing
```bash
# Test data integrity checks
npm run workflow:test data-validation
```
**Validates:**
- CSV format and structure
- Required field completeness
- Data quality standards
- Duplicate detection

#### Link Checking Testing
```bash
# Test website and link validation
npm run workflow:test link-checker
```
**Checks:**
- Website accessibility
- Google Maps link validity
- Booking/ticket link functionality
- Response time monitoring

#### Backup System Testing
```bash
# Test backup creation and verification
npm run workflow:test backup-verification
```
**Verifies:**
- Backup file integrity
- Recovery procedures
- Storage capacity
- Backup retention policies

#### Content Enrichment Testing
```bash
# Test content improvement algorithms
npm run workflow:test content-enricher
```
**Tests:**
- Seasonal date updates
- Tag generation
- Content quality improvements
- Data standardization

### 2. End-to-End Testing

#### Complete Workflow Testing
```bash
# Test full weekly workflow without scheduling
npm run workflow:weekly

# Test monthly workflow with new data processing
npm run workflow:monthly

# Test quarterly deep analysis
npm run workflow:quarterly
```

### 3. Data Processing Testing

#### New Data Integration Testing
```bash
# Create test data file
echo "id|title|description|location|type|lastUpdated
test001|Test Activity|Test description for validation|Toronto|test|$(date -u +%Y-%m-%dT%H:%M:%SZ)" > src/new_data/test_data.csv

# Process test data
npm run workflow:test data-integration

# Verify integration
npm run workflow:test data-validation

# Clean up test data
rm src/new_data/test_data.csv
```

### 4. Load Testing

#### Stress Test with Large Dataset
```bash
# Create larger test dataset (adjust size as needed)
for i in {1..100}; do
  echo "test$i|Test Activity $i|Test description for validation|Toronto|test|$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> src/new_data/load_test.csv
done

# Process large dataset
time npm run workflow:monthly

# Monitor system resources
iostat -x 1 & npm run workflow:monthly; kill $!
```

---

## System Management

### 1. Configuration Management

#### View Current Configuration
```bash
# Display complete system configuration
npm run workflow:config

# Check specific configuration files
cat scripts/workflows/config/workflows.json
cat scripts/workflows/config/validation-rules.json
```

#### Modify Schedules
Edit `scripts/workflows/config/workflows.json`:
```json
{
  "schedules": {
    "weekly": {
      "cron": "0 9 * * 1",           // Change to 9 AM
      "timezone": "America/Toronto",
      "enabled": true,
      "timeout": 1800000             // Increase timeout to 30 minutes
    }
  }
}
```

#### Update Validation Rules
Edit `scripts/workflows/config/validation-rules.json`:
```json
{
  "validation": {
    "similarityThreshold": 0.80,     // Make duplicate detection stricter
    "maxFileSize": "20MB",           // Increase file size limit
    "requiredFields": ["id", "title", "description", "location"]
  }
}
```

### 2. Data Directory Management

#### Monitor Data Directories
```bash
# Check data directory sizes
du -sh public/data/*
du -sh src/new_data/*
du -sh backups/*

# List recent files
ls -la public/data/ | head -10
ls -la src/new_data/
ls -la backups/ | head -5
```

#### Clean Up Old Files
```bash
# Archive old backup files (older than 90 days)
find backups/ -name "*.backup.*" -mtime +90 -exec rm {} \;

# Clean up processed new data files
find src/new_data/ -name "*.csv" -mtime +30 -exec mv {} backups/processed/ \;

# Rotate log files
find logs/workflows/ -name "workflow-*.log" -mtime +30 -exec gzip {} \;
```

### 3. Performance Tuning

#### Optimize for Large Datasets
```json
{
  "validation": {
    "maxFileSize": "50MB",
    "batchSize": 1000
  },
  "schedules": {
    "monthly": {
      "timeout": 7200000  // 2 hours for large datasets
    }
  }
}
```

#### Memory Management
```bash
# Monitor memory usage during workflows
while true; do
  echo "$(date): $(ps -o pid,vsz,rss,comm -p $(pgrep -f workflow))"
  sleep 60
done

# Set Node.js memory limits if needed
export NODE_OPTIONS="--max-old-space-size=4096"
```

### 4. Security Management

#### File Permissions
```bash
# Set secure permissions for configuration files
chmod 600 scripts/workflows/config/*.json

# Ensure log directory is writable
chmod 755 logs/workflows/
chmod 644 logs/workflows/*.log
```

#### Environment Variables Security
```bash
# Store sensitive data in environment file
echo "SMTP_USER=your-email@domain.com" >> .env
echo "SMTP_PASSWORD=your-secure-password" >> .env
chmod 600 .env

# Load environment variables
source .env
```

---

## Troubleshooting

### 1. Common Issues and Solutions

#### Workflow Won't Start
```bash
# Check if already running
ps aux | grep workflow

# Kill existing processes
pkill -f "workflow.*schedule"

# Check configuration syntax
npm run workflow:config

# Verify file permissions
ls -la scripts/workflows/config/
```

#### Data Processing Errors
```bash
# Validate CSV format
head -5 src/new_data/your_file.csv
grep -c "|" src/new_data/your_file.csv

# Check for encoding issues
file src/new_data/your_file.csv
iconv -f utf-8 -t utf-8 src/new_data/your_file.csv > /dev/null

# Test with smaller dataset
head -10 src/new_data/your_file.csv > src/new_data/test_small.csv
npm run workflow:test data-integration
```

#### Memory/Performance Issues
```bash
# Check system resources
free -h
df -h
iostat -x 1 5

# Monitor Node.js process
top -p $(pgrep -f node)

# Restart with memory limits
NODE_OPTIONS="--max-old-space-size=8192" npm run workflow:monthly
```

#### Network/Link Issues
```bash
# Test network connectivity
ping -c 4 google.com
curl -I https://www.toronto.ca

# Check DNS resolution
nslookup tourism.toronto.ca

# Test with manual link checker
npm run workflow:test link-checker
```

### 2. Error Log Analysis

#### Common Error Patterns
```bash
# Parse error logs for patterns
grep "ERROR" logs/workflows/error.log | cut -d' ' -f4- | sort | uniq -c | sort -nr

# Check for timeout errors
grep -i "timeout" logs/workflows/workflow.log

# Look for memory errors
grep -i "memory\|heap" logs/workflows/error.log
```

#### Recovery Procedures
```bash
# Restore from backup if data corruption
ls -la backups/ | grep $(date +%Y-%m-%d)

# Re-run failed workflow
npm run workflow:weekly -- --continue-on-error

# Reset system state
rm -rf logs/workflows/temp/*
npm run workflow:test data-validation
```

---

## Maintenance Tasks

### 1. Daily Maintenance
```bash
# Quick system health check
npm run workflow:status && echo "System running normally"

# Check for errors in last 24 hours
grep "$(date +%Y-%m-%d)" logs/workflows/error.log || echo "No errors today"

# Monitor disk space
df -h | grep -E "(public|backups|logs)"
```

### 2. Weekly Maintenance
```bash
# Rotate and compress old logs
find logs/workflows/ -name "*.log" -mtime +7 -exec gzip {} \;

# Clean up temporary files
rm -rf logs/workflows/temp/*

# Update system health metrics
npm run workflow:report > reports/weekly-health-$(date +%Y-%m-%d).txt
```

### 3. Monthly Maintenance
```bash
# Archive old backups
find backups/ -name "*backup*" -mtime +60 -exec tar -czf backups/archive/$(date +%Y-%m).tar.gz {} \; -delete

# Update configuration if needed
cp scripts/workflows/config/workflows.json scripts/workflows/config/workflows.json.backup

# Performance review
npm run workflow:report:detailed > reports/monthly-performance-$(date +%Y-%m).txt
```

### 4. Quarterly Maintenance
```bash
# Full system backup
tar -czf backups/system-backup-$(date +%Y-Q$(($(date +%-m)/3+1))).tar.gz \
  public/data/ scripts/workflows/config/ logs/workflows/metrics/

# Configuration review and optimization
npm run workflow:quarterly

# Security audit
chmod -R 600 scripts/workflows/config/
chown -R $(whoami):$(whoami) logs/workflows/
```

---

## Quick Reference

### Essential Commands
```bash
# Start automation
npm run workflow:schedule

# Check status
npm run workflow:status

# Manual runs
npm run workflow:weekly
npm run workflow:monthly  
npm run workflow:quarterly

# Testing
npm run workflow:test data-validation
npm run workflow:test link-checker

# Monitoring
tail -f logs/workflows/workflow.log
npm run workflow:report

# Emergency stop
pkill -f workflow
```

### Key File Locations
- **Configuration**: `scripts/workflows/config/`
- **Logs**: `logs/workflows/`
- **New Data**: `src/new_data/`
- **Backups**: `backups/`
- **Reports**: `reports/`

### Support Information
- **Log Files**: Check `logs/workflows/error.log` for issues
- **Configuration**: Review `scripts/workflows/config/workflows.json`
- **Dependencies**: Ensure all npm packages are installed
- **Permissions**: Verify file/directory access rights 