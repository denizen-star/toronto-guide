# Optimizer - React Application

A comprehensive personal life management application with a modular architecture, designed to help users create structured, goal-oriented schedules based on their personality and preferences.

## 🏗️ Architecture

This application follows a **5-Module Architecture**:

1. **Login and Member Management** - Authentication, user accounts, profiles
2. **Persona Module** - Decision tree-based personality assessment and goal setting  
3. **Activities Module** - Comprehensive activity catalog and management
4. **Schedule Management** - AI-powered schedule generation and optimization
5. **Goal Tracking** - Progress monitoring and analytics

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm 8+
- PostgreSQL 12+
- SendGrid account (for email functionality)

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd /Users/kervinleacock/Documents/Development/LifePlanner/Toronto-guide/planner
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database and SendGrid credentials
   ```

4. **Set up the database**:
   ```bash
    # Create PostgreSQL database
    createdb optimizer_db
   
   # Run migrations
   npm run db:migrate
   ```

5. **Start the development servers**:
   ```bash
   # Start both frontend and backend
   npm run start:dev
   
   # Or start separately:
   npm run start:server  # Backend on port 5000
   npm start            # Frontend on port 3000
   ```

## 📧 SendGrid Setup

Follow the comprehensive tutorial in `docs/sendgrid-tutorial.md` to set up email functionality:

1. Create SendGrid account
2. Generate API key
3. Verify sender identity
4. Create email templates
5. Update environment variables

## 🗃️ Database Schema

The application uses PostgreSQL with UUID primary keys. Key tables include:

- `users` - User accounts and authentication
- `user_profiles` - Extended user information and preferences
- `user_sessions` - Session-based authentication storage
- `user_audit_logs` - Activity logging for security and compliance
- `password_reset_tokens` - Temporary tokens for password reset
- `email_verification_tokens` - Email verification tokens

## 🔐 Authentication

The application uses **session-based authentication** with the following features:

- Secure password hashing with bcrypt
- Email verification for new accounts
- Password reset via email
- Session management with PostgreSQL storage
- Rate limiting on authentication endpoints
- Comprehensive audit logging

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter

## 📁 Project Structure

```
src/
├── modules/
│   ├── login-member-management/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Authentication & authorization
│   │   ├── models/          # Database models
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript definitions
│   │   └── utils/           # Helper functions
│   ├── persona-module/
│   │   └── data/           # Decision tree questions
│   └── activities-module/
│       └── data/           # Activity catalog
├── components/             # Shared React components
├── store/                 # Zustand state management
└── types/                 # Global TypeScript types

server/
├── index.js              # Express server setup
├── config/               # Server configuration
└── scripts/              # Database utilities

docs/
├── tech-stack.md         # Technology documentation
├── application-description.md  # Project overview
└── sendgrid-tutorial.md  # Email setup guide
```

## 🛠️ Available Scripts

### Development
- `npm start` - Start React development server
- `npm run start:server` - Start Express backend server
- `npm run start:dev` - Start both frontend and backend concurrently

### Database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data (coming soon)

### Testing
- `npm test` - Run React tests
- `npm run test:server` - Run backend tests
- `npm run type-check` - TypeScript type checking

### Build
- `npm run build` - Build React app for production

## 🌐 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token
- `GET /verify-email/:token` - Verify email address
- `GET /me` - Get current user
- `GET /check` - Check authentication status

## 🔧 Environment Variables

Key environment variables (see `.env.example`):

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/lifeplanner_db

# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Session
SESSION_SECRET=your_secure_secret

# SendGrid
SENDGRID_API_KEY=SG.your_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_EMAIL_VERIFICATION_TEMPLATE=d-template_id
SENDGRID_PASSWORD_RESET_TEMPLATE=d-template_id
```

## 🧪 Testing

The application includes comprehensive testing:

- **Frontend**: Jest + React Testing Library
- **Backend**: Jest + Supertest
- **Database**: Test database with isolated transactions

Run tests:
```bash
npm test              # Frontend tests
npm run test:server   # Backend tests
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production database
3. Set up SendGrid with verified domain
4. Configure CORS for production domain
5. Set secure session configuration

## 📚 Documentation

- **[Tech Stack](docs/tech-stack.md)** - Detailed technology documentation
- **[Application Description](docs/application-description.md)** - Project overview and architecture
- **[SendGrid Tutorial](docs/sendgrid-tutorial.md)** - Complete email setup guide
- **[Module Definitions](../../../MODULES-DEFINED.md)** - Module architecture specification

## 🤝 Contributing

This is currently a private project under active development. The modular architecture makes it easy to work on individual features independently.

### Development Workflow
1. Work on individual modules in isolation
2. Follow TypeScript strict mode
3. Write tests for new functionality
4. Update documentation as needed

## 📄 License

Private project - All rights reserved.

## 🆘 Support

For issues or questions:
1. Check the documentation in the `docs/` folder
2. Review the tech stack troubleshooting guide
3. Check SendGrid configuration if email issues occur

---

**Current Status**: Login and Member Management module implemented and ready for testing.
**Next Steps**: Implement Persona Module with decision tree functionality.
