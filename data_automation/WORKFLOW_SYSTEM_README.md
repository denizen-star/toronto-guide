# Toronto Guide Workflow Automation System

## 🎯 Overview

A comprehensive automated data maintenance and workflow orchestration system for the Toronto Guide application. This system implements the technical specifications from the Data Maintenance Guide and provides automated workflows for data validation, link checking, content enrichment, and system health monitoring.

## 🏗️ System Architecture

### Core Components

#### 1. **Workflow Orchestrator** (`scripts/workflows/index.js`)
- Central coordination engine for all workflows
- Manages task execution, scheduling, and error handling
- Provides workflow lifecycle management with metrics collection
- Implements retry policies and timeout management

#### 2. **Task Modules** (`scripts/workflows/tasks/`)
- **Data Validation** - Validates CSV format, required fields, and data integrity
- **Link Checker** - Validates external URLs and Google Maps links
- **Backup Manager** - Creates, verifies, and manages data backups
- **Content Enricher** - Updates seasonal dates, enriches tags, and improves data quality
- **Report Generator** - Creates comprehensive reports in JSON and Markdown formats

#### 3. **Services** (`scripts/workflows/services/`)
- **Notification Service** - Email and Slack notifications for workflow results
- **Datarian Service** - Integration with existing data processing logic
- **Metrics Collector** - Performance tracking and historical data analysis

#### 4. **Utilities** (`scripts/workflows/utils/`)
- **Logger** - Centralized logging with Winston
- **Error Handler** - Comprehensive error handling and recovery

## 🚀 Getting Started

### Installation

The system is already integrated into the Toronto Guide project. All dependencies are installed via:

```bash
npm install
```

### Configuration

The system uses comprehensive configuration files:

- **Workflow Configuration**: `scripts/workflows/config/workflows.json`
- **Validation Rules**: `scripts/workflows/config/validation-rules.json`

Configuration includes:
- Cron schedules for automated execution
- Validation thresholds and rules
- Notification settings (email/Slack)
- File paths and retention policies
- Retry policies and timeouts

### Available Commands

#### Manual Workflow Execution
```bash
# Execute weekly maintenance workflow
npm run workflow:weekly

# Execute monthly maintenance workflow  
npm run workflow:monthly

# Execute quarterly maintenance workflow
npm run workflow:quarterly
```

#### Workflow Management
```bash
# Show workflow status
npm run workflow:status

# Generate summary report
npm run workflow:report

# Generate detailed report
npm run workflow:report:detailed

# Test individual tasks
npm run workflow:test data-validation

# View system configuration
npm run workflow:config
```

#### Automated Scheduling
```bash
# Start the workflow scheduler (runs in background)
npm run workflow:schedule
```

## 📊 Workflow Types

### Weekly Workflows (Mondays 6:00 AM)
- **Data Validation**: CSV format validation and integrity checks
- **Link Checker**: URL and Google Maps link validation
- **Backup Verification**: Verify existing backups integrity
- **Recent Changes**: Monitor and report recent data changes

### Monthly Workflows (First Friday 2:00 AM)
- **Pre-processing**: Data cleanup and standardization
- **Data Integration**: Process new data from `src/new_data/`
- **Content Enrichment**: Update seasonal dates, enhance tags
- **Analytics**: Generate comprehensive reports
- **Post-processing**: Cleanup and optimization

### Quarterly Workflows (15th of Jan/Apr/Jul/Oct 1:00 AM)
- **Deep Audit**: Comprehensive data quality analysis
- **Schema Review**: Validate data structure and standards
- **Optimization**: Performance improvements and cleanup
- **Strategic Analysis**: Long-term trend analysis and recommendations

## 🔧 Task Details

### Data Validation Task
- Validates pipe-delimited CSV format
- Checks required fields (id, title, description, location, type, lastUpdated)
- Identifies missing data and format inconsistencies
- Generates detailed error reports with line numbers

### Link Checker Task
- Validates external website URLs
- Checks Google Maps links for accessibility
- Supports retry mechanisms for transient failures
- Generates broken links reports with recommendations

### Backup Manager Task
- Creates timestamped backups with metadata
- Verifies backup integrity using checksums
- Manages backup retention policies
- Supports backup restoration capabilities

### Content Enricher Task
- Updates seasonal dates to current year
- Enriches tags based on content analysis
- Standardizes text formatting and price formats
- Fixes common URL formatting issues

### Report Generator Task
- Creates summary, detailed, and health reports
- Exports in both JSON and Markdown formats
- Provides data quality scores and recommendations
- Tracks system metrics and performance trends

## 📈 Monitoring & Metrics

### System Health Monitoring
- Real-time workflow execution tracking
- Success rate calculations and trending
- Performance metrics and execution times
- Data quality scoring and health indicators

### Notification System
- Email notifications for workflow completion
- Slack integration for critical alerts
- Customizable notification templates
- Intelligent alerting based on priority levels

### Historical Data
- Comprehensive workflow execution history
- Performance trend analysis
- Error pattern identification
- Automated metric cleanup and retention

## 🔒 Data Safety Features

### Backup Management
- Automatic backups before data modifications
- Integrity verification with checksums
- Configurable retention policies
- Easy restoration capabilities

### Error Handling
- Comprehensive error categorization
- Automatic retry mechanisms with exponential backoff
- Graceful degradation for partial failures
- Detailed error logging and reporting

### Data Validation
- Multi-level validation (format, content, integrity)
- Configurable validation rules
- Non-destructive validation processes
- Detailed issue reporting with remediation suggestions

## 📁 Directory Structure

```
scripts/workflows/
├── index.js                    # Main orchestrator
├── cli.js                      # Command-line interface
├── config/
│   ├── workflows.json          # Workflow configuration
│   ├── validation-rules.json   # Validation rules
│   └── notification-templates/ # Email/Slack templates
├── tasks/
│   ├── data-validation.js      # Data integrity validation
│   ├── link-checker.js         # URL validation
│   ├── backup-manager.js       # Backup operations
│   ├── content-enricher.js     # Content enhancement
│   └── report-generator.js     # Report generation
├── services/
│   ├── notification.js         # Notification service
│   ├── datarian-service.js     # Data processing integration
│   └── metrics-collector.js    # Performance tracking
└── utils/
    ├── logger.js               # Centralized logging
    └── error-handler.js        # Error management
```

## 🔗 Integration with Existing Systems

### Datarian Integration
- Seamless integration with existing data processing scripts
- Leverages existing duplicate detection algorithms
- Maintains compatibility with current data formats
- Preserves existing backup and validation logic

### React Application Integration
- No impact on frontend application performance
- Background execution of maintenance tasks
- Generated reports accessible via admin interface
- Real-time status updates through logging

## 📋 Maintenance and Administration

### Regular Tasks
1. **Monitor Workflow Execution**: Check daily logs and reports
2. **Review Data Quality Reports**: Address identified issues
3. **Update Configuration**: Adjust schedules and thresholds as needed
4. **Backup Verification**: Ensure backup systems are functioning
5. **Performance Monitoring**: Track execution times and success rates

### Troubleshooting
- Check log files in `logs/workflows/` directory
- Review configuration settings in `scripts/workflows/config/`
- Test individual tasks using `npm run workflow:test <task-name>`
- Verify system health with `npm run workflow:status`

### Configuration Updates
- Modify schedules in `workflows.json`
- Update validation rules in `validation-rules.json`
- Configure notifications in the main configuration
- Adjust file paths and retention policies as needed

## 🛠️ Development and Extension

### Adding New Tasks
1. Create task module in `scripts/workflows/tasks/`
2. Implement required methods (execute, validate, etc.)
3. Register task in workflow orchestrator
4. Add configuration and validation rules
5. Update documentation and tests

### Customizing Workflows
- Modify task sequences in configuration
- Adjust scheduling and timing
- Add new workflow types
- Implement custom notification logic

### Performance Optimization
- Monitor execution metrics
- Optimize long-running tasks
- Implement parallel processing where appropriate
- Adjust timeout and retry policies

## 🔍 API Reference

### Workflow Orchestrator Methods
- `executeWorkflow(type, options)` - Execute specific workflow type
- `executeTask(taskName, workflowId, options)` - Execute individual task
- `scheduleWorkflows()` - Start automated scheduling
- `getWorkflowHistory(limit)` - Retrieve execution history

### Task Interface
All tasks implement:
- Static execution methods for specific functionality
- Error handling and result formatting
- Configuration loading and validation
- Logging and metrics integration

## 📊 Performance Characteristics

- **Weekly Workflows**: ~15-30 minutes execution time
- **Monthly Workflows**: ~1-2 hours execution time
- **Quarterly Workflows**: ~3-4 hours execution time
- **Memory Usage**: <200MB typical, <500MB peak
- **Disk Usage**: Logs and reports ~50MB/month

## 🚨 Security Considerations

- No external API keys required for basic functionality
- Email credentials stored in environment variables
- File system access limited to designated directories
- No sensitive data logged or transmitted
- Backup files contain same security as source data

## 📞 Support and Contact

For questions, issues, or feature requests:
1. Check the troubleshooting guide above
2. Review log files for error details
3. Test individual components to isolate issues
4. Consult the technical documentation
5. Contact the development team with specific error messages

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Compatibility**: Node.js 16+, Toronto Guide v0.1.0+ 