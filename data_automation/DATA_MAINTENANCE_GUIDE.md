# Data Maintenance Guide for Toronto Guide

This guide provides comprehensive instructions for maintaining and updating the Toronto Guide data repository to ensure current, accurate, and complete information for users.

## 📊 Understanding the Data Model

### Data Structure Overview

The Toronto Guide uses a standardized pipe-delimited CSV format for all content. Each data type follows a consistent schema:

#### Core Data Files
- **`activities.csv`** - Main activities and attractions
- **`day_trips_standardized.csv`** - Day trips and multi-day excursions  
- **`sporting_events_standardized.csv`** - Professional and organized sporting events
- **`amateur_sports_standardized.csv`** - Amateur and recreational sports activities
- **`special_events_standardized.csv`** - Cultural events, festivals, and special occasions

#### Supporting Data Files
- **`locations.csv`** - Location master data
- **`categories.csv`** - Activity categorization
- **`prices.csv`** - Pricing information
- **`schedules.csv`** - Timing and schedule data
- **`tags.csv`** - Tagging system
- **`happy_hours.csv`** - Restaurant and bar specials

### Standard Field Schema

All standardized data files follow this core schema:

```csv
id|title|description|image|location|type|skillLevel|startDate|endDate|registrationDeadline|duration|activityDetails|cost|website|travelTime|googleMapLink|lgbtqFriendly|tags|lastUpdated
```

#### Field Descriptions
- **`id`**: Unique identifier (prefix_timestamp_title)
- **`title`**: Activity or event name
- **`description`**: Detailed description
- **`image`**: Image URL (defaults to Unsplash random)
- **`location`**: Venue or area name
- **`type`**: Content category
- **`skillLevel`**: Difficulty/experience level required
- **`startDate/endDate`**: Availability period
- **`registrationDeadline`**: Booking cutoff
- **`duration`**: Time commitment
- **`activityDetails`**: Specific activity information
- **`cost`**: Pricing details
- **`website`**: Official website URL
- **`travelTime`**: Time to reach from Toronto
- **`googleMapLink`**: Location mapping link
- **`lgbtqFriendly`**: LGBTQ+ inclusivity flag
- **`tags`**: Comma-separated category tags
- **`lastUpdated`**: ISO timestamp of last modification

## 🤖 Using Datarian - Your Data Management Agent

### Overview
Datarian is an intelligent data management agent specifically designed for the Toronto Guide. It provides:
- Automated duplicate detection (85%+ similarity threshold)
- Content type recognition and conversion
- Data quality validation
- Backup creation before modifications
- Comprehensive reporting

### Available Tools

#### 1. JavaScript Implementation (Recommended)
```bash
# Process all new data files at once
node scripts/merge-all-data.js

# Or use the individual merge script for specific files
node scripts/merge-activities.js
```

#### 2. TypeScript Agent (Development/Advanced)
```bash
# For development and testing
npm run datarian
```

### Datarian Capabilities

#### Automatic File Mapping
Datarian automatically maps source files to target destinations:
- `daytrips.txt` → `day_trips_standardized.csv`
- `sports.txt` → `sporting_events_standardized.csv`  
- `amateursports.txt` → `amateur_sports_standardized.csv`
- `culture.txt` → `special_events_standardized.csv`
- `activities.txt` → `activities.csv`

#### Duplicate Detection Features
- **Title Matching**: Exact and fuzzy matching (85%+ similarity)
- **Levenshtein Distance**: Calculates text similarity for robust duplicate detection
- **Content Analysis**: Compares multiple fields for comprehensive matching

#### Data Quality Validation
- **Required Field Checking**: Ensures essential fields are populated
- **URL Validation**: Verifies website links
- **Date Format Standardization**: Converts dates to ISO format
- **Content Filtering**: Removes invalid or incomplete records

## 📅 Maintenance Schedules

### Weekly Maintenance (Every Monday)

#### 1. Data Quality Check (15 minutes)
```bash
# Check for data integrity issues
node scripts/validate-data.js

# Review recent changes
git log --since="1 week ago" --oneline public/data/
```

#### 2. Backup Verification
- Verify automated backups exist for all recent changes
- Check backup file timestamps in `public/data/`
- Ensure backup files are readable and valid CSV format

#### 3. Link Health Check
- Validate external website links for broken URLs
- Update or remove dead links
- Check Google Maps links for accuracy

### Monthly Maintenance (First Friday of Each Month)

#### 1. Comprehensive Data Update (45-60 minutes)

##### New Data Integration
```bash
# 1. Place new data files in src/new_data/
# 2. Run Datarian comprehensive merge
node scripts/merge-all-data.js

# 3. Review and validate results
npm start  # Test in browser
```

##### Content Review Process
1. **Seasonal Updates**: Review date ranges for seasonal activities
2. **Price Updates**: Check and update pricing information  
3. **Contact Information**: Verify phone numbers, emails, addresses
4. **Event Schedules**: Update recurring event dates and times

#### 2. Data Enrichment (30 minutes)
- Add missing Google Maps links
- Enhance descriptions with current information
- Update tags based on new trends or categories
- Add social media handles for events/venues

#### 3. Analytics Review (15 minutes)
- Review Datarian processing logs
- Analyze duplicate detection patterns
- Check data quality metrics
- Document any recurring issues

### Quarterly Maintenance (15th of Jan, Apr, Jul, Oct)

#### 1. Deep Data Audit (2-3 hours)
- Complete review of all data files
- Cross-reference with official sources
- Update seasonal availability
- Retire outdated or discontinued activities

#### 2. Schema Review
- Evaluate if new fields are needed
- Review tagging system effectiveness
- Consider data model improvements
- Update documentation if changes made

#### 3. Performance Optimization
- Analyze file sizes and loading performance
- Optimize image URLs and sources
- Review and clean up unused data
- Archive historical data if needed

## 🔄 Data Update Procedures

### Adding New Data Sources

#### Step 1: Prepare Source Data
1. **Create** `src/new_data/` directory if it doesn't exist
2. **Save** new data files with appropriate names:
   - `activities.txt` - for general activities
   - `daytrips.txt` - for day trips and excursions
   - `sports.txt` - for sporting events
   - `amateursports.txt` - for amateur/recreational sports
   - `culture.txt` - for cultural events and festivals

#### Step 2: Data Format Guidelines
Datarian supports multiple input formats:

##### Pipe-Delimited CSV (Preferred)
```csv
title|description|location|type|cost|website|tags
Event Name|Description here|Location name|Event type|Pricing|URL|tag1,tag2,tag3
```

##### Unstructured Text
```text
Event Name
Description of the event here
Location: Venue Name
Cost: $25
Website: https://example.com
Tags: music, outdoor, summer
```

#### Step 3: Run Integration Process
```bash
# Execute comprehensive merge
node scripts/merge-all-data.js

# Review processing report
# Check for duplicates and new additions
# Validate data quality in output
```

#### Step 4: Quality Assurance
1. **Manual Review**: Check sample of new entries for accuracy
2. **Test Loading**: Verify data loads correctly in application
3. **Cross-Reference**: Validate against original sources
4. **Tag Consistency**: Ensure tags follow established patterns

### Updating Existing Data

#### Individual Record Updates
1. **Locate Record**: Find entry by ID or title in appropriate CSV file
2. **Edit Directly**: Modify fields in CSV format
3. **Update Timestamp**: Change `lastUpdated` to current ISO date
4. **Test Changes**: Verify in application

#### Bulk Updates
1. **Export Subset**: Extract records needing updates
2. **Prepare Update File**: Create new file with changes
3. **Use Datarian**: Process through agent for validation
4. **Merge Results**: Apply changes to main data files

## 🔍 Data Quality Assurance

### Validation Checks

#### Required Field Validation
Ensure these fields are never empty:
- `id`
- `title` 
- `description`
- `location`
- `type`
- `lastUpdated`

#### Data Consistency Checks
- **Date Formats**: All dates in ISO format (YYYY-MM-DD)
- **URL Formats**: All websites start with `http://` or `https://`
- **Boolean Fields**: `lgbtqFriendly` only contains `true`, `false`, or valid descriptive text
- **Tag Format**: Tags are comma-separated, no spaces around commas

#### Content Quality Standards
- **Descriptions**: Minimum 50 characters, maximum 500 characters
- **Titles**: Descriptive and unique, avoid generic names
- **Locations**: Specific venue names or neighborhoods
- **Tags**: 3-8 relevant tags per entry

### Error Detection and Resolution

#### Common Data Issues
1. **Duplicate Entries**: Use Datarian's similarity detection
2. **Missing Information**: Flag incomplete records for manual review
3. **Outdated Content**: Regular review of event dates and pricing
4. **Broken Links**: Periodic URL validation

#### Resolution Procedures
```bash
# Generate data quality report
node scripts/validate-data.js > data-quality-report.txt

# Review issues and fix systematically
# Re-run validation after fixes
```

## 📈 Monitoring and Reporting

### Success Metrics
- **Data Completeness**: % of records with all required fields
- **Freshness**: Average age of content based on `lastUpdated`
- **Quality Score**: Composite metric of link health, description quality, etc.
- **Growth Rate**: New entries added per month
- **Duplicate Rate**: % of submissions identified as duplicates

### Monthly Reporting Template

```markdown
## Toronto Guide Data Report - [Month Year]

### Data Statistics
- Total Records: [number]
- New Additions: [number]
- Records Updated: [number]
- Duplicates Prevented: [number]

### Data Quality
- Completion Rate: [%]
- Broken Links Found: [number]
- Average Record Age: [days]

### Datarian Performance
- Processing Success Rate: [%]
- Average Processing Time: [minutes]
- Errors Encountered: [list]

### Action Items
- [ ] Priority fixes needed
- [ ] Content gaps identified
- [ ] System improvements planned
```

## 🛠 Troubleshooting Common Issues

### Datarian Processing Errors

#### "Parse Error" or "Invalid CSV"
```bash
# Check file encoding (should be UTF-8)
file -I src/new_data/problem-file.txt

# Verify delimiter consistency
head -5 src/new_data/problem-file.txt
```

#### "No New Records Found"
- Check source file format and content
- Verify file location in `src/new_data/`
- Ensure records have required fields (title, description)

#### "High Duplicate Count"
- Review similarity threshold (currently 85%)
- Check for legitimate variations of same event
- Consider manual review of flagged duplicates

### Data Integrity Issues

#### Missing Records After Update
1. **Check Backup**: Restore from backup if needed
2. **Review Logs**: Examine Datarian processing output
3. **Manual Recovery**: Re-add missing entries if necessary

#### Formatting Problems
1. **CSV Validation**: Ensure proper pipe-delimiter format
2. **Character Encoding**: Verify UTF-8 encoding
3. **Special Characters**: Escape pipes (|) in content with quotes

## 🎯 Best Practices

### Content Guidelines
1. **Be Specific**: Use detailed, descriptive titles and descriptions
2. **Stay Current**: Regular updates ensure relevance
3. **Include Context**: Add neighborhood, duration, skill level details
4. **Use Consistent Language**: Follow established tone and style
5. **Tag Strategically**: Use relevant, searchable tags

### Technical Guidelines
1. **Test Changes**: Always validate in development before production
2. **Backup First**: Automatic backups are created, but verify they exist
3. **Document Changes**: Use clear commit messages for data updates
4. **Monitor Performance**: Watch for file size and loading time impacts
5. **Version Control**: Track all changes through Git

### Workflow Optimization
1. **Batch Updates**: Process multiple changes together when possible
2. **Schedule Maintenance**: Use calendars to ensure regular updates
3. **Automate When Possible**: Leverage Datarian for routine tasks
4. **Collaborate Effectively**: Coordinate with team members on updates
5. **Plan Seasonally**: Prepare content updates in advance of seasons

## 📞 Support and Resources

### Documentation
- **Technical Specification**: `docs/TECHNICAL_SPECIFICATION.md`
- **Implementation Guide**: `IMPLEMENTATION_GUIDE.md`
- **Design System**: `DESIGN_SYSTEM.md`

### Development Tools
- **Datarian Agent**: `agent/datarian.ts`
- **Merge Scripts**: `scripts/merge-*.js`
- **Data Validation**: `scripts/validate-data.js` (create as needed)

### Contact and Escalation
For complex data issues or technical problems:
1. Review this guide and troubleshooting section
2. Check GitHub issues for similar problems
3. Create detailed issue report with:
   - Error messages or unexpected behavior
   - Steps to reproduce
   - Data files involved
   - Expected vs actual results

---

*Last Updated: [Current Date]*
*Datarian Version: 2.0*  
*Guide Version: 1.0* 