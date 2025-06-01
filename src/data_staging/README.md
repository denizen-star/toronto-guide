# Data Staging Workflow

This directory serves as a temporary staging area for data files that need to be processed before being integrated into the main dataset.

## Current Data Files

- `tor_lgbt1.txt` - Primary LGBTQ+ sports and recreation data
  - Contains detailed information about sports clubs, leagues, and recreational activities
  - Includes contact information, locations, and scheduling details
  - Last updated: May 31, 2025

- `tor_lgbt2.txt` - Additional LGBTQ+ venue data
  - Supplementary information about venues and facilities
  - Includes accessibility information and amenities

- `tor_lgbt3.txt` - Extended community resources
  - Additional community resources and support services
  - Cross-referenced with main activities data

## Workflow Steps

1. **File Upload**: Files are uploaded to this staging directory (`src/data_staging/`)
2. **Validation**: Files are validated for correct format and required fields
3. **Processing**: Files are processed by the Datarian agent
4. **Integration**: Processed data is merged into the main dataset
5. **Cleanup**: Staging files are automatically deleted after successful processing

## Logging System

The staging process is now integrated with the project's comprehensive logging system:

### Log Categories
- Data validation events
- Processing status updates
- Integration confirmations
- Error tracking
- Performance metrics

### Log Access
- Logs can be viewed in the admin dashboard
- Real-time monitoring available
- Historical data retained for 30 days

### Error Handling
- Validation errors are logged with detailed context
- Processing failures trigger automatic notifications
- Recovery procedures are documented in logs

## Important Notes

- All files in this directory are considered temporary and will be deleted after processing
- The staging directory should be empty after each processing cycle
- If processing fails, files will remain for debugging purposes

## File Naming Conventions

- Use descriptive prefixes for data types (e.g., `lgbt_`, `events_`, etc.)
- Include version numbers if multiple versions exist
- Use `.txt` extension for raw data files

## Security

- Do not store sensitive data in staging
- All files should be considered public
- No credentials or private information should be included

## Automated Cleanup

The Datarian agent automatically handles:
- Processing of staged files
- Integration with main dataset
- Deletion of successfully processed files
- Log rotation and archival 