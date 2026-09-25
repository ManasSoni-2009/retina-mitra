'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DEMO_CASES, DemoCaseConfig, demoCaseToScreening, getDemoCase } from '@/data/prototypeCases';
import { useSessionStore } from '@/hooks/useSessionStore';
import { generateReport } from '@/lib/generateReport';
import { CanvasImageViewer } from '@/components/CanvasImageViewer';
import { sound } from '@/lib/sound';
import {
  UploadCloud,
  CheckCircle2,
  Eye,
  Activity,
  RefreshCw,
  UserCheck,
  Download,
  ShieldCheck,
  ArrowRight,
  Flame,
  AlertTriangle,
} from 'lucide-react';

function ScreeningInner() {
  const searchParams = useSearchParams();
  const caseParam = searchParams?.get('case');
  const { screenCase, submitReview, markReportGenerated } = useSessionStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialCase = (caseParam && getDemoCase(caseParam)) || DEMO_CASES[2];
  const [selectedCase, setSelectedCase] = useState<DemoCaseConfig>(initialCase);
  const [screenState, setScreenState] = useState<'idle' | 'scanning' | 'result'>('idle');
  const [scanStepIndex, setScanStepIndex] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [reviewerNote, setReviewerNote] = useState<string>('');
  const [reviewFeedback, setReviewFeedback] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  useEffect(() => {
    if (caseParam) {
      const found = getDemoCase(caseParam);
      if (found) {
        setSelectedCase(found);
      }
    }
  }, [caseParam]);

  const scanSequence = [
    'OpenCV Quality Gate: Evaluating focus variance & glare...',
    'CLAHE Enhancement: Normalizing green-channel illumination...',
    'Vessel Segmentation: Extracting morphological vascular tree...',
    'EfficientNet-B0: Computing 5-class ICDR severity...',
    'Grad-CAM: Generating spatial attention gradient hooks...',
    'Confidence Calibration: Evaluating prediction certainty & triage threshold...',
  ];

  const handleStartScan = (dc?: DemoCaseConfig) => {
    sound.playClick(900);
    const targetCase = dc || selectedCase;
    setSelectedCase(targetCase);
    setScreenState('scanning');
    setScanStepIndex(0);
    setReviewFeedback(null);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setScanStepIndex(current);
      sound.playHover(400 + current * 80);
      if (current >= scanSequence.length) {
        clearInterval(interval);
        setTimeout(() => {
          sound.playClick(1000);
          setScreenState('result');
          screenCase(targetCase);
        }, 350);
      }
    }, 320);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUploadFile(file);
  };

  const handleUploadFile = (file: File) => {
    sound.playClick(780);
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const userScan: DemoCaseConfig = {
        ...DEMO_CASES[2],
        screeningId: `RM-USR-${Date.now().toString().slice(-4)}`,
        patientAlias: `PAT-${file.name.replace(/\.[^/.]+$/, '').slice(0, 8).toUpperCase()}`,
        rawImageUrl: src,
        enhancedImageUrl: src,
        vesselMapUrl: '/prototype-cases/rm-003/vessels.png',
        gradcamUrl: '/prototype-cases/rm-003/gradcam.png',
        lesionOverlayUrl: '/prototype-cases/rm-003/evidence.png',
        combinedEvidenceUrl: '/prototype-cases/rm-003/combined.png',
      };
      setSelectedCase(userScan);
      handleStartScan(userScan);
    };
    reader.readAsDataURL(file);
  };

  const handleReviewAction = (
    action: 'CONFIRMED' | 'RE_REVIEW' | 'UNGRADABLE' | 'OVERRIDDEN',
    label: string
  ) => {
    sound.playClick(850);
    const screening = demoCaseToScreening(selectedCase);
    submitReview(screening.screeningId, {
      reviewerId: 'DR-SPECIALIST-01',
      action,
      comments: reviewerNote || `Clinical action recorded: ${label}`,
      reviewedAt: new Date().toISOString(),
    });
    setReviewFeedback(`Clinical action registered: ${label}`);
    setTimeout(() => setReviewFeedback(null), 4000);
  };

  const handleDownloadPDF = async () => {
    sound.playClick(950);
    setIsDownloading(true);
    try {
      const screening = demoCaseToScreening(selectedCase);
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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] pt-24 sm:pt-32 pb-28 sm:pb-32 px-4 sm:px-8 max-w-[1360px] mx-auto selection:bg-[var(--ink)] selection:text-[var(--accent)]">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-[var(--ink)] mb-8 sm:mb-10">
        <div>
          <div className="font-mono text-xs tracking-widest uppercase text-[var(--ink-soft)] mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--ink)] animate-pulse" />
            Decision Support Intake
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase">
            Retinal Screening &amp; Inference
          </h1>
        </div>

        {screenState === 'result' && (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setScreenState('idle');
              setReviewFeedback(null);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border-2 border-[var(--ink)] bg-[var(--paper)] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[3px_3px_0_var(--ink)]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Select Another Case</span>
          </button>
        )}
      </div>

      {/* ─── STAGE 1: INTAKE DROPZONE & PRECONFIGURED BENCHMARK PASSES ─── */}
      {screenState === 'idle' && (
        <div className="space-y-8 sm:space-y-12">
          {/* Tactical Drag & Drop Box */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => {
              sound.playClick(600);
              fileInputRef.current?.click();
            }}
            className={`p-6 sm:p-16 rounded-3xl border-[2.5px] border-dashed border-[var(--ink)] text-center cursor-pointer transition-all duration-300 ${
              isDragOver
                ? 'bg-[var(--accent)] scale-[1.01] shadow-[8px_8px_0_var(--ink)]'
                : 'bg-[var(--paper)] hover:bg-[var(--accent)]/40 shadow-[6px_6px_0_var(--ink)]'
            }`}
            data-cursor-label="DROP"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadFile(file);
              }}
            />
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[var(--ink)] text-[var(--accent)] flex items-center justify-center mx-auto shadow-lg">
                <UploadCloud className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold">Upload Retinal Fundus Photograph</h3>
                <p className="text-xs sm:text-sm text-[var(--ink-soft)] mt-1 font-medium">
                  Tap to browse files or drag and drop 45° posterior pole retinal scan (.jpg, .png).
                </p>
              </div>
              <div className="inline-block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-full bg-[var(--ink)] text-[var(--accent)] font-bold">
                Automated OpenCV Quality Gate Triggered on Intake
              </div>
            </div>
          </div>

          {/* 5 Prototype Clinical Cases */}
          <div>
            <div className="flex justify-between items-end mb-4 sm:mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight">
                  Or Test Demonstration Cases
                </h2>
                <p className="font-mono text-[11px] sm:text-xs text-[var(--ink-soft)] mt-0.5">
                  Select a representative case with documented findings &amp; clinical severity:
                </p>
              </div>
              <span className="font-mono text-xs uppercase font-bold text-[var(--ink)] hidden sm:inline">
                5 CASload Ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {DEMO_CASES.map((c) => {
                const isSelected = selectedCase.screeningId === c.screeningId;
                return (
                  <div
                    key={c.screeningId}
                    onClick={() => {
                      sound.playClick(720);
                      setSelectedCase(c);
                    }}
                    className={`p-4 sm:p-5 rounded-2xl border-[2.5px] border-[var(--ink)] cursor-pointer transition-all flex flex-col justify-between select-none ${
                      isSelected
                        ? 'bg-[var(--ink)] text-[var(--accent)] shadow-[6px_6px_0_var(--ink)] scale-[1.01]'
                        : 'bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--accent)]/30 shadow-[3px_3px_0_var(--ink)]'
                    }`}
                    data-cursor-label="SELECT"
                  >
                    <div>
                      <div className="flex justify-between items-center font-mono text-[10px] uppercase font-bold mb-2">
                        <span>{c.demoNumber}</span>
                        <span className="underline">{c.drGradeLabel}</span>
                      </div>
                      <div className="font-bold text-sm mb-1">{c.title}</div>
                      <p className="text-[11px] opacity-80 line-clamp-2">{c.description}</p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-current/20 flex items-center justify-between font-mono text-[10px]">
                      <span>Quality: {c.qualityStatus}</span>
                      <span className="font-bold">{c.confidenceValue}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Launch Button */}
            <div className="mt-6 sm:mt-8 text-center">
              <button
                type="button"
                onClick={() => handleStartScan()}
                className="w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[var(--ink)] text-[var(--accent)] font-extrabold text-sm sm:text-base tracking-tight shadow-[6px_6px_0_var(--ink)] hover:scale-105 active:scale-95 transition-all"
                data-cursor-label="EXECUTE"
              >
                Start Automated Inference Pipeline ({selectedCase.demoNumber}) →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── STAGE 2: PROCEDURAL SCANNING STATE ─── */}
      {screenState === 'scanning' && (
        <div className="py-16 text-center max-w-xl mx-auto space-y-8">
          <div className="w-20 h-20 rounded-full border-4 border-[var(--ink)] border-t-[var(--accent)] animate-spin mx-auto flex items-center justify-center">
            <Eye className="w-8 h-8 text-[var(--ink)]" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">
              Executing Inference Pipeline
            </h2>
            <p className="font-mono text-xs text-[var(--ink-soft)] mt-1">
              Case: {selectedCase.patientAlias} · Model: EfficientNet-B0 + Grad-CAM
            </p>
          </div>

          <div className="p-6 rounded-3xl border-[2.5px] border-[var(--ink)] bg-[var(--paper)] shadow-[6px_6px_0_var(--ink)] space-y-3 text-left font-mono text-xs">
            {scanSequence.map((step, idx) => {
              const isDone = idx < scanStepIndex;
              const isCurrent = idx === scanStepIndex;
              return (
                <div
                  key={step}
                  className={`flex items-center gap-3 transition-opacity ${
                    isDone
                      ? 'text-[var(--ok)] font-bold'
                      : isCurrent
                      ? 'text-[var(--ink)] font-bold animate-pulse'
                      : 'text-[var(--ink-mute)] opacity-40'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">
                    {isDone ? '✓' : idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── STAGE 3: INTERACTIVE MULTI-LAYER RESULT WORKBENCH ─── */}
      {screenState === 'result' && (
        <div className="space-y-8">
          {/* Feedback Toast */}
          {reviewFeedback && (
            <div className="p-4 rounded-2xl bg-[var(--ok)] text-[var(--ink)] font-bold text-sm border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] animate-in fade-in slide-in-from-top-2">
              {reviewFeedback}
            </div>
          )}

          {/* Diagnostic Summary Header Card */}
          <div className="p-6 sm:p-8 rounded-3xl border-[2.5px] border-[var(--ink)] bg-[var(--paper)] shadow-[6px_6px_0_var(--ink)] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-[var(--ink-soft)] mb-1">
                PATIENT REF: {selectedCase.patientAlias} · {selectedCase.screeningId}
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[var(--ink)]">
                {selectedCase.drGradeLabel}
              </h2>
              <p className="text-sm text-[var(--ink-soft)] font-medium mt-1 max-w-xl">
                {selectedCase.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 font-mono text-xs">
              <div className="p-3 rounded-2xl border-2 border-[var(--ink)] bg-[var(--bg)] text-center min-w-[110px]">
                <div className="font-extrabold text-xl">{selectedCase.confidenceValue}%</div>
                <div className="text-[10px] uppercase text-[var(--ink-soft)]">Confidence</div>
              </div>
              <div className="p-3 rounded-2xl border-2 border-[var(--ink)] bg-[var(--bg)] text-center min-w-[110px]">
                <div className="font-extrabold text-xl text-[var(--ok)]">
                  {selectedCase.qualityStatus}
                </div>
                <div className="text-[10px] uppercase text-[var(--ink-soft)]">Quality Gate</div>
              </div>
            </div>
          </div>

          {/* Interactive Multi-Layer Canvas */}
          <CanvasImageViewer
            evidence={{
              rawImageUrl: selectedCase.rawImageUrl,
              enhancedImageUrl: selectedCase.enhancedImageUrl,
              vesselMapUrl: selectedCase.vesselMapUrl,
              gradcamUrl: selectedCase.gradcamUrl,
              lesionOverlayUrl: selectedCase.lesionOverlayUrl,
              combinedEvidenceUrl: selectedCase.combinedEvidenceUrl,
            }}
          />

          {/* Specialist HITL Actions & Clinical Export Bar */}
          <div className="p-6 sm:p-8 rounded-3xl border-[2.5px] border-[var(--ink)] bg-[var(--paper)] shadow-[6px_6px_0_var(--ink)] space-y-6">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight">
                Specialist Decision Sign-off &amp; Audit Trail
              </h3>
              <p className="font-mono text-xs text-[var(--ink-soft)] mt-0.5">
                Record ophthalmologist rationale before issuing official referral documents:
              </p>
            </div>

            <input
              type="text"
              value={reviewerNote}
              onChange={(e) => setReviewerNote(e.target.value)}
              placeholder="Enter specialist clinical observation or override reasoning..."
              className="w-full px-4 py-3 rounded-xl border-2 border-[var(--ink)] bg-[var(--bg)] font-mono text-xs text-[var(--ink)] placeholder:text-[var(--ink-mute)] focus:outline-none focus:ring-2 focus:ring-[var(--ink)]"
            />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-[var(--ink)]/20">
              <div className="grid grid-cols-1 xs:grid-cols-3 sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleReviewAction('CONFIRMED', 'Confirmed Grade')}
                  className="px-4 py-2.5 rounded-full border-2 border-[var(--ink)] bg-[var(--ok)] text-[var(--ink)] font-bold text-xs uppercase hover:scale-105 active:scale-95 transition-all shadow-[2px_2px_0_var(--ink)] text-center"
                  data-cursor-label="CONFIRM"
                >
                  ✓ Sign-off
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewAction('OVERRIDDEN', 'Overridden Grade')}
                  className="px-4 py-2.5 rounded-full border-2 border-[var(--ink)] bg-amber-400 text-[var(--ink)] font-bold text-xs uppercase hover:scale-105 active:scale-95 transition-all shadow-[2px_2px_0_var(--ink)] text-center"
                  data-cursor-label="OVERRIDE"
                >
                  Override
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewAction('UNGRADABLE', 'Flagged Ungradable')}
                  className="px-4 py-2.5 rounded-full border-2 border-[var(--ink)] bg-rose-400 text-[var(--ink)] font-bold text-xs uppercase hover:scale-105 active:scale-95 transition-all shadow-[2px_2px_0_var(--ink)] text-center"
                  data-cursor-label="RETAKE"
                >
                  Retake
                </button>
              </div>

              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[var(--ink)] text-[var(--accent)] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[4px_4px_0_var(--ink)]"
                data-cursor-label="PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isDownloading ? 'Exporting...' : 'Export Referral PDF (English)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScreeningNewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center font-mono text-sm uppercase">
          Loading Intake Portal...
        </div>
      }
    >
      <ScreeningInner />
    </Suspense>
  );
}
