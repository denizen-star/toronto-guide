const express = require('express');
const { Pool } = require('pg');

// Import the TypeScript admin controller (we'll need to compile it or create a JS version)
// For now, let's create a JavaScript version of the admin functionality

/**
 * Create admin routes for user management
 * @param {Pool} database - PostgreSQL connection pool
 * @returns {Router} Express router with admin routes
 */
function createAdminRoutes(database) {
  const router = express.Router();
  
  // Admin middleware - check if user is admin
  const requireAdmin = (req, res, next) => {
    try {
      const session = req.session;
      
      if (!session || !session.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
      
      if (session.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }
      
      next();
    } catch (error) {
      console.error('Admin middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error in admin middleware'
      });
    }
  };
  
  // Apply admin middleware to all routes
  router.use(requireAdmin);
  
  /**
   * @route   GET /api/admin/users
   * @desc    Get paginated list of users for admin dashboard
   * @access  Admin only
   */
  router.get('/users', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;
      
      // Build WHERE clause based on filters
      const whereConditions = [];
      const queryParams = [];
      let paramIndex = 1;
      
      if (req.query.search) {
        whereConditions.push(`(u.email ILIKE $${paramIndex} OR u.first_name ILIKE $${paramIndex} OR u.last_name ILIKE $${paramIndex})`);
        queryParams.push(`%${req.query.search}%`);
        paramIndex++;
      }
      
      if (req.query.role) {
        whereConditions.push(`u.role = $${paramIndex}`);
        queryParams.push(req.query.role);
        paramIndex++;
      }
      
      if (req.query.isActive !== undefined) {
        whereConditions.push(`u.is_active = $${paramIndex}`);
        queryParams.push(req.query.isActive === 'true');
        paramIndex++;
      }
      
      if (req.query.emailVerified !== undefined) {
        whereConditions.push(`u.email_verified = $${paramIndex}`);
        queryParams.push(req.query.emailVerified === 'true');
        paramIndex++;
      }
      
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
      
      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM users u
        ${whereClause}
      `;
      const countResult = await database.query(countQuery, queryParams);
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
      const usersResult = await database.query(usersQuery, queryParams);
      
      const users = usersResult.rows.map(row => ({
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
      
      res.status(200).json({
        success: true,
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Admin getUsersList error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve users list'
      });
    }
  });
  
  /**
   * @route   GET /api/admin/users/:id
   * @desc    Get detailed user information for admin view
   * @access  Admin only
   */
  router.get('/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      
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
      
      const result = await database.query(query, [userId]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      const row = result.rows[0];
      const user = {
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
      
      res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      console.error('Admin getUserDetails error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user details'
      });
    }
  });
  
  /**
   * @route   PUT /api/admin/users/:id/role
   * @desc    Update user role (user ↔ admin)
   * @access  Admin only
   */
  router.put('/users/:id/role', async (req, res) => {
    try {
      const userId = req.params.id;
      const { role } = req.body;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      
      if (!role || !['user', 'admin'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Valid role (user or admin) is required'
        });
      }
      
      const query = `
        UPDATE users 
        SET role = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `;
      
      const result = await database.query(query, [role, userId]);
      
      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found or update failed'
        });
      }
      
      res.status(200).json({
        success: true,
        message: `User role updated to ${role}`
      });
    } catch (error) {
      console.error('Admin updateUserRole error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user role'
      });
    }
  });
  
  /**
   * @route   PUT /api/admin/users/:id/status
   * @desc    Update user status (activate/deactivate)
   * @access  Admin only
   */
  router.put('/users/:id/status', async (req, res) => {
    try {
      const userId = req.params.id;
      const { isActive } = req.body;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      
      if (typeof isActive !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'isActive must be a boolean value'
        });
      }
      
      const query = `
        UPDATE users 
        SET is_active = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `;
      
      const result = await database.query(query, [isActive, userId]);
      
      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found or update failed'
        });
      }
      
      const statusText = isActive ? 'activated' : 'deactivated';
      res.status(200).json({
        success: true,
        message: `User account ${statusText} successfully`
      });
    } catch (error) {
      console.error('Admin updateUserStatus error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user status'
      });
    }
  });
  
  /**
   * @route   GET /api/admin/analytics/basic
   * @desc    Get basic analytics for admin dashboard
   * @access  Admin only
   */
  router.get('/analytics/basic', async (req, res) => {
    try {
      // Get total users
      const totalUsersQuery = 'SELECT COUNT(*) as count FROM users';
      const totalUsersResult = await database.query(totalUsersQuery);
      const totalUsers = parseInt(totalUsersResult.rows[0].count);
      
      // Get active users
      const activeUsersQuery = 'SELECT COUNT(*) as count FROM users WHERE is_active = true';
      const activeUsersResult = await database.query(activeUsersQuery);
      const activeUsers = parseInt(activeUsersResult.rows[0].count);
      
      // Get new users this month
      const newUsersQuery = `
        SELECT COUNT(*) as count 
        FROM users 
        WHERE created_at >= date_trunc('month', CURRENT_DATE)
      `;
      const newUsersResult = await database.query(newUsersQuery);
      const newUsersThisMonth = parseInt(newUsersResult.rows[0].count);
      
      // Get email verification rate
      const emailVerifiedQuery = 'SELECT COUNT(*) as count FROM users WHERE email_verified = true';
      const emailVerifiedResult = await database.query(emailVerifiedQuery);
      const emailVerifiedCount = parseInt(emailVerifiedResult.rows[0].count);
      const emailVerificationRate = totalUsers > 0 ? (emailVerifiedCount / totalUsers) * 100 : 0;
      
      // Get profile completion rate
      const profileCompletedQuery = 'SELECT COUNT(*) as count FROM users WHERE profile_completed = true';
      const profileCompletedResult = await database.query(profileCompletedQuery);
      const profileCompletedCount = parseInt(profileCompletedResult.rows[0].count);
      const profileCompletionRate = totalUsers > 0 ? (profileCompletedCount / totalUsers) * 100 : 0;
      
      // Get users by role
      const usersByRoleQuery = `
        SELECT role, COUNT(*) as count 
        FROM users 
        GROUP BY role
      `;
      const usersByRoleResult = await database.query(usersByRoleQuery);
      const usersByRole = {
        user: 0,
        admin: 0
      };
      usersByRoleResult.rows.forEach(row => {
        usersByRole[row.role] = parseInt(row.count);
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
      const recentActivityResult = await database.query(recentActivityQuery);
      const recentActivity = recentActivityResult.rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        action: row.action,
        details: row.details,
        ipAddress: row.ip_address,
        userAgent: row.user_agent,
        createdAt: row.created_at
      }));
      
      const analytics = {
        totalUsers,
        activeUsers,
        newUsersThisMonth,
        emailVerificationRate: Math.round(emailVerificationRate * 100) / 100,
        profileCompletionRate: Math.round(profileCompletionRate * 100) / 100,
        usersByRole,
        recentActivity
      };
      
      res.status(200).json({
        success: true,
        analytics
      });
    } catch (error) {
      console.error('Admin getBasicAnalytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve analytics'
      });
    }
  });
  
  /**
   * @route   GET /api/admin/analytics/detailed
   * @desc    Get detailed analytics (Phase 2)
   * @access  Admin only
   */
  router.get('/analytics/detailed', async (req, res) => {
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
      const registrationTrendsResult = await database.query(registrationTrendsQuery);
      
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
      const loginTrendsResult = await database.query(loginTrendsQuery);
      
      // Get users by verification status
      const verificationStatusQuery = `
        SELECT 
          email_verified,
          COUNT(*) as count
        FROM users
        GROUP BY email_verified
      `;
      const verificationStatusResult = await database.query(verificationStatusQuery);
      
      // Get users by profile completion status
      const profileStatusQuery = `
        SELECT 
          profile_completed,
          COUNT(*) as count
        FROM users
        GROUP BY profile_completed
      `;
      const profileStatusResult = await database.query(profileStatusQuery);
      
      const analytics = {
        registrationTrends: registrationTrendsResult.rows,
        loginTrends: loginTrendsResult.rows,
        verificationStatus: verificationStatusResult.rows,
        profileStatus: profileStatusResult.rows
      };
      
      res.status(200).json({
        success: true,
        analytics
      });
    } catch (error) {
      console.error('Admin getDetailedAnalytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve detailed analytics'
      });
    }
  });
  
  /**
   * @route   GET /api/admin/audit-logs
   * @desc    Get audit logs with filtering (Phase 2)
   * @access  Admin only
   */
  router.get('/audit-logs', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;
      
      // Build WHERE clause
      const whereConditions = [];
      const queryParams = [];
      let paramIndex = 1;
      
      if (req.query.userId) {
        whereConditions.push(`ual.user_id = $${paramIndex}`);
        queryParams.push(req.query.userId);
        paramIndex++;
      }
      
      if (req.query.action) {
        whereConditions.push(`ual.action = $${paramIndex}`);
        queryParams.push(req.query.action);
        paramIndex++;
      }
      
      if (req.query.startDate) {
        whereConditions.push(`ual.created_at >= $${paramIndex}`);
        queryParams.push(req.query.startDate);
        paramIndex++;
      }
      
      if (req.query.endDate) {
        whereConditions.push(`ual.created_at <= $${paramIndex}`);
        queryParams.push(req.query.endDate);
        paramIndex++;
      }
      
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
      
      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM user_audit_logs ual
        ${whereClause}
      `;
      const countResult = await database.query(countQuery, queryParams);
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
      const logsResult = await database.query(logsQuery, queryParams);
      
      const logs = logsResult.rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        action: row.action,
        details: row.details,
        ipAddress: row.ip_address,
        userAgent: row.user_agent,
        createdAt: row.created_at
      }));
      
      res.status(200).json({
        success: true,
        logs,
        total,
        pagination: {
          limit,
          offset,
          total
        }
      });
    } catch (error) {
      console.error('Admin getAuditLogs error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve audit logs'
      });
    }
  });
  
  return router;
}

module.exports = { createAdminRoutes };
