import { Pool } from 'pg';
import { UserModel } from '../models/User';
import { 
  User, 
  RegisterRequest, 
  LoginRequest, 
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest 
} from '../types/auth.types';
import { Validators } from '../utils/validators';
import { PasswordUtils } from '../utils/passwordUtils';
import { EmailService } from './emailService';

export class AuthService {
  private userModel: UserModel;
  private emailService: EmailService;
  
  constructor(database: Pool) {
    this.userModel = new UserModel(database);
    this.emailService = new EmailService();
  }
  
  /**
   * Register a new user
   */
  async register(registerData: RegisterRequest, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    try {
      // Validate input
      const validation = Validators.validateRegisterRequest(registerData);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        };
      }
      
      // Check if user already exists
      const existingUser = await this.userModel.findUserByEmail(registerData.email);
      if (existingUser) {
        return {
          success: false,
          message: 'Registration failed',
          errors: { email: 'An account with this email already exists' }
        };
      }
      
      // Create user
      const user = await this.userModel.createUser({
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName
      });
      
      // Log registration activity
      await this.userModel.logUserActivity(
        user.id,
        'user_registered',
        { email: user.email },
        ipAddress,
        userAgent
      );
      
      // Send verification email
      try {
        await this.sendVerificationEmail(user);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Don't fail registration if email sending fails
      }
      
      return {
        success: true,
        message: 'Registration successful. Please check your email to verify your account.',
        user: this.sanitizeUserForResponse(user)
      };
      
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed due to a server error'
      };
    }
  }
  
  /**
   * Login user
   */
  async login(loginData: LoginRequest, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    try {
      // Validate input
      const validation = Validators.validateLoginRequest(loginData);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Invalid login credentials',
          errors: validation.errors
        };
      }
      
      // Verify user credentials
      const user = await this.userModel.verifyUserPassword(loginData.email, loginData.password);
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password',
          errors: { email: 'Invalid email or password' }
        };
      }
      
      // Check if account is active
      if (!user.isActive) {
        return {
          success: false,
          message: 'Your account has been deactivated. Please contact support.',
          errors: { email: 'Account deactivated' }
        };
      }
      
      // Update last login timestamp
      await this.userModel.updateLastLogin(user.id);
      
      // Log login activity
      await this.userModel.logUserActivity(
        user.id,
        'user_login',
        { email: user.email },
        ipAddress,
        userAgent
      );
      
      return {
        success: true,
        message: 'Login successful',
        user: this.sanitizeUserForResponse(user)
      };
      
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed due to a server error'
      };
    }
  }
  
  /**
   * Send password reset email
   */
  async forgotPassword(forgotPasswordData: ForgotPasswordRequest): Promise<AuthResponse> {
    try {
      if (!forgotPasswordData.email || !Validators.isValidEmail(forgotPasswordData.email)) {
        return {
          success: false,
          message: 'Please provide a valid email address',
          errors: { email: 'Valid email address required' }
        };
      }
      
      const user = await this.userModel.findUserByEmail(forgotPasswordData.email);
      
      // Always return success to prevent email enumeration
      // But only send email if user exists
      if (user) {
        try {
          await this.sendPasswordResetEmail(user);
        } catch (emailError) {
          console.error('Failed to send password reset email:', emailError);
        }
      }
      
      return {
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent.'
      };
      
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message: 'Failed to process password reset request'
      };
    }
  }
  
  /**
   * Reset password with token
   */
  async resetPassword(resetData: ResetPasswordRequest, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    try {
      // Validate password
      const passwordValidation = PasswordUtils.validatePassword(resetData.password);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          message: 'Password validation failed',
          errors: { password: passwordValidation.errors.join('. ') }
        };
      }
      
      if (!PasswordUtils.passwordsMatch(resetData.password, resetData.confirmPassword)) {
        return {
          success: false,
          message: 'Passwords do not match',
          errors: { confirmPassword: 'Passwords do not match' }
        };
      }
      
      // Verify and use reset token
      const userId = await this.verifyPasswordResetToken(resetData.token);
      if (!userId) {
        return {
          success: false,
          message: 'Invalid or expired reset token',
          errors: { token: 'Invalid or expired reset token' }
        };
      }
      
      // Update password
      const success = await this.userModel.changePassword(userId, resetData.password);
      if (!success) {
        return {
          success: false,
          message: 'Failed to update password'
        };
      }
      
      // Mark token as used
      await this.markPasswordResetTokenAsUsed(resetData.token);
      
      // Log password reset activity
      await this.userModel.logUserActivity(
        userId,
        'password_reset',
        {},
        ipAddress,
        userAgent
      );
      
      return {
        success: true,
        message: 'Password has been successfully reset. You can now log in with your new password.'
      };
      
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: 'Failed to reset password due to a server error'
      };
    }
  }
  
  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const user = await this.userModel.verifyEmail(token);
      if (!user) {
        return {
          success: false,
          message: 'Invalid or expired verification token',
          errors: { token: 'Invalid or expired verification token' }
        };
      }
      
      // Log email verification activity
      await this.userModel.logUserActivity(
        user.id,
        'email_verified',
        { email: user.email }
      );
      
      return {
        success: true,
        message: 'Email has been successfully verified!',
        user: this.sanitizeUserForResponse(user)
      };
      
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        message: 'Failed to verify email due to a server error'
      };
    }
  }
  
  /**
   * Send verification email to user
   */
  private async sendVerificationEmail(user: User): Promise<void> {
    // Get verification token from database
    const token = await this.getEmailVerificationToken(user.id);
    if (token) {
      await this.emailService.sendEmailVerification(user, token);
    }
  }
  
  /**
   * Send password reset email to user
   */
  private async sendPasswordResetEmail(user: User): Promise<void> {
    const token = await this.createPasswordResetToken(user.id);
    await this.emailService.sendPasswordReset(user, token);
  }
  
  /**
   * Get email verification token for user
   */
  private async getEmailVerificationToken(userId: string): Promise<string | null> {
    // This would typically query the users table for the email_verification_token
    // For now, we'll implement a simple version
    const query = 'SELECT email_verification_token FROM users WHERE id = $1';
    const result = await this.userModel['db'].query(query, [userId]);
    return result.rows[0]?.email_verification_token || null;
  }
  
  /**
   * Create password reset token
   */
  private async createPasswordResetToken(userId: string): Promise<string> {
    const token = PasswordUtils.generateSecureToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    
    const query = `
      INSERT INTO password_reset_tokens (user_id, token, expires_at)
      VALUES ($1, $2, $3)
      RETURNING token
    `;
    
    const result = await this.userModel['db'].query(query, [userId, token, expiresAt]);
    return result.rows[0].token;
  }
  
  /**
   * Verify password reset token
   */
  private async verifyPasswordResetToken(token: string): Promise<string | null> {
    const query = `
      SELECT user_id FROM password_reset_tokens 
      WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP AND used = false
    `;
    
    const result = await this.userModel['db'].query(query, [token]);
    return result.rows[0]?.user_id || null;
  }
  
  /**
   * Mark password reset token as used
   */
  private async markPasswordResetTokenAsUsed(token: string): Promise<void> {
    const query = `
      UPDATE password_reset_tokens 
      SET used = true 
      WHERE token = $1
    `;
    
    await this.userModel['db'].query(query, [token]);
  }
  
  /**
   * Remove sensitive information from user object before sending to client
   */
  private sanitizeUserForResponse(user: User): User {
    // Create a copy without sensitive fields
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      profileCompleted: user.profileCompleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin
    };
  }
}
