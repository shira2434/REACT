import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'פיצות',              img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80', desc: 'פיצות איטלקיות אותנטיות', emoji: '🍕', featured: true },
  { name: 'פסטות',              img: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80', desc: 'פסטות איטלקיות קלאסיות', emoji: '🍝', featured: true },
  { name: 'סושי',               img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80', desc: 'סושי טרי ומגוון', emoji: '🍣', featured: true },
  { name: 'דגים',               img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80', desc: 'דגים טריים ומנות ים', emoji: '🐟' },
  { name: 'מנות גבינות',        img: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&q=80', desc: 'גבינות מובחרות ומנות חלביות', emoji: '🧀' },
  { name: "בוקר ובראנץ'",       img: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80', desc: 'ארוחות בוקר עשירות', emoji: '🥞' },
  { name: 'סלטים',              img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80', desc: 'סלטים טריים ומרעננים', emoji: '🥗' },
  { name: 'מרקים',              img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80', desc: 'מרקים חמים וטעימים', emoji: '🍲' },
  { name: 'כריכים ולחמים',      img: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&q=80', desc: 'כריכים ביתיים ולחמים טריים', emoji: '🥙' },
  { name: 'קינוחים',            img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80', desc: 'קינוחים מפנקים ומתוקים', emoji: '🍰' },
  { name: 'בר יין וקוקטיילים',  img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80', desc: 'יינות מובחרים וקוקטיילים', emoji: '🍷' },
  { name: 'שתייה',              img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80', desc: 'משקאות קרים וחמים', emoji: '☕' },
];

const HomePage = () => {
  const navigate = useNavigate();

  const featured = categories.filter(c => c.featured);
  const rest = categories.filter(c => !c.featured);

  const goTo = (name) => navigate(`/catalog?category=${encodeURIComponent(name)}`);

  return (
    <div style={{ minHeight: '100vh', background: '#fdf6f0' }}>

      {/* Hero */}
      <div style={{
        position: 'relative', padding: '80px 24px 60px', textAlign: 'center',
        overflow: 'hidden', minHeight: '460px', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <iframe
          src="https://www.youtube-nocookie.com/embed/Lcyeu2hUOeY?autoplay=1&mute=1&loop=1&playlist=Lcyeu2hUOeY&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%) scale(1.5)',
            width: '100%', height: '100%', border: 'none', zIndex: 0, pointerEvents: 'none',
          }}
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(59,26,8,0.55) 0%, rgba(139,58,26,0.4) 100%)',
          zIndex: 1,
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-emoji" style={{ fontSize: '64px', marginBottom: '16px' }}>☕</div>
          <h1 style={{ fontSize: '56px', fontWeight: '800', color: 'white', margin: '0 0 12px', letterSpacing: '-1px', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
            לה קוצ'ינה
          </h1>
          <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.9)', margin: '0 0 8px', fontWeight: '300' }}>
            קייטרינג חלבי איטלקי • מנות טריות מדי יום
          </p>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.65)', margin: '0 0 36px' }}>
            ✨ בחר קטגוריה וגלה את התפריט שלנו
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/catalog')} style={{
              background: 'linear-gradient(135deg, #e8a87c, #c8622a)', color: 'white',
              border: 'none', padding: '14px 36px', borderRadius: '50px',
              fontSize: '16px', fontWeight: '700', cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(200,98,42,0.5)', transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              צפה בכל התפריט →
            </button>
            <button onClick={() => document.getElementById('categories').scrollIntoView({ behavior: 'smooth' })} style={{
              background: 'rgba(255,255,255,0.15)', color: 'white',
              border: '2px solid rgba(255,255,255,0.4)', padding: '14px 36px',
              borderRadius: '50px', fontSize: '16px', fontWeight: '600',
              cursor: 'pointer', backdropFilter: 'blur(10px)', transition: 'all 0.2s',
            }}>
              גלה קטגוריות ↓
            </button>
          </div>
        </div>
      </div>

      {/* קטגוריות */}
      <div id="categories" style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>

        {/* כותרת */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#3b1a08', margin: '0 0 10px' }}>
            מה תרצה היום?
          </h2>
          <p style={{ fontSize: '16px', color: '#9ca3af', margin: 0 }}>בחר קטגוריה לצפייה במנות</p>
          <div style={{ width: '60px', height: '4px', background: 'linear-gradient(135deg, #e8a87c, #c8622a)', borderRadius: '2px', margin: '16px auto 0' }} />
        </div>

        {/* קטגוריות מובחרות - גדולות */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '13px', fontWeight: '700', color: '#c8622a', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>⭐ הכי פופולרי</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {featured.map(cat => (
              <div key={cat.name} className="category-card" onClick={() => goTo(cat.name)}
                style={{
                  position: 'relative', borderRadius: '24px', overflow: 'hidden',
                  height: '240px', cursor: 'pointer',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  transition: 'transform 0.25s, box-shadow 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)'; }}
              >
                <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
                }} />
                <div style={{ position: 'absolute', bottom: '20px', right: '20px', left: '20px' }}>
                  <div style={{ fontSize: '28px', marginBottom: '4px' }}>{cat.emoji}</div>
                  <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'white', margin: '0 0 4px', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{cat.name}</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>{cat.desc}</p>
                </div>
                <div style={{
                  position: 'absolute', top: '16px', left: '16px',
                  background: 'linear-gradient(135deg, #e8a87c, #c8622a)',
                  color: 'white', padding: '4px 12px', borderRadius: '50px',
                  fontSize: '11px', fontWeight: '700',
                }}>פופולרי 🔥</div>
              </div>
            ))}
          </div>
        </div>

        {/* שאר הקטגוריות - קטנות */}
        <div style={{ marginTop: '32px' }}>
          <p style={{ fontSize: '13px', fontWeight: '700', color: '#9ca3af', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>כל הקטגוריות</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {rest.map(cat => (
              <div key={cat.name} className="category-card" onClick={() => goTo(cat.name)}
                style={{
                  position: 'relative', borderRadius: '20px', overflow: 'hidden',
                  height: '160px', cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  transition: 'transform 0.25s, box-shadow 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(200,98,42,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; }}
              >
                <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                }} />
                <div style={{ position: 'absolute', bottom: '14px', right: '14px', left: '14px' }}>
                  <div style={{ fontSize: '20px', marginBottom: '2px' }}>{cat.emoji}</div>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'white', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{cat.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
