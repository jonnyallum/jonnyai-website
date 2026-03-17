'use client';

import { useEffect, useRef } from 'react';

interface Strand {
  x0: number; y0: number;
  x1: number; y1: number;
  cx0: number; cy0: number;
  cx1: number; cy1: number;
  driftAmp: number;
  driftFreqX: number;
  driftFreqY: number;
  driftPhase: number;
  width: number;
  opacity: number;
}

interface Node {
  baseX: number; baseY: number;
  x: number; y: number;
  size: number;
  opacity: number;
  glowSize: number;
  pulseFreq: number;
  pulsePhase: number;
  driftAmp: number;
  driftPhase: number;
  driftFreq: number;
  isLarge: boolean;
}

export default function FiberCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
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

    // Random point near a canvas edge
    const edgePoint = (): [number, number] => {
      const side = Math.floor(Math.random() * 4);
      if (side === 0) return [Math.random() * w, -10];
      if (side === 1) return [w + 10, Math.random() * h];
      if (side === 2) return [Math.random() * w, h + 10];
      return [-10, Math.random() * h];
    };

    // --- FIBER STRANDS (40 bezier curves flowing edge-to-edge) ---
    const STRAND_COUNT = 40;
    const strands: Strand[] = Array.from({ length: STRAND_COUNT }, () => {
      const [x0, y0] = edgePoint();
      const [x1, y1] = edgePoint();
      return {
        x0, y0, x1, y1,
        // Control points placed randomly across canvas for organic curves
        cx0: w * 0.15 + Math.random() * w * 0.7,
        cy0: h * 0.05 + Math.random() * h * 0.9,
        cx1: w * 0.15 + Math.random() * w * 0.7,
        cy1: h * 0.05 + Math.random() * h * 0.9,
        driftAmp: 20 + Math.random() * 60,
        driftFreqX: 0.00025 + Math.random() * 0.00035,
        driftFreqY: 0.00020 + Math.random() * 0.00030,
        driftPhase: Math.random() * Math.PI * 2,
        width: 0.3 + Math.random() * 0.6,
        // Cool blue-grey, very subtle
        opacity: 0.05 + Math.random() * 0.12,
      };
    });

    // --- GLOWING NODES (citrus orange orbs, pulsing) ---
    const NODE_COUNT = 38;
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, (_, i) => {
      const isLarge = i < 9;
      const size = isLarge
        ? 2.8 + Math.random() * 3.2
        : 0.5 + Math.random() * 1.8;
      const bx = Math.random() * w;
      const by = Math.random() * h;
      return {
        baseX: bx, baseY: by,
        x: bx, y: by,
        size,
        opacity: isLarge ? 0.65 + Math.random() * 0.35 : 0.25 + Math.random() * 0.45,
        glowSize: size * (isLarge ? 14 : 8),
        pulseFreq: 0.0005 + Math.random() * 0.0012,
        pulsePhase: Math.random() * Math.PI * 2,
        driftAmp: isLarge ? 6 : 18,
        driftPhase: Math.random() * Math.PI * 2,
        driftFreq: 0.00015 + Math.random() * 0.00025,
        isLarge,
      };
    });

    const draw = () => {
      const t = Date.now();
      ctx.clearRect(0, 0, w, h);

      // --- Draw fiber strands ---
      strands.forEach((s) => {
        const dx = s.driftAmp * Math.sin(t * s.driftFreqX + s.driftPhase);
        const dy = s.driftAmp * Math.cos(t * s.driftFreqY + s.driftPhase + 1.1);
        ctx.beginPath();
        ctx.moveTo(s.x0, s.y0);
        ctx.bezierCurveTo(
          s.cx0 + dx, s.cy0 + dy,
          s.cx1 - dx * 0.6, s.cy1 - dy * 0.8,
          s.x1, s.y1,
        );
        ctx.strokeStyle = `rgba(155,180,215,${s.opacity})`;
        ctx.lineWidth = s.width;
        ctx.stroke();
      });

      // --- Draw glowing nodes ---
      nodes.forEach((n) => {
        const pulse = 1 + 0.18 * Math.sin(t * n.pulseFreq + n.pulsePhase);
        n.x = n.baseX + n.driftAmp * Math.sin(t * n.driftFreq + n.driftPhase);
        n.y = n.baseY + n.driftAmp * Math.cos(t * n.driftFreq * 0.85 + n.driftPhase + 0.8);

        const opacity = Math.min(1, n.opacity * pulse);
        const glowR = n.glowSize * pulse;

        // Soft outer glow halo
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
        grd.addColorStop(0,   `rgba(217,119,87,${Math.min(1, opacity * 0.55)})`);
        grd.addColorStop(0.25,`rgba(217,119,87,${Math.min(1, opacity * 0.18)})`);
        grd.addColorStop(0.6, `rgba(217,119,87,${Math.min(1, opacity * 0.05)})`);
        grd.addColorStop(1,   `rgba(217,119,87,0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Hot bright core
        const coreR = n.size * pulse;
        const core = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, coreR);
        core.addColorStop(0, `rgba(255,200,150,${opacity})`);
        core.addColorStop(0.5, `rgba(217,119,87,${opacity})`);
        core.addColorStop(1, `rgba(217,119,87,0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, coreR, 0, Math.PI * 2);
        ctx.fillStyle = core;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
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
