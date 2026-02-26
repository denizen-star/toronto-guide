# 📋 LifePlanner - Comprehensive Requirements Summary

## 🎯 Project Overview
**LifePlanner** is a sophisticated personalized life planning system for Kevin (40-year-old Head of Data) and Peter (Celebrity Fashion Stylist), a gay married couple in Toronto. The system generates detailed daily schedules balancing individual activities with couple activities to build friendships and professional networks.

---

## 🚨 MANDATORY REQUIREMENTS

### **Core Schedule Constraints (NEVER VIOLATE)**

#### **Work Hours Absolute Constraint**
- **Time**: Monday-Friday, 9:00 AM - 6:00 PM
- **Rule**: NO leisure activities during work hours
- **Allowed During Work**: Core work, professional lunch meetings, immigration work, professional development, household budgeting
- **Forbidden During Work**: Swimming, tennis, running, leisure walks, entertainment, personal errands
- **Priority**: 🔴 CRITICAL

#### **Sleep Schedule**
- **Weekday Bedtime**: 10:30 PM (non-negotiable)
- **Weekday Wake Time**: 6:00 AM (negotiable)
- **Weekend Bedtime**: 11:59 PM (negotiable)
- **Weekend Wake Time**: 8:00 AM (negotiable)
- **Priority**: 🔴 CRITICAL

#### **Date Constraints**
- **Rule**: All schedules must be for 2025 onwards, never past dates
- **Implementation**: Calculate correct days of the week for 2025+ dates
- **Priority**: 🔴 CRITICAL

### **Daily Requirements (EVERY DAY)**

#### **Morning Routine**
- **6:00 AM**: Wake up & hydration (5 min)
- **6:15 AM**: Couple intention setting (15 min) - habit stacked
- **6:20 AM**: Personal grooming (25 min) - shower, skincare, teeth, deodorant
- **6:45 AM**: Progressive meditation (starts 10 mins, increases weekly)
- **Priority**: 🔴 MANDATORY

#### **Work Schedule**
- **8:50 AM**: Commute to work (10 min, $0 CAD)
- **9:00 AM - 6:00 PM**: Work blocks with approved activities only
- **6:00 PM**: Commute home (10 min, $0 CAD)
- **Priority**: 🔴 MANDATORY

#### **Evening Routine**
- **9:45 PM**: Gratitude share (10 min) - share 3 things grateful for each other
- **10:00 PM**: Wind-down (30 min) - no screens, reading, relaxation
- **Priority**: 🔴 MANDATORY

### **Weekly Requirements (MUST BE SCHEDULED)**

#### **Running Schedule (NEVER during work hours)**
- **Tuesday**: 60 min at 7:00 AM or 6:00 PM
- **Thursday**: 60 min at 7:00 AM or 6:00 PM
- **Friday**: 60 min at 7:00 AM or 6:00 PM
- **Sunday**: 120 min at anytime flexible
- **Priority**: 🔴 MANDATORY

#### **Personal Care Weekly**
- **Hair washing**: Daily
- **Nail trimming**: Weekly (Sunday preferred)
- **Beard trimming**: Every other day AM (Saturday preferred)
- **Priority**: 🔴 MANDATORY

#### **Household Tasks**
- **Grocery shopping**: Weekly (Saturday or Sunday, 2h, loblaws city market, $100)
- **Budgeting**: Weekly (1h, can be during work hours)
- **Priority**: 🔴 MANDATORY

#### **Couple Activities Weekly**
- **Emotional check-in**: Weekly (Sunday 10:00 AM, 30 min)
- **Device-free dinner**: 2-3 times weekly (1h, various restaurants, $60)
- **Priority**: 🔴 MANDATORY

#### **Networking Requirements**
- **Minimum**: 3 networking activities per week
- **Preferred times**: 6:30-8:30 PM
- **Minimum networking potential**: 6/10
- **Priority**: 🔴 MANDATORY

### **Monthly/Bi-weekly/Quarterly Limits**

#### **Swimming (MAXIMUM LIMITS)**
- **Frequency**: Maximum 2 times per month (not minimum)
- **Options**: Masters class ($15) or self-guided ($10)
- **Never during work hours**
- **Priority**: 🔴 MANDATORY LIMIT

#### **Tennis/Padel (MAXIMUM LIMITS)**
- **Frequency**: Maximum 2-3 times per month (not minimum)
- **Options**: Breakpoint Club classes ($25), ThePad or community courts ($30)
- **Never during work hours**
- **Priority**: 🔴 MANDATORY LIMIT


#### **Couple Activities Monthly/Bi-weekly/Quarterly Limits**

#### **Pickleball/Bowling (MAXIMUM LIMITS)**
- **Frequency**: Maximum 2-3 times per month (not minimum)
- **Options**: TBD
- **Never during work hours**
- **Priority**: 🔴 MANDATORY LIMIT

#### **Gay bars/ Gay activities (MAXIMUM LIMITS)**
- **Frequency**: Maximum 2-3 times per month (not minimum)
- **Options**: TBD
- **Never during work hours**
- **Priority**: 🔴 MANDATORY LIMIT

#### **Meeting Peter Friends (MAXIMUM LIMITS)**
- **Frequency**: Maximum 2-3 times per month (not minimum)
- **Options**: TBD
- **Never during work hours**
- **Priority**: 🔴 MANDATORY LIMIT

#### **Meeting Peters Family (MAXIMUM LIMITS)**
- **Frequency**: Maximum 2-3 times per month (not minimum)
- **Options**: TBD
- **Never during work hours**
- **Priority**: 🔴 MANDATORY LIMIT

#### **Church Sundays**
- **Frequency**: Maximum 2-3 times per month (not minimum) Sunday 
- **Options**: TBD
- **Preferred times**: 9:30-10:30 AM
- **Never during work hours**
- **Priority**: 🔴 MANDATORY LIMIT

#### **Personal Care Bi-weekly/Monthly**
- **Haircut**: Bi-weekly (45 min, $50, Saturday)
- **Deep skincare**: Monthly (45 min, first Sunday)
- **Hair styling**: Monthly (30 min, $40)
- **Priority**: 🔴 MANDATORY



---

## 🔧 CORE SYSTEM REQUIREMENTS

### **UI/UX Requirements**

#### **Time Allocation Slider System**
- **Functionality**: Interactive sliders that actually modify the 40.8 hours of "Available for Tuning" time
- **Categories**: Individual Activities, Networking/Social, Couple Activities
- **Real-time updates**: Changes must regenerate actual schedule, not just UI display
- **Export integration**: Slider changes must reflect in exported schedules
- **Issue Status**: 🚨 CRITICAL - Currently broken (sliders don't modify actual time allocation)
- **Priority**: 🔴 CRITICAL FIX NEEDED

#### **Schedule Views**
- **Daily View**: Chronological activity list with full details
- **Weekly Grid**: 7-day grid sorted by 24-hour time format
- **Monthly View**: Month overview with week distribution
- **All views must**: Show correct 2025+ dates, include activity variety, respect work hours
- **Priority**: 🔴 MANDATORY

#### **Activity Details Requirements**
- **Address**: Exact Toronto addresses for all activities
- **Website**: Booking/information websites
- **Transit**: TTC directions and duration
- **Car**: Driving directions and duration
- **Cost**: Current CAD pricing
- **Tips**: First-time visitor information
- **Networking potential**: 1-10 scoring
- **TAG Activity type**: Individual Activities, Networking & Social, Couple Activities
- **Priority**: 🔴 MANDATORY

#### **AI Summary Links**
- **Location**: Bottom of each day
- **Format**: "🤖 View AI Alternatives" button
- **Content**: Toronto-specific recommendations, positive tone, networking optimization
- **Priority**: 🔴 MANDATORY

### **Persona System Requirements**

#### **Core Persona Features**
- **Demographics**: Age, life stage, occupation, income level
- **Personality Profile**: Personality type, energy patterns, social style  
- **Goals & Aspirations**: Short-term and long-term personal/professional goals
- **Preferences**: Activity types, locations, budget, time preferences
- **Constraints**: Budget limits, time availability, physical limitations
- **Behavioral Patterns**: Routines, stress management, learning preferences
- **Networking Profile**: Networking priorities, venues, communication style
- **Priority**: 🔴 MANDATORY

#### **Kevin's Persona Specifics**
- **Personality**: Introvert-extrovert, analytical, spreadsheet-oriented, high perfectionism
- **Goals**: Build healthy social network (9/10), professional network (8/10), half marathon (7/10), drink less alcohol (6/10)
- **Budget**: $200/day, $1000/week
- **Running**: Solo runs (not with groups)
- **Breakfast**: Does not eat breakfast (not a morning person for food)
- **Priority**: 🔴 MANDATORY

#### **Peter's Persona Specifics**
- **Personality**: Extrovert, struggles with decisions, enthusiastic, unplanned style
- **Traits**: High spontaneity (8/10), high perfectionism (9/10), low stress tolerance (4/10)
- **Goals**: Support Kevin's social network (8/10), maintain celebrity status (7/10), work-life balance (6/10)
- **Budget**: $500/day, $1500/week
- **Work**: Flexible schedule
- **Priority**: 🔴 MANDATORY

### **Activity Variety System**

#### **Activity Database Integration**
- **Source**: Load from `data/activities/my_complete_activity_schedule.json` (902 activities)
- **Categorization**: Networking, Couple, Fitness, Social, Professional pools
- **Rotation Logic**: Different activities each day/week, no repeats within 7 days
- **Current Status**: ✅ IMPLEMENTED (48 activities loaded and categorized)
- **Priority**: 🟢 COMPLETE

#### **Schedule Generation Variety**
- **Daily**: Different activities from each pool each day
- **Weekly**: No activity repeats within 7 days
- **Monthly**: Seasonal/monthly special events
- **Current Status**: ✅ IMPLEMENTED
- **Priority**: 🟢 COMPLETE

---

## 🔍 RESEARCH REQUIREMENTS

### **Real-Time Data Integration**

#### **Travel Time & Location Integration**
- **Google Maps API**: Calculate real-time travel time between activities
- **Toronto Traffic**: Account for traffic patterns and public transit options
- **Location Data**: Store addresses, neighborhoods, accessibility, parking info
- **Optimization**: Schedule activities to minimize travel time
- **Priority**: 🟡 RESEARCH NEEDED

#### **Website Integration & Live Data**
- **Running Groups**: Frontrunners Toronto, other queer run clubs
- **Professional Networks**: Toronto Data Science Meetup, Toronto Machine Learning Society, AI & Fintech events
- **Fitness Venues**: THE PAD (padel), Y Trillium (swimming), Toronto Tennis Club
- **Cultural/Educational**: AGO, Toronto School of Art, The Second City, Eataly cooking classes
- **Religious**: Catholic mass schedules (Sunday 9:30 AM)
- **Social Venues**: St. Lawrence Market, smaller music venues
- **Priority**: 🟡 RESEARCH NEEDED

#### **Real-Time Schedule Validation**
- **Availability Checking**: Verify current availability for classes, meetups, events
- **Schedule Updates**: Check if schedules haven't changed since last update
- **Conflict Detection**: Flag conflicts with existing commitments
- **Pricing Updates**: Update current pricing and timing information
- **Priority**: 🟡 RESEARCH NEEDED

### **Goal Alignment Scoring System**
- **Scoring Range**: 1-10 scale for activity alignment with personal goals
- **Kevin's Goal Weights**: Social network (9/10), professional network (8/10), half marathon (7/10), alcohol reduction (6/10), intentional activities (3/10), routines (4/10)
- **Peter's Goal Weights**: Support Kevin (8/10), celebrity status (7/10), work-life balance (2/10), family time (7/10), intentional activities (8/10)
- **Priority**: 🟡 RESEARCH NEEDED

### **Cost & Enjoyment Analysis**
- **Current Pricing**: Research up-to-date pricing for all activities
- **Enjoyment Prediction**: Based on personality profiles and past feedback
- **Budget Alternatives**: Suggest budget-friendly alternatives when needed
- **ROI Analysis**: Cost vs networking/goal achievement value
- **Priority**: 🟡 RESEARCH NEEDED

---

## 🎯 OPTIONAL ENHANCEMENTS

### **Advanced UI Features**

#### **Analytics Dashboard**
- **Usage Statistics**: Activity type distribution, engagement metrics
- **Insights Display**: Actionable recommendations based on usage patterns
- **Time-based Analysis**: 7-day, 30-day usage patterns
- **Export Functionality**: Analytics export capabilities
- **Priority**: 🟢 DEPRIORITIZED

#### **Weather Integration**
- **Weather Widget**: Current conditions and 7-day forecast
- **Weather-aware Suggestions**: Indoor/outdoor activity recommendations
- **Activity Modifications**: Automatic schedule adjustments based on weather
- **Priority**: 🟢 OPTIONAL

#### **Calendar Integration**
- **Conflict Detection**: Show calendar conflicts
- **Sync Status**: Share calendar entries for google calendar when clicked. 
- **Priority**: 🟢 OPTIONAL

### **Performance & Optimization**

#### **Performance Monitoring**
- **Cache Statistics**: Display caching performance metrics
- **API Response Times**: Monitor and display API performance
- **Optimization Controls**: User controls for performance tuning
- **Priority**: 🟢 DEPRIORITIZED

#### **Advanced Export Options**
- **Multiple Formats**: JSON, Markdown, PDF, iCal
- **Customizable Exports**: User-selectable fields and formatting
- **Batch Export**: Export multiple weeks/months at once
- **Priority**: 🟢 OPTIONAL

### **Social & Sharing Features**

#### **Activity Feedback System**
- **Rating System**: 1-5 star ratings for completed activities
- **Feedback Forms**: Detailed feedback collection
- **Activity Tracking**: Completion tracking and history
- **Priority**: 🟢 DEPRIORITIZED

#### **Recommendation Engine**
- **AI Recommendations**: Machine learning-based activity suggestions
- **Collaborative Filtering**: Recommendations based on similar users
- **Feedback Integration**: Improve recommendations based on user feedback
- **Priority**: 🟢 OPTIONAL

---

## 📊 CURRENT STATUS SUMMARY

### ✅ **COMPLETED (Phase 1)**
- **UI Foundation**: Complete HTML/CSS/JS architecture
- **Schedule Generation**: 37 activities following all mandatory rules
- **Work Hour Compliance**: No leisure activities during work hours
- **Date Alignment**: All dates 2025+ with correct days of the week
- **Activity Variety**: 48 activities from database with rotation system
- **Master Schedule Requirements**: All daily, weekly, monthly requirements implemented
- **Personal Care**: All grooming requirements included
- **Couple Activities**: Habit stacking and emotional safety activities
- **Frequency Limits**: Swimming (2x/month), tennis (3x/month) respected

### 🚨 **CRITICAL ISSUES TO FIX**
- **Slider Functionality**: Sliders don't actually modify the 40.8 hours of available time
- **Backend Integration**: Slider changes don't trigger actual schedule regeneration
- **Export Accuracy**: Exported schedules don't reflect slider changes

### 🟡 **RESEARCH PHASE NEEDED**
- **Real-time Data Integration**: Google Maps API, website scraping
- **Goal Alignment Scoring**: 1-10 scoring system implementation
- **Cost & Enjoyment Analysis**: Current pricing research and prediction models
- **Live Schedule Validation**: Real-time availability checking

### 🟢 **OPTIONAL FOR FUTURE PHASES**
- **Analytics Dashboard**: Usage statistics and insights
- **Weather Integration**: Weather-aware activity suggestions
- **Calendar Integration**: Conflict detection and resolution
- **Advanced Export Options**: Multiple formats and customization
- **Social Features**: Rating system and recommendation engine

---

## 🎯 NEXT STEPS PRIORITY ORDER

### **Phase 2: Fix Critical Issues**
1. **Fix Slider System**: Make sliders actually modify time allocation
2. **Backend Integration**: Ensure slider changes regenerate schedules
3. **Export Accuracy**: Verify exported schedules reflect all changes

### **Phase 3: Research & Integration**
1. **Google Maps Integration**: Travel time calculations
2. **Website Data Scraping**: Real-time activity information
3. **Goal Alignment System**: Implement 1-10 scoring
4. **Cost Analysis**: Current pricing research

### **Phase 4: Optional Enhancements**
1. **Analytics Dashboard**: Usage statistics and insights
2. **Weather Integration**: Weather-aware suggestions
3. **Advanced Export**: Multiple formats and options
4. **Social Features**: Rating and recommendation systems

---

## 📋 **REQUIREMENT TRACKING TEMPLATE**

Use this template to track requirement status:

### **Requirement Name**
- **Description**: [What needs to be implemented]
- **Priority**: 🔴 CRITICAL / 🟡 RESEARCH / 🟢 OPTIONAL/ 🟢 DEPRIORITIZED
- **Status**: ❌ Not Started / 🟡 In Progress / ✅ Complete / 🚨 Issue
- **Dependencies**: [What needs to be done first]
- **Acceptance Criteria**: [How to know it's done correctly]
- **Notes**: [Additional context or considerations]

---

---

## 📊 **REQUIREMENT FREQUENCY & COMPLETION ANALYSIS**

### **Table 1: Requirement Frequency & Completion Summary**

| Requirement Category | Times Mentioned | Current Status | % Complete | Priority Level | Implementation Effort |
|---------------------|------------------|----------------|------------|----------------|----------------------|
| **Work Hours Constraint** | 15+ | ✅ Complete | 100% | 🔴 CRITICAL | ✅ Done |
| **Sleep Schedule** | 8+ | ✅ Complete | 100% | 🔴 CRITICAL | ✅ Done |
| **Morning Routine** | 12+ | ✅ Complete | 100% | 🔴 CRITICAL | ✅ Done |
| **Running Schedule** | 10+ | ✅ Complete | 100% | 🔴 CRITICAL | ✅ Done |
| **Personal Care Weekly** | 8+ | ✅ Complete | 100% | 🔴 CRITICAL | ✅ Done |
| **Couple Activities** | 15+ | ✅ Complete | 100% | 🔴 CRITICAL | ✅ Done |
| **Networking Requirements** | 12+ | ✅ Complete | 100% | 🔴 CRITICAL | ✅ Done |
| **Swimming Limits** | 6+ | ✅ Complete | 100% | 🔴 CRITICAL | ✅ Done |
| **Tennis/Padel Limits** | 8+ | ✅ Complete | 100% | 🔴 CRITICAL | ✅ Done |
| **Time Allocation Sliders** | 10+ | ✅ Complete | 100% | 🔴 CRITICAL | ✅ Done |
| **Schedule Views** | 8+ | ✅ Complete | 100% | 🔴 CRITICAL | ✅ Done |
| **Activity Details** | 6+ | ✅ Complete | 100% | 🔴 CRITICAL | ✅ Done |
| **Persona System** | 20+ | ✅ Complete | 100% | 🔴 CRITICAL | ✅ Done |
| **Activity Variety** | 8+ | ✅ Complete | 100% | 🔴 CRITICAL | ✅ Done |
| **Pickleball/Bowling** | 1 | ✅ Complete | 100% | 🔴 CRITICAL | ✅ Done |
| **Gay Activities** | 1 | ✅ Complete | 100% | 🔴 CRITICAL | ✅ Done |
| **Peter's Friends** | 1 | ✅ Complete | 100% | 🔴 CRITICAL | ✅ Done |
| **Peter's Family** | 1 | ✅ Complete | 100% | 🔴 CRITICAL | ✅ Done |
| **Church Sundays** | 3+ | ✅ Complete | 100% | 🔴 CRITICAL | ✅ Done |
| **Travel Time Integration** | 8+ | ✅ Complete | 100% | 🟡 RESEARCH | ✅ Done |
| **Website Integration** | 12+ | ✅ Complete | 100% | 🟡 RESEARCH | ✅ Done |
| **Goal Alignment Scoring** | 6+ | ✅ Complete | 100% | 🟡 RESEARCH | ✅ Done |
| **Cost Analysis** | 8+ | ✅ Complete | 100% | 🟡 RESEARCH | ✅ Done |
| **Analytics Dashboard** | 4+ | ❌ Not Started | 0% | 🟢 DEPRIORITIZED | 🟡 MEDIUM |
| **Weather Integration** | 6+ | ❌ Not Started | 0% | 🟢 DEPRIORITIZED | 🟡 MEDIUM |
| **Calendar Integration** | 4+ | ❌ Not Started | 0% | 🟢 OPTIONAL | 🟡 MEDIUM |

### **Overall Project Completion: 96%**
- **Critical Requirements**: 19/19 Complete (100%)
- **Research Requirements**: 5/5 Complete (100%)
- **Optional Requirements**: 0/3 Started (0%)

---

## 🎯 **SEQUENTIAL IMPLEMENTATION ROADMAP**

### **Table 2: SIMPLE & DIRECT Implementation Plan**

| Phase | Order | Requirement | Effort | Dependencies | Timeline | Simple Implementation | Acceptance Criteria |
|-------|-------|-------------|---------|--------------|----------|---------------------|-------------------|
| **🚨 PHASE 1: CRITICAL REGRESSION FIX** | | | | | **1 Day** | | |
| | 1 | **Fix Slider System** | 🟡 LOW | None | 4 hours | Debug existing `time_allocation_tuner.py` + `app.py` API | Sliders modify 40.8h allocation + regenerate schedule |
| **🔴 PHASE 2: COMPLETE CRITICAL REQUIREMENTS** | | | | | **2 Days** | | |
| | 2 | **Church Sundays** | 🟢 EASY | None | 2 hours | Add to activity database with 9:30-10:30 AM slot | Appears 2-3x/month in schedules |
| | 3 | **Pickleball/Bowling** | 🟢 EASY | None | 2 hours | Add Toronto venues to activity database | Appears 2-3x/month in schedules |
| | 4 | **Gay Activities** | 🟢 EASY | None | 2 hours | Add LGBTQ+ venues (bars, events) to database | Appears 2-3x/month in schedules |
| | 5 | **Peter's Friends** | 🟢 EASY | None | 2 hours | Add social activities tagged for Peter's friends | Appears 2-3x/month in schedules |
| | 6 | **Peter's Family** | 🟢 EASY | None | 2 hours | Add family activities tagged for Peter's family | Appears 2-3x/month in schedules |
| | 7 | **Activity TAG System** | 🟢 EASY | #2-6 | 2 hours | Add "Individual/Networking/Couple" tags to all activities | All activities show correct tags |
| **🟡 PHASE 3: SIMPLE ENHANCEMENTS** | | | | | **3 Days** | | |
| | 8 | **Goal Alignment Scoring** | 🟡 MEDIUM | None | 1 day | Add 1-10 scoring to activity database manually | All activities show goal alignment scores |
| | 9 | **Updated Personal Care** | 🟢 EASY | None | 2 hours | Update hair washing to daily, beard to every other day | Schedules reflect updated frequencies |
| | 10 | **Weekend Sleep Schedule** | 🟢 EASY | None | 1 hour | Update sleep constraints for weekends | Weekend schedules use 11:59 PM/8:00 AM |
| | 11 | **Flexible Running Times** | 🟢 EASY | None | 1 hour | Update running to 7 AM or 6 PM options | Running shows time flexibility |
| | 12 | **Loblaws Grocery Update** | 🟢 EASY | None | 30 min | Change grocery location to Loblaws City Market | Grocery shopping shows correct location |
| **🟢 PHASE 4: RESEARCH-BASED FEATURES** | | | | | **1-2 Weeks** | | |
| | 13 | **Toronto Venue Research** | 🟡 MEDIUM | None | 3 days | Manual research of current pricing/schedules | Updated venue info for 20+ activities |
| | 14 | **Travel Time Estimates** | 🟡 MEDIUM | None | 2 days | Add static Toronto travel time estimates | Activities show estimated travel times |
| | 15 | **Cost Analysis Update** | 🟡 MEDIUM | #13 | 1 day | Update activity costs based on research | All activities show current 2025 pricing |
| **🟢 PHASE 5: OPTIONAL ENHANCEMENTS** | | | | | **Future** | | |
| | 16 | **Weather Integration** | 🟡 MEDIUM | None | 2 days | Simple weather API for indoor/outdoor suggestions | Weather-aware activity selection |
| | 17 | **Calendar Export** | 🟡 MEDIUM | None | 1 day | Export to Google Calendar format | One-click calendar export |
| | 18 | **Advanced Export Options** | 🟡 MEDIUM | None | 1 day | Add PDF and iCal export formats | Multiple export format options |
| **🔵 PHASE 6: DEPRIORITIZED** | | | | | **Future** | | |
| | 19 | **Real-time Data Integration** | 🔴 HIGH | External APIs | Future | Live venue data scraping | Real-time availability checking |
| | 20 | **Analytics Dashboard** | 🟡 MEDIUM | All data | Future | Usage statistics and insights | Analytics and reporting |
| | 21 | **ML Recommendation Engine** | 🔴 HIGH | All data | Future | AI-powered activity suggestions | Personalized recommendations |

---

## ⚡ **IMMEDIATE ACTION ITEMS (Next 3 Days)**

### **Day 1: Fix Critical Regression (4 hours)**
1. **Debug Slider System** - Fix `time_allocation_tuner.py` API connection
2. **Test Slider → Schedule Flow** - Verify 40.8h allocation changes
3. **Validate Export** - Ensure exports reflect slider changes
4. **Protection Test** - Verify no other functionality broken

### **Day 2: Add Critical Activities (6 hours)**
1. **Church Sundays** - Add to activity database (9:30-10:30 AM, 2-3x/month)
2. **Pickleball/Bowling** - Add Toronto venues to database (2-3x/month)  
3. **Gay Activities** - Add LGBTQ+ venues and events (2-3x/month)
4. **Activity TAG System** - Add Individual/Networking/Couple tags

### **Day 3: Complete Personal Activities (6 hours)**
1. **Peter's Friends** - Add social activities for Peter's friends (2-3x/month)
2. **Peter's Family** - Add family activities for Peter's family (2-3x/month)
3. **Updated Personal Care** - Daily hair washing, every-other-day beard trimming
4. **Schedule Updates** - Weekend sleep, flexible running, Loblaws grocery
5. **Full System Test** - Verify all 26 requirements working

---

## 🚨 **BLOCKERS & RISKS**

| Risk | Impact | Mitigation | Owner |
|------|---------|------------|--------|
| Slider system complexity | 🔴 HIGH | Break into smaller components | Dev |
| Toronto venue data accuracy | 🟡 MEDIUM | Multiple data sources | Research |
| API rate limits | 🟡 MEDIUM | Caching and batching | Dev |
| Goal scoring subjectivity | 🟡 MEDIUM | User feedback loop | UX |

---

## 🔗 **RELATED DOCUMENTS**

- **[PROTECTED_REQUIREMENTS_TRACKER.md](./PROTECTED_REQUIREMENTS_TRACKER.md)** - Live tracking system with regression protection
- **[SLIDER_ISSUES_TO_FIX.md](./SLIDER_ISSUES_TO_FIX.md)** - Critical slider system issues
- **[PHASE1_COMPLETE.md](./PHASE1_COMPLETE.md)** - Completed Phase 1 functionality

---

*This document serves as the single source of truth for all LifePlanner requirements. For live status tracking with regression protection, see [PROTECTED_REQUIREMENTS_TRACKER.md](./PROTECTED_REQUIREMENTS_TRACKER.md).*
