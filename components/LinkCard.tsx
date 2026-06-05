'use client';

import { Link as LinkType } from '@/lib/types';
import { ExternalLink, Trash2, Edit2 } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface LinkCardProps {
  link: LinkType;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (link: LinkType) => void;
}

export function LinkCard({
  link,
  isAdmin = false,
  onDelete,
  onEdit,
}: LinkCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleOpenLink = async () => {
    try {
      await fetch(`/api/links/${link.id}`, {
        method: 'POST',
      });
    } catch (error) {
      console.error(error);
    }

    window.location.href = `/go/${link.id}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
      className="group card-hover overflow-hidden cursor-pointer h-full flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative h-40 bg-slate-800 rounded-lg overflow-hidden mb-4">
        {!imageError && link.thumbnail_url ? (
          <Image
            src={link.thumbnail_url}
            alt={link.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-pink-600">
            <span className="text-4xl text-white opacity-50">🔗</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
          {link.title}
        </h3>

        {link.description && (
          <p className="text-sm text-slate-400 mb-3 line-clamp-2">
            {link.description}
          </p>
        )}

        {link.tags && link.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {link.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-600/50"
              >
                {tag}
              </span>
            ))}
            {link.tags.length > 3 && (
              <span className="text-xs px-2 py-1 text-slate-400">
                +{link.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Category & Views */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4 mt-auto">
          <span className="px-2 py-1 rounded bg-slate-800">
            {link.category}
          </span>
          <span>👁️ {link.views}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleOpenLink}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            <ExternalLink size={16} />
            Open
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => onEdit?.(link)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                title="Edit"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => onDelete?.(link.id)}
                className="p-2 rounded-lg bg-red-900/30 hover:bg-red-900/50 transition-colors text-red-400"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
