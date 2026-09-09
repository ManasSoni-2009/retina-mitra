'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DEMO_CASES, DemoCaseConfig, demoCaseToScreening, getDemoCase } from '@/data/prototypeCases';
import { useSessionStore } from '@/hooks/useSessionStore';
import { generateReport } from '@/lib/generateReport';
import { CanvasImageViewer } from '@/components/CanvasImageViewer';
import { 
  ArrowRight, 
  UploadCloud, 
  CheckCircle2, 
  Eye, 
  Activity, 
  RefreshCw, 
  UserCheck, 
  Download, 
  Target, 
  ShieldCheck, 
  Info, 
  Check 
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
  const [customImage, setCustomImage] = useState<string | null>(null);
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
    'Preparing image',
    'Checking image quality',
    'Reviewing retinal features',
    'Preparing evidence',
    'Preparing screening result',
  ];

  const handleStartScan = (dc?: DemoCaseConfig) => {
    const targetCase = dc || selectedCase;
    setSelectedCase(targetCase);
    setScreenState('scanning');
    setScanStepIndex(0);
    setReviewFeedback(null);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setScanStepIndex(current);
      if (current >= scanSequence.length) {
        clearInterval(interval);
        setTimeout(() => {
          setScreenState('result');
          screenCase(targetCase);
        }, 300);
      }
    }, 280);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUploadFile(file);
  };

  const handleUploadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setCustomImage(src);
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

  const handleReviewAction = (action: 'CONFIRMED' | 'RE_REVIEW' | 'UNGRADABLE' | 'OVERRIDDEN', label: string) => {
    const screening = demoCaseToScreening(selectedCase);
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
      const screening = demoCaseToScreening(selectedCase);
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

  const isUngradable = selectedCase.qualityStatus === 'UNGRADABLE';
  const isReferable = selectedCase.referable;

  return (
    <main className="min-h-screen bg-[#FFFFFF] pb-24 pt-20 text-[#0B1728] relative overflow-hidden">
      
      {/* Ambient glass blooms */}
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-[#2563EB]/30 to-[#059669]/20 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-gradient-to-tr from-[#059669]/25 to-[#3C5880]/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-[#0B1728] uppercase tracking-widest">
                TELE-OPHTHALMOLOGY WORKSPACE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B1728]" />
              <span className="text-xs text-[#3C5880] font-mono font-bold">PROTOTYPE CASE ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1728] tracking-tight mt-1">
              Retinal Screening & Analysis
            </h1>
          </div>

          {screenState === 'result' && (
            <button
              onClick={() => { setScreenState('idle'); setReviewFeedback(null); }}
              className="btn-oxford-secondary text-xs py-2 px-4 shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Select Another Case</span>
            </button>
          )}
        </div>

        {/* ── STAGE 1: IDLE INTAKE (LARGE DROPZONE + 5 DEMO CASES) ────────── */}
        {screenState === 'idle' && (
          <div className="space-y-8">
            
            {/* Spacious Upload Zone with Medium Saturated Gradient */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-10 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all duration-300 backdrop-blur-2xl ${
                isDragOver
                  ? 'border-[#2563EB] bg-gradient-to-br from-blue-50/90 via-indigo-50/85 to-blue-200/60 shadow-2xl scale-101'
                  : 'border-blue-200/90 hover:border-[#2563EB] bg-gradient-to-br from-[#EEF4FC] via-[#E4EEFB] to-[#BFDBFE]/55 hover:shadow-xl'
              }`}
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
              <div className="max-w-md mx-auto space-y-3.5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B1728] via-[#10213E] to-[#3C5880] text-[#2563EB] flex items-center justify-center mx-auto shadow-xl shadow-[#0B1728]/25 border border-white/20">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0B1728]">Upload Retinal Fundus Photograph</h3>
                  <p className="text-xs text-[#3C5880] mt-1 font-bold leading-relaxed">
                    Drag and drop color fundus photograph (.jpg, .png) or click to browse local files.
                  </p>
                </div>
                <div className="inline-block text-[11px] font-mono text-[#0B1728] bg-white/95 px-4 py-1.5 rounded-full border border-blue-200 font-black shadow-xs">
                  Standard 45° Posterior Pole Intake
                </div>
              </div>
            </div>

            {/* 5 Compact Prototype Case Cards with Medium Saturated Gradient */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#0B1728] tracking-tight">
                    Or Select Preconfigured Prototype Case
                  </h3>
                  <p className="text-xs text-[#3C5880] font-bold">
                    Demonstrate complete diagnostic screening workflow across verified clinical cases:
                  </p>
                </div>
                <span className="text-xs font-mono text-[#0B1728] font-black hidden sm:inline-block">
                  5 CLINICAL CASES READY
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {DEMO_CASES.map((c) => {
                  const isSelected = selectedCase.screeningId === c.screeningId;
                  return (
                    <div
                      key={c.screeningId}
                      onClick={() => setSelectedCase(c)}
                      className={`p-4 rounded-3xl cursor-pointer border transition-all duration-300 flex flex-col justify-between space-y-3 backdrop-blur-xl ${
                        isSelected
                          ? 'bg-white border-[#0B1728] shadow-2xl scale-102 ring-2 ring-[#0B1728]'
                          : 'bg-gradient-to-br from-[#F0F5FD] via-[#E6EEF9] to-[#BFDBFE]/50 hover:from-white hover:to-white border-blue-200/80 hover:border-[#0B1728] shadow-md hover:shadow-lg'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-black text-[#0B1728]">{c.demoNumber}</span>
                        <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase ${
                          c.qualityStatus === 'UNGRADABLE' ? 'bg-rose-100 text-rose-950 border border-rose-300' :
                          c.referable ? 'bg-amber-100 text-amber-950 border border-amber-300' : 'bg-[#059669]/20 text-[#2C402F] border border-[#059669]/40'
                        }`}>
                          {c.qualityStatus === 'UNGRADABLE' ? 'Ungradable' : c.referable ? 'Referable' : 'Routine'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-[#0B1728] line-clamp-1">{c.category}</h4>
                        <p className="text-[11px] text-[#3C5880] line-clamp-2 leading-relaxed font-semibold">
                          {c.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-[#3C5880] font-mono font-bold">
                        <span>{c.patientAlias}</span>
                        <span className="text-[#0B1728] font-black">{c.confidenceRating}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Launch Action Bar with Frosted Glass Panel */}
            <div className="p-6 rounded-3xl glass-panel shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-left">
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0B1728] via-[#10213E] to-[#3C5880] text-[#2563EB] shadow-lg">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#0B1728]">
                    Ready to Screen: {selectedCase.category} ({selectedCase.screeningId})
                  </h4>
                  <p className="text-xs text-[#3C5880] font-bold">
                    Patient: {selectedCase.patientAlias} • {selectedCase.title}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleStartScan()}
                className="btn-sand-primary text-sm py-3.5 px-8 w-full sm:w-auto shadow-xl"
              >
                <span>Run Screening Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ── STAGE 2: 5-STEP STREAMLINED PROGRESSION WITH FROSTED GLASS ───── */}
        {screenState === 'scanning' && (
          <div className="py-16 px-4 max-w-lg mx-auto text-center space-y-8">
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-20 h-20 rounded-full border-4 border-slate-200 border-t-[#0B1728] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Eye className="w-8 h-8 text-[#0B1728]" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#0B1728]">Running Screening Analysis</h3>
              <p className="text-xs text-[#3C5880] font-mono font-bold">
                {selectedCase.screeningId} • {selectedCase.patientAlias}
              </p>
            </div>

            {/* 5-step checklist with frosted glass */}
            <div className="space-y-2.5 text-left glass-panel p-6 shadow-2xl">
              {scanSequence.map((stepName, i) => {
                const isDone = i < scanStepIndex;
                const isCurrent = i === scanStepIndex;

                return (
                  <div 
                    key={stepName}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                      isCurrent 
                        ? 'bg-gradient-to-r from-[#0B1728] to-[#10213E] border-[#0B1728] text-[#FFFFFF] shadow-lg scale-102 font-bold' 
                        : isDone 
                          ? 'bg-gradient-to-r from-white/90 to-[#F8FAFC]/80 border-slate-200 text-[#2C402F] font-bold' 
                          : 'border-transparent text-[#3C5880]/40 opacity-40 font-medium'
                    }`}
                  >
                    <span className="text-xs">{stepName}</span>
                    {isDone && <Check className="w-4 h-4 text-[#059669]" />}
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STAGE 3: RESULT CENTERPIECE WITH FROSTED GLASS & GRADIENTS ────── */}
        {screenState === 'result' && (
          <div className="space-y-8">
            
            {/* Feedback alert toast */}
            {reviewFeedback && (
              <div className="p-4 rounded-2xl glass-panel text-[#2C402F] border border-[#059669] text-xs font-black font-mono flex items-center gap-2 shadow-2xl animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>{reviewFeedback}</span>
              </div>
            )}

            {/* Top Primary Banner with Frosted Glass Gradient */}
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
                      {selectedCase.screeningId} • {selectedCase.patientAlias}
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-black text-[#0B1728] tracking-tight">
                    {selectedCase.title}
                  </h2>

                  <p className="text-sm font-bold text-[#3C5880]">
                    {selectedCase.recommendation}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="btn-sand-primary text-xs py-3.5 px-7 shadow-2xl"
                  >
                    {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span>{isDownloading ? 'Generating...' : 'Generate Report (PDF)'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Why This Result Box with Frosted Glass */}
            <div className="p-6 rounded-3xl glass-panel space-y-2 shadow-xl">
              <div className="flex items-center gap-2 text-[#0B1728] font-black text-xs">
                <Info className="w-4 h-4 text-[#059669]" />
                <span className="uppercase tracking-wider">Why this result?</span>
              </div>
              <p className="text-sm text-[#3C5880] leading-relaxed font-bold">
                {selectedCase.humanReviewReason || selectedCase.description}
              </p>
            </div>

            {/* Central Two-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column (7 cols): Large Retinal Image with 6 Tabs */}
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
                  evidence={{
                    rawImageUrl: selectedCase.rawImageUrl,
                    enhancedImageUrl: selectedCase.enhancedImageUrl,
                    vesselMapUrl: selectedCase.vesselMapUrl,
                    gradcamUrl: selectedCase.gradcamUrl,
                    lesionOverlayUrl: selectedCase.lesionOverlayUrl,
                    combinedEvidenceUrl: selectedCase.combinedEvidenceUrl,
                  }}
                />
              </div>

              {/* Right Column (5 cols): Evidence, Confidence, Action, Human Review */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Evidence Identified with Frosted Glass Panel */}
                <div className="p-6 rounded-3xl glass-panel space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#0B1728]" />
                      <h4 className="text-xs font-black text-[#0B1728] uppercase tracking-wider">
                        Evidence Identified
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-[#2C402F] font-black bg-[#059669]/20 px-2.5 py-0.5 rounded-full border border-[#059669]/40">
                      {selectedCase.evidence.length} FINDINGS
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs">
                    {selectedCase.evidence.map((ev, i) => (
                      <li key={i} className="flex items-start gap-2.5 p-3 rounded-2xl bg-gradient-to-r from-white/90 via-[#F8FAFC]/80 to-[#2563EB]/20 border border-slate-200 shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-[#0B1728] mt-1.5 shrink-0" />
                        <span className="text-[#0B1728] font-bold leading-relaxed">{ev.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Confidence & Quality Indicators */}
                <div className="p-6 rounded-3xl glass-panel space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#0B1728]" />
                      <h4 className="text-xs font-black text-[#0B1728] uppercase tracking-wider">
                        System Confidence & Quality Gate
                      </h4>
                    </div>
                    <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full ${
                      selectedCase.confidenceRating === 'High' ? 'bg-[#059669]/20 text-[#2C402F] border border-[#059669]/40' :
                      selectedCase.confidenceRating === 'Moderate' ? 'bg-[#2563EB]/40 text-[#0B1728] border border-slate-200' :
                      'bg-rose-100 text-rose-950 border border-rose-300'
                    }`}>
                      {selectedCase.confidenceRating} Confidence
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-white/90 to-[#F8FAFC]/90 border border-slate-200 space-y-1 shadow-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-[#3C5880]">Confidence Assessment</span>
                        <span className="text-[#0B1728] font-mono font-black">{selectedCase.confidenceRating}</span>
                      </div>
                      <p className="text-[11px] text-[#3C5880] leading-relaxed font-bold">
                        {selectedCase.confidenceExplanation}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-white/90 to-[#F8FAFC]/90 border border-slate-200 flex items-center justify-between shadow-xs">
                      <span className="text-[#3C5880] font-bold">Quality Gate Status</span>
                      <span className={`font-black font-mono text-[11px] ${
                        selectedCase.qualityStatus === 'GRADABLE' ? 'text-[#2C402F]' : 'text-rose-700'
                      }`}>
                        {selectedCase.qualityStatus === 'GRADABLE' ? 'Passed (Gradable 45°)' : 'Rejected (Ungradable Blur)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommended Action */}
                <div className="p-6 rounded-3xl glass-panel space-y-3 shadow-xl">
                  <div className="flex items-center gap-2 text-[#0B1728] font-black text-xs">
                    <ShieldCheck className="w-4 h-4 text-[#059669]" />
                    <span className="uppercase tracking-wider">Recommended Action</span>
                  </div>
                  <p className="text-xs text-[#0B1728] leading-relaxed font-black">
                    {selectedCase.recommendation}
                  </p>
                </div>

                {/* Human Review Sign-Off with Frosted Glass Border */}
                <div className="p-6 rounded-3xl glass-panel space-y-4 shadow-2xl border-2 border-[#0B1728]">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2 text-[#0B1728]">
                      <UserCheck className="w-4 h-4" />
                      <h4 className="text-xs font-black uppercase tracking-wider">
                        Human Specialist Review
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-[#0B1728] font-black">
                      REQUIRED STEP
                    </span>
                  </div>

                  <div className="space-y-3">
                    <textarea
                      value={reviewerNote}
                      onChange={(e) => setReviewerNote(e.target.value)}
                      placeholder="Add ophthalmologist observation or referral notes..."
                      className="w-full h-20 p-3 bg-white/90 border border-slate-200 rounded-2xl text-xs text-[#0B1728] placeholder:text-[#3C5880] focus:outline-none focus:border-[#0B1728] transition resize-none font-semibold shadow-inner"
                    />

                    <div className="flex flex-wrap gap-2.5">
                      <button
                        onClick={() => handleReviewAction('CONFIRMED', 'Confirmed AI Screening Grade')}
                        className="flex-1 min-w-[120px] py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#059669] to-[#556958] hover:from-[#667A69] hover:to-[#465849] text-[#FFFFFF] font-black text-xs shadow-md transition"
                      >
                        Confirm Grade
                      </button>
                      <button
                        onClick={() => handleReviewAction('OVERRIDDEN', 'Clinical Override Applied')}
                        className="flex-1 min-w-[120px] py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#0B1728] to-[#10213E] hover:from-[#10213E] hover:to-[#0B1728] text-[#FFFFFF] font-black text-xs shadow-md transition"
                      >
                        Override Grade
                      </button>
                      <button
                        onClick={() => handleReviewAction('RE_REVIEW', 'Flagged for Senior Retinal Specialist')}
                        className="py-2.5 px-3 rounded-xl bg-white hover:bg-[#F8FAFC] border border-slate-200 text-[#0B1728] font-black text-xs transition shadow-xs"
                      >
                        Escalate
                      </button>
                    </div>
                  </div>
                </div>

                {/* Concise Clinical Disclaimer */}
                <div className="p-4 rounded-2xl glass-panel text-[11px] text-[#3C5880] space-y-1">
                  <p className="font-black text-[#0B1728]">Clinical Disclaimer</p>
                  <p className="leading-relaxed font-semibold">
                    RETINA-MITRA provides algorithmic decision support. It does not provide medical diagnosis without review by a qualified ophthalmologist.
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}

export default function ScreeningPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#FFFFFF] flex items-center justify-center text-[#0B1728]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-[#0B1728] rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-[#0B1728] font-bold">Loading Tele-Ophthalmology Workspace...</p>
        </div>
      </main>
    }>
      <ScreeningInner />
    </Suspense>
  );
}
