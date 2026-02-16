'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Redirect based on role
      if (data.user) {
        // Fetch user role from database
        const { data: userData } = await supabase
          .from('users')
          .select('role, tenant_id, is_superadmin')
          .eq('id', data.user.id)
          .single();

        if (userData?.is_superadmin || userData?.role === 'superadmin') {
          router.push('/admin');
        } else if (userData?.tenant_id) {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#1B4D3E' }}>
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: '#1B4D3E' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary" />
        <div className="absolute inset-0 art-deco-bg opacity-10" />
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-64 h-64 border border-secondary/20 rounded-full" />
        <div className="absolute bottom-20 right-20 w-96 h-96 border border-secondary/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-secondary/5 rounded-full" />
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-text-inverse">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center">
              <span className="font-display text-3xl text-primary font-bold">M</span>
            </div>
            <span className="font-display text-4xl font-bold tracking-wide">MultiVend</span>
          </div>
          
          <h1 className="font-display text-4xl font-bold mb-6 leading-tight">
            Your Premium<br/>Multi-Tenant<br/>Marketplace
          </h1>
          
          <p className="text-lg text-white/80 max-w-md leading-relaxed">
            Join thousands of entrepreneurs building successful multi-vendor marketplaces with our elegant platform.
          </p>
          
          {/* Features List */}
          <div className="mt-12 space-y-4">
            {[
              'Stripe Connect Integration',
              'Custom Storefronts',
              'Advanced Analytics',
              'Enterprise Security'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12" style={{ backgroundColor: '#1B4D3E' }}>
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
              <span className="font-display text-xl text-[#1B4D3E] font-bold">M</span>
            </div>
            <span className="font-display text-2xl font-bold text-white">MultiVend</span>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-white">
              Sign in to your account to continue
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-white mb-0">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-white hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-white">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#1B4D3E] text-white font-medium rounded-lg hover:bg-[#2D7A5F] focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#1B4D3E] text-white">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button type="button" className="py-2.5 px-4 border-2 border-[#1B4D3E] text-[#1B4D3E] font-medium rounded-lg hover:bg-[#1B4D3E] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:ring-offset-2 transition-all duration-200 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button type="button" className="py-2.5 px-4 border-2 border-[#1B4D3E] text-[#1B4D3E] font-medium rounded-lg hover:bg-[#1B4D3E] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:ring-offset-2 transition-all duration-200 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-text-secondary">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary font-semibold hover:text-primary-light">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
