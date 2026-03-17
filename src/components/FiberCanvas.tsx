'use client';

import { useEffect, useRef } from 'react';

interface Strand {
  // anchor points along the strand (spline)
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
  size: number;       // core radius px
  glowMult: number;   // glow = size * glowMult
  opacity: number;
  pulseFreq: number;
  pulsePhase: number;
  driftAmp: number;
  driftFreq: number;
  driftPhase: number;
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

    // ─── STRANDS ──────────────────────────────────────────────────
    // Each strand is a catmull-rom spline with 5 control points.
    // They sweep dramatically across the canvas — thicker, more visible,
    // mimicking the fiber-optic look from the reference image.
    const STRAND_COUNT = 55;
    const strands: Strand[] = Array.from({ length: STRAND_COUNT }, () => {
      // Pick a start edge (bottom-heavy so strands sweep upward)
      const fromBottom = Math.random() < 0.55;
      let sx: number, sy: number;
      if (fromBottom) {
        sx = rand(-0.1, 1.1) * w;
        sy = rand(0.7, 1.2) * h;
      } else {
        // left or right edge
        const side = Math.random() < 0.5 ? -0.05 : 1.05;
        sx = side * w;
        sy = rand(-0.1, 1.1) * h;
      }

      // End somewhere on the opposite side
      const ex = rand(0.0, 1.0) * w;
      const ey = rand(-0.15, 0.5) * h; // bias toward top

      // 3 intermediate control points — create organic curve
      const pts = [
        { x: sx, y: sy },
        { x: rand(0.0, 1.0) * w, y: rand(0.2, 0.9) * h },
        { x: rand(0.1, 0.9) * w, y: rand(0.1, 0.7) * h },
        { x: rand(0.1, 0.9) * w, y: rand(0.0, 0.5) * h },
        { x: ex, y: ey },
      ];

      return {
        pts,
        width:      rand(0.5, 1.8),
        opacity:    rand(0.10, 0.28),
        driftAmp:   rand(15, 55),
        driftFreq:  rand(0.00018, 0.00038),
        driftPhase: rand(0, Math.PI * 2),
      };
    });

    // Draw a Catmull-Rom spline through the pts with a drift offset
    const drawStrand = (s: Strand, t: number) => {
      const drift = s.driftAmp * Math.sin(t * s.driftFreq + s.driftPhase);
      const driftY = s.driftAmp * Math.cos(t * s.driftFreq * 0.7 + s.driftPhase + 1.3);

      const pts = s.pts.map((p, i) => {
        // first and last points are anchored to edges — don't drift them
        const factor = i === 0 || i === s.pts.length - 1 ? 0.15 : 1.0;
        return { x: p.x + drift * factor, y: p.y + driftY * factor };
      });

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);

      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(pts.length - 1, i + 2)];

        // Catmull-Rom → Bezier conversion
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
      }

      // Cool blue-grey tone matching the reference
      ctx.strokeStyle = `rgba(160,190,225,${s.opacity})`;
      ctx.lineWidth   = s.width;
      ctx.stroke();
    };

    // ─── NODES ────────────────────────────────────────────────────
    // Larger, brighter citrus orange orbs — the visual stars of the canvas
    const NODE_COUNT = 32;
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, (_, i) => {
      const tier = i < 6 ? 'hero' : i < 16 ? 'mid' : 'small';
      const size     = tier === 'hero'  ? rand(5, 10)
                     : tier === 'mid'   ? rand(2.5, 5)
                     : rand(0.8, 2.2);
      const glowMult = tier === 'hero'  ? rand(10, 16)
                     : tier === 'mid'   ? rand(7, 12)
                     : rand(5, 8);
      const opacity  = tier === 'hero'  ? rand(0.75, 1.0)
                     : tier === 'mid'   ? rand(0.5, 0.85)
                     : rand(0.3, 0.6);

      const bx = rand(0.05, 0.95) * w;
      const by = rand(0.05, 0.95) * h;
      return {
        baseX: bx, baseY: by, x: bx, y: by,
        size, glowMult, opacity,
        pulseFreq:  rand(0.0004, 0.0014),
        pulsePhase: rand(0, Math.PI * 2),
        driftAmp:   tier === 'hero' ? rand(4, 9) : rand(8, 22),
        driftFreq:  rand(0.00012, 0.00022),
        driftPhase: rand(0, Math.PI * 2),
      };
    });

    const drawNode = (n: Node, t: number) => {
      const pulse = 1 + 0.22 * Math.sin(t * n.pulseFreq + n.pulsePhase);
      n.x = n.baseX + n.driftAmp * Math.sin(t * n.driftFreq + n.driftPhase);
      n.y = n.baseY + n.driftAmp * Math.cos(t * n.driftFreq * 0.9 + n.driftPhase + 0.7);

      const coreR = n.size * pulse;
      const glowR = coreR * n.glowMult;
      const op    = Math.min(1, n.opacity * pulse);

      // Wide, soft outer glow — 3 stops for depth
      const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
      grd.addColorStop(0,    `rgba(217,119,87,${Math.min(1, op * 0.65)})`);
      grd.addColorStop(0.18, `rgba(217,119,87,${Math.min(1, op * 0.28)})`);
      grd.addColorStop(0.5,  `rgba(217,119,87,${Math.min(1, op * 0.07)})`);
      grd.addColorStop(1,    `rgba(217,119,87,0)`);
      ctx.beginPath();
      ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Bright hot core — white centre fading to citrus
      const core = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, coreR);
      core.addColorStop(0,   `rgba(255,220,180,${op})`);
      core.addColorStop(0.4, `rgba(217,119,87,${op})`);
      core.addColorStop(1,   `rgba(200,90,60,0)`);
      ctx.beginPath();
      ctx.arc(n.x, n.y, coreR, 0, Math.PI * 2);
      ctx.fillStyle = core;
      ctx.fill();
    };

    // ─── DRAW LOOP ────────────────────────────────────────────────
    const draw = () => {
      const t = Date.now();
      ctx.clearRect(0, 0, w, h);

      // Strands behind nodes
      strands.forEach(s => drawStrand(s, t));
      // Nodes on top
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
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
