const sgMail = require('@sendgrid/mail');
import { User } from '../types/auth.types';

export class EmailService {
  private fromEmail: string;
  private fromName: string;
  private templates: {
    emailVerification: string;
    passwordReset: string;
  };

  constructor() {
    // Initialize SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@optimizer.com';
    this.fromName = process.env.SENDGRID_FROM_NAME || 'Optimizer';
    
    // Template IDs (get these from your SendGrid dashboard after creating templates)
    this.templates = {
      emailVerification: process.env.SENDGRID_EMAIL_VERIFICATION_TEMPLATE || 'd-your_verification_template_id',
      passwordReset: process.env.SENDGRID_PASSWORD_RESET_TEMPLATE || 'd-your_password_reset_template_id'
    };
  }

  /**
   * Send email verification email
   */
  async sendEmailVerification(user: User, verificationToken: string): Promise<{ success: boolean; error?: string }> {
    const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
    
    const msg = {
      to: user.email,
      from: {
        email: this.fromEmail,
        name: this.fromName
      },
      templateId: this.templates.emailVerification,
      dynamicTemplateData: {
        firstName: user.firstName,
        verificationLink: verificationLink,
        email: user.email
      }
    };

    try {
      await sgMail.send(msg);
      console.log(`✅ Verification email sent to ${user.email}`);
      return { success: true };
    } catch (error: any) {
      console.error('❌ Email verification sending failed:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send verification email'
      };
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(user: User, resetToken: string): Promise<{ success: boolean; error?: string }> {
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    const msg = {
      to: user.email,
      from: {
        email: this.fromEmail,
        name: this.fromName
      },
      templateId: this.templates.passwordReset,
      dynamicTemplateData: {
        firstName: user.firstName,
        resetLink: resetLink,
        email: user.email
      }
    };

    try {
      await sgMail.send(msg);
      console.log(`✅ Password reset email sent to ${user.email}`);
      return { success: true };
    } catch (error: any) {
      console.error('❌ Password reset email sending failed:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send password reset email'
      };
    }
  }

  /**
   * Send simple email without template (useful for testing and notifications)
   */
  async sendSimpleEmail(
    to: string, 
    subject: string, 
    text: string, 
    html?: string
  ): Promise<{ success: boolean; error?: string }> {
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
      await sgMail.send(msg);
      console.log(`✅ Simple email sent to ${to}: ${subject}`);
      return { success: true };
    } catch (error: any) {
      console.error('❌ Simple email sending failed:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send email'
      };
    }
  }

  /**
   * Send welcome email after successful registration
   */
  async sendWelcomeEmail(user: User): Promise<{ success: boolean; error?: string }> {
    const welcomeSubject = `Welcome to Optimizer, ${user.firstName}!`;
    const welcomeText = `
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

    const welcomeHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Optimizer</title>
    <style>
        .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
        .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        .step { margin: 15px 0; padding: 10px; background: white; border-left: 4px solid #3498db; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Optimizer!</h1>
        </div>
        <div class="content">
            <h2>Hi ${user.firstName},</h2>
            <p>Welcome to Optimizer! We're excited to help you optimize your life and achieve your goals.</p>
            
            <h3>Here's what you can do next:</h3>
            <div class="step">
                <strong>1. Complete your profile</strong> to get personalized recommendations
            </div>
            <div class="step">
                <strong>2. Set up your goals</strong> and preferences
            </div>
            <div class="step">
                <strong>3. Start exploring activities</strong> that match your interests
            </div>
            <div class="step">
                <strong>4. Generate your first</strong> optimized schedule
            </div>
            
            <p>If you have any questions, don't hesitate to reach out to our support team.</p>
            
            <p>Best regards,<br>The Optimizer Team</p>
        </div>
        <div class="footer">
            <p>© 2025 Optimizer. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;

    return this.sendSimpleEmail(user.email, welcomeSubject, welcomeText, welcomeHtml);
  }

  /**
   * Test email configuration
   */
  async testConfiguration(): Promise<{ success: boolean; error?: string }> {
    if (!process.env.SENDGRID_API_KEY) {
      return {
        success: false,
        error: 'SENDGRID_API_KEY environment variable is not set'
      };
    }

    if (!this.fromEmail || this.fromEmail === 'noreply@optimizer.com') {
      return {
        success: false,
        error: 'SENDGRID_FROM_EMAIL environment variable is not set or using default value'
      };
    }

    // Test by sending a simple email to the from address
    return this.sendSimpleEmail(
      this.fromEmail,
      'Optimizer SendGrid Configuration Test',
      'This is a test email to verify SendGrid configuration is working correctly.',
      '<h2>Optimizer SendGrid Test</h2><p>This is a test email to verify SendGrid configuration is working correctly.</p>'
    );
  }

  /**
   * Get email service status
   */
  getServiceStatus(): {
    configured: boolean;
    fromEmail: string;
    fromName: string;
    templatesConfigured: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    if (!process.env.SENDGRID_API_KEY) {
      issues.push('SENDGRID_API_KEY not configured');
    }

    if (!this.fromEmail || this.fromEmail === 'noreply@optimizer.com') {
      issues.push('SENDGRID_FROM_EMAIL not configured');
    }

    if (this.templates.emailVerification.includes('your_verification_template_id')) {
      issues.push('Email verification template ID not configured');
    }

    if (this.templates.passwordReset.includes('your_password_reset_template_id')) {
      issues.push('Password reset template ID not configured');
    }

    return {
      configured: issues.length === 0,
      fromEmail: this.fromEmail,
      fromName: this.fromName,
      templatesConfigured: !this.templates.emailVerification.includes('your_verification_template_id') && 
                          !this.templates.passwordReset.includes('your_password_reset_template_id'),
      issues
    };
  }
}
