# Toronto Guide Data Management Guide

## Table of Contents
1. [Data Categories and Structure](#data-categories-and-structure)
2. [Data Sourcing Strategies](#data-sourcing-strategies)
3. [Managing the Automated Workflow System](#managing-the-automated-workflow-system)
4. [Manual Operations](#manual-operations)
5. [Configuration and Customization](#configuration-and-customization)
6. [Data Quality Standards](#data-quality-standards)
7. [Troubleshooting](#troubleshooting)

## Data Categories and Structure

### 1. Activities (`activities.csv`)
**Page Type**: General activities and attractions  
**Target Audience**: Tourists and locals seeking things to do

**Required Fields**:
- `id`: Unique identifier (format: `ac######_###`)
- `title`: Activity name (5-200 characters)
- `description`: Detailed description (50-500 characters)
- `location`: Address or area name
- `type`: Category (e.g., "attraction", "museum", "park")
- `lastUpdated`: ISO8601 timestamp

**Optional Fields**:
- `website`: Official website URL
- `googleMapsLink`: Google Maps location link
- `price`: Cost information (use "Free" for no cost)
- `tags`: Comma-separated keywords for search/filtering
- `hours`: Operating hours
- `phone`: Contact number
- `seasonal`: "true" if seasonal operation

**Data Sources to Target**:
- Tourism Toronto official listings
- City of Toronto parks and recreation
- Museum and cultural institution websites
- TripAdvisor and Google Places (verify accuracy)
- Local business directories
- Event venue websites

### 2. Day Trips (`day_trips_standardized.csv`)
**Page Type**: Full-day excursions from Toronto  
**Target Audience**: Visitors wanting day-long experiences

**Required Fields**:
- `id`: Unique identifier (format: `dt######_###`)
- `title`: Trip name
- `description`: What the trip includes
- `location`: Destination area
- `type`: Trip category (e.g., "nature", "historic", "wine")
- `duration`: Estimated time (e.g., "6-8 hours")
- `lastUpdated`: ISO8601 timestamp

**Optional Fields**:
- `startLocation`: Where trip begins (if specific)
- `transportation`: How to get there
- `difficulty`: Physical requirement level
- `bestSeason`: Optimal time to visit
- `ticketsLink`: Booking URL if applicable

**Data Sources to Target**:
- Ontario Tourism regional guides
- Conservation areas and provincial parks
- Niagara region tourism boards
- Wine country associations
- Historic sites and museums within 2 hours of Toronto
- Tour operator websites

### 3. Sporting Events (`sporting_events_standardized.csv`)
**Page Type**: Professional and major sporting events  
**Target Audience**: Sports fans and event-goers

**Required Fields**:
- `id`: Unique identifier (format: `se######_###`)
- `title`: Event or team name
- `description`: Event details
- `location`: Venue name and area
- `type`: Sport type (e.g., "hockey", "basketball", "baseball")
- `lastUpdated`: ISO8601 timestamp

**Optional Fields**:
- `venue`: Specific stadium/arena name
- `season`: When events occur
- `ticketsLink`: Official ticket sales
- `homeTeam`: For team sports
- `schedule`: Game schedule URL

**Data Sources to Target**:
- Toronto Maple Leafs official site
- Toronto Raptors official site
- Toronto Blue Jays official site
- Toronto FC official site
- Ticketmaster event listings
- Rogers Centre, Scotiabank Arena event calendars
- BMO Field events

### 4. Amateur Sports (`amateur_sports_standardized.csv`)
**Page Type**: Community and recreational sports  
**Target Audience**: Participants and spectators of local sports

**Required Fields**:
- `id`: Unique identifier (format: `as######_###`)
- `title`: League, club, or event name
- `description`: What's offered
- `location`: Where activities happen
- `type`: Sport or activity type
- `lastUpdated`: ISO8601 timestamp

**Optional Fields**:
- `ageGroup`: Target age range
- `skillLevel`: Beginner, intermediate, advanced
- `registrationLink`: How to join
- `cost`: Fees or membership costs
- `contactEmail`: For inquiries

**Data Sources to Target**:
- Toronto Parks and Recreation sports leagues
- Community center program listings
- Local sports club websites
- Meetup.com sports groups
- University and college recreational programs
- Youth sports organizations

### 5. Special Events (`special_events_standardized.csv`)
**Page Type**: Festivals, cultural events, and temporary attractions  
**Target Audience**: Event-goers and culture enthusiasts

**Required Fields**:
- `id`: Unique identifier (format: `sp######_###`)
- `title`: Event name
- `description`: What happens at the event
- `location`: Event venue or area
- `type`: Event category (e.g., "festival", "market", "performance")
- `lastUpdated`: ISO8601 timestamp

**Optional Fields**:
- `startDate`: Event start date (YYYY-MM-DD)
- `endDate`: Event end date (YYYY-MM-DD)
- `recurring`: "annual", "monthly", etc.
- `admission`: Cost information
- `organizer`: Who runs the event

**Data Sources to Target**:
- BlogTO event listings
- NOW Magazine events
- City of Toronto events calendar
- Cultural institution event pages
- Festival organizer websites
- Eventbrite Toronto listings
- Social media event pages

## Data Sourcing Strategies

### Primary Sources (High Priority)
1. **Official Government Sources**
   - City of Toronto website and data portal
   - Tourism Toronto official listings
   - Ontario Tourism databases
   - Parks Canada listings

2. **Venue and Organization Websites**
   - Direct from attraction websites
   - Sports team official sites
   - Cultural institution pages
   - Event organizer websites

3. **Established Tourism Platforms**
   - TripAdvisor (verify with official sources)
   - Google Places/Maps (cross-reference)
   - Yelp business listings
   - OpenTable for restaurants

### Secondary Sources (Verify Before Use)
1. **Travel Blogs and Guides**
   - BlogTO recommendations
   - Local lifestyle websites
   - Travel guidebook content
   - Social media trending locations

2. **Community Platforms**
   - Reddit Toronto discussions
   - Facebook community groups
   - Meetup.com listings
   - Local forum recommendations

### Data Collection Workflow
1. **Identify Target Category**: Determine which CSV file the data belongs to
2. **Source Verification**: Confirm data from official sources when possible
3. **Data Standardization**: Format according to field requirements
4. **Quality Check**: Ensure all required fields are complete
5. **Staging**: Place new data files in `src/new_data/` directory
6. **Processing**: Let automated workflows handle integration

## Managing the Automated Workflow System

### Overview
The system runs three automated maintenance schedules:
- **Weekly** (Mondays 6 AM): Data validation, link checking, backup verification
- **Monthly** (First Friday 2 AM): New data integration, content enrichment
- **Quarterly** (15th of Jan/Apr/Jul/Oct 1 AM): Deep audits and optimization

### Starting the Automated System

#### Option 1: Full Automation (Recommended)
```bash
# Start the scheduler (keeps running in background)
npm run workflow:schedule
```

#### Option 2: Systemd Service (Linux/macOS)
Create a service file for persistent operation:
```bash
# Create service file
sudo nano /etc/systemd/system/toronto-guide-workflows.service
```

Add this content:
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

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable toronto-guide-workflows
sudo systemctl start toronto-guide-workflows
```

### Monitoring the System

#### Check Workflow Status
```bash
# See currently running workflows
npm run workflow:status

# View recent workflow history
npm run workflow:report

# Get detailed execution report
npm run workflow:report:detailed
```

#### View System Health
```bash
# Check overall system configuration
npm run workflow:config

# Monitor logs (if running)
tail -f logs/workflows/workflow.log
```

#### Notification Setup
Configure email notifications in `scripts/workflows/config/workflows.json`:
```json
{
  "notifications": {
    "email": {
      "enabled": true,
      "recipients": ["your-email@domain.com"],
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
export SMTP_USER="your-email@gmail.com"
export SMTP_PASSWORD="your-app-password"
export SMTP_FROM="noreply@yourdomain.com"
```

## Manual Operations

### Running Individual Workflows

#### Weekly Maintenance (Manual)
```bash
# Run complete weekly workflow
npm run workflow:weekly

# Run with error continuation
npm run workflow:weekly -- --continue-on-error
```

#### Monthly Data Processing (Manual)
```bash
# Process new data and update content
npm run workflow:monthly
```

#### Quarterly Analysis (Manual)
```bash
# Deep system analysis and optimization
npm run workflow:quarterly
```

### Testing Individual Tasks
```bash
# Test data validation
npm run workflow:test data-validation

# Test link checker
npm run workflow:test link-checker

# Test backup system
npm run workflow:test backup-verification
```

### Processing New Data Manually

#### Step 1: Prepare Data Files
1. Create properly formatted CSV files with pipe (`|`) delimiters
2. Ensure all required fields are present
3. Name files descriptively (e.g., `summer_festivals_2024.csv`)

#### Step 2: Stage Data
```bash
# Create new data directory if it doesn't exist
mkdir -p src/new_data

# Copy your data files
cp your_new_data.csv src/new_data/
```

#### Step 3: Process Data
```bash
# Run data integration manually
npm run workflow:test data-integration

# Or run full monthly workflow
npm run workflow:monthly
```

#### Step 4: Verify Integration
```bash
# Check data validation results
npm run workflow:test data-validation

# View processing report
npm run workflow:report
```

### Backup and Recovery

#### Create Manual Backup
```bash
# Create immediate backup
npm run workflow:test backup-manager
```

#### Restore from Backup
```bash
# List available backups
ls backups/

# Restore specific backup (requires code modification)
# Contact system administrator for restore procedures
```

## Configuration and Customization

### Workflow Configuration
Edit `scripts/workflows/config/workflows.json` to:

#### Modify Schedules
```json
{
  "schedules": {
    "weekly": {
      "cron": "0 6 * * 1",           // Every Monday at 6 AM
      "timezone": "America/Toronto",
      "enabled": true,
      "timeout": 900000              // 15 minutes
    }
  }
}
```

#### Adjust Validation Rules
```json
{
  "validation": {
    "similarityThreshold": 0.85,     // Duplicate detection sensitivity
    "maxFileSize": "10MB",           // Maximum file size
    "requiredFields": ["id", "title", "description"]
  }
}
```

#### Configure Notifications
```json
{
  "notifications": {
    "email": {
      "enabled": true,
      "recipients": ["admin@yoursite.com"],
      "smtp": {
        "host": "smtp.gmail.com",
        "port": 587,
        "secure": false
      }
    },
    "slack": {
      "enabled": false,
      "webhook": "https://hooks.slack.com/...",
      "channel": "#data-maintenance"
    }
  }
}
```

### Adding New Data Categories

#### Step 1: Create New CSV File
```bash
# Create in public/data/
touch public/data/new_category_standardized.csv
```

#### Step 2: Update Datarian Service
Edit `scripts/workflows/services/datarian-service.js`:
```javascript
// Add new mapping
const mappings = {
  'activities': 'activities.csv',
  'new_category': 'new_category_standardized.csv',  // Add this line
  // ... existing mappings
};
```

#### Step 3: Update Validation Rules
Add validation rules in `scripts/workflows/config/validation-rules.json`:
```json
{
  "fieldValidation": {
    "newField": {
      "required": true,
      "minLength": 5,
      "maxLength": 100
    }
  }
}
```

### Customizing Data Processing

#### Modify Similarity Threshold
Lower values = more strict duplicate detection:
```json
{
  "validation": {
    "similarityThreshold": 0.75  // More strict (was 0.85)
  }
}
```

#### Add Custom Tags
Edit `scripts/workflows/tasks/content-enricher.js` to add auto-tagging logic:
```javascript
// Add location-based tags
if (content.includes('your_keyword')) {
  suggestions.push('your_tag');
}
```

## Data Quality Standards

### Required Quality Checks
1. **Completeness**: All required fields must be filled
2. **Accuracy**: Information must be current and correct
3. **Consistency**: Formatting must follow established patterns
4. **Uniqueness**: No duplicate entries (>85% similarity)
5. **Validity**: URLs must be reachable, dates must be valid

### Field Standards

#### Titles
- 5-200 characters
- Title case (capitalize major words)
- No promotional language ("Best", "Amazing")
- Include location if helps clarity

#### Descriptions
- 50-500 characters
- Complete sentences
- Factual information only
- Include key details (hours, cost, what to expect)

#### Locations
- Use official address when available
- Include neighborhood/area for context
- Consistent format: "123 Main St, Downtown Toronto"

#### URLs
- Must be HTTPS when available
- Link directly to relevant page, not homepage
- Test all links before submission

### Data Freshness Standards
- **Activities**: Review every 6 months
- **Events**: Update dates yearly for recurring events
- **Sports**: Update schedules seasonally
- **Contact Info**: Verify every 3 months

## Troubleshooting

### Common Issues

#### Workflow Not Starting
```bash
# Check if process is already running
ps aux | grep workflow

# Check configuration
npm run workflow:config

# View recent errors
tail -f logs/workflows/error.log
```

#### Data Processing Errors
```bash
# Test individual validation
npm run workflow:test data-validation

# Check file format
head -5 src/new_data/your_file.csv

# Verify pipe delimiters
grep -c "|" src/new_data/your_file.csv
```

#### Link Checker Failing
```bash
# Test link checker separately
npm run workflow:test link-checker

# Check network connectivity
curl -I https://example.com

# Review timeout settings in config
```

#### Email Notifications Not Working
```bash
# Check environment variables
echo $SMTP_USER
echo $SMTP_PASSWORD

# Test SMTP connection
npm run workflow:test notification
```

### Log Files Location
- **Main workflow log**: `logs/workflows/workflow.log`
- **Error log**: `logs/workflows/error.log`
- **Daily logs**: `logs/workflows/workflow-YYYY-MM-DD.log`
- **Metrics**: `logs/workflows/metrics/`

### Getting Help
1. Check the error logs first
2. Review configuration files for typos
3. Test individual components
4. Verify file permissions and paths
5. Check system requirements (Node.js version, dependencies)

### Performance Optimization
- **Large datasets**: Increase timeout values in config
- **Slow network**: Adjust retry settings and timeouts
- **Memory issues**: Process data in smaller batches
- **Storage**: Regularly clean up old backups and logs

---

## Quick Reference Commands

### Daily Operations
```bash
npm run workflow:status          # Check system status
npm run workflow:report          # View recent activity
tail -f logs/workflows/workflow.log  # Monitor live logs
```

### Data Management
```bash
cp new_data.csv src/new_data/    # Stage new data
npm run workflow:monthly         # Process new data
npm run workflow:test data-validation  # Verify quality
```

### System Maintenance
```bash
npm run workflow:schedule        # Start automation
npm run workflow:config          # View settings
npm run workflow:quarterly       # Deep maintenance
``` 