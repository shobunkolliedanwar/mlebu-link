'use client';

import { Link as LinkType } from '@/lib/types';
import { X, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface LinkFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<LinkType>) => Promise<void>;
  initialData?: LinkType;
  isLoading?: boolean;
}

const defaultFormData = {
  title: '',
  url: '',
  description: '',
  category: '',
  tags: '',
  thumbnail_url: '',
};

export function LinkFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: LinkFormModalProps) {
  const [formData, setFormData] = useState(defaultFormData);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        url: initialData.url || '',
        description: initialData.description || '',
        category: initialData.category || '',
        tags: initialData.tags?.join(', ') || '',
        thumbnail_url: initialData.thumbnail_url || '',
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData]);

  console.log('formData.thumbnail_url', formData.thumbnail_url);

  const updateField = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.url.trim() ||
      !formData.category.trim()
    ) {
      toast.error('Title, URL, dan Category wajib diisi');
      return;
    }

    try {
      new URL(formData.url);
    } catch {
      toast.error('URL tidak valid');
      return;
    }

    const submitData: Partial<LinkType> = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    await onSubmit(submitData);

    setFormData(defaultFormData);
    onClose();
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error('Session tidak ditemukan');
        return;
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: uploadFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setFormData((prev) => ({
        ...prev,
        thumbnail_url: data.url,
      }));

      toast.success('Gambar berhasil diupload');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Upload gagal'
      );
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md mx-4 bg-slate-900 border border-slate-700 rounded-lg p-6"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-6">
          {initialData ? 'Edit Link' : 'Add New Link'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                updateField('title', e.target.value)
              }
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              URL *
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) =>
                updateField('url', e.target.value)
              }
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                updateField('description', e.target.value)
              }
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                updateField('category', e.target.value)
              }
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              disabled={isLoading}
            >
              <option value="">Select Category</option>
              <option value="Tobrut">Tobrut</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) =>
                updateField('tags', e.target.value)
              }
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="design, ui, free"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Thumbnail
            </label>

            <div className="space-y-2">
              {formData.thumbnail_url && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden">
                  <img
                    src={formData.thumbnail_url}
                    alt="Thumbnail Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <label className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-slate-700 hover:border-indigo-500 cursor-pointer transition-colors">
                <Upload size={18} />
                <span>
                  {uploading
                    ? 'Uploading...'
                    : 'Choose Image'}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading || isLoading}
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || uploading}
              className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 font-medium"
            >
              {isLoading ? 'Saving...' : 'Save Link'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}