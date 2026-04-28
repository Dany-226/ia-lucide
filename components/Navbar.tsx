'use client';

import Link from 'next/link';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'Articles', href: '/#articles' },
  { label: 'Newsletter', href: '/newsletter/' },
  { label: 'Métiers', href: '/metiers' },
  { label: 'À propos', href: '/about' },
  { label: 'Ressources', href: '/ressources' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fcf9f0]/80 backdrop-blur-[12px] border-b border-[#c9a84c]/20">
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-black.png" alt="iALucide" style={{ height: '48px', width: 'auto' }} />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[10px] tracking-[0.3em] uppercase text-[#0e0e0e] hover:text-[#c9a84c] transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[#0e0e0e] p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {mobileOpen ? (
              <>
                <line x1="3" y1="3" x2="19" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="19" y1="3" x2="3" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="19" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="3" y1="16" x2="19" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#fcf9f0]/95 border-t border-[#c9a84c]/20 px-5 pb-6 pt-4 space-y-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-[10px] tracking-[0.3em] uppercase text-[#0e0e0e] hover:text-[#c9a84c] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
