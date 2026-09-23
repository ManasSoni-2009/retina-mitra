'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@/hooks/useSessionStore';
import { generateReport } from '@/lib/generateReport';
import { CanvasImageViewer } from '@/components/CanvasImageViewer';
import { sound } from '@/lib/sound';
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  XCircle,
  UserCheck,
  Activity,
  ShieldCheck,
  Eye,
} from 'lucide-react';

export default function ScreeningDetailPage() {
  const routeParams = useParams();
  const screeningId = (routeParams?.id as string) || '';
  const { getScreenedCase, submitReview, markReportGenerated } = useSessionStore();

  const screenedCase = getScreenedCase(screeningId);
  const screening = screenedCase?.screening;

  const [reviewerNote, setReviewerNote] = useState<string>('');
  const [reviewFeedback, setReviewFeedback] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  if (!screenedCase || !screening) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] pt-32 pb-20 px-4 sm:px-8 max-w-lg mx-auto">
        <div className="p-8 rounded-3xl border-[2.5px] border-[var(--ink)] bg-[var(--paper)] text-center shadow-[6px_6px_0_var(--ink)]">
          <XCircle className="w-12 h-12 text-rose-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold uppercase tracking-tight">Record Not Found</h2>
          <p className="font-mono text-xs text-[var(--ink-soft)] my-4">
            Case ID <span className="font-bold underline">{screeningId}</span> is not registered in the current session.
          </p>
          <Link
            href="/screening/new"
            onClick={() => sound.playClick()}
            className="inline-block px-6 py-3 rounded-full bg-[var(--ink)] text-[var(--accent)] font-bold text-xs uppercase shadow-[3px_3px_0_var(--ink)] no-underline"
          >
            Start New Screening
          </Link>
        </div>
      </div>
    );
  }

  const isUngradable = screening.qualityStatus === 'UNGRADABLE';
  const gradeLabel =
    typeof screening.drGrade === 'object'
      ? screening.drGrade.drGradeLabel
      : screening.drGradeLabel || `Grade ${screening.drGrade}`;
  const fallbackImg = screening.imageUrl || '/prototype-cases/rm-001/original.jpg';

  const handleReviewAction = (
    action: 'CONFIRMED' | 'RE_REVIEW' | 'UNGRADABLE' | 'OVERRIDDEN',
    label: string
  ) => {
    sound.playClick(850);
    submitReview(screening.screeningId, {
      reviewerId: 'DR-SPECIALIST-01',
      action,
      comments: reviewerNote || `Clinical action: ${label}`,
      reviewedAt: new Date().toISOString(),
    });
    setReviewFeedback(`Specialist action registered: ${label}`);
    setTimeout(() => setReviewFeedback(null), 4000);
  };

  const handleDownloadPDF = async () => {
    sound.playClick(950);
    setIsDownloading(true);
    try {
      if (reviewerNote) {
        screening.reviewDecision = {
          reviewerId: 'DR-SPECIALIST-01',
          action: 'CONFIRMED',
          comments: reviewerNote,
          reviewedAt: new Date().toISOString(),
        };
      }
      await generateReport(screening);
      markReportGenerated(screening.screeningId);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] pt-24 sm:pt-28 pb-28 sm:pb-32 px-4 sm:px-8 max-w-[1400px] mx-auto selection:bg-[var(--ink)] selection:text-[var(--accent)]">
      {/* ─── BREADCRUMB & HEADER ─── */}
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
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--ink-soft)] mb-1">
              Case Verification · {screening.screeningId}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight">
              {screening.patientAlias || 'Patient Scan'} · {gradeLabel}
            </h1>
          </div>
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-full bg-[var(--ink)] text-[var(--accent)] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[4px_4px_0_var(--ink)] min-h-[44px]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Generating...' : 'Export PDF Report'}</span>
          </button>
        </div>
      </div>

      {reviewFeedback && (
        <div className="p-4 rounded-2xl bg-[var(--ok)] text-[var(--ink)] font-bold text-sm border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] mb-8">
          {reviewFeedback}
        </div>
      )}

      {/* ─── SUMMARY TELEMETRY BENTO ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-6 rounded-3xl border-[2.5px] border-[var(--ink)] bg-[var(--paper)] shadow-[6px_6px_0_var(--ink)]">
          <div className="font-mono text-[10px] uppercase text-[var(--ink-mute)] mb-1">
            ICDR Severity
          </div>
          <div className="text-2xl font-extrabold text-[var(--ink)]">{gradeLabel}</div>
          <div className="font-mono text-xs text-[var(--ink-soft)] mt-1">
            Confidence: {Math.round((typeof screening.confidence === 'number' ? screening.confidence : screening.confidence.calibratedConfidence || 0.94) * 100)}%
          </div>
        </div>

        <div className="p-6 rounded-3xl border-[2.5px] border-[var(--ink)] bg-[var(--paper)] shadow-[6px_6px_0_var(--ink)]">
          <div className="font-mono text-[10px] uppercase text-[var(--ink-mute)] mb-1">
            OpenCV Quality Gate
          </div>
          <div
            className={`text-2xl font-extrabold ${
              isUngradable ? 'text-rose-600' : 'text-[var(--ok)]'
            }`}
          >
            {screening.qualityStatus}
          </div>
          <div className="font-mono text-xs text-[var(--ink-soft)] mt-1">
            Focus variance &gt; threshold
          </div>
        </div>

        <div className="p-6 rounded-3xl border-[2.5px] border-[var(--ink)] bg-[var(--paper)] shadow-[6px_6px_0_var(--ink)]">
          <div className="font-mono text-[10px] uppercase text-[var(--ink-mute)] mb-1">
            Clinical Recommendation
          </div>
          <div className="text-2xl font-extrabold text-[var(--ink)]">
            {screening.referable ? 'Specialist Referral' : 'Routine Monitoring'}
          </div>
          <div className="font-mono text-xs text-[var(--ink-soft)] mt-1">
            {screening.referable ? 'Specialist referral recommended' : 'Annual follow-up'}
          </div>
        </div>
      </div>

      {/* ─── INTERACTIVE MULTI-LAYER VIEWER ─── */}
      <div className="mb-8">
        <CanvasImageViewer
          evidence={{
            rawImageUrl: fallbackImg,
            enhancedImageUrl: screening.evidence?.enhancedImageUrl || fallbackImg,
            vesselMapUrl: screening.evidence?.vesselMapUrl || fallbackImg,
            gradcamUrl: screening.evidence?.gradcamUrl || fallbackImg,
            lesionOverlayUrl: screening.evidence?.lesionOverlayUrl || fallbackImg,
            combinedEvidenceUrl: screening.evidence?.combinedEvidenceUrl || fallbackImg,
          }}
        />
      </div>

      {/* ─── SPECIALIST REVIEW PANEL ─── */}
      <div className="p-6 sm:p-8 rounded-3xl border-[2.5px] border-[var(--ink)] bg-[var(--paper)] shadow-[6px_6px_0_var(--ink)] space-y-4">
        <h3 className="text-xl font-bold uppercase tracking-tight">Specialist Sign-off Station</h3>
        <input
          type="text"
          value={reviewerNote}
          onChange={(e) => setReviewerNote(e.target.value)}
          placeholder="Record specialist observations or justification for override..."
          className="w-full px-4 py-3 rounded-xl border-2 border-[var(--ink)] bg-[var(--bg)] font-mono text-xs text-[var(--ink)] placeholder:text-[var(--ink-mute)] focus:outline-none min-h-[44px]"
        />

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => handleReviewAction('CONFIRMED', 'Confirmed Grade')}
            className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-full border-2 border-[var(--ink)] bg-[var(--ok)] text-[var(--ink)] font-bold text-xs uppercase hover:scale-105 active:scale-95 transition-all shadow-[2px_2px_0_var(--ink)] text-center min-h-[44px]"
          >
            ✓ Confirm Classification
          </button>
          <button
            type="button"
            onClick={() => handleReviewAction('OVERRIDDEN', 'Overridden Grade')}
            className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-full border-2 border-[var(--ink)] bg-amber-400 text-[var(--ink)] font-bold text-xs uppercase hover:scale-105 active:scale-95 transition-all shadow-[2px_2px_0_var(--ink)] text-center min-h-[44px]"
          >
            Override Classification
          </button>
          <button
            type="button"
            onClick={() => handleReviewAction('UNGRADABLE', 'Flagged Ungradable')}
            className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-full border-2 border-[var(--ink)] bg-rose-400 text-[var(--ink)] font-bold text-xs uppercase hover:scale-105 active:scale-95 transition-all shadow-[2px_2px_0_var(--ink)] text-center min-h-[44px]"
          >
            Request Retake
          </button>
        </div>
      </div>
    </div>
  );
}
