'use client';

import React from 'react';
import Link from 'next/link';
import { useSessionStore } from '@/hooks/useSessionStore';
import { sound } from '@/lib/sound';
import {
  ArrowRight,
  CheckCircle2,
  UserCheck,
  ShieldAlert,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';

export default function ReviewPage() {
  const { casesRequiringReview } = useSessionStore();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] pt-24 sm:pt-28 pb-28 sm:pb-32 px-4 sm:px-8 max-w-[1400px] mx-auto selection:bg-[var(--ink)] selection:text-[var(--accent)]">
      {/* ─── HEADER ─── */}
      <div className="pb-6 border-b-2 border-[var(--ink)] mb-10">
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
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Specialist Audit Workstation
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight">
              Human-in-the-Loop Review Queue
            </h1>
          </div>
          <span className="font-mono text-xs px-3.5 py-1.5 rounded-full border-2 border-[var(--ink)] bg-[var(--paper)] font-bold uppercase">
            {casesRequiringReview.length} Pending Specialist Sign-Off
          </span>
        </div>
      </div>

      {/* ─── WORKSTATION QUEUE TABLE ─── */}
      <div className="rounded-3xl border-[2.5px] border-[var(--ink)] bg-[var(--paper)] p-6 sm:p-8 shadow-[8px_8px_0_var(--ink)]">
        {casesRequiringReview.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[var(--ok)] text-[var(--ink)] flex items-center justify-center mx-auto border-2 border-[var(--ink)] shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold uppercase tracking-tight">Triage Queue Clear</h3>
            <p className="font-mono text-xs text-[var(--ink-soft)] max-w-md mx-auto">
              All active camp screenings have been verified by ophthalmologists. No borderline cases awaiting sign-off.
            </p>
            <div className="pt-2">
              <Link
                href="/screening/new"
                onClick={() => sound.playClick()}
                className="inline-block px-6 py-3 rounded-full bg-[var(--ink)] text-[var(--accent)] font-bold text-xs uppercase shadow-[3px_3px_0_var(--ink)] no-underline"
              >
                Intake New Case
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile View: High-Visibility Review Cards */}
            <div className="md:hidden flex flex-col gap-3">
              {casesRequiringReview.map((item) => {
                const s = item.screening;
                const label =
                  typeof s.drGrade === 'object'
                    ? s.drGrade.drGradeLabel
                    : s.drGradeLabel || `Grade ${s.drGrade}`;

                return (
                  <div
                    key={item.caseId}
                    className="p-4 rounded-2xl border-2 border-[var(--ink)] bg-[var(--bg)] shadow-[3px_3px_0_var(--ink)] flex flex-col gap-2.5"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-mono font-bold text-xs">{s.patientAlias}</div>
                        <div className="font-mono text-[10px] text-[var(--ink-mute)]">{s.screeningId}</div>
                      </div>
                      <span className="font-mono text-[10px] text-[var(--ink-mute)]">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded bg-[var(--ink)] text-[var(--accent)] font-mono text-xs font-bold">
                        {label}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-600/30 text-amber-900 font-mono text-[10px] flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>
                        {typeof s.confidence === 'object'
                          ? s.confidence.humanReviewReason
                          : 'Confidence threshold requires specialist review'}
                      </span>
                    </div>

                    <Link
                      href={`/screening/${s.screeningId}`}
                      onClick={() => sound.playClick(850)}
                      className="w-full py-2.5 rounded-xl bg-[var(--ink)] text-[var(--accent)] font-bold text-xs uppercase flex items-center justify-center gap-1.5 no-underline shadow-sm active:scale-98"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Audit &amp; Sign-off</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Desktop View: Full Audit Table (Identical to PC Design) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-[var(--ink)] font-mono text-[11px] uppercase tracking-wider text-[var(--ink-mute)]">
                    <th className="py-3 px-4">Screening Date</th>
                    <th className="py-3 px-4">Patient Ref</th>
                    <th className="py-3 px-4">Model Output</th>
                    <th className="py-3 px-4">Escalation Trigger</th>
                    <th className="py-3 px-4 text-right">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-b border-[var(--ink)]/20 text-sm">
                  {casesRequiringReview.map((item) => {
                    const s = item.screening;
                    const label =
                      typeof s.drGrade === 'object'
                        ? s.drGrade.drGradeLabel
                        : s.drGradeLabel || `Grade ${s.drGrade}`;

                    return (
                      <tr key={item.caseId} className="hover:bg-[var(--bg)]/50 transition-colors">
                        <td className="py-4 px-4 font-mono text-xs">
                          {new Date(s.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 font-mono text-xs font-bold">
                          <div>{s.patientAlias}</div>
                          <div className="text-[10px] text-[var(--ink-mute)]">{s.screeningId}</div>
                        </td>
                        <td className="py-4 px-4 font-bold">
                          <span className="px-2.5 py-1 rounded bg-[var(--ink)] text-[var(--accent)] font-mono text-xs">
                            {label}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono text-xs">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-600 bg-amber-50 text-amber-900 font-bold">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            {typeof s.confidence === 'object'
                              ? s.confidence.humanReviewReason
                              : 'Confidence threshold requires specialist review'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Link
                            href={`/screening/${s.screeningId}`}
                            onClick={() => sound.playClick(850)}
                            className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[var(--ink)] text-[var(--accent)] font-bold text-xs uppercase hover:scale-105 active:scale-95 transition-all shadow-[2px_2px_0_var(--ink)] no-underline"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Review</span>
                            <ArrowRight className="w-3.5 h-3.5" />
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
