import { Router } from 'express';
import { Pool } from 'pg';
import { AdminController } from '../controllers/adminController';
import { requireAdmin, logActivity } from '../middleware/authMiddleware';

export function createAdminRoutes(database: Pool): Router {
  const router = Router();
  const adminController = new AdminController(database);
  
  // Apply admin middleware to all routes
  router.use(requireAdmin);
  
  /**
   * @route   GET /api/admin/users
   * @desc    Get paginated list of users for admin dashboard
   * @access  Admin only
   * @query   page, limit, search, role, isActive, emailVerified
   */
  router.get('/users', 
    logActivity('admin_users_list_viewed'),
    adminController.getUsersList
  );
  
  /**
   * @route   GET /api/admin/users/:id
   * @desc    Get detailed user information for admin view
   * @access  Admin only
   */
  router.get('/users/:id', 
    logActivity('admin_user_details_viewed'),
    adminController.getUserDetails
  );
  
  /**
   * @route   PUT /api/admin/users/:id/role
   * @desc    Update user role (user ↔ admin)
   * @access  Admin only
   * @body    { role: 'user' | 'admin' }
   */
  router.put('/users/:id/role', 
    logActivity('admin_user_role_updated'),
    adminController.updateUserRole
  );
  
  /**
   * @route   PUT /api/admin/users/:id/status
   * @desc    Update user status (activate/deactivate)
   * @access  Admin only
   * @body    { isActive: boolean }
   */
  router.put('/users/:id/status', 
    logActivity('admin_user_status_updated'),
    adminController.updateUserStatus
  );
  
  /**
   * @route   GET /api/admin/analytics/basic
   * @desc    Get basic analytics for admin dashboard
   * @access  Admin only
   */
  router.get('/analytics/basic', 
    logActivity('admin_basic_analytics_viewed'),
    adminController.getBasicAnalytics
  );
  
  /**
   * @route   GET /api/admin/analytics/detailed
   * @desc    Get detailed analytics (Phase 2)
   * @access  Admin only
   */
  router.get('/analytics/detailed', 
    logActivity('admin_detailed_analytics_viewed'),
    adminController.getDetailedAnalytics
  );
  
  /**
   * @route   GET /api/admin/audit-logs
   * @desc    Get audit logs with filtering (Phase 2)
   * @access  Admin only
   * @query   userId, action, startDate, endDate, limit, offset
   */
  router.get('/audit-logs', 
    logActivity('admin_audit_logs_viewed'),
    adminController.getAuditLogs
  );
  
  return router;
}
