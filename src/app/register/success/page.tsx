'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function RegisterSuccessPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center px-8">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-mesh pointer-events-none" />
      <div className="fixed inset-0 bg-texture pointer-events-none" />
      
      <div className="w-full max-w-md text-center relative z-10">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-success/10 flex items-center justify-center">
          <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="font-display text-3xl font-bold text-text-primary mb-4">
          Check Your Email
        </h1>
        
        <p className="text-text-secondary mb-8">
          We've sent a verification link to{' '}
          <span className="font-semibold text-text-primary">{email || 'your email'}</span>
        </p>
        
        <div className="p-6 bg-surface rounded-xl border border-border mb-8">
          <h3 className="font-semibold text-text-primary mb-4">What's next?</h3>
          <ul className="text-left text-text-secondary space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-primary font-bold">1</span>
              </span>
              <span>Check your email and click the verification link</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-primary font-bold">2</span>
              </span>
              <span>Complete your profile and store settings</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-primary font-bold">3</span>
              </span>
              <span>Start adding products and customize your storefront</span>
            </li>
          </ul>
        </div>
        
        <Link href="/login" className="btn-primary">
          Go to Login
        </Link>
        
        <p className="mt-6 text-sm text-text-muted">
          Did't receive the email?{' '}
          <button className="text-primary hover:text-primary-light font-medium">
            Resend verification
          </button>
        </p>
      </div>
    </div>
  );
}
