'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight, ShieldCheck, Eye, Zap, Users,
  Activity, Lock, CheckCircle2, ChevronDown, Star,
  UserCheck, Brain, Globe
} from 'lucide-react';
import { RetinaGlobe } from '@/components/RetinaGlobe';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';

const steps = [
  {
    number: '01',
    title: 'Fundus Photograph Intake',
    description:
      'The operator uploads or captures a standard 45° posterior pole retinal scan via optical fundus camera or smartphone attachment.',
    icon: Eye,
    gradient: 'from-[#0B1728] to-[#10213E]',
  },
  {
    number: '02',
    title: 'OpenCV Quality Gate Assessment',
    description:
      'Automated Laplacian variance and illumination filters evaluate focus sharpness, macular glare, and field coverage before any AI inference.',
    icon: ShieldCheck,
    gradient: 'from-[#10213E] to-[#3C5880]',
  },
  {
    number: '03',
    title: 'Vascular & Lesion Segmentation',
    description:
      'Frangi vessel extraction traces the microvascular caliber while deep segmentation localizes microaneurysms, hemorrhages, and exudates.',
    icon: Zap,
    gradient: 'from-[#3C5880] to-[#059669]',
  },
  {
    number: '04',
    title: 'ICDR Classification & Grad-CAM',
    description:
      'Multi-task ensemble computes 5-class DR severity (Grade 0–4) and generates a backward hook Grad-CAM spatial attention heatmap.',
    icon: Brain,
    gradient: 'from-[#059669] to-[#2563EB]',
  },
  {
    number: '05',
    title: 'Temperature-Scaled Confidence',
    description:
      'Post-hoc temperature scaling measures epistemic uncertainty, auto-escalating cases below safety thresholds for human verification.',
    icon: Activity,
    gradient: 'from-[#0B1728] to-[#3C5880]',
  },
  {
    number: '06',
    title: 'Human Specialist Confirmation',
    description:
      'Ophthalmologist verifies visual findings, signs off or overrides the grade, and exports the official referral PDF slip.',
    icon: UserCheck,
    gradient: 'from-[#10213E] to-[#059669]',
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: 'Quality Gate',
    body: 'Images are evaluated for blur, illumination, and field coverage before entering the AI pipeline. Ungradable images are flagged before any analysis occurs.',
    glow: 'rgba(5, 150, 105, 0.25)',
  },
  {
    icon: Eye,
    title: 'Explainable AI',
    body: 'Every prediction is accompanied by Grad-CAM attention maps and vessel overlay visualizations, making the AI reasoning visible and auditable.',
    glow: 'rgba(37, 99, 235, 0.35)',
  },
  {
    icon: Users,
    title: 'Human-in-the-Loop',
    body: 'The system never autonomously diagnoses. Specialists receive structured evidence and override AI output with full reason logging and identity tracking.',
    glow: 'rgba(60, 88, 128, 0.25)',
  },
  {
    icon: Zap,
    title: 'Low-Connectivity Mode',
    body: 'Works in rural environments with unreliable connectivity. Screenings queue locally and sync automatically when connectivity is restored.',
    glow: 'rgba(37, 99, 235, 0.3)',
  },
  {
    icon: Activity,
    title: 'Epidemiological Analytics',
    body: 'Real-time cohort telemetry tracks Quality Gate pass rates, population severity distribution, and district specialist referral volumes.',
    glow: 'rgba(5, 150, 105, 0.25)',
  },
  {
    icon: Lock,
    title: 'Privacy by Design',
    body: 'Anonymized patient reference IDs. Encrypted local storage. Role-based Firebase access control. No sensitive data stored without clinical necessity.',
    glow: 'rgba(11, 23, 40, 0.2)',
  },
];

const principles = [
  {
    icon: UserCheck,
    text: 'AI assists. Ophthalmologists decide.',
  },
  {
    icon: ShieldCheck,
    text: 'No diagnosis without specialist review.',
  },
  {
    icon: Globe,
    text: 'Built for rural India. Works offline.',
  },
  {
    icon: Lock,
    text: 'Every action logged. Fully auditable.',
  },
];

const statPills = [
  '77M+ Diabetics in India',
  'DR Detectable Early',
  'AI Decision Support',
  'Human Review Always',
  'HIPAA-Aware Design',
  'Offline Ready',
  'Explainable Predictions',
  'Decision Support Prototype',
];

export default function HomePage() {
  const scrollRef = useScrollAnimations();

  return (
    <div ref={scrollRef} className="mesh-bg min-h-screen text-[#0B1728] pb-20 relative overflow-hidden">
      
      {/* Floating ambient luminous orbs */}
      <div className="absolute top-20 left-10 w-[550px] h-[550px] bg-gradient-to-tr from-[#2563EB]/35 to-[#059669]/25 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[40%] right-[-100px] w-[650px] h-[650px] bg-gradient-to-bl from-[#059669]/30 to-[#3C5880]/20 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-1/3 w-[600px] h-[600px] bg-gradient-to-r from-[#2563EB]/30 via-[#059669]/20 to-[#3C5880]/15 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: headline content */}
          <div className="space-y-8">
            {/* Frosted Glass Badge */}
            <div className="glass-pill inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[#0B1728] text-xs font-mono font-bold tracking-wide hover:shadow-md hover:scale-102 transition-all duration-300 cursor-default">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#0B1728] to-[#3C5880] animate-pulse" />
              Retinal Decision Support · Tele-Ophthalmology
            </div>

            {/* Main headline with multi-stop gradient */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-[#0B1728]">
              See What<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#384994] to-[#4F46E5]">Matters Most.</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg text-[#3C5880] leading-relaxed max-w-xl font-bold">
              RETINA-MITRA screens retinal photographs for early signs of diabetic retinopathy — explaining
              every result with visual AI evidence and routing uncertain cases to a human specialist.{' '}
              <strong className="text-[#0B1728] font-black">AI assists. Ophthalmologists decide.</strong>
            </p>

            {/* CTAs with Gradient Fills */}
            <div className="flex flex-wrap items-center gap-4">
              <Link 
                href="/screening/new" 
                className="btn-sand-primary text-base py-4 px-8 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group"
              >
                <span>Start a Screening</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              <Link 
                href="/dashboard" 
                className="btn-oxford-secondary text-base py-4 px-8 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 hover:border-slate-400 transition-all duration-300 group"
              >
                <Activity className="w-4 h-4 text-[#0B1728] group-hover:rotate-12 transition-transform duration-300" />
                <span>Open Dashboard</span>
              </Link>
            </div>

            {/* Principle frosted glass chips */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              {principles.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="glass-pill flex items-center gap-2 px-4 py-2 rounded-full text-xs text-[#0B1728] font-bold hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-300/80 transition-all duration-200 cursor-default"
                >
                  <Icon className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: animated retinal globe */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[460px] lg:h-[460px]">
              <RetinaGlobe className="w-full h-full" />

              {/* Floating glassmorphic annotation badges */}
              <div
                className="float-badge absolute -top-4 -left-8 sm:-left-12 px-4 py-3 rounded-2xl glass-panel text-xs font-black text-[#2C402F] flex items-center gap-2.5 shadow-2xl hover:scale-105 hover:border-emerald-400 transition-all duration-300 cursor-default"
                style={{ animationDelay: '0s' }}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse" />
                Quality Gate Passed
              </div>

              <div
                className="float-badge absolute top-1/4 -right-6 sm:-right-10 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#0B1728] via-[#10213E] to-[#3C5880] text-[#FFFFFF] shadow-2xl text-xs font-black flex items-center gap-2.5 border border-slate-200 hover:scale-105 hover:border-blue-400 transition-all duration-300 cursor-default"
                style={{ animationDelay: '1.5s' }}
              >
                <Eye className="w-4 h-4 text-[#2563EB]" />
                AI Analyzing…
              </div>

              <div
                className="float-badge absolute -bottom-4 right-4 px-4 py-3 rounded-2xl glass-panel text-xs font-black text-[#0B1728] flex items-center gap-2.5 shadow-2xl hover:scale-105 hover:border-emerald-400 transition-all duration-300 cursor-default"
                style={{ animationDelay: '3s' }}
              >
                <UserCheck className="w-4 h-4 text-[#059669]" />
                Specialist Review
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#3C5880] text-xs font-bold hover:text-[#0B1728] transition-colors cursor-pointer">
          <span>Scroll to explore</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#0B1728]" />
        </div>
      </section>

      {/* ── STAT PILLS: HORIZONTAL ARRANGEMENT ───────────────────────────────── */}
      <div className="border-y border-slate-200 dark:border-slate-800 bg-gradient-to-r from-white/80 via-[#F8FAFC]/90 to-white/80 dark:from-[#080E1A]/80 dark:via-[#0D1829]/90 dark:to-[#080E1A]/80 backdrop-blur-xl py-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-7xl mx-auto px-4">
          {statPills.map((pill, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-[#10213E]/90 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs text-xs font-bold text-[#0B1728] dark:text-white hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-400/70 hover:scale-103 transition-all duration-200 cursor-default select-none"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
              <span>{pill}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS: 6-STEP SCREENING PIPELINE ──────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <div className="glass-pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-[#0B1728] text-xs font-mono font-bold tracking-wide shadow-sm hover:scale-102 hover:shadow-md transition-all duration-300">
            <Star className="w-3.5 h-3.5 text-[#059669]" />
            End-to-End Diagnostic Architecture
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-[#0B1728] tracking-tight">
            The Complete Screening Pipeline
          </h2>
          <p className="text-[#3C5880] max-w-2xl mx-auto text-base font-semibold leading-relaxed">
            From raw fundus photograph to ophthalmologist sign-off — every single stage explained in transparent clinical detail.
          </p>
        </div>

        {/* 6 Steps Grid with Glassmorphic Gradient Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {steps.map(({ number, title, description, icon: Icon, gradient }) => (
            <div key={number} className="relative group">
              <div className="p-7 h-full glass-panel flex flex-col justify-between space-y-5 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:border-blue-400/50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${gradient} text-[#FFFFFF] shadow-xl shadow-[#0B1728]/20 border border-white/30 group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-4xl font-black font-mono text-[#2563EB]/40 group-hover:text-[#2563EB] transition-colors duration-300 select-none">
                      {number}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#0B1728] mb-2 group-hover:text-blue-600 transition-colors duration-200">
                      {title}
                    </h3>
                    <p className="text-xs text-[#3C5880] leading-relaxed font-semibold">
                      {description}
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-[#0B1728]">
                  <span className="font-bold text-slate-500 group-hover:text-[#0B1728] transition-colors">Stage {number} of 06</span>
                  <span className="font-black text-[#2C402F] bg-[#059669]/15 px-2.5 py-0.5 rounded-full border border-[#059669]/30 group-hover:bg-[#059669]/25 group-hover:border-[#059669]/50 transition-all">Verified ✓</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES BENTO WITH FROSTED GLASS & GLOW ──────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-white/40 via-[#F8FAFC]/60 to-white/40 border-y border-slate-200 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <div className="glass-pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-[#0B1728] text-xs font-mono font-bold tracking-wide shadow-sm hover:scale-102 hover:shadow-md transition-all duration-300">
              <Zap className="w-3.5 h-3.5 text-[#0B1728]" />
              Platform Capabilities
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-[#0B1728] tracking-tight">
              Built for the Real World.
            </h2>
            <p className="text-[#3C5880] max-w-xl mx-auto text-base font-semibold leading-relaxed">
              Every feature exists because screening in rural India demands it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, body, glow }) => {
              return (
                <div
                  key={title}
                  className="glass-panel p-7 group cursor-default transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-slate-300"
                  style={{
                    boxShadow: `0 10px 30px 0 ${glow}, inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)`,
                  }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-[#0B1728] via-[#10213E] to-[#3C5880] text-[#FFFFFF] shadow-lg group-hover:scale-110 group-hover:shadow-blue-500/20 transition-all duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-black text-[#0B1728] group-hover:text-blue-600 transition-colors duration-200">
                        {title}
                      </h3>
                    </div>
                    <p className="text-xs text-[#3C5880] leading-relaxed font-bold">
                      {body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CLINICAL DISCLAIMER BAND ─────────────────────────────────────────── */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-panel p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-2xl hover:shadow-3xl hover:border-slate-300 transition-all duration-300 group">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0B1728] to-[#10213E] text-[#2563EB] shrink-0 shadow-xl group-hover:scale-105 transition-transform duration-300">
            <UserCheck className="w-8 h-8" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-lg font-black text-[#0B1728]">Decision Support — Not Autonomous Diagnosis</h3>
            <p className="text-xs text-[#3C5880] leading-relaxed max-w-2xl font-bold">
              RETINA-MITRA is a decision-support tool. It does <strong>not</strong> replace an ophthalmologist.
              All screening results with referable or uncertain findings are escalated to a qualified specialist
              for review before any clinical action is taken. The system cannot and does not diagnose autonomously.
            </p>
          </div>
        </div>
      </section>

      {/* ── DARK CTA FOOTER (BOLD DARK GLASS ACCENT) ─────────────────────────── */}
      <section className="py-24 mesh-bg-dark text-[#FFFFFF] overflow-hidden relative rounded-t-[3.5rem] shadow-2xl border-t border-[#3C5880]/40">
        <div className="relative max-w-3xl mx-auto px-4 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-slate-200 text-xs font-mono font-bold text-[#2563EB] shadow-lg backdrop-blur-xl hover:bg-white/15 hover:scale-105 transition-all duration-300 cursor-default">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
            Ready when you are
          </div>

          <h2 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight text-white">
            Screen Your First<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#384994]">Retinal Image.</span>
          </h2>

          <p className="text-[#FFFFFF]/80 text-base max-w-lg mx-auto leading-relaxed font-semibold">
            Upload a fundus photograph, see the AI analysis with visual explanations,
            and route it to a specialist queue in seconds.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/screening/new"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#2563EB] via-[#E3D7C1] to-[#C4B498] hover:from-[#E3D7C1] hover:to-[#2563EB] text-[#0B1728] rounded-2xl font-black text-sm shadow-2xl shadow-[#2563EB]/30 transition-all duration-300 hover:scale-105 active:scale-95 group"
            >
              <span>Start Screening Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
            <Link 
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-[#FFFFFF] rounded-2xl font-bold text-sm border border-white/20 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 hover:border-white/40"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
