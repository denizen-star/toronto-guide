import { Router } from 'express';
import { Pool } from 'pg';
import { AuthController } from '../controllers/authController';
import { authRateLimit, logActivity } from '../middleware/authMiddleware';

export function createAuthRoutes(database: Pool): Router {
  const router = Router();
  const authController = new AuthController(database);
  
  // Apply rate limiting to authentication endpoints
  const loginRateLimit = authRateLimit(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
  const registerRateLimit = authRateLimit(3, 60 * 60 * 1000); // 3 attempts per hour
  const passwordResetRateLimit = authRateLimit(3, 60 * 60 * 1000); // 3 attempts per hour
  
  /**
   * @route   POST /api/auth/register
   * @desc    Register a new user
   * @access  Public
   */
  router.post('/register', 
    registerRateLimit,
    logActivity('user_registration_attempt'),
    authController.register
  );
  
  /**
   * @route   POST /api/auth/login
   * @desc    Login user
   * @access  Public
   */
  router.post('/login', 
    loginRateLimit,
    logActivity('user_login_attempt'),
    authController.login
  );
  
  /**
   * @route   POST /api/auth/logout
   * @desc    Logout user
   * @access  Private
   */
  router.post('/logout', 
    logActivity('user_logout'),
    authController.logout
  );
  
  /**
   * @route   POST /api/auth/forgot-password
   * @desc    Request password reset
   * @access  Public
   */
  router.post('/forgot-password', 
    passwordResetRateLimit,
    logActivity('password_reset_request'),
    authController.forgotPassword
  );
  
  /**
   * @route   POST /api/auth/reset-password
   * @desc    Reset password with token
   * @access  Public
   */
  router.post('/reset-password', 
    passwordResetRateLimit,
    logActivity('password_reset_attempt'),
    authController.resetPassword
  );
  
  /**
   * @route   GET /api/auth/verify-email/:token
   * @desc    Verify email address
   * @access  Public
   */
  router.get('/verify-email/:token', 
    logActivity('email_verification_attempt'),
    authController.verifyEmail
  );
  
  /**
   * @route   GET /api/auth/me
   * @desc    Get current user
   * @access  Private
   */
  router.get('/me', authController.getCurrentUser);
  
  /**
   * @route   GET /api/auth/check
   * @desc    Check authentication status
   * @access  Public
   */
  router.get('/check', authController.checkAuth);
  
  return router;
}
