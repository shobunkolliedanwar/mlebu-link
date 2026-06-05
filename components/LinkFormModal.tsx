'use client';

import { Link as LinkType } from '@/lib/types';
import { X, Upload } from 'lucide-react';
import { useState } from 'react';
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

export function LinkFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: LinkFormModalProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    url: initialData?.url || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    tags: initialData?.tags?.join(', ') || '',
    thumbnail_url: initialData?.thumbnail_url || '',
  });

  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.url.trim() || !formData.category.trim()) {
      toast.error('Title, URL, dan Category wajib diisi');
      return;
    }

    try {
      new URL(formData.url);
    } catch {
      toast.error('URL tidak valid');
      return;
    }

    const submitData = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    await onSubmit(submitData);
    setFormData({
      title: '',
      url: '',
      description: '',
      category: '',
      tags: '',
      thumbnail_url: '',
    });
    onClose();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error('Session tidak ditemukan');
        return;
      }

      const token = session?.access_token;
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataUpload,
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
      toast.error(error instanceof Error ? error.message : 'Upload gagal');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md mx-4 bg-slate-900 border border-slate-700 rounded-lg p-6"
      >
        {/* Close Button */}
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
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g., Awesome Design Tool"
              disabled={isLoading}
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium mb-2">URL *</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, url: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="https://example.com"
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
              placeholder="Optional description"
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              disabled={isLoading}
            >
              <option value="">Select Category</option>
              <option value="Design">Design</option>
              <option value="Development">Development</option>
              <option value="Productivity">Productivity</option>
              <option value="Learning">Learning</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tags: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g., design, ui, free"
              disabled={isLoading}
            />
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Thumbnail</label>
            <div className="space-y-2">
              {formData.thumbnail_url && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden">
                  <img
                    src={formData.thumbnail_url}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <label className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-slate-700 hover:border-indigo-500 cursor-pointer transition-colors">
                <Upload size={18} />
                <span>Choose Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading || isLoading}
                  className="hidden"
                />
              </label>
              {uploading && <p className="text-sm text-slate-400">Uploading...</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || uploading}
              className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
            >
              {isLoading ? 'Saving...' : 'Save Link'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
