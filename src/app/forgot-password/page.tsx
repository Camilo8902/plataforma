'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;
      
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex" style={{ backgroundColor: '#1B4D3E' }}>
        <div className="w-full flex items-center justify-center px-8 py-12" style={{ backgroundColor: '#1B4D3E' }}>
          <div className="w-full max-w-md text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Check Your Email
            </h2>
            <p className="text-white/80 mb-8">
              We&apos;ve sent a password reset link to <strong>{email}</strong>
            </p>
            
            <Link href="/login" className="inline-block px-6 py-3 bg-white text-[#1B4D3E] font-medium rounded-lg hover:bg-gray-100 transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#1B4D3E' }}>
      <div className="w-full flex items-center justify-center px-8 py-12" style={{ backgroundColor: '#1B4D3E' }}>
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
              Reset Password
            </h2>
            <p className="text-white/80">
              Enter your email and we&apos;ll send you a reset link
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
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
                className="w-full rounded-lg border-2 border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-white text-[#1B4D3E] font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1B4D3E] transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="mt-8 text-center text-white/80">
            Remember your password?{' '}
            <Link href="/login" className="text-white font-semibold underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
