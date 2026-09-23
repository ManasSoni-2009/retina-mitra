'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  tx: number; // Target X
  ty: number; // Target Y
  tz: number; // Target Z
  vx: number;
  vy: number;
  vz: number;
  size: number;
  alpha: number;
}

export function OrganismCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 6500 : 12000;
    const particles: Particle[] = [];

    // Mouse coordinates
    let mx = 0;
    let my = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let rotX = 0;
    let rotY = 0;

    // Track mouse
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = (e.clientX - rect.left - width / 2) * 0.8;
      my = (e.clientY - rect.top - height / 2) * 0.8;
      targetRotY = (mx / width) * 0.6;
      targetRotX = -(my / height) * 0.6;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Handle resize
    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', onResize);

    // Initialize particles
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width,
        y: (Math.random() - 0.5) * height,
        z: (Math.random() - 0.5) * 400,
        tx: 0,
        ty: 0,
        tz: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        size: Math.random() * 1.6 + 0.8,
        alpha: Math.random() * 0.7 + 0.3,
      });
    }

    // Generator 1: Retinal Fundus & Vessel Tree
    const computeRetinaShape = () => {
      const R = Math.min(width, height) * 0.42;
      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];
        if (i < COUNT * 0.2) {
          // Central optic disc & macula core
          const rad = Math.sqrt(Math.random()) * (R * 0.28);
          const theta = Math.random() * Math.PI * 2;
          p.tx = rad * Math.cos(theta);
          p.ty = rad * Math.sin(theta);
          p.tz = (Math.random() - 0.5) * 50;
        } else if (i < COUNT * 0.75) {
          // Vascular arcade branches
          const branch = i % 8;
          const branchAngle = (branch * Math.PI) / 4 + (Math.random() - 0.5) * 0.4;
          const dist = Math.pow(Math.random(), 0.7) * R;
          const wobble = Math.sin(dist * 0.05 + branch) * 26;
          p.tx = Math.cos(branchAngle) * dist + Math.sin(branchAngle) * wobble;
          p.ty = Math.sin(branchAngle) * dist - Math.cos(branchAngle) * wobble;
          p.tz = Math.sin(dist * 0.04) * 80;
        } else {
          // Outer retinal boundary sphere
          const u = Math.random();
          const v = Math.random();
          const theta = u * 2.0 * Math.PI;
          const phi = Math.acos(2.0 * v - 1.0);
          const r = R * (0.9 + Math.random() * 0.15);
          p.tx = r * Math.sin(phi) * Math.cos(theta);
          p.ty = r * Math.sin(phi) * Math.sin(theta) * 0.9;
          p.tz = r * Math.cos(phi) * 0.4;
        }
      }
    };

    // Generator 2: Neural Attention Mesh (Grad-CAM)
    const computeNeuralShape = () => {
      const R = Math.min(width, height) * 0.4;
      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;
        const r = R * (0.4 + Math.random() * 0.6);
        // Octahedral / neural clustered nodes
        const cluster = i % 6;
        const cx = (cluster === 0 ? 1 : cluster === 1 ? -1 : 0) * R * 0.45;
        const cy = (cluster === 2 ? 1 : cluster === 3 ? -1 : 0) * R * 0.45;
        const cz = (cluster === 4 ? 1 : cluster === 5 ? -1 : 0) * R * 0.45;
        p.tx = cx + (Math.random() - 0.5) * R * 0.45;
        p.ty = cy + (Math.random() - 0.5) * R * 0.45;
        p.tz = cz + (Math.random() - 0.5) * R * 0.45;
      }
    };

    // Generator 3: Fluid Organic Swarm (Cloudstudio Torus/Blob)
    const computeOrganicShape = () => {
      const R = Math.min(width, height) * 0.38;
      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];
        const u = (i / COUNT) * Math.PI * 2 * 3;
        const v = Math.random() * Math.PI * 2;
        const r1 = R * 0.65;
        const r2 = R * 0.28 + Math.sin(u * 2) * 20;
        p.tx = (r1 + r2 * Math.cos(v)) * Math.cos(u);
        p.ty = (r1 + r2 * Math.cos(v)) * Math.sin(u);
        p.tz = r2 * Math.sin(v) + Math.cos(u * 3) * 40;
      }
    };

    // Shape cycling
    const shapes = [computeRetinaShape, computeNeuralShape, computeOrganicShape];
    let shapeIdx = 0;
    shapes[0]();

    const shapeInterval = setInterval(() => {
      shapeIdx = (shapeIdx + 1) % shapes.length;
      shapes[shapeIdx]();
    }, 5500);

    // Render loop
    let rafId: number;
    let t = 0;

    const render = () => {
      t += 0.015;
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Read live theme ink/accent color
      const inkColor = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#0E0E0C';

      const cosY = Math.cos(rotY + t * 0.12);
      const sinY = Math.sin(rotY + t * 0.12);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      ctx.fillStyle = inkColor;

      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];

        // Spring to target
        p.vx = (p.vx + (p.tx - p.x) * 0.038) * 0.88;
        p.vy = (p.vy + (p.ty - p.y) * 0.038) * 0.88;
        p.vz = (p.vz + (p.tz - p.z) * 0.038) * 0.88;

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // 3D rotation
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        // Perspective projection
        const fov = 650;
        const scale = fov / (fov + z2 + 250);

        if (scale > 0) {
          const px = width / 2 + x1 * scale;
          const py = height / 2 + y2 * scale;
          const pSize = Math.max(0.5, p.size * scale);

          ctx.globalAlpha = Math.max(0.1, Math.min(1, p.alpha * scale * 1.2));
          ctx.beginPath();
          ctx.arc(px, py, pSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      clearInterval(shapeInterval);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
