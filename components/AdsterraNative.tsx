'use client';

import { useEffect } from 'react';

export default function AdsterraNative() {
    useEffect(() => {
        const script = document.createElement('script');

        script.src =
            'https://pl29842100.effectivecpmnetwork.com/105df483a62082950e1917e959ac54bf/invoke.js';

        script.async = true;
        script.setAttribute('data-cfasync', 'false');

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div
            id="container-105df483a62082950e1917e959ac54bf"
            className="w-full flex justify-center"
        />
    );
}