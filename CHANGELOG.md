# Changelog

All notable changes to this project will be documented in this file.

## [3.0.0] - 2026-02-26

### Major Release - Production Readiness, Scroll Fix & Deployment

This release fixes site-wide scrolling, corrects production deployment (Netlify), and adds content and links so the app works correctly at to-guide.kervinapps.com.

#### Fixed

- **Site-wide scrolling**
  - Pages (Day Trips, LGBTQ+ Events, Happy Hours, etc.) did not scroll; content was clipped.
  - Root cause: `html`/`body` height and overflow, and MUI CssBaseline overrides (`#root` flex, `body` overflow), prevented a proper scroll container.
  - **Changes:**
    - `src/index.css`: Body is the scroll container: `html { height: 100%; overflow: hidden }`, `body { height: 100%; overflow-y: auto }` so the viewport-sized body scrolls when content overflows.
    - `src/theme-new.ts`: Removed MUI CssBaseline overrides for `#root` (display flex, flex-direction column) and for `body` (overflow-y: scroll) so layout is not constrained.
  - All list and detail pages now scroll correctly on local and production.

- **Production deployment (Netlify)**
  - Live site at to-guide.kervinapps.com showed old or wrong content; new pages and fixes did not appear.
  - **Root causes:**
    - Netlify was publishing the `Toronto-guide/` folder (static repo content) instead of the React build output.
    - `package.json` had `"homepage": "https://kervinapps.com"`, so built assets pointed to the wrong origin when the app was served from to-guide.kervinapps.com.
  - **Changes:**
    - `netlify.toml`: Set `command = "npm run build"` and `publish = "build"` so Netlify builds the React app and publishes the `build/` directory.
    - `package.json`: Set `"homepage": "."` so asset paths are relative and the app loads on any domain (to-guide.kervinapps.com).
    - Added SPA redirects in `netlify.toml`: `/planner/*` to `/planner/index.html`, and `/*` to `/index.html` for client-side routes.
  - Production now serves the built React app with the latest code.

- **Production branch (Netlify)**
  - Production deploys were from branch `toguide-august-v1.1.0` at an old commit; merges to `main` did not update the live site.
  - **Change:** Merged `main` into `toguide-august-v1.1.0` and resolved merge conflict in `netlify.toml` (combined build config, NODE_VERSION, redirects, and security/cache headers). Production branch now has all fixes and deploys correctly.

#### Added

- **LGBTQ+ Events – YOHOMO link**
  - In `src/pages/LgbtEvents.tsx`: Added a line in the page header under the subtitle: “For more queer arts, nightlife, and events: **YOHOMO** (yohomo.ca).” with a link to https://www.yohomo.ca (opens in a new tab).
  - Link styling: underlined, font-weight 600, for visibility.

- **Day Trips content**
  - Thermal baths/spa day trips (from commit 96be912).
  - Winter day trips: 35 winter activities (ski, snowboard, tubing, skating, sleigh rides, ice fishing, spa, etc.) and improved season filter from `booking.seasonal_availability` (commit ffe97de).

- **Documentation**
  - SCOOP content guide (`docs/SCOOP_CONTENT_GUIDE.md`) referencing YOHOMO and data sources for LGBTQ+ and other content.

#### Changed

- **Netlify configuration**
  - Single `netlify.toml` combines: build command and publish directory, NODE_VERSION 18, `/planner/*` and SPA `/*` redirects, security headers (X-Frame-Options, X-XSS-Protection, X-Content-Type-Options, Referrer-Policy), and cache headers for `/static/*`.
  - Resolved merge conflict when bringing `main` into `toguide-august-v1.1.0`.

- **Layout export**
  - Restored `useSearch` export in `src/components/Layout.tsx` (had been removed during scroll debugging); all pages that use the search placeholder compile and run correctly.

#### Technical summary

- **Scroll:** Body as scroll container; MUI baseline overrides removed so document height and overflow behave correctly.
- **Deploy:** Publish `build/`, relative `homepage`, and correct production branch so to-guide.kervinapps.com serves the current app.
- **Content:** YOHOMO link on LGBTQ+ Events, new day trip data and filters, SCOOP guide.

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