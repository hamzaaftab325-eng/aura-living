'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// ─── Validation Schemas ───

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const updatePasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
});

type AuthResult = {
  success: boolean;
  error?: string;
};

// ─── Signup ───

export async function signup(formData: FormData): Promise<AuthResult> {
  try {
    const validated = signupSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
      fullName: formData.get('fullName'),
    });

    if (!validated.success) {
      return { success: false, error: validated.error.issues[0]?.message ?? 'Invalid input' };
    }

    const { email, password, fullName } = validated.data;
    const supabase = await createClient();
    const headerList = await headers();
    const origin = headerList.get('origin') || 'https://aura-living-two.vercel.app';

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return { success: false, error: 'An account with this email already exists.' };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Signup crash:', message);
    return { success: false, error: message };
  }
}

// ─── Login ───

export async function login(formData: FormData): Promise<AuthResult> {
  try {
    const validated = loginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!validated.success) {
      return { success: false, error: validated.error.issues[0]?.message ?? 'Invalid input' };
    }

    const { email, password } = validated.data;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { success: false, error: 'Invalid email or password.' };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Login crash:', message);
    return { success: false, error: message };
  }
}

// ─── Logout ───

export async function logout(): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore
  }
  redirect('/');
}

// ─── Reset Password ───

export async function resetPassword(formData: FormData): Promise<AuthResult> {
  try {
    const validated = resetPasswordSchema.safeParse({
      email: formData.get('email'),
    });

    if (!validated.success) {
      return { success: false, error: validated.error.issues[0]?.message ?? 'Invalid input' };
    }

    const { email } = validated.data;
    const supabase = await createClient();
    const headerList = await headers();
    const origin = headerList.get('origin') || 'https://aura-living-two.vercel.app';

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/update-password`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Reset password crash:', message);
    return { success: false, error: message };
  }
}

// ─── Update Password ───

export async function updatePassword(formData: FormData): Promise<AuthResult> {
  try {
    const validated = updatePasswordSchema.safeParse({
      password: formData.get('password'),
    });

    if (!validated.success) {
      return { success: false, error: validated.error.issues[0]?.message ?? 'Invalid input' };
    }

    const { password } = validated.data;
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Update password crash:', message);
    return { success: false, error: message };
  }
}

// ─── OAuth ───

export async function signInWithOAuth(provider: 'google' | 'facebook') {
  try {
    const supabase = await createClient();
    const headerList = await headers();
    const origin = headerList.get('origin') || 'https://aura-living-two.vercel.app';

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${origin}/auth/callback` },
    });

    if (error || !data.url) {
      throw new Error(error?.message || 'OAuth failed');
    }

    redirect(data.url);
  } catch (err) {
    console.error('OAuth error:', err);
    throw err;
  }
}
