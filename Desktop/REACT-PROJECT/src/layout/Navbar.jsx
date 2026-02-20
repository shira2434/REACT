import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
    window.location.reload();
  };

  if (!user) return null;

  return (
    <nav style={{
      background: 'linear-gradient(to right, #0891b2, #0c4a6e, #0891b2)',
      color: 'white',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      position: 'relative',
      width: '100%'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80px',
        position: 'relative',
        width: '100%'
      }}>
        <button
          onClick={handleLogout}
          className="logout-btn"
          style={{
            position: 'absolute',
            left: '16px'
          }}
        >
          🚪 התנתק
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px'
        }}>
          <Link 
            to="/home" 
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'white',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background 0.3s'
            }}
          >
            📱 המוצרים שלנו
          </Link>
          
          <Link to="/home" style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'white',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'color 0.3s'
          }}>
            🛍️ החנות שלנו
          </Link>
          
          <Link 
            to="/profile" 
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'white',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background 0.3s'
            }}
          >
            👤 הפרטים שלי
          </Link>

          {user.isAdmin && (
            <Link 
              to="/add-product" 
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'white',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.1)',
                transition: 'background 0.3s'
              }}
            >
              ➕ הוסף מוצר
            </Link>
          )}
        </div>

        <span style={{
          position: 'absolute',
          right: '16px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          👋 שלום, {user.firstName}
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
