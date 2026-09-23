'use client';

import React from 'react';
import { Eye, ShieldCheck, Sparkles, CheckCircle2, Sliders, Activity, Crosshair } from 'lucide-react';

export function TactileVisionHero() {
  return (
    <div className="relative w-full max-w-[440px] sm:max-w-[500px] lg:max-w-[560px] mx-auto select-none pointer-events-none">
      
      {/* ─── 1. FIXED SUBTLE AMBIENT UNDERGLOW ─── */}
      <div className="absolute inset-4 rounded-full bg-white/50 blur-[90px] -z-10" />

      {/* ─── 2. FLOATING SATELLITE CHIP: TOP RIGHT (ROTATED +3 DEG) ─── */}
      <div className="absolute -top-5 sm:-top-6 right-1 sm:-right-4 z-20 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl border-[2px] border-[var(--ink)] bg-white text-[var(--ink)] shadow-[4px_4px_0_var(--ink)] font-mono text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-2 rotate-[3.5deg] animate-in fade-in duration-500">
        <span className="w-2 h-2 rounded-full bg-[var(--ok)] animate-pulse" />
        <span>OpenCV Gate: 98% Pass</span>
      </div>

      {/* ─── 3. MAIN TACTILE SHOWCASE CARD ─── */}
      <div className="relative bg-[var(--paper)] border-[2.5px] border-[var(--ink)] rounded-[2.2rem] p-6 sm:p-7 shadow-[8px_8px_0_var(--ink)] rotate-[-1.5deg] transition-transform duration-300">
        
        {/* Card Header Bar */}
        <div className="flex items-center justify-between border-b-[2px] border-[var(--ink)] pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--ink)]" />
            <span className="font-mono text-xs font-bold tracking-widest uppercase text-[var(--ink)]">
              Retina-Mitra Diagnostic Core
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full border border-[var(--ink)] bg-[var(--bg)] font-mono text-[10px] font-extrabold uppercase text-[var(--ink)]">
            v4.2 HITL
          </span>
        </div>

        {/* Stylized Minimalist Retinal Vector Artwork */}
        <div className="relative w-full aspect-[4/3] rounded-2xl border-[2px] border-[var(--ink)] bg-[var(--bg)] overflow-hidden flex items-center justify-center p-4 shadow-inner">
          
          {/* Subtle Graphic Grid Lines */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                'linear-gradient(to right, var(--ink) 1px, transparent 1px), linear-gradient(to bottom, var(--ink) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Minimalist Stylized Vector Eye & Vascular Schematic */}
          <svg
            viewBox="0 0 280 200"
            className="w-full h-full relative z-10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Scleral Contour */}
            <path
              d="M 20 100 C 60 40 220 40 260 100 C 220 160 60 160 20 100 Z"
              fill="var(--paper)"
              stroke="var(--ink)"
              strokeWidth="2.5"
            />

            {/* Precision Optical Caliber Rings */}
            <circle
              cx="140"
              cy="100"
              r="52"
              fill="white"
              stroke="var(--ink)"
              strokeWidth="2.5"
            />
            <circle
              cx="140"
              cy="100"
              r="34"
              fill="var(--bg)"
              stroke="var(--ink)"
              strokeWidth="2"
            />
            <circle
              cx="140"
              cy="100"
              r="18"
              fill="var(--ink)"
            />

            {/* Stylized Branching Retinal Capillaries (Smooth Minimalist Vectors) */}
            <path
              d="M 140 100 Q 110 70 85 60 Q 65 52 45 65"
              stroke="var(--ink)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 2"
              opacity="0.7"
            />
            <path
              d="M 140 100 Q 170 70 195 62 Q 220 54 240 68"
              stroke="var(--ink)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 2"
              opacity="0.7"
            />
            <path
              d="M 140 100 Q 115 130 90 140 Q 70 148 50 135"
              stroke="var(--ink)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 2"
              opacity="0.7"
            />
            <path
              d="M 140 100 Q 165 130 190 138 Q 215 146 235 132"
              stroke="var(--ink)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 2"
              opacity="0.7"
            />

            {/* Foveal Target Crosshair Accent */}
            <circle
              cx="140"
              cy="100"
              r="6"
              fill="var(--accent)"
              stroke="white"
              strokeWidth="1.5"
            />

            {/* Target Reticle Corners */}
            <path d="M 124 88 L 124 84 L 128 84" stroke="var(--ink)" strokeWidth="2" />
            <path d="M 156 88 L 156 84 L 152 84" stroke="var(--ink)" strokeWidth="2" />
            <path d="M 124 112 L 124 116 L 128 116" stroke="var(--ink)" strokeWidth="2" />
            <path d="M 156 112 L 156 116 L 152 116" stroke="var(--ink)" strokeWidth="2" />
          </svg>

          {/* Minimalist Floating Overlay Chips inside graphic */}
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-[var(--ink)] text-[var(--accent)] font-mono text-[9px] font-bold">
            FOV 45° POSTERIOR
          </div>

          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-white border border-[var(--ink)] text-[var(--ink)] font-mono text-[9px] font-bold shadow-sm">
            CALIBRATED: 99.4%
          </div>
        </div>

        {/* ─── 4. BOTTOM CLINICAL PILLARS ─── */}
        <div className="grid grid-cols-3 gap-2.5 mt-5">
          <div className="p-2.5 rounded-xl border border-[var(--ink)] bg-white text-center shadow-[2px_2px_0_var(--ink)]">
            <div className="font-mono text-[9px] text-[var(--ink-mute)] uppercase font-semibold">ICDR Grading</div>
            <div className="font-extrabold text-xs text-[var(--ink)] mt-0.5">5-Class ML</div>
          </div>
          <div className="p-2.5 rounded-xl border border-[var(--ink)] bg-white text-center shadow-[2px_2px_0_var(--ink)]">
            <div className="font-mono text-[9px] text-[var(--ink-mute)] uppercase font-semibold">Inference</div>
            <div className="font-extrabold text-xs text-[var(--ink)] mt-0.5">&lt;180ms GPU</div>
          </div>
          <div className="p-2.5 rounded-xl border border-[var(--ink)] bg-white text-center shadow-[2px_2px_0_var(--ink)]">
            <div className="font-mono text-[9px] text-[var(--ink-mute)] uppercase font-semibold">Oversight</div>
            <div className="font-extrabold text-xs text-[var(--ok)] mt-0.5">100% HITL</div>
          </div>
        </div>
      </div>

      {/* ─── 5. FLOATING SATELLITE CHIP: BOTTOM LEFT (ROTATED -4 DEG) ─── */}
      <div className="absolute -bottom-4 sm:-bottom-5 left-1 sm:-left-4 z-20 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl border-[2px] border-[var(--ink)] bg-[var(--ink)] text-[var(--accent)] shadow-[4px_4px_0_var(--ink)] font-mono text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-2 rotate-[-3.5deg] animate-in fade-in duration-500">
        <ShieldCheck className="w-3.5 h-3.5 text-[var(--ok)]" />
        <span>Explainable Grad-CAM Heatmap</span>
      </div>
    </div>
  );
}
