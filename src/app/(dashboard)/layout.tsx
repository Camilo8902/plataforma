import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  BarChart3,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { logout } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  const isSuperadmin = profile?.is_superadmin || profile?.role === 'superadmin';

  const navItems = isSuperadmin 
    ? [
        { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/admin/tenants', icon: Users, label: 'Tenants' },
        { href: '/admin/products', icon: Package, label: 'Products' },
        { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
        { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
        { href: '/admin/settings', icon: Settings, label: 'Settings' },
      ]
    : [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/dashboard/products', icon: Package, label: 'Products' },
        { href: '/dashboard/orders', icon: ShoppingCart, label: 'Orders' },
        { href: '/dashboard/customers', icon: Users, label: 'Customers' },
        { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
        { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
      ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-surface border-r border-border">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-display text-xl text-text-inverse font-bold">M</span>
          </div>
          <span className="font-display text-xl font-bold text-primary">MultiVend</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="sidebar-item"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold">
                {profile?.first_name?.[0] || profile?.email?.[0] || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {profile?.first_name || profile?.email}
              </p>
              <p className="text-xs text-text-muted truncate">
                {isSuperadmin ? 'Superadmin' : profile?.role}
              </p>
            </div>
          </div>
          <form action={logout}>
            <button type="submit" className="sidebar-item w-full text-error hover:bg-error/10">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64">
        {/* Top Header - Mobile */}
        <header className="lg:hidden sticky top-0 z-40 bg-surface border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-display text-lg text-text-inverse font-bold">M</span>
            </div>
            <span className="font-display text-lg font-bold text-primary">MultiVend</span>
          </div>
          <button className="p-2 rounded-lg hover:bg-surface-elevated">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
