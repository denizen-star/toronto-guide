const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    message: 'Optimizer server is running'
  });
});

// Test configuration endpoint
app.get('/api/test/config', (req, res) => {
  try {
    const config = {
      success: true,
      sendgridConfigured: !!process.env.SENDGRID_API_KEY,
      fromEmail: process.env.SENDGRID_FROM_EMAIL || 'Not configured',
      fromName: process.env.SENDGRID_FROM_NAME || 'Not configured',
      serverRunning: true,
      issues: []
    };
    
    if (!process.env.SENDGRID_API_KEY) {
      config.issues.push('SENDGRID_API_KEY not configured');
    }
    
    if (!process.env.SENDGRID_FROM_EMAIL || process.env.SENDGRID_FROM_EMAIL.includes('yourdomain.com')) {
      config.issues.push('SENDGRID_FROM_EMAIL not configured with verified address');
    }
    
    res.json(config);
  } catch (error) {
    res.json({
      success: false,
      sendgridConfigured: false,
      serverRunning: true,
      error: error.message
    });
  }
});

// Test email sending endpoint
app.post('/api/test/send-email', async (req, res) => {
  try {
    const { email, type } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email address is required'
      });
    }
    
    // For now, just simulate email sending
    console.log(`📧 Simulating ${type} email to ${email}`);
    console.log(`📋 Configuration check:`);
    console.log(`   - API Key: ${process.env.SENDGRID_API_KEY ? 'Configured' : 'Missing'}`);
    console.log(`   - From Email: ${process.env.SENDGRID_FROM_EMAIL || 'Not set'}`);
    console.log(`   - From Name: ${process.env.SENDGRID_FROM_NAME || 'Not set'}`);
    
    // Simulate successful email sending
    setTimeout(() => {
      console.log(`✅ Simulated ${type} email sent successfully to ${email}`);
    }, 1000);
    
    res.json({
      success: true,
      message: `${type} email simulated successfully to ${email}`,
      emailType: type,
      note: 'This is a simulation. Complete SendGrid sender verification to send real emails.'
    });
    
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Basic auth endpoints (placeholders)
app.post('/api/auth/register', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Registration not yet implemented',
    info: 'Complete SendGrid setup and database setup first'
  });
});

app.post('/api/auth/login', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Login not yet implemented',
    info: 'Complete database setup first'
  });
});

app.get('/api/auth/check', (req, res) => {
  res.json({
    success: true,
    authenticated: false,
    message: 'Authentication system ready for setup',
    user: null
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  
  if (process.env.NODE_ENV === 'development') {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message,
      stack: err.stack
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Optimizer server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`📧 SendGrid configured: ${!!process.env.SENDGRID_API_KEY}`);
  console.log(`📱 Test interface: http://localhost:${PORT}/test-sendgrid.html`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
