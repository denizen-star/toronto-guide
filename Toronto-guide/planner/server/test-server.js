const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const RealEmailService = require('./realEmailService');
const authTestRoutes = require('./authTestRoutes');

const app = express();
const PORT = 3001;

// Initialize real email service
const emailService = new RealEmailService();

// Middleware
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());

// Session configuration for testing
app.use(session({
  secret: 'test-session-secret-for-development',
  name: 'optimizer_test_session',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // HTTP for development
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(express.static(path.join(__dirname, '../public')));

// Health check
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'Optimizer test server is running'
  });
});

// Configuration endpoint
app.get('/api/test/config', (req, res) => {
  console.log('Config check requested');
  const status = emailService.getServiceStatus();
  const config = {
    success: true,
    sendgridConfigured: status.configured,
    fromEmail: status.fromEmail,
    fromName: status.fromName,
    serverRunning: true,
    issues: status.issues
  };
  res.json(config);
});

// Test email endpoint
app.post('/api/test/send-email', async (req, res) => {
  const { email, type } = req.body;
  console.log(`📧 Real email test requested: ${type} to ${email}`);
  
  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email address is required'
    });
  }
  
  try {
    // Create mock user for testing
    const mockUser = {
      id: 'test-user-id',
      email: email,
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
      isActive: true,
      emailVerified: false,
      profileCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    let result;
    
    switch (type) {
      case 'simple':
        result = await emailService.sendSimpleEmail(
          email,
          'Optimizer Test Email',
          'Hello! This is a test email from Optimizer to verify SendGrid is working correctly.',
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50;">🎉 Optimizer Test Email</h2>
            <p>Hello!</p>
            <p>This is a test email from <strong>Optimizer</strong> to verify SendGrid is working correctly.</p>
            <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
              <strong>✅ If you receive this email, SendGrid is configured correctly!</strong>
            </div>
            <p>You can now proceed with testing the full authentication system.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">This is a test email from Optimizer development environment.</p>
          </div>
          `
        );
        break;
        
      case 'welcome':
        result = await emailService.sendWelcomeEmail(mockUser);
        break;
        
      case 'verification':
        result = await emailService.sendEmailVerification(mockUser, 'test-verification-token-123');
        break;
        
      case 'password-reset':
        result = await emailService.sendPasswordReset(mockUser, 'test-reset-token-456');
        break;
        
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid email type'
        });
    }
    
    if (result.success) {
      res.json({
        success: true,
        message: `${type} email sent successfully to ${email}`,
        emailType: type,
        statusCode: result.statusCode
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        details: result.details
      });
    }
    
  } catch (error) {
    console.error('❌ Test email error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
  console.log(`📧 SendGrid API Key: ${process.env.SENDGRID_API_KEY ? 'Configured' : 'Missing'}`);
  console.log(`📄 Test page: http://localhost:${PORT}/test-sendgrid.html`);
});

process.on('SIGTERM', () => {
  console.log('Server shutting down...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Server shutting down...');
  process.exit(0);
});
