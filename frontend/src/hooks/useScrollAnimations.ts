'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * GSAP ScrollTrigger hook for landing page animations.
 */
export function useScrollAnimations() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: gsap.Context | undefined;

    try {
      if (typeof window !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
      }

      if (!containerRef.current) return;

      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('.gsap-fade-up').forEach((el: HTMLElement) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                once: true,
              },
            }
          );
        });

        gsap.utils.toArray<HTMLElement>('.gsap-fade-in').forEach((el: HTMLElement) => {
          gsap.fromTo(
            el,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 92%',
                once: true,
              },
            }
          );
        });
      }, containerRef);
    } catch (e) {
      console.warn('Scroll animations skipped:', e);
    }

    return () => {
      try {
        if (ctx) {
          ctx.revert();
        }
      } catch (_) {}
    };
  }, []);

  return containerRef;
}
