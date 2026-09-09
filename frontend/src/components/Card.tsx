'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, subtitle, action, glass = false }) => {
  return (
    <div className={`glass-panel p-6 sm:p-7 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-slate-200">
          <div>
            {title && <h3 className="text-base font-black text-[#0B1728] tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-[#3C5880] mt-0.5 font-semibold">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
