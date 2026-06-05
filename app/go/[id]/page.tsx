'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Adsterra from '@/components/Adsterra';

export default function GoPage() {
    const params = useParams();

    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (countdown <= 0) {
            fetch(`/api/links/${params.id}/redirect`)
                .then((res) => res.json())
                .then((data) => {
                    window.location.href = data.url;
                });
        }
    }, [countdown, params.id]);

    return (
        <main className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="max-w-xl w-full p-6">

                <h1 className="text-3xl font-bold text-center mb-4">
                    Please Wait
                </h1>

                <p className="text-center mb-8">
                    Redirecting in {countdown} seconds
                </p>

                <Adsterra />

            </div>
        </main>
    );
}