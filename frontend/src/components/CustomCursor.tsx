'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { sound } from '@/lib/sound';

export function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Do not initialize custom cursor on touch-only mobile devices
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      return;
    }

    const outer = outerRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!outer || !dot || !label) return;

    // Use GSAP quickTo for buttery 120fps hardware-accelerated movement
    const xOuter = gsap.quickTo(outer, 'x', { duration: 0.26, ease: 'power3.out' });
    const yOuter = gsap.quickTo(outer, 'y', { duration: 0.26, ease: 'power3.out' });

    const xDot = gsap.quickTo(dot, 'x', { duration: 0.06, ease: 'power2.out' });
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.06, ease: 'power2.out' });

    let isVisible = false;
    let currentMode: 'dot' | 'ring' | 'label' = 'dot';

    const setMode = (mode: 'dot' | 'ring' | 'label', text: string = '') => {
      if (mode === currentMode && text === label.textContent) return;
      currentMode = mode;

      if (mode === 'label') {
        label.textContent = text;
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.18, overwrite: 'auto' });
        gsap.to(outer, {
          height: 38,
          width: 'auto',
          paddingLeft: 16,
          paddingRight: 16,
          backgroundColor: 'var(--ink)',
          borderColor: 'var(--accent)',
          borderRadius: 9999,
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          scale: 1,
          duration: 0.22,
          ease: 'back.out(1.4)',
          overwrite: 'auto',
        });
        gsap.to(dot, { opacity: 0, scale: 0.3, duration: 0.15, overwrite: 'auto' });
      } else if (mode === 'ring') {
        gsap.to(label, { opacity: 0, scale: 0.5, duration: 0.15, overwrite: 'auto' });
        label.textContent = '';
        gsap.to(outer, {
          height: 48,
          width: 48,
          paddingLeft: 0,
          paddingRight: 0,
          backgroundColor: 'rgba(var(--ink-rgb), 0.12)',
          borderColor: 'var(--ink)',
          borderRadius: 9999,
          boxShadow: '0 0 0 1.5px var(--accent)',
          scale: 1,
          duration: 0.22,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.to(dot, { opacity: 1, scale: 1, duration: 0.18, overwrite: 'auto' });
      } else {
        gsap.to(label, { opacity: 0, scale: 0.5, duration: 0.15, overwrite: 'auto' });
        label.textContent = '';
        gsap.to(outer, {
          height: 34,
          width: 34,
          paddingLeft: 0,
          paddingRight: 0,
          backgroundColor: 'transparent',
          borderColor: 'var(--ink)',
          borderRadius: 9999,
          boxShadow: '0 0 0 1.5px var(--accent)',
          scale: 1,
          duration: 0.22,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.to(dot, { opacity: 1, scale: 1, duration: 0.18, overwrite: 'auto' });
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      // Ignore touch events to preserve native touch screen behavior
      if (e.pointerType === 'touch') return;

      const { clientX, clientY } = e;

      xOuter(clientX);
      yOuter(clientY);
      xDot(clientX);
      yDot(clientY);

      if (!isVisible) {
        isVisible = true;
        gsap.to([outer, dot], { opacity: 1, duration: 0.2 });
        document.documentElement.classList.add('has-custom-cursor');
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      gsap.to(outer, { scale: 0.85, duration: 0.12, ease: 'power2.inOut' });
      gsap.to(dot, { scale: 1.3, duration: 0.12, ease: 'power2.inOut' });
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      gsap.to(outer, { scale: 1, duration: 0.22, ease: 'back.out(2)' });
      gsap.to(dot, { scale: 1, duration: 0.18, ease: 'back.out(2)' });
    };

    const onPointerLeave = () => {
      isVisible = false;
      gsap.to([outer, dot], { opacity: 0, duration: 0.2 });
      document.documentElement.classList.remove('has-custom-cursor');
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave, { passive: true });

    // Interactive Hover Delegate
    const HOT_SELECTOR =
      'a, button, [data-bouncy], [data-cursor-label], [data-worker], [data-pill], [data-faq-q], input, select, textarea';

    const onMouseOver = (e: MouseEvent) => {
      if (!isVisible) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const hot = target.closest(HOT_SELECTOR) as HTMLElement | null;
      if (hot) {
        sound.playHover(520);
        const customLabel = hot.getAttribute('data-cursor-label');
        if (customLabel) {
          setMode('label', customLabel);
          return;
        }

        if (hot.closest('[data-pill]')) {
          setMode('label', 'THROW');
          return;
        }

        if (hot.closest('[data-worker]')) {
          setMode('label', 'CYCLE');
          return;
        }

        if (hot.closest('[data-faq-q]')) {
          setMode('label', 'EXPAND');
          return;
        }

        if (hot.closest('a[href*="screening"]') || hot.closest('button[data-scan]')) {
          setMode('label', 'SCAN');
          return;
        }

        if (hot.closest('a') || hot.closest('button')) {
          setMode('ring');
          return;
        }
      } else {
        setMode('dot');
      }
    };

    document.addEventListener('mouseover', onMouseOver, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('mouseover', onMouseOver);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      {/* Outer Magnetic Elastic Ring / Label Capsule */}
      <div
        ref={outerRef}
        id="cs-cursor-outer"
        className="pointer-events-none fixed top-0 left-0 z-[2147483647] hidden md:flex items-center justify-center font-mono uppercase tracking-wider select-none opacity-0 border-2"
        style={{
          transform: 'translate(-50%, -50%)',
          willChange: 'transform, width, height',
          backgroundColor: 'transparent',
          borderColor: 'var(--ink)',
          borderRadius: '9999px',
          height: '34px',
          width: '34px',
          boxShadow: '0 0 0 1.5px var(--accent)',
          color: 'var(--accent)',
          fontSize: '11px',
          fontWeight: 800,
        }}
      >
        <span
          ref={labelRef}
          className="opacity-0 scale-50 whitespace-nowrap px-1"
        />
      </div>

      {/* Inner Precision Lead Dot */}
      <div
        ref={dotRef}
        id="cs-cursor-dot"
        className="pointer-events-none fixed top-0 left-0 z-[2147483647] hidden md:block w-2 h-2 rounded-full opacity-0 shadow-sm"
        style={{
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--ink)',
          border: '1.5px solid var(--accent)',
          willChange: 'transform',
        }}
      />
    </>
  );
}
