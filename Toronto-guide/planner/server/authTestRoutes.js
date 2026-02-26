// Authentication test routes with real database integration
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const RealEmailService = require('./realEmailService');

const router = express.Router();

// Database configuration
const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'optimizer_db',
  user: 'kervinleacock'
};

const pool = new Pool(dbConfig);
const emailService = new RealEmailService();

// Database status endpoint
router.get('/database-status', async (req, res) => {
  try {
    const client = await pool.connect();
    
    // Check tables exist
    const tableQuery = `
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'user_sessions', 'user_profiles', 'user_audit_logs', 'password_reset_tokens', 'email_verification_tokens')
    `;
    const tableResult = await client.query(tableQuery);
    
    // Check UUID support
    const uuidQuery = "SELECT uuid_generate_v4() as test_uuid";
    const uuidResult = await client.query(uuidQuery);
    
    client.release();
    
    res.json({
      success: true,
      connected: true,
      tableCount: parseInt(tableResult.rows[0].table_count),
      uuidSupport: !!uuidResult.rows[0].test_uuid,
      testUuid: uuidResult.rows[0].test_uuid
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

// View users endpoint
router.get('/users', async (req, res) => {
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

// User registration with database
router.post('/register', async (req, res) => {
  try {
    const { email, firstName, lastName, password, confirmPassword, acceptTerms } = req.body;
    
    // Basic validation
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
      // Check if user already exists
      const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
      if (existingUser.rows.length > 0) {
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
        await emailService.sendEmailVerification(user, verificationToken);
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
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed due to server error',
      error: error.message
    });
  }
});

// User login with database
router.post('/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    const client = await pool.connect();
    
    try {
      // Find user
      const userQuery = `
        SELECT id, email, password_hash, first_name, last_name, role, is_active, email_verified, profile_completed, created_at
        FROM users 
        WHERE email = $1 AND is_active = true
      `;
      
      const userResult = await client.query(userQuery, [email.toLowerCase()]);
      
      if (userResult.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
      
      const user = userResult.rows[0];
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
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
      
      // Store in session (simplified for testing)
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
      } else {
        req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 24 hours
      }
      
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
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed due to server error'
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to logout'
      });
    } else {
      res.clearCookie('optimizer_session');
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    }
  });
});

// Check auth status
router.get('/check', (req, res) => {
  res.json({
    success: true,
    authenticated: !!req.session?.userId,
    user: req.session?.user || null
  });
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    const client = await pool.connect();
    
    try {
      // Find user (but don't reveal if user exists)
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
          await emailService.sendPasswordReset(user, resetToken);
        } catch (emailError) {
          console.error('Failed to send password reset email:', emailError);
        }
      }
      
      client.release();
      
      // Always return success to prevent email enumeration
      res.json({
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent.'
      });
      
    } catch (dbError) {
      client.release();
      throw dbError;
    }
    
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request'
    });
  }
});

module.exports = router;
