import React from 'react';
import '@/styles/globals.css';
import '@/styles/onchainkit.css';
import type { AppProps } from 'next/app';
import { Providers } from '../providers';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}
