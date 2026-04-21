import { useEffect, useState } from 'react';

const Confetti = ({ active }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) return;
    const colors = ['#c8622a', '#e8a87c', '#fbbf24', '#34d399', '#60a5fa', '#f472b6'];
    setParticles(Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      delay: Math.random() * 0.5,
      duration: Math.random() * 2 + 2,
      rotation: Math.random() * 360,
    })));
    const t = setTimeout(() => setParticles([]), 4000);
    return () => clearTimeout(t);
  }, [active]);

  if (!particles.length) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', top: '-20px', left: `${p.x}%`,
          width: p.size, height: p.size, background: p.color,
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
          transform: `rotate(${p.rotation}deg)`,
        }} />
      ))}
      <style>{`
        @keyframes confettiFall {
          0%   { top: -20px; opacity: 1; transform: rotate(0deg) translateX(0); }
          100% { top: 110vh; opacity: 0; transform: rotate(720deg) translateX(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 100}px); }
        }
      `}</style>
    </div>
  );
};

export default Confetti;
