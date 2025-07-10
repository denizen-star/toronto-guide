# Day Trip Details Page - Implementation Guide

## Overview
This guide provides the complete implementation specifications for the new detailed day trip page that matches the Swiss design system used in the existing DayTrips.tsx component.

## Design System Reference
- **Color Palette**: Swiss design system with sage green (`#A8B5A0`) and mint blue (`#7FB3D3`) accents
- **Typography**: Inter font family with proper weight hierarchy
- **Layout**: Clean, minimal design with emphasis on whitespace and typography
- **Theme**: Light theme with sophisticated grays and subtle shadows

## Page Structure

### 1. Navigation & Breadcrumbs
```tsx
// Breadcrumb component
<div className="breadcrumb">
  <div className="swiss-container">
    <ul className="breadcrumb-list">
      <li><Link to="/" className="breadcrumb-link">Home</Link></li>
      <li>/</li>
      <li><Link to="/day-trips" className="breadcrumb-link">Day Trips</Link></li>
      <li>/</li>
      <li>{tripTitle}</li>
    </ul>
  </div>
</div>
```

### 2. Hero Section
```tsx
// Hero section with gradient background
<div className="hero-section">
  <div className="hero-content">
    <h1 className="hero-title">{trip.title}</h1>
    <p className="hero-subtitle">{trip.description}</p>
    
    <div className="quick-info">
      <div className="info-item">
        <div className="info-label">Distance</div>
        <div className="info-value">{trip.distance}</div>
      </div>
      <div className="info-item">
        <div className="info-label">Duration</div>
        <div className="info-value">{trip.duration}</div>
      </div>
      <div className="info-item">
        <div className="info-label">Best Season</div>
        <div className="info-value">{trip.season}</div>
      </div>
      <div className="info-item">
        <div className="info-label">Rating</div>
        <div className="info-value">{trip.rating}</div>
      </div>
    </div>
  </div>
</div>
```

### 3. Why This Trip is Special
```tsx
// Special features section
<div className="wireframe-section">
  <h2 className="subtitle">Why This Trip is Special</h2>
  {trip.uniqueFeatures.map((feature, index) => (
    <div key={index} className="highlight">
      <strong>{feature.title}:</strong> {feature.description}
    </div>
  ))}
</div>
```

### 4. Day Plans (Collapsible Sections)
```tsx
// Collapsible day plan sections
<div className="wireframe-section">
  <h2 className="subtitle">Your Perfect Day Plans</h2>
  
  {dayPlans.map((plan, index) => (
    <div key={index} className="collapsible-section">
      <div className="collapsible-header" onClick={() => togglePlan(index)}>
        <span className="collapsible-title">{plan.title}</span>
        <span className="collapsible-icon">{isExpanded[index] ? '▼' : '▶'}</span>
      </div>
      {isExpanded[index] && (
        <div className="collapsible-content">
          <div className="timeline">
            {plan.activities.map((activity, actIndex) => (
              <div key={actIndex} className="timeline-item">
                <div className="time-slot">{activity.time}</div>
                <div className="activity-name">
                  {activity.website ? (
                    <a href={activity.website} className="restaurant-link" target="_blank" rel="noopener noreferrer">
                      {activity.name}
                    </a>
                  ) : (
                    activity.name
                  )}
                </div>
                <div className="activity-desc">{activity.description}</div>
              </div>
            ))}
          </div>
          <div className="summary-box">
            <div className="summary-title">{plan.summaryTitle}</div>
            <div className="summary-content">{plan.summaryContent}</div>
          </div>
        </div>
      )}
    </div>
  ))}
</div>
```

### 5. Events & Festivals
```tsx
// Events grid
<div className="wireframe-section">
  <h2 className="subtitle">Events & Festivals</h2>
  <div className="grid">
    {events.map((event, index) => (
      <div key={index} className="card">
        <div className="card-title">{event.title}</div>
        <div className="card-content">{event.description}</div>
        <div className="rating">{event.rating}</div>
      </div>
    ))}
  </div>
</div>
```

### 6. Reviews & Testimonials
```tsx
// Reviews grid
<div className="wireframe-section">
  <h2 className="subtitle">Reviews & Testimonials</h2>
  <div className="grid">
    {reviews.map((review, index) => (
      <div key={index} className="card">
        <div className="card-title">{review.author}</div>
        <div className="card-content">{review.content}</div>
        <div className="rating">{review.rating}</div>
      </div>
    ))}
  </div>
</div>
```

### 7. Nearby Attractions
```tsx
// Nearby attractions grid
<div className="wireframe-section">
  <h2 className="subtitle">Nearby Attractions</h2>
  <div className="grid">
    {attractions.map((attraction, index) => (
      <div key={index} className="card">
        <div className="card-title">{attraction.name}</div>
        <div className="card-content">{attraction.description}</div>
      </div>
    ))}
  </div>
</div>
```

### 8. Accommodations
```tsx
// Accommodation cards
<div className="wireframe-section">
  <h2 className="subtitle">Accommodations</h2>
  {accommodations.map((accommodation, index) => (
    <div key={index} className="accommodation-card">
      <div className="accommodation-name">{accommodation.name}</div>
      <div className="accommodation-details">{accommodation.details}</div>
    </div>
  ))}
</div>
```

### 9. Must-Not-Miss Highlights
```tsx
// Must-not-miss section
<div className="must-not-miss">
  <div className="must-not-miss-title">Must-Not-Miss Highlights</div>
  {highlights.map((highlight, index) => (
    <div key={index} className="must-not-miss-item">{highlight}</div>
  ))}
</div>
```

## CSS Styling

### Core Design Tokens
```css
:root {
  /* Colors */
  --color-black: #000000;
  --color-white: #FFFFFF;
  --color-charcoal: #1A1A1A;
  --color-warm-taupe: #F5F3F0;
  --color-soft-gray: #E8E6E3;
  --color-deep-slate: #4A4A4A;
  --color-elegant-coral: #E85A4F;
  --color-gray-95: #F7F8FA;
  --color-gray-90: #E8EAED;
  --color-gray-70: #5F6368;
  --color-gray-50: #80868B;
  --color-gray-20: #202124;
  --color-accent-sage: #A8B5A0;
  --color-accent-mint: #7FB3D3;
  --color-accent-refined: #8B9A85;
  
  /* Typography */
  --font-primary: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --text-xs: 0.7rem;
  --text-sm: 0.75rem;
  --text-base: 0.875rem;
  --text-md: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.75rem;
  --text-3xl: 2.5rem;
  --text-4xl: 3.5rem;
  --text-5xl: 4rem;
  
  /* Spacing */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-6: 48px;
  --space-8: 64px;
  --space-12: 96px;
  
  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
}
```

### Component Styles
```css
/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #F5F3F0 0%, #FFFFFF 100%);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  border: 1px solid #E8EAED;
  position: relative;
  overflow: hidden;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: #202124;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: -0.01em;
}

/* Cards */
.card {
  background: #FFFFFF;
  border: 1px solid #E8EAED;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
  position: relative;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #A8B5A0;
}

/* Timeline */
.timeline {
  border-left: 3px solid #A8B5A0;
  padding-left: 24px;
  margin: 20px 0;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -30px;
  top: 8px;
  width: 12px;
  height: 12px;
  background: #A8B5A0;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(168, 181, 160, 0.2);
}

/* Collapsible Sections */
.collapsible-section {
  background: #FFFFFF;
  border: 1px solid #E8EAED;
  border-radius: 12px;
  margin: 16px 0;
  overflow: hidden;
}

.collapsible-header {
  background: rgba(168, 181, 160, 0.1);
  padding: 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
}

.collapsible-header:hover {
  background: rgba(168, 181, 160, 0.15);
}
```

## Data Structure

### Trip Data Interface
```typescript
interface DayTripDetails {
  id: string;
  title: string;
  description: string;
  distance: string;
  duration: string;
  season: string;
  rating: string;
  uniqueFeatures: Array<{
    title: string;
    description: string;
  }>;
  dayPlans: Array<{
    title: string;
    activities: Array<{
      time: string;
      name: string;
      description: string;
      website?: string;
    }>;
    summaryTitle: string;
    summaryContent: string;
  }>;
  events: Array<{
    title: string;
    description: string;
    rating: string;
  }>;
  reviews: Array<{
    author: string;
    content: string;
    rating: string;
  }>;
  attractions: Array<{
    name: string;
    description: string;
  }>;
  accommodations: Array<{
    name: string;
    details: string;
  }>;
  highlights: string[];
}
```

## Implementation Steps

1. **Create Route**: Add `/day-trips/:id/details` route
2. **Data Loading**: Load JSON data based on CSV ID mapping
3. **Component Structure**: Implement each section as separate components
4. **State Management**: Handle collapsible sections and interactions
5. **Styling**: Apply Swiss design system CSS
6. **Responsive Design**: Ensure mobile-friendly layout
7. **Accessibility**: Add proper ARIA labels and keyboard navigation
8. **Performance**: Implement lazy loading for images and data

## File Structure
```
src/
├── pages/
│   └── DayTripDetails.tsx
├── components/
│   ├── DayTripHero.tsx
│   ├── DayPlanSection.tsx
│   ├── EventsGrid.tsx
│   ├── ReviewsGrid.tsx
│   ├── AttractionsGrid.tsx
│   ├── AccommodationsList.tsx
│   └── HighlightsSection.tsx
├── types/
│   └── dayTripDetails.ts
└── utils/
    └── dayTripDataLoader.ts
```

## Wireframe Reference
The complete wireframe design is available at: `design-mockups/day-trip-details-wireframe.html`

This implementation guide ensures the new day trip details page will perfectly match the existing Swiss design system while providing rich, comprehensive information about each day trip destination. 