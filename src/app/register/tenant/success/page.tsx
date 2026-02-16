import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function TenantRegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center px-8">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-mesh pointer-events-none" />
      <div className="fixed inset-0 bg-texture pointer-events-none" />
      
      <div className="w-full max-w-md text-center relative z-10">
        {/* Success Icon */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-success" />
        </div>
        
        <h1 className="font-display text-3xl font-bold text-text-primary mb-4">
          Store Created Successfully!
        </h1>
        
        <p className="text-text-secondary mb-8">
          Your store has been created and is pending approval. We&apos;ll send you an email once your store is active.
        </p>
        
        <div className="p-6 bg-surface rounded-xl border border-border mb-8 text-left">
          <h3 className="font-semibold text-text-primary mb-4">What&apos;s next?</h3>
          <ul className="space-y-3">
            {[
              'Check your email for verification',
              'Wait for admin approval (usually within 24 hours)',
              'Once approved, customize your store',
              'Start adding products'
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-text-secondary">
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-primary font-bold">{index + 1}</span>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-col gap-4">
          <Link href="/dashboard" className="btn-primary justify-center">
            Go to Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <Link href="/" className="btn-outline justify-center">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
