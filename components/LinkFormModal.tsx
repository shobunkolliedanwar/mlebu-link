'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Info } from 'lucide-react';
import toast from 'react-hot-toast';

import { Link as LinkType, LinkCategory } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface LinkFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<LinkType>) => Promise<void>;
  initialData?: LinkType;
  categories: LinkCategory[];
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
  categories,
  isLoading = false,
}: LinkFormModalProps) {
  const [formData, setFormData] = useState(defaultFormData);
  const [uploading, setUploading] = useState(false);
  const [showFilemoonInfo, setShowFilemoonInfo] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setFormData({
      title: initialData?.title ?? '',
      url: initialData?.url ?? '',
      description: initialData?.description ?? '',
      category: initialData?.category ?? '',
      tags: initialData?.tags?.join(', ') ?? '',
      thumbnail_url: initialData?.thumbnail_url ?? '',
    });
  }, [initialData, isOpen]);

  const updateField = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.url.trim() ||
      !formData.category.trim()
    ) {
      toast.error(
        'Title, URL dan Category wajib diisi'
      );
      return;
    }

    try {
      new URL(formData.url);
    } catch {
      toast.error('URL tidak valid');
      return;
    }

    const payload: Partial<LinkType> = {
      title: formData.title,
      url: formData.url,
      description: formData.description,
      category: formData.category,
      thumbnail_url: formData.thumbnail_url,

      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    await onSubmit(payload);

    resetForm();
    onClose();
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    try {
      const uploadData = new FormData();

      uploadData.append('file', file);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error(
          'Session tidak ditemukan'
        );
      }

      const response = await fetch(
        '/api/upload',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: uploadData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      updateField(
        'thumbnail_url',
        data.url
      );

      toast.success(
        'Thumbnail berhasil diupload'
      );
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
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="relative z-10 w-full max-w-xl mx-4 bg-slate-900 border border-slate-700 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
      >

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-800"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {initialData
            ? 'Edit Link'
            : 'Add New Link'}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* TITLE */}

          <div>
            <label className="block mb-2 text-sm font-medium">
              Title *
            </label>

            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                updateField(
                  'title',
                  e.target.value
                )
              }
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3"
              placeholder="Contoh: Anime Action Episode 1"
            />
          </div>

          {/* URL dengan Info Filemoon */}

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-medium">
                URL *
              </label>
              <button
                type="button"
                onClick={() => setShowFilemoonInfo(!showFilemoonInfo)}
                className="p-1 rounded hover:bg-slate-800 transition"
                title="Lihat info Filemoon"
              >
                <Info size={18} className="text-indigo-400" />
              </button>
            </div>

            {/* Filemoon Info Box */}
            {showFilemoonInfo && (
              <div className="bg-indigo-900/30 border border-indigo-700 rounded-lg p-3 mb-3 text-sm text-indigo-100">
                <p className="font-semibold mb-2">📽️ Format Filemoon:</p>
                <p className="mb-2">
                  ✅ <code className="bg-slate-800 px-1 rounded">https://filemoon.sx/e/VIDEO_ID</code> (Recommended)
                </p>
                <p className="mb-2">
                  ✅ <code className="bg-slate-800 px-1 rounded">https://filemoon.sx/v/VIDEO_ID</code>
                </p>
                <p className="text-red-300">
                  ❌ Jangan gunakan format <code className="bg-slate-800 px-1 rounded">/d/</code> (download)
                </p>
              </div>
            )}

            <input
              type="url"
              value={formData.url}
              onChange={(e) =>
                updateField(
                  'url',
                  e.target.value
                )
              }
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3"
              placeholder="https://filemoon.sx/e/abc123xyz"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="block mb-2 text-sm font-medium">
              Description
            </label>

            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                updateField(
                  'description',
                  e.target.value
                )
              }
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 resize-none"
              placeholder="Deskripsi video (akan ditampilkan di halaman)"
            />
          </div>

          {/* CATEGORY */}

          <div>
            <label className="block mb-2 text-sm font-medium">
              Category *
            </label>

            <select
              value={formData.category}
              onChange={(e) =>
                updateField(
                  'category',
                  e.target.value
                )
              }
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3"
            >
              <option value="">
                Select Category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.slug}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* TAGS */}

          <div>
            <label className="block mb-2 text-sm font-medium">
              Tags
            </label>

            <input
              type="text"
              placeholder="anime, movie, premium (pisahkan dengan koma)"
              value={formData.tags}
              onChange={(e) =>
                updateField(
                  'tags',
                  e.target.value
                )
              }
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3"
            />
          </div>

          {/* THUMBNAIL */}

          <div>

            <label className="block mb-2 text-sm font-medium">
              Thumbnail
            </label>

            {formData.thumbnail_url && (
              <img
                src={formData.thumbnail_url}
                alt="thumbnail"
                className="w-full h-40 rounded-lg object-cover mb-3"
              />
            )}

            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-700 rounded-lg p-4 cursor-pointer hover:border-indigo-500 transition">

              <Upload size={18} />

              <span>
                {uploading
                  ? 'Uploading...'
                  : 'Choose Image'}
              </span>

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileUpload}
                disabled={
                  uploading ||
                  isLoading
                }
              />

            </label>

          </div>

          {/* INFO BOX */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-xs text-slate-300">
            <p className="mb-1">💡 <strong>Tips:</strong></p>
            <p>• Video dari Filemoon akan ditampilkan langsung (embed)</p>
            <p>• URL lain akan di-redirect seperti biasa</p>
            <p>• Iklan tetap akan ditampilkan di halaman video</p>
          </div>

          {/* BUTTON */}

          <div className="flex gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg border border-slate-700 hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isLoading ||
                uploading
              }
              className="flex-1 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading
                ? 'Saving...'
                : initialData
                  ? 'Update Link'
                  : 'Save Link'}
            </button>

          </div>

        </form>

      </motion.div>

    </div>
  );
}
