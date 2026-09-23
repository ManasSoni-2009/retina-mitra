'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { sound } from '@/lib/sound';

interface PillItem {
  id: string;
  label: string;
  variant: 'accent' | 'paper' | 'outline';
  dot?: boolean;
}

const PILLS: PillItem[] = [
  { id: '1', label: '✦ OpenCV Focus Variance', variant: 'accent', dot: true },
  { id: '2', label: 'EfficientNet-B0 Backbone', variant: 'paper' },
  { id: '3', label: 'Grad-CAM Attention Heatmap', variant: 'outline', dot: true },
  { id: '4', label: 'Frangi Vessel Extraction', variant: 'paper' },
  { id: '5', label: 'Laplacian Sharpness Filter', variant: 'outline' },
  { id: '6', label: 'Temperature-Scaled Confidence', variant: 'accent', dot: true },
  { id: '7', label: 'Epistemic Uncertainty Abstention', variant: 'paper' },
  { id: '8', label: 'Human Specialist Override', variant: 'accent', dot: true },
  { id: '9', label: 'Bilingual Reports (EN / MR)', variant: 'paper' },
  { id: '10', label: 'Rural Offline IndexedDB Sync', variant: 'outline' },
  { id: '11', label: 'Zero Demo Mode Guarantee', variant: 'accent' },
  { id: '12', label: 'Monte Carlo Dropout', variant: 'paper' },
  { id: '13', label: 'Sub-second GPU Inference', variant: 'outline', dot: true },
  { id: '14', label: 'Non-Prescriptive Safe Output', variant: 'paper' },
];

interface PhysicsBody {
  id: string;
  el: HTMLElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  isDragging: boolean;
  dragOffsetX: number;
  dragOffsetY: number;
  isSleeping: boolean;
}

export function PhysicsPillBox() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<Map<string, HTMLSpanElement>>(new Map());
  const bodiesRef = useRef<PhysicsBody[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Scatter toolkit function (re-drop pills with kinetic upward bursts)
  const handleScatter = () => {
    sound.playClick(880);
    const bodies = bodiesRef.current;
    bodies.forEach((b) => {
      b.isSleeping = false;
      b.vy = -(Math.random() * 12 + 8);
      b.vx = (Math.random() - 0.5) * 14;
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cw = container.clientWidth;
    let ch = container.clientHeight;
    if (cw === 0 || ch === 0) {
      cw = 1000;
      ch = 480;
    }

    const bodies: PhysicsBody[] = [];
    const gravity = 0.38;
    const bounce = 0.55;
    const airFriction = 0.985;
    const groundFriction = 0.92;
    let lastSoundTime = 0;

    const playCollisionSound = (pitch = 440) => {
      const now = performance.now();
      if (now - lastSoundTime > 120) {
        lastSoundTime = now;
        sound.playHover(pitch);
      }
    };

    // Initialize positions staggered across top half
    PILLS.forEach((p, idx) => {
      const el = pillsRef.current.get(p.id);
      if (!el) return;

      const w = el.offsetWidth || 180;
      const h = el.offsetHeight || 44;

      const cols = 4;
      const col = idx % cols;
      const row = Math.floor(idx / cols);

      const body: PhysicsBody = {
        id: p.id,
        el,
        x: Math.min(cw - w - 20, Math.max(15, (cw / cols) * col + (Math.random() * 30 - 15))),
        y: Math.max(10, row * 55 + (Math.random() * 20)),
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 2 + 1,
        w,
        h,
        isDragging: false,
        dragOffsetX: 0,
        dragOffsetY: 0,
        isSleeping: false,
      };

      // Pointer event handlers with rolling velocity window
      let pointerHistory: { x: number; y: number; t: number }[] = [];

      const onPointerDown = (e: PointerEvent) => {
        e.preventDefault();
        sound.playClick(750);
        body.isDragging = true;
        body.isSleeping = false;
        el.setPointerCapture(e.pointerId);

        const rect = container.getBoundingClientRect();
        body.dragOffsetX = e.clientX - rect.left - body.x;
        body.dragOffsetY = e.clientY - rect.top - body.y;
        pointerHistory = [{ x: e.clientX, y: e.clientY, t: performance.now() }];
        body.vx = 0;
        body.vy = 0;
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!body.isDragging) return;
        const rect = container.getBoundingClientRect();
        const curX = e.clientX - rect.left - body.dragOffsetX;
        const curY = e.clientY - rect.top - body.dragOffsetY;

        body.x = Math.max(0, Math.min(container.clientWidth - body.w, curX));
        body.y = Math.max(0, Math.min(container.clientHeight - body.h, curY));

        pointerHistory.push({ x: e.clientX, y: e.clientY, t: performance.now() });
        if (pointerHistory.length > 5) pointerHistory.shift();
      };

      const onPointerUp = (e: PointerEvent) => {
        if (!body.isDragging) return;
        body.isDragging = false;
        el.releasePointerCapture(e.pointerId);

        // Calculate velocity from rolling history
        if (pointerHistory.length >= 2) {
          const first = pointerHistory[0];
          const last = pointerHistory[pointerHistory.length - 1];
          const dt = Math.max(16, last.t - first.t) / 1000;
          body.vx = Math.max(-28, Math.min(28, (last.x - first.x) / dt * 0.035));
          body.vy = Math.max(-28, Math.min(28, (last.y - first.y) / dt * 0.035));
        }

        sound.playHover(560);
      };

      el.addEventListener('pointerdown', onPointerDown);
      el.addEventListener('pointermove', onPointerMove);
      el.addEventListener('pointerup', onPointerUp);
      el.addEventListener('pointercancel', onPointerUp);

      bodies.push(body);
    });

    bodiesRef.current = bodies;
    setIsReady(true);

    const onResize = () => {
      if (!container) return;
      cw = container.clientWidth;
      ch = container.clientHeight;
      bodies.forEach((b) => {
        b.w = b.el.offsetWidth || 180;
        b.h = b.el.offsetHeight || 44;
        if (b.x + b.w > cw) b.x = Math.max(0, cw - b.w);
        if (b.y + b.h > ch) b.y = Math.max(0, ch - b.h);
      });
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    // Physics step
    let rafId: number;
    const step = () => {
      cw = container.clientWidth;
      ch = container.clientHeight;

      // 1. Position & Boundary Updates
      bodies.forEach((b) => {
        if (b.isDragging) {
          b.el.style.transform = `translate3d(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px, 0) scale(1.06)`;
          b.el.style.zIndex = '50';
          return;
        }

        b.el.style.zIndex = '1';

        if (b.isSleeping) {
          b.el.style.transform = `translate3d(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px, 0)`;
          return;
        }

        // Apply Gravity & Friction
        b.vy += gravity;
        b.vx *= airFriction;
        b.vy *= airFriction;

        b.x += b.vx;
        b.y += b.vy;

        // Floor collision with sleep damping (Zero Jitter)
        if (b.y + b.h >= ch) {
          b.y = ch - b.h;
          if (Math.abs(b.vy) < 0.8) {
            b.vy = 0;
            b.vx *= groundFriction;
            if (Math.abs(b.vx) < 0.1) {
              b.vx = 0;
              b.isSleeping = true;
            }
          } else {
            b.vy = -b.vy * bounce;
            b.vx *= 0.92;
            playCollisionSound(380);
          }
        }

        // Ceiling collision
        if (b.y <= 0) {
          b.y = 0;
          b.vy = Math.abs(b.vy) * bounce;
          playCollisionSound(460);
        }

        // Left wall
        if (b.x <= 0) {
          b.x = 0;
          b.vx = Math.abs(b.vx) * bounce;
          playCollisionSound(420);
        }

        // Right wall
        if (b.x + b.w >= cw) {
          b.x = cw - b.w;
          b.vx = -Math.abs(b.vx) * bounce;
          playCollisionSound(420);
        }

        b.el.style.transform = `translate3d(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px, 0)`;
      });

      // 2. Inter-Pill Pairwise Collision & Separation
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const b1 = bodies[i];
          const b2 = bodies[j];

          const c1x = b1.x + b1.w / 2;
          const c1y = b1.y + b1.h / 2;
          const c2x = b2.x + b2.w / 2;
          const c2y = b2.y + b2.h / 2;

          const dx = c2x - c1x;
          const dy = c2y - c1y;

          const minDistX = (b1.w + b2.w) * 0.44;
          const minDistY = (b1.h + b2.h) * 0.50;

          if (Math.abs(dx) < minDistX && Math.abs(dy) < minDistY) {
            // Overlap detected: calculate push-out
            const overlapX = minDistX - Math.abs(dx);
            const overlapY = minDistY - Math.abs(dy);

            if (overlapX < overlapY) {
              const push = overlapX * 0.5;
              const sign = dx > 0 ? 1 : -1;
              if (!b1.isDragging) {
                b1.x -= push * sign;
                b1.vx -= sign * 0.5;
                b1.isSleeping = false;
              }
              if (!b2.isDragging) {
                b2.x += push * sign;
                b2.vx += sign * 0.5;
                b2.isSleeping = false;
              }
            } else {
              const push = overlapY * 0.5;
              const sign = dy > 0 ? 1 : -1;
              if (!b1.isDragging) {
                b1.y -= push * sign;
                b1.vy -= sign * 0.5;
                b1.isSleeping = false;
              }
              if (!b2.isDragging) {
                b2.y += push * sign;
                b2.vy += sign * 0.5;
                b2.isSleeping = false;
              }
            }
          }
        }
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* Control bar */}
      <div className="flex justify-between items-center mb-3 px-1">
        <div className="font-mono text-[11px] text-[var(--ink-soft)] uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--ok)] animate-pulse" />
          <span>Interactive 2D Physics Engine · Rest Damping Enabled</span>
        </div>
        <button
          type="button"
          onClick={handleScatter}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--ink)] bg-[var(--paper)] text-[var(--ink)] text-xs font-mono font-bold uppercase shadow-[2px_2px_0_var(--ink)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          data-cursor-label="SCATTER"
          title="Re-launch all pills into air"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Scatter Toolkit</span>
        </button>
      </div>

      {/* Physics Sandbox Box */}
      <div
        ref={containerRef}
        id="cs-physics-box"
        className="relative w-full h-[360px] sm:h-[480px] lg:h-[520px] rounded-3xl border-[2.5px] border-[var(--ink)] ring-1 ring-white/60 bg-[var(--ink)] overflow-hidden touch-pan-y select-none shadow-[0_8px_30px_rgba(0,0,0,0.22),6px_6px_0_var(--ink)]"
        data-cursor-label="THROW"
      >
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--accent) 1px, transparent 1px), linear-gradient(to bottom, var(--accent) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        {PILLS.map((p) => {
          let styleClass = '';
          if (p.variant === 'accent') {
            styleClass =
              'bg-[var(--accent)] text-[var(--ink)] font-extrabold border-2 border-[var(--accent)] shadow-lg';
          } else if (p.variant === 'paper') {
            styleClass =
              'bg-[var(--paper)] text-[var(--ink)] font-extrabold border-2 border-[var(--ink)] shadow-md';
          } else {
            styleClass =
              'bg-black/60 text-[var(--accent)] border-2 border-[var(--accent)] font-extrabold shadow-md backdrop-blur-sm';
          }

          return (
            <span
              key={p.id}
              ref={(el) => {
                if (el) pillsRef.current.set(p.id, el);
                else pillsRef.current.delete(p.id);
              }}
              data-pill=""
              className={`absolute top-0 left-0 cursor-grab active:cursor-grabbing inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-[12px] sm:text-[14px] lg:text-[15px] tracking-tight whitespace-nowrap will-change-transform transition-shadow hover:ring-2 hover:ring-white/80 touch-none ${styleClass}`}
            >
              {p.dot && <span className="w-2 h-2 rounded-full bg-[var(--ink)] animate-pulse" />}
              {p.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
