# Design System: Lifestyle Concierge Website

## Design Philosophy

**Target Audience:** Adults 30+ seeking sophisticated lifestyle experiences
**Core Aesthetic:** Chic, modern, streamlined, and clean with Bauhaus-inspired principles

## Visual Guidelines

### Color Palette

#### Primary Palette (Muted Base)
- **Sophisticated Charcoal:** `#1A1A1A` - Primary backgrounds
- **Warm Taupe:** `#F5F3F0` - Light backgrounds, content areas
- **Soft Gray:** `#E8E6E3` - Subtle borders, dividers
- **Deep Slate:** `#4A4A4A` - Secondary text, icons

#### Accent Colors (Selective Pops)
- **Elegant Coral:** `#E85A4F` - Primary CTAs, key highlights
- **Sophisticated Sage:** `#A8B5A0` - Secondary accents, success states
- **Refined Gold:** `#D4AC0D` - Premium features, special content
- **Cool Mint:** `#7FB3D3` - Links, interactive elements

#### Semantic Colors
- **Success:** `#A8B5A0` (Sage)
- **Warning:** `#D4AC0D` (Gold)
- **Error:** `#E85A4F` (Coral)
- **Info:** `#7FB3D3` (Mint)

### Typography Hierarchy

**Primary Font:** Inter (Clean, modern sans-serif)
**Secondary Font:** Manrope (Elegant alternative for headings)

#### Scale & Usage
- **H1 Hero:** 48px/52px - Homepage hero titles
- **H2 Section:** 32px/36px - Major section headers
- **H3 Subsection:** 24px/28px - Subsection titles
- **H4 Card Title:** 18px/24px - Card headers, important content
- **Body Large:** 16px/24px - Primary content
- **Body Regular:** 14px/20px - Standard text
- **Body Small:** 12px/16px - Captions, metadata
- **Button Text:** 14px/16px - All interactive elements

#### Font Weights
- **Light:** 300 - Large display text
- **Regular:** 400 - Body text
- **Medium:** 500 - Emphasized text, button labels
- **Semi-Bold:** 600 - Headings, important labels
- **Bold:** 700 - Hero titles only

### Grid System (Bauhaus-Inspired)

#### Desktop Layout (1200px+ containers)
- **12-column grid** with 24px gutters
- **80px margins** on left/right
- **32px vertical rhythm** for all spacing

#### Tablet Layout (768px-1199px)
- **8-column grid** with 20px gutters
- **40px margins** on left/right
- **24px vertical rhythm**

#### Mobile Layout (<768px)
- **4-column grid** with 16px gutters
- **20px margins** on left/right
- **20px vertical rhythm**

### Spacing System
Based on 8px base unit for mathematical precision:
- **XS:** 4px
- **S:** 8px
- **M:** 16px
- **L:** 24px
- **XL:** 32px
- **XXL:** 48px
- **XXXL:** 64px

### Icon Library
**Style:** Line-art icons only (Lucide or Feather icon sets)
**Sizes:** 16px, 20px, 24px, 32px
**Stroke Width:** 1.5px for consistency
**Usage:** Navigation, features, status indicators

## Component Library

### Navigation Components

#### Primary Navigation
- **Height:** 72px
- **Background:** `#F5F3F0` with subtle shadow
- **Logo placement:** Left-aligned
- **Menu items:** Center-aligned, 14px medium weight
- **CTA button:** Right-aligned, coral accent

#### Breadcrumbs
- **Style:** Text-based with arrow separators
- **Color:** `#4A4A4A` with coral active state
- **Font:** 12px regular

### Content Components

#### Cards
**Standard Card:**
- **Border radius:** 8px
- **Shadow:** Subtle drop shadow (0 2px 8px rgba(0,0,0,0.08))
- **Padding:** 24px
- **Background:** White with 1px border `#E8E6E3`

**Feature Card:**
- **Enhanced shadow:** 0 4px 16px rgba(0,0,0,0.12)
- **Coral accent border:** 2px left border
- **Hover state:** Slight elevation increase

#### Buttons

**Primary Button:**
- **Background:** `#E85A4F` (Coral)
- **Text:** White, 14px medium
- **Padding:** 12px 24px
- **Radius:** 4px
- **Hover:** Darken 10%

**Secondary Button:**
- **Background:** Transparent
- **Border:** 1px solid `#4A4A4A`
- **Text:** `#4A4A4A`, 14px medium
- **Hover:** Background `#F5F3F0`

**Text Button:**
- **Background:** Transparent
- **Text:** `#E85A4F`, 14px medium
- **Underline:** On hover

#### Input Fields
- **Height:** 44px
- **Border:** 1px solid `#E8E6E3`
- **Focus state:** Coral border `#E85A4F`
- **Padding:** 12px 16px
- **Radius:** 4px

### Layout Components

#### Section Container
- **Max width:** 1200px
- **Horizontal margins:** Auto-center
- **Vertical padding:** 64px (desktop), 48px (tablet), 32px (mobile)

#### Content Grid
- **Gap:** 24px between items
- **Responsive:** 3 columns (desktop), 2 columns (tablet), 1 column (mobile)

## Animation Guidelines

### Micro-Interactions
- **Duration:** 200-300ms for UI feedback
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` - Material motion
- **Hover states:** Subtle scale (1.02x) or color transitions
- **Button clicks:** Brief scale down (0.98x) then return

### Page Transitions
- **Duration:** 400ms
- **Type:** Fade transitions between pages
- **Loading states:** Subtle skeleton loading animations

### Scroll Effects
- **Parallax:** Minimal, subtle background movements
- **Fade-in:** Content reveals on scroll with stagger effect
- **Sticky navigation:** Smooth background opacity change

## Responsive Behavior

### Breakpoints
- **Mobile:** 320px - 767px
- **Tablet:** 768px - 1199px
- **Desktop:** 1200px+
- **Large Desktop:** 1440px+

### Component Adaptations
- **Navigation:** Hamburger menu on mobile
- **Cards:** Full-width on mobile, grid on larger screens
- **Typography:** Scale down 15% on mobile
- **Spacing:** Reduce by 25% on mobile

## Implementation Guidelines

### Technical Simplicity
1. **CSS-in-JS:** Use styled-components or emotion for component styling
2. **No complex frameworks:** Avoid heavy animation libraries
3. **Progressive enhancement:** Base functionality works without JavaScript
4. **Performance:** Lazy load images, minimal bundle size

### Netlify Compatibility
1. **Static assets:** All fonts and icons served from CDN or local files
2. **Build optimization:** Automated minification and compression
3. **Deployment:** Single-command deployment with environment variables
4. **Performance:** Lighthouse score 90+ for all metrics

## Page-Specific Enhancements

### Homepage Unique Elements
1. **Hero Section:** Large typography with subtle gradient overlay
2. **Feature Grid:** Animated cards that reveal on scroll
3. **Testimonial Carousel:** Minimal, elegant slide transitions
4. **CTA Section:** Bold coral background with white text

### Interior Pages
1. **Consistent header:** Same navigation across all pages
2. **Breadcrumb navigation:** Clear page hierarchy
3. **Content structure:** Predictable layout patterns
4. **Footer consistency:** Identical across all pages

## Accessibility Standards

### WCAG 2.1 AA Compliance
- **Color contrast:** 4.5:1 minimum for text
- **Focus indicators:** Clear, visible focus states
- **Screen reader support:** Semantic HTML, proper ARIA labels
- **Keyboard navigation:** All interactive elements accessible via keyboard

### Performance Standards
- **Page load:** Under 3 seconds on 3G
- **Core Web Vitals:** Green scores for LCP, FID, CLS
- **Image optimization:** WebP format with fallbacks
- **Font loading:** Preload critical fonts, fallback stack 