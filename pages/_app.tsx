import React from 'react';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { WagmiProvider, createConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mainnet } from 'viem/chains';
import { http } from 'viem';
import { coinbaseWallet, injected } from 'wagmi/connectors';

// Configure wagmi
const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  connectors: [
    coinbaseWallet({ appName: 'Tuma App' }),
    injected(),
  ],
});

// Create a client for React Query
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster position="top-right" />
          <Component {...pageProps} />
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
