'use client';

import React, { useEffect, useRef } from 'react';

/**
 * An animated SVG retinal fundus globe themed with the 6-color architectural palette:
 * #0B1728 (Midnight), #10213E (Oxford), #415A77 (Steel), #059669 (Sage), #384994 (Sand), #F4F7FB (Cream).
 */
export const RetinaGlobe: React.FC<{ className?: string }> = ({ className = '' }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    let frame: number;
    let t = 0;
    const animate = () => {
      t += 0.008;
      if (svg) {
        svg.style.transform = `translateY(${Math.sin(t) * 6}px) rotate(${Math.sin(t * 0.5) * 0.8}deg)`;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={`retina-orb select-none pointer-events-none ${className}`}>
      <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl"
        style={{ transition: 'transform 0.1s linear', willChange: 'transform' }}
        aria-hidden="true"
      >
        <defs>
          {/* Base fundus gradient - warm rich tones matching our palette */}
          <radialGradient id="fundus-bg" cx="50%" cy="52%" r="48%">
            <stop offset="0%"   stopColor="#78350F" stopOpacity="0.95" />
            <stop offset="40%"  stopColor="#451A03" stopOpacity="0.95" />
            <stop offset="80%"  stopColor="#10213E" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#0B1728" stopOpacity="1.00" />
          </radialGradient>

          {/* Sand & Sage highlight overlay - the AI processing glow */}
          <radialGradient id="ai-overlay" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#384994" stopOpacity="0.22" />
            <stop offset="50%"  stopColor="#059669" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#0B1728" stopOpacity="0" />
          </radialGradient>

          {/* Optic disc glow */}
          <radialGradient id="disc-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#F4F7FB" stopOpacity="1" />
            <stop offset="50%"  stopColor="#384994" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0" />
          </radialGradient>

          {/* Clip path for the globe circle */}
          <clipPath id="globe-clip">
            <circle cx="200" cy="200" r="185" />
          </clipPath>

          {/* Heatmap highlight (Grad-CAM overlay) */}
          <radialGradient id="heatmap" cx="55%" cy="48%" r="25%">
            <stop offset="0%"   stopColor="#384994" stopOpacity="0.40" />
            <stop offset="70%"  stopColor="#059669" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0B1728" stopOpacity="0" />
          </radialGradient>

          {/* Outer glow ring */}
          <filter id="outer-glow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feColorMatrix in="blur" type="matrix"
              values="0 0 0 0 0.83   0 0 0 0 0.77  0 0 0 0 0.66  0 0 0 0.45 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer glow rings */}
        <circle cx="200" cy="200" r="192" fill="none" stroke="#384994" strokeWidth="1.5" strokeOpacity="0.35" />
        <circle cx="200" cy="200" r="196" fill="none" stroke="#059669" strokeWidth="0.75" strokeOpacity="0.2" />

        {/* Main fundus globe */}
        <g clipPath="url(#globe-clip)" filter="url(#outer-glow)">
          {/* Background */}
          <circle cx="200" cy="200" r="185" fill="url(#fundus-bg)" />

          {/* AI glow overlay */}
          <circle cx="200" cy="200" r="185" fill="url(#ai-overlay)" />

          {/* Retinal vessel network */}
          <path d="M200 200 Q240 140 300 100 Q340 75 360 60"
            stroke="#C2410C" strokeWidth="3.5" strokeOpacity="0.85" fill="none" strokeLinecap="round" />
          <path d="M220 185 Q255 130 315 95"
            stroke="#9A3412" strokeWidth="2.2" strokeOpacity="0.65" fill="none" strokeLinecap="round" />
          <path d="M230 178 Q260 145 295 130 Q320 118 338 105"
            stroke="#9A3412" strokeWidth="1.5" strokeOpacity="0.5" fill="none" strokeLinecap="round" />

          {/* Inferior arcade */}
          <path d="M200 200 Q245 255 310 295 Q345 318 365 335"
            stroke="#C2410C" strokeWidth="3.5" strokeOpacity="0.85" fill="none" strokeLinecap="round" />
          <path d="M218 215 Q258 268 320 308"
            stroke="#9A3412" strokeWidth="2.2" strokeOpacity="0.65" fill="none" strokeLinecap="round" />

          {/* Nasal vessels */}
          <path d="M200 200 Q165 145 130 105 Q108 80 90 62"
            stroke="#C2410C" strokeWidth="3" strokeOpacity="0.7" fill="none" strokeLinecap="round" />
          <path d="M188 188 Q155 138 118 100"
            stroke="#9A3412" strokeWidth="1.8" strokeOpacity="0.55" fill="none" strokeLinecap="round" />

          <path d="M200 200 Q168 252 135 295 Q112 325 95 345"
            stroke="#C2410C" strokeWidth="3" strokeOpacity="0.7" fill="none" strokeLinecap="round" />

          {/* Micro-vessels */}
          <path d="M260 125 Q275 115 285 108" stroke="#9A3412" strokeWidth="1.2" strokeOpacity="0.45" fill="none" />
          <path d="M265 138 Q285 130 298 126" stroke="#9A3412" strokeWidth="1.0" strokeOpacity="0.4" fill="none" />
          <path d="M240 265 Q255 278 270 285" stroke="#9A3412" strokeWidth="1.2" strokeOpacity="0.45" fill="none" />
          <path d="M155 128 Q142 120 133 112" stroke="#9A3412" strokeWidth="1.0" strokeOpacity="0.4" fill="none" />
          <path d="M148 272 Q132 285 120 295" stroke="#9A3412" strokeWidth="1.0" strokeOpacity="0.4" fill="none" />

          {/* Grad-CAM attention heatmap */}
          <circle cx="220" cy="195" r="70" fill="url(#heatmap)" />

          {/* Microaneurysms */}
          <circle cx="265" cy="210" r="3.5" fill="#384994" fillOpacity="0.8" />
          <circle cx="280" cy="225" r="2.5" fill="#384994" fillOpacity="0.7" />
          <circle cx="258" cy="240" r="2" fill="#059669" fillOpacity="0.6" />
          <circle cx="290" cy="205" r="2" fill="#384994" fillOpacity="0.6" />

          {/* Optic disc */}
          <circle cx="200" cy="200" r="28" fill="url(#disc-glow)" />
          <circle cx="200" cy="200" r="22" fill="#384994" fillOpacity="0.9" />
          <circle cx="200" cy="200" r="14" fill="#F4F7FB" />
          <ellipse cx="202" cy="201" rx="7" ry="8" fill="#FFFFFF" fillOpacity="0.95" />

          {/* Macula / fovea */}
          <circle cx="280" cy="200" r="18" fill="#10213E" fillOpacity="0.5" />
          <circle cx="280" cy="200" r="6" fill="#0B1728" fillOpacity="0.7" />
          <circle cx="280" cy="200" r="2.5" fill="#000000" fillOpacity="0.9" />

          {/* Specular shine */}
          <ellipse cx="145" cy="145" rx="55" ry="35" fill="#F4F7FB" fillOpacity="0.08" />
        </g>

        {/* Outer border ring */}
        <circle cx="200" cy="200" r="185" fill="none" stroke="#384994" strokeWidth="2" strokeOpacity="0.4" />

        {/* Animated scanning line */}
        <line x1="15" y1="200" x2="385" y2="200" stroke="#384994" strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="8 4">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,-185; 0,185; 0,-185"
            dur="4s"
            repeatCount="indefinite"
          />
          <animate attributeName="stroke-opacity" values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite" />
        </line>
      </svg>
    </div>
  );
};
