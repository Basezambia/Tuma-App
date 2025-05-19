import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile";
// Wagmi hooks
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { toast } from "sonner";
// Import Connect button from OnchainKit
import { coinbaseWallet } from '@wagmi/connectors';
// Coinbase Wallet Connect Button
function CoinbaseWalletButton() {
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();
  // Instantiate the connector directly
  const connector = coinbaseWallet({
    appName: 'TUMA',
    // Optionally, add jsonRpcUrl or infuraId if needed for your chain
  });

  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Disconnect ({address?.slice(0, 6)}...{address?.slice(-4)})
      </button>
    );
  }

  return (
    <button
      onClick={() => connect({ connector })}
      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
    >
      Connect Coinbase Wallet
    </button>
  );
}

import { Toggle } from "../components/ui/toggle";
import { useTheme } from "../hooks/use-theme";
import { base } from 'viem/chains';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);
  const router = useRouter();
  const { pathname } = router;
  const { isConnected } = useAccount();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setShowHeader(true);
      } else {
        setShowHeader(false);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-transform duration-300 ${showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} bg-white dark:bg-[#191919]`}
    >
      <div className={`${pathname === '/landing' ? 'bg-transparent border-none shadow-none backdrop-blur-none' : 'backdrop-blur-xl bg-white/40 dark:bg-[#191919] border border-white/20 dark:border-[#232323] shadow-lg'} rounded-xl mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 transition-all duration-300 ${pathname !== '/landing' ? 'hover:bg-white/50 dark:hover:bg-[#232323]/90' : ''}`}>
        <div className="flex items-center">
          <Link href="/send" className="text-xl font-bold bg-gradient-to-r from-doc-deep-blue to-blue-500 bg-clip-text text-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 rounded transition-colors duration-200">
            TUMA
          </Link>
        </div>

        {isConnected ? (
          isMobile ? (
            <button 
              onClick={toggleMenu} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          ) : (
            <nav className="hidden md:flex items-center space-x-1">
              {[{ name: 'Send', path: '/send' }, { name: 'Documents', path: '/documents' }, { name: 'Profile', path: '/profile' }, { name: 'About', path: '/about' }]
                .filter(link => link.path !== pathname)
                .map(link => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={pathname === link.path ? "nav-link active" : "nav-link"}
                  >
                    {link.name}
                  </Link>
                ))}
              <div className="ml-6 z-50">
                <CoinbaseWalletButton />
              </div>
              <div style={{ marginLeft: '1.5rem' }}>
                <div className="relative group">
                  <Toggle 
                    aria-label="Dark mode coming soon"
                    className="p-2 rounded-full cursor-not-allowed opacity-70"
                    pressed={false}
                    onPressedChange={() => toast.info("Dark mode coming soon!")}
                  >
                    <Sun size={20} />
                  </Toggle>
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                    Coming Soon
                  </div>
                </div>
              </div>
            </nav>
          )
        ) : (
          <CoinbaseWalletButton />
        )}
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobile && isMenuOpen && (
        <div className="backdrop-blur-xl bg-white/40 dark:bg-[#191919] border border-white/20 dark:border-[#232323] shadow-lg md:hidden mt-2 py-4 px-2 rounded-xl animate-scale-in">
          <nav className="flex flex-col space-y-3">
            {[{ name: 'Send', path: '/send' }, { name: 'Documents', path: '/documents' }, { name: 'Profile', path: '/profile' }, { name: 'About', path: '/about' }]
              .filter(link => link.path !== pathname)
              .map(link => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={pathname === link.path ? "nav-link active" : "nav-link"}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            <div className="pt-2 flex items-center justify-between">
              {/* Render ConnectButton on mobile */}
              {isMobile && (
                <CoinbaseWalletButton />
              )}
              <div className="relative group">
                <Toggle 
                  aria-label="Dark mode coming soon"
                  className="p-2 rounded-full cursor-not-allowed opacity-70"
                  pressed={false}
                  onPressedChange={() => toast.info("Dark mode coming soon!")}
                >
                  <Sun size={18} />
                </Toggle>
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                  Coming Soon
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
