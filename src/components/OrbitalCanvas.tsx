'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  angle: number;
  baseRadius: number;
  speed: number;
  size: number;
  opacity: number;
  eccentricity: number;
  tilt: number;
}

export default function OrbitalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Pause on hidden tab to save resources
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else draw();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouse);

    // Build particles — varying radii, speeds, tilts for organic feel
    const PARTICLE_COUNT = 160;
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      baseRadius: 90 + Math.random() * 380,
      speed: (0.00025 + Math.random() * 0.0006) * (Math.random() > 0.5 ? 1 : -1),
      size: Math.random() * 1.6 + 0.3,
      opacity: Math.random() * 0.25 + 0.05,
      eccentricity: Math.random() * 0.4,
      tilt: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Logo sits roughly 42% from top in the hero
      const cx = w / 2;
      const cy = h * 0.42;
      const t = Date.now();
      const breathe = 1 + 0.05 * Math.sin(t / 8000);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        p.angle += p.speed;

        const r = p.baseRadius * breathe;
        const rx = r * (1 - p.eccentricity);
        const ry = r;

        // Tilted ellipse orbit
        const cosT = Math.cos(p.tilt);
        const sinT = Math.sin(p.tilt);
        const cosA = Math.cos(p.angle);
        const sinA = Math.sin(p.angle);
        let x = cx + cosA * rx * cosT - sinA * ry * sinT;
        let y = cy + cosA * rx * sinT + sinA * ry * cosT;

        // Mouse repulsion — particles within 90px deflect away
        const dxM = x - mx;
        const dyM = y - my;
        const distM = Math.sqrt(dxM * dxM + dyM * dyM);
        if (distM < 90 && distM > 0) {
          const force = (90 - distM) / 90;
          x += (dxM / distM) * force * 24;
          y += (dyM / distM) * force * 24;
        }

        // Skip logo exclusion zone (~70px radius from centre)
        const dxC = x - cx;
        const dyC = y - cy;
        if (Math.sqrt(dxC * dxC + dyC * dyC) < 70) return;

        // Edge fade — particles fade near viewport edges
        const edgeDist = Math.min(x, w - x, y, h - y);
        const edgeFade = Math.min(1, edgeDist / 100);

        // Distance fade — particles far from centre are dimmer
        const distFromCentre = Math.sqrt(dxC * dxC + dyC * dyC);
        const distFade = Math.max(0.3, 1 - distFromCentre / 600);

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217,119,87,${p.opacity * edgeFade * distFade})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
