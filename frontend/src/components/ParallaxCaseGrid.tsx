'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { sound } from '@/lib/sound';

interface ClinicalCase {
  id: string;
  title: string;
  icdrGrade: string;
  confidence: string;
  finding: string;
  tags: string[];
  gradient: string;
}

const CASES: ClinicalCase[] = [
  {
    id: 'case-01',
    title: 'Proliferative DR & Neovascularization',
    icdrGrade: 'Grade 4 (PDR)',
    confidence: 'High',
    finding: 'Active disc neovascularization, intraretinal hemorrhages, preretinal fibrosis.',
    tags: ['Vessel Mapping', 'High Urgency', 'Grad-CAM Attention'],
    gradient: 'from-[#1A0B0B] via-[#2A1010] to-[#0E0E0C]',
  },
  {
    id: 'case-02',
    title: 'Moderate NPDR & Hard Exudate Ring',
    icdrGrade: 'Grade 2 (Moderate)',
    confidence: 'Moderate',
    finding: 'Circinate hard exudate rings temporal to fovea with microaneurysms.',
    tags: ['Macular Edema Risk', 'Calibrated', 'Referral Slip'],
    gradient: 'from-[#141B10] via-[#1F2C18] to-[#0E0E0C]',
  },
  {
    id: 'case-03',
    title: 'Severe NPDR & Venous Beading',
    icdrGrade: 'Grade 3 (Severe)',
    confidence: 'High',
    finding: 'Prominent 4-quadrant hemorrhages, 2-quadrant venous beading, IRMA lesions.',
    tags: ['4:2:1 Rule Criteria', 'High Attention', 'Referral Required'],
    gradient: 'from-[#10172A] via-[#1E293B] to-[#0E0E0C]',
  },
  {
    id: 'case-04',
    title: 'Healthy Retinal Fundus (Clear)',
    icdrGrade: 'Grade 0 (No DR)',
    confidence: 'High',
    finding: 'Crisp optic margins, healthy cup-to-disc ratio (0.3), clear macula.',
    tags: ['Quality: Pass', 'Annual Recall', 'No DR Detected'],
    gradient: 'from-[#181810] via-[#2D2C1B] to-[#0E0E0C]',
  },
];

export function ParallaxCaseGrid() {
  return (
    <section
      id="cases"
      className="relative bg-[var(--paper)] py-14 sm:py-20 lg:py-8 lg:min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-center px-5 sm:px-12 overflow-hidden border-t-2 border-[var(--ink)]"
    >
      {/* Fixed subtle underglow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-[var(--accent)]/20 blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-[1320px] w-full mx-auto flex flex-col justify-between h-auto lg:h-full lg:max-h-[85vh] gap-6 lg:gap-0">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2 lg:mb-4">
          <div>
            <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--ink-soft)] mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--ink)]" />
              Demonstration Cases
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.04em] text-[var(--ink)] leading-none uppercase">
              Clinical Screening Scenarios
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-[var(--ink-soft)] font-medium leading-relaxed">
            Representative Fundus Cases evaluated against the International Clinical Diabetic Retinopathy (ICDR) scale with complete explainability overlays.
          </p>
        </div>

        {/* 2x2 Bento Grid: stacks comfortably on mobile, fits 100% inside screen on desktop */}
        <div className="group/grid grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 flex-1">
          {CASES.map((item, index) => (
            <Link
              key={item.id}
              href="/screening/new"
              onClick={() => sound.playClick(720)}
              className="group/card relative rounded-2xl overflow-hidden border-2 border-[var(--ink)] bg-[var(--ink)] text-white p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-[8px_8px_0_var(--ink)] group-hover/grid:[&:not(:hover)]:opacity-50 group-hover/grid:[&:not(:hover)]:grayscale no-underline select-none"
              data-cursor-label="INSPECT"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-90 pointer-events-none`}
              />

              <div className="relative z-10 flex items-center justify-between font-mono text-[10px]">
                <span className="text-[var(--accent)] tracking-widest uppercase">
                  CASE #{String(index + 1).padStart(2, '0')} · {item.icdrGrade}
                </span>
                <span className="w-8 h-8 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center group-hover/card:bg-[var(--accent)] group-hover/card:text-[var(--ink)] transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              <div className="relative z-10 flex flex-wrap gap-1.5 my-auto py-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-[10px] font-mono tracking-wider text-white"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="relative z-10 border-t border-white/15 pt-3">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold tracking-tight text-white mb-0.5 group-hover/card:text-[var(--accent)] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-[#CFCFC4] line-clamp-1 max-w-sm">
                      {item.finding}
                    </p>
                  </div>
                  <div className="text-right shrink-0 font-mono">
                    <div className="text-xl sm:text-2xl font-extrabold text-[var(--accent)]">
                      {item.confidence}
                    </div>
                    <div className="text-[9px] text-[#8F8F80] uppercase tracking-wider">
                      Confidence
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
