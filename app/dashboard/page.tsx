'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Footer, LinkCard, LinkGridSkeleton } from '@/components';
import { Link as LinkType, User } from '@/lib/types';
import { Heart, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      console.log('AUTH USER:', authUser);

      if (!authUser) {
        router.push('/auth/signin');
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (userData?.role === 'admin') {
        router.push('/admin');
        return;
      }

      setUser(userData);
      fetchLinks();
      loadFavorites();
    };

    checkAuth();
  }, [router]);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/links?limit=100');
      const data = await response.json();
      setLinks(data.data);
    } catch (error) {
      toast.error('Gagal mengambil data links');
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch {
        setFavorites([]);
      }
    }
  };

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id];

    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    toast.success(
      newFavorites.includes(id) ? 'Added to favorites' : 'Removed from favorites'
    );
  };

  const filteredLinks = links.filter((link) =>
    link.title.toLowerCase().includes(search.toLowerCase()) ||
    link.description?.toLowerCase().includes(search.toLowerCase())
  );

  const favoriteLinks = links.filter((link) => favorites.includes(link.id));

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col">
      <Header />

      {/* Main Content */}
      <div className="flex-1 container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.email}!</h1>
          <p className="text-slate-400">
            Explore dan simpan links favorit Anda
          </p>
        </div>

        {/* Favorites Section */}
        {favoriteLinks.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Heart className="text-red-500" size={24} />
              <h2 className="text-2xl font-bold">Favorites ({favoriteLinks.length})</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteLinks.map((link) => (
                <div key={link.id} className="relative">
                  <LinkCard link={link} />
                  <button
                    onClick={() => toggleFavorite(link.id)}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors z-10"
                  >
                    <Heart size={18} fill="white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Links Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">All Links</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search links..."
                className="w-full pl-12 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {loading ? (
            <LinkGridSkeleton count={20} />
          ) : filteredLinks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredLinks.map((link) => (
                <div key={link.id} className="relative">
                  <LinkCard link={link} />
                  <button
                    onClick={() => toggleFavorite(link.id)}
                    className={`absolute top-4 right-4 p-2 rounded-lg transition-colors z-10 ${
                      favorites.includes(link.id)
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    <Heart
                      size={18}
                      fill={favorites.includes(link.id) ? 'white' : 'none'}
                    />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">
                {search ? 'No links found' : 'No links yet'}
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
