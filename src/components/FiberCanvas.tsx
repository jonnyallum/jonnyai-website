'use client';

/**
 * FiberCanvas — deep_network aesthetic.
 * Glowing 3D amber sphere nodes connected by thin teal network lines.
 * One dominant central hub node, secondary hubs, mid and small nodes.
 * Nodes drift gently; connection lines follow in real-time.
 */
import { useEffect, useRef } from 'react';

interface Node {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  size: number;
  glowMult: number;
  opacity: number;
  pulseFreq: number;
  pulsePhase: number;
  driftAmp: number;
  driftFreq: number;
  driftPhase: number;
  connections: number[]; // indices of connected nodes
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

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else draw();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    // ─── NODE GENERATION ─────────────────────────────────────────────────────
    const makeNodes = (): Node[] => {
      const nodes: Node[] = [];

      // Gaussian-ish placement toward center
      const cx = w * 0.5;
      const cy = h * 0.5;

      const place = (spread: number): { x: number; y: number } => {
        // Box-Muller for gaussian distribution
        const u = 1 - Math.random();
        const v = Math.random();
        const g = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
        const g2 = Math.sqrt(-2 * Math.log(u)) * Math.sin(2 * Math.PI * v);
        return {
          x: Math.max(0.03 * w, Math.min(0.97 * w, cx + g  * spread)),
          y: Math.max(0.05 * h, Math.min(0.95 * h, cy + g2 * spread * 0.8)),
        };
      };

      // 1. Central hero node — dominant, large, slow drift
      nodes.push({
        baseX: cx, baseY: cy, x: cx, y: cy,
        size: rand(32, 42),
        glowMult: rand(12, 16),
        opacity: 1.0,
        pulseFreq: rand(0.0005, 0.0009),
        pulsePhase: rand(0, Math.PI * 2),
        driftAmp: rand(12, 22),
        driftFreq: rand(0.00020, 0.00032),
        driftPhase: rand(0, Math.PI * 2),
        connections: [],
      });

      // 2. Secondary hub nodes (6)
      for (let i = 0; i < 6; i++) {
        const p = place(Math.min(w, h) * 0.22);
        nodes.push({
          baseX: p.x, baseY: p.y, x: p.x, y: p.y,
          size: rand(18, 28),
          glowMult: rand(10, 14),
          opacity: rand(0.85, 1.0),
          pulseFreq: rand(0.0006, 0.0013),
          pulsePhase: rand(0, Math.PI * 2),
          driftAmp: rand(18, 35),
          driftFreq: rand(0.00022, 0.00038),
          driftPhase: rand(0, Math.PI * 2),
          connections: [],
        });
      }

      // 3. Mid nodes (22)
      for (let i = 0; i < 22; i++) {
        const p = place(Math.min(w, h) * 0.42);
        nodes.push({
          baseX: p.x, baseY: p.y, x: p.x, y: p.y,
          size: rand(9, 18),
          glowMult: rand(8, 12),
          opacity: rand(0.60, 0.90),
          pulseFreq: rand(0.0007, 0.0016),
          pulsePhase: rand(0, Math.PI * 2),
          driftAmp: rand(25, 50),
          driftFreq: rand(0.00025, 0.00042),
          driftPhase: rand(0, Math.PI * 2),
          connections: [],
        });
      }

      // 4. Small scatter nodes (18)
      for (let i = 0; i < 18; i++) {
        const p = place(Math.min(w, h) * 0.58);
        nodes.push({
          baseX: p.x, baseY: p.y, x: p.x, y: p.y,
          size: rand(4, 9),
          glowMult: rand(6, 10),
          opacity: rand(0.45, 0.75),
          pulseFreq: rand(0.0009, 0.0020),
          pulsePhase: rand(0, Math.PI * 2),
          driftAmp: rand(35, 65),
          driftFreq: rand(0.00030, 0.00050),
          driftPhase: rand(0, Math.PI * 2),
          connections: [],
        });
      }

      return nodes;
    };

    // ─── CONNECTION GENERATION ────────────────────────────────────────────────
    const buildConnections = (nodes: Node[]) => {
      // Reset
      nodes.forEach(n => { n.connections = []; });

      const distThreshold = Math.min(w, h) * 0.28;
      const MAX_CONN = [8, 5, 5, 5, 5, 5, 5, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];

      const edges = new Set<string>();

      for (let i = 0; i < nodes.length; i++) {
        const maxC = MAX_CONN[i] ?? 2;
        if (nodes[i].connections.length >= maxC) continue;

        // Sort other nodes by distance
        const others = nodes
          .map((n, j) => ({
            j,
            d: Math.hypot(n.baseX - nodes[i].baseX, n.baseY - nodes[i].baseY),
          }))
          .filter(o => o.j !== i && o.d < distThreshold)
          .sort((a, b) => a.d - b.d);

        for (const { j } of others) {
          if (nodes[i].connections.length >= maxC) break;
          if (nodes[j].connections.length >= (MAX_CONN[j] ?? 2)) continue;
          const key = [Math.min(i, j), Math.max(i, j)].join('-');
          if (edges.has(key)) continue;
          edges.add(key);
          nodes[i].connections.push(j);
          nodes[j].connections.push(i);
        }
      }
    };

    let nodes = makeNodes();
    buildConnections(nodes);

    const handleResize = () => {
      resize();
      nodes = makeNodes();
      buildConnections(nodes);
    };
    window.addEventListener('resize', handleResize);

    // ─── AMBIENT CENTRE GLOW ──────────────────────────────────────────────────
    const drawBaseGlow = () => {
      const grd = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.40);
      grd.addColorStop(0,   'rgba(200,90,30,0.07)');
      grd.addColorStop(0.5, 'rgba(180,70,20,0.03)');
      grd.addColorStop(1,   'rgba(180,70,20,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
    };

    // ─── DRAW CONNECTIONS ─────────────────────────────────────────────────────
    const drawConnections = (t: number) => {
      const seen = new Set<string>();

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (const j of a.connections) {
          const key = [Math.min(i, j), Math.max(i, j)].join('-');
          if (seen.has(key)) continue;
          seen.add(key);

          const b = nodes[j];

          // Slow pulse on line opacity
          const pulse = 0.6 + 0.4 * Math.sin(t * 0.0004 + i * 0.7);

          const grd = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grd.addColorStop(0,    `rgba(180,235,255,${0.80 * pulse})`);
          grd.addColorStop(0.15, `rgba(150,215,245,${0.38 * pulse})`);
          grd.addColorStop(0.5,  `rgba(120,190,230,${0.16 * pulse})`);
          grd.addColorStop(0.85, `rgba(150,215,245,${0.38 * pulse})`);
          grd.addColorStop(1,    `rgba(180,235,255,${0.80 * pulse})`);

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = grd;
          ctx.lineWidth = rand(0.8, 1.4);
          ctx.stroke();

          // Bright endpoint dots
          const dotR = 2.0;
          [a, b].forEach(n => {
            ctx.beginPath();
            ctx.arc(n.x, n.y, dotR, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200,245,255,${0.75 * pulse})`;
            ctx.fill();
          });
        }
      }
    };

    // ─── DRAW NODE (3D SPHERE) ────────────────────────────────────────────────
    const drawNode = (n: Node, t: number) => {
      const pulse = 1 + 0.18 * Math.sin(t * n.pulseFreq + n.pulsePhase);
      n.x = n.baseX + n.driftAmp * Math.sin(t * n.driftFreq + n.driftPhase);
      n.y = n.baseY + n.driftAmp * Math.cos(t * n.driftFreq * 0.9 + n.driftPhase + 0.7);

      const coreR = n.size * pulse;
      const glowR = coreR * n.glowMult;
      const op    = Math.min(1, n.opacity * pulse);

      // Outer diffuse glow (-20%)
      const outerGlow = ctx.createRadialGradient(n.x, n.y, coreR * 0.4, n.x, n.y, glowR);
      outerGlow.addColorStop(0,   `rgba(220,115,40,${Math.min(1, op * 0.40)})`);
      outerGlow.addColorStop(0.3, `rgba(200,90,25,${Math.min(1, op * 0.13)})`);
      outerGlow.addColorStop(0.7, `rgba(180,70,15,${Math.min(1, op * 0.04)})`);
      outerGlow.addColorStop(1,   'rgba(180,70,15,0)');
      ctx.beginPath();
      ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      // 3D sphere body — off-centre gradient = top-left light source
      const hx = n.x - coreR * 0.30;
      const hy = n.y - coreR * 0.30;
      const sphere = ctx.createRadialGradient(hx, hy, 0, n.x, n.y, coreR);
      sphere.addColorStop(0,    `rgba(255,240,200,${Math.min(1, op * 0.80)})`);  // bright specular centre
      sphere.addColorStop(0.15, `rgba(255,200,110,${Math.min(1, op * 0.80)})`);  // warm highlight
      sphere.addColorStop(0.40, `rgba(230,120,40,${Math.min(1, op * 0.78)})`);   // citrus mid
      sphere.addColorStop(0.70, `rgba(170,60,15,${Math.min(1, op * 0.72)})`);    // deep amber
      sphere.addColorStop(1,    `rgba(90,20,5,${Math.min(1, op * 0.56)})`);      // dark edge
      ctx.beginPath();
      ctx.arc(n.x, n.y, coreR, 0, Math.PI * 2);
      ctx.fillStyle = sphere;
      ctx.fill();

      // Specular glint (top-left)
      if (coreR > 3) {
        const specR = coreR * 0.26;
        const spec  = ctx.createRadialGradient(hx, hy, 0, hx, hy, specR);
        spec.addColorStop(0,   `rgba(255,255,245,${Math.min(1, op * 0.80)})`);
        spec.addColorStop(0.5, `rgba(255,255,245,${Math.min(1, op * 0.22)})`);
        spec.addColorStop(1,   'rgba(255,255,245,0)');
        ctx.beginPath();
        ctx.arc(hx, hy, specR, 0, Math.PI * 2);
        ctx.fillStyle = spec;
        ctx.fill();
      }
    };

    // ─── DRAW LOOP ─────────────────────────────────────────────────────────────
    const draw = () => {
      const t = Date.now();
      ctx.clearRect(0, 0, w, h);
      drawBaseGlow();
      drawConnections(t);
      nodes.forEach(n => drawNode(n, t));
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
