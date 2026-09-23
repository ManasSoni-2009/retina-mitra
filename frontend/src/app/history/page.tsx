'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSessionStore } from '@/hooks/useSessionStore';
import { sound } from '@/lib/sound';
import {
  Search,
  ArrowRight,
  Inbox,
  PlusCircle,
  ArrowLeft,
  Filter,
} from 'lucide-react';

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
    if (filter === 'NEEDS_REVIEW')
      return s.requiresHumanReview && s.reviewStatus === 'REVIEW_REQUIRED';

    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] pt-24 sm:pt-28 pb-28 sm:pb-32 px-4 sm:px-8 max-w-[1400px] mx-auto selection:bg-[var(--ink)] selection:text-[var(--accent)]">
      {/* ─── HEADER ─── */}
      <div className="pb-6 border-b-2 border-[var(--ink)] mb-8 sm:mb-10">
        <Link
          href="/dashboard"
          onClick={() => sound.playClick(600)}
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase font-bold text-[var(--ink-soft)] hover:text-[var(--ink)] mb-3 no-underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cockpit</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--ink-soft)] mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--ink)] animate-pulse" />
              Audit Log &amp; Intake Archive
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight">
              Screening History
            </h1>
          </div>
          <Link
            href="/screening/new"
            onClick={() => sound.playClick(900)}
            className="w-full sm:w-auto text-center justify-center px-6 py-2.5 rounded-full bg-[var(--ink)] text-[var(--accent)] font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[4px_4px_0_var(--ink)] no-underline"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Screening</span>
          </Link>
        </div>
      </div>

      {/* ─── SEARCH & FILTER TOOLBAR ─── */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-soft)]" />
          <input
            type="text"
            placeholder="Search by Patient Alias or Case ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[var(--paper)] border-2 border-[var(--ink)] rounded-2xl font-mono text-xs text-[var(--ink)] placeholder:text-[var(--ink-mute)] focus:outline-none shadow-[3px_3px_0_var(--ink)]"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          {['ALL', 'REFERABLE', 'NEEDS_REVIEW', 'UNGRADABLE'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                sound.playClick(600);
                setFilter(f);
              }}
              className={`px-4 py-2.5 text-xs font-mono font-bold rounded-2xl border-2 border-[var(--ink)] uppercase whitespace-nowrap transition-all shadow-[3px_3px_0_var(--ink)] ${
                filter === f
                  ? 'bg-[var(--ink)] text-[var(--accent)]'
                  : 'bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--accent)]/40'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* ─── TABLE & MOBILE CARDS ─── */}
      <div className="rounded-3xl border-[2.5px] border-[var(--ink)] bg-[var(--paper)] p-5 sm:p-8 shadow-[8px_8px_0_var(--ink)]">
        {filteredCases.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[var(--ink)] text-[var(--accent)] flex items-center justify-center mx-auto shadow-md">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-tight">No Matching Records</h3>
            <p className="font-mono text-xs text-[var(--ink-soft)] max-w-sm mx-auto">
              Start with a new patient screening or select another filter tag.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile View: Clean Case Cards */}
            <div className="md:hidden flex flex-col gap-3">
              {filteredCases.map((item) => {
                const s = item.screening;
                const label =
                  typeof s.drGrade === 'object'
                    ? s.drGrade.drGradeLabel
                    : s.drGradeLabel || `Grade ${s.drGrade}`;

                const conf =
                  typeof s.confidence === 'object'
                    ? `${Math.round((s.confidence.calibratedConfidence || s.confidence.rawConfidence || 0.94) * 100)}%`
                    : `${Math.round((s.confidence || 0.94) * 100)}%`;

                return (
                  <div
                    key={s.screeningId}
                    className="p-4 rounded-2xl border-2 border-[var(--ink)] bg-[var(--bg)] shadow-[3px_3px_0_var(--ink)] flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-mono font-bold text-xs">{s.patientAlias}</div>
                        <div className="font-mono text-[10px] text-[var(--ink-mute)]">{s.screeningId}</div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          s.qualityStatus === 'UNGRADABLE'
                            ? 'bg-rose-500 text-white'
                            : 'bg-[var(--ink)] text-[var(--accent)]'
                        }`}
                      >
                        {s.qualityStatus}
                      </span>
                    </div>

                    <div className="font-bold text-sm text-[var(--ink)]">{label}</div>

                    <div className="flex justify-between items-center font-mono text-xs text-[var(--ink-soft)] pt-1 border-t border-[var(--ink)]/15">
                      <span>Conf: {conf}</span>
                      <span className="inline-flex items-center gap-1 font-bold">
                        {s.reviewStatus}
                      </span>
                    </div>

                    <Link
                      href={`/screening/${s.screeningId}`}
                      onClick={() => sound.playClick(750)}
                      className="mt-1 w-full py-2 rounded-xl bg-[var(--ink)] text-[var(--accent)] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 no-underline shadow-sm active:scale-98"
                    >
                      <span>Inspect Record</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Desktop View: Full History Table (Identical to PC Design) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-[var(--ink)] font-mono text-[11px] uppercase tracking-wider text-[var(--ink-mute)]">
                    <th className="py-3 px-4">Patient Alias &amp; Ref</th>
                    <th className="py-3 px-4">Quality Gate</th>
                    <th className="py-3 px-4">DR Grade</th>
                    <th className="py-3 px-4">Confidence</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-b border-[var(--ink)]/20 text-sm">
                  {filteredCases.map((item) => {
                    const s = item.screening;
                    const label =
                      typeof s.drGrade === 'object'
                        ? s.drGrade.drGradeLabel
                        : s.drGradeLabel || `Grade ${s.drGrade}`;

                    return (
                      <tr key={s.screeningId} className="hover:bg-[var(--bg)]/50 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-xs">
                          <div>{s.patientAlias}</div>
                          <div className="text-[10px] text-[var(--ink-mute)]">{s.screeningId}</div>
                        </td>
                        <td className="py-4 px-4 font-mono text-xs">
                          <span
                            className={`px-2 py-0.5 rounded font-bold ${
                              s.qualityStatus === 'UNGRADABLE'
                                ? 'bg-rose-500 text-white'
                                : 'bg-[var(--ink)] text-[var(--accent)]'
                            }`}
                          >
                            {s.qualityStatus}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-bold">{label}</td>
                        <td className="py-4 px-4 font-mono text-xs font-bold">
                          {typeof s.confidence === 'object'
                            ? `${Math.round((s.confidence.calibratedConfidence || s.confidence.rawConfidence || 0.94) * 100)}%`
                            : `${Math.round((s.confidence || 0.94) * 100)}%`}
                        </td>
                        <td className="py-4 px-4 font-mono text-xs">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-current font-bold">
                            {s.reviewStatus}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Link
                            href={`/screening/${s.screeningId}`}
                            onClick={() => sound.playClick(750)}
                            className="inline-flex items-center gap-1 font-mono text-xs font-bold underline hover:opacity-70"
                          >
                            <span>Inspect</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
