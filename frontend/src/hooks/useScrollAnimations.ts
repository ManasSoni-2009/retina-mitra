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
        // 1. Fade up reveals for titles and descriptions
        gsap.utils.toArray<HTMLElement>('.gsap-reveal, .gsap-fade-up').forEach((el: HTMLElement) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                once: true,
              },
            }
          );
        });

        // 2. Bento cards stagger reveals
        gsap.utils.toArray<HTMLElement>('.gsap-card-grid').forEach((grid: HTMLElement) => {
          const cards = grid.querySelectorAll<HTMLElement>('.gsap-card');
          if (cards.length > 0) {
            gsap.fromTo(
              cards,
              { opacity: 0, y: 40, scale: 0.96 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.75,
                stagger: 0.12,
                ease: 'back.out(1.3)',
                scrollTrigger: {
                  trigger: grid,
                  start: 'top 85%',
                  once: true,
                },
              }
            );
          }
        });

        // 3. Stat counters pop-in
        gsap.utils.toArray<HTMLElement>('.gsap-counter').forEach((counter: HTMLElement) => {
          gsap.fromTo(
            counter,
            { opacity: 0, scale: 0.8 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.65,
              ease: 'back.out(1.5)',
              scrollTrigger: {
                trigger: counter,
                start: 'top 90%',
                once: true,
              },
            }
          );
        });

        // 4. FAQ list stagger reveal
        gsap.utils.toArray<HTMLElement>('.gsap-faq-group').forEach((group: HTMLElement) => {
          const items = group.querySelectorAll<HTMLElement>('.gsap-faq-item');
          if (items.length > 0) {
            gsap.fromTo(
              items,
              { opacity: 0, y: 28 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: group,
                  start: 'top 85%',
                  once: true,
                },
              }
            );
          }
        });

        // 5. Subtle image / badge hover magnetics
        gsap.utils.toArray<HTMLElement>('[data-magnetic]').forEach((el: HTMLElement) => {
          const onMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
            gsap.to(el, { x, y, duration: 0.3, ease: 'power2.out' });
          };
          const onLeave = () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
          };
          el.addEventListener('mousemove', onMove);
          el.addEventListener('mouseleave', onLeave);
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
