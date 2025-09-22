import { Request, Response } from 'express';
import { Pool } from 'pg';
import { AuthService } from '../services/authService';
import { 
  RegisterRequest, 
  LoginRequest, 
  ForgotPasswordRequest, 
  ResetPasswordRequest 
} from '../types/auth.types';

export class AuthController {
  private authService: AuthService;
  
  constructor(database: Pool) {
    this.authService = new AuthService(database);
  }
  
  /**
   * Register a new user
   * POST /api/auth/register
   */
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const registerData: RegisterRequest = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        acceptTerms: req.body.acceptTerms
      };
      
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('User-Agent');
      
      const result = await this.authService.register(registerData, ipAddress, userAgent);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Registration controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during registration'
      });
    }
  };
  
  /**
   * Login user
   * POST /api/auth/login
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginData: LoginRequest = {
        email: req.body.email,
        password: req.body.password,
        rememberMe: req.body.rememberMe || false
      };
      
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('User-Agent');
      
      const result = await this.authService.login(loginData, ipAddress, userAgent);
      
      if (result.success && result.user) {
        // Store user in session
        (req.session as any).userId = result.user.id;
        (req.session as any).user = result.user;
        
        // Set session expiration based on rememberMe
        if (loginData.rememberMe) {
          // Remember me: 30 days
          req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        } else {
          // Regular session: 24 hours
          req.session.cookie.maxAge = 24 * 60 * 60 * 1000;
        }
        
        res.status(200).json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      console.error('Login controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during login'
      });
    }
  };
  
  /**
   * Logout user
   * POST /api/auth/logout
   */
  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req.session as any)?.userId;
      
      // Destroy session
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
          res.status(500).json({
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
      console.error('Logout controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during logout'
      });
    }
  };
  
  /**
   * Request password reset
   * POST /api/auth/forgot-password
   */
  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const forgotPasswordData: ForgotPasswordRequest = {
        email: req.body.email
      };
      
      const result = await this.authService.forgotPassword(forgotPasswordData);
      
      // Always return 200 to prevent email enumeration
      res.status(200).json(result);
    } catch (error) {
      console.error('Forgot password controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during password reset request'
      });
    }
  };
  
  /**
   * Reset password with token
   * POST /api/auth/reset-password
   */
  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const resetData: ResetPasswordRequest = {
        token: req.body.token,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
      };
      
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('User-Agent');
      
      const result = await this.authService.resetPassword(resetData, ipAddress, userAgent);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Reset password controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during password reset'
      });
    }
  };
  
  /**
   * Verify email address
   * GET /api/auth/verify-email/:token
   */
  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.params.token;
      
      if (!token) {
        res.status(400).json({
          success: false,
          message: 'Verification token is required',
          errors: { token: 'Token is required' }
        });
        return;
      }
      
      const result = await this.authService.verifyEmail(token);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Email verification controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during email verification'
      });
    }
  };
  
  /**
   * Get current user session
   * GET /api/auth/me
   */
  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req.session as any)?.user;
      
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'User session retrieved',
        user: user
      });
    } catch (error) {
      console.error('Get current user controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error retrieving user session'
      });
    }
  };
  
  /**
   * Check if user is authenticated
   * GET /api/auth/check
   */
  checkAuth = async (req: Request, res: Response): Promise<void> => {
    try {
      const isAuthenticated = !!(req.session as any)?.userId;
      
      res.status(200).json({
        success: true,
        authenticated: isAuthenticated,
        user: isAuthenticated ? (req.session as any).user : null
      });
    } catch (error) {
      console.error('Check auth controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error checking authentication'
      });
    }
  };
}
