# Toronto Guide - Technical Specification

## Executive Summary

The Toronto Guide is a sophisticated lifestyle concierge web application built with React and TypeScript, designed for adults 30+ seeking curated Toronto experiences. The platform employs Swiss-inspired design principles and provides systematic access to premium activities, dining, sports, events, and day trips across the Greater Toronto Area.

## Product Overview

### Core Mission
Transform how discerning adults discover and engage with Toronto's cultural landscape through precision-curated recommendations and streamlined user experience.

### Target Audience
- **Primary:** Adults aged 30-75 with disposable income
- **Secondary:** Toronto residents seeking premium experiences
- **Tertiary:** Local businesses looking for quality exposure

### Key Value Propositions
- **Systematic Curation:** 200+ hand-selected venues across 15 districts
- **Quality Focus:** Premium experiences over quantity
- **Swiss Design Methodology:** Clean, functional, sophisticated interface
- **Data-Driven:** Structured content management for scalability

## Architecture Overview

### Technology Stack

#### Frontend Framework
- **React 18.2.0** - Modern component-based architecture
- **TypeScript 4.9.5** - Type safety and enhanced developer experience
- **React Router DOM 6.22.0** - Client-side routing and navigation

#### UI Framework & Styling
- **Material-UI (MUI) 5.15.11** - Component library for consistent UI
- **Emotion 11.11.3** - CSS-in-JS styling solution
- **Swiss Design System** - Custom design tokens and components

#### State Management
- **React Hooks** - Built-in state management (useState, useEffect)
- **CSV Data Sources** - Static data management via local files

#### Build & Development Tools
- **Create React App 5.0.1** - Build toolchain and development server
- **React App Rewired 2.2.1** - Custom build configuration
- **Web Vitals 2.1.4** - Performance monitoring
- **Testing Library** - Component and integration testing

#### Data Management
- **PapaParse 5.5.3** - CSV parsing for content management
- **Date-fns 2.30.0** - Date manipulation and formatting
- **MUI Date Pickers 6.19.5** - Date selection components

#### Workflow Automation
- **Node.js** - Backend automation and data processing
- **Winston 3.11.0** - Structured logging system
- **Node-cron** - Scheduled task execution
- **Nodemailer** - Email notifications
- **Axios** - HTTP client for external API calls

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                          │
├─────────────────────────────────────────────────────────────┤
│  React Components (Presentational)                         │
│  ├── Pages (Home, Activities, Details, etc.)               │
│  ├── Layout Components (Navigation, Layout)                │
│  ├── UI Components (Cards, Filters, Search)                │
│  └── Form Components (Inputs, Buttons)                     │
├─────────────────────────────────────────────────────────────┤
│                    State Management                         │
│  ├── Local Component State (React Hooks)                   │
│  ├── URL State (React Router)                              │
│  └── Computed State (Filtering, Search)                    │
├─────────────────────────────────────────────────────────────┤
│                      Data Layer                             │
│  ├── CSV Files (Static Content)                            │
│  ├── Data Processing (PapaParse)                           │
│  └── Setup Scripts (Data Initialization)                   │
├─────────────────────────────────────────────────────────────┤
│                Workflow Automation Layer                    │
│  ├── Weekly Maintenance (Data validation, link checking)   │
│  ├── Monthly Processing (New data integration)             │
│  ├── Quarterly Analysis (Deep audits, optimization)        │
│  └── Notification System (Email, Slack alerts)             │
├─────────────────────────────────────────────────────────────┤
│                  Logging & Monitoring                       │
│  ├── Winston Logger (JSON Structured Logs)                 │
│  ├── Log Rotation & Retention                              │
│  ├── System Monitoring                                     │
│  └── Performance Metrics                                   │
├─────────────────────────────────────────────────────────────┤
│                  Hosting & Deployment                       │
│  ├── Netlify Static Hosting                                │
│  ├── CDN Distribution                                       │
│  └── Automatic Deployments                                 │
└─────────────────────────────────────────────────────────────┘
```

## Navigation Structure

### Primary Navigation
1. **Home** (`/`) - Landing page with overview and quick access
2. **Play** (`/amateur-sports`) - Local sports and recreational activities
3. **The Scoop** (`/scoop`) - Comprehensive activities and events
4. **Day Trips** (`/day-trips`) - Day trip destinations and itineraries
5. **Happy Hours** (`/happy-hours`) - Nightlife and entertainment venues
6. **LGBTQ+** (`/lgbtq-events`) - LGBTQ+ community events and activities
7. **Sports** (`/sporting-events`) - Professional sporting events
8. **Today** (`/todayintoronto`) - Today's events and activities
9. **Tomorrow** (`/tomorrowintoronto`) - Tomorrow's events and activities

### Secondary Navigation
- **Detail Pages** - Individual item pages for each category
- **Search Functionality** - Global search across all content
- **Filter Systems** - Category-specific filtering and sorting

### Mobile Navigation
- **Hamburger Menu** - Collapsible mobile navigation
- **Touch-Optimized** - Mobile-first interaction design
- **Progressive Enhancement** - Functional without JavaScript

## Content Management System

### Data Structure

#### Core Data Entities
```typescript
interface Activity {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  website?: string;
  tags: string[];
  lastUpdated: string;
  categoryId: string;
  neighborhood?: string;
  city: string;
}

interface StandardizedEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  website?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  cost?: string;
  lgbtqFriendly?: boolean;
  tags: string[];
  lastUpdated: string;
}

interface Location {
  id: string;
  name: string;
  address: string;
  district: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
```

#### Data Sources (CSV Files)
- **activities.csv** - Core activity listings (119 entries)
- **happy_hours.csv** - Nightlife venues (371 entries)
- **day_trips_standardized.csv** - Day trip destinations (106 entries)
- **amateur_sports_standardized.csv** - Sports activities (55 entries)
- **sporting_events_standardized.csv** - Professional sports (44 entries)
- **special_events_standardized.csv** - Cultural events (45 entries)
- **scoop_standardized.csv** - Comprehensive activities and events
- **lgbt_events_standardized.csv** - LGBTQ+ community events
- **locations.csv** - Venue locations (148 entries)
- **categories.csv** - Content categorization (11 categories)
- **tags.csv** - Content tagging system (39 tags)
- **schedules.csv** - Timing information (261 entries)
- **prices.csv** - Pricing data (73 entries)

## Workflow Automation System

### Overview
The Toronto Guide includes a comprehensive automated data maintenance and workflow orchestration system that implements three maintenance schedules:

### Weekly Maintenance (Mondays 6:00 AM)
- **Data Validation**: CSV format validation and integrity checks
- **Link Checker**: URL and Google Maps link validation
- **Backup Verification**: Verify existing backups integrity
- **Recent Changes**: Monitor and report recent data changes

### Monthly Maintenance (First Friday 2:00 AM)
- **Pre-processing**: Data cleanup and standardization
- **Data Integration**: Process new data from `src/new_data/`
- **Content Enrichment**: Update seasonal dates, enhance tags
- **Analytics**: Generate comprehensive reports
- **Post-processing**: Cleanup and optimization

### Quarterly Maintenance (15th of Jan/Apr/Jul/Oct 1:00 AM)
- **Deep Audit**: Comprehensive data quality analysis
- **Schema Review**: Validate data structure and standards
- **Optimization**: Performance improvements and cleanup
- **Strategic Analysis**: Long-term trend analysis and recommendations

### System Components
- **Workflow Orchestrator** - Central coordination engine
- **Task Modules** - Data validation, link checking, backup management
- **Notification Service** - Email and Slack alerts
- **Metrics Collector** - Performance tracking and analysis
- **Logging System** - Structured logging with Winston

### Available Commands
```bash
# Manual workflow execution
npm run workflow:weekly
npm run workflow:monthly
npm run workflow:quarterly

# System management
npm run workflow:status
npm run workflow:report
npm run workflow:config

# Testing
npm run workflow:test data-validation
npm run workflow:test link-checker

# Automation
npm run workflow:schedule
```

## Page Components

### Core Pages
1. **Home** (`src/pages/Home.tsx`) - Landing page with feature cards and quick access
2. **Activities** (`src/pages/Activities.tsx`) - Cultural activities and attractions
3. **Scoop** (`src/pages/Scoop.tsx`) - Comprehensive activities and events listing
4. **Day Trips** (`src/pages/DayTrips.tsx`) - Day trip destinations
5. **Amateur Sports** (`src/pages/AmateurSports.tsx`) - Recreational sports activities
6. **Sporting Events** (`src/pages/SportingEvents.tsx`) - Professional sports events
7. **LGBTQ+ Events** (`src/pages/LgbtEvents.tsx`) - LGBTQ+ community events
8. **Happy Hours** (`src/pages/HappyHours.tsx`) - Nightlife venues
9. **Special Events** (`src/pages/SpecialEvents.tsx`) - Cultural events and festivals

### Detail Pages
- **ActivityDetails** (`src/pages/ActivityDetails.tsx`) - Individual activity information
- **DayTripDetails** (`src/pages/DayTripDetails.tsx`) - Day trip details
- **SportingEventDetails** (`src/pages/SportingEventDetails.tsx`) - Sports event details
- **SpecialEventDetails** (`src/pages/SpecialEventDetails.tsx`) - Event details
- **LgbtEventDetails** (`src/pages/LgbtEventDetails.tsx`) - LGBTQ+ event details

### Core Components
- **Navigation** (`src/components/Navigation.tsx`) - Main navigation with search
- **Layout** (`src/components/Layout.tsx`) - Page layout wrapper
- **EnhancedFilterSystem** (`src/components/EnhancedFilterSystem.tsx`) - Advanced filtering
- **MinimalistCard** (`src/components/MinimalistCard.tsx`) - Content display cards
- **LazyImage** (`src/components/LazyImage.tsx`) - Optimized image loading
- **ContentReviewAdmin** (`src/components/ContentReviewAdmin.tsx`) - Admin interface

## Data Management System

### Overview
The Toronto Guide includes a comprehensive data management system powered by automated workflows. The system focuses on maintaining data quality, standardization, and validation across all content types.

### Data Model
The system uses a standardized data model across all content types with the following key fields:
- **id**: Unique identifier
- **title**: Content title
- **description**: Detailed description
- **location**: Physical location
- **type**: Content category
- **website**: External URL
- **image**: Image URL
- **startDate**: Event start date (ISO format)
- **endDate**: Event end date (ISO format)
- **registrationDeadline**: Registration cutoff date
- **duration**: Activity duration
- **activityDetails**: Additional activity information
- **cost**: Pricing information
- **travelTime**: Time to reach from Toronto
- **googleMapLink**: Location mapping link
- **lgbtqFriendly**: LGBTQ+ inclusivity flag
- **tags**: Comma-separated category tags
- **lastUpdated**: ISO timestamp of last modification

### Data Files Structure
```
public/data/
├── activities.csv (119 records)
├── day_trips_standardized.csv (106 records)  
├── sporting_events_standardized.csv (44 records)
├── amateur_sports_standardized.csv (55 records)
├── special_events_standardized.csv (45 records)
├── scoop_standardized.csv (comprehensive activities)
├── lgbt_events_standardized.csv (LGBTQ+ events)
├── happy_hours.csv (371 records)
└── [supporting files: locations.csv, categories.csv, etc.]
```

## Technical Implementation

### Development Workflow

#### Local Development
```bash
# Start development server
npm start  # Runs on http://localhost:3000

# Run tests
npm test

# Build for production
npm run build
```

#### Data Management
```javascript
// setupData.js - Preprocesses CSV data
const Papa = require('papaparse');
const fs = require('fs');

// Converts CSV files to JSON for runtime consumption
function processDataFiles() {
  // Parse and validate CSV data
  // Generate optimized JSON structures
  // Create search indexes
}
```

#### Component Architecture
```typescript
// Example component structure
const ActivityDetails: React.FC = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load activity data
    // Handle error states
    // Update document title
  }, [id]);
  
  return (
    <Layout>
      <ActivityCard activity={activity} />
      <RelatedActivities category={activity?.category} />
    </Layout>
  );
};
```

### Deployment Strategy

#### Netlify Configuration
- **Build Command:** `npm run build`
- **Publish Directory:** `build/`
- **Environment:** Node.js 18.x
- **Redirects:** SPA fallback to index.html
- **Headers:** Cache optimization for static assets

#### Performance Targets
- **Lighthouse Score:** 90+ for all metrics
- **First Contentful Paint:** <1.5s
- **Largest Contentful Paint:** <2.5s
- **Time to Interactive:** <3.0s
- **Cumulative Layout Shift:** <0.1

#### SEO Optimization
- **Meta Tags** - Dynamic title and description
- **Open Graph** - Social media previews
- **Structured Data** - JSON-LD for rich snippets
- **Sitemap** - Automated sitemap generation

## Security & Privacy

### Data Protection
- **No Personal Data Collection** - Application doesn't collect user information
- **Static Content** - All data is publicly available content
- **HTTPS Only** - Secure connections for all external links
- **Content Validation** - Automated validation of external URLs

### Access Control
- **Public Content** - All content is publicly accessible
- **Admin Interface** - Protected admin panel for content management
- **Authentication** - JWT-based authentication for admin access
- **Role-Based Access** - Different permission levels for content management

## Performance Optimization

### Frontend Optimization
- **Code Splitting** - Lazy loading of non-critical components
- **Image Optimization** - WebP format with fallbacks
- **Bundle Optimization** - Tree shaking and minification
- **Caching Strategy** - Aggressive caching for static assets

### Backend Optimization
- **Static Site Generation** - Pre-built pages for fast loading
- **CDN Distribution** - Global content delivery network
- **Data Preprocessing** - Optimized data structures at build time
- **Workflow Efficiency** - Parallel processing for maintenance tasks

### Monitoring & Analytics
- **Web Vitals** - Core Web Vitals monitoring
- **Error Tracking** - Comprehensive error logging
- **Performance Metrics** - Real-time performance monitoring
- **User Analytics** - Privacy-focused usage analytics

## Accessibility

### Standards Compliance
- **WCAG 2.1 AA** - Web accessibility standards
- **Keyboard Navigation** - Full keyboard accessibility
- **Screen Reader Support** - Semantic HTML and ARIA labels
- **Color Contrast** - High contrast ratios for readability

### Mobile Accessibility
- **Touch Targets** - Adequate touch target sizes
- **Responsive Design** - Mobile-first responsive layout
- **Gesture Support** - Touch-friendly interactions
- **Performance Focus** - Fast loading on all devices

## Future Roadmap

### Planned Enhancements
- **Real-time Updates** - Live content updates via WebSocket
- **Advanced Search** - Elasticsearch integration for better search
- **User Accounts** - Personalized recommendations and favorites
- **Mobile App** - Native mobile application development
- **API Integration** - Third-party API integrations for real-time data

### Scalability Considerations
- **Microservices Architecture** - Modular backend services
- **Database Migration** - PostgreSQL for dynamic content
- **Cloud Infrastructure** - AWS/Azure deployment options
- **Internationalization** - Multi-language support preparation

---

## Summary

The Toronto Guide represents a sophisticated approach to lifestyle content curation, combining Swiss design principles with modern web technologies and automated data management. The platform's architecture supports both current needs and future scalability, with comprehensive workflow automation ensuring data quality and system reliability. 