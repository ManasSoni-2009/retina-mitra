'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Eye, Menu, X, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Screening', href: '/screening/new' },
    { name: 'History', href: '/history' },
    { name: 'Insights', href: '/insights' },
    { name: 'Settings', href: '/settings' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gradient-to-r from-[#0B1728]/95 via-[#10213E]/92 to-[#0B1728]/95 backdrop-blur-2xl shadow-2xl border-b border-slate-200'
          : 'bg-gradient-to-r from-[#0B1728]/90 via-[#10213E]/85 to-[#0B1728]/90 backdrop-blur-xl border-b border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-2xl bg-gradient-to-br from-[#10213E] via-[#3C5880]/40 to-[#0B1728] border border-slate-200 text-[#2563EB] shadow-lg shadow-[#0B1728]/40 group-hover:scale-105 transition-all">
                <Eye className="w-5 h-5 text-[#2563EB]" />
                <div className="absolute inset-0 rounded-2xl border border-slate-200 animate-pulse" />
              </div>
              <span className="font-black text-xl tracking-tight text-[#FFFFFF]">
                RETINA<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#FFFFFF] to-[#059669]">-MITRA</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-xs font-black tracking-wide transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#2563EB] via-[#E3D7C1] to-[#C4B498] text-[#0B1728] shadow-lg shadow-[#2563EB]/25 scale-103 border border-slate-200/80'
                      : 'text-slate-300 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex md:items-center">
            {user && (
              <div className="flex items-center gap-2.5 pl-4 border-l border-[#3C5880]/60 ml-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FFFFFF]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#10213E] to-[#0B1728] flex items-center justify-center border border-slate-200 text-[#2563EB] shadow-md">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden lg:inline-block font-bold text-[#FFFFFF]">{user.displayName}</span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#FFFFFF]/70 hover:text-[#FFFFFF] hover:bg-white/10 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-[#0B1728]/98 to-[#10213E]/98 backdrop-blur-2xl border-b border-slate-200 px-4 pt-2 pb-4 space-y-1.5 shadow-2xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#2563EB] to-[#FFFFFF] text-[#0B1728]'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
