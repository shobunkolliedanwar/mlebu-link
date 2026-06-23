'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { Search } from 'lucide-react';

import {
  Header,
  Footer,
  LinkCard,
  LinkGridSkeleton,
} from '@/components';

import {
  Link as LinkType,
  LinkCategory,
} from '@/lib/types';

export default function HomePage() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [categories, setCategories] = useState<LinkCategory[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /**
   * Fetch Categories
   */
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');

      const data = await response.json();

      setCategories(data.data || []);
    } catch (error) {
      console.error(
        'Error fetching categories:',
        error
      );
    }
  };

  /**
   * Fetch Links
   */
  const fetchLinks = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',

        ...(search && {
          search,
        }),

        ...(category && {
          category,
        }),
      });

      const response = await fetch(
        `/api/links?${params}`
      );

      const data = await response.json();

      setLinks(data.data || []);

      setTotalPages(
        data.pagination?.pages || 1
      );
    } catch (error) {
      console.error(
        'Error fetching links:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch categories once
   */
  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * Fetch links
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLinks();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category, page]);

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col">

      <Header />

      <Script
        src="https://pl29644320.effectivecpmnetwork.com/68/d6/46/68d646480ec953570dd0c76a6f750526.js"
        strategy="afterInteractive"
      />

      <section className="container py-8">

        {/* SEARCH */}

        <div className="space-y-5 mb-8">

          <div className="relative">

            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={20}
            />

            <input
              type="text"
              value={search}
              placeholder="Search links..."
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="
                w-full
                pl-12
                pr-4
                py-3
                rounded-xl
                bg-slate-800
                border
                border-slate-700
                focus:border-indigo-500
                focus:ring-1
                focus:ring-indigo-500
                outline-none
              "
            />

          </div>

          {/* CATEGORY */}

          <div className="flex gap-2 overflow-x-auto pb-2">

            {/* ALL */}

            <button
              onClick={() => {
                setCategory('');
                setPage(1);
              }}
              className={`
                px-4 py-2 rounded-lg whitespace-nowrap transition-all

                ${category === ''
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }
              `}
            >
              Semua
            </button>

            {/* DYNAMIC CATEGORY */}

            {categories.map((cat) => (

              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.slug);
                  setPage(1);
                }}
                className={`
                  px-4 py-2 rounded-lg whitespace-nowrap transition-all

                  ${category === cat.slug
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }
                `}
              >
                {cat.name}
              </button>

            ))}

          </div>

        </div>

        {/* LINKS */}

        {loading ? (

          <LinkGridSkeleton count={20} />

        ) : links.length > 0 ? (

          <>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">

              {links.map((link) => (

                <LinkCard
                  key={link.id}
                  link={link}
                />

              ))}

            </div>

            {/* PAGINATION */}

            {totalPages > 1 && (

              <div className="flex items-center justify-center gap-4">

                <button
                  onClick={() =>
                    setPage((prev) =>
                      Math.max(1, prev - 1)
                    )
                  }
                  disabled={page === 1}
                  className="
                    px-4 py-2
                    rounded-lg
                    bg-slate-800
                    hover:bg-slate-700
                    disabled:opacity-50
                  "
                >
                  Previous
                </button>

                <span className="text-slate-400">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setPage((prev) =>
                      Math.min(
                        totalPages,
                        prev + 1
                      )
                    )
                  }
                  disabled={
                    page === totalPages
                  }
                  className="
                    px-4 py-2
                    rounded-lg
                    bg-slate-800
                    hover:bg-slate-700
                    disabled:opacity-50
                  "
                >
                  Next
                </button>

              </div>

            )}

          </>

        ) : (

          <div className="text-center py-20">

            <p className="text-slate-400 text-lg">
              Tidak ada link ditemukan
            </p>

          </div>

        )}

      </section>

      <Footer />

    </main>
  );
}