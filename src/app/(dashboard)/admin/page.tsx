import { createClient } from '@/lib/supabase/server';
import { requireSuperadmin } from '@/lib/auth';
import { 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// Stats Card Component
async function StatsCard({ 
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

// Recent Activity Component
async function RecentActivity() {
  const supabase = await createClient();
  
  const { data: recentTenants } = await supabase
    .from('tenants')
    .select('id, name, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="card p-6">
      <h3 className="font-display text-lg font-semibold text-text-primary mb-4">
        Recent Tenants
      </h3>
      <div className="space-y-4">
        {recentTenants?.map((tenant) => (
          <div key={tenant.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div>
              <p className="font-medium text-text-primary">{tenant.name}</p>
              <p className="text-sm text-text-muted">
                {new Date(tenant.created_at).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              tenant.status === 'active' 
                ? 'bg-success/10 text-success'
                : tenant.status === 'pending'
                ? 'bg-warning/10 text-warning'
                : 'bg-error/10 text-error'
            }`}>
              {tenant.status}
            </span>
          </div>
        ))}
        {(!recentTenants || recentTenants.length === 0) && (
          <p className="text-text-muted text-center py-4">No tenants yet</p>
        )}
      </div>
    </div>
  );
}

export default async function AdminDashboard() {
  await requireSuperadmin();
  const supabase = await createClient();

  // Fetch stats
  const [tenantsCount, plansCount, categoriesCount] = await Promise.all([
    supabase.from('tenants').select('id', { count: 'exact', head: true }),
    supabase.from('plans').select('id', { count: 'exact', head: true }),
    supabase.from('categories').select('id', { count: 'exact', head: true }),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-text-primary">
          Admin Dashboard
        </h1>
        <p className="text-text-secondary mt-1">
          Welcome back! Here&apos;s an overview of your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Tenants" 
          value={tenantsCount.count?.toString() || '0'}
          change="+12% this month"
          changeType="positive"
          icon={Users}
        />
        <StatsCard 
          title="Active Plans" 
          value={plansCount.count?.toString() || '0'}
          change="2 new"
          changeType="positive"
          icon={Package}
        />
        <StatsCard 
          title="Total Categories" 
          value={categoriesCount.count?.toString() || '0'}
          icon={ShoppingCart}
        />
        <StatsCard 
          title="Platform Revenue" 
          value="$0"
          change="0% this month"
          changeType="positive"
          icon={DollarSign}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        
        {/* Quick Actions */}
        <div className="card p-6">
          <h3 className="font-display text-lg font-semibold text-text-primary mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <a href="/admin/tenants/new" className="btn-primary w-full justify-start gap-2">
              <Users className="w-5 h-5" />
              Add New Tenant
            </a>
            <a href="/admin/plans" className="btn-outline w-full justify-start gap-2">
              <Package className="w-5 h-5" />
              Manage Plans
            </a>
            <a href="/admin/settings" className="btn-outline w-full justify-start gap-2">
              <TrendingUp className="w-5 h-5" />
              Platform Settings
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
