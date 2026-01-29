'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  // Initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Handle navigation between pages
  useEffect(() => {
    // Show loader when pathname changes (navigation starts)
    setIsNavigating(true);

    // Hide loader after navigation completes
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 600);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);

  // Show loader immediately when any internal link is clicked
  useEffect(() => {
    const handleLinkClick = (e) => {
      const target = e.target.closest('a');
      if (target && target.href) {
        const url = new URL(target.href);
        // Only show loader for internal navigation (same origin)
        if (url.origin === window.location.origin && url.pathname !== pathname) {
          setIsNavigating(true);
        }
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, [pathname]);

  // Show loader on initial load or during navigation
  const showLoader = loading || isNavigating;

  if (!showLoader) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes rotate-border {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .rotating-border {
          animation: rotate-border 2s linear infinite;
        }
      `}} />
      <div
        className="fixed inset-0 z-[9999] bg-noir flex flex-col items-center justify-center"
        style={{ 
          opacity: showLoader ? 1 : 0,
          transition: 'opacity 0.3s ease-out',
          pointerEvents: showLoader ? 'auto' : 'none'
        }}
      >
        {/* Simple static logo with rotating border */}
        <div className="relative mb-6 flex items-center justify-center w-36 h-36 sm:w-40 sm:h-40">
          {/* Rotating border - outer circle */}
          <div 
            className="absolute rounded-full rotating-border"
            style={{
              width: '144px',
              height: '144px',
              padding: '6px',
              background: 'conic-gradient(from 0deg, #e4a0a0 0%, #d4a574 33%, #faf5f0 66%, #e4a0a0 100%)',
            }}
          >
            {/* Inner circle to create border effect */}
            <div className="w-full h-full rounded-full bg-noir"></div>
          </div>
          
          {/* Logo - centered on top */}
          <div className="relative z-10 rounded-full overflow-hidden w-32 h-32 sm:w-36 sm:h-36">
            <Image
              src="/logo.svg"
              alt="Cocoa&Cherry Logo"
              width={144}
              height={144}
              priority
              className="w-full h-full rounded-full"
            />
          </div>
        </div>

        {/* Brand name - static */}
        <div className="text-center">
          <h1 
            className="text-2xl sm:text-3xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            <span className="text-gold">Cocoa</span>
            <span className="text-rose">&</span>
            <span className="text-gold">Cherry</span>
          </h1>
          <p className="text-cream-muted text-xs sm:text-sm tracking-widest uppercase">
            Premium Home Bakery
          </p>
        </div>
      </div>
    </>
  );
}
