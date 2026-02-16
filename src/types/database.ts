// =====================================================
// Database Types for MultiVend
// Generated from Supabase schema
// =====================================================

// Enums
export type UserRole = 'superadmin' | 'tenant_admin' | 'seller' | 'viewer' | 'customer';
export type TenantStatus = 'pending' | 'active' | 'suspended' | 'cancelled';
export type PlanType = 'basic' | 'professional' | 'enterprise';
export type CategoryStatus = 'active' | 'inactive';

// Plans
export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  billing_interval: string;
  features: Record<string, unknown>;
  limits: Record<string, unknown>;
  is_active: boolean;
  is_global: boolean;
  created_at: string;
  updated_at: string;
}

// Tenants
export interface Tenant {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  domain: string | null;
  primary_color: string;
  secondary_color: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  postal_code: string | null;
  plan_id: string | null;
  stripe_customer_id: string | null;
  stripe_connect_account_id: string | null;
  stripe_connect_onboarding_complete: boolean;
  commission_percentage: number;
  commission_fixed: number;
  status: TenantStatus;
  approved_at: string | null;
  suspended_at: string | null;
  suspended_reason: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  created_at: string;
  updated_at: string;
}

// Users
export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  tenant_id: string | null;
  role: UserRole;
  is_superadmin: boolean;
  is_2fa_enabled: boolean;
  twofa_secret: string | null;
  email_verified: boolean;
  email_verify_token: string | null;
  email_verified_at: string | null;
  password_reset_token: string | null;
  password_reset_expires: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

// User with relations
export interface UserWithTenant extends User {
  tenant?: Tenant | null;
  plan?: Plan | null;
}

// Categories
export interface Category {
  id: string;
  tenant_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  status: CategoryStatus;
  is_global: boolean;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

// Category with children
export interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[];
}

// =====================================================
// API Response Types
// =====================================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// =====================================================
// Form Types
// =====================================================

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  acceptTerms: boolean;
}

export interface TenantRegisterFormData {
  // Step 1: Company Info
  companyName: string;
  slug: string;
  description?: string;
  
  // Step 2: Contact
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  postalCode?: string;
  
  // Step 3: Plan
  planId: string;
  
  // Step 4: Account
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

// =====================================================
// Dashboard Types
// =====================================================

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  customersChange: number;
}

export interface TenantMetrics {
  tenantId: string;
  tenantName: string;
  totalSales: number;
  totalOrders: number;
  activeProducts: number;
  commissionPaid: number;
  period: string;
}
