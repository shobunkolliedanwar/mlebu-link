'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Footer, LinkCard, LinkFormModal, LinkGridSkeleton } from '@/components';
import { Link as LinkType, User } from '@/lib/types';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.push('/auth/signin');
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (userData?.role !== 'admin') {
        toast.error('Akses ditolak');
        router.push('/');
        return;
      }

      setUser(userData);
      fetchLinks();
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

  const getAccessToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error('Session tidak ditemukan, silakan login ulang');
    }

    return session.access_token;
  };

  const handleCreateLink = async (formData: Partial<LinkType>) => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      const token = await getAccessToken();

      const response = await fetch('/api/links/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      toast.success('Link berhasil ditambahkan');
      setIsModalOpen(false);

      await fetchLinks();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Gagal menambahkan link'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLink = async (formData: Partial<LinkType>) => {
    if (!user || !editingLink) return;

    setIsSubmitting(true);

    try {
      const token = await getAccessToken();

      const response = await fetch(`/api/links/${editingLink.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      toast.success('Link berhasil diupdate');

      setIsModalOpen(false);
      setEditingLink(null);

      await fetchLinks();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Gagal mengupdate link'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Yakin ingin menghapus link ini?')) return;

    try {
      const token = await getAccessToken();

      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      toast.success('Link berhasil dihapus');

      await fetchLinks();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Gagal menghapus link'
      );
    }
  };

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col">
      <Header />

      {/* Main Content */}
      <div className="flex-1 container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">
              Kelola dan upload links untuk Brutal Link
            </p>
          </div>
          <button
            onClick={() => {
              setEditingLink(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors font-medium"
          >
            <Plus size={20} />
            Add New Link
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-lg border border-slate-700 bg-slate-900 p-6">
            <p className="text-slate-400 text-sm mb-2">Total Links</p>
            <p className="text-3xl font-bold">{links.length}</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900 p-6">
            <p className="text-slate-400 text-sm mb-2">Active Links</p>
            <p className="text-3xl font-bold">{links.filter((l) => l.is_active).length}</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900 p-6">
            <p className="text-slate-400 text-sm mb-2">Total Views</p>
            <p className="text-3xl font-bold">
              {links.reduce((sum, link) => sum + link.views, 0)}
            </p>
          </div>
        </div>

        {/* Links List */}
        {loading ? (
          <LinkGridSkeleton count={12} />
        ) : links.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {links.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                isAdmin={true}
                onDelete={handleDeleteLink}
                onEdit={(link) => {
                  setEditingLink(link);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">Belum ada links</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <Plus size={18} />
              Add Link Now
            </button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <LinkFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLink(null);
        }}
        initialData={editingLink || undefined}
        onSubmit={editingLink ? handleUpdateLink : handleCreateLink}
        isLoading={isSubmitting}
      />

      <Footer />
    </main>
  );
}
