import { useState, useEffect } from 'react';
import { productsAPI } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/store';
import ConfirmDialog from '../components/ConfirmDialog';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [user, setUser] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [addedMap, setAddedMap] = useState({});

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    setAddedMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedMap(prev => ({ ...prev, [product.id]: false })), 1500);
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo(0, 0);
  }, [search, category]);

  useEffect(() => {
    loadProducts();
  }, [search, category, currentPage]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getProducts({
        search,
        category,
        page: currentPage,
        limit: 20
      });
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages || Math.ceil(response.data.total / 20));
      setTotalProducts(response.data.total || response.data.products.length);
    } catch (error) {
      console.error('Error loading products:', error);
    }
    setLoading(false);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await productsAPI.deleteProduct(productToDelete.id);
      loadProducts();
      setShowConfirm(false);
      setProductToDelete(null);
    } catch (error) {
      alert('שגיאה במחיקת המוצר');
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setProductToDelete(null);
  };

  return (
    <div style={{padding: '20px', marginTop: '40px', paddingTop: '20px'}}>
      <div style={{
        background: 'linear-gradient(135deg, #0891b2 0%, #0c4a6e 100%)',
        padding: '40px',
        textAlign: 'center',
        marginBottom: '40px',
        borderRadius: '20px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: '48px',
          color: 'white',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          margin: '0'
        }}>
          🛒 חנות המוצרים שלנו 🛒
        </h1>
        <p style={{
          fontSize: '18px',
          color: 'rgba(255,255,255,0.9)',
          marginTop: '10px',
          fontWeight: '300'
        }}>
          עיין בכל המוצרים האיכותיים והמגוונים שלנו
        </p>
      </div>

      <div style={{
        backgroundColor: '#0891b2',
        padding: '30px',
        borderRadius: '15px',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        <h2 style={{color: 'white', fontSize: '24px', marginBottom: '20px'}}>
          🔍 חפש מוצרים
        </h2>
        <div style={{display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap'}}>
          <input
            type="text"
            placeholder="חפש מוצר..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '15px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '300px',
              minWidth: '200px'
            }}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: '15px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '200px',
              minWidth: '150px'
            }}
          >
            <option value="">כל הקטגוריות</option>
            <option value="מחשבים">מחשבים</option>
            <option value="טלפונים">טלפונים</option>
            <option value="אביזרים">אביזרים</option>
            <option value="טאבלטים">טאבלטים</option>
            <option value="צילום">צילום</option>
            <option value="גיימינג">גיימינג</option>
            <option value="בית חכם">בית חכם</option>
          </select>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {products.map(product => (
          <div key={product.id} style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            border: '1px solid #e5e7eb'
          }}>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/product/${product.id}`)}
            />
            <div style={{padding: '15px'}}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '10px',
                color: '#1f2937'
              }}>
                {product.name}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                marginBottom: '15px',
                height: '40px',
                overflow: 'hidden'
              }}>
                {product.description}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <span style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#0891b2'
                }}>
                  ₪{product.price.toLocaleString()}
                </span>
                <span style={{
                  fontSize: '12px',
                  backgroundColor: '#f0f9ff',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  color: '#0c4a6e'
                }}>
                  במלאי: {product.stock}
                </span>
              </div>
              <button
                onClick={() => navigate(`/product/${product.id}`)}
                style={{
                  width: '100%',
                  backgroundColor: '#0891b2',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}
              >
                צפה בפרטים
              </button>
              {!user?.isAdmin && (
                <button
                  onClick={() => handleAddToCart(product)}
                  style={{
                    width: '100%',
                    backgroundColor: addedMap[product.id] ? '#16a34a' : '#f0f9ff',
                    color: addedMap[product.id] ? 'white' : '#0891b2',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #0891b2',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    transition: 'all 0.3s'
                  }}
                >
                  {addedMap[product.id] ? '✓ נוסף לסל!' : '🛒 הוסף לסל'}
                </button>
              )}
              {user?.isAdmin && (
                <button
                  onClick={() => handleDeleteClick(product)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded text-sm"
                >
                  🗑 מחק מוצר
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div style={{textAlign: 'center', marginTop: '40px'}}>
          <p style={{fontSize: '18px', color: '#6b7280'}}>טוען מוצרים...</p>
        </div>
      )}

      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          marginTop: '40px',
          padding: '20px'
        }}>
          <button
            onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo(0, 0); }}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: currentPage === 1 ? '#e5e7eb' : '#0891b2',
              color: currentPage === 1 ? '#9ca3af' : 'white',
              border: 'none',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            ← הקודם
          </button>
          
          <div style={{display: 'flex', gap: '5px'}}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => { setCurrentPage(page); window.scrollTo(0, 0); }}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: currentPage === page ? '#0891b2' : 'white',
                  color: currentPage === page ? 'white' : '#374151',
                  border: currentPage === page ? '1px solid #0891b2' : '1px solid #d1d5db',
                  fontWeight: currentPage === page ? 'bold' : 'normal',
                  cursor: 'pointer'
                }}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo(0, 0); }}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: currentPage === totalPages ? '#e5e7eb' : '#0891b2',
              color: currentPage === totalPages ? '#9ca3af' : 'white',
              border: 'none',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            הבא →
          </button>
        </div>
      )}

      {!loading && (
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          color: '#6b7280',
          fontSize: '14px'
        }}>
          מציג {products.length} מתוך {totalProducts} מוצרים (עמוד {currentPage} מתוך {totalPages})
        </div>
      )}

      {products.length === 0 && !loading && (
        <div style={{textAlign: 'center', marginTop: '40px'}}>
          <p style={{fontSize: '18px', color: '#6b7280'}}>לא נמצאו מוצרים</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={showConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="מחיקת מוצר"
        message="האם אתה בטוח שברצונך למחוק את המוצר הזה? פעולה זו לא ניתנת לביטול."
        productName={productToDelete?.name}
      />
    </div>
  );
};

export default ProductList;
