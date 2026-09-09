'use client';

import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

interface StatusIndicatorProps {
  status: 'COMPLETED' | 'PENDING' | 'FLAGGED' | 'FAILED' | 'REJECTED';
  label?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label }) => {
  const configs = {
    COMPLETED: {
      icon: CheckCircle2,
      color: 'bg-gradient-to-r from-[#059669]/25 via-[#059669]/15 to-white/80 text-[#2C402F] border-[#059669]/50',
      iconColor: 'text-[#3D5240]',
      defaultLabel: 'Screening Complete',
    },
    PENDING: {
      icon: Clock,
      color: 'bg-gradient-to-r from-[#2563EB]/40 via-white/80 to-[#2563EB]/20 text-[#0B1728] border-slate-200',
      iconColor: 'text-[#0B1728]',
      defaultLabel: 'Awaiting Review',
    },
    FLAGGED: {
      icon: AlertCircle,
      color: 'bg-gradient-to-r from-amber-100 via-amber-50 to-white/70 text-amber-950 border-amber-300',
      iconColor: 'text-amber-600',
      defaultLabel: 'Review Flagged',
    },
    FAILED: {
      icon: XCircle,
      color: 'bg-gradient-to-r from-rose-100 via-rose-50 to-white/70 text-rose-950 border-rose-300',
      iconColor: 'text-rose-600',
      defaultLabel: 'Scan Failed',
    },
    REJECTED: {
      icon: XCircle,
      color: 'bg-gradient-to-r from-rose-100 via-rose-50 to-white/70 text-rose-950 border-rose-300',
      iconColor: 'text-rose-600',
      defaultLabel: 'Rejected Quality',
    },
  };

  const config = configs[status] || configs.PENDING;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${config.color}`}>
      <Icon className={`w-3.5 h-3.5 shrink-0 ${config.iconColor}`} />
      <span>{label || config.defaultLabel}</span>
    </span>
  );
};
