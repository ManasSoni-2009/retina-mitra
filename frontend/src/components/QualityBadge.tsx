'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface QualityBadgeProps {
  status: 'GRADABLE' | 'UNGRADABLE' | 'BORDERLINE';
  score?: number;
}

export const QualityBadge: React.FC<QualityBadgeProps> = ({ status, score }) => {
  if (status === 'GRADABLE') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#059669]/25 via-[#059669]/15 to-white/80 text-[#2C402F] border border-[#059669]/50 backdrop-blur-md shadow-xs">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#3D5240] shrink-0" />
        <span>Gradable Scan {score !== undefined ? `(${(score * 100).toFixed(0)}%)` : ''}</span>
      </span>
    );
  }

  if (status === 'BORDERLINE') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#2563EB]/40 via-white/80 to-[#2563EB]/20 text-[#0B1728] border border-slate-200 backdrop-blur-md shadow-xs">
        <AlertTriangle className="w-3.5 h-3.5 text-[#0B1728] shrink-0" />
        <span>Borderline Quality</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-rose-100 via-rose-50/80 to-white/70 text-rose-950 border border-rose-300 backdrop-blur-md shadow-xs">
      <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
      <span>Ungradable Scan</span>
    </span>
  );
};
