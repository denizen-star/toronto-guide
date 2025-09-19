# 🔗 React App Persona Integration Guide

## 📋 Overview

Integration guide for incorporating the **Persona Onboarding System** into your new React application.

## 🏗️ Architecture Overview

```
React Frontend ←→ REST API ←→ Persona Matcher ←→ LifePlanner Core
```

## 🔧 Integration Components

### **1. React Components to Create**

#### **A. PersonaOnboarding.jsx** - Main questionnaire component
```jsx
// Location: src/components/PersonaOnboarding.jsx
import React, { useState, useEffect } from 'react';
import { PersonaQuestionCard } from './PersonaQuestionCard';
import { PersonaResults } from './PersonaResults';
import { ProgressBar } from './ProgressBar';

export const PersonaOnboarding = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Component logic here...
};
```

#### **B. PersonaQuestionCard.jsx** - Individual question component
```jsx
// Location: src/components/PersonaQuestionCard.jsx
import React from 'react';

export const PersonaQuestionCard = ({ 
  question, 
  onAnswer, 
  selectedAnswer,
  questionNumber,
  totalQuestions 
}) => {
  // Question rendering logic...
};
```

#### **C. PersonaResults.jsx** - Results display component
```jsx
// Location: src/components/PersonaResults.jsx
import React from 'react';

export const PersonaResults = ({ 
  result, 
  onContinue, 
  onRetake 
}) => {
  // Results display logic...
};
```

### **2. API Service Layer**

#### **PersonaService.js** - API communication
```javascript
// Location: src/services/PersonaService.js
class PersonaService {
  static BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  static async getQuestions() {
    const response = await fetch(`${this.BASE_URL}/api/questions`);
    return response.json();
  }

  static async submitResponses(responses) {
    const response = await fetch(`${this.BASE_URL}/api/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responses })
    });
    return response.json();
  }

  static async getPersonaCharacteristics(personaType) {
    const response = await fetch(`${this.BASE_URL}/api/characteristics/${personaType}`);
    return response.json();
  }
}

export default PersonaService;
```

### **3. State Management**

#### **PersonaContext.jsx** - Context for persona state
```jsx
// Location: src/context/PersonaContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

const PersonaContext = createContext();

const personaReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PERSONA':
      return { ...state, currentPersona: action.payload };
    case 'SET_ONBOARDING_COMPLETE':
      return { ...state, onboardingComplete: true };
    case 'CLEAR_PERSONA':
      return { ...state, currentPersona: null, onboardingComplete: false };
    default:
      return state;
  }
};

export const PersonaProvider = ({ children }) => {
  const [state, dispatch] = useReducer(personaReducer, {
    currentPersona: null,
    onboardingComplete: false
  });

  return (
    <PersonaContext.Provider value={{ state, dispatch }}>
      {children}
    </PersonaContext.Provider>
  );
};

export const usePersona = () => {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersona must be used within PersonaProvider');
  }
  return context;
};
```

## 🔌 Backend Integration

### **1. Flask API Server**

Use the existing `simple_onboarding_server.py` as your backend API server:

```python
# Run the persona API server
python3 persona_onboarding_system/simple_onboarding_server.py
```

**API Endpoints:**
- `GET /api/questions` - Get questionnaire
- `POST /api/match` - Submit responses, get persona match
- `GET /api/test` - Health check

### **2. CORS Configuration**

Add CORS support to your Flask server:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])  # React dev server
```

## 🎨 Styling & UI

### **1. Tailwind CSS Classes** (if using Tailwind)

```css
/* Persona onboarding styles */
.persona-card {
  @apply bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 cursor-pointer transition-all duration-300;
}

.persona-card:hover {
  @apply border-blue-500 bg-blue-50 transform -translate-y-1 shadow-xl;
}

.persona-card.selected {
  @apply border-green-500 bg-green-50 shadow-xl;
}

.progress-bar {
  @apply w-full bg-gray-200 rounded-full h-2;
}

.progress-fill {
  @apply bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500;
}
```

### **2. Component Styling**

```jsx
// Example styled components
const QuestionContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const OptionCard = styled.div`
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #3b82f6;
    background-color: #eff6ff;
    transform: translateY(-2px);
  }
  
  &.selected {
    border-color: #10b981;
    background-color: #ecfdf5;
  }
`;
```

## 🚀 Implementation Steps

### **Phase 1: Basic Integration**

1. **Set up API communication**
   ```bash
   npm install axios  # or use fetch
   ```

2. **Create basic components**
   - PersonaOnboarding.jsx
   - PersonaQuestionCard.jsx
   - PersonaResults.jsx

3. **Test API connection**
   ```javascript
   // Test in React component
   useEffect(() => {
     PersonaService.getQuestions()
       .then(data => console.log('Questions loaded:', data));
   }, []);
   ```

### **Phase 2: Enhanced Features**

1. **Add animations and transitions**
2. **Implement progress tracking**
3. **Add result visualizations**
4. **Connect to main app routing**

### **Phase 3: Production Polish**

1. **Error handling and loading states**
2. **Responsive design**
3. **Accessibility features**
4. **Analytics tracking**

## 📱 Routing Integration

### **React Router Setup**

```jsx
// In your main App.jsx
import { PersonaOnboarding } from './components/PersonaOnboarding';
import { PersonaProvider } from './context/PersonaContext';

function App() {
  return (
    <PersonaProvider>
      <Router>
        <Routes>
          <Route path="/onboarding" element={<PersonaOnboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Other routes */}
        </Routes>
      </Router>
    </PersonaProvider>
  );
}
```

### **Protected Routes**

```jsx
// Require persona onboarding before accessing main app
const ProtectedRoute = ({ children }) => {
  const { state } = usePersona();
  
  if (!state.onboardingComplete) {
    return <Navigate to="/onboarding" />;
  }
  
  return children;
};
```

## 🔄 Data Flow

```
1. User visits /onboarding
2. React loads questions from API
3. User answers questions
4. React submits responses to API
5. API returns persona match
6. React displays results
7. User continues to main app
8. Persona data available throughout app
```

## 📊 Integration Benefits

✅ **Seamless User Experience** - Smooth onboarding flow
✅ **Personalized Content** - Tailored recommendations
✅ **Data-Driven Decisions** - Persona-based feature toggling
✅ **Scalable Architecture** - Easy to add more personas
✅ **Modern Tech Stack** - React + REST API

## 🎯 Next Steps

1. **Start Flask API server** - Use `persona_onboarding_system/simple_onboarding_server.py`
2. **Create React components** - Follow the component structure above
3. **Test integration** - Verify API communication
4. **Style and polish** - Make it beautiful
5. **Deploy together** - React frontend + Flask API

---

**Reference the saved system**: `persona_onboarding_system/`
**Integration docs**: This file (`REACT_PERSONA_INTEGRATION.md`)
