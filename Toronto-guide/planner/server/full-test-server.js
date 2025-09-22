const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const RealEmailService = require('./realEmailService');

const app = express();
const PORT = 3001;

// Database configuration
const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'optimizer_db',
  user: 'kervinleacock'
};

const pool = new Pool(dbConfig);
const emailService = new RealEmailService();

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('✅ Connected to PostgreSQL database');
    release();
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());

// Session configuration
app.use(session({
  secret: 'optimizer-test-session-secret-development',
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

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'Optimizer full test server is running',
    database: 'connected'
  });
});

// Database status
app.get('/api/test/database-status', async (req, res) => {
  try {
    const client = await pool.connect();
    
    const tableQuery = `
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'user_sessions', 'user_profiles', 'user_audit_logs', 'password_reset_tokens', 'email_verification_tokens')
    `;
    const tableResult = await client.query(tableQuery);
    
    const uuidQuery = "SELECT uuid_generate_v4() as test_uuid";
    const uuidResult = await client.query(uuidQuery);
    
    client.release();
    
    res.json({
      success: true,
      connected: true,
      tableCount: parseInt(tableResult.rows[0].table_count),
      uuidSupport: !!uuidResult.rows[0].test_uuid
    });
  } catch (error) {
    console.error('Database status error:', error);
    res.json({
      success: false,
      connected: false,
      error: error.message
    });
  }
});

// View users
app.get('/api/test/users', async (req, res) => {
  try {
    const client = await pool.connect();
    const query = 'SELECT id, email, first_name, last_name, role, is_active, email_verified, created_at FROM users ORDER BY created_at DESC';
    const result = await client.query(query);
    client.release();
    
    res.json({
      success: true,
      users: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Users query error:', error);
    res.json({
      success: false,
      message: error.message
    });
  }
});

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, firstName, lastName, password, confirmPassword } = req.body;
    
    console.log(`📝 Registration attempt for: ${email}`);
    
    // Validation
    if (!email || !firstName || !lastName || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
        errors: { general: 'Please fill in all fields' }
      });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
        errors: { confirmPassword: 'Passwords do not match' }
      });
    }
    
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet requirements',
        errors: { password: 'Password must be 8+ characters with uppercase and lowercase letters' }
      });
    }
    
    const client = await pool.connect();
    
    try {
      // Check if user exists
      const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
      if (existingUser.rows.length > 0) {
        client.release();
        return res.status(400).json({
          success: false,
          message: 'Account already exists',
          errors: { email: 'An account with this email already exists' }
        });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      const verificationToken = require('crypto').randomBytes(32).toString('hex');
      
      // Create user
      const userQuery = `
        INSERT INTO users (email, password_hash, first_name, last_name, email_verification_token)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, email, first_name, last_name, role, is_active, email_verified, profile_completed, created_at
      `;
      
      const userResult = await client.query(userQuery, [
        email.toLowerCase(),
        hashedPassword,
        firstName.trim(),
        lastName.trim(),
        verificationToken
      ]);
      
      const user = userResult.rows[0];
      console.log(`✅ User created with ID: ${user.id}`);
      
      // Create user profile
      await client.query(
        'INSERT INTO user_profiles (user_id, timezone, preferences) VALUES ($1, $2, $3)',
        [user.id, 'America/Toronto', JSON.stringify({})]
      );
      
      // Log registration
      await client.query(
        'INSERT INTO user_audit_logs (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)',
        [user.id, 'user_registered', JSON.stringify({ email: user.email }), req.ip]
      );
      
      client.release();
      
      // Send verification email
      try {
        const emailResult = await emailService.sendEmailVerification({
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name
        }, verificationToken);
        
        console.log(`📧 Verification email result:`, emailResult.success ? 'Sent' : 'Failed');
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
      }
      
      res.status(201).json({
        success: true,
        message: 'Account created successfully! Check your email to verify your account.',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          emailVerified: user.email_verified,
          createdAt: user.created_at
        }
      });
      
    } catch (dbError) {
      client.release();
      throw dbError;
    }
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed due to server error',
      error: error.message
    });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    
    console.log(`🔑 Login attempt for: ${email}`);
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    const client = await pool.connect();
    
    try {
      const userQuery = `
        SELECT id, email, password_hash, first_name, last_name, role, is_active, email_verified, profile_completed
        FROM users 
        WHERE email = $1 AND is_active = true
      `;
      
      const userResult = await client.query(userQuery, [email.toLowerCase()]);
      
      if (userResult.rows.length === 0) {
        client.release();
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
      
      const user = userResult.rows[0];
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        client.release();
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
      
      // Update last login
      await client.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);
      
      // Log login
      await client.query(
        'INSERT INTO user_audit_logs (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)',
        [user.id, 'user_login', JSON.stringify({ email: user.email }), req.ip]
      );
      
      client.release();
      
      // Store in session
      req.session.userId = user.id;
      req.session.user = {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        emailVerified: user.email_verified
      };
      
      // Set session expiration
      if (rememberMe) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
      }
      
      console.log(`✅ Login successful for: ${user.email}`);
      
      res.json({
        success: true,
        message: 'Login successful',
        user: req.session.user
      });
      
    } catch (dbError) {
      client.release();
      throw dbError;
    }
    
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed due to server error'
    });
  }
});

// Check auth status
app.get('/api/auth/check', (req, res) => {
  res.json({
    success: true,
    authenticated: !!req.session?.userId,
    user: req.session?.user || null
  });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to logout'
      });
    } else {
      res.clearCookie('optimizer_test_session');
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    }
  });
});

// Forgot password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log(`🔄 Password reset request for: ${email}`);
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    const client = await pool.connect();
    
    try {
      const userResult = await client.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
      
      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        const resetToken = require('crypto').randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        
        // Store reset token
        await client.query(
          'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
          [user.id, resetToken, expiresAt]
        );
        
        // Send reset email
        try {
          await emailService.sendPasswordReset({
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name
          }, resetToken);
          console.log(`📧 Password reset email sent to: ${email}`);
        } catch (emailError) {
          console.error('Failed to send password reset email:', emailError);
        }
      }
      
      client.release();
      
      res.json({
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent.'
      });
      
    } catch (dbError) {
      client.release();
      throw dbError;
    }
    
  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Optimizer full test server running on http://localhost:${PORT}`);
  console.log(`📧 SendGrid: ${process.env.SENDGRID_API_KEY ? 'Configured' : 'Missing'}`);
  console.log(`🗄️ Database: optimizer_db`);
  console.log(`🧪 Auth Test: http://localhost:${PORT}/test-auth.html`);
  console.log(`📧 Email Test: http://localhost:${PORT}/test-sendgrid.html`);
});

process.on('SIGTERM', () => {
  console.log('Server shutting down...');
  pool.end(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Server shutting down...');
  pool.end(() => {
    process.exit(0);
  });
});
