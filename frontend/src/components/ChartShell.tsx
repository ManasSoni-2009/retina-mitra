'use client';

import React from 'react';

interface ChartShellProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  height?: string;
}

export const ChartShell: React.FC<ChartShellProps> = ({ title, subtitle, children, height = 'h-64' }) => {
  return (
    <div className="glass-panel p-6 sm:p-7 shadow-xl">
      <div className="mb-4">
        <h4 className="text-base font-black text-[#0B1728] tracking-tight">{title}</h4>
        {subtitle && <p className="text-xs text-[#3C5880] mt-0.5 font-semibold">{subtitle}</p>}
      </div>
      <div className={`w-full ${height} flex items-center justify-center bg-gradient-to-br from-[#F8FAFC] via-white/80 to-[#EEF2F7]/40 rounded-2xl border border-slate-200 p-4 shadow-inner`}>
        {children || <span className="text-xs text-[#3C5880] font-mono">Chart Visualizer Shell</span>}
      </div>
    </div>
  );
};
