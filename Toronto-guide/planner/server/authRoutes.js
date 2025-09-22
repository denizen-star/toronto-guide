const { Router } = require('express');
const bcrypt = require('bcrypt');

function createAuthRoutes(database) {
  const router = Router();
  
  /**
   * @route   POST /api/auth/register
   * @desc    Register a new user
   * @access  Public
   */
  router.post('/register', async (req, res) => {
    try {
      const { email, password, confirmPassword, firstName, lastName, acceptTerms } = req.body;
      
      // Basic validation
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required',
          errors: { general: 'Email, password, first name, and last name are required' }
        });
      }
      
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Passwords do not match',
          errors: { confirmPassword: 'Passwords do not match' }
        });
      }
      
      if (!acceptTerms) {
        return res.status(400).json({
          success: false,
          message: 'Terms must be accepted',
          errors: { acceptTerms: 'You must accept the terms and conditions' }
        });
      }
      
      // Check if user already exists
      const existingUser = await database.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Registration failed',
          errors: { email: 'An account with this email already exists' }
        });
      }
      
      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      
      // Create user
      const result = await database.query(`
        INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, email_verified)
        VALUES ($1, $2, $3, $4, 'user', true, false)
        RETURNING id, email, first_name, last_name, role, is_active, email_verified, created_at
      `, [email, passwordHash, firstName, lastName]);
      
      const user = result.rows[0];
      
      // Log registration activity
      await database.query(`
        INSERT INTO user_audit_logs (user_id, action, details, ip_address, user_agent)
        VALUES ($1, 'user_registered', $2, $3, $4)
      `, [user.id, JSON.stringify({ email: user.email }), req.ip, req.get('User-Agent')]);
      
      res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email to verify your account.',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          isActive: user.is_active,
          emailVerified: user.email_verified,
          createdAt: user.created_at
        }
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed due to a server error'
      });
    }
  });
  
  /**
   * @route   POST /api/auth/login
   * @desc    Login user
   * @access  Public
   */
  router.post('/login', async (req, res) => {
    try {
      const { email, password, rememberMe } = req.body;
      
      // Basic validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
          errors: { general: 'Email and password are required' }
        });
      }
      
      // Find user by email
      const userResult = await database.query(`
        SELECT id, email, password_hash, first_name, last_name, role, is_active, email_verified, profile_completed, created_at, updated_at, last_login
        FROM users WHERE email = $1
      `, [email]);
      
      if (userResult.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
          errors: { email: 'Invalid email or password' }
        });
      }
      
      const user = userResult.rows[0];
      
      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
          errors: { email: 'Invalid email or password' }
        });
      }
      
      // Check if account is active
      if (!user.is_active) {
        return res.status(401).json({
          success: false,
          message: 'Your account has been deactivated. Please contact support.',
          errors: { email: 'Account deactivated' }
        });
      }
      
      // Update last login timestamp
      await database.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);
      
      // Log login activity
      await database.query(`
        INSERT INTO user_audit_logs (user_id, action, details, ip_address, user_agent)
        VALUES ($1, 'user_login', $2, $3, $4)
      `, [user.id, JSON.stringify({ email: user.email }), req.ip, req.get('User-Agent')]);
      
      // Store user in session
      req.session.userId = user.id;
      req.session.user = {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isActive: user.is_active,
        emailVerified: user.email_verified,
        profileCompleted: user.profile_completed,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        lastLogin: user.last_login
      };
      
      // Set session expiration based on rememberMe
      if (rememberMe) {
        // Remember me: 30 days
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
      } else {
        // Regular session: 24 hours
        req.session.cookie.maxAge = 24 * 60 * 60 * 1000;
      }
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          isActive: user.is_active,
          emailVerified: user.email_verified,
          profileCompleted: user.profile_completed,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          lastLogin: user.last_login
        }
      });
      
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed due to a server error'
      });
    }
  });
  
  /**
   * @route   POST /api/auth/logout
   * @desc    Logout user
   * @access  Private
   */
  router.post('/logout', async (req, res) => {
    try {
      const userId = req.session?.userId;
      
      if (userId) {
        // Log logout activity
        await database.query(`
          INSERT INTO user_audit_logs (user_id, action, details, ip_address, user_agent)
          VALUES ($1, 'user_logout', $2, $3, $4)
        `, [userId, JSON.stringify({}), req.ip, req.get('User-Agent')]);
      }
      
      // Destroy session
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
          return res.status(500).json({
            success: false,
            message: 'Failed to logout properly'
          });
        } else {
          // Clear session cookie
          res.clearCookie('optimizer_session');
          res.status(200).json({
            success: true,
            message: 'Logged out successfully'
          });
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during logout'
      });
    }
  });
  
  /**
   * @route   GET /api/auth/check
   * @desc    Check authentication status
   * @access  Public
   */
  router.get('/check', (req, res) => {
    try {
      const isAuthenticated = !!(req.session?.userId);
      
      res.status(200).json({
        success: true,
        authenticated: isAuthenticated,
        user: isAuthenticated ? req.session.user : null
      });
    } catch (error) {
      console.error('Check auth error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error checking authentication'
      });
    }
  });
  
  /**
   * @route   GET /api/auth/me
   * @desc    Get current user
   * @access  Private
   */
  router.get('/me', (req, res) => {
    try {
      const user = req.session?.user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'User session retrieved',
        user: user
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error retrieving user session'
      });
    }
  });
  
  return router;
}

module.exports = { createAuthRoutes };