-- =====================================================
-- MultiVend Database Migration
-- Phase 1: Base de Datos y Schema
-- Tables: tenants, users, plans, categories
-- =====================================================

-- =====================================================
-- ENUMS
-- =====================================================

-- User roles
CREATE TYPE user_role AS ENUM (
  'superadmin',
  'tenant_admin',
  'seller',
  'viewer',
  'customer'
);

-- Tenant status
CREATE TYPE tenant_status AS ENUM (
  'pending',
  'active',
  'suspended',
  'cancelled'
);

-- Plan types
CREATE TYPE plan_type AS ENUM (
  'basic',
  'professional',
  'enterprise'
);

-- Category status
CREATE TYPE category_status AS ENUM (
  'active',
  'inactive'
);

-- =====================================================
-- PLANS TABLE
-- =====================================================
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  billing_interval VARCHAR(20) DEFAULT 'monthly', -- monthly, yearly
  features JSONB DEFAULT '{}',
  limits JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_global BOOLEAN DEFAULT false, -- available for all tenants
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TENANTS TABLE
-- =====================================================
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  domain VARCHAR(255), -- custom domain
  primary_color VARCHAR(20) DEFAULT '#1B4D3E',
  secondary_color VARCHAR(20) DEFAULT '#C9A962',
  
  -- Contact info
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'ES',
  postal_code VARCHAR(20),
  
  -- Plan and billing
  plan_id UUID REFERENCES plans(id),
  stripe_customer_id VARCHAR(255),
  stripe_connect_account_id VARCHAR(255),
  stripe_connect_onboarding_complete BOOLEAN DEFAULT false,
  
  -- Commission settings
  commission_percentage DECIMAL(5, 2) DEFAULT 10.00,
  commission_fixed DECIMAL(10, 2) DEFAULT 0.00,
  
  -- Status
  status tenant_status DEFAULT 'pending',
  approved_at TIMESTAMPTZ,
  suspended_at TIMESTAMPTZ,
  suspended_reason TEXT,
  
  -- SEO
  meta_title VARCHAR(200),
  meta_description TEXT,
  meta_keywords TEXT[],
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  phone VARCHAR(50),
  
  -- Tenant association (null for superadmin)
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  
  -- Role
  role user_role DEFAULT 'customer',
  is_superadmin BOOLEAN DEFAULT false,
  
  -- 2FA
  is_2fa_enabled BOOLEAN DEFAULT false,
  2fa_secret VARCHAR(255),
  
  -- Email verification
  email_verified BOOLEAN DEFAULT false,
  email_verify_token VARCHAR(255),
  email_verified_at TIMESTAMPTZ,
  
  -- Password reset
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMPTZ,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  
  -- Hierarchy
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  
  -- Status
  status category_status DEFAULT 'active',
  is_global BOOLEAN DEFAULT false, -- available for all tenants
  sort_order INT DEFAULT 0,
  
  -- SEO
  meta_title VARCHAR(200),
  meta_description TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint per tenant
  UNIQUE(tenant_id, slug)
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Tenants
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_plan ON tenants(plan_id);

-- Users
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Categories
CREATE INDEX idx_categories_tenant ON categories(tenant_id);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PLANS POLICIES
-- =====================================================

-- Everyone can view active plans
CREATE POLICY "Anyone can view active plans"
ON plans FOR SELECT
USING (is_active = true);

-- Only superadmins can modify plans
CREATE POLICY "Superadmins can manage plans"
ON plans FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_superadmin = true
  )
);

-- =====================================================
-- TENANTS POLICIES
-- =====================================================

-- Public can view active tenants (for storefront)
CREATE POLICY "Public can view active tenants"
ON tenants FOR SELECT
USING (status = 'active');

-- Users can view their own tenant
CREATE POLICY "Users can view their tenant"
ON tenants FOR SELECT
USING (
  id IN (
    SELECT tenant_id FROM users
    WHERE users.id = auth.uid()
  )
);

-- Only superadmins can do everything
CREATE POLICY "Superadmins can manage tenants"
ON tenants FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_superadmin = true
  )
);

-- =====================================================
-- USERS POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (id = auth.uid());

-- Only superadmins can view all users
CREATE POLICY "Superadmins can view all users"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.is_superadmin = true
  )
);

-- Only superadmins can create users
CREATE POLICY "Superadmins can create users"
ON users FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.is_superadmin = true
  )
);

-- Tenant admins can manage their tenant's users
CREATE POLICY "Tenant admins can manage tenant users"
ON users FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.tenant_id = users.tenant_id
    AND u.role IN ('tenant_admin', 'superadmin')
  )
);

-- =====================================================
-- CATEGORIES POLICIES
-- =====================================================

-- Public can view active categories
CREATE POLICY "Public can view active categories"
ON categories FOR SELECT
USING (
  status = 'active'
  AND (
    is_global = true
    OR tenant_id IN (
      SELECT tenant_id FROM users
      WHERE users.id = auth.uid()
    )
  )
);

-- Users can manage their tenant's categories
CREATE POLICY "Tenant admins can manage categories"
ON categories FOR ALL
USING (
  is_global = true
  OR tenant_id IN (
    SELECT tenant_id FROM users
    WHERE users.id = auth.uid()
  )
);

-- Superadmins can manage all
CREATE POLICY "Superadmins can manage all categories"
ON categories FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_superadmin = true
  )
);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_tenants_updated_at
BEFORE UPDATE ON tenants
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_plans_updated_at
BEFORE UPDATE ON plans
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert default plans
INSERT INTO plans (name, slug, description, price, billing_interval, features, limits, is_active, is_global) VALUES
('Básico', 'basic', 'Plan básico para tiendas pequeñas', 29.99, 'monthly', 
 '{"products": 50, "storage_gb": 5, "transactions": 100}', 
 '{"products": 50, "storage_gb": 5, "orders_per_month": 100}',
 true, true),

('Profesional', 'professional', 'Plan profesional para negocios en crecimiento', 79.99, 'monthly',
 '{"products": 500, "storage_gb": 25, "transactions": 1000, "custom_domain": true}',
 '{"products": 500, "storage_gb": 25, "orders_per_month": 1000, "custom_domain": true}',
 true, true),

('Empresarial', 'enterprise', 'Plan empresarial para grandes operaciones', 199.99, 'monthly',
 '{"products": -1, "storage_gb": 100, "transactions": -1, "custom_domain": true, "api_access": true}',
 '{"products": "unlimited", "storage_gb": 100, "orders_per_month": "unlimited", "custom_domain": true, "api_access": true}',
 true, true);

-- Insert default global categories
INSERT INTO categories (name, slug, description, is_global, sort_order) VALUES
('Electrónica', 'electronica', 'Dispositivos electrónicos y accesorios', true, 1),
('Ropa y Moda', 'ropa-y-moda', 'Ropa, calzado y accesorios de moda', true, 2),
('Hogar y Jardín', 'hogar-y-jardin', 'Muebles, decoración y jardín', true, 3),
('Deportes', 'deportes', 'Equipamiento deportivo y fitness', true, 4),
('Belleza y Cuidado Personal', 'belleza', 'Productos de belleza y cuidado', true, 5),
('Alimentación', 'alimentacion', 'Alimentos y bebidas', true, 6),
('Juguetes y Juegos', 'juguetes', 'Juguetes y juegos de mesa', true, 7),
('Libros y Cultura', 'libros', 'Libros, música y películas', true, 8);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE plans IS 'Subscription plans available for tenants';
COMMENT ON TABLE tenants IS 'Tenant organizations using the multi-tenant platform';
COMMENT ON TABLE users IS 'Users of the platform with different roles';
COMMENT ON TABLE categories IS 'Product categories, can be global or tenant-specific';
