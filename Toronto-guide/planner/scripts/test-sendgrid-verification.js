#!/usr/bin/env node

// SendGrid Verification Test Script
require('dotenv').config();

async function testSendGridVerification() {
  console.log('🧪 Testing SendGrid Sender Verification Status\n');
  
  // Check environment variables
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL;
  const fromName = process.env.SENDGRID_FROM_NAME;
  
  console.log('📋 Current Configuration:');
  console.log(`API Key: ${apiKey ? '✅ Configured' : '❌ Missing'}`);
  console.log(`From Email: ${fromEmail || '❌ Not set'}`);
  console.log(`From Name: ${fromName || '❌ Not set'}`);
  console.log('');
  
  if (!apiKey) {
    console.log('❌ SendGrid API key not configured. Check your .env file.');
    return;
  }
  
  if (!fromEmail || fromEmail.includes('yourdomain.com')) {
    console.log('⚠️  From email not configured with verified address.');
    console.log('   Complete sender verification first, then update SENDGRID_FROM_EMAIL in .env');
    return;
  }
  
  // Test email sending capability
  console.log('📧 Testing email sending capability...');
  
  try {
    const { EmailService } = require('../src/modules/login-member-management/services/emailService');
    const emailService = new EmailService();
    
    // Get service status
    const status = emailService.getServiceStatus();
    console.log('📊 Service Status:', status.configured ? '✅ Ready' : '❌ Not Ready');
    
    if (!status.configured) {
      console.log('Issues found:');
      status.issues.forEach(issue => console.log(`  - ${issue}`));
      return;
    }
    
    // Test simple email (to the verified sender email)
    console.log(`📤 Sending test email to ${fromEmail}...`);
    
    const testResult = await emailService.sendSimpleEmail(
      fromEmail, // Send to the verified sender email
      'Optimizer SendGrid Verification Test',
      `Hello! This is a test email from Optimizer to verify that SendGrid sender verification is working correctly.

If you receive this email, your SendGrid configuration is working! 🎉

Configuration Details:
- From Email: ${fromEmail}
- From Name: ${fromName}
- API Key: Configured ✅

Next steps:
1. Check that this email arrived in your inbox
2. Verify it came from "${fromName} <${fromEmail}>"
3. If successful, you can now test the full authentication system

This is an automated test email from the Optimizer development environment.`,
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
          🎉 Optimizer SendGrid Verification Test
        </h2>
        
        <p>Hello!</p>
        
        <p>This is a test email from <strong>Optimizer</strong> to verify that SendGrid sender verification is working correctly.</p>
        
        <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
          <strong>✅ If you receive this email, your SendGrid configuration is working!</strong>
        </div>
        
        <h3 style="color: #2c3e50;">Configuration Details:</h3>
        <ul>
          <li><strong>From Email:</strong> ${fromEmail}</li>
          <li><strong>From Name:</strong> ${fromName}</li>
          <li><strong>API Key:</strong> Configured ✅</li>
        </ul>
        
        <h3 style="color: #2c3e50;">Next Steps:</h3>
        <ol>
          <li>Check that this email arrived in your inbox</li>
          <li>Verify it came from "${fromName} &lt;${fromEmail}&gt;"</li>
          <li>If successful, you can now test the full authentication system</li>
        </ol>
        
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated test email from the Optimizer development environment.
        </p>
      </div>
      `
    );
    
    if (testResult.success) {
      console.log('✅ Test email sent successfully!');
      console.log('');
      console.log('🎯 Verification Complete! Check your email inbox.');
      console.log('');
      console.log('📋 What to check:');
      console.log(`   1. Email should arrive at: ${fromEmail}`);
      console.log(`   2. Sender should show: ${fromName} <${fromEmail}>`);
      console.log('   3. Email should not be in spam folder');
      console.log('');
      console.log('🚀 If email arrived successfully, SendGrid is ready for production use!');
    } else {
      console.log('❌ Test email failed:', testResult.error);
      console.log('');
      console.log('🔍 Possible issues:');
      console.log('   1. Sender email not verified in SendGrid dashboard');
      console.log('   2. API key permissions insufficient');
      console.log('   3. SendGrid account suspended or limited');
      console.log('');
      console.log('💡 Next steps:');
      console.log('   1. Check SendGrid dashboard for sender verification status');
      console.log('   2. Check SendGrid Activity Feed for error details');
      console.log('   3. Verify API key has "Mail Send" permissions');
    }
    
  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
    console.log('');
    console.log('🔧 Check that all dependencies are installed:');
    console.log('   npm install @sendgrid/mail');
  }
}

console.log('📧 SendGrid Sender Verification Test');
console.log('=====================================');
console.log('');
console.log('This script will test if your SendGrid sender verification is complete');
console.log('and working correctly by sending a test email.');
console.log('');

testSendGridVerification().catch(error => {
  console.error('💥 Test script failed:', error);
  process.exit(1);
});
