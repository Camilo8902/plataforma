'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    // Account
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    acceptTerms: false,
  });

  const router = useRouter();
  const supabase = createClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions');
      setLoading(false);
      return;
    }

    try {
      // Sign up with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Create user record in database
        await supabase.from('users').insert({
          id: data.user.id,
          email: formData.email,
          password_hash: 'managed_by_supabase_auth',
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: 'customer',
          email_verified: false,
        });

        router.push('/register/success?email=' + encodeURIComponent(formData.email));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-mesh pointer-events-none" />
      <div className="fixed inset-0 bg-texture pointer-events-none" />
      
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
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
            Start Selling<br/>on Your Own<br/>Marketplace
          </h1>
          
          <p className="text-lg text-white/80 max-w-md leading-relaxed">
            Join thousands of entrepreneurs who have built successful multi-vendor platforms. Create your account today.
          </p>
          
          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-6">
            {[
              { value: '500+', label: 'Marketplaces' },
              { value: '$50M+', label: 'Processed' }
            ].map((stat, index) => (
              <div key={index}>
                <div className="font-display text-3xl font-bold text-secondary">{stat.value}</div>
                <div className="text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-[#F5F5F5]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-display text-xl text-text-inverse font-bold">M</span>
            </div>
            <span className="font-display text-2xl font-bold text-primary">MultiVend</span>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold text-black mb-2">
              Create Account
            </h2>
            <p className="text-black">
              Step {step} of 2
            </p>
            
            {/* Progress Bar */}
            <div className="mt-4 flex gap-2 justify-center">
              <div className={`h-1 w-16 rounded-full transition-colors ${step >= 1 ? 'bg-secondary' : 'bg-border'}`} />
              <div className={`h-1 w-16 rounded-full transition-colors ${step >= 2 ? 'bg-secondary' : 'bg-border'}`} />
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            // Step 1: Account credentials
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="label">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="label">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input"
                  placeholder="Min. 8 characters"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="label">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full py-3 px-4 bg-[#1B4D3E] text-white font-medium rounded-lg hover:bg-[#2D7A5F] focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:ring-offset-2 transition-all duration-200"
              >
                Continue
              </button>
            </div>
          ) : (
            // Step 2: Personal info
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="label">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="label">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="flex items-start">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="w-4 h-4 mt-1 rounded border-border text-primary focus:ring-primary/20"
                />
                <label htmlFor="acceptTerms" className="ml-2 text-sm text-text-secondary">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary hover:text-primary-light">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-primary hover:text-primary-light">Privacy Policy</Link>
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
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2 px-4 text-[#5C5C5C] hover:bg-[#F5F5F5] rounded-lg transition-colors"
              >
                Back
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-black">
            Already have an account?{' '}
            <Link href="/login" className="text-black font-semibold underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
