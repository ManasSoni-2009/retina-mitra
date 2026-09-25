'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Eye, ShieldCheck, Zap, Activity, Users, Lock, ChevronDown, CheckCircle2 } from 'lucide-react';
import { TactileVisionHero } from '@/components/TactileVisionHero';
import { StickyStackPipeline } from '@/components/StickyStackPipeline';
import { DigitalWorkerDeck } from '@/components/DigitalWorkerDeck';
import { ParallaxCaseGrid } from '@/components/ParallaxCaseGrid';
import { PhysicsPillBox } from '@/components/PhysicsPillBox';
import { sound } from '@/lib/sound';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';

export default function LandingPage() {
  const containerRef = useScrollAnimations();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    sound.playClick(640);
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[var(--bg)] text-[var(--ink)] overflow-x-hidden selection:bg-[var(--ink)] selection:text-[var(--accent)]"
    >
      {/* ─── 1. HERO SECTION (FOCUSED SINGLE VIEWPORT ON PC, ELEGANT STACK ON MOBILE) ─── */}
      <header
        id="top"
        className="relative min-h-[100svh] flex flex-col justify-center px-5 sm:px-12 pt-24 pb-14 sm:py-20 overflow-hidden max-w-[1440px] mx-auto select-none"
      >
        {/* Fixed Section Subtle Underglow */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-white/40 blur-[130px] pointer-events-none" />

        {/* Tactile Vision Centerpiece (Desktop: Absolute Right Side, Identical to PC Design) */}
        <div className="hidden lg:block absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 w-[520px] xl:w-[560px] pointer-events-none z-0 opacity-100 transition-opacity">
          <TactileVisionHero />
        </div>

        {/* Circular Spinning Badge (Positioned near hero text on tablet/desktop) */}
        <div
          data-magnetic=""
          className="absolute left-[38%] md:left-[40%] lg:left-[42%] xl:left-[43%] top-[33%] sm:top-[34%] lg:top-[35%] -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 pointer-events-none z-20 hidden md:block"
        >
          <div className="absolute inset-0 animate-[spin_16s_linear_infinite]">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <path id="circlePath" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text className="font-mono text-[8px] tracking-[2.2px] uppercase fill-[var(--ink)] font-bold">
                <textPath href="#circlePath" startOffset="0">
                  ✦ RURAL TELEMEDICINE ✦ SCREEN · REVIEW · REFER ✦
                </textPath>
              </text>
            </svg>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--ink)] text-[var(--accent)] border border-white/40 flex items-center justify-center shadow-md">
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--accent)]" />
            </span>
          </div>
        </div>

        {/* Eyebrow Status Pill */}
        <div className="relative z-10 font-mono text-[10px] sm:text-xs tracking-[0.16em] uppercase mb-4 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--ink)] animate-pulse" />
          <span className="font-bold">Capture → Check → Screen → Review → Refer</span>
        </div>

        {/* Scaled Kinetic Headline (fits perfectly on 1 screen on PC, wraps gracefully on mobile) */}
        <h1 className="relative z-10 text-[clamp(2.1rem,6.8vw,6.4rem)] font-extrabold tracking-[-0.04em] leading-[0.9] max-w-[13ch] uppercase mb-6">
          <span className="block">Screening that</span>
          <span className="block">actually</span>
          <span className="block">protects vision.</span>
        </h1>

        {/* Action Row & Lead Statement */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 mt-2">
          <Link
            href="/screening/new"
            onClick={() => sound.playClick(900)}
            className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-full bg-[var(--ink)] text-[var(--accent)] text-sm sm:text-base font-extrabold tracking-tight hover:scale-105 active:scale-95 transition-all shadow-[5px_5px_0_var(--ink)] no-underline"
            data-cursor-label="INTAKE"
          >
            <span>Intake Retinal Scan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="max-w-md text-xs sm:text-sm font-semibold leading-relaxed text-[var(--ink-soft)]">
            Built for low-connectivity retinal screening at rural healthcare centres. Combines automated image-quality checks, explainable AI screening, uncertainty triage, and human specialist sign-off.
          </p>
        </div>

        {/* Mobile Tactile Vision Centerpiece Showcase (Cleanly stacked below CTA for rich mobile visual) */}
        <div className="lg:hidden relative w-full max-w-[360px] sm:max-w-md mx-auto mt-10 z-10">
          <TactileVisionHero />
        </div>
      </header>

      {/* ─── 2. COMPACT MARQUEE RIBBON ─── */}
      <div className="bg-[var(--ink)] text-[var(--accent)] py-3.5 overflow-hidden border-y-2 border-[var(--ink)] select-none">
        <div className="flex whitespace-nowrap font-extrabold text-base sm:text-xl tracking-tight animate-[marquee_24s_linear_infinite]">
          <span className="mx-4">✦ CAPTURE → CHECK → SCREEN → REVIEW → REFER</span>
          <span className="mx-4">✦ IMAGE QUALITY GATE</span>
          <span className="mx-4">✦ 5-CLASS ICDR TRIAGE</span>
          <span className="mx-4">✦ EXPLAINABLE VISUAL OVERLAYS</span>
          <span className="mx-4">✦ CONFIDENCE CALIBRATION</span>
          <span className="mx-4">✦ SPECIALIST OVERSIGHT WORKSPACE</span>
          <span className="mx-4">✦ LOW-CONNECTIVITY OFFLINE SYNC</span>
          <span className="mx-4">✦ CLINICAL REFERRAL DOCUMENTATION (EN)</span>
        </div>
      </div>

      {/* ─── 3. EDITORIAL STATEMENT (BALANCED PROPORTIONS) ─── */}
      <section
        id="about"
        className="relative bg-[var(--paper)] py-20 sm:py-28 lg:py-32 px-6 sm:px-12 border-b-2 border-[var(--ink)] overflow-hidden"
      >
        {/* Fixed subtle underglow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--accent)]/20 blur-[130px] pointer-events-none" />

        <div className="relative z-10 max-w-[1320px] w-full mx-auto">
          <div className="gsap-reveal max-w-3xl mb-12 sm:mb-16">
            <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--ink-soft)] mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--ink)]" />
              Rural Telemedicine Workflow
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] text-[var(--ink)] leading-[0.94] uppercase mb-4">
              Screening built for<br />rural reality.
            </h2>
            <p className="text-base sm:text-lg font-semibold text-[var(--ink)] leading-relaxed">
              In primary care centres and rural camps, diabetic retinopathy triage struggles with blurry captures, scarce ophthalmologists, and spotty internet. Retina-Mitra provides an end-to-end workflow: verifying image quality on-site, assisting triage with visual evidence, and routing uncertain cases for verified specialist review.
            </p>
          </div>

          {/* 3 Bento Pillar Cards */}
          <div className="gsap-card-grid grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="gsap-card p-7 rounded-3xl border-2 border-[var(--ink)] bg-[var(--bg)] shadow-[5px_5px_0_var(--ink)] flex flex-col justify-between">
              <div>
                <span className="w-11 h-11 rounded-2xl bg-[var(--ink)] text-[var(--accent)] flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </span>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-2">On-Site Quality Check</h3>
                <p className="text-xs sm:text-sm text-[var(--ink-soft)] font-medium leading-relaxed">
                  Focus variance, illumination, and field coverage filters check quality right at capture time, preventing ungradable or blurry scans from causing diagnostic errors.
                </p>
              </div>
              <div className="mt-6 font-mono text-[11px] text-[var(--ink)] font-bold uppercase">
                → Rejects Low-Quality Inputs
              </div>
            </div>

            <div className="gsap-card p-7 rounded-3xl border-2 border-[var(--ink)] bg-[var(--bg)] shadow-[5px_5px_0_var(--ink)] flex flex-col justify-between">
              <div>
                <span className="w-11 h-11 rounded-2xl bg-[var(--ink)] text-[var(--accent)] flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6" />
                </span>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-2">Explainable AI Triage</h3>
                <p className="text-xs sm:text-sm text-[var(--ink-soft)] font-medium leading-relaxed">
                  Grades DR severity across the 5-class ICDR scale while generating transparent visual attention overlays that highlight suspected lesions and microaneurysms.
                </p>
              </div>
              <div className="mt-6 font-mono text-[11px] text-[var(--ink)] font-bold uppercase">
                → Multi-Layer Visual Overlays
              </div>
            </div>

            <div className="gsap-card p-7 rounded-3xl border-2 border-[var(--ink)] bg-[var(--bg)] shadow-[5px_5px_0_var(--ink)] flex flex-col justify-between">
              <div>
                <span className="w-11 h-11 rounded-2xl bg-[var(--ink)] text-[var(--accent)] flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </span>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-2">Specialist Review &amp; Refer</h3>
                <p className="text-xs sm:text-sm text-[var(--ink-soft)] font-medium leading-relaxed">
                  Clinicians and ophthalmologists verify or override outcomes with full audit trails, generating structured clinical referral documentation (English).
                </p>
              </div>
              <div className="mt-6 font-mono text-[11px] text-[var(--ink)] font-bold uppercase">
                → Human-in-the-Loop Oversight
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. STICKY-STACK PIPELINE (4 CARDS) ─── */}
      <StickyStackPipeline />

      {/* ─── 5. DIGITAL CLINICAL WORKER DECK ─── */}
      <DigitalWorkerDeck />

      {/* ─── 6. VERIFIED CLINICAL CASES SHOWCASE ─── */}
      <ParallaxCaseGrid />

      {/* ─── 7. STATS BAND (DARK SECTION WITH FIXED SUBTLE GLOW) ─── */}
      <section
        data-dark=""
        className="relative bg-[var(--ink)] text-[var(--accent)] py-16 sm:py-24 px-6 sm:px-12 border-t-2 border-[var(--ink)] overflow-hidden"
      >
        <div className="absolute inset-0 bg-radial from-[var(--accent)]/15 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-[1320px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          <div className="gsap-counter">
            <div className="text-4xl sm:text-6xl font-extrabold tracking-tight">5-Stage</div>
            <div className="font-mono text-[11px] sm:text-xs text-[#CFCFC4] uppercase tracking-wider mt-2">
              End-to-End Workflow
            </div>
          </div>
          <div className="gsap-counter">
            <div className="text-4xl sm:text-6xl font-extrabold tracking-tight">0–4</div>
            <div className="font-mono text-[11px] sm:text-xs text-[#CFCFC4] uppercase tracking-wider mt-2">
              ICDR Severity Grading
            </div>
          </div>
          <div className="gsap-counter">
            <div className="text-4xl sm:text-6xl font-extrabold tracking-tight">Offline</div>
            <div className="font-mono text-[11px] sm:text-xs text-[#CFCFC4] uppercase tracking-wider mt-2">
              Local Queue &amp; Cloud Sync
            </div>
          </div>
          <div className="gsap-counter">
            <div className="text-4xl sm:text-6xl font-extrabold tracking-tight">100%</div>
            <div className="font-mono text-[11px] sm:text-xs text-[#CFCFC4] uppercase tracking-wider mt-2">
              Human Specialist Oversight
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. PHYSICS TOOLKIT SANDBOX ─── */}
      <section
        id="toolkit"
        className="relative bg-[var(--bg)] py-20 sm:py-28 lg:py-32 px-6 sm:px-12 border-t-2 border-[var(--ink)] overflow-hidden"
      >
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-white/25 blur-[130px] pointer-events-none" />

        <div className="relative z-10 max-w-[1320px] w-full mx-auto">
          <div className="gsap-reveal flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--ink-soft)] mb-1">
                ( Medical &amp; Inference Architecture )
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.04em] text-[var(--ink)] leading-none uppercase">
                Our Clinical Toolkit
              </h2>
            </div>
            <div className="font-mono text-xs uppercase tracking-wider text-[var(--ink-soft)] font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--ink)] animate-pulse" />
              Drag &amp; throw — every component runs in live inference
            </div>
          </div>
          <PhysicsPillBox />
        </div>
      </section>

      {/* ─── 9. CLINICAL FAQ ACCORDION ─── */}
      <section
        id="faq"
        className="relative bg-[var(--paper)] py-20 sm:py-28 lg:py-32 px-6 sm:px-12 border-t-2 border-[var(--ink)] overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--accent)]/20 blur-[130px] pointer-events-none" />

        <div className="relative z-10 max-w-[1000px] w-full mx-auto">
          <div className="gsap-reveal mb-8 sm:mb-12">
            <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--ink-soft)] mb-1">
              ( Questions? Answered )
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.04em] text-[var(--ink)] uppercase">
              Clinical &amp; System FAQ
            </h2>
          </div>

          <div className="gsap-faq-group border-t-[2.5px] border-[var(--ink)]">
            {[
              {
                id: '01',
                q: 'Is Retina-Mitra an autonomous diagnostic system?',
                a: 'No. Retina-Mitra is strictly an explainable clinical decision-support system. It is non-prescriptive, flags borderline uncertainty, and requires specialist verification before clinical actions or patient slips are finalized.',
              },
              {
                id: '02',
                q: 'How does the OpenCV Quality Gate prevent diagnostic errors?',
                a: 'Before any machine learning model sees a scan, automated filters measure focus variance (Laplacian sharpness), illumination distribution, contrast, and field coverage. Out-of-focus or glare-ruined scans are rejected at the gate, preventing false negatives.',
              },
              {
                id: '03',
                q: 'How does confidence calibration protect patient safety?',
                a: 'Standard neural networks can be overconfident on ambiguous or borderline scans. Confidence calibration evaluates prediction certainty, and cases falling below clinical thresholds automatically trigger mandatory specialist review rather than generating autonomous referrals.',
              },
              {
                id: '04',
                q: 'Can this platform run in rural clinics with poor connectivity?',
                a: 'Yes. Retina-Mitra uses local IndexedDB offline sync queues. Screenings and telemetry are stored safely on the operator laptop and synchronize with the specialist hospital cloud as soon as cellular or broadband connectivity is restored.',
              },
            ].map((faq, idx) => (
              <div
                key={faq.id}
                className="gsap-faq-item border-b-[2px] border-[var(--ink)] py-5 sm:py-6 transition-colors duration-200"
              >
                <div
                  data-faq-q=""
                  onClick={() => toggleFaq(idx)}
                  className="group cursor-pointer flex justify-between items-center gap-6 select-none"
                  data-cursor-label={openFaq === idx ? 'CLOSE' : 'EXPAND'}
                >
                  <div className="flex items-center gap-3 sm:gap-5">
                    <span className="font-mono text-xs font-bold text-[var(--ink-mute)] group-hover:text-[var(--ink)] transition-colors">
                      ({faq.id})
                    </span>
                    <span className="text-lg sm:text-2xl font-bold tracking-tight text-[var(--ink)] group-hover:translate-x-1.5 transition-transform duration-200">
                      {faq.q}
                    </span>
                  </div>

                  <span
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[var(--ink)] flex items-center justify-center shrink-0 transition-all duration-300 shadow-[2px_2px_0_var(--ink)] ${
                      openFaq === idx
                        ? 'bg-[var(--ink)] text-[var(--accent)] rotate-45 scale-105'
                        : 'bg-[var(--paper)] text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--accent)] group-hover:scale-105'
                    }`}
                  >
                    <span className="text-xl sm:text-2xl font-black leading-none -mt-0.5">
                      +
                    </span>
                  </span>
                </div>

                {/* Buttery Smooth CSS Grid Accordion Transition */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    openFaq === idx
                      ? 'grid-rows-[1fr] opacity-100 mt-3 sm:mt-4'
                      : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm sm:text-base text-[var(--ink-soft)] font-semibold leading-relaxed max-w-2xl pl-0 sm:pl-11 pb-1">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 10. GIANT CALL TO ACTION & FOOTER ─── */}
      <section
        id="contact"
        className="relative bg-[var(--bg)] py-20 sm:py-28 lg:py-32 px-6 sm:px-12 border-t-2 border-[var(--ink)] overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-white/30 blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-[1320px] w-full mx-auto flex flex-col justify-between">
          <div className="gsap-reveal mb-16">
            <h2 className="text-[clamp(2.6rem,8.5vw,7.8rem)] font-extrabold tracking-[-0.05em] leading-[0.88] uppercase mb-8 text-[var(--ink)]">
              Protect vision.<br />Screen now.
            </h2>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/screening/new"
                onClick={() => sound.playClick(900)}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[var(--ink)] text-[var(--accent)] font-extrabold text-base sm:text-lg tracking-tight shadow-[5px_5px_0_var(--ink)] hover:scale-105 active:scale-95 transition-all no-underline"
                data-cursor-label="SCREEN"
              >
                <span>Launch Screening Intake</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/dashboard"
                onClick={() => sound.playClick(720)}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full border-2 border-[var(--ink)] bg-[var(--paper)] text-[var(--ink)] font-bold text-base hover:scale-105 active:scale-95 transition-all no-underline shadow-[4px_4px_0_var(--ink)]"
                data-cursor-label="COCKPIT"
              >
                <span>Clinical Cockpit →</span>
              </Link>
            </div>
          </div>

          {/* Fluid Large Brand Mark & Bottom Credits */}
          <div className="border-t border-[var(--ink)]/20 pt-8">
            <div className="text-[clamp(2.8rem,13vw,12.5rem)] font-extrabold tracking-[-0.05em] leading-[0.8] select-none text-transparent stroke-2 [-webkit-text-stroke:2px_var(--ink)] hover:text-[var(--ink)] transition-colors duration-500">
              retina-mitra*
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-6 font-mono text-[11px] sm:text-xs text-[var(--ink-soft)] font-medium">
              <div>© Retina-Mitra Tele-Ophthalmology. Non-prescriptive clinical decision support.</div>
              <div>Autonomous Retinal AI Network · Rural Clinical Decision Support Hub</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
