// Test routes for browser-based testing
const express = require('express');
// const { EmailService } = require('../src/modules/login-member-management/services/emailService');

// Temporary EmailService mock for testing
class EmailService {
  getServiceStatus() {
    return {
      configured: !!process.env.SENDGRID_API_KEY,
      fromEmail: process.env.SENDGRID_FROM_EMAIL || 'Not configured',
      fromName: process.env.SENDGRID_FROM_NAME || 'Not configured',
      issues: []
    };
  }
  
  async sendSimpleEmail(to, subject, text, html) {
    // Mock implementation - replace with real SendGrid when ready
    if (!process.env.SENDGRID_API_KEY) {
      return { success: false, error: 'SendGrid API key not configured' };
    }
    
    console.log(`Mock email sent to: ${to}`);
    console.log(`Subject: ${subject}`);
    
    // For now, just return success - implement real SendGrid later
    return { success: true, message: 'Email sent (mock)' };
  }
  
  async sendWelcomeEmail(user) {
    return this.sendSimpleEmail(user.email, 'Welcome!', 'Welcome to Optimizer!');
  }
  
  async sendEmailVerification(user, token) {
    return this.sendSimpleEmail(user.email, 'Verify Email', `Verification token: ${token}`);
  }
  
  async sendPasswordReset(user, token) {
    return this.sendSimpleEmail(user.email, 'Reset Password', `Reset token: ${token}`);
  }
}

const router = express.Router();

// Test configuration endpoint
router.get('/config', (req, res) => {
  try {
    const emailService = new EmailService();
    const status = emailService.getServiceStatus();
    
    res.json({
      success: true,
      sendgridConfigured: status.configured,
      fromEmail: status.fromEmail,
      fromName: status.fromName,
      serverRunning: true,
      issues: status.issues
    });
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
router.post('/send-email', async (req, res) => {
  try {
    const { email, type } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email address is required'
      });
    }
    
    const emailService = new EmailService();
    let result;
    
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
        emailType: type
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Failed to send email'
      });
    }
    
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check for test routes
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Test routes are working',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
