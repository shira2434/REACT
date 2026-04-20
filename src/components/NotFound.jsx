import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '20px',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', textAlign: 'center', padding: '20px'
    }}>
      <div style={{ fontSize: '100px' }}>🔍</div>
      <h1 style={{ fontSize: '80px', fontWeight: 'bold', color: '#0891b2', margin: 0 }}>404</h1>
      <h2 style={{ fontSize: '28px', color: '#1f2937', margin: 0 }}>הדף לא נמצא</h2>
      <p style={{ color: '#6b7280', fontSize: '16px', maxWidth: '400px' }}>
        הדף שחיפשת לא קיים. אולי הקישור שגוי או שהדף הוסר.
      </p>
      <button
        onClick={() => navigate('/home')}
        style={{
          backgroundColor: '#0891b2', color: 'white', padding: '14px 36px',
          borderRadius: '12px', border: 'none', cursor: 'pointer',
          fontSize: '16px', fontWeight: 'bold', marginTop: '10px'
        }}
      >
        🏠 חזור לדף הבית
      </button>
    </div>
  );
};

export default NotFound;
