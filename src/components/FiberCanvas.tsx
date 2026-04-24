'use client';

/**
 * FiberCanvas — rim-weighted neural lattice.
 * Nodes sit in the outer ring; the centre is cleared by a radial mask so
 * content reads cleanly. Brighter, tighter glows than before, slower drift.
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
  connections: number[];
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
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else draw();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    // ─── RIM-WEIGHTED PLACEMENT ──────────────────────────────────────────────
    // Nodes live on an annulus: inner radius ~40% of min(w,h), outer ~75%.
    // The middle third of the screen stays mostly empty.
    const placeRim = (): { x: number; y: number } => {
      const cx = w * 0.5;
      const cy = h * 0.5;
      const minDim = Math.min(w, h);
      const rInner = minDim * 0.42;
      const rOuter = Math.max(w, h) * 0.72;
      const r = rInner + Math.pow(Math.random(), 0.6) * (rOuter - rInner);
      const a = Math.random() * Math.PI * 2;
      return {
        x: Math.max(-40, Math.min(w + 40, cx + Math.cos(a) * r)),
        y: Math.max(-40, Math.min(h + 40, cy + Math.sin(a) * r * 0.75)),
      };
    };

    const makeNodes = (): Node[] => {
      const nodes: Node[] = [];

      // A handful of anchor hubs around the rim
      for (let i = 0; i < 5; i++) {
        const p = placeRim();
        nodes.push({
          baseX: p.x, baseY: p.y, x: p.x, y: p.y,
          size: rand(10, 16),
          glowMult: rand(8, 11),
          opacity: rand(0.9, 1.0),
          pulseFreq: rand(0.0005, 0.0009),
          pulsePhase: rand(0, Math.PI * 2),
          driftAmp: rand(8, 16),
          driftFreq: rand(0.00012, 0.00022),
          driftPhase: rand(0, Math.PI * 2),
          connections: [],
        });
      }

      // Mid rim nodes
      for (let i = 0; i < 14; i++) {
        const p = placeRim();
        nodes.push({
          baseX: p.x, baseY: p.y, x: p.x, y: p.y,
          size: rand(5, 10),
          glowMult: rand(7, 10),
          opacity: rand(0.7, 0.95),
          pulseFreq: rand(0.0007, 0.0014),
          pulsePhase: rand(0, Math.PI * 2),
          driftAmp: rand(14, 26),
          driftFreq: rand(0.00016, 0.00028),
          driftPhase: rand(0, Math.PI * 2),
          connections: [],
        });
      }

      // Small scatter
      for (let i = 0; i < 16; i++) {
        const p = placeRim();
        nodes.push({
          baseX: p.x, baseY: p.y, x: p.x, y: p.y,
          size: rand(2.5, 5),
          glowMult: rand(6, 9),
          opacity: rand(0.5, 0.8),
          pulseFreq: rand(0.0009, 0.0018),
          pulsePhase: rand(0, Math.PI * 2),
          driftAmp: rand(22, 38),
          driftFreq: rand(0.00020, 0.00034),
          driftPhase: rand(0, Math.PI * 2),
          connections: [],
        });
      }

      return nodes;
    };

    const buildConnections = (nodes: Node[]) => {
      nodes.forEach(n => { n.connections = []; });
      const distThreshold = Math.min(w, h) * 0.32;
      const edges = new Set<string>();
      for (let i = 0; i < nodes.length; i++) {
        const maxC = i < 5 ? 4 : 2;
        if (nodes[i].connections.length >= maxC) continue;
        const others = nodes
          .map((n, j) => ({
            j,
            d: Math.hypot(n.baseX - nodes[i].baseX, n.baseY - nodes[i].baseY),
          }))
          .filter(o => o.j !== i && o.d < distThreshold)
          .sort((a, b) => a.d - b.d);
        for (const { j } of others) {
          if (nodes[i].connections.length >= maxC) break;
          const maxJ = j < 5 ? 4 : 2;
          if (nodes[j].connections.length >= maxJ) continue;
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

    // Radial mask — transparent at centre, opaque at edges.
    // Applied via destination-in at end of frame so the whole scene is faded out
    // over the content area.
    const applyCenterFade = () => {
      ctx.globalCompositeOperation = 'destination-in';
      const grd = ctx.createRadialGradient(
        w * 0.5, h * 0.5, Math.min(w, h) * 0.10,
        w * 0.5, h * 0.5, Math.max(w, h) * 0.70,
      );
      grd.addColorStop(0, 'rgba(0,0,0,0)');
      grd.addColorStop(0.35, 'rgba(0,0,0,0.35)');
      grd.addColorStop(1, 'rgba(0,0,0,1)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
    };

    const drawConnections = (t: number) => {
      const seen = new Set<string>();
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (const j of a.connections) {
          const key = [Math.min(i, j), Math.max(i, j)].join('-');
          if (seen.has(key)) continue;
          seen.add(key);
          const b = nodes[j];
          const pulse = 0.55 + 0.45 * Math.sin(t * 0.0004 + i * 0.7);

          const grd = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grd.addColorStop(0,    `rgba(255,210,170,${0.55 * pulse})`);
          grd.addColorStop(0.5,  `rgba(180,120,80,${0.10 * pulse})`);
          grd.addColorStop(1,    `rgba(255,210,170,${0.55 * pulse})`);

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = grd;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    };

    const drawNode = (n: Node, t: number) => {
      const pulse = 1 + 0.22 * Math.sin(t * n.pulseFreq + n.pulsePhase);
      n.x = n.baseX + n.driftAmp * Math.sin(t * n.driftFreq + n.driftPhase);
      n.y = n.baseY + n.driftAmp * Math.cos(t * n.driftFreq * 0.9 + n.driftPhase + 0.7);

      const coreR = n.size * pulse;
      const glowR = coreR * n.glowMult;
      const op    = Math.min(1, n.opacity * pulse);

      // Tighter, brighter outer glow
      const outerGlow = ctx.createRadialGradient(n.x, n.y, coreR * 0.3, n.x, n.y, glowR);
      outerGlow.addColorStop(0,    `rgba(240,140,60,${Math.min(1, op * 0.55)})`);
      outerGlow.addColorStop(0.25, `rgba(220,110,45,${Math.min(1, op * 0.18)})`);
      outerGlow.addColorStop(0.6,  `rgba(190,80,25,${Math.min(1, op * 0.04)})`);
      outerGlow.addColorStop(1,    'rgba(180,70,15,0)');
      ctx.beginPath();
      ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      // Sphere body — hot core, clean falloff
      const hx = n.x - coreR * 0.30;
      const hy = n.y - coreR * 0.30;
      const sphere = ctx.createRadialGradient(hx, hy, 0, n.x, n.y, coreR);
      sphere.addColorStop(0,    `rgba(255,248,220,${Math.min(1, op * 0.95)})`);
      sphere.addColorStop(0.20, `rgba(255,210,130,${Math.min(1, op * 0.90)})`);
      sphere.addColorStop(0.55, `rgba(235,125,55,${Math.min(1, op * 0.80)})`);
      sphere.addColorStop(1,    `rgba(110,35,10,${Math.min(1, op * 0.55)})`);
      ctx.beginPath();
      ctx.arc(n.x, n.y, coreR, 0, Math.PI * 2);
      ctx.fillStyle = sphere;
      ctx.fill();

      if (coreR > 2.5) {
        const specR = coreR * 0.28;
        const spec = ctx.createRadialGradient(hx, hy, 0, hx, hy, specR);
        spec.addColorStop(0,   `rgba(255,255,245,${Math.min(1, op * 0.85)})`);
        spec.addColorStop(0.6, `rgba(255,255,245,${Math.min(1, op * 0.18)})`);
        spec.addColorStop(1,   'rgba(255,255,245,0)');
        ctx.beginPath();
        ctx.arc(hx, hy, specR, 0, Math.PI * 2);
        ctx.fillStyle = spec;
        ctx.fill();
      }
    };

    const draw = () => {
      const t = Date.now();
      ctx.clearRect(0, 0, w, h);
      drawConnections(t);
      nodes.forEach(n => drawNode(n, t));
      applyCenterFade();
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
