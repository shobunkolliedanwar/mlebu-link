'use client';

import { useEffect } from 'react';

export default function Adsterra() {
    useEffect(() => {
        console.log('ADS SCRIPT LOADED');
        const script = document.createElement('script');
        script.src =
            'https://pl29644320.effectivecpmnetwork.com/68/d6/46/68d646480ec953570dd0c76a6f750526.js';
        script.async = true;
        script.setAttribute('data-cfasync', 'false');

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return null;
}