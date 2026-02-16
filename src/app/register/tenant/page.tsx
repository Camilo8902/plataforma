'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  Building2, 
  User, 
  CreditCard, 
  Palette,
  Check,
  ArrowLeft,
  ArrowRight,
  Loader2
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
}

const steps = [
  { id: 1, title: 'Company Info', icon: Building2 },
  { id: 2, title: 'Contact Details', icon: User },
  { id: 3, title: 'Select Plan', icon: CreditCard },
  { id: 4, title: 'Store Setup', icon: Palette },
];

export default function TenantRegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plans, setPlans] = useState<Plan[]>([]);
  
  const router = useRouter();
  const supabase = createClient();

  // Fetch plans on mount
  useEffect(() => {
    const fetchPlans = async () => {
      const { data } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .eq('is_global', true)
        .order('price', { ascending: true });
      
      if (data) setPlans(data);
    };
    fetchPlans();
  }, []);

  const [formData, setFormData] = useState({
    // Step 1: Company
    companyName: '',
    slug: '',
    description: '',
    
    // Step 2: Contact
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'ES',
    postalCode: '',
    
    // Step 3: Plan
    planId: '',
    
    // Step 4: Account
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from company name
    if (name === 'companyName' && step === 1) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, companyName: value, slug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateStep = (currentStep: number): boolean => {
    setError('');
    
    switch (currentStep) {
      case 1:
        if (!formData.companyName || !formData.slug) {
          setError('Please fill in company name');
          return false;
        }
        if (formData.slug.length < 3) {
          setError('Slug must be at least 3 characters');
          return false;
        }
        return true;
        
      case 2:
        if (!formData.email) {
          setError('Please enter your email');
          return false;
        }
        return true;
        
      case 3:
        if (!formData.planId) {
          setError('Please select a plan');
          return false;
        }
        return true;
        
      case 4:
        if (!formData.firstName || !formData.lastName) {
          setError('Please fill in your name');
          return false;
        }
        if (!formData.password || formData.password.length < 8) {
          setError('Password must be at least 8 characters');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(4)) return;
    
    setLoading(true);
    setError('');

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // 2. Create tenant
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .insert({
          name: formData.companyName,
          slug: formData.slug,
          description: formData.description,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postal_code: formData.postalCode,
          plan_id: formData.planId,
          status: 'pending',
        })
        .select()
        .single();

      if (tenantError) throw tenantError;

      // 3. Create user profile with tenant association
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: formData.email,
          password_hash: 'managed_by_supabase_auth',
          first_name: formData.firstName,
          last_name: formData.lastName,
          tenant_id: tenant.id,
          role: 'tenant_admin',
          email_verified: false,
        });

      if (profileError) throw profileError;

      // Redirect to success
      router.push('/register/tenant/success');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-mesh pointer-events-none" />
      <div className="fixed inset-0 bg-texture pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 bg-surface border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-display text-xl text-text-inverse font-bold">M</span>
            </div>
            <span className="font-display text-xl font-bold text-primary">MultiVend</span>
          </Link>
          <Link href="/login" className="text-text-secondary hover:text-primary">
            Already have an account?
          </Link>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  step >= s.id 
                    ? 'bg-primary border-primary text-text-inverse' 
                    : 'bg-surface border-border text-text-muted'
                }`}>
                  {step > s.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <s.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium hidden sm:block ${
                  step >= s.id ? 'text-text-primary' : 'text-text-muted'
                }`}>
                  {s.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 sm:w-24 h-0.5 mx-2 ${
                    step > s.id ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="card p-8">
          {/* Step 1: Company Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold text-text-primary">
                Tell us about your company
              </h2>
              
              <div>
                <label className="label">Company Name *</label>
                <input
                  name="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="input"
                  placeholder="My Awesome Store"
                />
              </div>

              <div>
                <label className="label">Store URL *</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-surface-elevated border border-r-0 border-border rounded-l-lg text-text-muted">
                    multivid.com/
                  </span>
                  <input
                    name="slug"
                    type="text"
                    value={formData.slug}
                    onChange={handleChange}
                    className="input rounded-l-none"
                    placeholder="my-store"
                  />
                </div>
                <p className="text-sm text-text-muted mt-1">
                  This will be your store URL: multivid.com/{formData.slug || 'your-store'}
                </p>
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input min-h-[100px]"
                  placeholder="Tell customers about your store..."
                />
              </div>
            </div>
          )}

          {/* Step 2: Contact Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold text-text-primary">
                How can we reach you?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Email Address *</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                    placeholder="+34 123 456 789"
                  />
                </div>
              </div>

              <div>
                <label className="label">Address</label>
                <input
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  className="input"
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="label">City</label>
                  <input
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    className="input"
                    placeholder="Madrid"
                  />
                </div>
                <div>
                  <label className="label">State</label>
                  <input
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    className="input"
                    placeholder="Madrid"
                  />
                </div>
                <div>
                  <label className="label">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="ES">Spain</option>
                    <option value="MX">Mexico</option>
                    <option value="AR">Argentina</option>
                    <option value="CO">Colombia</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Select Plan */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold text-text-primary">
                Choose your plan
              </h2>

              <div className="grid gap-4">
                {plans.map((plan) => (
                  <label
                    key={plan.id}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.planId === plan.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="planId"
                      value={plan.id}
                      checked={formData.planId === plan.id}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-text-primary">{plan.name}</h3>
                        <p className="text-sm text-text-muted">{plan.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-2xl font-bold text-primary">
                          ${plan.price}
                        </p>
                        <p className="text-sm text-text-muted">/month</p>
                      </div>
                    </div>
                    {formData.planId === plan.id && (
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-text-inverse" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Account Setup */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold text-text-primary">
                Create your account
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name *</label>
                  <input
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="label">Last Name *</label>
                  <input
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="label">Password *</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input"
                  placeholder="Min. 8 characters"
                />
              </div>

              <div>
                <label className="label">Confirm Password *</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="btn-outline"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Store
                    <Check className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
