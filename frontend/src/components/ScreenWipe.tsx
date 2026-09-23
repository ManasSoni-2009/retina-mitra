'use client';

import React, { useEffect, useRef } from 'react';

export function ScreenWipe() {
  const wipeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial mount reveal
    if (wipeRef.current) {
      wipeRef.current.style.transform = 'scaleY(0)';
      wipeRef.current.style.transformOrigin = 'top';
      wipeRef.current.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
    }
  }, []);

  return (
    <div
      ref={wipeRef}
      id="cs-wipe"
      className="pointer-events-none fixed inset-0 z-[9990] bg-[var(--ink)]"
      style={{
        transform: 'scaleY(0)',
        transformOrigin: 'bottom',
        willChange: 'transform',
      }}
    />
  );
}
