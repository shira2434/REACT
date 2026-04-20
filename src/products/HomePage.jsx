import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'סלטים',           img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', desc: 'סלטים טריים ומרעננים' },
  { name: 'פיצות',           img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', desc: 'פיצות איטלקיות אותנטיות' },
  { name: 'כריכים ולחמים',   img: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&q=80', desc: 'כריכים ביתיים ולחמים טריים' },
  { name: 'פסטות',           img: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80', desc: 'פסטות איטלקיות קלאסיות' },
  { name: 'מנות גבינות',     img: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80', desc: 'גבינות מובחרות ומנות חלביות' },
  { name: "בוקר ובראנץ'",    img: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80', desc: 'ארוחות בוקר עשירות' },
  { name: 'קינוחים',         img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80', desc: 'קינוחים מפנקים ומתוקים' },
  { name: 'שתייה',           img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80', desc: 'משקאות קרים וחמים' },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#fdf6f0' }}>

      {/* Hero */}
      <div style={{
        position: 'relative',
        padding: '80px 24px 60px',
        textAlign: 'center',
        overflow: 'hidden',
        minHeight: '420px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* סרטון רקע */}
        <iframe
          src="https://www.youtube-nocookie.com/embed/Lcyeu2hUOeY?autoplay=1&mute=1&loop=1&playlist=Lcyeu2hUOeY&controls=0&rel=0&modestbranding=1&playsinline=1"
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%) scale(1.5)',
            width: '100%', height: '100%',
            border: 'none', zIndex: 0,
            pointerEvents: 'none',
          }}
          allow="autoplay; encrypted-media"
        />
        {/* שכבת כהות */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(59,26,8,0.4) 0%, rgba(139,58,26,0.3) 100%)',
          zIndex: 1,
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>☕</div>
          <h1 style={{ fontSize: '52px', fontWeight: '800', color: 'white', margin: '0 0 12px', letterSpacing: '-1px', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
            לה קוצ'ינה
          </h1>
          <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.85)', margin: '0 0 8px', fontWeight: '300' }}>
            קייטרינג חלבי איטלקי • מנות טריות מדי יום
          </p>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', margin: '0 0 36px' }}>
            ✨ בחר קטגוריה וגלה את התפריט שלנו
          </p>
          <button
            onClick={() => navigate('/catalog')}
            style={{
              background: 'rgba(255,255,255,0.15)', color: 'white',
              border: '2px solid rgba(255,255,255,0.4)', padding: '12px 32px',
              borderRadius: '50px', fontSize: '15px', fontWeight: '600',
              cursor: 'pointer', backdropFilter: 'blur(10px)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
          >
            צפה בכל התפריט →
          </button>
        </div>
      </div>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#3b1a08', margin: '0 0 10px' }}>
            מה תרצה היום?
          </h2>
          <p style={{ fontSize: '16px', color: '#9ca3af', margin: 0 }}>בחר קטגוריה לצפייה במנות</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px',
        }}>
          {categories.map(cat => (
            <div
              key={cat.name}
              onClick={() => navigate('/catalog', { state: { category: cat.name } })}
              style={{
                background: 'white',
                border: '2px solid #f0e0cc',
                borderRadius: '20px',
                padding: '16px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(200,98,42,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <img src={cat.img} alt={cat.name} style={{
                width: '100%', height: '150px', objectFit: 'cover',
                borderRadius: '12px', marginBottom: '14px', display: 'block'
              }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', margin: '0 0 6px' }}>
                {cat.name}
              </h3>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
