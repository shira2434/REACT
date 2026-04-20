import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../store/store';

const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
const colors = {
  success: { bg: '#f0fdf4', border: '#86efac', text: '#166534' },
  error:   { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b' },
  info:    { bg: '#f0f9ff', border: '#7dd3fc', text: '#0c4a6e' },
  warning: { bg: '#fffbeb', border: '#fcd34d', text: '#92400e' },
};

const ToastItem = ({ toast }) => {
  const dispatch = useDispatch();
  const c = colors[toast.type] || colors.info;

  useEffect(() => {
    const t = setTimeout(() => dispatch(removeToast(toast.id)), toast.duration || 3000);
    return () => clearTimeout(t);
  }, [toast.id, toast.duration, dispatch]);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '14px 18px', borderRadius: '12px', marginBottom: '10px',
      backgroundColor: c.bg, border: `1px solid ${c.border}`, color: c.text,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '15px', fontWeight: '500',
      animation: 'slideInRight 0.3s ease-out', minWidth: '280px', maxWidth: '380px',
      direction: 'rtl'
    }}>
      <span style={{ fontSize: '20px' }}>{icons[toast.type]}</span>
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={() => dispatch(removeToast(toast.id))}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.text, fontSize: '18px', padding: '0', lineHeight: 1 }}
      >×</button>
    </div>
  );
};

const Toast = () => {
  const toasts = useSelector(state => state.toast.toasts);

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
      <div style={{
        position: 'fixed', top: '20px', left: '20px',
        zIndex: 9999, display: 'flex', flexDirection: 'column'
      }}>
        {toasts.map(t => <ToastItem key={t.id} toast={t} />)}
      </div>
    </>
  );
};

export default Toast;
