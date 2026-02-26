# SendGrid Integration Tutorial for Optimizer

## 📧 **What is SendGrid?**

SendGrid is a cloud-based email delivery service that provides reliable email infrastructure for applications. It handles email authentication, delivery optimization, and provides detailed analytics about your email campaigns.

**Why SendGrid for Optimizer:**
- Reliable email delivery (99%+ delivery rate)
- Easy API integration
- Email templates for consistent branding
- Detailed delivery analytics
- Free tier: 100 emails/day (perfect for development)

---

## 🚀 **Step 1: Create SendGrid Account**

1. **Sign Up**: Go to https://sendgrid.com/ and click "Start for Free"
2. **Account Creation**: 
   - Use your development email
   - Choose "Developer" as your role
   - Select "Transactional Email" as primary use case
3. **Email Verification**: Verify your email address
4. **Account Setup**: Complete the onboarding questionnaire

---

## 🔑 **Step 2: Get Your API Key**

1. **Navigate to API Keys**:
   - Login to SendGrid dashboard
   - Go to Settings → API Keys
   - Click "Create API Key"

2. **Create API Key**:
   - Name: `Optimizer-Development`
   - Permissions: `Restricted Access`
   - Select these permissions:
     - Mail Send: `Full Access`
     - Template Engine: `Full Access`
     - Suppressions: `Read Access`

3. **Save Your API Key**: 
   ```bash
   # Copy this key immediately - you won't see it again!
  your-sendgrid-api-key-here
   ```

---

## ✉️ **Step 3: Verify Sender Identity**

SendGrid requires sender verification to prevent spam.

### **Option A: Single Sender Verification (Recommended for Development)**

1. **Go to Sender Authentication**:
   - Settings → Sender Authentication
   - Click "Verify a Single Sender"

2. **Add Sender Details**:
   ```
   From Name: Optimizer
   From Email: noreply@yourdomain.com (or your personal email for dev)
   Reply To: support@yourdomain.com (or your personal email)
   Address: Your address
   City, State, ZIP: Your location
   Country: Canada
   ```

3. **Verify Email**: Check your email and click the verification link

### **Option B: Domain Authentication (Production)**
- More complex but provides better deliverability
- Requires DNS configuration
- Recommended for production deployment

---

## 🛠️ **Step 4: Install SendGrid in Your Project**

```bash
cd /Users/kervinleacock/Documents/Development/LifePlanner/Toronto-guide/planner
npm install @sendgrid/mail
```

---

## ⚙️ **Step 5: Environment Configuration**

Create/update your `.env` file:

```bash
# .env file
SENDGRID_API_KEY=SG.your_actual_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=LifePlanner
NODE_ENV=development
```

**Security Note**: Never commit your `.env` file to version control!

Add to `.gitignore`:
```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

---

## 📝 **Step 6: Create Email Templates**

### **Template 1: Email Verification**

1. **Go to Email API → Dynamic Templates**
2. **Create Template**: 
   - Name: `Email Verification`
   - Click "Create Template"
3. **Add Version**: Click "Add Version"
4. **Design Template**:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Verify Your Email - Optimizer</title>
    <style>
        .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
        .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .button { background: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Optimizer!</h1>
        </div>
        <div class="content">
            <h2>Hi {{firstName}},</h2>
            <p>Thank you for signing up for Optimizer! To complete your registration, please verify your email address by clicking the button below:</p>
            
            <a href="{{verificationLink}}" class="button">Verify Email Address</a>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p>{{verificationLink}}</p>
            
            <p>This verification link will expire in 24 hours.</p>
            
            <p>If you didn't create an account with Optimizer, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>© 2025 Optimizer. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

5. **Save Template**: Click "Save" and note the Template ID

### **Template 2: Password Reset**

Follow the same process with this content:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Reset Your Password - Optimizer</title>
    <style>
        .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
        .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .button { background: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <h2>Hi {{firstName}},</h2>
            <p>We received a request to reset your Optimizer password. Click the button below to create a new password:</p>
            
            <a href="{{resetLink}}" class="button">Reset Password</a>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p>{{resetLink}}</p>
            
            <p>This reset link will expire in 1 hour.</p>
            
            <p>If you didn't request a password reset, please ignore this email. Your password will not be changed.</p>
        </div>
        <div class="footer">
            <p>© 2025 Optimizer. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

---

## 💻 **Step 7: Implementation Code**

Create the email service:

```javascript
// src/modules/login-member-management/services/emailService.js

const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
  constructor() {
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL;
    this.fromName = process.env.SENDGRID_FROM_NAME;
    
    // Template IDs (get these from your SendGrid dashboard)
    this.templates = {
      emailVerification: 'd-your_verification_template_id',
      passwordReset: 'd-your_password_reset_template_id'
    };
  }

  async sendEmailVerification(user, verificationToken) {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    const msg = {
      to: user.email,
      from: {
        email: this.fromEmail,
        name: this.fromName
      },
      templateId: this.templates.emailVerification,
      dynamicTemplateData: {
        firstName: user.first_name,
        verificationLink: verificationLink
      }
    };

    try {
      await sgMail.send(msg);
      console.log(`Verification email sent to ${user.email}`);
      return { success: true };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendPasswordReset(user, resetToken) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const msg = {
      to: user.email,
      from: {
        email: this.fromEmail,
        name: this.fromName
      },
      templateId: this.templates.passwordReset,
      dynamicTemplateData: {
        firstName: user.first_name,
        resetLink: resetLink
      }
    };

    try {
      await sgMail.send(msg);
      console.log(`Password reset email sent to ${user.email}`);
      return { success: true };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Simple email without template (for testing)
  async sendSimpleEmail(to, subject, text, html = null) {
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
      console.log(`Simple email sent to ${to}`);
      return { success: true };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
```

---

## 🧪 **Step 8: Testing Your Integration**

Create a test file:

```javascript
// test/emailTest.js

const emailService = require('../src/modules/login-member-management/services/emailService');

async function testEmail() {
  // Test simple email
  const result = await emailService.sendSimpleEmail(
    'your-email@example.com',
    'LifePlanner Test Email',
    'This is a test email from LifePlanner!',
    '<h1>This is a test email from LifePlanner!</h1><p>If you receive this, SendGrid is working correctly.</p>'
  );
  
  console.log('Test result:', result);
}

// Run the test
testEmail().catch(console.error);
```

Run the test:
```bash
node test/emailTest.js
```

---

## 📊 **Step 9: Monitor Email Delivery**

1. **SendGrid Dashboard**: 
   - Go to Activity Feed to see email delivery status
   - Check Statistics for delivery rates

2. **Common Issues**:
   - **Authentication Failed**: Check your API key
   - **Sender Not Verified**: Complete sender verification
   - **Template Not Found**: Verify template ID
   - **Rate Limiting**: Free tier has daily limits

---

## 🔧 **Step 10: Production Considerations**

### **Environment Variables**
```bash
# Production .env
SENDGRID_API_KEY=SG.production_key_here
SENDGRID_FROM_EMAIL=noreply@yourproductiondomain.com
SENDGRID_FROM_NAME=LifePlanner
FRONTEND_URL=https://yourproductiondomain.com
```

### **Domain Authentication**
- Set up domain authentication for better deliverability
- Configure DKIM, SPF, and DMARC records
- Use a subdomain like `mail.yourdomain.com`

### **Error Handling**
- Implement retry logic for failed emails
- Log email failures for debugging
- Have fallback notification methods

### **Compliance**
- Include unsubscribe links (required by law)
- Respect user email preferences
- Implement bounce and spam complaint handling

---

## 📈 **Monitoring and Analytics**

SendGrid provides detailed analytics:
- **Delivery Rate**: Percentage of emails delivered
- **Open Rate**: How many recipients opened your emails
- **Click Rate**: Engagement with links in emails
- **Bounce Rate**: Invalid email addresses
- **Spam Reports**: Recipients marking as spam

Access these through: Dashboard → Statistics

---

## 🚨 **Troubleshooting Common Issues**

### **Email Not Sending**
1. Check API key is correct and has Mail Send permissions
2. Verify sender email is authenticated
3. Check SendGrid Activity Feed for error details
4. Ensure you haven't exceeded rate limits

### **Emails Going to Spam**
1. Complete domain authentication
2. Use consistent sender information
3. Avoid spam trigger words in subject/content
4. Monitor sender reputation

### **Template Errors**
1. Verify template ID is correct (starts with 'd-')
2. Check all template variables are provided
3. Test template in SendGrid interface first

---

**Next Steps**: Once you have SendGrid working, we'll integrate it into the Login and Member Management module for email verification and password reset functionality!
