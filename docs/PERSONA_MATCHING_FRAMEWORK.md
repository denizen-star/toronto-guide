# 🎯 Persona Matching Framework

## Overview: Main User + Partner Structure

**Main User (Kevin)**: Primary persona with career-focused variations
**Partner (Peter)**: Supporting persona (optional for single users)

## 📊 Core Characteristics Needed for Each Persona

### **Main User (Kevin) - Core Attributes**

#### **1. Demographics & Life Stage**
- **Age Range**: 35-50 (professional peak years)
- **Location**: City (Toronto focus, expandable)
- **Relationship Status**: Single/Partnered/Married
- **Time in City**: New (0-2 years) / Established (2+ years)
- **Education Level**: University+ (professional class)
- **Income Level**: Moderate to High ($75k-$200k+)

#### **2. Career Status (KEY DIFFERENTIATOR)**
- **Employment Status**: Employed / Job Searching / Career Transition
- **Job Satisfaction**: High (7-10) / Medium (4-6) / Low (1-3)
- **Career Stability**: Secure / Uncertain / Actively Changing
- **Professional Growth**: Advancing / Stagnant / Pivoting

#### **3. Personality Traits**
- **Energy Pattern**: Morning Person / Night Person / Variable
- **Social Style**: Introvert / Extrovert / Ambivert
- **Decision Making**: Analytical / Intuitive / Collaborative
- **Risk Tolerance**: Conservative (1-3) / Moderate (4-7) / Adventurous (8-10)
- **Organization Style**: Highly Structured / Moderately Organized / Flexible
- **Perfectionism Level**: Low (1-3) / Medium (4-7) / High (8-10)

#### **4. Life Priorities (Changes based on career status)**
- **Career Focus**: Growth / Stability / Transition / Exit
- **Financial Security**: Building / Maintaining / Struggling
- **Social Network**: Building / Maintaining / Expanding
- **Work-Life Balance**: Achieving / Struggling / Prioritizing
- **Personal Development**: Active / Moderate / Low Priority

#### **5. Time Availability & Constraints**
- **Work Schedule**: Fixed / Flexible / Variable / None
- **Evening Availability**: High / Medium / Low
- **Weekend Availability**: High / Medium / Low
- **Travel Flexibility**: High / Medium / Low

### **Partner (Peter) - Supporting Characteristics**

#### **1. Core Demographics**
- **Age Range**: Relative to main user (±10 years)
- **Career Status**: Independent / Supportive / Flexible
- **Income Level**: Independent / Combined household
- **Time in City**: Usually longer than main user

#### **2. Support Style**
- **Relationship Dynamic**: Equal Partner / Supportive / Independent
- **Social Integration**: Facilitator / Participant / Observer
- **Decision Making**: Joint / Defers to Partner / Independent
- **Activity Participation**: High / Selective / Low

## 🔍 Onboarding Questions for Persona Matching

### **Section 1: Career & Work Status (Primary Differentiator)**

#### **Q1: What best describes your current work situation?**
- A) Employed and satisfied with my current role ➜ **Working Kevin**
- B) Employed but looking for new opportunities ➜ **Job Searching Kevin**
- C) Unemployed and actively job searching ➜ **Job Searching Kevin**
- D) Between jobs or career transitioning ➜ **Job Searching Kevin**
- E) Self-employed/entrepreneur ➜ **Future Persona**

#### **Q2: How would you rate your job satisfaction? (1-10)**
- 8-10 ➜ **Working Kevin**
- 5-7 ➜ **Leaning Job Searching Kevin** (depends on other factors)
- 1-4 ➜ **Job Searching Kevin**

#### **Q3: What's your primary career goal right now?**
- A) Excel in my current role and build my network ➜ **Working Kevin**
- B) Find a new job or career opportunity ➜ **Job Searching Kevin**
- C) Get promoted within my current company ➜ **Working Kevin**
- D) Change careers entirely ➜ **Job Searching Kevin**
- E) Start my own business ➜ **Future Persona**

### **Section 2: Time & Availability**

#### **Q4: How flexible is your current schedule?**
- A) Very structured, fixed hours ➜ **Working Kevin traits**
- B) Somewhat flexible within business hours ➜ **Working Kevin traits**
- C) Very flexible, I control my time ➜ **Job Searching Kevin traits**
- D) No fixed schedule currently ➜ **Job Searching Kevin traits**

#### **Q5: How much time can you dedicate to networking/career activities per week?**
- A) 2-4 hours (after work/weekends) ➜ **Working Kevin**
- B) 5-10 hours (dedicated job search time) ➜ **Job Searching Kevin**
- C) 10+ hours (full-time job searching) ➜ **Job Searching Kevin**
- D) 1-2 hours (maintenance networking) ➜ **Working Kevin**

### **Section 3: Financial Situation**

#### **Q6: How would you describe your current financial situation?**
- A) Stable income, comfortable spending ➜ **Working Kevin** (Budget: $200/day)
- B) Stable but being more cautious with spending ➜ **Working Kevin** (Budget: $150/day)
- C) Reduced income, need to budget carefully ➜ **Job Searching Kevin** (Budget: $100/day)
- D) Very tight budget, minimal discretionary spending ➜ **Job Searching Kevin** (Budget: $50/day)

### **Section 4: Social & Networking Priorities**

#### **Q7: What's your main networking priority right now?**
- A) Building relationships in my current industry ➜ **Working Kevin**
- B) Exploring new industries and opportunities ➜ **Job Searching Kevin**
- C) Meeting recruiters and hiring managers ➜ **Job Searching Kevin**
- D) Maintaining existing professional relationships ➜ **Working Kevin**

#### **Q8: How urgent do you feel about expanding your network?**
- A) Not urgent, steady growth is fine ➜ **Working Kevin**
- B) Somewhat urgent, want to accelerate ➜ **Working Kevin**
- C) Very urgent, need opportunities soon ➜ **Job Searching Kevin**
- D) Extremely urgent, need results quickly ➜ **Job Searching Kevin**

### **Section 5: Lifestyle & Stress Management**

#### **Q9: How are your stress levels lately?**
- A) Low to moderate, manageable ➜ **Working Kevin**
- B) Moderate, some work pressure ➜ **Working Kevin**
- C) High due to job uncertainty ➜ **Job Searching Kevin**
- D) Very high, career situation is stressful ➜ **Job Searching Kevin**

#### **Q10: What's your main focus for personal activities?**
- A) Maintaining work-life balance ➜ **Working Kevin**
- B) Building skills for career advancement ➜ **Working Kevin**
- C) Stress relief and staying positive ➜ **Job Searching Kevin**
- D) Networking and opportunity creation ➜ **Job Searching Kevin**

## 🎯 Persona Matching Algorithm

### **Working Kevin Match Criteria:**
- **Employment Status**: Currently employed (Q1: A or C)
- **Job Satisfaction**: Medium to High (Q2: 5-10)
- **Career Goal**: Growth/advancement in current path (Q3: A or C)
- **Schedule**: Structured with limited flexibility (Q4: A or B)
- **Networking Time**: Limited, after-hours (Q5: A or D)
- **Financial**: Stable income (Q6: A or B)
- **Networking Priority**: Industry-focused (Q7: A or D)
- **Urgency**: Low to moderate (Q8: A or B)
- **Stress**: Manageable levels (Q9: A or B)
- **Focus**: Balance and advancement (Q10: A or B)

**Score Calculation**: 7+ matches = Working Kevin

### **Job Searching Kevin Match Criteria:**
- **Employment Status**: Unemployed or unhappy (Q1: B, C, or D)
- **Job Satisfaction**: Low to medium (Q2: 1-7)
- **Career Goal**: Finding new opportunities (Q3: B or D)
- **Schedule**: High flexibility (Q4: C or D)
- **Networking Time**: Significant time available (Q5: B or C)
- **Financial**: Reduced/careful spending (Q6: C or D)
- **Networking Priority**: Opportunity-focused (Q7: B or C)
- **Urgency**: High urgency (Q8: C or D)
- **Stress**: Elevated due to uncertainty (Q9: C or D)
- **Focus**: Opportunity and stress management (Q10: C or D)

**Score Calculation**: 7+ matches = Job Searching Kevin

## 📋 Key Differences Between Personas

### **Working Kevin**
- **Primary Focus**: Performance in current role + strategic networking
- **Time Constraints**: Work schedule limits networking to evenings/weekends
- **Budget**: Higher ($150-200/day) - stable income
- **Networking Style**: Industry-focused, relationship building
- **Activities**: Professional development, industry events, skill building
- **Stress Level**: Moderate, manageable
- **Goals**: Advancement, promotion, strategic career moves
- **Timeline**: Long-term planning, steady growth

### **Job Searching Kevin**
- **Primary Focus**: Finding new opportunities + immediate networking
- **Time Constraints**: Flexible schedule but urgent timeline
- **Budget**: Lower ($50-100/day) - reduced/no income
- **Networking Style**: Opportunity-focused, broad networking
- **Activities**: Job search events, informational interviews, skill gaps
- **Stress Level**: High due to uncertainty
- **Goals**: Immediate employment, career transition
- **Timeline**: Short-term urgency, quick results needed

## 🔮 Framework for 5+ Future Personas

### **Planned Persona Expansion:**

1. **Entrepreneur Kevin**: Starting own business
2. **Freelancer Kevin**: Independent contractor/consultant
3. **Career Changer Kevin**: Switching industries entirely
4. **Executive Kevin**: Senior leadership role
5. **Retired Kevin**: Post-career lifestyle focus

### **Additional Questions for Future Personas:**

#### **Q11: What's your ideal work arrangement?**
- A) Traditional employment ➜ Working/Job Searching Kevin
- B) Freelancing/consulting ➜ Freelancer Kevin
- C) Starting my own business ➜ Entrepreneur Kevin
- D) Senior executive role ➜ Executive Kevin
- E) Retired/semi-retired ➜ Retired Kevin

#### **Q12: What's your risk tolerance for career changes?**
- 1-3: Conservative ➜ Working Kevin
- 4-7: Moderate ➜ Job Searching Kevin
- 8-10: High ➜ Entrepreneur/Career Changer Kevin

## 🚀 Implementation Strategy

### **Phase 1: Core Matching (Current)**
- Implement Working Kevin vs Job Searching Kevin matching
- 10-question onboarding flow
- Basic persona assignment algorithm

### **Phase 2: Enhanced Matching**
- Add Partner (Peter) matching questions
- Relationship dynamic assessment
- Couple activity preferences

### **Phase 3: Persona Expansion**
- Add 5 additional Kevin personas
- Expanded question set (15-20 questions)
- Advanced matching algorithm with confidence scores

### **Phase 4: Dynamic Matching**
- Periodic re-assessment
- Context-based persona switching
- AI-driven persona refinement

This framework ensures users are matched to the most appropriate persona based on their current career situation, leading to more relevant recommendations and better user experience.
