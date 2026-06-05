'use client';

import { useEffect, useState } from 'react';
import { Header, Footer, LinkCard, LinkGridSkeleton } from '@/components';
import { Link as LinkType } from '@/lib/types';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    'All',
    'Design',
    'Development',
    'Productivity',
    'Learning',
    'Entertainment',
    'Other',
  ];

  useEffect(() => {
    const fetchLinks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '20',
          ...(search && { search }),
          ...(category && category !== 'All' && { category }),
        });

        const response = await fetch(`/api/links?${params}`);
        const data = await response.json();

        setLinks(data.data);
        setTotalPages(data.pagination.pages);
      } catch (error) {
        console.error('Error fetching links:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchLinks();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category, page]);

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col">
      <Header />

      {/* Search & Filter */}
      <section className="container py-8">
        <div className="space-y-4 mb-8">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search links..."
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  category === cat || (cat === 'All' && !category)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Links Grid */}
        {loading ? (
          <LinkGridSkeleton count={20} />
        ) : links.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {links.map((link) => (
                <LinkCard key={link.id} link={link} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex gap-2 justify-center items-center">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <span className="text-slate-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">Tidak ada link ditemukan</p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
