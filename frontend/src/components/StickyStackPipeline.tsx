'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, ArrowRight, CheckCircle2 } from 'lucide-react';
import { sound } from '@/lib/sound';

export function StickyStackPipeline() {
  const [activeLayer, setActiveLayer] = useState<'original' | 'clahe' | 'vessels' | 'gradcam'>('gradcam');

  return (
    <section id="pipeline" className="relative bg-[var(--ink)]">
      {/* ─── STAGE 01: QUALITY GATE ─── */}
      <div
        data-stack=""
        className="relative lg:sticky lg:top-0 min-h-auto lg:h-screen lg:max-h-screen lg:overflow-hidden rounded-t-[28px] sm:rounded-t-[36px] bg-[var(--ink)] text-[var(--accent)] border-t border-[var(--accent)]/20 flex items-center justify-center py-12 lg:py-6 px-5 sm:px-10 lg:px-12"
      >
        {/* Fixed subtle underglow */}
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--accent)]/10 blur-[120px] pointer-events-none" />

        <div className="relative w-full max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div
            aria-hidden="true"
            className="absolute right-[-2%] bottom-[-10%] font-extrabold text-[clamp(14rem,35vw,45vh)] leading-[0.7] tracking-[-0.06em] text-[var(--accent)] opacity-[0.04] pointer-events-none select-none"
          >
            01
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--accent)] mb-2">
              <span>Phase 01</span>
              <span className="w-8 h-[2px] bg-[var(--accent)]" />
              <span className="opacity-40">02 · 03 · 04</span>
            </div>
            <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#8F8F80] mb-2">
              ( Focus Variance · Illumination · Glare Detection )
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.035em] text-white leading-[0.96] mb-3">
              Image Quality Gate Assessment
            </h2>
            <p className="text-sm sm:text-base text-[#CFCFC4] leading-relaxed max-w-[480px] mb-4">
              Automated focus variance, illumination, and field coverage filters evaluate scan quality before any AI inference. Ungradable or blurry images are rejected early to prevent false negatives and prompt for an immediate retake.
            </p>
            <div className="font-mono text-[11px] text-[var(--accent)] space-y-1 mb-4">
              <div>→ Focus Variance Quality Thresholding</div>
              <div>→ Illumination &amp; Contrast Distribution</div>
              <div>→ Macular Glare &amp; Artifact Screening</div>
              <div>→ Immediate On-Site Retake Prompts</div>
            </div>
            <div>
              <span className="inline-block font-mono text-[10px] tracking-widest uppercase border-[1.5px] border-[var(--accent)]/50 text-[var(--accent)] rounded-full px-3.5 py-1.5">
                Rejects Low-Quality Inputs · Immediate Retake Feedback
              </span>
            </div>
          </div>

          {/* Interactive Schematic 01 */}
          <div className="relative bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-3xl p-5 sm:p-6 min-h-[260px] max-h-[360px] sm:aspect-[4/3] flex flex-col justify-between overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between font-mono text-[10px] text-[var(--accent)] tracking-wider">
              <span>TELEMETRY · QUALITY GATE</span>
              <span className="flex items-center gap-1.5 text-[var(--ok)]">
                <span className="w-2 h-2 rounded-full bg-[var(--ok)] animate-pulse" />
                GATE ACTIVE
              </span>
            </div>

            <div className="relative flex-1 flex items-center justify-center my-2">
              <div className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-full border-2 border-dashed border-[var(--accent)]/40 flex items-center justify-center">
                <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full border border-[var(--accent)]/60 bg-[var(--accent)]/10 flex items-center justify-center">
                  <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--accent)] animate-pulse" />
                </div>
                <div className="absolute top-1 left-0 px-2 py-0.5 rounded bg-[var(--ink)] border border-[var(--accent)]/40 text-[9px] font-mono text-[var(--accent)]">
                  Focus: Gradable
                </div>
                <div className="absolute bottom-2 right-0 px-2 py-0.5 rounded bg-[var(--ink)] border border-[var(--accent)]/40 text-[9px] font-mono text-[var(--ok)]">
                  Contrast: Normal PASS
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-center">
              <div className="p-1.5 rounded bg-[var(--accent)]/10 text-[var(--accent)]">Focus: PASS</div>
              <div className="p-1.5 rounded bg-[var(--accent)]/10 text-[var(--accent)]">Coverage: 45°</div>
              <div className="p-1.5 rounded bg-[var(--ok)]/20 text-[var(--ok)]">Status: Gradable</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── STAGE 02: CLASSIFICATION & GRAD-CAM ─── */}
      <div
        data-stack=""
        className="relative lg:sticky lg:top-0 min-h-auto lg:h-screen lg:max-h-screen lg:overflow-hidden rounded-t-[28px] sm:rounded-t-[36px] bg-[var(--bg)] text-[var(--ink)] border-t-2 border-[var(--ink)] flex items-center justify-center py-12 lg:py-6 px-5 sm:px-10 lg:px-12"
      >
        {/* Fixed subtle underglow */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-white/30 blur-[130px] pointer-events-none" />

        <div className="relative w-full max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div
            aria-hidden="true"
            className="absolute right-[-2%] bottom-[-10%] font-extrabold text-[clamp(14rem,35vw,45vh)] leading-[0.7] tracking-[-0.06em] text-[var(--ink)] opacity-[0.05] pointer-events-none select-none"
          >
            02
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--ink)] mb-2">
              <span className="opacity-40">01</span>
              <span className="w-4 h-[1px] bg-[var(--ink)]/40" />
              <span>Phase 02</span>
              <span className="w-8 h-[2px] bg-[var(--ink)]" />
              <span className="opacity-40">03 · 04</span>
            </div>
            <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-soft)] mb-2">
              ( Deep Learning Classifier · Vessel Mapping · Attention Overlays )
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.035em] text-[var(--ink)] leading-[0.96] mb-3">
              AI-Assisted Severity &amp; Explainability
            </h2>
            <p className="text-sm sm:text-base text-[var(--ink-soft)] leading-relaxed max-w-[480px] mb-4">
              Assesses DR severity across the 5-class ICDR scale from Grade 0 to Grade 4, generating visual attention overlays that highlight suspected microaneurysms, hemorrhages, and vascular changes driving the result.
            </p>
            <div className="font-mono text-[11px] text-[var(--ink)] space-y-1 mb-4">
              <div>→ Grade 0: No Apparent Retinopathy</div>
              <div>→ Grade 1–2: Mild to Moderate NPDR</div>
              <div>→ Grade 3–4: Severe NPDR / Proliferative DR</div>
              <div>→ Multi-Layer Spatial Heatmap Verification</div>
            </div>
            <div>
              <span className="inline-block font-mono text-[10px] tracking-widest uppercase border-[1.5px] border-[var(--ink)] text-[var(--ink)] rounded-full px-3.5 py-1.5">
                Auditable Decisions · Fully Transparent
              </span>
            </div>
          </div>

          {/* Interactive Layer Visualizer 02 */}
          <div className="relative bg-[var(--ink)] text-[var(--accent)] rounded-3xl p-5 sm:p-6 min-h-[260px] max-h-[360px] sm:aspect-[4/3] flex flex-col justify-between overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between font-mono text-[10px] text-[var(--accent)] tracking-wider">
              <span>MULTI-LAYER EXPLAINABILITY</span>
              <span>ICDR GRADE 2 DETECTED</span>
            </div>

            <div className="relative flex-1 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 my-2 flex items-center justify-center overflow-hidden">
              <div className="text-center p-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[var(--accent)] text-[var(--ink)] text-[10px] font-mono font-bold mb-1.5">
                  ACTIVE LAYER: {activeLayer.toUpperCase()}
                </div>
                <p className="text-[11px] text-[#CFCFC4] max-w-xs">
                  {activeLayer === 'gradcam' && 'Grad-CAM Attention: Highlights suspicious vascular and lesion clusters.'}
                  {activeLayer === 'vessels' && 'Vessel Mapping: Traces retinal vascular caliber and branching structure.'}
                  {activeLayer === 'clahe' && 'Contrast Enhancement: Balances local lighting across the posterior pole.'}
                  {activeLayer === 'original' && 'Standard 45° posterior pole fundus color photograph intake.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5 font-mono text-[9px]">
              {(['original', 'clahe', 'vessels', 'gradcam'] as const).map((layer) => (
                <button
                  key={layer}
                  type="button"
                  onClick={() => {
                    sound.playClick(620);
                    setActiveLayer(layer);
                  }}
                  className={`py-1.5 px-1 rounded uppercase tracking-wider transition-all ${
                    activeLayer === layer
                      ? 'bg-[var(--accent)] text-[var(--ink)] font-bold'
                      : 'bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20'
                  }`}
                >
                  {layer}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── STAGE 03: CONFIDENCE CALIBRATION & UNCERTAINTY ─── */}
      <div
        data-stack=""
        className="relative lg:sticky lg:top-0 min-h-auto lg:h-screen lg:max-h-screen lg:overflow-hidden rounded-t-[28px] sm:rounded-t-[36px] bg-[var(--paper)] text-[var(--ink)] border-t-2 border-[var(--ink)] flex items-center justify-center py-12 lg:py-6 px-5 sm:px-10 lg:px-12"
      >
        {/* Fixed subtle underglow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-[var(--accent)]/15 blur-[120px] pointer-events-none" />

        <div className="relative w-full max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div
            aria-hidden="true"
            className="absolute right-[-2%] bottom-[-10%] font-extrabold text-[clamp(14rem,35vw,45vh)] leading-[0.7] tracking-[-0.06em] text-[var(--ink)] opacity-[0.04] pointer-events-none select-none"
          >
            03
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--ink)] mb-2">
              <span className="opacity-40">01 · 02</span>
              <span className="w-4 h-[1px] bg-[var(--ink)]/40" />
              <span>Phase 03</span>
              <span className="w-8 h-[2px] bg-[var(--ink)]" />
              <span className="opacity-40">04</span>
            </div>
            <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-soft)] mb-2">
              ( Calibrated Confidence · Automated Uncertainty Triage )
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.035em] text-[var(--ink)] leading-[0.96] mb-3">
              Confidence Calibration &amp; Uncertainty Handling
            </h2>
            <p className="text-sm sm:text-base text-[var(--ink-soft)] leading-relaxed max-w-[480px] mb-4">
              Standard models can be overconfident on borderline or ambiguous scans. Retina-Mitra evaluates prediction certainty and automatically routes uncertain cases for priority human specialist review.
            </p>
            <div className="font-mono text-[11px] text-[var(--ink)] space-y-1 mb-4">
              <div>→ Confidence Calibration for Borderline Triage</div>
              <div>→ Auto-Escalation Threshold on Low Certainty</div>
              <div>→ Uncertainty-Driven Escalation to Specialists</div>
              <div>→ Non-Prescriptive Screening Support</div>
            </div>
            <div>
              <span className="inline-block font-mono text-[10px] tracking-widest uppercase border-[1.5px] border-[var(--ink)] text-[var(--ink)] rounded-full px-3.5 py-1.5">
                Confidence Calibration · Safeguards Borderline Cases
              </span>
            </div>
          </div>

          {/* Gauge Schematic 03 */}
          <div className="relative bg-[var(--ink)] text-[var(--accent)] rounded-3xl p-5 sm:p-6 min-h-[260px] max-h-[360px] sm:aspect-[4/3] flex flex-col justify-between overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between font-mono text-[10px] text-[var(--accent)] tracking-wider">
              <span>UNCERTAINTY &amp; TRIAGE ROUTER</span>
              <span className="text-[var(--ok)]">CALIBRATED</span>
            </div>

            <div className="relative flex-1 flex flex-col items-center justify-center my-2">
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--accent)] mb-0.5">
                92.4<span className="text-xl">%</span>
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#CFCFC4]">
                Calibrated Confidence Score
              </div>
              <div className="w-full max-w-xs mt-4 h-2.5 rounded-full bg-[var(--accent)]/20 overflow-hidden relative">
                <div className="h-full bg-[var(--accent)] rounded-full w-[92.4%]" />
                <div className="absolute top-0 bottom-0 left-[70%] w-[2px] bg-red-400" title="Abstain threshold" />
              </div>
              <div className="flex justify-between w-full max-w-xs mt-1 font-mono text-[8px] text-[#8F8F80]">
                <span>0%</span>
                <span className="text-red-400">70% Threshold</span>
                <span>100%</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] font-mono text-[10px] flex items-center justify-between">
              <span>Status: Screening Confidence Clear</span>
              <span className="text-[var(--ok)] font-bold">Passed Threshold</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── STAGE 04: SPECIALIST HITL SIGN-OFF ─── */}
      <div
        data-stack=""
        className="relative lg:sticky lg:top-0 min-h-auto lg:h-screen lg:max-h-screen lg:overflow-hidden rounded-t-[28px] sm:rounded-t-[36px] bg-[var(--ink)] text-[var(--accent)] border-t-2 border-[var(--accent)]/30 flex items-center justify-center py-12 lg:py-6 px-5 sm:px-10 lg:px-12"
      >
        {/* Fixed subtle underglow */}
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-[var(--accent)]/10 blur-[130px] pointer-events-none" />

        <div className="relative w-full max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div
            aria-hidden="true"
            className="absolute right-[-2%] bottom-[-10%] font-extrabold text-[clamp(14rem,35vw,45vh)] leading-[0.7] tracking-[-0.06em] text-[var(--accent)] opacity-[0.04] pointer-events-none select-none"
          >
            04
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--accent)] mb-2">
              <span className="opacity-40">01 · 02 · 03</span>
              <span className="w-4 h-[1px] bg-[var(--accent)]/40" />
              <span>Phase 04</span>
              <span className="w-8 h-[2px] bg-[var(--accent)]" />
            </div>
            <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#8F8F80] mb-2">
              ( Specialist Sign-Off · Audit Trail · Bilingual Referral )
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.035em] text-white leading-[0.96] mb-3">
              Specialist Human Verification
            </h2>
            <p className="text-sm sm:text-base text-[#CFCFC4] leading-relaxed max-w-[480px] mb-4">
              The AI assists; ophthalmologists decide. Human specialists receive pre-processed multi-layer evidence to sign off or override diagnoses with mandatory reason logging, exporting bilingual referral documents.
            </p>
            <div className="font-mono text-[11px] text-[var(--accent)] space-y-1 mb-4">
              <div>→ Specialist Sign-Off or Reasoned Override</div>
              <div>→ Full Audit Trail &amp; Identity Tracking</div>
              <div>→ Bilingual Patient Slip (English / Marathi)</div>
              <div>→ Direct Print &amp; PDF Clinical Export</div>
            </div>
            <div>
              <Link
                href="/review"
                onClick={() => sound.playClick(850)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent)] text-[var(--ink)] font-extrabold text-xs uppercase hover:scale-105 active:scale-95 transition-transform no-underline"
                data-cursor-label="REVIEW"
              >
                <span>Open Specialist Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Specialist Card Schematic 04 */}
          <div className="relative bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-3xl p-5 sm:p-6 min-h-[260px] max-h-[360px] sm:aspect-[4/3] flex flex-col justify-between overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between font-mono text-[10px] text-[var(--accent)] tracking-wider">
              <span>CLINICAL REPORT DISPATCH</span>
              <span className="text-[var(--ok)] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                VERIFIED
              </span>
            </div>

            <div className="relative flex-1 bg-[var(--paper)] text-[var(--ink)] rounded-2xl p-4 my-2 border border-[var(--accent)]/40 flex flex-col justify-between shadow-inner text-xs">
              <div>
                <div className="flex justify-between items-start border-b border-[var(--ink)]/20 pb-1.5 mb-1.5 font-mono text-[9px]">
                  <span className="font-bold">PATIENT REF: RM-9481</span>
                  <span>DISTRICT: PUNE RURAL</span>
                </div>
                <div className="font-bold text-sm mb-0.5">Diabetic Retinopathy Summary</div>
                <div className="text-[11px] text-[var(--ink-soft)]">
                  Finding: Moderate Non-Proliferative DR (Level 2). Referral recommended within 60 days.
                </div>
              </div>
              <div className="flex justify-between items-end border-t border-[var(--ink)]/20 pt-1.5 font-mono text-[9px]">
                <div>Sign-Off: Dr. A. Kulkarni</div>
                <div className="text-[var(--ok)] font-bold">DIGITALLY SIGNED</div>
              </div>
            </div>

            <div className="flex justify-between items-center font-mono text-[10px] text-[#CFCFC4]">
              <span>Format: PDF / HL7 FHIR</span>
              <span className="text-[var(--accent)]">Export Ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
