# Gemini Agent Comparison Instructions
## Life Planner System Enhancement Project

### **Project Overview**
You are tasked with enhancing a personalized life planning system for Kevin (40-year-old Head of Data), a gay married man in Toronto. The system should generate detailed daily schedules balancing individual activities with couple activities to build friendships and professional networks.

### **Current System Capabilities**
The existing system includes:
- Persona-based planning with detailed user profiles
- Activity database with 47+ relationship-building activities
- Individual and couple activity scheduling
- Integration of self-help principles (Atomic Habits, Hold Me Tight, Power of a Partner)
- Conflict resolution and time management
- Cost and budget tracking

### **Required Enhancements**

#### **1. Travel Time & Location Integration**
- Calculate real-time travel time between activities using Google Maps API or similar
- Include full addresses for all activities
- Optimize activity scheduling to minimize travel time
- Account for Toronto traffic patterns and public transit options
- Store location data: address, neighborhood, accessibility, parking info

#### **2. Website Integration & Real-Time Data**
Research and integrate current information from:
- **Running Groups**: Frontrunners Toronto, other queer run clubs
- **Professional Networks**: Toronto Data Science Meetup, Toronto Machine Learning Society, Toronto AI & Fintech events
- **Fitness Venues**: THE PAD (padel), Y Trillium (swimming), Toronto Tennis Club
- **Cultural/Educational**: Art Gallery of Ontario (AGO), Toronto School of Art, The Second City (improv), Eataly (cooking classes)
- **Religious**: Catholic mass schedules (Sunday 9:30 AM)
- **Social Venues**: St. Lawrence Market, smaller music venues

#### **3. Goal Alignment Scoring System**
Create a 1-10 scoring system for how well activities align with:

**Kevin's Goals:**
- Build healthy social network outside bar scene (Weight: 9/10)
- Build professional network in Toronto, New York, Miami (Weight: 8/10)
- Complete half marathon training (Weight: 7/10)
- Drink less alcohol (Weight: 6/10)
- Practice intentional activities (Weight: 7/10)
- Establish morning/evening routines (Weight: 6/10)

**Peter's Goals:**
- Support Kevin's social network building (Weight: 8/10)
- Maintain celebrity status (Weight: 7/10)
- Balance work and personal life (Weight: 6/10)
- Spend quality time with family (Weight: 7/10)

#### **4. Cost & Enjoyment Analysis**
- Research current pricing for all activities
- Predict enjoyment levels based on personality profiles:
  - Kevin: Introvert-extrovert, analytical, spreadsheet-oriented, high perfectionism
  - Peter: Extrovert, struggles with decisions, enthusiastic, unplanned style
- Factor in budget constraints (Kevin: $200/day, $1000/week; Peter: $500/day, 1500/week)
- Suggest budget-friendly alternatives

#### **5. Real-Time Schedule Validation**
- Check current availability for classes, meetups, events
- Verify schedules haven't changed since last update
- Flag conflicts with existing commitments
- Update pricing and timing information

### **Technical Requirements**

#### **Data Sources to Research**
1. **Frontrunners Toronto** - Running club schedules and locations
2. **Toronto Data Science Meetup** - Meetup.com events and venues
3. **THE PAD** - Padel court availability and pricing
4. **Y Trillium** - Swimming schedules and membership costs
5. **Art Gallery of Ontario** - Class schedules and exhibition times
6. **The Second City** - Improv class schedules and costs
7. **Eataly** - Cooking class schedules and pricing
8. **St. Lawrence Market** - Operating hours and special events

#### **Integration Points**
- Enhance existing `toronto_life_planner.py` with travel time calculations
- Update `couple_activity_scheduler.py` with real-time data
- Modify `persona_integration.py` to include goal alignment scoring
- Create new web scraping module for schedule checking

#### **Output Format**
Generate enhanced weekly plans that include:
- Activity name, time, duration, end time
- Full address and travel time from previous activity
- Website links for booking/information
- Goal alignment scores (1-10) for each person
- Current cost and budget impact
- Predicted enjoyment level (1-10)
- Real-time availability status
- Alternative suggestions if unavailable
- Summary table at the end

### **Sample Activities to Research**
1. **Frontrunners Toronto Running Club**
   - Current schedule and locations
   - Membership costs
   - Travel time from Rosedale (4909 - 45 Charles St E)
   - Website and contact info

2. **Toronto Data Science Meetup**
   - Upcoming events and venues
   - Registration requirements
   - Networking potential
   - Cost and timing

3. **Improv Classes at The Second City**
   - Current class schedules
   - Beginner-friendly options
   - Cost per class/session
   - Location and parking

4. **Swimming at Y Trillium**
   - Pool schedules
   - Membership costs
   - Equipment rental
   - Travel time and accessibility

5. **Cooking Classes at Eataly**
   - Current class offerings
   - Pricing and duration
   - Booking requirements
   - Dietary options

### **Success Metrics**
Your enhanced system should:
- Reduce travel time between activities by 20%
- Increase goal alignment scores to 7+ for 80% of activities
- Provide real-time availability for 90% of scheduled activities
- Include accurate pricing within 10% of actual costs
- Predict enjoyment levels with 75% accuracy based on personality profiles

### **Deliverables**
1. Enhanced activity database with full location and cost data
2. Updated planning algorithms with travel time optimization
3. Real-time schedule checking module
4. Goal alignment scoring system
5. Sample enhanced weekly plan for September 15-28, 2025
6. Documentation of all data sources and APIs used

### **Constraints**
- Focus on Toronto-area activities only
- Respect budget constraints for both individuals
- Maintain work schedules (Kevin: 9 AM-6 PM weekdays)
- Preserve existing fitness routines (Kevin's running schedule)
- Support both individual and couple activities
- Avoid bar scene and alcohol-focused events
- Prioritize healthy social networks and professional development

### **Evaluation Criteria**
Compare your results against the current system on:
- Accuracy of travel time calculations
- Completeness of real-time data integration
- Goal alignment optimization
- Cost accuracy and budget management
- Enjoyment level predictions
- Overall schedule quality and feasibility
- User experience and plan clarity

Generate a comprehensive enhanced weekly plan that demonstrates all these improvements for Kevin September for the period asked

