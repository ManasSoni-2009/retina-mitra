'use client';

import React from 'react';
import Image from 'next/image';
import { Crosshair, ShieldCheck, Eye, Compass, Scan } from 'lucide-react';

export function RetinalOpticHUD() {
  return (
    <div
      id="cs-retinal-hud"
      className="relative w-full max-w-[420px] sm:max-w-[520px] lg:max-w-[620px] aspect-square mx-auto select-none pointer-events-none"
    >
      {/* ─── 1. FIXED AMBIENT UNDERGLOW ─── */}
      <div className="absolute inset-4 rounded-full bg-white/40 blur-[90px] -z-10" />

      {/* ─── 2. MAIN OPTICAL CHASSIS ─── */}
      <div className="relative w-full h-full rounded-full border-[3px] border-[var(--ink)] ring-1 ring-white/70 bg-[var(--paper)] shadow-[0_20px_60px_rgba(0,0,0,0.18),8px_8px_0_var(--ink)] p-3 sm:p-5 flex items-center justify-center overflow-hidden">
        
        {/* Subtle Radial Compass Scale */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
          viewBox="0 0 400 400"
        >
          {/* Compass degree ticks */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = i * 10;
            const isMajor = i % 9 === 0;
            const isMedium = i % 3 === 0;
            const length = isMajor ? 14 : isMedium ? 9 : 5;
            return (
              <line
                key={angle}
                x1="200"
                y1={20}
                x2="200"
                y2={20 + length}
                stroke="var(--ink)"
                strokeWidth={isMajor ? 2.5 : isMedium ? 1.5 : 1}
                transform={`rotate(${angle} 200 200)`}
              />
            );
          })}
        </svg>

        {/* ─── 3. CIRCULAR FUNDUS VIEWFINDER PORTAL ─── */}
        <div className="relative w-[86%] h-[86%] rounded-full overflow-hidden border-[2.5px] border-[var(--ink)] bg-[#0C1418] shadow-inner">
          {/* Genuine Retinal Fundus Photographic Core */}
          <div className="absolute inset-0 opacity-80 mix-blend-screen scale-105">
            <Image
              src="/prototype-cases/rm-003/combined.png"
              alt="Explainable Retinal Multi-Layer Fundus Target"
              fill
              sizes="(max-width: 768px) 380px, 580px"
              priority
              className="object-cover"
            />
          </div>

          {/* Optical Vignette & Depth Mask */}
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/75 pointer-events-none" />

          {/* ─── 4. OPTICAL CALIBRATION RETICLE SVG ─── */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 300 300"
          >
            {/* Concentric Optical Diagnostic Zones */}
            <circle
              cx="150"
              cy="150"
              r="135"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.4"
            />
            <circle
              cx="150"
              cy="150"
              r="95"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.2"
              opacity="0.6"
            />
            <circle
              cx="150"
              cy="150"
              r="55"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeDasharray="6 3"
              opacity="0.75"
            />
            <circle
              cx="150"
              cy="150"
              r="22"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              opacity="0.9"
            />

            {/* Central Target Crosshairs */}
            <line
              x1="150"
              y1="40"
              x2="150"
              y2="260"
              stroke="var(--accent)"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.5"
            />
            <line
              x1="40"
              y1="150"
              x2="260"
              y2="150"
              stroke="var(--accent)"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.5"
            />

            {/* Target Reticle Brackets around Fovea */}
            <path
              d="M 135 140 L 135 135 L 140 135"
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
            <path
              d="M 165 140 L 165 135 L 160 135"
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
            <path
              d="M 135 160 L 135 165 L 140 165"
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
            <path
              d="M 165 160 L 165 165 L 160 165"
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
          </svg>

          {/* Internal HUD Telemetry Data */}
          <div className="absolute top-4 left-6 font-mono text-[9px] sm:text-[10px] text-[var(--accent)] tracking-wider uppercase font-bold drop-shadow">
            <div>FOV: 45° POSTERIOR</div>
            <div className="text-white/80">LATENCY: FAST PIPELINE</div>
          </div>

          <div className="absolute bottom-4 right-6 text-right font-mono text-[9px] sm:text-[10px] text-[var(--accent)] tracking-wider uppercase font-bold drop-shadow">
            <div>ICDR 5-CLASS ENGINE</div>
            <div className="text-[var(--ok)] flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--ok)] animate-pulse" />
              QUALITY: PASS (GRADABLE)
            </div>
          </div>
        </div>

        {/* ─── 5. FLOATING SATELLITE TELEMETRY BADGES ─── */}
        {/* Top-Right Badge: Focus Variance */}
        <div className="absolute -top-1 sm:top-4 right-4 sm:right-6 px-3 py-1.5 rounded-full bg-[var(--ink)] text-[var(--accent)] border-2 border-[var(--ink)] ring-1 ring-white/60 shadow-[3px_3px_0_var(--ink)] font-mono text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--ok)]" />
          <span>LAPLACIAN &gt; 100.0</span>
        </div>

        {/* Bottom-Left Badge: Diagnostic Calibration */}
        <div className="absolute -bottom-1 sm:bottom-6 left-4 sm:left-6 px-3.5 py-1.5 rounded-full bg-[var(--paper)] text-[var(--ink)] border-2 border-[var(--ink)] ring-1 ring-white/60 shadow-[3px_3px_0_var(--ink)] font-mono text-[10px] sm:text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
          <Crosshair className="w-3.5 h-3.5 text-[var(--ink)]" />
          <span>GRAD-CAM // HOOK ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
