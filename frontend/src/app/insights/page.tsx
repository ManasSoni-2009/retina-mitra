'use client';

import React from 'react';
import Link from 'next/link';
import { useSessionStore } from '@/hooks/useSessionStore';
import { sound } from '@/lib/sound';
import {
  Activity,
  PlusCircle,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  BarChart2,
} from 'lucide-react';

export default function InsightsPage() {
  const { screenedCases } = useSessionStore();

  const total = screenedCases.length > 0 ? screenedCases.length : 38;
  let reviewedCount = 0;
  let ungradableCount = 0;
  let referableCount = 0;
  const drGrades = [14, 8, 9, 4, 3]; // Baseline distribution

  if (screenedCases.length > 0) {
    // Reset baseline if real session data exists
    drGrades.fill(0);
    screenedCases.forEach((item) => {
      const s = item.screening;
      if (s.reviewStatus === 'REVIEW_COMPLETED' || s.reviewStatus === 'OVERRIDDEN') {
        reviewedCount++;
      }
      if (s.qualityStatus === 'UNGRADABLE') {
        ungradableCount++;
      } else {
        const grade = typeof s.drGrade === 'object' ? s.drGrade.drGrade : s.drGrade;
        if (typeof grade === 'number' && grade >= 0 && grade <= 4) {
          drGrades[grade]++;
        }
        if (s.referable) referableCount++;
      }
    });
  } else {
    reviewedCount = 28;
    ungradableCount = 2;
    referableCount = 16;
  }

  const gradableCount = total - ungradableCount;
  const passRate = total > 0 ? ((gradableCount / total) * 100).toFixed(1) : '94.7';
  const referableRate =
    gradableCount > 0 ? ((referableCount / gradableCount) * 100).toFixed(1) : '42.1';

  const gradeLabels = [
    'Level 0: No DR',
    'Level 1: Mild NPDR',
    'Level 2: Moderate NPDR',
    'Level 3: Severe NPDR',
    'Level 4: Proliferative DR',
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] pt-24 sm:pt-28 pb-28 sm:pb-32 px-4 sm:px-8 max-w-[1400px] mx-auto selection:bg-[var(--ink)] selection:text-[var(--accent)]">
      {/* ─── HEADER ─── */}
      <div className="pb-4 sm:pb-6 border-b-2 border-[var(--ink)] mb-6 sm:mb-10">
        <Link
          href="/dashboard"
          onClick={() => sound.playClick(600)}
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase font-bold text-[var(--ink-soft)] hover:text-[var(--ink)] mb-3 no-underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cockpit</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--ink-soft)] mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--ok)] animate-pulse" />
              Epidemiological Telemetry
            </div>
            <h1 className="text-2xl sm:text-5xl font-extrabold uppercase tracking-tight">
              Screening Cohort Analytics
            </h1>
          </div>
          <span className="self-start sm:self-auto font-mono text-[10px] sm:text-xs px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border-2 border-[var(--ink)] bg-[var(--paper)] font-bold uppercase">
            Active Session Telemetry
          </span>
        </div>
      </div>

      {/* ─── 4 TOP KPI CARDS (2x2 on Mobile, 4-Col on Desktop) ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 mb-8 sm:mb-12">
        <div className="p-3.5 sm:p-7 rounded-2xl sm:rounded-3xl border-2 sm:border-[2.5px] border-[var(--ink)] bg-[var(--paper)] shadow-[3px_3px_0_var(--ink)] sm:shadow-[6px_6px_0_var(--ink)] flex flex-col justify-between">
          <div className="font-mono text-[9px] sm:text-[10px] uppercase text-[var(--ink-mute)] mb-1 line-clamp-1">
            Quality Gate Pass
          </div>
          <div className="text-2xl sm:text-4xl font-extrabold text-[var(--ok)]">{passRate}%</div>
          <p className="font-mono text-[10px] sm:text-xs text-[var(--ink-soft)] mt-1 sm:mt-2 line-clamp-2">
            {gradableCount} of {total} scans passed focus variance.
          </p>
        </div>

        <div className="p-3.5 sm:p-7 rounded-2xl sm:rounded-3xl border-2 sm:border-[2.5px] border-[var(--ink)] bg-[var(--paper)] shadow-[3px_3px_0_var(--ink)] sm:shadow-[6px_6px_0_var(--ink)] flex flex-col justify-between">
          <div className="font-mono text-[9px] sm:text-[10px] uppercase text-[var(--ink-mute)] mb-1 line-clamp-1">
            Specialist Reviews
          </div>
          <div className="text-2xl sm:text-4xl font-extrabold text-[var(--ink)]">{reviewedCount}</div>
          <p className="font-mono text-[10px] sm:text-xs text-[var(--ink-soft)] mt-1 sm:mt-2 line-clamp-2">
            Clinician signed-off or reasoned overrides.
          </p>
        </div>

        <div className="p-3.5 sm:p-7 rounded-2xl sm:rounded-3xl border-2 sm:border-[2.5px] border-[var(--ink)] bg-[var(--paper)] shadow-[3px_3px_0_var(--ink)] sm:shadow-[6px_6px_0_var(--ink)] flex flex-col justify-between">
          <div className="font-mono text-[9px] sm:text-[10px] uppercase text-[var(--ink-mute)] mb-1 line-clamp-1">
            Referable DR
          </div>
          <div className="text-2xl sm:text-4xl font-extrabold text-amber-500">{referableRate}%</div>
          <p className="font-mono text-[10px] sm:text-xs text-[var(--ink-soft)] mt-1 sm:mt-2 line-clamp-2">
            ICDR Grade 2+ routed for specialist consultation.
          </p>
        </div>

        <div className="p-3.5 sm:p-7 rounded-2xl sm:rounded-3xl border-2 sm:border-[2.5px] border-[var(--ink)] bg-[var(--paper)] shadow-[3px_3px_0_var(--ink)] sm:shadow-[6px_6px_0_var(--ink)] flex flex-col justify-between">
          <div className="font-mono text-[9px] sm:text-[10px] uppercase text-[var(--ink-mute)] mb-1 line-clamp-1">
            Ungradable Retakes
          </div>
          <div className="text-2xl sm:text-4xl font-extrabold text-rose-600">{ungradableCount}</div>
          <p className="font-mono text-[10px] sm:text-xs text-[var(--ink-soft)] mt-1 sm:mt-2 line-clamp-2">
            Automated blur / glare retake commanded.
          </p>
        </div>
      </div>

      {/* ─── ICDR SEVERITY COHORT DISTRIBUTION BENTO ─── */}
      <div className="rounded-3xl border-[2.5px] border-[var(--ink)] bg-[var(--paper)] p-4 sm:p-8 shadow-[6px_6px_0_var(--ink)] sm:shadow-[8px_8px_0_var(--ink)] mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 pb-4 sm:pb-6 border-b border-[var(--ink)]/20 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
              ICDR DR Severity Distribution
            </h2>
            <p className="font-mono text-xs text-[var(--ink-soft)] mt-0.5 sm:mt-1">
              Distribution of cohort screenings across the 5 International Clinical DR stages
            </p>
          </div>
          <span className="font-mono text-xs font-bold uppercase text-[var(--ink)]">
            Total Cohort: {total} Scans
          </span>
        </div>

        {/* Proportional Spectrum Visualizer Bar (High-Impact Overview on Mobile) */}
        <div className="mb-6 p-3 sm:p-4 rounded-2xl border-2 border-[var(--ink)] bg-[var(--bg)] shadow-inner">
          <div className="flex justify-between items-center font-mono text-[10px] uppercase font-bold text-[var(--ink-soft)] mb-2">
            <span>Cohort Severity Spectrum</span>
            <span>{gradableCount} Gradable Cases</span>
          </div>
          <div className="w-full h-3.5 sm:h-4 rounded-full border border-[var(--ink)] bg-[var(--paper)] overflow-hidden flex shadow-sm">
            {gradeLabels.map((_, idx) => {
              const count = drGrades[idx];
              const pct = total > 0 ? (count / total) * 100 : 0;
              const colors = [
                'bg-emerald-500', // Grade 0
                'bg-teal-400',    // Grade 1
                'bg-amber-400',   // Grade 2
                'bg-orange-500',  // Grade 3
                'bg-rose-500',    // Grade 4
              ];
              if (pct === 0) return null;
              return (
                <div
                  key={idx}
                  style={{ width: `${pct}%` }}
                  className={`${colors[idx]} h-full transition-all duration-500 border-r last:border-r-0 border-[var(--ink)]/20`}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-1 mt-2 font-mono text-[9px] text-[var(--ink-soft)]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> G0 Clear</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-400" /> G1 Mild</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> G2 Mod</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> G3 Sev</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> G4 PDR</span>
          </div>
        </div>

        <div className="space-y-3.5 sm:space-y-6">
          {gradeLabels.map((label, index) => {
            const count = drGrades[index];
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;

            return (
              <div key={label} className="space-y-1.5 sm:space-y-2">
                <div className="flex flex-wrap justify-between items-center gap-1 font-mono text-xs">
                  <span className="font-bold text-[var(--ink)]">{label}</span>
                  <span className="text-[var(--ink-soft)]">
                    <strong className="text-sm font-extrabold text-[var(--ink)]">{count}</strong> cases ({pct}%)
                  </span>
                </div>
                <div className="w-full h-3.5 sm:h-4 rounded-full border-2 border-[var(--ink)] bg-[var(--bg)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--ink)] rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(pct, 2)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
