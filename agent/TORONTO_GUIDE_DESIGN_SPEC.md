# Toronto Guide Design System Specification

## Overview
This specification defines the standardized design system for the Toronto Guide application, implementing enhanced Swiss design principles with systematic organization, refined aesthetics, and sophisticated functionality.

## Core Design Principles

### 1. Enhanced Swiss Design Characteristics
- **Systematic Organization**: 8px base grid system for all spacing and layouts
- **Typographic Hierarchy**: Clear, structured text hierarchy with Inter font family
- **Minimal Color Palette**: Sophisticated grays with sage and mint accents
- **Functional Layout**: Content-first approach with logical information architecture
- **Precision**: Exact measurements, consistent spacing, systematic approach

### 2. Design Philosophy
- **Sophisticated Minimalism**: Clean, refined aesthetics for adults 30+
- **Systematic Clarity**: Information organized for easy navigation and decision-making
- **Compact Efficiency**: Maximum information density without clutter
- **Professional Polish**: High-quality execution with attention to detail

---

## Design System Tokens

### Color Palette
```css
:root {
    /* Base Colors */
    --color-black: #000000;
    --color-white: #FFFFFF;
    
    /* Gray Scale */
    --color-gray-95: #F7F8FA;    /* Sophisticated light background */
    --color-gray-90: #E8EAED;    /* Clean borders, muted highlights */
    --color-gray-70: #5F6368;    /* Secondary text */
    --color-gray-50: #80868B;    /* Subtle text, icons */
    --color-gray-20: #202124;    /* Primary text */
    
    /* Accent Colors (No red/orange) */
    --color-accent-sage: #A8B5A0;      /* Primary sophisticated accent */
    --color-accent-mint: #7FB3D3;      /* Secondary cool accent */
    --color-accent-refined: #8B9A85;   /* Darker sage variant */
}
```

### Typography System
```css
:root {
    /* Font Stack */
    --font-primary: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    --font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
    
    /* Font Sizes */
    --text-xs: 0.7rem;      /* 11.2px - Small labels */
    --text-sm: 0.75rem;     /* 12px - Captions, metadata */
    --text-base: 0.875rem;  /* 14px - Navigation, filters */
    --text-md: 1rem;        /* 16px - Body text, card titles */
    --text-lg: 1.125rem;    /* 18px - Page subtitles */
    --text-xl: 1.25rem;     /* 20px - Section headers */
    --text-2xl: 1.75rem;    /* 28px - Section titles */
    --text-3xl: 2.5rem;     /* 40px - CTA titles */
    --text-4xl: 3.5rem;     /* 56px - Page titles */
    --text-5xl: 4rem;       /* 64px - Hero titles */
    
    /* Font Weights */
    --weight-light: 300;
    --weight-normal: 400;
    --weight-medium: 500;
    --weight-semibold: 600;
    --weight-bold: 700;
}
```

### Spacing System (8px Grid)
```css
:root {
    --grid-unit: 8px;
    --space-1: 8px;
    --space-2: 16px;
    --space-3: 24px;
    --space-4: 32px;
    --space-6: 48px;
    --space-8: 64px;
    --space-12: 96px;
    
    /* Container System */
    --container-max: 1200px;
    --container-padding: var(--space-4);
}
```

### Border Radius System
```css
:root {
    --radius-sm: 6px;      /* Small elements, icons */
    --radius-md: 12px;     /* Standard cards, filters */
    --radius-lg: 16px;     /* Large cards */
    --radius-xl: 24px;     /* Search inputs */
}
```

---

## Component Specifications

### 1. Navigation Component

#### Structure
```html
<nav class="swiss-nav">
    <div class="swiss-container">
        <div class="nav-grid">
            <div class="swiss-logo">Toronto</div>
            <div class="search-container">
                <div class="search-wrapper">
                    <span class="search-icon">🔍</span>
                    <input type="text" class="search-input" placeholder="Search...">
                </div>
            </div>
            <ul class="nav-menu">
                <li><a href="#" class="nav-link [active]">Page Name</a></li>
            </ul>
        </div>
    </div>
</nav>
```

#### Styling Rules
```css
.swiss-nav {
    background-color: var(--color-white);
    border-bottom: 1px solid var(--color-gray-90);
    padding: var(--space-3) 0;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.nav-grid {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: var(--space-4);
    align-items: center;
}

.swiss-logo {
    font-size: 1.5rem;
    font-weight: var(--weight-bold);
    color: var(--color-black);
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.search-input {
    width: 100%;
    padding: var(--space-2) var(--space-3) var(--space-2) var(--space-6);
    border: 1px solid var(--color-gray-90);
    background-color: var(--color-gray-95);
    font-family: var(--font-primary);
    font-size: var(--text-base);
    color: var(--color-gray-20);
    border-radius: var(--radius-xl);
    outline: none;
    transition: all 150ms ease;
}

.nav-link {
    font-size: var(--text-base);
    font-weight: var(--weight-medium);
    color: var(--color-gray-70);
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: color 150ms ease;
    border-bottom: 2px solid transparent;
    padding-bottom: 2px;
}

.nav-link:hover,
.nav-link.active {
    color: var(--color-accent-sage);
    border-bottom-color: var(--color-accent-sage);
}
```

### 2. Breadcrumb Component

#### Structure
```html
<section class="breadcrumb">
    <div class="container">
        <ul class="breadcrumb-list">
            <li><a href="#" class="breadcrumb-link">Home</a></li>
            <li>→</li>
            <li>Current Page</li>
        </ul>
    </div>
</section>
```

#### Styling Rules
```css
.breadcrumb {
    background-color: var(--color-white);
    padding: var(--space-2) 0;
    border-bottom: 1px solid var(--color-gray-90);
}

.breadcrumb-list {
    display: flex;
    list-style: none;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-gray-70);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.breadcrumb-link {
    color: var(--color-accent-sage);
    text-decoration: none;
}
```

### 3. Card Components

#### Standard Card (Large)
```html
<div class="card-large">
    <div class="card-icon">TXT</div>
    <div class="card-content">
        <div class="card-category">Category</div>
        <h3 class="card-title">Card Title</h3>
        <p class="card-description">Card description text goes here.</p>
        <ul class="card-features">
            <li>Feature one</li>
            <li>Feature two</li>
        </ul>
        <div class="card-meta">
            <span>Duration</span>
            <span class="card-price">$Price</span>
        </div>
    </div>
</div>
```

#### Card Styling System
```css
.card-large {
    background-color: var(--color-white);
    border: 1px solid var(--color-gray-90);
    border-radius: var(--radius-lg);
    padding: var(--space-3);
    min-height: 180px;
    display: flex;
    flex-direction: column;
    transition: all 150ms ease;
}

.card-large:hover {
    border-color: var(--color-accent-sage);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-icon {
    width: 40px;
    height: 40px;
    background-color: var(--color-gray-90);
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-md);
    font-weight: var(--weight-bold);
    color: var(--color-gray-70);
    margin-bottom: var(--space-2);
    font-family: var(--font-mono);
}

.card-title {
    font-size: var(--text-md);
    font-weight: var(--weight-bold);
    margin-bottom: var(--space-2);
    color: var(--color-black);
    text-transform: uppercase;
    letter-spacing: -0.01em;
    line-height: 1.2;
}

.card-description {
    font-size: var(--text-base);
    color: var(--color-gray-70);
    margin-bottom: var(--space-3);
    line-height: 1.4;
    flex-grow: 1;
}

.card-features {
    list-style: none;
    margin-bottom: var(--space-3);
}

.card-features li {
    font-size: var(--text-sm);
    margin-bottom: var(--space-1);
    padding-left: var(--space-2);
    position: relative;
    color: var(--color-gray-70);
    font-weight: var(--weight-medium);
}

.card-features li::before {
    content: "—";
    position: absolute;
    left: 0;
    color: var(--color-accent-sage);
    font-weight: var(--weight-bold);
}
```

#### Activity Card (Image Header)
```html
<div class="activity-card">
    <div class="card-image">TXT</div>
    <div class="card-content">
        <div class="card-category">Category</div>
        <h3 class="card-title">Activity Title</h3>
        <p class="card-description">Activity description.</p>
        <div class="card-meta">
            <span>Duration</span>
            <span class="card-price">$Price</span>
        </div>
    </div>
</div>
```

```css
.activity-card {
    background-color: var(--color-white);
    border: 1px solid var(--color-gray-90);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: all 150ms ease;
}

.card-image {
    height: 70px;
    background-color: var(--color-gray-90);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-md);
    font-weight: var(--weight-bold);
    color: var(--color-gray-70);
    font-family: var(--font-mono);
}
```

#### Quick Access Card (Small)
```html
<div class="quick-card">
    <div class="quick-icon">TXT</div>
    <div class="quick-title">Title</div>
</div>
```

```css
.quick-card {
    background-color: var(--color-white);
    border: 1px solid var(--color-gray-90);
    border-radius: var(--radius-md);
    padding: var(--space-3);
    text-align: center;
    transition: all 150ms ease;
}

.quick-icon {
    width: 32px;
    height: 32px;
    background-color: var(--color-gray-90);
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-base);
    font-weight: var(--weight-bold);
    color: var(--color-gray-70);
    margin: 0 auto var(--space-1);
    font-family: var(--font-mono);
}
```

### 4. Filter System (Multi-Select Enabled)

#### Structure
```html
<section class="filter-section">
    <div class="container">
        <div class="filter-grid">
            <div class="filter-group">
                <label class="filter-label">Category</label>
                <div class="filter-multi-select" data-filter="category">
                    <div class="filter-display">
                        <span class="filter-placeholder">All Categories</span>
                        <span class="filter-count"></span>
                        <span class="filter-arrow">▼</span>
                    </div>
                    <div class="filter-dropdown">
                        <div class="filter-option">
                            <input type="checkbox" id="cat-arts" value="arts">
                            <label for="cat-arts">Arts & Culture</label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="cat-dining" value="dining">
                            <label for="cat-dining">Fine Dining</label>
                        </div>
                        <!-- Additional options -->
                    </div>
                </div>
            </div>
            <!-- Additional filter groups -->
        </div>
    </div>
</section>
```

#### Multi-Select Filter Styling
```css
.filter-section {
    padding: var(--space-4) 0;
    background-color: var(--color-white);
    border-bottom: 1px solid var(--color-gray-90);
}

.filter-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: var(--space-3);
}

.filter-group {
    display: flex;
    flex-direction: column;
}

.filter-label {
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: var(--space-1);
    color: var(--color-black);
}

.filter-multi-select {
    position: relative;
}

.filter-display {
    padding: var(--space-1) var(--space-2);
    border: 1px solid var(--color-gray-90);
    background-color: var(--color-gray-95);
    font-family: var(--font-primary);
    font-size: var(--text-sm);
    color: var(--color-gray-20);
    border-radius: var(--radius-md);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 32px;
}

.filter-display:focus,
.filter-display.active {
    border-color: var(--color-accent-sage);
    background-color: var(--color-white);
}

.filter-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--color-white);
    border: 1px solid var(--color-gray-90);
    border-radius: var(--radius-md);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 50;
    max-height: 200px;
    overflow-y: auto;
    display: none;
}

.filter-dropdown.active {
    display: block;
}

.filter-option {
    padding: var(--space-2);
    display: flex;
    align-items: center;
    gap: var(--space-2);
    cursor: pointer;
}

.filter-option:hover {
    background-color: var(--color-gray-95);
}

.filter-option input[type="checkbox"] {
    accent-color: var(--color-accent-sage);
}

.filter-count {
    background-color: var(--color-accent-sage);
    color: var(--color-white);
    padding: 2px 6px;
    border-radius: 10px;
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    min-width: 18px;
    text-align: center;
}
```

#### Multi-Select Filter JavaScript
```javascript
class MultiSelectFilter {
    constructor(element) {
        this.element = element;
        this.display = element.querySelector('.filter-display');
        this.dropdown = element.querySelector('.filter-dropdown');
        this.placeholder = element.querySelector('.filter-placeholder');
        this.count = element.querySelector('.filter-count');
        this.options = element.querySelectorAll('input[type="checkbox"]');
        this.selectedValues = new Set();
        
        this.init();
    }
    
    init() {
        this.display.addEventListener('click', () => this.toggle());
        
        this.options.forEach(option => {
            option.addEventListener('change', () => this.updateSelection());
        });
        
        document.addEventListener('click', (e) => {
            if (!this.element.contains(e.target)) {
                this.close();
            }
        });
    }
    
    toggle() {
        this.dropdown.classList.toggle('active');
        this.display.classList.toggle('active');
    }
    
    close() {
        this.dropdown.classList.remove('active');
        this.display.classList.remove('active');
    }
    
    updateSelection() {
        this.selectedValues.clear();
        
        this.options.forEach(option => {
            if (option.checked) {
                this.selectedValues.add(option.value);
            }
        });
        
        this.updateDisplay();
        this.triggerFilterEvent();
    }
    
    updateDisplay() {
        const count = this.selectedValues.size;
        
        if (count === 0) {
            this.placeholder.textContent = this.placeholder.dataset.placeholder || 'All';
            this.count.style.display = 'none';
        } else {
            this.placeholder.textContent = `${count} selected`;
            this.count.textContent = count;
            this.count.style.display = 'inline-block';
        }
    }
    
    triggerFilterEvent() {
        const event = new CustomEvent('filterChange', {
            detail: {
                filterType: this.element.dataset.filter,
                selectedValues: Array.from(this.selectedValues)
            }
        });
        document.dispatchEvent(event);
    }
}

// Initialize all multi-select filters
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.filter-multi-select').forEach(filter => {
        new MultiSelectFilter(filter);
    });
});
```

### 5. Page Header Component

#### Structure
```html
<section class="page-header">
    <div class="container">
        <div class="header-content">
            <div class="header-text">
                <h1 class="page-title">Page Title</h1>
                <p class="page-subtitle">Detailed description of the page content and purpose.</p>
            </div>
            <div class="stats-box">
                <div class="stat">
                    <div class="stat-number">150+</div>
                    <div class="stat-label">Items</div>
                </div>
                <div class="stat">
                    <div class="stat-number">12</div>
                    <div class="stat-label">Categories</div>
                </div>
                <div class="stat">
                    <div class="stat-number">4.8</div>
                    <div class="stat-label">Rating</div>
                </div>
            </div>
        </div>
    </div>
</section>
```

#### Styling
```css
.page-header {
    padding: var(--space-8) 0 var(--space-6) 0;
    background-color: var(--color-white);
    border-bottom: 1px solid var(--color-gray-90);
}

.header-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--space-8);
    align-items: center;
}

.page-title {
    font-size: var(--text-4xl);
    font-weight: var(--weight-bold);
    text-transform: uppercase;
    letter-spacing: -0.02em;
    margin-bottom: var(--space-2);
    color: var(--color-black);
}

.page-subtitle {
    font-size: var(--text-lg);
    font-weight: var(--weight-light);
    color: var(--color-gray-70);
    line-height: 1.5;
}

.stats-box {
    background-color: var(--color-gray-95);
    padding: var(--space-4);
    border: 1px solid var(--color-gray-90);
    border-radius: var(--radius-md);
}

.stat {
    margin-bottom: var(--space-2);
    text-align: center;
}

.stat-number {
    font-size: var(--text-xl);
    font-weight: var(--weight-bold);
    color: var(--color-black);
}

.stat-label {
    font-size: var(--text-sm);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-gray-70);
    margin-top: var(--space-1);
}
```

---

## Layout System

### Grid Patterns

#### Standard Content Grid
```css
.content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-3);
}
```

#### Feature Grid (4 columns)
```css
.feature-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-3);
}
```

#### Quick Access Grid (6 columns)
```css
.quick-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: var(--space-2);
}
```

### Container System
```css
.container {
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 0 var(--container-padding);
}

.section {
    padding: var(--space-6) 0;
}

.section-large {
    padding: var(--space-8) 0;
}
```

---

## Icon System

### Monochrome Text Icons
Use 3-letter abbreviations in monospace font for all icons:

#### Common Icons
- **ART** - Arts & Culture
- **DIN** - Fine Dining  
- **LOC** - Locations/Districts
- **TRP** - Day Trips
- **WIN** - Wine/Beverages
- **THR** - Theatre/Entertainment
- **SPA** - Wellness/Spa
- **MUS** - Museums
- **CHF** - Chef/Premium Dining
- **SPT** - Sports
- **EVT** - Events
- **NLF** - Nightlife
- **WEL** - Wellness
- **SHP** - Shopping
- **HIS** - Historic
- **MOD** - Modern
- **BIZ** - Business
- **BCH** - Beach/Coastal
- **NAT** - Nature
- **REC** - Recreation
- **ISL** - Islands
- **CUL** - Cultural
- **LUX** - Luxury
- **NEW** - New/Latest

---

## Responsive Breakpoints

```css
/* Mobile First Approach */
@media (max-width: 768px) {
    .container { 
        padding: 0 var(--space-2); 
    }
    
    .nav-grid { 
        grid-template-columns: 1fr; 
        gap: var(--space-2); 
    }
    
    .nav-menu { 
        display: none; 
    }
    
    .header-content { 
        grid-template-columns: 1fr; 
        gap: var(--space-4); 
    }
    
    .page-title { 
        font-size: var(--text-3xl); 
    }
    
    .feature-grid { 
        grid-template-columns: 1fr; 
    }
    
    .quick-grid { 
        grid-template-columns: repeat(2, 1fr); 
    }
    
    .filter-grid { 
        grid-template-columns: 1fr; 
    }
}

@media (max-width: 968px) {
    .feature-grid {
        grid-template-columns: repeat(3, 1fr);
    }
    
    .quick-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

---

## Implementation Guidelines

### 1. Page Structure Template
Every page should follow this structure:
1. Navigation
2. Breadcrumb (if not homepage)
3. Page Header
4. Filter Section (if applicable)
5. Main Content Sections
6. Footer

### 2. CSS Organization
```css
/* 1. CSS Custom Properties */
:root { /* tokens */ }

/* 2. Reset & Base */
*, body, html { /* reset styles */ }

/* 3. Layout Components */
.container, .grid-* { /* layout */ }

/* 4. UI Components */
.nav-*, .card-*, .filter-* { /* components */ }

/* 5. Utilities */
.text-*, .space-*, .color-* { /* utilities */ }

/* 6. Responsive */
@media queries
```

### 3. HTML Class Naming Convention
- **Component**: `.component-name` (e.g., `.nav-menu`, `.card-large`)
- **Element**: `.component-element` (e.g., `.card-title`, `.nav-link`)
- **Modifier**: `.component--modifier` (e.g., `.nav-link--active`)
- **State**: `.is-state` (e.g., `.is-active`, `.is-loading`)

### 4. Required Features for All Pages

#### Navigation
- Sticky navigation with search
- Active state indication
- Responsive collapse

#### Search
- Rounded search bar (24px border-radius)
- Icon positioning
- Focus states

#### Filters
- Multi-select capability
- Visual selection indicators
- Responsive stacking

#### Cards
- Rounded corners (16px for large, 12px for small)
- Hover states with lift effect
- Consistent icon treatment
- Proper content hierarchy

#### Responsive Behavior
- Mobile-first approach
- Grid system adaptation
- Navigation collapse
- Content reflow

---

## Quality Checklist

### Visual Design
- [ ] All colors from approved palette
- [ ] Consistent 8px grid spacing
- [ ] Proper typography hierarchy
- [ ] Rounded corners on all cards
- [ ] Monochrome text icons
- [ ] Muted icon backgrounds

### Functionality
- [ ] Multi-select filters working
- [ ] Search functionality implemented
- [ ] Responsive design tested
- [ ] Hover states consistent
- [ ] Focus states for accessibility

### Code Quality
- [ ] CSS custom properties used
- [ ] Semantic HTML structure
- [ ] Consistent class naming
- [ ] Performance optimized
- [ ] Cross-browser tested

---

## Next Steps for Implementation

1. **Create base CSS file** with all design tokens and component styles
2. **Build reusable components** for navigation, cards, filters
3. **Implement multi-select filter JavaScript** functionality
4. **Create page templates** following the standardized structure
5. **Test responsive behavior** across all breakpoints
6. **Validate accessibility** compliance
7. **Performance optimization** and testing

This specification provides the foundation for consistent, professional implementation of the Toronto Guide design system across all pages and components. 