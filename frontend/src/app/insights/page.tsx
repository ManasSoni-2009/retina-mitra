'use client';

import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { useSessionStore } from '@/hooks/useSessionStore';
import { Activity, PlusCircle, UserCheck, ShieldCheck, AlertTriangle, FileText } from 'lucide-react';

export default function InsightsPage() {
  const { screenedCases } = useSessionStore();

  const total = screenedCases.length;
  let reviewedCount = 0;
  let ungradableCount = 0;
  let referableCount = 0;
  const drGrades = [0, 0, 0, 0, 0];

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

  const gradableCount = total - ungradableCount;
  const passRate = total > 0 ? (gradableCount / total) * 100 : 0;
  const referableRate = gradableCount > 0 ? (referableCount / gradableCount) * 100 : 0;

  const gradeLabels = [
    'Level 0: No DR',
    'Level 1: Mild DR',
    'Level 2: Moderate DR',
    'Level 3: Severe DR',
    'Level 4: Proliferative DR',
  ];

  return (
    <main className="min-h-screen bg-[#FFFFFF] pb-24 pt-20 text-[#0B1728] relative overflow-hidden">
      
      {/* Ambient glass blooms */}
      <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#2563EB]/30 to-[#059669]/25 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <PageHeader 
          title="Session Screening Insights" 
          subtitle="Real-time analytics and epidemiological telemetry calculated strictly from your active session interactions."
          badge="SESSION TELEMETRY"
        />

        {total === 0 ? (
          <div className="glass-panel p-16 text-center max-w-lg mx-auto space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B1728] to-[#10213E] text-[#2563EB] flex items-center justify-center mx-auto shadow-lg">
              <Activity className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#0B1728]">No session insights yet</h3>
              <p className="text-xs text-[#3C5880] leading-relaxed font-bold">
                Complete a screening to see your session insights. Metrics are computed strictly from real clinical cases analyzed in this browser session.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/screening/new"
                className="btn-sand-primary"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Start a Screening</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top 4 KPI Cards with Glassmorphic Gradients */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-white/90 via-[#F8FAFC]/80 to-[#2563EB]/30 border border-slate-200 shadow-xl backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#3C5880] uppercase tracking-wider">Cases Reviewed</p>
                    <p className="text-3xl font-black text-[#0B1728] mt-1.5 font-mono">{reviewedCount}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#059669] to-[#556958] text-[#FFFFFF] shadow-md">
                    <UserCheck className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-[11px] text-[#3C5880] mt-3 font-bold">
                  {reviewedCount} of {total} cases verified by clinician.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-br from-white/90 via-[#059669]/20 to-[#059669]/30 border border-[#059669]/50 shadow-xl backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#3C5880] uppercase tracking-wider">Quality Gate Pass</p>
                    <p className="text-3xl font-black text-[#2C402F] mt-1.5 font-mono">{passRate.toFixed(0)}%</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#059669] to-[#556958] text-[#FFFFFF] shadow-md">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-[11px] text-[#3C5880] mt-3 font-bold">
                  {ungradableCount} ungradable scans intercepted before inference.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-br from-white/90 via-amber-50/80 to-amber-100/50 border border-amber-300 shadow-xl backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#3C5880] uppercase tracking-wider">Referable DR Rate</p>
                    <p className="text-3xl font-black text-amber-950 mt-1.5 font-mono">{referableRate.toFixed(0)}%</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-md">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-[11px] text-[#3C5880] mt-3 font-bold">
                  {referableCount} cases flagged for specialist review.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-br from-white/90 via-[#F8FAFC]/80 to-[#2563EB]/40 border border-slate-200 shadow-xl backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#3C5880] uppercase tracking-wider">Total Evaluated</p>
                    <p className="text-3xl font-black text-[#0B1728] mt-1.5 font-mono">{total}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0B1728] to-[#10213E] text-[#2563EB] shadow-md">
                    <FileText className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-[11px] text-[#3C5880] mt-3 font-bold">
                  Active session patient screenings.
                </p>
              </div>
            </div>

            {/* Severity Distribution Bars with Rich Gradient Fills */}
            <div className="glass-panel p-6 sm:p-8 space-y-6 shadow-2xl">
              <h3 className="text-base font-black text-[#0B1728] tracking-tight">ICDR Severity Distribution</h3>
              <div className="space-y-4">
                {gradeLabels.map((lbl, idx) => {
                  const count = drGrades[idx];
                  const pct = gradableCount > 0 ? (count / gradableCount) * 100 : 0;
                  return (
                    <div key={lbl} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-[#0B1728]">{lbl}</span>
                        <span className="font-mono text-[#0B1728] font-black">{count} scans ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full h-3.5 rounded-full bg-gradient-to-r from-[#F8FAFC] to-[#EEF2F7] border border-slate-200 overflow-hidden p-0.5 shadow-inner">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-[#0B1728] via-[#3C5880] to-[#059669] transition-all duration-500 shadow-md" 
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
