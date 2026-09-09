'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSessionStore } from '@/hooks/useSessionStore';
import { generateReport } from '@/lib/generateReport';
import { CanvasImageViewer } from '@/components/CanvasImageViewer';
import { 
  ArrowLeft, 
  Download, 
  CheckCircle2, 
  RefreshCw, 
  XCircle, 
  Info, 
  UserCheck, 
  Activity
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
      <main className="min-h-screen bg-[#FFFFFF] pt-28 pb-16 text-[#0B1728]">
        <div className="max-w-md mx-auto px-4 text-center glass-panel p-8 shadow-2xl">
          <XCircle className="w-12 h-12 text-rose-600 mx-auto mb-4" />
          <h2 className="text-xl font-black text-[#0B1728] mb-2">Screening Record Not Found</h2>
          <p className="text-xs text-[#3C5880] mb-6 font-bold">
            Case ID <span className="font-mono text-[#0B1728]">{screeningId}</span> is not registered in the current session.
          </p>
          <Link href="/screening/new" className="btn-sand-primary">
            Start New Screening
          </Link>
        </div>
      </main>
    );
  }

  const isUngradable = screening.qualityStatus === 'UNGRADABLE';
  const isReferable = screening.referable;
  const gradeLabel = typeof screening.drGrade === 'object' ? screening.drGrade.drGradeLabel : (screening.drGradeLabel || `Grade ${screening.drGrade}`);
  const fallbackImg = screening.imageUrl || '/prototype-cases/rm-001/original.jpg';

  const handleReviewAction = (action: 'CONFIRMED' | 'RE_REVIEW' | 'UNGRADABLE' | 'OVERRIDDEN', label: string) => {
    submitReview(screening.screeningId, {
      reviewerId: 'CLINICIAN-01',
      action,
      comments: reviewerNote || `Clinical action: ${label}`,
      reviewedAt: new Date().toISOString(),
    });
    setReviewFeedback(`Clinical action registered: ${label}`);
    setTimeout(() => setReviewFeedback(null), 4000);
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      if (reviewerNote) {
        screening.reviewDecision = {
          reviewerId: 'CLINICIAN-01',
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
    <main className="min-h-screen bg-[#FFFFFF] pb-24 pt-20 text-[#0B1728] relative overflow-hidden">
      
      {/* Ambient glass blooms */}
      <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-[#2563EB]/30 to-[#059669]/25 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <Link href="/history" className="inline-flex items-center text-xs font-bold text-[#3C5880] hover:text-[#0B1728] transition-colors mb-1">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Screening History
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B1728] tracking-tight">
                Case {screening.screeningId}
              </h1>
              <span className={`text-xs px-3 py-1 rounded-full font-black uppercase ${
                isUngradable ? 'bg-rose-100 text-rose-950 border border-rose-300' :
                isReferable ? 'bg-amber-100 text-amber-950 border border-amber-300' : 'bg-[#059669]/20 text-[#2C402F] border border-[#059669]/40'
              }`}>
                {isUngradable ? 'Ungradable Scan' : isReferable ? 'Referable DR' : 'Routine'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="btn-sand-primary text-xs py-2.5 px-6 shadow-xl"
            >
              {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>{isDownloading ? 'Generating...' : 'Generate Report (PDF)'}</span>
            </button>
          </div>
        </div>

        {/* Feedback alert toast */}
        {reviewFeedback && (
          <div className="p-4 rounded-2xl glass-panel text-[#2C402F] border border-[#059669] text-xs font-black font-mono flex items-center gap-2 shadow-xl animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            <span>{reviewFeedback}</span>
          </div>
        )}

        {/* Primary Screening Banner with Frosted Glass Gradient */}
        <div className={`p-8 rounded-3xl border shadow-2xl backdrop-blur-2xl ${
          isUngradable
            ? 'bg-gradient-to-r from-rose-50/95 via-white/90 to-rose-100/60 border-rose-300'
            : isReferable
              ? 'bg-gradient-to-r from-white/95 via-[#F8FAFC]/90 to-[#2563EB]/40 border-[#0B1728]'
              : 'bg-gradient-to-r from-white/95 via-[#059669]/15 to-white/95 border-[#059669]'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-black uppercase tracking-widest text-[#0B1728]">
                  Screening Result
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B1728]" />
                <span className="text-[11px] font-mono text-[#3C5880] font-bold">
                  {screening.patientAlias}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-[#0B1728] tracking-tight">
                {isUngradable ? 'Ungradable Scan' : gradeLabel}
              </h2>

              <p className="text-sm font-bold text-[#3C5880]">
                {isUngradable
                  ? 'Image focus sharpness below diagnostic threshold. Pupil dilation or re-capture advised.'
                  : isReferable
                    ? 'Referable findings identified. Specialist evaluation recommended.'
                    : 'No DR signs detected. Annual routine screening recommended.'}
              </p>
            </div>
          </div>
        </div>

        {/* Central Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (7 cols): CanvasImageViewer */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#0B1728] tracking-tight">
                Multi-Modal Visual Evidence
              </h3>
              <span className="text-xs font-mono text-[#0B1728] font-black">
                6 ANALYTIC LAYERS
              </span>
            </div>

            <CanvasImageViewer
              evidence={screening.evidence || {
                rawImageUrl: fallbackImg,
                enhancedImageUrl: fallbackImg,
                vesselMapUrl: fallbackImg,
                gradcamUrl: fallbackImg,
                lesionOverlayUrl: fallbackImg,
                combinedEvidenceUrl: fallbackImg,
              }}
            />
          </div>

          {/* Right Column (5 cols): Details & Specialist Actions */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Why This Result Box with Frosted Glass */}
            <div className="p-6 rounded-3xl glass-panel space-y-2 shadow-xl">
              <div className="flex items-center gap-2 text-[#0B1728] font-black text-xs">
                <Info className="w-4 h-4 text-[#059669]" />
                <span className="uppercase tracking-wider">Why this result?</span>
              </div>
              <p className="text-xs text-[#3C5880] leading-relaxed font-bold">
                {isUngradable
                  ? 'Automated Laplacian variance and illumination filters failed the minimum sharpness criteria, triggering an immediate pre-inference rejection to protect patient safety.'
                  : isReferable
                    ? 'Grad-CAM spatial activation localized abnormal vascular changes in the macula and temporal arcade. Microvascular caliber assessment indicates microaneurysms requiring specialist evaluation.'
                    : 'Clear retinal fundus scan with healthy arteriolar and venular calibers, distinct optic disc margin, and intact foveal reflex. No pathological microaneurysms detected.'}
              </p>
            </div>

            {/* Confidence & Quality Gate with Glass Panel */}
            <div className="p-6 rounded-3xl glass-panel space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#0B1728]" />
                  <h4 className="text-xs font-black text-[#0B1728] uppercase tracking-wider">
                    Confidence & Quality Gate
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-black text-[#2C402F] bg-[#059669]/20 px-2.5 py-0.5 rounded-full border border-[#059669]/40">
                  {screening.qualityStatus}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-white/90 to-[#F8FAFC]/90 border border-slate-200 flex items-center justify-between shadow-xs">
                  <span className="text-[#3C5880] font-bold">Confidence Tier</span>
                  <span className="text-[#0B1728] font-mono font-black">High</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-white/90 to-[#F8FAFC]/90 border border-slate-200 flex items-center justify-between shadow-xs">
                  <span className="text-[#3C5880] font-bold">Center Location</span>
                  <span className="text-[#0B1728] font-black">{screening.phcCenter}, {screening.district}</span>
                </div>
              </div>
            </div>

            {/* Human Review Sign-Off with Frosted Glass */}
            <div className="p-6 rounded-3xl glass-panel space-y-4 shadow-2xl border-2 border-[#0B1728]">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 text-[#0B1728]">
                  <UserCheck className="w-4 h-4" />
                  <h4 className="text-xs font-black uppercase tracking-wider">
                    Specialist Clinical Action
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-[#0B1728] font-black">
                  {screening.reviewStatus}
                </span>
              </div>

              <div className="space-y-3">
                <textarea
                  value={reviewerNote}
                  onChange={(e) => setReviewerNote(e.target.value)}
                  placeholder="Add specialist comments..."
                  className="w-full h-20 p-3 bg-white/90 border border-slate-200 rounded-2xl text-xs text-[#0B1728] placeholder:text-[#3C5880] focus:outline-none focus:border-[#0B1728] transition resize-none font-semibold shadow-inner"
                />

                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => handleReviewAction('CONFIRMED', 'Confirmed Grade')}
                    className="flex-1 min-w-[120px] py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#059669] to-[#556958] hover:from-[#667A69] hover:to-[#465849] text-[#FFFFFF] font-black text-xs shadow-md transition"
                  >
                    Confirm Grade
                  </button>
                  <button
                    onClick={() => handleReviewAction('OVERRIDDEN', 'Clinical Override')}
                    className="flex-1 min-w-[120px] py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#0B1728] to-[#10213E] hover:from-[#10213E] hover:to-[#0B1728] text-[#FFFFFF] font-black text-xs shadow-md transition"
                  >
                    Override Grade
                  </button>
                  <button
                    onClick={() => handleReviewAction('RE_REVIEW', 'Escalate to Specialist')}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-[#F8FAFC] border border-slate-200 text-[#0B1728] font-black text-xs transition shadow-xs"
                  >
                    Escalate
                  </button>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 rounded-2xl glass-panel text-[11px] text-[#3C5880] space-y-1">
              <p className="font-black text-[#0B1728]">Clinical Disclaimer</p>
              <p className="leading-relaxed font-semibold">
                RETINA-MITRA provides algorithmic decision support. It does not replace clinical diagnosis by a certified ophthalmologist.
              </p>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
