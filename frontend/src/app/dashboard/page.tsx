'use client';

import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { TableShell } from '@/components/TableShell';
import { DRGradeBadge } from '@/components/DRGradeBadge';
import { QualityBadge } from '@/components/QualityBadge';
import { StatusIndicator } from '@/components/StatusIndicator';
import { useSessionStore } from '@/hooks/useSessionStore';
import { DEMO_CASES } from '@/data/prototypeCases';
import { Users, ShieldAlert, FileText, ArrowRight, PlusCircle, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { screenedCases, reportsGenerated, casesRequiringReview } = useSessionStore();

  const totalScreened = screenedCases.length;
  const ungradableCount = screenedCases.filter((c) => c.screening.qualityStatus === 'UNGRADABLE').length;

  const stats = [
    { 
      name: 'Total Screened', 
      value: totalScreened > 0 ? totalScreened : 42, 
      icon: Users, 
      color: 'text-[#0B1728]', 
      bg: 'bg-gradient-to-br from-white/90 via-[#F8FAFC]/80 to-[#2563EB]/40',
      border: 'border-slate-200',
      iconBg: 'bg-gradient-to-br from-[#0B1728] to-[#10213E] text-[#2563EB]'
    },
    { 
      name: 'Specialist Triage', 
      value: casesRequiringReview.length > 0 ? casesRequiringReview.length : 2, 
      icon: ShieldAlert, 
      color: 'text-amber-950', 
      bg: 'bg-gradient-to-br from-white/90 via-amber-50/80 to-amber-100/50',
      border: 'border-amber-300',
      iconBg: 'bg-gradient-to-br from-amber-600 to-amber-800 text-white'
    },
    { 
      name: 'Ungradable Scans', 
      value: ungradableCount > 0 ? ungradableCount : 3, 
      icon: Activity, 
      color: 'text-rose-950', 
      bg: 'bg-gradient-to-br from-white/90 via-rose-50/80 to-rose-100/50',
      border: 'border-rose-300',
      iconBg: 'bg-gradient-to-br from-rose-600 to-rose-800 text-white'
    },
    { 
      name: 'Reports Exported', 
      value: reportsGenerated, 
      icon: FileText, 
      color: 'text-[#2C402F]', 
      bg: 'bg-gradient-to-br from-white/90 via-[#059669]/20 to-[#059669]/30',
      border: 'border-[#059669]/50',
      iconBg: 'bg-gradient-to-br from-[#059669] to-[#556958] text-[#FFFFFF]'
    },
  ];

  return (
    <main className="min-h-screen bg-[#FFFFFF] pb-24 pt-20 text-[#0B1728] relative overflow-hidden">
      
      {/* Ambient glass blooms */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-r from-[#2563EB]/30 to-[#059669]/25 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-gradient-to-l from-[#059669]/25 to-[#3C5880]/20 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <PageHeader 
          title="Tele-Ophthalmology Dashboard" 
          subtitle="Real-time screening workload, quality gate telemetry, and specialist triage queue across Nanded district network."
          badge="DISTRICT TELEMETRY"
          actions={
            <Link 
              href="/screening/new" 
              className="btn-sand-primary"
            >
              <PlusCircle className="w-4 h-4" />
              New Patient Screening
            </Link>
          }
        />

        {/* ── CLINICAL PROTOTYPE LAUNCHPAD (FROSTED GLASS GRADIENT PANEL) ── */}
        <div className="p-7 sm:p-9 glass-panel space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0B1728] animate-ping" />
              <span className="font-black text-xs text-[#0B1728] uppercase tracking-widest font-mono">
                Clinical Prototype Launchpad
              </span>
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#0B1728] to-[#10213E] text-[#2563EB] text-[10px] font-bold font-mono shadow-sm">
                CONTROLLED DATA
              </span>
            </div>
            <span className="text-xs text-[#3C5880] font-mono font-black">
              Controlled 3–5 Minute Presentation Sequence
            </span>
          </div>

          <p className="text-xs text-[#3C5880] max-w-3xl leading-relaxed font-bold">
            Select any pre-configured case below to directly examine Quality Gate hard-rejection, Multimodal Explainability (Grad-CAM + Lesion segmentation), Human-in-the-Loop specialist review, or referral reporting:
          </p>

          {/* 5 Controlled Demo Cases Grid with Individual Frosted Glass Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 pt-1">
            {DEMO_CASES.map((dc) => (
              <Link
                key={dc.screeningId}
                href={`/screening/${dc.screeningId}`}
                className="p-4 rounded-3xl bg-gradient-to-br from-white/90 via-[#F8FAFC]/80 to-[#2563EB]/30 hover:from-white hover:to-white border border-slate-200 hover:border-[#0B1728] text-left transition-all duration-300 group flex flex-col justify-between space-y-2.5 shadow-md hover:shadow-xl hover:-translate-y-1 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#0B1728] font-mono font-black tracking-wider">{dc.demoNumber}</span>
                  <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase ${
                    dc.qualityStatus === 'UNGRADABLE' ? 'bg-rose-100 text-rose-950 border border-rose-300' :
                    dc.referable ? 'bg-amber-100 text-amber-950 border border-amber-300' : 'bg-[#059669]/20 text-[#2C402F] border border-[#059669]/40'
                  }`}>
                    {dc.qualityStatus === 'UNGRADABLE' ? 'Ungradable' : dc.referable ? 'Referable' : 'Routine'}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#0B1728] group-hover:text-[#0B1728] transition-colors block truncate">
                    {dc.category}
                  </span>
                  <span className="text-[10px] text-[#3C5880] font-mono font-bold block">
                    {dc.patientAlias}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top 4 KPI Metric Cards with Frosted Glass Gradient Fills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.name} 
                className={`p-6 rounded-3xl backdrop-blur-2xl border ${item.border} ${item.bg} shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#3C5880] uppercase tracking-wider">{item.name}</p>
                    <p className={`text-3xl font-black ${item.color} mt-1.5 font-mono`}>{item.value}</p>
                  </div>
                  <div className={`p-3.5 rounded-2xl ${item.iconBg} shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Screenings Table with Frosted Glass */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#0B1728] tracking-tight">Recent Patient Screenings</h2>
              <p className="text-xs text-[#3C5880] mt-0.5 font-bold">Live session intake and referral status</p>
            </div>
            <Link 
              href="/history" 
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#0B1728] hover:text-[#3C5880] transition-colors"
            >
              <span>View Full History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <TableShell headers={['Screening ID', 'Patient Alias', 'Quality Status', 'ICDR Result', 'Review Status', 'Actions']}>
            {screenedCases.slice(0, 5).map((item) => {
              const s = item.screening;
              return (
                <tr key={s.screeningId} className="border-b border-slate-200 hover:bg-gradient-to-r hover:from-white/80 hover:to-[#2563EB]/20 transition-colors">
                  <td className="px-6 py-4.5 whitespace-nowrap font-mono text-xs font-black text-[#0B1728]">
                    {s.screeningId}
                  </td>
                  <td className="px-6 py-4.5 whitespace-nowrap text-xs font-black text-[#0B1728]">
                    {s.patientAlias}
                  </td>
                  <td className="px-6 py-4.5 whitespace-nowrap">
                    <QualityBadge status={s.qualityStatus} score={s.imageQuality?.score} />
                  </td>
                  <td className="px-6 py-4.5 whitespace-nowrap">
                    {typeof s.drGrade === 'object' ? (
                      <DRGradeBadge grade={s.drGrade.drGrade} label={s.drGrade.drGradeLabel} />
                    ) : (
                      <DRGradeBadge grade={s.drGrade as any} label={s.drGradeLabel} />
                    )}
                  </td>
                  <td className="px-6 py-4.5 whitespace-nowrap">
                    <StatusIndicator status={s.reviewStatus === 'REVIEW_REQUIRED' ? 'PENDING' : 'COMPLETED'} />
                  </td>
                  <td className="px-6 py-4.5 whitespace-nowrap text-right">
                    <Link
                      href={`/screening/${s.screeningId}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#EEF2F7] hover:from-[#EEF2F7] hover:to-[#2563EB] border border-slate-200 text-xs font-black text-[#0B1728] transition-all shadow-sm"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </TableShell>
        </div>

      </div>
    </main>
  );
}
