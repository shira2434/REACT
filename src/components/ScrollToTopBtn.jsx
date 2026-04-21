import { useEffect, useState } from 'react';

const ScrollToTopBtn = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed', bottom: '100px', right: '28px', zIndex: 1000,
        width: '48px', height: '48px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #e8a87c, #c8622a)',
        border: 'none', cursor: 'pointer', fontSize: '20px',
        boxShadow: '0 4px 16px rgba(200,98,42,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.2s',
        animation: 'fadeIn 0.3s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      ↑
    </button>
  );
};

export default ScrollToTopBtn;
