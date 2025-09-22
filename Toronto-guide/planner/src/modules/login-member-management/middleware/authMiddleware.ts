import { Request, Response, NextFunction } from 'express';
import { User } from '../types/auth.types';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/**
 * Middleware to check if user is authenticated
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const session = req.session as any;
    
    if (!session || !session.userId || !session.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'UNAUTHORIZED'
      });
      return;
    }
    
    // Add user to request object for use in controllers
    req.user = session.user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error in authentication middleware'
    });
  }
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const session = req.session as any;
    
    if (!session || !session.userId || !session.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'UNAUTHORIZED'
      });
      return;
    }
    
    if (session.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Admin access required',
        code: 'FORBIDDEN'
      });
      return;
    }
    
    // Add user to request object for use in controllers
    req.user = session.user;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error in admin middleware'
    });
  }
};

/**
 * Middleware to check if user's email is verified
 */
export const requireEmailVerified = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const session = req.session as any;
    
    if (!session || !session.userId || !session.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'UNAUTHORIZED'
      });
      return;
    }
    
    if (!session.user.emailVerified) {
      res.status(403).json({
        success: false,
        message: 'Email verification required',
        code: 'EMAIL_NOT_VERIFIED'
      });
      return;
    }
    
    req.user = session.user;
    next();
  } catch (error) {
    console.error('Email verification middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error in email verification middleware'
    });
  }
};

/**
 * Optional auth middleware - doesn't fail if not authenticated
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const session = req.session as any;
    
    if (session && session.userId && session.user) {
      req.user = session.user;
    }
    
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    // Don't fail the request, just continue without user
    next();
  }
};

/**
 * Middleware to check if user account is active
 */
export const requireActiveAccount = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const session = req.session as any;
    
    if (!session || !session.userId || !session.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'UNAUTHORIZED'
      });
      return;
    }
    
    if (!session.user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Account has been deactivated. Please contact support.',
        code: 'ACCOUNT_DEACTIVATED'
      });
      return;
    }
    
    req.user = session.user;
    next();
  } catch (error) {
    console.error('Active account middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error in account status middleware'
    });
  }
};

/**
 * Rate limiting middleware for authentication endpoints
 */
export const authRateLimit = (maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();
  
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const clientId = req.ip || 'unknown';
      const now = Date.now();
      
      // Clean up expired entries
      for (const [key, value] of attempts.entries()) {
        if (now > value.resetTime) {
          attempts.delete(key);
        }
      }
      
      const clientAttempts = attempts.get(clientId);
      
      if (!clientAttempts) {
        // First attempt
        attempts.set(clientId, {
          count: 1,
          resetTime: now + windowMs
        });
        next();
        return;
      }
      
      if (now > clientAttempts.resetTime) {
        // Window has expired, reset
        attempts.set(clientId, {
          count: 1,
          resetTime: now + windowMs
        });
        next();
        return;
      }
      
      if (clientAttempts.count >= maxAttempts) {
        const remainingTime = Math.ceil((clientAttempts.resetTime - now) / 1000 / 60);
        res.status(429).json({
          success: false,
          message: `Too many authentication attempts. Please try again in ${remainingTime} minutes.`,
          code: 'RATE_LIMITED',
          retryAfter: remainingTime
        });
        return;
      }
      
      // Increment attempt count
      clientAttempts.count += 1;
      next();
    } catch (error) {
      console.error('Rate limit middleware error:', error);
      // Don't fail the request due to rate limiting errors
      next();
    }
  };
};

/**
 * Middleware to log user activity
 */
export const logActivity = (action: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Store activity info in request for later logging
    (req as any).activityLog = {
      action,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      timestamp: new Date()
    };
    next();
  };
};
