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
- **Emotion 11.14.0** - CSS-in-JS styling solution
- **Swiss Design System** - Custom design tokens and components

#### State Management
- **React Hooks** - Built-in state management (useState, useEffect)
- **CSV Data Sources** - Static data management via local files

#### Build & Development Tools
- **Create React App 5.0.1** - Build toolchain and development server
- **Web Vitals 2.1.4** - Performance monitoring
- **Testing Library** - Component and integration testing

#### Data Management
- **PapaParse 5.5.3** - CSV parsing for content management
- **Date-fns 2.30.0** - Date manipulation and formatting
- **MUI Date Pickers** - Date selection components

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
3. **Activities** (`/activities`) - Cultural activities and attractions
4. **Happy Hours** (`/happy-hours`) - Nightlife and entertainment venues
5. **Trips** (`/day-trips`) - Day trip destinations and itineraries
6. **Culture** (`/special-events`) - Cultural events and exhibitions
7. **Sports** (`/sporting-events`) - Professional sporting events

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
  name: string;
  category: string;
  subcategory: string;
  description: string;
  location: string;
  district: string;
  price_range: string;
  tags: string[];
  website: string;
  rating: number;
  hours: string;
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

interface Event {
  id: string;
  title: string;
  type: string;
  venue: string;
  date: string;
  time: string;
  price: string;
  description: string;
}
```

#### Data Sources (CSV Files)
- **activities.csv** - Core activity listings (62 entries)
- **happy_hours.csv** - Nightlife venues (371 entries)
- **day_trips.csv** - Day trip destinations (37 entries)
- **amateur_sports.csv** - Sports activities (37 entries)
- **sporting_events.csv** - Professional sports (13 entries)
- **special_events.csv** - Cultural events (13 entries)
- **locations.csv** - Venue locations (148 entries)
- **categories.csv** - Content categorization (11 categories)
- **tags.csv** - Content tagging system (39 tags)
- **schedules.csv** - Timing information (261 entries)
- **prices.csv** - Pricing data (73 entries)

## UI Components & Design System

### Core Components

#### Layout Components
- **Navigation.tsx** - Primary navigation with search functionality
- **Layout.tsx** - Main layout wrapper with header and content area
- **Section.tsx** - Content section wrapper with consistent spacing

#### Content Components
- **MinimalistCard.tsx** - Primary content display card
- **MultiSelectFilter.tsx** - Advanced filtering interface
- **Quick Access Grid** - Category-based navigation shortcuts

#### Design Principles
- **Swiss Design Methodology** - Clean, functional, grid-based layouts
- **Bauhaus Inspiration** - Geometric forms and rational typography
- **Material Design Integration** - Consistent interaction patterns

### Color System
```css
:root {
  /* Primary Palette */
  --color-charcoal: #1A1A1A;        /* Primary text */
  --color-warm-taupe: #F5F3F0;      /* Light backgrounds */
  --color-soft-gray: #E8E6E3;       /* Borders, dividers */
  --color-deep-slate: #4A4A4A;      /* Secondary text */
  
  /* Accent Colors */
  --color-elegant-coral: #E85A4F;   /* Primary CTAs */
  --color-accent-sage: #A8B5A0;     /* Secondary accents */
  --color-refined-gold: #D4AC0D;    /* Premium features */
  --color-cool-mint: #7FB3D3;       /* Links, interactive */
}
```

### Typography Scale
- **H1 Hero:** 48px/52px - Homepage hero titles
- **H2 Section:** 32px/36px - Major section headers
- **H3 Subsection:** 24px/28px - Subsection titles
- **H4 Card Title:** 18px/24px - Card headers
- **Body Text:** 16px/24px - Primary content
- **Small Text:** 14px/20px - Secondary content

### Grid System
- **Desktop:** 12-column grid (1200px+ containers)
- **Tablet:** 8-column grid (768px-1199px)
- **Mobile:** 4-column grid (<768px)
- **Spacing:** 8px base unit system

## Feature Specifications

### Search & Discovery

#### Global Search
- **Implementation:** Real-time filtering across all content types
- **Scope:** Names, descriptions, categories, tags, locations
- **Performance:** Client-side search with debounced input
- **UI:** Prominent search bar in navigation (hidden on home page)

#### Advanced Filtering
- **Category Filters** - Primary content type selection
- **District Filters** - Geographic area selection
- **Price Range Filters** - Budget-based filtering
- **Tag-based Filters** - Interest-based categorization
- **Date Filters** - Time-sensitive content filtering

#### Sorting Options
- **Relevance** - Search result ranking
- **Price** - Low to high, high to low
- **Rating** - Highest rated first
- **Distance** - Geographic proximity
- **Alphabetical** - A-Z sorting

### Content Categories

#### Activities (`/activities`)
- **Museums & Galleries** - Cultural institutions
- **Tours & Experiences** - Guided activities
- **Entertainment** - Shows and performances
- **Outdoor Activities** - Parks and recreation

#### Happy Hours (`/happy-hours`)
- **Rooftop Bars** - Elevated experiences
- **Wine Bars** - Curated wine selections
- **Craft Cocktail Lounges** - Artisanal beverages
- **Restaurant Happy Hours** - Dining specials

#### Day Trips (`/day-trips`)
- **Wine Country** - Niagara region experiences
- **Historic Towns** - Cultural destinations
- **Natural Areas** - Conservation and parks
- **Seasonal Activities** - Weather-dependent options

#### Amateur Sports (`/amateur-sports`)
- **Golf Courses** - Public and private courses
- **Tennis Facilities** - Court rentals and lessons
- **Fitness Classes** - Group exercise options
- **Recreational Leagues** - Team sports participation

#### Special Events (`/special-events`)
- **Art Exhibitions** - Gallery openings and shows
- **Cultural Festivals** - Community celebrations
- **Seasonal Events** - Holiday and seasonal activities
- **Educational Programs** - Workshops and lectures

#### Sporting Events (`/sporting-events`)
- **Toronto Maple Leafs** - NHL hockey games
- **Toronto Raptors** - NBA basketball games
- **Toronto FC** - MLS soccer matches
- **Special Sporting Events** - Seasonal tournaments

### User Experience Features

#### Responsive Design
- **Mobile-First** - Primary design target for touch interfaces
- **Progressive Enhancement** - Enhanced features for larger screens
- **Touch Optimization** - Finger-friendly interactive elements
- **Performance Focus** - Fast loading on all devices

#### Accessibility
- **WCAG 2.1 AA Compliance** - Web accessibility standards
- **Keyboard Navigation** - Full keyboard accessibility
- **Screen Reader Support** - Semantic HTML and ARIA labels
- **Color Contrast** - High contrast ratios for readability

#### Performance Optimization
- **Static Site Generation** - Pre-built pages for fast loading
- **Image Optimization** - WebP format with fallbacks
- **Code Splitting** - Lazy loading of non-critical components
- **CDN Distribution** - Global content delivery network

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
- **No User Data Collection** - Privacy-focused approach
- **Static Site Security** - No server vulnerabilities
- **HTTPS Enforcement** - SSL/TLS encryption
- **Content Security Policy** - XSS protection

### Performance Monitoring
- **Web Vitals** - Core performance metrics
- **Error Tracking** - Runtime error monitoring
- **Analytics** - Privacy-compliant usage analytics
- **A/B Testing** - Feature optimization testing

## Scalability & Maintenance

### Content Management
- **CSV-Based CMS** - Simple content updates
- **Version Control** - Git-based content versioning
- **Automated Validation** - Data integrity checks
- **Bulk Updates** - Efficient content management

### Feature Expansion
- **Modular Architecture** - Easy feature addition
- **API Integration** - Future dynamic data sources
- **User Accounts** - Optional user personalization
- **Booking Integration** - Third-party reservation systems

### Technical Debt Management
- **TypeScript** - Type safety and refactoring support
- **Testing Strategy** - Component and integration tests
- **Code Quality** - ESLint and Prettier configuration
- **Documentation** - Inline code documentation

## Business Intelligence

### Analytics Framework
- **User Journey Tracking** - Path analysis through content
- **Content Performance** - Popular categories and items
- **Search Analytics** - Query analysis and optimization
- **Conversion Metrics** - External link engagement

### Growth Metrics
- **Page Views** - Content consumption patterns
- **Session Duration** - User engagement depth
- **Bounce Rate** - Content relevance indicators
- **Return Visitors** - Platform value assessment

## Future Roadmap

### Phase 2 Features
- **User Personalization** - Saved favorites and recommendations
- **Social Features** - Reviews and social sharing
- **Mobile App** - React Native implementation
- **Advanced Search** - AI-powered recommendations

### Phase 3 Enhancements
- **Real-time Data** - Live event and pricing information
- **Booking Integration** - Direct reservation capabilities
- **Business Dashboard** - Venue management portal
- **API Monetization** - Third-party data access

### Technical Evolution
- **Microservices** - Service-oriented architecture
- **GraphQL** - Efficient data fetching
- **Progressive Web App** - Enhanced mobile experience
- **Edge Computing** - Global performance optimization

## Conclusion

The Toronto Guide represents a sophisticated balance of technical simplicity and user experience excellence. Built on proven technologies with a focus on performance and maintainability, the platform provides a solid foundation for scaling premium lifestyle content discovery in Toronto and beyond.

The architecture's emphasis on static site generation, comprehensive design systems, and data-driven content management positions the platform for sustainable growth while maintaining the high-quality user experience that defines the brand. 