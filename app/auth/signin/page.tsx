'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Header, Footer } from '@/components';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      toast.success('Login berhasil!');

      if (userData?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Login gagal'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          {/* Card */}
          <div className="rounded-lg border border-slate-700 bg-slate-900 p-8">
            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-slate-400 mb-8">Sign in to your Mlebu Link account</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Password</label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium mt-6"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-slate-700" />
              <span className="text-sm text-slate-500">or</span>
              <div className="flex-1 h-px bg-slate-700" />
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-slate-400">
              {"Don't have an account?"}{' '}
              <Link href="/auth/signup" className="text-indigo-400 hover:text-indigo-300">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
