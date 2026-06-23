'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => Promise<void>;
    isLoading?: boolean;
}

export function CategoryFormModal({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false,
}: CategoryFormModalProps) {
    const [name, setName] = useState('');

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Category wajib diisi');
            return;
        }

        await onSubmit(name);

        setName('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
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
                className="
          relative
          z-10
          w-full
          max-w-md
          mx-4
          p-6
          rounded-2xl
          border
          border-slate-700
          bg-slate-900
        "
            >

                <button
                    onClick={onClose}
                    className="
            absolute
            top-4
            right-4
            p-2
            rounded-lg
            hover:bg-slate-800
          "
                >
                    <X size={18} />
                </button>

                <h2 className="text-2xl font-bold mb-6">
                    Add Category
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>

                        <label className="block mb-2 text-sm">
                            Category Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="Anime"
                            className="
                w-full
                px-4
                py-3
                rounded-lg
                bg-slate-800
                border
                border-slate-700
                focus:border-indigo-500
                outline-none
              "
                        />

                    </div>

                    <div className="flex gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                flex-1
                py-3
                rounded-lg
                border
                border-slate-700
                hover:bg-slate-800
              "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="
                flex-1
                py-3
                rounded-lg
                bg-emerald-600
                hover:bg-emerald-700
                disabled:opacity-50
              "
                        >
                            {isLoading
                                ? 'Saving...'
                                : 'Save Category'}
                        </button>

                    </div>

                </form>

            </motion.div>

        </div>
    );
}