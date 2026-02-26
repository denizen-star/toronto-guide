# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-09-19

### 🚀 Major Release - Project Restructuring & Separation

#### Added
- **Independent Optimizer Project**: Separated planner React app into standalone "Optimizer" project
- **Local Archive System**: Created separate LifePlanner-Archiver for historical files (not under version control)
- **Enhanced Documentation**: Comprehensive project cleanup and separation summaries

#### Changed
- **BREAKING**: Removed planner React app from main repository
- **Project Structure**: Cleaned and organized codebase for modular development
- **Version**: Major version bump to 2.0.0 reflecting significant architectural changes

#### Removed
- **Archive from Git**: Moved 1.2GB of archived content to local-only storage
- **Planner Dependencies**: Removed planner-specific packages and build artifacts
- **Legacy Files**: Archived 139,436+ unused/historical files

#### Technical Details
- Separated Optimizer as 100% independent React application
- Updated .gitignore to exclude archive directories from version control
- Preserved all functionality while significantly reducing repository size
- Clean foundation established for future modular architecture

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-06-05

### Added
- Initial stable release
- Complete Toronto guide application
- Boulder guide integration
- Happy Hours feature
- LGBT Events section
- Day Trips functionality
- Material-UI based modern interface
- Enhanced filtering system
- Search functionality
- Responsive design
- CSV data management
- Setup script for data initialization

### Changed
- Upgraded all dependencies to latest stable versions
- Optimized performance with React hooks
- Improved error handling
- Enhanced user interface components

### Fixed
- Compilation warnings and errors
- Development environment setup
- Data loading issues
- Filter system bugs 