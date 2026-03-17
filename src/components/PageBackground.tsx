'use client';

/**
 * PageBackground — sits fixed behind all inner pages.
 * Provides: slow drifting citrus radial glows + subtle dot grid.
 * Not used on homepage (OrbitalCanvas handles that).
 */
export default function PageBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      {/* Drifting top-left citrus bloom */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '65vw',
          height: '65vw',
          maxWidth: 900,
          maxHeight: 900,
          background: 'radial-gradient(ellipse, rgba(217,119,87,0.09) 0%, transparent 65%)',
          animation: 'bgDriftA 22s ease-in-out infinite',
          filter: 'blur(2px)',
        }}
      />
      {/* Drifting bottom-right citrus bloom */}
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-5%',
          width: '55vw',
          height: '55vw',
          maxWidth: 800,
          maxHeight: 800,
          background: 'radial-gradient(ellipse, rgba(217,119,87,0.07) 0%, transparent 65%)',
          animation: 'bgDriftB 28s ease-in-out infinite',
          filter: 'blur(2px)',
        }}
      />
      {/* Mid-page signal green accent — subtle */}
      <div
        style={{
          position: 'absolute',
          top: '45%',
          right: '15%',
          width: '30vw',
          height: '30vw',
          maxWidth: 400,
          maxHeight: 400,
          background: 'radial-gradient(ellipse, rgba(34,197,94,0.04) 0%, transparent 70%)',
          animation: 'bgDriftC 35s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes bgDriftA {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(6vw, 8vh) scale(1.08); }
          66%  { transform: translate(-3vw, 12vh) scale(0.96); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes bgDriftB {
          0%   { transform: translate(0, 0) scale(1); }
          40%  { transform: translate(-8vw, -6vh) scale(1.06); }
          70%  { transform: translate(4vw, -10vh) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes bgDriftC {
          0%   { transform: translate(0, 0); }
          50%  { transform: translate(-5vw, 8vh); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
}
