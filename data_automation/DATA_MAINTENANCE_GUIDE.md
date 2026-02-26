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

## How to load new data

**Use the step-by-step guide for adding or updating data.** No agents or automation are required.

- **[How to Load New Data](../docs/HOW_TO_LOAD_NEW_DATA.md)** – Which file to edit for each section (Scoop, Day Trips, Happy Hours, Amateur Sports, Sporting Events, LGBTQ+ Events), column order, and which scripts to run.

## Maintenance Schedules

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
1. Follow **[How to Load New Data](../docs/HOW_TO_LOAD_NEW_DATA.md)** for the relevant section (Scoop, Day Trips, etc.).
2. Edit the correct CSV (or JSON) in `public/data/` and run any script listed there (e.g. `merge-csv-to-json.js` for day trips).
3. Run `npm start` and verify in the browser.

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

#### 3. Analytics review (15 minutes)
- Review recent CSV changes (e.g. `git log --oneline public/data/`)
- Check data quality (required fields, date formats)
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

#### Step 1: Choose the right file
See **[How to Load New Data](../docs/HOW_TO_LOAD_NEW_DATA.md)**. Each section (Scoop, Day Trips, Happy Hours, Amateur Sports, Sporting Events, LGBTQ+ Events) has one primary CSV (or CSV + JSON for day trips). Use the column order shown there.

#### Step 2: Add or edit rows
- **Scoop:** Comma-delimited; append rows to `public/data/scoop_standardized.csv` (or use `scripts/add-toronto-events-2026-mar-may.js` for a batch).
- **Day trips:** Edit `public/daytrips_data.json` and `public/data/day_trips_standardized.csv`, then run `node scripts/merge-csv-to-json.js`.
- **Happy Hours / Amateur Sports / Sporting Events / LGBTQ+ Events:** Edit the corresponding CSV in `public/data/` with pipe-delimited rows matching the header.

#### Step 3: Run any required script
Only day trips need a script after editing: `node scripts/merge-csv-to-json.js`. Other sections: save the CSV and refresh the app.

#### Step 4: Quality assurance
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
1. **Export subset**: Extract records needing updates from the CSV.
2. **Edit**: Apply changes in a copy of the CSV or in place.
3. **Merge**: Paste or replace rows in the main file in `public/data/`. Keep column order and delimiter (comma for Scoop and Happy Hours, pipe for the rest).
4. **Verify**: Run the app and check the relevant section.

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
1. **Duplicate entries**: Search the CSV by title/id before adding; avoid re-adding the same event
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

### Data updates
- Records added/updated this month: [number]
- Scripts run (e.g. merge-csv-to-json): [list]
- Errors encountered: [list]

### Action Items
- [ ] Priority fixes needed
- [ ] Content gaps identified
- [ ] System improvements planned
```

## 🛠 Troubleshooting Common Issues

### CSV and format errors

#### Parse error or invalid CSV
- Save the file as **UTF-8**.
- **Scoop / Happy Hours:** Use comma (`,`) as delimiter; quote fields that contain commas.
- **Day trips / Amateur Sports / Sporting Events / LGBTQ+ Events:** Use pipe (`|`) as delimiter; quote fields that contain pipes.
- Check that the number of columns in each row matches the header.

#### New rows not showing
- Confirm the row was saved in the correct file under `public/data/`.
- Ensure required columns are filled (e.g. id, title, description, lastUpdated for Scoop).
- Hard-refresh the app or restart the dev server.

### Data Integrity Issues

#### Missing records after update
1. **Restore from backup** if you kept a copy of the CSV before editing.
2. **Re-add missing rows** using the column order in [How to Load New Data](../docs/HOW_TO_LOAD_NEW_DATA.md).

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
3. **Follow the docs**: Use [How to Load New Data](../docs/HOW_TO_LOAD_NEW_DATA.md) for routine adds and updates
4. **Collaborate Effectively**: Coordinate with team members on updates
5. **Plan Seasonally**: Prepare content updates in advance of seasons

## 📞 Support and Resources

### Documentation
- **Technical Specification**: `docs/TECHNICAL_SPECIFICATION.md`
- **Implementation Guide**: `IMPLEMENTATION_GUIDE.md`
- **Design System**: `DESIGN_SYSTEM.md`

### Documentation and scripts
- **How to load new data**: [docs/HOW_TO_LOAD_NEW_DATA.md](../docs/HOW_TO_LOAD_NEW_DATA.md)
- **Content guide (where to add what)**: [docs/SCOOP_CONTENT_GUIDE.md](../docs/SCOOP_CONTENT_GUIDE.md)
- **Scripts**: `scripts/add-toronto-events-2026-mar-may.js`, `scripts/merge-csv-to-json.js`, `scripts/add-winter-activities.js`, `scripts/add-thermal-spa-daytrips.js`

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

*Last updated: see How to Load New Data (docs/HOW_TO_LOAD_NEW_DATA.md).* 