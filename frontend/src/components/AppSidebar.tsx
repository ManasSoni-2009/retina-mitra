'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Eye,
  Home,
  Crosshair,
  Clock,
  BarChart3,
  Settings,
  Menu,
  X
} from 'lucide-react';

export function AppSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Screening', href: '/screening/new', icon: Crosshair },
    { name: 'History', href: '/history', icon: Clock },
    { name: 'Insights', href: '/insights', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Hamburger Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0B1728] border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-md">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shadow-xs">
            <Eye className="w-4 h-4" />
          </div>
          <span className="font-black text-lg tracking-tight text-white">
            RETINA<span className="text-blue-400">-MITRA</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0B1728] text-white border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 95%, rgba(20, 184, 166, 0.22) 0%, transparent 60%), radial-gradient(circle at 90% 10%, rgba(59, 130, 246, 0.15) 0%, transparent 60%)',
        }}
      >
        {/* Top: Logo */}
        <div>
          <div className="px-6 py-6 border-b border-slate-800/60 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-400/40 text-blue-400 shadow-md group-hover:scale-105 transition-all">
                <Eye className="w-5 h-5 text-blue-400" />
                <div className="absolute inset-0 rounded-xl border border-blue-400/30 animate-pulse" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                RETINA<span className="text-blue-400">-MITRA</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 py-6 space-y-1.5">
            {navLinks.map((item) => {
              const IconComp = item.icon;
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#3C5880] text-white shadow-md shadow-[#0B1728]/50 border border-white/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <IconComp
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: System Online Indicator */}
        <div className="p-4 border-t border-slate-800/60 m-4 rounded-2xl bg-[#10213E]/60 border border-slate-800">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-emerald-300">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span>System Online</span>
          </div>
          <p className="text-3xs text-slate-400 mt-1 font-medium">Local PHC Inference Active</p>
        </div>
      </aside>
    </>
  );
}
