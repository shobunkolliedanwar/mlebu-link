'use client';

import { useEffect } from 'react';

export default function Adsterra() {
    useEffect(() => {
        const script = document.createElement('script');

        script.src =
            'https://pl123456.highratecpm.com/xxxxx/invoke.js';

        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div id="container-xxxxx" />
    );
}