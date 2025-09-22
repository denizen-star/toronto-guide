import { Pool } from 'pg';
import { UserModel } from '../models/User';
import { 
  AdminUserView, 
  AdminUserListRequest, 
  AdminUserListResponse,
  AdminAnalytics,
  UserAuditLog
} from '../types/auth.types';

export class AdminService {
  private userModel: UserModel;
  
  constructor(database: Pool) {
    this.userModel = new UserModel(database);
  }
  
  /**
   * Get paginated list of users for admin dashboard
   */
  async getUsersList(request: AdminUserListRequest): Promise<AdminUserListResponse> {
    try {
      const page = request.page || 1;
      const limit = request.limit || 20;
      const offset = (page - 1) * limit;
      
      // Build WHERE clause based on filters
      const whereConditions: string[] = [];
      const queryParams: any[] = [];
      let paramIndex = 1;
      
      if (request.search) {
        whereConditions.push(`(u.email ILIKE $${paramIndex} OR u.first_name ILIKE $${paramIndex} OR u.last_name ILIKE $${paramIndex})`);
        queryParams.push(`%${request.search}%`);
        paramIndex++;
      }
      
      if (request.role) {
        whereConditions.push(`u.role = $${paramIndex}`);
        queryParams.push(request.role);
        paramIndex++;
      }
      
      if (request.isActive !== undefined) {
        whereConditions.push(`u.is_active = $${paramIndex}`);
        queryParams.push(request.isActive);
        paramIndex++;
      }
      
      if (request.emailVerified !== undefined) {
        whereConditions.push(`u.email_verified = $${paramIndex}`);
        queryParams.push(request.emailVerified);
        paramIndex++;
      }
      
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
      
      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM users u
        ${whereClause}
      `;
      const countResult = await this.userModel['db'].query(countQuery, queryParams);
      const total = parseInt(countResult.rows[0].total);
      
      // Get users with pagination
      const usersQuery = `
        SELECT 
          u.id,
          u.email,
          u.first_name,
          u.last_name,
          u.role,
          u.is_active,
          u.email_verified,
          u.profile_completed,
          u.last_login,
          u.created_at,
          COUNT(ual.id) as activity_count
        FROM users u
        LEFT JOIN user_audit_logs ual ON u.id = ual.user_id
        ${whereClause}
        GROUP BY u.id, u.email, u.first_name, u.last_name, u.role, u.is_active, 
                 u.email_verified, u.profile_completed, u.last_login, u.created_at
        ORDER BY u.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      queryParams.push(limit, offset);
      const usersResult = await this.userModel['db'].query(usersQuery, queryParams);
      
      const users: AdminUserView[] = usersResult.rows.map(row => ({
        id: row.id,
        email: row.email,
        fullName: `${row.first_name} ${row.last_name}`,
        role: row.role,
        isActive: row.is_active,
        emailVerified: row.email_verified,
        profileCompleted: row.profile_completed,
        lastLogin: row.last_login,
        createdAt: row.created_at,
        activityCount: parseInt(row.activity_count)
      }));
      
      return {
        success: true,
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
      
    } catch (error) {
      console.error('Admin getUsersList error:', error);
      throw new Error('Failed to retrieve users list');
    }
  }
  
  /**
   * Get detailed user information for admin view
   */
  async getUserDetails(userId: string): Promise<AdminUserView | null> {
    try {
      const query = `
        SELECT 
          u.id,
          u.email,
          u.first_name,
          u.last_name,
          u.role,
          u.is_active,
          u.email_verified,
          u.profile_completed,
          u.last_login,
          u.created_at,
          u.updated_at,
          up.phone,
          up.date_of_birth,
          up.timezone,
          up.preferences,
          COUNT(ual.id) as activity_count
        FROM users u
        LEFT JOIN user_profiles up ON u.id = up.user_id
        LEFT JOIN user_audit_logs ual ON u.id = ual.user_id
        WHERE u.id = $1
        GROUP BY u.id, u.email, u.first_name, u.last_name, u.role, u.is_active, 
                 u.email_verified, u.profile_completed, u.last_login, u.created_at, 
                 u.updated_at, up.phone, up.date_of_birth, up.timezone, up.preferences
      `;
      
      const result = await this.userModel['db'].query(query, [userId]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return {
        id: row.id,
        email: row.email,
        fullName: `${row.first_name} ${row.last_name}`,
        role: row.role,
        isActive: row.is_active,
        emailVerified: row.email_verified,
        profileCompleted: row.profile_completed,
        lastLogin: row.last_login,
        createdAt: row.created_at,
        activityCount: parseInt(row.activity_count)
      };
      
    } catch (error) {
      console.error('Admin getUserDetails error:', error);
      throw new Error('Failed to retrieve user details');
    }
  }
  
  /**
   * Update user role
   */
  async updateUserRole(userId: string, newRole: 'user' | 'admin'): Promise<boolean> {
    try {
      const query = `
        UPDATE users 
        SET role = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `;
      
      const result = await this.userModel['db'].query(query, [newRole, userId]);
      return result.rowCount > 0;
      
    } catch (error) {
      console.error('Admin updateUserRole error:', error);
      throw new Error('Failed to update user role');
    }
  }
  
  /**
   * Update user status (activate/deactivate)
   */
  async updateUserStatus(userId: string, isActive: boolean): Promise<boolean> {
    try {
      const query = `
        UPDATE users 
        SET is_active = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `;
      
      const result = await this.userModel['db'].query(query, [isActive, userId]);
      return result.rowCount > 0;
      
    } catch (error) {
      console.error('Admin updateUserStatus error:', error);
      throw new Error('Failed to update user status');
    }
  }
  
  /**
   * Get basic analytics for admin dashboard
   */
  async getBasicAnalytics(): Promise<AdminAnalytics> {
    try {
      // Get total users
      const totalUsersQuery = 'SELECT COUNT(*) as count FROM users';
      const totalUsersResult = await this.userModel['db'].query(totalUsersQuery);
      const totalUsers = parseInt(totalUsersResult.rows[0].count);
      
      // Get active users
      const activeUsersQuery = 'SELECT COUNT(*) as count FROM users WHERE is_active = true';
      const activeUsersResult = await this.userModel['db'].query(activeUsersQuery);
      const activeUsers = parseInt(activeUsersResult.rows[0].count);
      
      // Get new users this month
      const newUsersQuery = `
        SELECT COUNT(*) as count 
        FROM users 
        WHERE created_at >= date_trunc('month', CURRENT_DATE)
      `;
      const newUsersResult = await this.userModel['db'].query(newUsersQuery);
      const newUsersThisMonth = parseInt(newUsersResult.rows[0].count);
      
      // Get email verification rate
      const emailVerifiedQuery = 'SELECT COUNT(*) as count FROM users WHERE email_verified = true';
      const emailVerifiedResult = await this.userModel['db'].query(emailVerifiedQuery);
      const emailVerifiedCount = parseInt(emailVerifiedResult.rows[0].count);
      const emailVerificationRate = totalUsers > 0 ? (emailVerifiedCount / totalUsers) * 100 : 0;
      
      // Get profile completion rate
      const profileCompletedQuery = 'SELECT COUNT(*) as count FROM users WHERE profile_completed = true';
      const profileCompletedResult = await this.userModel['db'].query(profileCompletedQuery);
      const profileCompletedCount = parseInt(profileCompletedResult.rows[0].count);
      const profileCompletionRate = totalUsers > 0 ? (profileCompletedCount / totalUsers) * 100 : 0;
      
      // Get users by role
      const usersByRoleQuery = `
        SELECT role, COUNT(*) as count 
        FROM users 
        GROUP BY role
      `;
      const usersByRoleResult = await this.userModel['db'].query(usersByRoleQuery);
      const usersByRole = {
        user: 0,
        admin: 0
      };
      usersByRoleResult.rows.forEach(row => {
        usersByRole[row.role as keyof typeof usersByRole] = parseInt(row.count);
      });
      
      // Get recent activity (last 10 audit logs)
      const recentActivityQuery = `
        SELECT 
          ual.id,
          ual.user_id,
          ual.action,
          ual.details,
          ual.ip_address,
          ual.user_agent,
          ual.created_at,
          u.email,
          u.first_name,
          u.last_name
        FROM user_audit_logs ual
        JOIN users u ON ual.user_id = u.id
        ORDER BY ual.created_at DESC
        LIMIT 10
      `;
      const recentActivityResult = await this.userModel['db'].query(recentActivityQuery);
      const recentActivity: UserAuditLog[] = recentActivityResult.rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        action: row.action,
        details: row.details,
        ipAddress: row.ip_address,
        userAgent: row.user_agent,
        createdAt: row.created_at
      }));
      
      return {
        totalUsers,
        activeUsers,
        newUsersThisMonth,
        emailVerificationRate: Math.round(emailVerificationRate * 100) / 100,
        profileCompletionRate: Math.round(profileCompletionRate * 100) / 100,
        usersByRole,
        recentActivity
      };
      
    } catch (error) {
      console.error('Admin getBasicAnalytics error:', error);
      throw new Error('Failed to retrieve analytics');
    }
  }
  
  /**
   * Get detailed analytics (Phase 2)
   */
  async getDetailedAnalytics(): Promise<any> {
    try {
      // Get user registration trends (last 30 days)
      const registrationTrendsQuery = `
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM users
        WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date
      `;
      const registrationTrendsResult = await this.userModel['db'].query(registrationTrendsQuery);
      
      // Get login activity trends (last 7 days)
      const loginTrendsQuery = `
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM user_audit_logs
        WHERE action = 'user_login' 
          AND created_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        ORDER BY date
      `;
      const loginTrendsResult = await this.userModel['db'].query(loginTrendsQuery);
      
      // Get users by verification status
      const verificationStatusQuery = `
        SELECT 
          email_verified,
          COUNT(*) as count
        FROM users
        GROUP BY email_verified
      `;
      const verificationStatusResult = await this.userModel['db'].query(verificationStatusQuery);
      
      // Get users by profile completion status
      const profileStatusQuery = `
        SELECT 
          profile_completed,
          COUNT(*) as count
        FROM users
        GROUP BY profile_completed
      `;
      const profileStatusResult = await this.userModel['db'].query(profileStatusQuery);
      
      return {
        registrationTrends: registrationTrendsResult.rows,
        loginTrends: loginTrendsResult.rows,
        verificationStatus: verificationStatusResult.rows,
        profileStatus: profileStatusResult.rows
      };
      
    } catch (error) {
      console.error('Admin getDetailedAnalytics error:', error);
      throw new Error('Failed to retrieve detailed analytics');
    }
  }
  
  /**
   * Get audit logs with filtering (Phase 2)
   */
  async getAuditLogs(filters: {
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ logs: UserAuditLog[]; total: number }> {
    try {
      const limit = filters.limit || 50;
      const offset = filters.offset || 0;
      
      // Build WHERE clause
      const whereConditions: string[] = [];
      const queryParams: any[] = [];
      let paramIndex = 1;
      
      if (filters.userId) {
        whereConditions.push(`ual.user_id = $${paramIndex}`);
        queryParams.push(filters.userId);
        paramIndex++;
      }
      
      if (filters.action) {
        whereConditions.push(`ual.action = $${paramIndex}`);
        queryParams.push(filters.action);
        paramIndex++;
      }
      
      if (filters.startDate) {
        whereConditions.push(`ual.created_at >= $${paramIndex}`);
        queryParams.push(filters.startDate);
        paramIndex++;
      }
      
      if (filters.endDate) {
        whereConditions.push(`ual.created_at <= $${paramIndex}`);
        queryParams.push(filters.endDate);
        paramIndex++;
      }
      
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
      
      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM user_audit_logs ual
        ${whereClause}
      `;
      const countResult = await this.userModel['db'].query(countQuery, queryParams);
      const total = parseInt(countResult.rows[0].total);
      
      // Get audit logs
      const logsQuery = `
        SELECT 
          ual.id,
          ual.user_id,
          ual.action,
          ual.details,
          ual.ip_address,
          ual.user_agent,
          ual.created_at,
          u.email,
          u.first_name,
          u.last_name
        FROM user_audit_logs ual
        JOIN users u ON ual.user_id = u.id
        ${whereClause}
        ORDER BY ual.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      queryParams.push(limit, offset);
      const logsResult = await this.userModel['db'].query(logsQuery, queryParams);
      
      const logs: UserAuditLog[] = logsResult.rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        action: row.action,
        details: row.details,
        ipAddress: row.ip_address,
        userAgent: row.user_agent,
        createdAt: row.created_at
      }));
      
      return { logs, total };
      
    } catch (error) {
      console.error('Admin getAuditLogs error:', error);
      throw new Error('Failed to retrieve audit logs');
    }
  }
}
