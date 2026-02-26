import bcrypt from 'bcrypt';
import { PasswordValidation } from '../types/auth.types';

export class PasswordUtils {
  private static readonly SALT_ROUNDS = 12;
  
  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }
  
  /**
   * Compare a plain password with a hashed password
   */
  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
  
  /**
   * Validate password meets requirements
   * Requirements: 8+ characters, uppercase, lowercase
   */
  static validatePassword(password: string): PasswordValidation {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password is required');
      return { isValid: false, errors };
    }
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    // Optional: Add more requirements
    // if (!/\d/.test(password)) {
    //   errors.push('Password must contain at least one number');
    // }
    
    // if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    //   errors.push('Password must contain at least one special character');
    // }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Generate a secure random token for password reset/email verification
   */
  static generateSecureToken(): string {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }
  
  /**
   * Check if passwords match
   */
  static passwordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }
}
