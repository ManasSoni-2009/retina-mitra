'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sound } from '@/lib/sound';
import { THEMES, THEME_KEYS, getStoredTheme, applyTheme } from '@/lib/themes';
import {
  Home,
  Crosshair,
  Clock,
  BarChart3,
  Settings,
  Activity,
  UserCheck,
  Menu,
  X,
  PlusCircle,
} from 'lucide-react';

export function NavigationDock() {
  const pathname = usePathname();
  const [currentTheme, setCurrentTheme] = useState('default');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const initialTheme = getStoredTheme();
    setCurrentTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const handleCycleTheme = () => {
    sound.playClick(600);
    const currentIndex = THEME_KEYS.indexOf(currentTheme);
    const nextTheme = THEME_KEYS[(currentIndex + 1) % THEME_KEYS.length];
    setCurrentTheme(nextTheme);
    applyTheme(nextTheme);
  };

  // Navigation routes matching user requirements & attached screenshot
  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Screening', href: '/screening/new', icon: Crosshair },
    { label: 'Cockpit', href: '/dashboard', icon: Activity },
    { label: 'Review', href: '/review', icon: UserCheck },
    { label: 'History', href: '/history', icon: Clock },
    { label: 'Insights', href: '/insights', icon: BarChart3 },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* ─── FLOATING HIGH-VISIBILITY TACTILE ISLAND ─── */}
      <header className="fixed top-4 left-0 right-0 z-[9990] pointer-events-none px-3 sm:px-6">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-3">
          
          {/* Brand Mark Pill */}
          <Link
            href="/"
            onClick={() => sound.playClick(720)}
            className="pointer-events-auto group flex items-center gap-1.5 px-4 py-2 rounded-full border-[2.5px] border-[var(--ink)] ring-1 ring-white/70 bg-[var(--paper)] text-[var(--ink)] font-extrabold text-lg sm:text-xl tracking-[-0.03em] shadow-[0_6px_20px_rgba(0,0,0,0.18),4px_4px_0_var(--ink)] hover:scale-105 active:scale-95 transition-all no-underline"
            data-cursor-label="HOME"
          >
            <span>retina-mitra</span>
            <span className="group-hover:rotate-45 transition-transform duration-300">*</span>
            <span className="hidden xl:inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full text-[9px] font-mono tracking-widest uppercase bg-[var(--ink)] text-[var(--accent)] ring-1 ring-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--ok)] animate-pulse" />
              CLINICAL AI
            </span>
          </Link>

          {/* Central High-Visibility Navigation Dock */}
          <nav className="pointer-events-auto hidden lg:flex items-center gap-1 p-1.5 rounded-full border-[2.5px] border-[var(--ink)] ring-1 ring-white/70 bg-[var(--paper)] shadow-[0_8px_30px_rgba(0,0,0,0.2),4px_4px_0_var(--ink)] backdrop-blur-md">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => sound.playClick(650)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all no-underline ${
                    isActive
                      ? 'bg-[var(--ink)] text-[var(--accent)] ring-1 ring-white/40 shadow-sm scale-102 font-extrabold'
                      : 'text-[var(--ink)] hover:bg-[var(--ink)]/10'
                  }`}
                  data-cursor-label={item.label.toUpperCase()}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Controls: Theme Cycler, Sound Mute, High-Visibility Intake CTA */}
          <div className="pointer-events-auto flex items-center gap-2">
            {/* Theme Switcher Pill */}
            <button
              type="button"
              onClick={handleCycleTheme}
              className="flex items-center gap-2 px-3 py-2 rounded-full border-[2px] border-[var(--ink)] ring-1 ring-white/70 bg-[var(--paper)] text-[var(--ink)] text-[11px] font-mono tracking-wider uppercase shadow-[0_4px_14px_rgba(0,0,0,0.15),3px_3px_0_var(--ink)] hover:scale-105 active:scale-95 transition-transform"
              title={`Theme: ${THEMES[currentTheme]?.name}. Click to switch theme.`}
              data-cursor-label="THEME"
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-[var(--ink)]"
                style={{ backgroundColor: THEMES[currentTheme]?.bg }}
              />
              <span className="hidden sm:inline font-bold">{THEMES[currentTheme]?.name}</span>
            </button>

            {/* Mobile Scan Button (Quick thumb access on mobile) */}
            <Link
              href="/screening/new"
              onClick={() => sound.playClick(900)}
              className="inline-flex md:hidden items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--accent)] text-[var(--ink)] border-[2px] border-[var(--ink)] font-black text-[11px] uppercase shadow-[2px_2px_0_var(--ink)] active:scale-95 transition-all no-underline"
              data-cursor-label="SCAN"
            >
              <PlusCircle className="w-3 h-3 text-[var(--ink)]" />
              <span>Intake</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full border-[2px] border-[var(--ink)] ring-1 ring-white/70 bg-[var(--paper)] text-[var(--ink)] shadow-[0_4px_14px_rgba(0,0,0,0.15),3px_3px_0_var(--ink)] active:scale-95 transition-transform"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* High-Visibility Quick Intake CTA (Desktop) */}
            <Link
              href="/screening/new"
              onClick={() => sound.playClick(900)}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--accent)] text-[var(--ink)] border-[2.5px] border-[var(--ink)] ring-2 ring-white/80 font-black text-xs uppercase shadow-[0_6px_20px_rgba(0,0,0,0.22),3px_3px_0_var(--ink)] hover:scale-105 active:scale-95 hover:bg-white transition-all no-underline"
              data-cursor-label="SCAN"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[var(--ink)]" />
              <span>Intake</span>
            </Link>
          </div>
        </div>

        {/* ─── MOBILE DRAWER (ALWAYS VISIBLE & HIGH-CONTRAST WITH BACKDROP) ─── */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay: tapping outside closes menu */}
            <div
              className="pointer-events-auto fixed inset-0 bg-black/50 backdrop-blur-xs z-[-1] animate-in fade-in duration-200"
              onClick={() => setMobileMenuOpen(false)}
            />

            <div className="pointer-events-auto lg:hidden mt-3 max-w-sm mx-auto p-4 rounded-3xl border-[2.5px] border-[var(--ink)] ring-1 ring-white/70 bg-[var(--paper)] shadow-[0_12px_36px_rgba(0,0,0,0.3),6px_6px_0_var(--ink)] flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="flex justify-between items-center px-2 pb-2 border-b border-[var(--ink)]/15 font-mono text-[10px] uppercase font-bold text-[var(--ink-mute)]">
                <span>Navigation Menu</span>
                <span className="text-[var(--ink)] font-extrabold">{THEMES[currentTheme]?.name} Theme</span>
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      sound.playClick();
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold no-underline transition-all ${
                      isActive
                        ? 'bg-[var(--ink)] text-[var(--accent)] ring-1 ring-white/40 shadow-sm'
                        : 'text-[var(--ink)] hover:bg-[var(--ink)]/10 active:scale-98'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="pt-2 border-t border-[var(--ink)]/15">
                <Link
                  href="/screening/new"
                  onClick={() => {
                    sound.playClick(900);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[var(--ink)] text-[var(--accent)] font-extrabold text-xs uppercase tracking-wider no-underline shadow-[3px_3px_0_var(--ink)] active:scale-95 transition-transform"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Start New Retinal Scan</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </header>

      {/* ─── FLOATING MOBILE BOTTOM THUMB BAR (EFFORTLESS 1-HAND NAVIGATION) ─── */}
      <nav
        aria-label="Mobile quick actions"
        className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[9985] flex items-center gap-1.5 p-1.5 rounded-full border-[2.5px] border-[var(--ink)] ring-1 ring-white/70 bg-[var(--paper)] shadow-[0_10px_30px_rgba(0,0,0,0.3),4px_4px_0_var(--ink)] backdrop-blur-md max-w-[calc(100vw-2rem)] select-none"
      >
        <Link
          href="/"
          onClick={() => sound.playClick(650)}
          className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs font-bold transition-all no-underline ${
            pathname === '/'
              ? 'bg-[var(--ink)] text-[var(--accent)] font-extrabold'
              : 'text-[var(--ink)] hover:bg-[var(--ink)]/10'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="hidden xs:inline">Home</span>
        </Link>

        <Link
          href="/dashboard"
          onClick={() => sound.playClick(650)}
          className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs font-bold transition-all no-underline ${
            pathname === '/dashboard'
              ? 'bg-[var(--ink)] text-[var(--accent)] font-extrabold'
              : 'text-[var(--ink)] hover:bg-[var(--ink)]/10'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span className="hidden xs:inline">Cockpit</span>
        </Link>

        <Link
          href="/screening/new"
          onClick={() => sound.playClick(900)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black uppercase transition-all no-underline shadow-sm ${
            pathname === '/screening/new'
              ? 'bg-[var(--ink)] text-[var(--accent)] border border-[var(--accent)] ring-1 ring-white/40'
              : 'bg-[var(--accent)] text-[var(--ink)] border border-[var(--ink)]'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Intake</span>
        </Link>

        <Link
          href="/review"
          onClick={() => sound.playClick(650)}
          className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs font-bold transition-all no-underline ${
            pathname === '/review'
              ? 'bg-[var(--ink)] text-[var(--accent)] font-extrabold'
              : 'text-[var(--ink)] hover:bg-[var(--ink)]/10'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span className="hidden xs:inline">Review</span>
        </Link>
      </nav>
    </>
  );
}
