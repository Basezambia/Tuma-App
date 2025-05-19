'use client';

import { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { WagmiProvider } from 'wagmi';
import { config } from './lib/wagmi';
import { base } from 'viem/chains';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <OnchainKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || ''}
        projectId={process.env.NEXT_PUBLIC_PRODUCT_ID || ''}
        chain={base}
        config={{
          appearance: {
            name: 'TUMA',
            logo: '/logo.png',
            mode: 'auto',
            theme: 'default',
          },
          wallet: {
            display: 'modal',
            termsUrl: 'https://your-terms-url.com',
            privacyUrl: 'https://your-privacy-url.com',
            supportedWallets: {
              rabby: true,
              trust: true,
              frame: true,
            },
          },
        }}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster position="top-right" />
          {children}
        </ThemeProvider>
      </OnchainKitProvider>
    </WagmiProvider>
  );
}
