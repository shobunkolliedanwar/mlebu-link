'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/lib/types';
import { LogOut, Menu, X } from 'lucide-react';

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        setUser(data);
      }

      setLoading(false);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setUser(data);
      } else {
        setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-700">
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <h1 className="text-xl font-bold group-hover:text-indigo-400 transition-colors">
            Mlebu Link
          </h1>
        </Link>

        {/* Desktop Navigation */}
        {/* <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors">
            Home
          </Link>
          {user?.role === 'admin' && (
            <Link
              href="/admin"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Dashboard Admin
            </Link>
          )}
          {user?.role === 'user' && (
            <Link
              href="/dashboard"
              className="text-slate-400 hover:text-white transition-colors"
            >
              My Dashboard
            </Link>
          )}
        </nav> */}

        {/* Right Section */}
      </div>

      {/* Mobile Menu */}
      {/* {isMenuOpen && (
        <div className="md:hidden border-t border-slate-700 bg-slate-900 p-4 space-y-4">
          <Link href="/" className="block text-slate-400 hover:text-white">
            Home
          </Link>
          {user?.role === 'admin' && (
            <Link href="/admin" className="block text-slate-400 hover:text-white">
              Dashboard Admin
            </Link>
          )}
          {user?.role === 'user' && (
            <Link href="/dashboard" className="block text-slate-400 hover:text-white">
              My Dashboard
            </Link>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <div className="space-y-2">
              <Link
                href="/auth/signin"
                className="block px-4 py-2 text-center rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="block px-4 py-2 text-center rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )} */}
    </header>
  );
}
