'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Adsterra from '@/components/Adsterra';

export default function GoPage() {
    const { id } = useParams<{ id: string }>();
    const [url, setUrl] = useState('');
    const [count, setCount] = useState(3);

    useEffect(() => {
        const run = async () => {
            const res = await fetch(`/api/links/${id}/redirect`);
            const data = await res.json();

            setUrl(data.url);
        };

        run();
    }, [id]);

    useEffect(() => {
        const t = setInterval(() => {
            setCount((c) => c - 1);
        }, 1000);

        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        if (count <= 0 && url) {
            window.location.href = url;
        }
    }, [count, url]);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">

            <h1 className="text-2xl font-bold mb-4">
                Redirecting...
            </h1>

            <p className="mb-10">Please wait...</p>

            {/* bikin page “hidup” */}
            <div className="h-[200vh]" />

            <Adsterra />
        </main>
    );
}