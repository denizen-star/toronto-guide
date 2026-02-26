import { Request, Response } from 'express';
import { Pool } from 'pg';
import { AdminService } from '../services/adminService';
import { 
  AdminUserListRequest, 
  AdminUserListResponse,
  AdminAnalytics
} from '../types/auth.types';

export class AdminController {
  private adminService: AdminService;
  
  constructor(database: Pool) {
    this.adminService = new AdminService(database);
  }
  
  /**
   * Get paginated list of users for admin dashboard
   * GET /api/admin/users
   */
  getUsersList = async (req: Request, res: Response): Promise<void> => {
    try {
      const request: AdminUserListRequest = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        search: req.query.search as string,
        role: req.query.role as 'user' | 'admin',
        isActive: req.query.isActive ? req.query.isActive === 'true' : undefined,
        emailVerified: req.query.emailVerified ? req.query.emailVerified === 'true' : undefined
      };
      
      const result = await this.adminService.getUsersList(request);
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Admin getUsersList controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve users list'
      });
    }
  };
  
  /**
   * Get detailed user information for admin view
   * GET /api/admin/users/:id
   */
  getUserDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }
      
      const user = await this.adminService.getUserDetails(userId);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      console.error('Admin getUserDetails controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user details'
      });
    }
  };
  
  /**
   * Update user role
   * PUT /api/admin/users/:id/role
   */
  updateUserRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const { role } = req.body;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }
      
      if (!role || !['user', 'admin'].includes(role)) {
        res.status(400).json({
          success: false,
          message: 'Valid role (user or admin) is required'
        });
        return;
      }
      
      const success = await this.adminService.updateUserRole(userId, role);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'User not found or update failed'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: `User role updated to ${role}`
      });
    } catch (error) {
      console.error('Admin updateUserRole controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user role'
      });
    }
  };
  
  /**
   * Update user status (activate/deactivate)
   * PUT /api/admin/users/:id/status
   */
  updateUserStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const { isActive } = req.body;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }
      
      if (typeof isActive !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'isActive must be a boolean value'
        });
        return;
      }
      
      const success = await this.adminService.updateUserStatus(userId, isActive);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'User not found or update failed'
        });
        return;
      }
      
      const statusText = isActive ? 'activated' : 'deactivated';
      res.status(200).json({
        success: true,
        message: `User account ${statusText} successfully`
      });
    } catch (error) {
      console.error('Admin updateUserStatus controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user status'
      });
    }
  };
  
  /**
   * Get basic analytics for admin dashboard
   * GET /api/admin/analytics/basic
   */
  getBasicAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
      const analytics = await this.adminService.getBasicAnalytics();
      
      res.status(200).json({
        success: true,
        analytics
      });
    } catch (error) {
      console.error('Admin getBasicAnalytics controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve analytics'
      });
    }
  };
  
  /**
   * Get detailed analytics (Phase 2)
   * GET /api/admin/analytics/detailed
   */
  getDetailedAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
      const analytics = await this.adminService.getDetailedAnalytics();
      
      res.status(200).json({
        success: true,
        analytics
      });
    } catch (error) {
      console.error('Admin getDetailedAnalytics controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve detailed analytics'
      });
    }
  };
  
  /**
   * Get audit logs with filtering (Phase 2)
   * GET /api/admin/audit-logs
   */
  getAuditLogs = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters = {
        userId: req.query.userId as string,
        action: req.query.action as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
      };
      
      const result = await this.adminService.getAuditLogs(filters);
      
      res.status(200).json({
        success: true,
        logs: result.logs,
        total: result.total,
        pagination: {
          limit: filters.limit || 50,
          offset: filters.offset || 0,
          total: result.total
        }
      });
    } catch (error) {
      console.error('Admin getAuditLogs controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve audit logs'
      });
    }
  };
}
