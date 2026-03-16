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
  isBright: boolean;
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

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else draw();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouse);

    // 220 particles — mix of regular dim ones + bright "star" accents
    const PARTICLE_COUNT = 220;
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const isBright = i < 30;
      return {
        angle: Math.random() * Math.PI * 2,
        baseRadius: 110 + Math.random() * 440,
        speed: (0.00015 + Math.random() * 0.00045) * (Math.random() > 0.5 ? 1 : -1),
        size: isBright ? Math.random() * 1.8 + 1.0 : Math.random() * 1.0 + 0.2,
        opacity: isBright ? Math.random() * 0.45 + 0.25 : Math.random() * 0.18 + 0.04,
        eccentricity: Math.random() * 0.45,
        tilt: Math.random() * Math.PI * 2,
        isBright,
      };
    });

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = w / 2;
      const cy = h * 0.40;
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

        const cosT = Math.cos(p.tilt);
        const sinT = Math.sin(p.tilt);
        const cosA = Math.cos(p.angle);
        const sinA = Math.sin(p.angle);
        let x = cx + cosA * rx * cosT - sinA * ry * sinT;
        let y = cy + cosA * rx * sinT + sinA * ry * cosT;

        // Mouse repulsion within 110px
        const dxM = x - mx;
        const dyM = y - my;
        const distM = Math.sqrt(dxM * dxM + dyM * dyM);
        if (distM < 110 && distM > 0) {
          const force = (110 - distM) / 110;
          x += (dxM / distM) * force * 32;
          y += (dyM / distM) * force * 32;
        }

        // Logo exclusion zone — 85px radius
        const dxC = x - cx;
        const dyC = y - cy;
        if (Math.sqrt(dxC * dxC + dyC * dyC) < 85) return;

        const edgeDist = Math.min(x, w - x, y, h - y);
        const edgeFade = Math.min(1, edgeDist / 120);
        const distFromCentre = Math.sqrt(dxC * dxC + dyC * dyC);
        const distFade = Math.max(0.2, 1 - distFromCentre / 700);
        const finalOpacity = p.opacity * edgeFade * distFade;

        // Bright star particles get a soft radial glow halo
        if (p.isBright && p.size > 1.0) {
          const glowRadius = p.size * 4;
          const grd = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
          grd.addColorStop(0, `rgba(217,119,87,${finalOpacity * 0.6})`);
          grd.addColorStop(1, `rgba(217,119,87,0)`);
          ctx.beginPath();
          ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217,119,87,${finalOpacity})`;
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
