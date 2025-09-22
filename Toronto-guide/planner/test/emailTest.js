// SendGrid Email Testing Script for Optimizer
require('dotenv').config();

const { EmailService } = require('../src/modules/login-member-management/services/emailService');

// Create a mock user for testing
const testUser = {
  id: 'test-uuid-123',
  email: 'your-email@example.com', // Replace with your actual email for testing
  firstName: 'Kevin',
  lastName: 'Test',
  role: 'user',
  isActive: true,
  emailVerified: false,
  profileCompleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

async function testSendGridConfiguration() {
  console.log('🧪 Testing SendGrid Configuration for Optimizer...\n');
  
  const emailService = new EmailService();
  
  // 1. Check service status
  console.log('📋 Checking SendGrid service status...');
  const status = emailService.getServiceStatus();
  console.log('Status:', status);
  console.log('');
  
  if (!status.configured) {
    console.log('❌ SendGrid not properly configured. Issues found:');
    status.issues.forEach(issue => console.log(`  - ${issue}`));
    console.log('\nPlease update your .env file with proper SendGrid configuration.');
    return;
  }
  
  // 2. Test simple email
  console.log('📧 Testing simple email sending...');
  try {
    const result = await emailService.sendSimpleEmail(
      testUser.email,
      'Optimizer SendGrid Test Email',
      'Hello! This is a test email from the Optimizer application to verify SendGrid integration is working correctly.',
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Optimizer SendGrid Test</h2>
        <p>Hello ${testUser.firstName}!</p>
        <p>This is a test email from the <strong>Optimizer</strong> application to verify SendGrid integration is working correctly.</p>
        <p>If you received this email, your SendGrid configuration is working! 🎉</p>
        <hr>
        <p style="color: #666; font-size: 12px;">This is a development test email.</p>
      </div>
      `
    );
    
    if (result.success) {
      console.log('✅ Simple email sent successfully!');
    } else {
      console.log('❌ Simple email failed:', result.error);
    }
  } catch (error) {
    console.log('❌ Simple email test error:', error.message);
  }
  
  console.log('');
  
  // 3. Test welcome email
  console.log('🎉 Testing welcome email...');
  try {
    const welcomeResult = await emailService.sendWelcomeEmail(testUser);
    
    if (welcomeResult.success) {
      console.log('✅ Welcome email sent successfully!');
    } else {
      console.log('❌ Welcome email failed:', welcomeResult.error);
    }
  } catch (error) {
    console.log('❌ Welcome email test error:', error.message);
  }
  
  console.log('');
  
  // 4. Test configuration test method
  console.log('⚙️ Running SendGrid configuration test...');
  try {
    const configResult = await emailService.testConfiguration();
    
    if (configResult.success) {
      console.log('✅ SendGrid configuration test passed!');
    } else {
      console.log('❌ SendGrid configuration test failed:', configResult.error);
    }
  } catch (error) {
    console.log('❌ Configuration test error:', error.message);
  }
  
  console.log('\n🎯 SendGrid testing complete!');
  console.log('\nNext steps:');
  console.log('1. Check your email inbox for test messages');
  console.log('2. If emails are not received, check SendGrid Activity Feed');
  console.log('3. Verify sender email address in SendGrid dashboard');
  console.log('4. Create email templates for verification and password reset');
}

// Instructions for the user
console.log('📋 SendGrid Test Instructions:');
console.log('1. Make sure you have updated the testUser.email above with your actual email');
console.log('2. Verify your .env file has the correct SendGrid API key');
console.log('3. Make sure you have completed sender verification in SendGrid dashboard');
console.log('4. Run this test: node test/emailTest.js\n');

// Run the test
testSendGridConfiguration().catch(error => {
  console.error('💥 Test failed with error:', error);
  process.exit(1);
});

module.exports = { testSendGridConfiguration };
