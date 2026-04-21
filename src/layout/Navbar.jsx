import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, clearCart, clearWishlist } from '../store/store';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.currentUser);
  const cartItems = useSelector(state => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = useSelector(state => state.wishlist.items.length);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCart());
    dispatch(clearWishlist());
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
    setMenuOpen(false);
  };

  if (!user) return null;

  const linkStyle = {
    padding: '8px 14px', borderRadius: '50px', fontSize: '14px',
    fontWeight: '500', color: 'white', textDecoration: 'none',
    display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
    transition: 'background 0.2s',
  };

  const links = [
    { to: '/home', label: '🏠 בית' },
    { to: '/catalog', label: '🍽️ התפריט' },
    { to: '/profile', label: '👤 הפרטים שלי' },
    ...(!user.isAdmin ? [
      { to: '/orders', label: '📦 ההזמנות שלי' },
      { to: '/build-box', label: '🎁 הרכב מארז' },
    ] : [
      { to: '/add-product', label: '➕ הוסף מנה' },
    ]),
  ];

  return (
    <>
      <nav style={{
        background: 'linear-gradient(135deg, #c8622a, #8b3a1a, #c8622a)',
        color: 'white', boxShadow: '0 4px 20px rgba(139,58,26,0.4)',
        width: '100%', position: 'relative', zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '70px', padding: '0 20px', direction: 'ltr' }}>

          {/* שמאל - התנתק */}
          <button onClick={handleLogout} className="logout-btn">🚪 התנתק</button>

          {/* מרכז - ניווט desktop */}
          <div style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', gap: '4px',
          }} className="nav-desktop">
            {links.map(l => (
              <Link key={l.to} to={l.to} style={linkStyle}>{l.label}</Link>
            ))}
            {!user.isAdmin && (
              <Link to="/cart" style={linkStyle}>
                🛒 סל קניות
                {cartCount > 0 && (
                  <span style={{
                    backgroundColor: 'white', color: '#c8622a', borderRadius: '50%',
                    width: '18px', height: '18px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '10px', fontWeight: 'bold',
                    animation: cartCount > 0 ? 'cartBounce 0.4s ease' : 'none',
                  }}>{cartCount}</span>
                )}
              </Link>
            )}
          </div>

          {/* ימין */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {!user.isAdmin && (
              <Link to="/wishlist" style={{ ...linkStyle, position: 'relative', padding: '6px 10px' }}>
                ❤️
                {wishlistCount > 0 && (
                  <span style={{ backgroundColor: 'white', color: '#c8622a', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>{wishlistCount}</span>
                )}
              </Link>
            )}
            <span style={{ fontSize: '14px', fontWeight: '600' }} className="nav-desktop">👋 שלום, {user.firstName}</span>

            {/* המבורגר */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="nav-mobile"
              style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', padding: '4px' }}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* תפריט מובייל */}
        {menuOpen && (
          <div className="nav-mobile" style={{
            background: '#3b1a08', padding: '16px 20px',
            display: 'flex', flexDirection: 'column', gap: '8px',
            animation: 'fadeInDown 0.2s ease',
          }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '4px' }}>שלום, {user.firstName}</span>
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                style={{ ...linkStyle, justifyContent: 'flex-start', padding: '10px 14px' }}>
                {l.label}
              </Link>
            ))}
            {!user.isAdmin && (
              <Link to="/cart" onClick={() => setMenuOpen(false)} style={{ ...linkStyle, justifyContent: 'flex-start', padding: '10px 14px' }}>
                🛒 סל קניות {cartCount > 0 && `(${cartCount})`}
              </Link>
            )}
            <button onClick={handleLogout} style={{ ...linkStyle, background: 'rgba(255,255,255,0.1)', justifyContent: 'flex-start', border: 'none', cursor: 'pointer', padding: '10px 14px' }}>
              🚪 התנתק
            </button>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile { display: none !important; }
          .nav-desktop { display: flex !important; }
        }
        .logout-btn {
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3);
          color: white; padding: 8px 16px; border-radius: 50px;
          cursor: pointer; font-size: 13px; font-weight: 600;
          transition: background 0.2s;
        }
        .logout-btn:hover { background: rgba(255,255,255,0.25); }
      `}</style>
    </>
  );
};

export default Navbar;
