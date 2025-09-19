# Dynamic Persona Selector Framework

## 🎯 Overview

This framework provides flexible persona selection, context switching, and dynamic persona management for the LifePlanner system. It addresses the limitations of the current Kevin-specific implementation by providing scalable, user-friendly persona management.

## 📋 Business Analysis of Current Personas

### **Kevin - Head of Data** (Established Professional)
- **Market Segment**: Mid-career tech executives (40-45) relocating to new cities
- **Value Proposition**: Data-driven lifestyle optimization with structured networking
- **Budget Profile**: High-income ($200/day, $1000/week)
- **Key Differentiators**: Analytical approach, selective socializing, fitness-focused
- **Business Opportunity**: Premium services for tech professionals

### **Peter - Fashion Director** (Celebrity Professional)
- **Market Segment**: Creative industry celebrities with established networks
- **Value Proposition**: Social facilitation and brand maintenance
- **Budget Profile**: Premium ($500/day, $2500/week)
- **Key Differentiators**: Celebrity status, Toronto expertise, relationship-supportive
- **Business Opportunity**: Ultra-premium lifestyle management

## 🏗️ Improved Organization Strategy

### **Problem with Current Approach**
- "Working Kevin" vs "Job Searching Kevin" creates persona duplication
- Hardcoded for specific individuals
- No scalability for different user types
- Limited flexibility for changing contexts

### **Recommended Solution: Base Persona + Context Modifiers**

Instead of separate personas, use:
1. **Base Persona**: Core identity and preferences
2. **Context Modifiers**: Temporary adjustments for specific situations
3. **Persona Families**: Groupings for similar user types
4. **Templates**: Starting points for new personas

## 📊 JSON Structure Definition

### Core Persona Structure
```json
{
  "persona_id": "unique_identifier",
  "persona_name": "Display Name", 
  "description": "Brief persona summary",
  "demographics": {
    "age_range": [min_age, max_age],
    "life_stage": "early_career|mid_career|senior_career|transition|retirement",
    "occupation": "string",
    "income_level": "low|moderate|high|premium",
    "location_preference": "city_name",
    "relationship_status": "single|married|partnered",
    "has_children": boolean,
    "education_level": "string"
  },
  "personality": {
    "personality_type": "introvert|extrovert|balanced",
    "energy_pattern": "morning_person|night_person|variable",
    "social_style": "selective|connector|balanced",
    "risk_tolerance": 1-10,
    "decision_making_style": "analytical|intuitive|collaborative"
  },
  "goals": {
    "primary_goals": ["array of main objectives"],
    "career_goals": ["professional objectives"],
    "personal_goals": ["lifestyle objectives"]
  },
  "preferences": {
    "preferred_activity_types": ["fitness", "cultural", "social"],
    "budget_preference": "low|moderate|high|premium",
    "time_preferences": {
      "morning_start": "HH:MM AM",
      "bedtime": "HH:MM PM"
    }
  },
  "constraints": {
    "max_daily_budget": number,
    "max_weekly_budget": number,
    "time_constraints": {},
    "physical_limitations": []
  }
}
```

### Context Modifier Structure
```json
{
  "context_id": "work_focus|job_search|social_building|fitness_training",
  "context_name": "Display Name",
  "description": "What this context does",
  "goal_adjustments": {"primary_goals": ["adjusted goals"]},
  "preference_adjustments": {"preferred_activity_types": ["modified types"]},
  "budget_multiplier": 0.8-1.5,
  "priority_activities": ["activities to emphasize"],
  "deprioritized_activities": ["activities to de-emphasize"],
  "duration_days": 30
}
```

### Persona Family Structure
```json
{
  "family_id": "toronto_professionals",
  "family_name": "Toronto Professionals",
  "description": "Working professionals in Toronto",
  "base_location": "Toronto",
  "target_demographics": ["mid_career", "high_income"],
  "persona_ids": ["persona1", "persona2"],
  "shared_preferences": {"location_preference": "Toronto"},
  "shared_constraints": {"work_hours": "9-6"}
}
```

## 🛠️ Framework Components

### 1. PersonaSelectorManager
Central management class that handles:
- Persona selection and switching
- Context application and management
- Family organization
- Template-based creation

### 2. Context System
**Available Contexts:**
- **Work Focus**: Prioritizes professional networking and skill development
- **Job Search**: Emphasizes career transition activities
- **Social Building**: Focuses on friendship and community building
- **Fitness Training**: Prioritizes physical fitness and health
- **Relationship Focus**: Emphasizes couple and family activities
- **Travel Mode**: Adjusts for temporary location changes

### 3. Persona Families
**Predefined Families:**
- **Toronto Professionals**: Working professionals in Toronto
- **Recent Relocators**: People new to a city
- **Creative Professionals**: Artists, designers, media professionals
- **Tech Executives**: Technology industry leaders
- **Entrepreneurs**: Business owners and startup founders

### 4. Template System
**Available Templates:**
- **Tech Executive**: High-income, analytical, networking-focused
- **Creative Professional**: Artistic, flexible schedule, cultural activities
- **Recent Relocator**: Exploration-focused, network building priority
- **Entrepreneur**: Risk-taking, business networking, flexible schedule
- **Student**: Budget-conscious, learning-focused, social
- **Parent**: Family-centered, time-constrained, community-focused
- **Retiree**: Leisure-focused, flexible schedule, wellness-oriented

## 🎨 User Interface Components

### Persona Selector Page (`/persona-selector`)
- **Context Selection**: Toggle chips for different contexts
- **Family Browsing**: Organized persona groups
- **Persona Cards**: Visual persona selection with key stats
- **Creation Wizard**: Step-by-step persona creation
- **Live Preview**: Real-time preview of selected persona + contexts

### Key UI Features:
1. **Smart Recommendations**: Suggest contexts based on persona
2. **Visual Feedback**: Clear indication of active persona and contexts
3. **Quick Switching**: Easy persona and context changes
4. **Customization**: Inline editing of persona attributes
5. **Templates**: One-click persona creation from templates

## 🔌 API Endpoints

### Persona Management
- `GET /api/persona-selector/options` - Get all selection options
- `POST /api/persona-selector/apply` - Apply persona with contexts
- `POST /api/persona-selector/create` - Create new persona
- `PUT /api/persona-selector/update/<id>` - Update existing persona
- `POST /api/persona-selector/duplicate/<id>` - Duplicate persona

### Context Management
- `GET /api/persona-selector/contexts` - Get available contexts
- `POST /api/persona-selector/contexts/<id>/apply` - Apply context
- `DELETE /api/persona-selector/contexts/<id>` - Remove context

### Family Management
- `GET /api/persona-selector/families` - Get persona families
- `GET /api/persona-selector/families/<id>/personas` - Get family personas

## 🚀 Implementation Benefits

### For Users:
1. **Flexibility**: Easy switching between different life contexts
2. **Personalization**: Create custom personas for specific needs
3. **Scalability**: Add unlimited personas without code changes
4. **Context Awareness**: Automatic adjustments based on current situation

### For Business:
1. **Market Expansion**: Support diverse user demographics
2. **User Retention**: Personalized experiences increase engagement
3. **Data Insights**: Better understanding of user preferences and patterns
4. **Monetization**: Premium features for advanced persona management

### For Development:
1. **Maintainability**: Centralized persona logic
2. **Extensibility**: Easy addition of new contexts and templates
3. **Testing**: Isolated persona logic for better testing
4. **Performance**: Efficient persona switching without data reload

## 📈 Usage Examples

### Scenario 1: Kevin's Job Search
```javascript
// Select Kevin's base persona
selectPersona('kevin_head_of_data');

// Apply job search context for 60 days
addContext('job_search', 60);

// Result: Kevin's recommendations emphasize:
// - Professional networking events
// - Skill development workshops  
// - Industry meetups
// - Reduced entertainment spending
```

### Scenario 2: New User - Sarah the Designer
```javascript
// Create persona from template
createPersona({
  name: 'Sarah - UX Designer',
  template: 'creative_professional',
  customizations: {
    location: 'Toronto',
    age_range: [28, 32],
    income_level: 'moderate'
  }
});

// Apply social building context
addContext('social_building');

// Result: Recommendations focus on:
// - Design meetups and workshops
// - Creative social events
// - Art gallery openings
// - Collaborative projects
```

## 🔄 Migration Strategy

### Phase 1: Backward Compatibility
- Keep existing Kevin/Peter personas
- Add context system alongside
- Gradual UI migration

### Phase 2: Enhanced Features
- Introduce persona families
- Add template system
- Enable persona creation

### Phase 3: Full Framework
- Complete UI overhaul
- Advanced context management
- Analytics and insights

## 📝 Next Steps

1. **Integration**: Connect framework to existing planner logic
2. **Testing**: Comprehensive testing of persona switching
3. **UI Polish**: Refine user interface based on feedback
4. **Analytics**: Add usage tracking and optimization
5. **Documentation**: User guides and developer documentation

This framework transforms the LifePlanner from a Kevin-specific tool into a flexible, scalable persona management system that can serve diverse user needs while maintaining the sophisticated personalization that makes it valuable.
