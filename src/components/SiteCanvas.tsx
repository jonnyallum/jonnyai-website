'use client';

/**
 * SiteCanvas — fixed background canvas for all inner pages.
 * Matches the FiberCanvas brand aesthetic: fiber strands + citrus nodes.
 * Runs at lower intensity than FiberCanvas so page content stays readable.
 */
import { useEffect, useRef } from 'react';

interface Strand {
  pts: { x: number; y: number }[];
  width: number;
  opacity: number;
  driftAmp: number;
  driftFreq: number;
  driftPhase: number;
}

interface Node {
  baseX: number; baseY: number;
  x: number; y: number;
  size: number;
  glowMult: number;
  opacity: number;
  pulseFreq: number;
  pulsePhase: number;
  driftAmp: number;
  driftFreq: number;
  driftPhase: number;
}

export default function SiteCanvas() {
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
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = `${w}px`;
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

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    // ─── STRANDS — sparser than hero, same fiber look ─────────────
    const STRAND_COUNT = 30;
    const strands: Strand[] = Array.from({ length: STRAND_COUNT }, () => {
      const fromBottom = Math.random() < 0.5;
      let sx: number, sy: number;
      if (fromBottom) {
        sx = rand(-0.1, 1.1) * w;
        sy = rand(0.7, 1.2) * h;
      } else {
        const side = Math.random() < 0.5 ? -0.05 : 1.05;
        sx = side * w;
        sy = rand(-0.1, 1.1) * h;
      }
      const ex = rand(0.05, 0.95) * w;
      const ey = rand(-0.1, 0.6) * h;

      return {
        pts: [
          { x: sx, y: sy },
          { x: rand(0.1, 0.9) * w, y: rand(0.3, 0.9) * h },
          { x: rand(0.1, 0.9) * w, y: rand(0.1, 0.6) * h },
          { x: rand(0.1, 0.9) * w, y: rand(0.0, 0.5) * h },
          { x: ex, y: ey },
        ],
        width:      rand(0.4, 1.2),
        opacity:    rand(0.06, 0.16),   // subtler than hero
        driftAmp:   rand(12, 40),
        driftFreq:  rand(0.00015, 0.00032),
        driftPhase: rand(0, Math.PI * 2),
      };
    });

    const drawStrand = (s: Strand, t: number) => {
      const drift  = s.driftAmp * Math.sin(t * s.driftFreq + s.driftPhase);
      const driftY = s.driftAmp * Math.cos(t * s.driftFreq * 0.7 + s.driftPhase + 1.3);
      const pts = s.pts.map((p, i) => {
        const f = i === 0 || i === s.pts.length - 1 ? 0.12 : 1.0;
        return { x: p.x + drift * f, y: p.y + driftY * f };
      });

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(pts.length - 1, i + 2)];
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
      }
      ctx.strokeStyle = `rgba(160,190,225,${s.opacity})`;
      ctx.lineWidth   = s.width;
      ctx.stroke();
    };

    // ─── NODES — citrus only, fewer than hero ─────────────────────
    const NODE_COUNT = 18;
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, (_, i) => {
      const isLarge = i < 4;
      const size     = isLarge ? rand(3.5, 7)   : rand(0.8, 3);
      const glowMult = isLarge ? rand(9, 14)     : rand(5, 9);
      const opacity  = isLarge ? rand(0.5, 0.8)  : rand(0.2, 0.5);
      const bx = rand(0.05, 0.95) * w;
      const by = rand(0.05, 0.95) * h;
      return {
        baseX: bx, baseY: by, x: bx, y: by,
        size, glowMult, opacity,
        pulseFreq:  rand(0.0004, 0.0012),
        pulsePhase: rand(0, Math.PI * 2),
        driftAmp:   isLarge ? rand(3, 7) : rand(8, 18),
        driftFreq:  rand(0.00010, 0.00020),
        driftPhase: rand(0, Math.PI * 2),
      };
    });

    const drawNode = (n: Node, t: number) => {
      const pulse = 1 + 0.20 * Math.sin(t * n.pulseFreq + n.pulsePhase);
      n.x = n.baseX + n.driftAmp * Math.sin(t * n.driftFreq + n.driftPhase);
      n.y = n.baseY + n.driftAmp * Math.cos(t * n.driftFreq * 0.9 + n.driftPhase + 0.7);

      const coreR = n.size * pulse;
      const glowR = coreR * n.glowMult;
      const op    = Math.min(1, n.opacity * pulse);

      const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
      grd.addColorStop(0,    `rgba(217,119,87,${Math.min(1, op * 0.55)})`);
      grd.addColorStop(0.2,  `rgba(217,119,87,${Math.min(1, op * 0.20)})`);
      grd.addColorStop(0.55, `rgba(217,119,87,${Math.min(1, op * 0.05)})`);
      grd.addColorStop(1,    `rgba(217,119,87,0)`);
      ctx.beginPath();
      ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      const core = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, coreR);
      core.addColorStop(0,   `rgba(255,220,180,${op})`);
      core.addColorStop(0.4, `rgba(217,119,87,${op})`);
      core.addColorStop(1,   `rgba(200,90,60,0)`);
      ctx.beginPath();
      ctx.arc(n.x, n.y, coreR, 0, Math.PI * 2);
      ctx.fillStyle = core;
      ctx.fill();
    };

    const draw = () => {
      const t = Date.now();
      ctx.clearRect(0, 0, w, h);
      strands.forEach(s => drawStrand(s, t));
      nodes.forEach(n => drawNode(n, t));
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
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
