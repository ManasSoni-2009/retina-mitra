'use client';

import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { TableShell } from '@/components/TableShell';
import { DRGradeBadge } from '@/components/DRGradeBadge';
import { useSessionStore } from '@/hooks/useSessionStore';
import { ArrowRight, CheckCircle2, UserCheck } from 'lucide-react';

export default function ReviewPage() {
  const { casesRequiringReview } = useSessionStore();

  return (
    <main className="min-h-screen bg-[#FFFFFF] pb-24 pt-20 text-[#0B1728] relative overflow-hidden">
      
      {/* Ambient glass blooms */}
      <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-[#2563EB]/30 to-[#059669]/25 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <PageHeader 
          title="Specialist Review Queue" 
          subtitle="Cases escalated by the AI triage engine requiring ophthalmologist verification, grading confirmation, or clinical override."
          badge={`${casesRequiringReview.length} PENDING VERIFICATION`}
        />

        <div className="glass-panel overflow-hidden shadow-2xl">
          {casesRequiringReview.length === 0 ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#059669] to-[#556958] text-[#FFFFFF] flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-[#0B1728]">Queue is Clear</h3>
              <p className="text-xs text-[#3C5880] max-w-md mx-auto font-bold">
                No screenings currently require specialist intervention. All cases have been confirmed or triaged as routine.
              </p>
            </div>
          ) : (
            <TableShell headers={['Screening Date / Time', 'Patient Alias & ID', 'AI ICDR Result', 'Escalation Reason', 'Action']}>
              {casesRequiringReview.map((item) => {
                const s = item.screening;
                return (
                  <tr key={item.caseId} className="border-b border-slate-200 hover:bg-gradient-to-r hover:from-white/80 hover:to-[#2563EB]/20 transition-colors">
                    <td className="px-6 py-4.5 whitespace-nowrap text-xs text-[#0B1728] font-mono font-bold">
                      {new Date(s.createdAt).toLocaleDateString()}<br/>
                      <span className="text-[#3C5880]">{new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <div className="text-xs font-black text-[#0B1728]">{s.patientAlias}</div>
                      <div className="text-[10px] font-mono text-[#3C5880] font-black">{s.screeningId}</div>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      {typeof s.drGrade === 'object' ? (
                        <DRGradeBadge grade={s.drGrade.drGrade} label={s.drGrade.drGradeLabel} />
                      ) : (
                        <DRGradeBadge grade={s.drGrade as any} label={s.drGradeLabel} />
                      )}
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="text-xs text-[#0B1728] font-black bg-gradient-to-r from-white to-[#F8FAFC] px-3.5 py-1.5 rounded-full border border-slate-200 inline-block shadow-xs">
                        {typeof s.confidence === 'object' ? s.confidence.humanReviewReason : 'Confidence threshold not met.'}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-right">
                      <Link 
                        href={`/screening/${s.screeningId}`} 
                        className="btn-sand-primary text-xs py-2 px-4 shadow-md"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Perform Review</span>
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
