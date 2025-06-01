# Data Staging Workflow

This directory serves as a temporary staging area for data files that need to be processed before being integrated into the main dataset.

## Workflow Steps

1. **File Upload**: Files are uploaded to this staging directory (`src/data_staging/`)
2. **Processing**: Files are processed by the Datarian agent
3. **Integration**: Processed data is merged into the main dataset
4. **Cleanup**: Staging files are automatically deleted after successful processing

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