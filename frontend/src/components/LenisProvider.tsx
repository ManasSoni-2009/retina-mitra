'use client';

import React, { useEffect } from 'react';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lenisInstance: unknown = null;

    // Dynamically import lenis on client side
    import('lenis')
      .then(({ default: Lenis }) => {
        lenisInstance = new Lenis({
          duration: 1.1,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1.0,
          touchMultiplier: 1.5,
        });

        function raf(time: number) {
          (lenisInstance as { raf: (t: number) => void })?.raf(time);
          requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
      })
      .catch(() => {
        // Fallback to standard smooth scrolling if lenis isn't loaded
      });

    return () => {
      (lenisInstance as { destroy?: () => void })?.destroy?.();
    };
  }, []);

  return <>{children}</>;
}
