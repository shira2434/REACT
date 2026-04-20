import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleWishlist, addToCart, addToast } from '../store/store';

const Wishlist = () => {
  const { items } = useSelector(state => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    dispatch(addToast({ type: 'success', message: `${product.name} נוסף לסל!` }));
  };

  const handleRemove = (product) => {
    dispatch(toggleWishlist(product));
    dispatch(addToast({ type: 'info', message: `${product.name} הוסר מהמועדפים` }));
  };

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
        <div style={{ fontSize: '80px' }}>🤍</div>
        <h2 style={{ fontSize: '28px', color: '#1f2937' }}>אין מוצרים במועדפים</h2>
        <p style={{ color: '#6b7280' }}>הוסף מוצרים שאהבת כדי למצוא אותם בקלות</p>
        <button
          onClick={() => navigate('/home')}
          style={{ backgroundColor: '#0891b2', color: 'white', padding: '12px 32px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '16px' }}
        >
          עבור לחנות
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px', color: '#1f2937' }}>❤️ המועדפים שלי</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
        {items.map(product => (
          <div key={product.id} style={{
            backgroundColor: 'white', borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden'
          }}>
            <img
              src={product.image} alt={product.name}
              style={{ width: '100%', height: '180px', objectFit: 'cover', cursor: 'pointer' }}
              onClick={() => navigate(`/product/${product.id}`)}
            />
            <div style={{ padding: '16px' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '6px', color: '#1f2937' }}>{product.name}</h3>
              <p style={{ color: '#0891b2', fontWeight: 'bold', fontSize: '18px', marginBottom: '14px' }}>
                ₪{product.price.toLocaleString()}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleAddToCart(product)}
                  style={{
                    flex: 1, backgroundColor: '#0891b2', color: 'white',
                    padding: '10px', borderRadius: '8px', border: 'none',
                    cursor: 'pointer', fontSize: '14px', fontWeight: '500'
                  }}
                >
                  🛒 הוסף לסל
                </button>
                <button
                  onClick={() => handleRemove(product)}
                  style={{
                    padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid #fca5a5', backgroundColor: '#fef2f2',
                    color: '#dc2626', cursor: 'pointer', fontSize: '16px'
                  }}
                >
                  🗑
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
