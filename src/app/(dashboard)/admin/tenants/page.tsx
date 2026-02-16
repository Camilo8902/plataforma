import { createClient } from '@/lib/supabase/server';
import { requireSuperadmin } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Users, 
  Search, 
  Check,
  Pause,
  Play,
  Eye,
  Edit
} from 'lucide-react';

// Types
interface TenantWithPlan {
  id: string;
  name: string;
  email: string;
  logo_url: string | null;
  status: string;
  commission_percentage: number;
  created_at: string;
  plans: {
    name: string;
  } | null;
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const styles = {
    active: 'bg-success/10 text-success',
    pending: 'bg-warning/10 text-warning',
    suspended: 'bg-error/10 text-error',
    cancelled: 'bg-text-muted/10 text-text-muted',
  };
  
  const labels = {
    active: 'Active',
    pending: 'Pending',
    suspended: 'Suspended',
    cancelled: 'Cancelled',
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.pending}`}>
      {labels[status as keyof typeof labels] || status}
    </span>
  );
}

export default async function TenantsPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string };
}) {
  await requireSuperadmin();
  const supabase = await createClient();

  const currentStatus = searchParams.status || 'all';
  const page = parseInt(searchParams.page || '1');
  const pageSize = 10;

  // Build query
  let query = supabase
    .from('tenants')
    .select('*, plans!inner(name)', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (currentStatus !== 'all') {
    query = query.eq('status', currentStatus);
  }

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  const { data: tenants, count } = await query
    .range(from, to) as { data: TenantWithPlan[] | null; count: number | null };

  const totalPages = Math.ceil((count || 0) / pageSize);

  // Fetch stats
  const [activeCount, pendingCount] = await Promise.all([
    supabase.from('tenants').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('tenants').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary">
            Tenants
          </h1>
          <p className="text-text-secondary mt-1">
            Manage all marketplace tenants
          </p>
        </div>
        <Link href="/admin/tenants/new" className="btn-primary">
          <Users className="w-5 h-5 mr-2" />
          Add Tenant
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-text-secondary text-sm">Total Tenants</p>
          <p className="font-display text-2xl font-bold text-text-primary">{count || 0}</p>
        </div>
        <div className="card p-4">
          <p className="text-text-secondary text-sm">Active</p>
          <p className="font-display text-2xl font-bold text-success">{activeCount.count || 0}</p>
        </div>
        <div className="card p-4">
          <p className="text-text-secondary text-sm">Pending</p>
          <p className="font-display text-2xl font-bold text-warning">{pendingCount.count || 0}</p>
        </div>
        <div className="card p-4">
          <p className="text-text-secondary text-sm">Suspended</p>
          <p className="font-display text-2xl font-bold text-error">0</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search tenants..."
              className="input pl-10"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex gap-2">
            {['all', 'active', 'pending', 'suspended'].map((status) => (
              <Link
                key={status}
                href={`/admin/tenants?status=${status}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentStatus === status
                    ? 'bg-primary text-text-inverse'
                    : 'bg-surface-elevated text-text-secondary hover:bg-primary/5'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-elevated border-b border-border">
                <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">Tenant</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">Plan</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">Commission</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">Created</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants?.map((tenant: TenantWithPlan) => (
                <tr key={tenant.id} className="border-b border-border hover:bg-surface-elevated/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        {tenant.logo_url ? (
                          <Image 
                            src={tenant.logo_url} 
                            alt={tenant.name} 
                            width={40}
                            height={40}
                            className="rounded-lg object-cover" 
                          />
                        ) : (
                          <span className="text-primary font-semibold">
                            {tenant.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{tenant.name}</p>
                        <p className="text-sm text-text-muted">{tenant.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-text-secondary">
                      {tenant.plans?.name || 'Free'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={tenant.status} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-text-secondary">
                      {tenant.commission_percentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-text-secondary">
                      {new Date(tenant.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/tenants/${tenant.id}`}
                        className="p-2 rounded-lg hover:bg-surface-elevated text-text-muted hover:text-primary transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <Link
                        href={`/admin/tenants/${tenant.id}/edit`}
                        className="p-2 rounded-lg hover:bg-surface-elevated text-text-muted hover:text-primary transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      {tenant.status === 'pending' && (
                        <form action={async () => {
                          'use server';
                          const supabase = await createClient();
                          await supabase.from('tenants').update({ 
                            status: 'active', 
                            approved_at: new Date().toISOString() 
                          }).eq('id', tenant.id);
                        }}>
                          <button className="p-2 rounded-lg hover:bg-success/10 text-text-muted hover:text-success transition-colors">
                            <Check className="w-5 h-5" />
                          </button>
                        </form>
                      )}
                      {tenant.status === 'active' && (
                        <form action={async () => {
                          'use server';
                          const supabase = await createClient();
                          await supabase.from('tenants').update({ 
                            status: 'suspended',
                            suspended_at: new Date().toISOString()
                          }).eq('id', tenant.id);
                        }}>
                          <button className="p-2 rounded-lg hover:bg-warning/10 text-text-muted hover:text-warning transition-colors">
                            <Pause className="w-5 h-5" />
                          </button>
                        </form>
                      )}
                      {tenant.status === 'suspended' && (
                        <form action={async () => {
                          'use server';
                          const supabase = await createClient();
                          await supabase.from('tenants').update({ 
                            status: 'active',
                            suspended_at: null
                          }).eq('id', tenant.id);
                        }}>
                          <button className="p-2 rounded-lg hover:bg-success/10 text-text-muted hover:text-success transition-colors">
                            <Play className="w-5 h-5" />
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {(!tenants || tenants.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                    No tenants found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <p className="text-sm text-text-muted">
              Showing {from + 1} to {Math.min(to + 1, count || 0)} of {count || 0} results
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/tenants?status=${currentStatus}&page=${page - 1}`}
                  className="btn-outline py-2 px-4"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/tenants?status=${currentStatus}&page=${page + 1}`}
                  className="btn-outline py-2 px-4"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
