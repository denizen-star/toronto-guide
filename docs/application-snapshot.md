# Toronto Guide Application Snapshot
*Documentation created on June 5, 2025*

## Project Overview
The Toronto Guide is a web application providing comprehensive information about Toronto's attractions, activities, and points of interest. This document provides a snapshot of the application's current state and structure.

## Technical Stack
Based on package.json and configuration files:
- Framework: React with TypeScript
- Build System: Custom webpack configuration (via config-overrides.js)
- Style Management: CSS Modules
- Code Quality: ESLint for linting

## Project Structure
```
toronto-guide/
├── src/               # Source code
├── public/           # Static assets
├── docs/             # Documentation
├── guides/           # Guide content
├── data/             # Data files
├── scripts/          # Utility scripts
├── design-mockups/   # UI/UX designs
├── data_automation/  # Data processing scripts
└── build/           # Compiled output
```

## Key Documentation
The project maintains several critical documentation files:
- `TECHNICAL_SPECIFICATION.txt` - Technical requirements and architecture
- `DESIGN_SYSTEM.md` - UI/UX guidelines and components
- `IMPLEMENTATION_GUIDE.md` - Development guidelines
- `CSV_UPDATE_GUIDE.md` - Data update procedures
- `PAGE_CONTENT_DESCRIPTION.txt` - Content structure
- `CURATOR_TEST_RESULTS.md` - Testing documentation

## Version Control
- Current Version: See VERSION file
- Branch Strategy:
  - `main`: Production-ready code
  - `develop`: Active development
- Backup Tag: `backup-main-20250605`

## Build and Deploy
The application uses:
- Node.js build system
- Custom webpack configuration
- TypeScript compilation
- ESLint for code quality

## Data Management
- Data stored in `/data` directory
- Automation scripts in `/data_automation`
- CSV update procedures documented

## Design Assets
- Design mockups stored in `/design-mockups`
- Design system documentation available
- UI/UX guidelines in place

## Testing
- Test results documented in CURATOR_TEST_RESULTS.md
- Testing framework configured

## Current Features
1. Core Application Features
   - Toronto attractions database
   - Interactive city guides
   - Location-based services

2. User Interface
   - Responsive design
   - Modern UI components
   - Accessibility features

3. Data Management
   - Automated data processing
   - Content curation system
   - Regular updates pipeline

## Known Issues and TODOs
(This section should be updated based on current GitHub Issues)

## Dependencies
Key dependencies from package.json:
- React
- TypeScript
- ESLint
- Additional dependencies as listed in package.json

## Configuration
The application uses several configuration files:
- `tsconfig.json` for TypeScript
- `.eslintrc.json` for linting
- `config-overrides.js` for build customization

## Development Environment
Requirements:
- Node.js
- npm/yarn
- Git

## Backup and Recovery
- Backup documentation available in `docs/backup-restoration.md`
- Latest backup tag: `backup-main-20250605`

## Additional Notes
- The project follows a modular architecture
- Documentation is maintained alongside code
- Regular backups are created for major changes

---

*This snapshot documentation was automatically generated and represents the state of the application as of June 5, 2025. For the most up-to-date information, please consult the relevant documentation files and source code.* 