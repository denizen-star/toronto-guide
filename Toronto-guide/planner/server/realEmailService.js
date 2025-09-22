// Real SendGrid Email Service Implementation
const sgMail = require('@sendgrid/mail');

class RealEmailService {
  constructor() {
    // Initialize SendGrid with API key
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      console.log('✅ SendGrid initialized with API key');
    } else {
      console.log('❌ SendGrid API key not found');
    }
    
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@yourdomain.com';
    this.fromName = process.env.SENDGRID_FROM_NAME || 'Optimizer';
  }

  getServiceStatus() {
    const issues = [];
    
    if (!process.env.SENDGRID_API_KEY) {
      issues.push('SENDGRID_API_KEY not configured');
    }
    
    if (!process.env.SENDGRID_FROM_EMAIL || process.env.SENDGRID_FROM_EMAIL.includes('yourdomain.com')) {
      issues.push('SENDGRID_FROM_EMAIL not configured with verified address');
    }
    
    return {
      configured: issues.length === 0,
      fromEmail: this.fromEmail,
      fromName: this.fromName,
      issues: issues
    };
  }

  async sendSimpleEmail(to, subject, text, html) {
    console.log(`📧 Attempting to send email to: ${to}`);
    console.log(`📋 Subject: ${subject}`);
    console.log(`📤 From: ${this.fromName} <${this.fromEmail}>`);
    
    if (!process.env.SENDGRID_API_KEY) {
      console.log('❌ SendGrid API key not configured');
      return { 
        success: false, 
        error: 'SendGrid API key not configured. Check your .env file.' 
      };
    }

    const msg = {
      to: to,
      from: {
        email: this.fromEmail,
        name: this.fromName
      },
      subject: subject,
      text: text,
      html: html || text
    };

    try {
      console.log('🚀 Sending email via SendGrid...');
      const response = await sgMail.send(msg);
      console.log('✅ Email sent successfully!');
      console.log('📊 SendGrid Response Status:', response[0].statusCode);
      
      return { 
        success: true, 
        message: 'Email sent successfully',
        statusCode: response[0].statusCode
      };
    } catch (error) {
      console.error('❌ SendGrid error:', error);
      
      let errorMessage = 'Failed to send email';
      if (error.response) {
        console.error('📋 Error details:', error.response.body);
        errorMessage = `SendGrid error: ${error.response.body.errors?.[0]?.message || error.message}`;
      }
      
      return { 
        success: false, 
        error: errorMessage,
        details: error.response?.body || error.message
      };
    }
  }

  async sendWelcomeEmail(user) {
    const subject = `Welcome to Optimizer, ${user.firstName}!`;
    const text = `
Hi ${user.firstName},

Welcome to Optimizer! We're excited to help you optimize your life and achieve your goals.

Here's what you can do next:
1. Complete your profile to get personalized recommendations
2. Set up your goals and preferences  
3. Start exploring activities that match your interests
4. Generate your first optimized schedule

If you have any questions, don't hesitate to reach out to our support team.

Best regards,
The Optimizer Team
    `;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
        🎉 Welcome to Optimizer!
      </h2>
      
      <p>Hi ${user.firstName},</p>
      
      <p>Welcome to <strong>Optimizer</strong>! We're excited to help you optimize your life and achieve your goals.</p>
      
      <h3 style="color: #2c3e50;">Here's what you can do next:</h3>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <ol>
          <li style="margin: 10px 0;"><strong>Complete your profile</strong> to get personalized recommendations</li>
          <li style="margin: 10px 0;"><strong>Set up your goals</strong> and preferences</li>
          <li style="margin: 10px 0;"><strong>Start exploring activities</strong> that match your interests</li>
          <li style="margin: 10px 0;"><strong>Generate your first</strong> optimized schedule</li>
        </ol>
      </div>
      
      <p>If you have any questions, don't hesitate to reach out to our support team.</p>
      
      <p>Best regards,<br><strong>The Optimizer Team</strong></p>
      
      <hr style="margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">
        This email was sent from Optimizer. If you didn't sign up for Optimizer, please ignore this email.
      </p>
    </div>
    `;

    return this.sendSimpleEmail(user.email, subject, text, html);
  }

  async sendEmailVerification(user, verificationToken) {
    const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
    const subject = `Verify Your Email - Optimizer`;
    
    const text = `
Hi ${user.firstName},

Thank you for signing up for Optimizer! To complete your registration, please verify your email address by clicking the link below:

${verificationLink}

This verification link will expire in 24 hours.

If you didn't create an account with Optimizer, please ignore this email.

Best regards,
The Optimizer Team
    `;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
        📧 Verify Your Email - Optimizer
      </h2>
      
      <p>Hi ${user.firstName},</p>
      
      <p>Thank you for signing up for <strong>Optimizer</strong>! To complete your registration, please verify your email address by clicking the button below:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" style="background: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
          Verify Email Address
        </a>
      </div>
      
      <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
      <p style="background: #f8f9fa; padding: 10px; border-radius: 5px; word-break: break-all;">
        ${verificationLink}
      </p>
      
      <p><strong>This verification link will expire in 24 hours.</strong></p>
      
      <p>If you didn't create an account with Optimizer, please ignore this email.</p>
      
      <p>Best regards,<br><strong>The Optimizer Team</strong></p>
      
      <hr style="margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">
        © 2025 Optimizer. All rights reserved.
      </p>
    </div>
    `;

    return this.sendSimpleEmail(user.email, subject, text, html);
  }

  async sendPasswordReset(user, resetToken) {
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    const subject = `Reset Your Password - Optimizer`;
    
    const text = `
Hi ${user.firstName},

We received a request to reset your Optimizer password. Click the link below to create a new password:

${resetLink}

This reset link will expire in 1 hour.

If you didn't request a password reset, please ignore this email. Your password will not be changed.

Best regards,
The Optimizer Team
    `;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2c3e50; border-bottom: 2px solid #e74c3c; padding-bottom: 10px;">
        🔐 Password Reset Request - Optimizer
      </h2>
      
      <p>Hi ${user.firstName},</p>
      
      <p>We received a request to reset your <strong>Optimizer</strong> password. Click the button below to create a new password:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
          Reset Password
        </a>
      </div>
      
      <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
      <p style="background: #f8f9fa; padding: 10px; border-radius: 5px; word-break: break-all;">
        ${resetLink}
      </p>
      
      <p><strong>This reset link will expire in 1 hour.</strong></p>
      
      <p>If you didn't request a password reset, please ignore this email. Your password will not be changed.</p>
      
      <p>Best regards,<br><strong>The Optimizer Team</strong></p>
      
      <hr style="margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">
        © 2025 Optimizer. All rights reserved.
      </p>
    </div>
    `;

    return this.sendSimpleEmail(user.email, subject, text, html);
  }
}

module.exports = RealEmailService;
