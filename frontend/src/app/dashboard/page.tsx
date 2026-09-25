'use client';

import React from 'react';
import Link from 'next/link';
import { useSessionStore } from '@/hooks/useSessionStore';
import { DEMO_CASES } from '@/data/prototypeCases';
import { sound } from '@/lib/sound';
import {
  Users,
  ShieldAlert,
  FileText,
  ArrowRight,
  PlusCircle,
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sliders,
} from 'lucide-react';

export default function DashboardPage() {
  const { screenedCases, reportsGenerated, casesRequiringReview } = useSessionStore();

  const totalScreened = screenedCases.length > 0 ? screenedCases.length : 42;
  const ungradableCount = screenedCases.filter((c) => c.screening.qualityStatus === 'UNGRADABLE').length || 3;
  const triageCount = casesRequiringReview.length > 0 ? casesRequiringReview.length : 2;

  const stats = [
    {
      name: 'Total Screened',
      value: totalScreened,
      sub: 'District Cohort Volume',
      icon: Users,
    },
    {
      name: 'Specialist Triage',
      value: triageCount,
      sub: 'Uncertainty Escalations',
      icon: ShieldAlert,
    },
    {
      name: 'Ungradable Scans',
      value: ungradableCount,
      sub: 'Quality Gate Abstentions',
      icon: Activity,
    },
    {
      name: 'Reports Dispatched',
      value: reportsGenerated > 0 ? reportsGenerated : 18,
      sub: 'Referral Slips Issued',
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] pt-28 pb-20 px-4 sm:px-8 max-w-[1400px] mx-auto selection:bg-[var(--ink)] selection:text-[var(--accent)]">
      {/* ─── COCKPIT HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b-2 border-[var(--ink)] mb-10">
        <div>
          <div className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--ink-soft)] mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--ok)] animate-pulse" />
            Live Clinic Cockpit · Nanded District Hub
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-[-0.04em] uppercase text-[var(--ink)] leading-none">
            Tele-Ophthalmology Cockpit
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3 w-full md:w-auto">
          <Link
            href="/review"
            onClick={() => sound.playClick(720)}
            className="w-full sm:w-auto text-center px-3 sm:px-5 py-2.5 sm:py-3 rounded-full border-2 border-[var(--ink)] bg-[var(--paper)] text-[var(--ink)] font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all no-underline shadow-[2px_2px_0_var(--ink)] sm:shadow-[3px_3px_0_var(--ink)]"
            data-cursor-label="REVIEW"
          >
            Review ({triageCount})
          </Link>
          <Link
            href="/screening/new"
            onClick={() => sound.playClick(900)}
            className="w-full sm:w-auto text-center justify-center px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[var(--ink)] text-[var(--accent)] font-extrabold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all no-underline shadow-[3px_3px_0_var(--ink)] sm:shadow-[4px_4px_0_var(--ink)] flex items-center gap-1.5"
            data-cursor-label="INTAKE"
          >
            <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>New Screen</span>
          </Link>
        </div>
      </div>

      {/* ─── BENTO STATS GRID (2x2 on Mobile, 4-Col on Desktop) ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 mb-8 sm:mb-12">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.name}
              className="p-3.5 sm:p-7 rounded-2xl sm:rounded-3xl border-2 sm:border-[2.5px] border-[var(--ink)] bg-[var(--paper)] shadow-[3px_3px_0_var(--ink)] sm:shadow-[6px_6px_0_var(--ink)] flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-2 sm:mb-4">
                <span className="font-mono text-[9px] sm:text-[11px] tracking-wider uppercase text-[var(--ink-mute)] line-clamp-1">
                  {s.name}
                </span>
                <span className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-[var(--ink)] text-[var(--accent)] shrink-0">
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                </span>
              </div>
              <div>
                <div className="text-2xl sm:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
                  {s.value}
                </div>
                <div className="font-mono text-[9px] sm:text-[11px] text-[var(--ink-soft)] mt-0.5 sm:mt-1 line-clamp-1">
                  {s.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── CLINICAL BENCHMARK CASES LAUNCHPAD ─── */}
      <div className="rounded-3xl border-[2.5px] border-[var(--ink)] bg-[var(--paper)] p-4 sm:p-8 shadow-[6px_6px_0_var(--ink)] sm:shadow-[8px_8px_0_var(--ink)] mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 pb-4 sm:pb-6 border-b border-[var(--ink)]/20 mb-4 sm:mb-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--ink-soft)] flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[var(--ink)] animate-ping" />
              Benchmark Case Inspector
            </div>
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-[var(--ink)]">
              Interactive Case Launchpad
            </h2>
          </div>
          <span className="font-mono text-[11px] sm:text-xs text-[var(--ink-mute)]">
            <span className="md:hidden">Swipe benchmark cases →</span>
            <span className="hidden md:inline">Load real scans into the Multi-Layer Canvas</span>
          </span>
        </div>

        {/* Mobile: Horizontal Swipe Track | Desktop: 4-Column Grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible">
          {DEMO_CASES.map((demoCase) => (
            <Link
              key={demoCase.screeningId}
              href={`/screening/${demoCase.screeningId}`}
              onClick={() => sound.playClick(800)}
              className="w-[78vw] max-w-[285px] shrink-0 snap-center md:w-auto md:max-w-none group p-4 sm:p-5 rounded-2xl border-2 border-[var(--ink)] bg-[var(--bg)] hover:bg-[var(--ink)] hover:text-[var(--accent)] transition-all no-underline shadow-[3px_3px_0_var(--ink)] sm:shadow-[4px_4px_0_var(--ink)] hover:translate-x-[-2px] hover:translate-y-[-2px] flex flex-col justify-between"
              data-cursor-label="LOAD"
            >
              <div>
                <div className="flex justify-between items-start font-mono text-[10px] uppercase tracking-wider mb-2">
                  <span>{demoCase.patientAlias}</span>
                  <span className="font-bold underline">{demoCase.drGradeLabel}</span>
                </div>
                <div className="font-bold text-sm sm:text-base group-hover:text-[var(--accent)] transition-colors mb-1 leading-snug">
                  {demoCase.title}
                </div>
                <p className="text-xs text-[var(--ink-soft)] group-hover:text-[#CFCFC4] line-clamp-2">
                  {demoCase.description}
                </p>
              </div>

              <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-current/20 flex items-center justify-between font-mono text-[11px] font-bold">
                <span>View Canvas</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── ACTIVE CLINIC QUEUE TABLE & MOBILE CARDS ─── */}
      <div className="rounded-3xl border-[2.5px] border-[var(--ink)] bg-[var(--paper)] p-4 sm:p-8 shadow-[6px_6px_0_var(--ink)] sm:shadow-[8px_8px_0_var(--ink)]">
        <div className="flex justify-between items-center pb-6 border-b border-[var(--ink)]/20 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink)]">
              Recent Screening Queue
            </h2>
            <p className="font-mono text-xs text-[var(--ink-soft)] mt-1">
              Intake and triage record from camp cameras and clinic endpoints
            </p>
          </div>
          <Link
            href="/history"
            onClick={() => sound.playClick()}
            className="font-mono text-xs font-bold text-[var(--ink)] uppercase hover:underline flex items-center gap-1"
          >
            <span>Full History</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* Mobile View: High-Visibility Cards */}
        <div className="md:hidden flex flex-col gap-3">
          {[
            {
              id: 'RM-9841',
              quality: 'PASS (Gradable)',
              grade: 'Level 2: Moderate NPDR',
              conf: 'Calibrated',
              status: 'Specialist Sign-Off',
              statusOk: true,
            },
            {
              id: 'RM-9842',
              quality: 'PASS (Gradable)',
              grade: 'Level 0: No DR',
              conf: 'Calibrated',
              status: 'Clear',
              statusOk: true,
            },
            {
              id: 'RM-9843',
              quality: 'FAIL (Blur)',
              grade: 'Ungradable Scan',
              conf: 'Abstained',
              status: 'Retake Commanded',
              statusOk: false,
            },
            {
              id: 'RM-9844',
              quality: 'PASS (Gradable)',
              grade: 'Level 4: Proliferative DR',
              conf: 'Calibrated',
              status: 'Urgent Referral',
              statusOk: true,
            },
          ].map((row) => (
            <div
              key={row.id}
              className="p-4 rounded-2xl border-2 border-[var(--ink)] bg-[var(--bg)] shadow-[3px_3px_0_var(--ink)] flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-xs">{row.id}</span>
                <span className="px-2 py-0.5 rounded bg-[var(--ink)] text-[var(--accent)] font-mono text-[10px] font-bold">
                  {row.quality}
                </span>
              </div>
              <div className="font-bold text-sm text-[var(--ink)]">{row.grade}</div>
              <div className="flex justify-between items-center font-mono text-xs text-[var(--ink-soft)] pt-1 border-t border-[var(--ink)]/15">
                <span>Confidence: {row.conf}</span>
                <span
                  className={`inline-flex items-center gap-1 font-bold ${
                    row.statusOk ? 'text-[var(--ok)]' : 'text-rose-600'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {row.status}
                </span>
              </div>
              <Link
                href={`/screening/demo-case-01`}
                onClick={() => sound.playClick(750)}
                className="mt-1 w-full py-2 rounded-xl bg-[var(--ink)] text-[var(--accent)] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 no-underline shadow-sm active:scale-98"
              >
                <span>Inspect Scan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* Desktop View: Full Data Table (Identical to PC Design) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[var(--ink)] font-mono text-[11px] uppercase tracking-wider text-[var(--ink-mute)]">
                <th className="py-3 px-4">Patient Ref</th>
                <th className="py-3 px-4">Quality Gate</th>
                <th className="py-3 px-4">DR Severity</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y border-b border-[var(--ink)]/20 text-sm">
              {[
                {
                  id: 'RM-9841',
                  quality: 'PASS (Gradable)',
                  grade: 'Level 2: Moderate NPDR',
                  conf: 'Calibrated',
                  status: 'Specialist Sign-Off',
                  statusOk: true,
                },
                {
                  id: 'RM-9842',
                  quality: 'PASS (Gradable)',
                  grade: 'Level 0: No DR',
                  conf: 'Calibrated',
                  status: 'Clear',
                  statusOk: true,
                },
                {
                  id: 'RM-9843',
                  quality: 'FAIL (Blur)',
                  grade: 'Ungradable Scan',
                  conf: 'Abstained',
                  status: 'Retake Commanded',
                  statusOk: false,
                },
                {
                  id: 'RM-9844',
                  quality: 'PASS (Gradable)',
                  grade: 'Level 4: Proliferative DR',
                  conf: 'Calibrated',
                  status: 'Urgent Referral',
                  statusOk: true,
                },
              ].map((row) => (
                <tr key={row.id} className="hover:bg-[var(--bg)]/50 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-xs">{row.id}</td>
                  <td className="py-4 px-4 font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-[var(--ink)] text-[var(--accent)] font-bold">
                      {row.quality}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold">{row.grade}</td>
                  <td className="py-4 px-4 font-mono text-xs font-bold">{row.conf}</td>
                  <td className="py-4 px-4 font-mono text-xs">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-current font-bold ${
                        row.statusOk ? 'text-[var(--ok)]' : 'text-rose-600'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-xs">
                    <Link
                      href={`/screening/demo-case-01`}
                      onClick={() => sound.playClick(750)}
                      className="inline-flex items-center gap-1 font-bold underline hover:opacity-70"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
