'use client';

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  // 0 = citrus, 1 = white, 2 = signal-green
  type: 0 | 1 | 2;
  opacity: number;
  pulseOffset: number;
}

const COLOURS = [
  // citrus variants
  (o: number) => `rgba(217,119,87,${o})`,
  (o: number) => `rgba(235,140,100,${o})`,
  // white/silver
  (o: number) => `rgba(248,248,255,${o})`,
  // signal green
  (o: number) => `rgba(34,197,94,${o})`,
];

export default function SiteCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // 85 nodes: ~55 citrus, ~15 white, ~15 signal
    const NODE_COUNT = 85;
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, (_, i) => {
      const typeRoll = Math.random();
      const type: 0 | 1 | 2 = typeRoll < 0.62 ? 0 : typeRoll < 0.80 ? 1 : 2;
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: type === 1 ? Math.random() * 1.8 + 0.8 : Math.random() * 2.2 + 0.6,
        type,
        opacity: type === 1 ? Math.random() * 0.5 + 0.25 : Math.random() * 0.6 + 0.2,
        pulseOffset: Math.random() * Math.PI * 2,
      };
    });

    const CONNECT_DIST = 160;
    const t0 = Date.now();

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const t = (Date.now() - t0) / 1000;

      ctx.clearRect(0, 0, w, h);

      // Update positions
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;
      });

      // Draw connections first (under nodes)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.18;
            // Colour the line based on node types
            const ni = nodes[i];
            const nj = nodes[j];
            let lineColor: string;
            if (ni.type === 2 || nj.type === 2) {
              lineColor = `rgba(34,197,94,${alpha})`;
            } else if (ni.type === 1 && nj.type === 1) {
              lineColor = `rgba(248,248,255,${alpha * 0.7})`;
            } else {
              lineColor = `rgba(217,119,87,${alpha})`;
            }
            ctx.beginPath();
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 0.6;
            ctx.moveTo(ni.x, ni.y);
            ctx.lineTo(nj.x, nj.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes with glow
      nodes.forEach(n => {
        const pulse = 1 + 0.15 * Math.sin(t * 1.2 + n.pulseOffset);
        const finalOpacity = n.opacity * pulse;
        const colFn = n.type === 0
          ? COLOURS[0]
          : n.type === 1
          ? COLOURS[2]
          : COLOURS[3];

        // Glow halo for brighter/larger nodes
        if (n.size > 1.2 || n.type === 1) {
          const glowR = n.size * 5;
          const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
          grd.addColorStop(0, colFn(finalOpacity * 0.5));
          grd.addColorStop(1, colFn(0));
          ctx.beginPath();
          ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        // Node core
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size * pulse * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = colFn(finalOpacity);
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
