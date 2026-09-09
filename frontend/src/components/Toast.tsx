'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  const configs = {
    success: { bg: 'bg-[#10213E] border-[#059669]', text: 'text-[#059669]', icon: CheckCircle2 },
    error:   { bg: 'bg-[#10213E] border-rose-600', text: 'text-rose-400', icon: AlertCircle },
    info:    { bg: 'bg-[#10213E] border-[#384994]', text: 'text-[#384994]', icon: CheckCircle2 },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-2xl backdrop-blur-xl ${config.bg}`}>
      <Icon className={`w-5 h-5 shrink-0 ${config.text}`} />
      <p className="text-sm font-bold text-[#F4F7FB]">{message}</p>
      <button onClick={onClose} className="p-1 rounded-lg text-[#F4F7FB]/50 hover:text-[#F4F7FB] hover:bg-[#3C5880]/30 transition-colors ml-2">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
