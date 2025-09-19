# LifePlanner React Application

A modern React-based personal time management and scheduling application built with TypeScript, Material-UI, and Zustand state management.

## 🚀 Features

### Core Functionality
- **Persona-Based Planning**: Choose from multiple personality-driven personas to personalize your experience
- **Time Allocation Tuning**: Interactive sliders to adjust time percentages across different life categories
- **Smart Scheduling**: Intelligent schedule generation based on your persona and time allocation preferences
- **Real-time Updates**: Instant feedback as you adjust your time allocation settings

### User Interface
- **Modern Material Design**: Clean, intuitive interface using Material-UI components
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Components**: Smooth animations and engaging user interactions
- **Accessibility**: Built with accessibility best practices

### Personas Available
1. **Fashion Industry Professional**
   - High networking priority (9/10)
   - Premium budget preference ($300/day, $1500/week)
   - Extroverted, morning person, aggressive networker

2. **Creative Entrepreneur**
   - Moderate networking priority (7/10)
   - Moderate budget preference ($150/day, $800/week)
   - Ambivert, variable energy, organic networking approach

3. **Wellness-Focused Professional**
   - Balanced networking priority (6/10)
   - Conservative budget preference ($100/day, $500/week)
   - Introvert, morning person, selective networking

## 🏗️ Architecture

### Technology Stack
- **React 18** with TypeScript
- **Material-UI (MUI)** for component library
- **Zustand** for state management
- **React Router** for navigation
- **Date-fns** for date manipulation

### Project Structure
```
src/
├── components/           # Reusable React components
│   ├── PersonaSelector/  # Persona selection interface
│   └── TimeAllocationTuner/ # Time allocation controls
├── store/               # Zustand store configuration
├── types/               # TypeScript type definitions
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

### State Management
- **Zustand Store**: Centralized state management for personas, time allocation, and schedules
- **Persistent State**: Local storage integration for user preferences
- **Async Actions**: Promise-based actions for data loading and schedule generation

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager

### Installation Steps

1. **Navigate to the React app directory:**
   ```bash
   cd react-lifeplanner
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser to:**
   ```
   http://localhost:3000
   ```

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (irreversible)

## 📱 Usage Guide

### Getting Started

1. **Select Your Persona**
   - Choose from the available persona cards
   - Each persona has different goals, preferences, and constraints
   - Click "Select Persona" to proceed

2. **Adjust Time Allocation**
   - Use the interactive sliders to adjust time percentages
   - Main categories: Individual Activities, Networking & Social, Couple Activities
   - Fine-tune subcategories within each main category
   - Watch real-time updates to hours and percentages

3. **Use Quick Presets**
   - Work Focus: Emphasizes individual productivity
   - Social Focus: Maximizes networking and social activities
   - Couple Focus: Prioritizes relationship activities
   - Balanced: Even distribution across all categories

4. **Export Your Schedule**
   - Click "Export Schedule" to generate and download your personalized schedule
   - Schedules are generated based on your persona and time allocation settings

### Time Allocation Categories

#### Individual Activities (5-35%)
- **Running**: Physical fitness and endurance training
- **Personal Development**: Skill building and learning
- **Fitness & Grooming**: Health and personal care
- **Reflection & Planning**: Goal setting and life planning

#### Networking & Social (10-40%)
- **Professional Networking**: Career-focused connections
- **Social Activities**: General social engagement
- **Professional Dev Networking**: Learning-focused networking
- **Other Social**: Miscellaneous social activities

#### Couple Activities (15-45%)
- **Daily Meals**: Shared meal times
- **Evening Together**: Quality time in evenings
- **Weekend Activities**: Shared weekend experiences
- **Breakfast Together**: Morning connection time
- **Household Together**: Shared domestic activities

## 🎨 Design System

### Color Palette
- **Primary**: #2c3e50 (Dark Blue-Gray)
- **Secondary**: #3498db (Bright Blue)
- **Individual**: #4CAF50 (Green)
- **Networking**: #2196F3 (Blue)
- **Couple**: #E91E63 (Pink)

### Typography
- **Font Family**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Headings**: Bold weights for emphasis
- **Body Text**: Regular weight for readability

### Components
- **Cards**: Rounded corners (12px), subtle shadows
- **Buttons**: Rounded corners (8px), no text transform
- **Sliders**: Custom styling with brand colors
- **Icons**: Material Design icons throughout

## 🔧 Development

### Code Structure
- **Components**: Functional components with TypeScript
- **Hooks**: Custom hooks for business logic
- **Types**: Comprehensive type definitions
- **Store**: Zustand for predictable state management

### Best Practices
- **TypeScript**: Full type safety throughout the application
- **Component Composition**: Reusable, composable components
- **Separation of Concerns**: Clear separation between UI and business logic
- **Responsive Design**: Mobile-first approach

### Performance Optimizations
- **Code Splitting**: Automatic route-based code splitting
- **Memoization**: Strategic use of React.memo and useMemo
- **Bundle Optimization**: Tree shaking and dead code elimination

## 📊 Data Models

### UserPersona Interface
```typescript
interface UserPersona {
  persona_id: string;
  persona_name: string;
  description: string;
  demographics: Demographics;
  personality: PersonalityProfile;
  goals: Goals;
  preferences: Preferences;
  constraints: Constraints;
  behavioral_patterns: BehavioralPatterns;
  networking: NetworkingProfile;
  metadata: PersonaMetadata;
}
```

### TimeAllocation Interface
```typescript
interface TimeAllocation {
  individual_activities_percent: number;
  networking_social_percent: number;
  couple_activities_percent: number;
  individual_breakdown: { /* subcategory percentages */ };
  networking_breakdown: { /* subcategory percentages */ };
  couple_breakdown: { /* subcategory percentages */ };
}
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Netlify**: Automatic deployment from Git repository
- **Vercel**: Zero-configuration deployment
- **GitHub Pages**: Static site hosting
- **AWS S3**: Scalable cloud hosting

### Environment Variables
Create a `.env` file for environment-specific configuration:
```
REACT_APP_API_URL=your-api-url
REACT_APP_VERSION=1.0.0
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards
- **ESLint**: Code linting with recommended rules
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking
- **Testing**: Jest and React Testing Library

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Original Python Version**: Based on the Python Flask LifePlanner application
- **Material-UI**: For the beautiful component library
- **Zustand**: For simple and effective state management
- **React Community**: For the amazing ecosystem and tools

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/lifeplanner/issues)
- **Documentation**: See the `/docs` folder for detailed guides
- **Community**: [GitHub Discussions](https://github.com/yourusername/lifeplanner/discussions)

---

**React LifePlanner** - Transform your time into meaningful experiences with modern web technology! 🚀