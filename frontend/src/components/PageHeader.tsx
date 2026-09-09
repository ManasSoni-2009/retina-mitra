'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  badge?: string;
  accent?: 'sand' | 'sage' | 'steel' | 'teal' | 'amber' | 'violet';
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  badge,
}) => {
  return (
    <div className="relative flex flex-wrap items-start justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
      <div className="flex items-start gap-4">
        {/* Decorative gradient bar with glass glow */}
        <div
          className="mt-1 w-2 h-14 rounded-full bg-gradient-to-b from-[#0B1728] via-[#3C5880] to-[#059669] shrink-0 shadow-md shadow-[#0B1728]/20"
          aria-hidden="true"
        />
        <div>
          {badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#0B1728] to-[#10213E] text-[#FFFFFF] text-[11px] font-mono font-bold tracking-wider mb-2.5 shadow-md shadow-[#0B1728]/20 border border-slate-200 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
              {badge}
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B1728] tracking-tight leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-[#3C5880] font-semibold mt-1 leading-relaxed max-w-3xl">{subtitle}</p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
