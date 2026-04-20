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

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCart());
    dispatch(clearWishlist());
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  if (!user) return null;

  const linkStyle = {
    padding: '8px 14px', borderRadius: '50px', fontSize: '14px',
    fontWeight: '500', color: 'white', textDecoration: 'none',
    display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
    transition: 'background 0.2s'
  };

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #c8622a, #8b3a1a, #c8622a)',
      color: 'white',
      boxShadow: '0 4px 20px rgba(139, 58, 26, 0.4)',
      width: '100%'
    }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        height: '70px', padding: '0 20px', direction: 'ltr'
      }}>

        {/* שמאל - התנתק */}
        <button onClick={handleLogout} className="logout-btn">
          🚪 התנתק
        </button>

        {/* מרכז - ניווט */}
        <div style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: '4px'
        }}>
          <Link to="/profile" style={linkStyle}>👤 הפרטים שלי</Link>
          {!user.isAdmin && <Link to="/orders" style={linkStyle}>📦 ההזמנות שלי</Link>}
          <Link to="/home" style={linkStyle}>🏠 בית</Link>
          <Link to="/catalog" style={linkStyle}>🍽️ התפריט שלנו</Link>
          {!user.isAdmin && (
            <Link to="/build-box" style={{ ...linkStyle, fontWeight: '700' }}>
              🎁 הרכב מארז
            </Link>
          )}
          {!user.isAdmin && (
            <Link to="/cart" style={linkStyle}>
              🛒 סל קניות
              {cartCount > 0 && (
                <span style={{ backgroundColor: 'white', color: '#c8622a', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>{cartCount}</span>
              )}
            </Link>
          )}
          {user.isAdmin && (
            <Link to="/add-product" style={{ ...linkStyle, background: 'rgba(255,255,255,0.2)' }}>➕ הוסף מנה</Link>
          )}
        </div>

        {/* ימין - מועדפים + שלום משתמש */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!user.isAdmin && (
            <Link to="/wishlist" style={{ ...linkStyle, position: 'relative', padding: '6px 10px' }}>
              ❤️
              {wishlistCount > 0 && (
                <span style={{ backgroundColor: 'white', color: '#c8622a', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>{wishlistCount}</span>
              )}
            </Link>
          )}
          <span style={{ fontSize: '14px', fontWeight: '600' }}>👋 שלום, {user.firstName}</span>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
