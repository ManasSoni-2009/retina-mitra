'use client';

import React, { useState } from 'react';

interface WorkerPass {
  id: string;
  code: string;
  title: string;
  role: string;
  shift: string;
  salary: string;
  quote: string;
  status: string;
  variant: string;
}

const WORKERS: WorkerPass[] = [
  {
    id: 'gate',
    code: 'OPENCV-GATE-01',
    title: 'Image Quality Sentinel',
    role: 'Blur, glare & focus verification',
    shift: '24/7 · on-site',
    salary: 'Real-time Check',
    quote: 'Rejects blur and glare before any diagnostic hazard occurs.',
    status: 'ACTIVE',
    variant: 'acid',
  },
  {
    id: 'neural',
    code: 'NEURAL-CAM-05',
    title: 'Microvascular Auditor',
    role: 'ICDR 5-class grading & explainability',
    shift: '24/7 · continuous',
    salary: 'Fast Pipeline',
    quote: 'Identifies microaneurysms, hemorrhages, and vascular changes.',
    status: 'ACTIVE',
    variant: 'cielo',
  },
  {
    id: 'calibrator',
    code: 'CALIBRATOR-99',
    title: 'Uncertainty Arbiter',
    role: 'Confidence verification & triage',
    shift: '24/7 · real-time',
    salary: 'Calibrated Confidence',
    quote: 'Refuses to guess. Escalates borderline cases to human ophthalmologists.',
    status: 'ACTIVE',
    variant: 'menta',
  },
  {
    id: 'telemitra',
    code: 'TELEMITRA-SYNC',
    title: 'Rural Telemedicine Dispatcher',
    role: 'Local queue & referral export',
    shift: '24/7 · zero data loss',
    salary: 'Offline-First Sync',
    quote: 'Keeps rural triage humming even when regional cellular connectivity drops.',
    status: 'ACTIVE',
    variant: 'coral',
  },
];

export function DigitalWorkerDeck() {
  const [activeIdx, setActiveIdx] = useState(0);

  const handleNextCard = () => {
    setActiveIdx((prev) => (prev + 1) % WORKERS.length);
  };

  return (
    <section
      id="workers"
      className="relative bg-[var(--bg)] py-20 sm:py-28 lg:py-32 px-6 sm:px-12 overflow-hidden border-t-2 border-[var(--ink)]"
    >
      {/* Fixed subtle underglow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-white/30 blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-[1320px] w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
        {/* Left Column: Heading & Description */}
        <div className="flex-1 max-w-lg gsap-reveal">
          <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--ink-soft)] mb-2">
            ( The Clinical Screening Fleet )
          </div>
          <h3 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] text-[var(--ink)] leading-[0.94] uppercase mb-5">
            Workflow support.<br />Zero diagnostic fatigue.
          </h3>
          <p className="text-sm sm:text-base text-[var(--ink-soft)] leading-relaxed font-semibold mb-6">
            Every component serves a specific clinical need — instant quality checking, explainable triage, uncertainty escalation, and offline synchronization for rural centres. Click the staff pass deck to cycle through the clinical workers.
          </p>
          <div className="font-mono text-[11px] text-[var(--ink-soft)] font-bold uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--ok)] animate-pulse" />
            Click card to cycle ({activeIdx + 1} of {WORKERS.length})
          </div>
        </div>

        {/* Right Column: Tactile Interactive Pass Deck */}
        <div
          className="relative w-full max-w-[340px] sm:max-w-[380px] h-[345px] sm:h-[360px] mx-auto cursor-pointer shrink-0"
          onClick={handleNextCard}
          data-cursor-label="CYCLE"
        >
          {WORKERS.map((worker, index) => {
            const offset = (index - activeIdx + WORKERS.length) % WORKERS.length;
            const isTop = offset === 0;

            return (
              <div
                key={worker.id}
                data-worker=""
                className="absolute inset-0 bg-[var(--paper)] border-[2.5px] border-[var(--ink)] rounded-3xl p-5 sm:p-6 shadow-[6px_6px_0_var(--ink)] sm:shadow-[8px_8px_0_var(--ink)] transition-all duration-500 ease-out select-none flex flex-col justify-between"
                style={{
                  transform: `translate3d(${offset * 8}px, ${offset * -10}px, 0) rotate(${offset * 1.8}deg)`,
                  zIndex: WORKERS.length - offset,
                  opacity: offset > 2 ? 0 : 1,
                  pointerEvents: isTop ? 'auto' : 'none',
                }}
              >
                {/* Card Header */}
                <div>
                  <div className="flex justify-between items-center font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--ink-mute)] mb-3">
                    <span>Retina-Mitra · Clinical Agent</span>
                    <span className="flex items-center gap-1.5 text-[var(--ok)] font-bold">
                      <span className="w-2 h-2 rounded-full bg-[var(--ok)]" />
                      {worker.status}
                    </span>
                  </div>

                  {/* Pass Body */}
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--ink)] text-[var(--accent)] flex items-center justify-center p-2 font-mono text-xs font-bold shadow-md shrink-0">
                      <div className="grid grid-cols-3 gap-0.5">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                        <span className="w-2 h-2 rounded-full bg-[var(--accent)] opacity-40" />
                        <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                        <span className="w-2 h-2 rounded-full bg-[var(--accent)] opacity-70" />
                        <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                        <span className="w-2 h-2 rounded-full bg-[var(--accent)] opacity-50" />
                        <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                        <span className="w-2 h-2 rounded-full bg-[var(--accent)] opacity-80" />
                        <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                      </div>
                    </div>
                    <div>
                      <div className="font-extrabold text-xl tracking-tight text-[var(--ink)]">
                        {worker.code}
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-mute)]">
                        {worker.title}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specs List */}
                <div className="space-y-1.5 border-t-[1.5px] border-dashed border-[var(--ink)]/25 pt-2 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="font-mono uppercase text-[var(--ink-mute)]">Duty</span>
                    <span className="font-bold text-[var(--ink)] text-right">{worker.role}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono uppercase text-[var(--ink-mute)]">Shift</span>
                    <span className="font-bold text-[var(--ink)] text-right">{worker.shift}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono uppercase text-[var(--ink-mute)]">Compute</span>
                    <span className="font-bold text-[var(--ink)] text-right">{worker.salary}</span>
                  </div>
                </div>

                {/* Quote Bubble */}
                <div className="mt-2 p-2.5 bg-[var(--accent)] border border-[var(--ink)]/20 rounded-xl text-xs font-semibold leading-snug text-[var(--ink)]">
                  {worker.quote}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
