'use client';

import React from 'react';

interface DRGradeBadgeProps {
  grade: 0 | 1 | 2 | 3 | 4;
  label?: string;
}

export const DRGradeBadge: React.FC<DRGradeBadgeProps> = ({ grade, label }) => {
  const configs = {
    0: { 
      color: 'bg-[#E6F8F0] text-[#059669] border-[#A7F3D0] shadow-2xs', 
      dot: 'bg-[#10B981]', 
      defaultLabel: 'Level 0 — No DR' 
    },
    1: { 
      color: 'bg-gradient-to-r from-[#2563EB]/40 via-[#F8FAFC]/80 to-white/60 text-[#0B1728] border-slate-200 shadow-sm', 
      dot: 'bg-[#0B1728]', 
      defaultLabel: 'Level 1 — Mild NPDR' 
    },
    2: { 
      color: 'bg-gradient-to-r from-amber-100/90 via-amber-50/80 to-white/70 text-amber-950 border-amber-300 shadow-sm shadow-amber-500/10', 
      dot: 'bg-amber-600', 
      defaultLabel: 'Level 2 — Moderate NPDR' 
    },
    3: { 
      color: 'bg-gradient-to-r from-orange-100/90 via-orange-50/80 to-white/70 text-orange-950 border-orange-300 shadow-sm shadow-orange-500/10', 
      dot: 'bg-orange-600', 
      defaultLabel: 'Level 3 — Severe NPDR' 
    },
    4: { 
      color: 'bg-gradient-to-r from-rose-100/90 via-rose-50/80 to-white/70 text-rose-950 border-rose-300 shadow-sm shadow-rose-500/10', 
      dot: 'bg-rose-600', 
      defaultLabel: 'Level 4 — Proliferative DR' 
    },
  };

  const config = configs[grade] || configs[0];

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md ${config.color}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot} shadow-xs`} />
      <span>{label || config.defaultLabel}</span>
    </span>
  );
};
