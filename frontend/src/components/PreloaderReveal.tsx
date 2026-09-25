'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export function PreloaderReveal() {
  const [isDone, setIsDone] = useState(false);
  const circleRef = useRef<SVGCircleElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const circle = circleRef.current;
    const ring = ringRef.current;
    const svg = svgRef.current;
    if (!circle || !svg) {
      setIsDone(true);
      return;
    }

    // Quick, punchy circular aperture opening animation (~0.6s)
    const tl = gsap.timeline({
      onComplete: () => {
        setIsDone(true);
      },
    });

    tl.fromTo(
      circle,
      { attr: { r: 0 } },
      {
        attr: { r: 95 },
        duration: 0.6,
        ease: 'power3.inOut',
      }
    );

    if (ring) {
      tl.fromTo(
        ring,
        { attr: { r: 0 }, opacity: 1 },
        {
          attr: { r: 95 },
          opacity: 0,
          duration: 0.6,
          ease: 'power3.inOut',
        },
        0
      );
    }

    // Safety timeout: guarantees removal within 750ms under all circumstances
    const safetyTimer = setTimeout(() => {
      setIsDone(true);
    }, 750);

    return () => {
      clearTimeout(safetyTimer);
      tl.kill();
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      id="cs-iris-loader"
      className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden select-none"
      style={{ willChange: 'transform' }}
    >
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <mask id="iris-reveal-mask">
            {/* White area = solid dark overlay */}
            <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
            {/* Black circle = transparent opening aperture */}
            <circle ref={circleRef} cx="50" cy="50" r="0" fill="#000000" />
          </mask>
        </defs>

        {/* The dark curtain with circular aperture */}
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          fill="var(--ink)"
          mask="url(#iris-reveal-mask)"
        />

        {/* Glowing tactile accent aperture rim */}
        <circle
          ref={ringRef}
          cx="50"
          cy="50"
          r="0"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
}
