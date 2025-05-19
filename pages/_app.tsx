import React from 'react';
import '@/styles/globals.css';
import '@coinbase/onchainkit/styles.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { base } from 'viem/chains';
import { Providers } from '../providers';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Toaster position="top-right" />
        <Component {...pageProps} />
      </ThemeProvider>
    </Providers>
  );
}
