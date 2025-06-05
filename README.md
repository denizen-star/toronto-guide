# Toronto Guide Project

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-stable-green.svg)

## Overview
A comprehensive guide to Toronto's LGBTQ+ friendly spaces and activities, with a focus on sports and recreational activities.

## Project Structure
- `/src/data_staging/` - Contains raw data files for processing
  - `tor_lgbt1.txt` - Primary LGBTQ+ sports and recreation data
  - `tor_lgbt2.txt` - Additional LGBTQ+ venue data
  - `tor_lgbt3.txt` - Extended community resources data

## Development Setup

### Prerequisites
- Node.js (latest LTS version)
- npm (comes with Node.js)

### Installation
```bash
npm install
```

### Running the Development Server
```bash
npm start
```
The application will be available at:
- Local: http://localhost:3004
- Network: http://192.168.1.84:3004

## Logging System
The project implements a comprehensive logging system that tracks:
- Data processing events
- User interactions
- System health metrics
- API integrations
- Error tracking and debugging information

Logs are stored in structured format and can be accessed through the admin dashboard.

## Available Scripts

### `npm start`
Runs the app in development mode at http://localhost:3004

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run workflow:status`
Shows the current status of data processing workflows.

## Documentation
- Main documentation: `/README.md`
- Data automation: `/data_automation/README.md`
- Data staging: `/src/data_staging/README.md`
- Workflow system: `/docs/WORKFLOW_SYSTEM_README.md`
- Curator management: `/guides/curator-management/README.md`

## Contributing
Please refer to the curator management guide for information on how to contribute data or make updates to existing entries.

## License
This project is proprietary and confidential.
