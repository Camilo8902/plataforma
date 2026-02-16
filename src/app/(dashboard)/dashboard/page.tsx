import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { requireAuth, getUserProfile } from '@/lib/auth';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// Stats Card Component
function StatsCard({ 
  title, 
  value, 
  change, 
  changeType,
  icon: Icon 
}: { 
  title: string; 
  value: string; 
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: React.ElementType;
}) {
  return (
    <div className="card-luxury p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-secondary text-sm">{title}</p>
          <p className="font-display text-3xl font-bold text-text-primary mt-2">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              changeType === 'positive' ? 'text-success' : 'text-error'
            }`}>
              {changeType === 'positive' ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
}

export default async function TenantDashboard() {
  await requireAuth();
  const profile = await getUserProfile();
  const supabase = await createClient();

  // If user is superadmin, redirect to admin
  if (profile?.is_superadmin || profile?.role === 'superadmin') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary">
            Welcome, Superadmin!
          </h1>
          <p className="text-text-secondary mt-1">
            Go to the admin dashboard to manage the platform.
          </p>
        </div>
        <a href="/admin" className="btn-primary">
          Go to Admin Dashboard
        </a>
      </div>
    );
  }

  // Fetch tenant data if user has a tenant
  let tenant = null;
  const stats = {
    products: 0,
    orders: 0,
    customers: 0,
    revenue: 0,
  };

  if (profile?.tenant_id) {
    const [tenantData] = await Promise.all([
      supabase
        .from('tenants')
        .select('*')
        .eq('id', profile.tenant_id)
        .single(),
    ]);
    tenant = tenantData.data;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-text-primary">
          Dashboard
        </h1>
        <p className="text-text-secondary mt-1">
          Welcome back! Here&apos;s an overview of your store.
        </p>
      </div>

      {!tenant ? (
        // No tenant yet - show setup CTA
        <div className="card p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-warning/10 flex items-center justify-center">
            <Package className="w-8 h-8 text-warning" />
          </div>
          <h2 className="font-display text-xl font-semibold text-text-primary mb-2">
            Set Up Your Store
          </h2>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            You haven&apos;t created a store yet. Create your store to start selling products and services.
          </p>
          <a href="/register/tenant" className="btn-primary">
            Create Your Store
          </a>
        </div>
      ) : (
        <>
          {/* Tenant Info */}
          <div className="card p-6 flex items-center gap-6">
            {tenant.logo_url && (
              <Image
                src={tenant.logo_url}
                alt={tenant.name}
                width={64}
                height={64}
                className="rounded-xl object-cover"
              />
            )}
            <div className="flex-1">
              <h2 className="font-display text-xl font-semibold text-text-primary">
                {tenant.name}
              </h2>
              <p className="text-text-secondary">{tenant.email}</p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                tenant.status === 'active' 
                  ? 'bg-success/10 text-success'
                  : 'bg-warning/10 text-warning'
              }`}>
                {tenant.status}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Total Products" 
              value={stats.products.toString()}
              change="+5 this week"
              changeType="positive"
              icon={Package}
            />
            <StatsCard 
              title="Total Orders" 
              value={stats.orders.toString()}
              change="+12% this month"
              changeType="positive"
              icon={ShoppingCart}
            />
            <StatsCard 
              title="Total Customers" 
              value={stats.customers.toString()}
              change="+3 new"
              changeType="positive"
              icon={Users}
            />
            <StatsCard 
              title="Revenue" 
              value={`$${stats.revenue.toLocaleString()}`}
              change="+8% this month"
              changeType="positive"
              icon={DollarSign}
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="/dashboard/products/new" className="card-luxury p-6 text-center hover:border-primary">
              <Package className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold text-text-primary">Add Product</h3>
              <p className="text-sm text-text-muted mt-1">List a new product</p>
            </a>
            <a href="/dashboard/orders" className="card-luxury p-6 text-center hover:border-primary">
              <ShoppingCart className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold text-text-primary">View Orders</h3>
              <p className="text-sm text-text-muted mt-1">Manage your orders</p>
            </a>
            <a href="/dashboard/settings" className="card-luxury p-6 text-center hover:border-primary">
              <Users className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold text-text-primary">Store Settings</h3>
              <p className="text-sm text-text-muted mt-1">Customize your store</p>
            </a>
          </div>
        </>
      )}
    </div>
  );
}
