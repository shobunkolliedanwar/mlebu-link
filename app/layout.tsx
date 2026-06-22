'use client';

import './globals.css';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Brutal Link - Share dan discover amazing links" />
        <title>Brutal Link - Link Directory</title>
      </head>
      <body>
        {children}
        <Toaster position="top-right" reverseOrder={false} />
        <Script
          src="https://pl29842099.effectivecpmnetwork.com/8b/ad/72/8bad7200134709af27645af0bb39f3de.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
