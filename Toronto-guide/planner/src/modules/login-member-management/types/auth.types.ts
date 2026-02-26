// Authentication and User Management Type Definitions

export interface User {
  id: string; // UUID
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface UserProfile {
  id: string; // UUID
  userId: string; // UUID
  phone?: string;
  dateOfBirth?: string;
  timezone: string;
  preferences: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  id: string; // UUID
  userId: string; // UUID
  sessionId: string;
  expiresAt: string;
  createdAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface UserAuditLog {
  id: string; // UUID
  userId: string; // UUID
  action: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  timezone?: string;
  preferences?: Record<string, any>;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Response Types
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  errors?: Record<string, string>;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  user?: User;
  profile?: UserProfile;
  errors?: Record<string, string>;
}

// Admin Types
export interface AdminUserView {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  profileCompleted: boolean;
  lastLogin?: string;
  createdAt: string;
  activityCount: number;
}

export interface AdminUserListRequest {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
  emailVerified?: boolean;
}

export interface AdminUserListResponse {
  success: boolean;
  users: AdminUserView[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  emailVerificationRate: number;
  profileCompletionRate: number;
  usersByRole: {
    user: number;
    admin: number;
  };
  recentActivity: UserAuditLog[];
}

// Password validation
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
}

// Email verification
export interface EmailVerificationToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

// Password reset token
export interface PasswordResetToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  used: boolean;
  createdAt: string;
}
