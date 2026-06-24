'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdsterraNative from '@/components/AdsterraNative';

type LinkData = {
    id: string;
    title: string;
    url: string;
    description?: string;
};

// Helper function untuk extract video ID dari URL filemoon
const getFilemoonVideoId = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        // Filemoon URLs: https://filemoon.sx/e/VIDEOID atau https://filemoon.sx/v/VIDEOID
        const match = urlObj.pathname.match(/\/(e|v)\/([a-zA-Z0-9]+)/);
        return match ? match[2] : null;
    } catch {
        return null;
    }
};

// Helper function untuk check apakah URL adalah dari filemoon
const isFilemoonUrl = (url: string): boolean => {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.includes('filemoon') || urlObj.hostname.includes('streamfilemoon');
    } catch {
        return false;
    }
};

export default function GoPage() {
    const { id } = useParams<{ id: string }>();

    const [link, setLink] = useState<LinkData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFilemoon, setIsFilemoon] = useState(false);
    const [videoId, setVideoId] = useState<string | null>(null);

    const [count, setCount] = useState(3);
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
                
                // Check if URL is from filemoon
                const isFM = isFilemoonUrl(data.url);
                setIsFilemoon(isFM);
                
                if (isFM) {
                    const vid = getFilemoonVideoId(data.url);
                    setVideoId(vid);
                }

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
                setError('Unable to load video');
                setLoading(false);
            }
        };

        if (id) run();
    }, [id]);

    // =========================
    // TIMER (SAFE VERSION) - Only for non-filemoon links
    // =========================
    useEffect(() => {
        if (!ready || isFilemoon) return;
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
    }, [ready, isFilemoon]);

    // =========================
    // AUTO REDIRECT (only for non-filemoon)
    // =========================
    useEffect(() => {
        if (!isFilemoon && count === 0 && link?.url) {
            window.location.href = link.url;
        }
    }, [count, link, isFilemoon]);

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
    // FILEMOON EMBED VIEW
    // =========================
    if (isFilemoon && videoId && ready) {
        return (
            <main className="min-h-screen bg-slate-950 text-white px-4 py-8">
                <div className="w-full max-w-4xl mx-auto space-y-6">
                    {/* Title */}
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{link?.title}</h1>
                        {link?.description && (
                            <p className="text-slate-400">{link.description}</p>
                        )}
                    </div>

                    {/* ADS SLOT 1 */}
                    {adsReady && (
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                            <AdsterraNative />
                        </div>
                    )}

                    {/* Video Player */}
                    <div className="w-full bg-black rounded-lg overflow-hidden">
                        <iframe
                            src={`https://filemoon.sx/e/${videoId}?k=0`}
                            width="100%"
                            height="600"
                            frameBorder="0"
                            allowFullScreen
                            allow="fullscreen"
                            className="w-full"
                            style={{ minHeight: '600px' }}
                        ></iframe>
                    </div>

                    {/* ADS SLOT 2 */}
                    {adsReady && (
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                            <AdsterraNative />
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-sm text-slate-400 space-y-2">
                        <p>✅ Video sedang di-stream langsung dari server kami</p>
                        <p>⚡ Gunakan VPN jika video tidak bisa diakses di region Anda</p>
                    </div>
                </div>
            </main>
        );
    }

    // =========================
    // REDIRECT VIEW (for non-filemoon links)
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