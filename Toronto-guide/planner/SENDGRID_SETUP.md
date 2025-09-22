# 📧 SendGrid Setup for Optimizer - Quick Guide

## ✅ **Current Status**
- ✅ SendGrid package installed (`@sendgrid/mail`)
- ✅ API Key configured in `.env`
- ✅ Email service implemented
- ✅ Test script created

## 🚀 **Next Steps to Complete Setup**

### 1. **Complete Sender Verification** (REQUIRED)
You need to verify your sender email address in SendGrid before sending emails:

1. **Go to SendGrid Dashboard**: https://app.sendgrid.com/
2. **Navigate to**: Settings → Sender Authentication
3. **Click**: "Verify a Single Sender"
4. **Fill out the form**:
   ```
   From Name: Optimizer
   From Email: your-email@example.com (use your real email for testing)
   Reply To: your-email@example.com
   Address: [Your address]
   City, State, ZIP: [Your location]
   Country: Canada
   ```
5. **Check your email** and click the verification link

### 2. **Update Environment Variables**
Edit your `.env` file and update:
```bash
SENDGRID_FROM_EMAIL=your-verified-email@example.com
```

### 3. **Test Email Sending**
Update the test script with your email:
1. **Edit**: `test/emailTest.js`
2. **Change line 8**: `email: 'your-email@example.com'` to your actual email
3. **Run the test**:
   ```bash
   cd /Users/kervinleacock/Documents/Development/LifePlanner/Toronto-guide/planner
   node test/emailTest.js
   ```

## 🧪 **Testing Commands**

### Basic Email Test
```bash
node test/emailTest.js
```

### Check SendGrid Configuration
The test script will automatically:
- ✅ Verify API key is configured
- ✅ Check sender email is set
- ✅ Send test emails
- ✅ Report any configuration issues

## 📋 **What Happens Next**

After running the test, you should:
1. **Check your email inbox** for test messages
2. **Verify emails arrive** (check spam folder too)
3. **Check SendGrid Activity Feed** if emails don't arrive
4. **Create email templates** (optional, but recommended)

## 🎯 **Email Templates (Optional)**

For production-ready emails, create templates in SendGrid:

### Email Verification Template
1. **Go to**: Email API → Dynamic Templates
2. **Create Template**: "Email Verification"
3. **Use the HTML** from `docs/sendgrid-tutorial.md`
4. **Copy Template ID** and update `.env`:
   ```bash
   SENDGRID_EMAIL_VERIFICATION_TEMPLATE=d-your_template_id_here
   ```

### Password Reset Template
1. **Create Template**: "Password Reset"
2. **Use the HTML** from `docs/sendgrid-tutorial.md`
3. **Update `.env`**:
   ```bash
   SENDGRID_PASSWORD_RESET_TEMPLATE=d-your_template_id_here
   ```

## 🚨 **Troubleshooting**

### Common Issues:
1. **"Sender not verified"** → Complete sender verification first
2. **"Invalid API key"** → Check API key in `.env` file
3. **Emails not received** → Check SendGrid Activity Feed
4. **Rate limiting** → Free tier: 100 emails/day

### SendGrid Activity Feed
Monitor email delivery: https://app.sendgrid.com/activity

## 📞 **Need Help?**
- **SendGrid Docs**: https://docs.sendgrid.com/
- **Support**: Check SendGrid dashboard for support options
- **Tutorial**: See `docs/sendgrid-tutorial.md` for detailed setup

---

**Next**: Once emails are working, we can test the full authentication flow!
