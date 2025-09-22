import { Pool } from 'pg';
import { User, UserProfile, UserAuditLog } from '../types/auth.types';
import { PasswordUtils } from '../utils/passwordUtils';

export class UserModel {
  private db: Pool;
  
  constructor(database: Pool) {
    this.db = database;
  }
  
  /**
   * Create a new user
   */
  async createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<User> {
    const hashedPassword = await PasswordUtils.hashPassword(userData.password);
    const verificationToken = PasswordUtils.generateSecureToken();
    
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, email_verification_token)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, first_name, last_name, role, is_active, email_verified, 
                profile_completed, created_at, updated_at, last_login
    `;
    
    const values = [
      userData.email.toLowerCase(),
      hashedPassword,
      userData.firstName.trim(),
      userData.lastName.trim(),
      verificationToken
    ];
    
    const result = await this.db.query(query, values);
    const user = result.rows[0];
    
    // Create user profile
    await this.createUserProfile(user.id);
    
    return this.mapDbUserToUser(user);
  }
  
  /**
   * Find user by email
   */
  async findUserByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, email, password_hash, first_name, last_name, role, is_active, 
             email_verified, profile_completed, created_at, updated_at, last_login
      FROM users 
      WHERE email = $1 AND is_active = true
    `;
    
    const result = await this.db.query(query, [email.toLowerCase()]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapDbUserToUser(result.rows[0]);
  }
  
  /**
   * Find user by ID
   */
  async findUserById(userId: string): Promise<User | null> {
    const query = `
      SELECT id, email, first_name, last_name, role, is_active, email_verified, 
             profile_completed, created_at, updated_at, last_login
      FROM users 
      WHERE id = $1 AND is_active = true
    `;
    
    const result = await this.db.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapDbUserToUser(result.rows[0]);
  }
  
  /**
   * Verify password for user
   */
  async verifyUserPassword(email: string, password: string): Promise<User | null> {
    const query = `
      SELECT id, email, password_hash, first_name, last_name, role, is_active, 
             email_verified, profile_completed, created_at, updated_at, last_login
      FROM users 
      WHERE email = $1 AND is_active = true
    `;
    
    const result = await this.db.query(query, [email.toLowerCase()]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const user = result.rows[0];
    const isPasswordValid = await PasswordUtils.comparePassword(password, user.password_hash);
    
    if (!isPasswordValid) {
      return null;
    }
    
    return this.mapDbUserToUser(user);
  }
  
  /**
   * Update user's last login timestamp
   */
  async updateLastLogin(userId: string): Promise<void> {
    const query = `
      UPDATE users 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE id = $1
    `;
    
    await this.db.query(query, [userId]);
  }
  
  /**
   * Update user profile information
   */
  async updateUser(userId: string, updates: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }): Promise<User | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;
    
    if (updates.firstName) {
      fields.push(`first_name = $${paramCount}`);
      values.push(updates.firstName.trim());
      paramCount++;
    }
    
    if (updates.lastName) {
      fields.push(`last_name = $${paramCount}`);
      values.push(updates.lastName.trim());
      paramCount++;
    }
    
    if (updates.email) {
      fields.push(`email = $${paramCount}`);
      values.push(updates.email.toLowerCase());
      paramCount++;
    }
    
    if (fields.length === 0) {
      return this.findUserById(userId);
    }
    
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);
    
    const query = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, first_name, last_name, role, is_active, email_verified, 
                profile_completed, created_at, updated_at, last_login
    `;
    
    const result = await this.db.query(query, values);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapDbUserToUser(result.rows[0]);
  }
  
  /**
   * Change user password
   */
  async changePassword(userId: string, newPassword: string): Promise<boolean> {
    const hashedPassword = await PasswordUtils.hashPassword(newPassword);
    
    const query = `
      UPDATE users 
      SET password_hash = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2
    `;
    
    const result = await this.db.query(query, [hashedPassword, userId]);
    return result.rowCount > 0;
  }
  
  /**
   * Verify email address
   */
  async verifyEmail(token: string): Promise<User | null> {
    const query = `
      UPDATE users 
      SET email_verified = true, email_verification_token = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE email_verification_token = $1
      RETURNING id, email, first_name, last_name, role, is_active, email_verified, 
                profile_completed, created_at, updated_at, last_login
    `;
    
    const result = await this.db.query(query, [token]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapDbUserToUser(result.rows[0]);
  }
  
  /**
   * Create user profile
   */
  private async createUserProfile(userId: string): Promise<void> {
    const query = `
      INSERT INTO user_profiles (user_id, timezone, preferences)
      VALUES ($1, $2, $3)
    `;
    
    await this.db.query(query, [userId, 'America/Toronto', JSON.stringify({})]);
  }
  
  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const query = `
      SELECT id, user_id, phone, date_of_birth, timezone, preferences, created_at, updated_at
      FROM user_profiles 
      WHERE user_id = $1
    `;
    
    const result = await this.db.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const profile = result.rows[0];
    return {
      id: profile.id,
      userId: profile.user_id,
      phone: profile.phone,
      dateOfBirth: profile.date_of_birth,
      timezone: profile.timezone,
      preferences: profile.preferences,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at
    };
  }
  
  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: {
    phone?: string;
    dateOfBirth?: string;
    timezone?: string;
    preferences?: Record<string, any>;
  }): Promise<UserProfile | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;
    
    if (updates.phone !== undefined) {
      fields.push(`phone = $${paramCount}`);
      values.push(updates.phone);
      paramCount++;
    }
    
    if (updates.dateOfBirth !== undefined) {
      fields.push(`date_of_birth = $${paramCount}`);
      values.push(updates.dateOfBirth);
      paramCount++;
    }
    
    if (updates.timezone) {
      fields.push(`timezone = $${paramCount}`);
      values.push(updates.timezone);
      paramCount++;
    }
    
    if (updates.preferences) {
      fields.push(`preferences = $${paramCount}`);
      values.push(JSON.stringify(updates.preferences));
      paramCount++;
    }
    
    if (fields.length === 0) {
      return this.getUserProfile(userId);
    }
    
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);
    
    const query = `
      UPDATE user_profiles 
      SET ${fields.join(', ')}
      WHERE user_id = $${paramCount}
      RETURNING id, user_id, phone, date_of_birth, timezone, preferences, created_at, updated_at
    `;
    
    const result = await this.db.query(query, values);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const profile = result.rows[0];
    return {
      id: profile.id,
      userId: profile.user_id,
      phone: profile.phone,
      dateOfBirth: profile.date_of_birth,
      timezone: profile.timezone,
      preferences: profile.preferences,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at
    };
  }
  
  /**
   * Log user activity for audit trail
   */
  async logUserActivity(userId: string, action: string, details: Record<string, any> = {}, ipAddress?: string, userAgent?: string): Promise<void> {
    const query = `
      INSERT INTO user_audit_logs (user_id, action, details, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5)
    `;
    
    await this.db.query(query, [
      userId,
      action,
      JSON.stringify(details),
      ipAddress,
      userAgent
    ]);
  }
  
  /**
   * Map database user object to User type
   */
  private mapDbUserToUser(dbUser: any): User {
    return {
      id: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.first_name,
      lastName: dbUser.last_name,
      role: dbUser.role,
      isActive: dbUser.is_active,
      emailVerified: dbUser.email_verified,
      profileCompleted: dbUser.profile_completed,
      createdAt: dbUser.created_at,
      updatedAt: dbUser.updated_at,
      lastLogin: dbUser.last_login
    };
  }
}
