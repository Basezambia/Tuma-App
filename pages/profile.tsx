import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import Header from '@/components/Header';

export default function Profile() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  
  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#191919]">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
          
          <div className="bg-white dark:bg-[#232323] rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Wallet Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Connected Address:</span> {address}</p>
            </div>
          </div>
          
          {/* Add more profile sections as needed */}
        </div>
      </main>
    </div>
  );
}
