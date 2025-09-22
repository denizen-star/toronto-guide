import { RegisterRequest, LoginRequest, UpdateProfileRequest, ChangePasswordRequest } from '../types/auth.types';
import { PasswordUtils } from './passwordUtils';

export class Validators {
  
  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Validate phone number (basic validation)
   */
  static isValidPhone(phone: string): boolean {
    // Basic phone validation - adjust based on requirements
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }
  
  /**
   * Validate date format (YYYY-MM-DD)
   */
  static isValidDate(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;
    
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }
  
  /**
   * Validate login request
   */
  static validateLoginRequest(data: LoginRequest): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    
    if (!data.email) {
      errors.email = 'Email is required';
    } else if (!this.isValidEmail(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!data.password) {
      errors.password = 'Password is required';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
  
  /**
   * Validate registration request
   */
  static validateRegisterRequest(data: RegisterRequest): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    
    // Email validation
    if (!data.email) {
      errors.email = 'Email is required';
    } else if (!this.isValidEmail(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Name validation
    if (!data.firstName || data.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters long';
    }
    
    if (!data.lastName || data.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters long';
    }
    
    // Password validation
    const passwordValidation = PasswordUtils.validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors.join('. ');
    }
    
    // Confirm password
    if (!PasswordUtils.passwordsMatch(data.password, data.confirmPassword)) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // Terms acceptance
    if (!data.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
  
  /**
   * Validate profile update request
   */
  static validateUpdateProfileRequest(data: UpdateProfileRequest): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    
    if (data.firstName && data.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters long';
    }
    
    if (data.lastName && data.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters long';
    }
    
    if (data.phone && !this.isValidPhone(data.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (data.dateOfBirth && !this.isValidDate(data.dateOfBirth)) {
      errors.dateOfBirth = 'Please enter a valid date (YYYY-MM-DD)';
    }
    
    // Validate age (must be at least 13 years old)
    if (data.dateOfBirth && this.isValidDate(data.dateOfBirth)) {
      const birthDate = new Date(data.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        // Birthday hasn't occurred this year
      }
      
      if (age < 13) {
        errors.dateOfBirth = 'You must be at least 13 years old to use this service';
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
  
  /**
   * Validate password change request
   */
  static validateChangePasswordRequest(data: ChangePasswordRequest): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    
    if (!data.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    const passwordValidation = PasswordUtils.validatePassword(data.newPassword);
    if (!passwordValidation.isValid) {
      errors.newPassword = passwordValidation.errors.join('. ');
    }
    
    if (!PasswordUtils.passwordsMatch(data.newPassword, data.confirmPassword)) {
      errors.confirmPassword = 'New passwords do not match';
    }
    
    if (data.currentPassword === data.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
  
  /**
   * Sanitize string input (prevent XSS)
   */
  static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove basic HTML tags
      .substring(0, 255); // Limit length
  }
  
  /**
   * Validate UUID format
   */
  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
