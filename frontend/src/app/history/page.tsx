'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { TableShell } from '@/components/TableShell';
import { DRGradeBadge } from '@/components/DRGradeBadge';
import { QualityBadge } from '@/components/QualityBadge';
import { StatusIndicator } from '@/components/StatusIndicator';
import { useSessionStore } from '@/hooks/useSessionStore';
import { Search, ArrowRight, Inbox, PlusCircle } from 'lucide-react';

export default function HistoryPage() {
  const { screenedCases } = useSessionStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL');

  const filteredCases = screenedCases.filter((item) => {
    const s = item.screening;
    const matchesSearch =
      s.screeningId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.patientAlias.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'REFERABLE') return s.referable;
    if (filter === 'UNGRADABLE') return s.qualityStatus === 'UNGRADABLE';
    if (filter === 'NEEDS_REVIEW') return s.requiresHumanReview && s.reviewStatus === 'REVIEW_REQUIRED';

    return true;
  });

  return (
    <main className="min-h-screen bg-[#FFFFFF] pb-24 pt-20 text-[#0B1728] relative overflow-hidden">
      
      {/* Ambient glass blooms */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-[#2563EB]/30 to-[#059669]/25 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <PageHeader 
          title="Session Screening History" 
          subtitle="Audit log of patient screenings, quality gate assessments, and specialist triage decisions in this session."
          badge="SESSION AUDIT"
          actions={
            <Link
              href="/screening/new"
              className="btn-sand-primary"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Start Screening</span>
            </Link>
          }
        />

        {/* Search & Filter Bar with Glassmorphic styling */}
        {screenedCases.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3C5880]" />
              <input 
                type="text" 
                placeholder="Search by Patient Alias or Case ID…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gradient-to-r from-white/95 to-[#F8FAFC]/90 border border-slate-200 rounded-2xl text-xs font-bold text-[#0B1728] placeholder:text-[#3C5880] focus:outline-none focus:border-[#0B1728] shadow-md transition backdrop-blur-xl"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
              {['ALL', 'REFERABLE', 'NEEDS_REVIEW', 'UNGRADABLE'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2.5 text-xs font-black rounded-2xl border whitespace-nowrap transition-all shadow-sm ${
                    filter === f 
                      ? 'bg-gradient-to-r from-[#0B1728] to-[#10213E] text-[#FFFFFF] border-[#0B1728] shadow-md' 
                      : 'bg-gradient-to-r from-white/90 to-[#F8FAFC]/80 border-slate-200 text-[#3C5880] hover:bg-white hover:text-[#0B1728]'
                  }`}
                >
                  {f.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Records Table */}
        <div className="glass-panel overflow-hidden shadow-2xl">
          {screenedCases.length === 0 ? (
            <div className="py-24 px-6 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B1728] to-[#10213E] text-[#2563EB] flex items-center justify-center mx-auto shadow-lg">
                <Inbox className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-[#0B1728]">No screenings yet.</h3>
                <p className="text-xs text-[#3C5880] leading-relaxed font-bold">
                  Start with a prepared retinal case or upload a fundus photograph to see your active session history.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/screening/new"
                  className="btn-sand-primary"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Launch New Screening</span>
                </Link>
              </div>
            </div>
          ) : (
            <TableShell headers={['Screening ID', 'Patient Alias', 'Quality Status', 'ICDR Result', 'Review Status', 'Timestamp', 'Action']}>
              {filteredCases.map((item) => {
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
                    <td className="px-6 py-4.5 whitespace-nowrap font-mono text-[11px] text-[#3C5880] font-bold">
                      {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-right">
                      <Link
                        href={`/screening/${s.screeningId}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#EEF2F7] hover:from-[#EEF2F7] hover:to-[#2563EB] border border-slate-200 text-xs font-black text-[#0B1728] transition-all shadow-xs"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </TableShell>
          )}
        </div>
      </div>
    </main>
  );
}
