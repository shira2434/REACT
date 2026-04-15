import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, reviewsAPI } from '../api/api';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/store';
import AddReview from '../reviews/AddReview';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAddReview, setShowAddReview] = useState(false);
  const [added, setAdded] = useState(false);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadProductData();
  }, [id]);

  const loadProductData = async () => {
    try {
      const [productResponse, reviewsResponse] = await Promise.all([
        productsAPI.getProduct(id),
        reviewsAPI.getProductReviews(id)
      ]);
      
      setProduct(productResponse.data);
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error('Error loading product data:', error);
    }
    setLoading(false);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את חוות הדעת הזו?')) {
      try {
        await reviewsAPI.deleteReview(reviewId);
        setReviews(prev => prev.filter(r => r.id !== reviewId));
      } catch (error) {
        alert('שגיאה במחיקת חוות דעת');
      }
    }
  };

  const handleReviewAdded = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
    setProduct(prev => ({
      ...prev,
      sold: (prev.sold || 0) + 1
    }));
    setShowAddReview(false);
  };

  if (loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
        <div style={{fontSize: '20px'}}>טוען...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
        <div style={{fontSize: '20px', color: 'red'}}>מוצר לא נמצא</div>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px'}}>
      <div style={{textAlign: 'center', maxWidth: '600px'}}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          marginBottom: '15px'
        }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              maxWidth: '400px',
              height: '300px',
              objectFit: 'cover',
              borderRadius: '15px'
            }}
          />
        </div>

        <h1 style={{fontSize: '32px', fontWeight: 'bold', marginBottom: '10px', color: '#1f2937'}}>{product.name}</h1>
        
        <div style={{fontSize: '20px', color: '#0891b2', marginBottom: '15px'}}>
          דירוג: {averageRating} ★ ({reviews.length} חווות דעת)
        </div>
        
        <p style={{fontSize: '18px', color: '#64748b', marginBottom: '20px'}}>{product.description}</p>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <div style={{fontSize: '42px', fontWeight: 'bold', color: '#0891b2', marginBottom: '15px'}}>
            ₪{product.price.toLocaleString()}
          </div>
          <div style={{height: '1px', backgroundColor: '#e2e8f0', marginBottom: '15px'}}></div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <div style={{display: 'flex', alignItems: 'center', color: '#64748b', fontSize: '14px'}}>
              <span style={{marginLeft: '8px'}}>📦</span>
              קטגוריה: {product.category}
            </div>
            <div style={{display: 'flex', alignItems: 'center', color: '#64748b', fontSize: '14px'}}>
              <span style={{marginLeft: '8px'}}>📊</span>
              במלאי: {product.stock} יחידות
            </div>
            <div style={{display: 'flex', alignItems: 'center', color: '#64748b', fontSize: '14px'}}>
              <span style={{marginLeft: '8px'}}>🛒</span>
              נמכר: {product.sold || 0} יחידות
            </div>
          </div>
        </div>

        {user && !user.isAdmin && (
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '30px', flexWrap: 'wrap' }}>
            <button
              onClick={handleAddToCart}
              style={{
                backgroundColor: added ? '#16a34a' : '#0891b2',
                color: 'white',
                padding: '14px 28px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'background 0.3s'
              }}
            >
              {added ? '✓ נוסף לסל!' : '🛒 הוסף לסל'}
            </button>
            <button
              onClick={() => setShowAddReview(true)}
              style={{
                backgroundColor: 'white',
                color: '#0891b2',
                padding: '14px 28px',
                borderRadius: '12px',
                border: '2px solid #0891b2',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ✍ כתוב חוות דעת
            </button>
          </div>
        )}

        <div style={{
          backgroundColor: '#f0f9ff',
          padding: '30px 20px 20px',
          borderRadius: '15px',
          marginTop: '40px'
        }}>
          <h2 style={{
            fontSize: '28px', 
            fontWeight: 'bold', 
            marginBottom: '25px',
            textAlign: 'center',
            color: '#0c4a6e'
          }}>
            חווות דעת לקוחות
          </h2>
          
          {reviews.length === 0 ? (
            <p style={{color: '#64748b', fontSize: '18px', textAlign: 'center'}}>אין עדיין חווות דעת. היה הראשון לכתוב!</p>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              {reviews.map(review => (
                <div key={review.id} style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                    <span style={{fontSize: '18px', color: '#0891b2'}}>
                      {'★'.repeat(review.rating)}
                    </span>
                    <span style={{fontSize: '14px', color: '#64748b'}}>{review.date}</span>
                  </div>
                  <h4 style={{fontWeight: 'bold', fontSize: '16px', marginBottom: '8px', color: '#0c4a6e'}}>{review.userName}</h4>
                  <p style={{color: '#475569', lineHeight: '1.5'}}>{review.comment}</p>
                  {user && user.id === review.userId && (
                    <div style={{textAlign: 'left', marginTop: '10px'}}>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        style={{
                          color: '#dc2626',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        🗑 מחק
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {showAddReview && (
          <AddReview
            productId={parseInt(id)}
            userId={user.id}
            onReviewAdded={handleReviewAdded}
            onClose={() => setShowAddReview(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
