import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '@/components/Header';

export default function NotFound() {
  const router = useRouter();
  const { asPath } = router;

  return (
    <div className="min-h-screen bg-white dark:bg-[#191919]">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-doc-deep-blue to-blue-500 bg-clip-text text-transparent">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            Sorry, the page <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{asPath}</span> you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Home
            </Link>
            <button 
              onClick={() => router.back()}
              className="px-6 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
