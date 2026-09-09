'use client';

import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, Loader2, BrainCircuit, ScanSearch, FileText } from 'lucide-react';

interface AnalysisAnimationProps {
  onComplete: () => void;
}

export function AnalysisAnimation({ onComplete }: AnalysisAnimationProps) {
  const [step, setStep] = useState(0);

  const steps = [
    { label: 'Preparing image intake and normalization...', icon: ScanSearch, duration: 350 },
    { label: 'Checking image quality gate (sharpness, glare)...', icon: Activity, duration: 400 },
    { label: 'Reviewing retinal features & microvascular caliber...', icon: BrainCircuit, duration: 450 },
    { label: 'Preparing spatial evidence & Grad-CAM map...', icon: FileText, duration: 400 },
    { label: 'Screening analysis ready.', icon: CheckCircle2, duration: 300 },
  ];

  useEffect(() => {
    let currentStep = 0;
    
    const advanceStep = () => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        setStep(currentStep);
        setTimeout(advanceStep, steps[currentStep].duration);
      } else {
        setTimeout(() => {
          onComplete();
        }, 200);
      }
    };

    const initialTimer = setTimeout(advanceStep, steps[0].duration);
    return () => clearTimeout(initialTimer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center py-10 px-6">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full border-4 border-[#10213E] border-t-[#384994] animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <BrainCircuit className="w-7 h-7 text-[#384994]" />
        </div>
      </div>
      
      <div className="w-full max-w-md space-y-3">
        {steps.map((s, idx) => {
          const isActive = idx === step;
          const isPast = idx < step;
          
          if (idx > step) return null;
          
          return (
            <div 
              key={idx} 
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 ${
                isActive 
                  ? 'bg-[#10213E] border-[#384994] text-[#384994] shadow-lg scale-102' 
                  : isPast 
                    ? 'bg-[#0B1728]/80 border-[#3C5880]/50 text-[#F4F7FB]/70' 
                    : 'hidden'
              }`}
            >
              {isPast ? (
                <CheckCircle2 className="w-4 h-4 text-[#059669] flex-shrink-0" />
              ) : (
                <Loader2 className="w-4 h-4 text-[#384994] animate-spin flex-shrink-0" />
              )}
              <span className={`text-xs ${isActive ? 'font-bold text-[#F4F7FB]' : ''}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
