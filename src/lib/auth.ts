import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function logout() {
  'use server';
  
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function getSession() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return profile;
}

export async function requireAuth() {
  const user = await getSession();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function requireSuperadmin() {
  const profile = await getUserProfile();
  if (!profile || (!profile.is_superadmin && profile.role !== 'superadmin')) {
    redirect('/dashboard');
  }
  return profile;
}
