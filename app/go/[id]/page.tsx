'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdsterraNative from '@/components/AdsterraNative';

type LinkData = {
    id: string;
    title: string;
    url: string;
};

export default function GoPage() {
    const { id } = useParams<{ id: string }>();

    const [link, setLink] = useState<LinkData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [count, setCount] = useState(8);
    const [ready, setReady] = useState(false);
    const [adsReady, setAdsReady] = useState(false);

    // =========================
    // FETCH LINK + TRACKING
    // =========================
    useEffect(() => {
        const run = async () => {
            try {
                setLoading(true);

                const res = await fetch(`/api/links/${id}/redirect`);
                if (!res.ok) throw new Error('Failed to load link');

                const data = await res.json();

                setLink(data);
                setReady(true);

                // track go page view (important for analytics)
                await fetch(`/api/links/${id}/track-go`, {
                    method: 'POST',
                });

                // slight delay for ads readiness (boost CPM viewability)
                setTimeout(() => {
                    setLoading(false);
                    setAdsReady(true);
                }, 800);
            } catch (err) {
                setError('Unable to load redirect link');
                setLoading(false);
            }
        };

        if (id) run();
    }, [id]);

    // =========================
    // TIMER (SAFE VERSION)
    // =========================
    useEffect(() => {
        if (!ready) return;
        if (count <= 0) return;

        const interval = setInterval(() => {
            setCount((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [ready]);

    // =========================
    // AUTO REDIRECT
    // =========================
    useEffect(() => {
        if (count === 0 && link?.url) {
            window.location.href = link.url;
        }
    }, [count, link]);

    // =========================
    // ERROR STATE
    // =========================
    if (error) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <p className="text-red-400">{error}</p>
            </main>
        );
    }

    if (!link && !loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <p>Link not found</p>
            </main>
        );
    }

    // =========================
    // UI
    // =========================
    return (
        <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">

            <div className="w-full max-w-xl text-center space-y-6">

                {/* TITLE */}
                <h1 className="text-2xl font-bold">
                    {link?.title || 'Loading link...'}
                </h1>

                <p className="text-slate-400">
                    Preparing your destination...
                </p>

                {/* ADS SLOT 1 (lazy loaded) */}
                {adsReady && (
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                        <AdsterraNative />
                    </div>
                )}

                {/* TIMER */}
                <div className="text-indigo-400 font-semibold text-lg">
                    Redirecting in {count} seconds
                </div>

                {/* ENGAGEMENT BLOCK (boost session time) */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-sm text-slate-400 space-y-2">
                    <p>🔒 Secure redirect system is verifying your request...</p>
                    <p>⚡ Please wait while we prepare your link.</p>
                    <p className="opacity-60">
                        This helps keep our service free.
                    </p>
                </div>

                {/* ADS SLOT 2 */}
                {adsReady && (
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                        <AdsterraNative />
                    </div>
                )}

                {/* CTA BUTTON */}
                <button
                    onClick={() => link?.url && (window.location.href = link.url)}
                    className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition font-medium"
                >
                    Continue Now
                </button>

                {/* SKIP */}
                <p
                    onClick={() => link?.url && (window.location.href = link.url)}
                    className="text-xs text-slate-500 cursor-pointer hover:text-slate-300"
                >
                    Skip countdown →
                </p>

            </div>

        </main>
    );
}