import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { productsAPI, usersAPI, ordersAPI, adminAPI, categoriesAPI } from '../api/api';
import { useEditMode } from './EditModeContext';
import styles from './AdminDashboard.module.css';

const TABS = [
  { id: 'stats',      icon: '📊', label: 'סטטיסטיקות' },
  { id: 'products',   icon: '📦', label: 'מוצרים' },
  { id: 'categories', icon: '🗂️', label: 'קטגוריות' },
  { id: 'users',      icon: '👥', label: 'משתמשים' },
  { id: 'orders',     icon: '📋', label: 'הזמנות' },
  { id: 'design',     icon: '🎨', label: 'עיצוב האתר' },
];

const DEFAULT_SETTINGS = {
  heroTitle: "לה קוצ'ינה",
  heroSubtitle: 'קייטרינג חלבי איטלקי • מנות טריות מדי יום',
  heroEmoji: '☕',
  primaryColor: '#c8622a',
  secondaryColor: '#3b1a08',
  accentColor: '#e8a87c',
  heroVideoId: 'Lcyeu2hUOeY',
  categoriesTitle: 'מה תרצה היום?',
  categoriesSubtitle: 'בחר קטגוריה לצפייה במנות',
};

export default function AdminDashboard() {
  const user = useSelector(s => s.user.currentUser);
  const navigate = useNavigate();
  const { setActive } = useEditMode() || {};

  const [tab, setTab] = useState('stats');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [savedSettings, setSavedSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [searchProduct, setSearchProduct] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [categories, setCategories] = useState([]);
  const [editCat, setEditCat] = useState(null);
  const [newCat, setNewCat] = useState({ name: '', emoji: '', desc: '', img: '', featured: false });

  useEffect(() => {
    if (!user?.isAdmin) { navigate('/home'); return; }
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [p, u, o, s, cats] = await Promise.all([
        productsAPI.getProducts({ limit: 999 }),
        usersAPI.getAllUsers(),
        ordersAPI.getOrders(),
        adminAPI.getSettings(),
        categoriesAPI.getCategories(),
      ]);
      setProducts(p.data.products || []);
      setUsers(u.data || []);
      setOrders(o.data || []);
      setCategories(cats.data || []);
      const merged = { ...DEFAULT_SETTINGS, ...s.data };
      setSettings(merged);
      setSavedSettings(merged);
    } catch { showToast('שגיאה בטעינת נתונים', 'error'); }
    setLoading(false);
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const avgOrder = orders.length ? Math.round(totalRevenue / orders.length) : 0;
  const topProduct = (() => {
    const counts = {};
    orders.forEach(o => (o.items || []).forEach(i => { counts[i.name] = (counts[i.name] || 0) + i.quantity; }));
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : '—';
  })();

  const saveSettings = async () => {
    setSaving(true);
    try {
      await adminAPI.updateSettings(settings);
      setSavedSettings(settings);
      showToast('ההגדרות נשמרו בהצלחה ✅');
    } catch { showToast('שגיאה בשמירה', 'error'); }
    setSaving(false);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('למחוק מוצר זה?')) return;
    try {
      await productsAPI.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast('מוצר נמחק');
    } catch { showToast('שגיאה במחיקה', 'error'); }
  };

  const saveProduct = async () => {
    try {
      await adminAPI.updateProduct(editProduct.id, editProduct);
      setProducts(prev => prev.map(p => p.id === editProduct.id ? editProduct : p));
      setEditProduct(null);
      showToast('מוצר עודכן ✅');
    } catch { showToast('שגיאה בעדכון', 'error'); }
  };

  const toggleAdmin = async (u) => {
    try {
      await usersAPI.updateUser(u.id, { isAdmin: !u.isAdmin });
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, isAdmin: !x.isAdmin } : x));
      showToast(`${u.firstName} ${!u.isAdmin ? 'הפך למנהל 👑' : 'הוסר מתפקיד מנהל'}`);
    } catch { showToast('שגיאה', 'error'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('למחוק משתמש זה?')) return;
    try {
      await usersAPI.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      showToast('משתמש נמחק');
    } catch { showToast('שגיאה', 'error'); }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await ordersAPI.updateOrder(id, { status });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      showToast('סטטוס עודכן');
    } catch { showToast('שגיאה', 'error'); }
  };

  const addCategory = async () => {
    if (!newCat.name.trim()) return showToast('יש להזין שם קטגוריה', 'error');
    try {
      const res = await categoriesAPI.addCategory(newCat);
      setCategories(prev => [...prev, res.data.category]);
      setNewCat({ name: '', emoji: '', desc: '', img: '', featured: false });
      showToast('קטגוריה נוספה ✅');
    } catch { showToast('שגיאה', 'error'); }
  };

  const saveCat = async () => {
    try {
      await categoriesAPI.updateCategory(editCat.id, editCat);
      setCategories(prev => prev.map(c => c.id === editCat.id ? editCat : c));
      setEditCat(null);
      showToast('קטגוריה עודכנה ✅');
    } catch { showToast('שגיאה', 'error'); }
  };

  const deleteCat = async (id) => {
    if (!window.confirm('למחוק קטגוריה זו?')) return;
    try {
      await categoriesAPI.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      showToast('קטגוריה נמחקה');
    } catch { showToast('שגיאה', 'error'); }
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchProduct.toLowerCase()) ||
    p.category?.includes(searchProduct)
  );
  const filteredUsers = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(searchUser.toLowerCase())
  );

  if (loading) return (
    <div className={styles.loadingScreen}>
      <div className={styles.spinner} />
      <p>טוען דשבורד...</p>
    </div>
  );

  return (
    <div className={styles.dashboard} dir="rtl">
      {toast && <div className={`${styles.toast} ${styles[toast.type]}`}>{toast.msg}</div>}

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span style={{ fontSize: '28px' }}>☕</span>
          <div>
            <div className={styles.logoText}>לה קוצ'ינה</div>
            <div className={styles.logoSub}>פאנל ניהול</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {TABS.map(t => (
            <button key={t.id}
              className={`${styles.navBtn} ${tab === t.id ? styles.active : ''}`}
              onClick={() => setTab(t.id)}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
          <button
            className={styles.navBtn}
            style={{ background: 'rgba(200,98,42,0.25)', border: '1px solid rgba(200,98,42,0.4)', color: '#e8a87c' }}
            onClick={() => { setActive(true); navigate('/home'); }}>
            <span>✏️</span> עריכה חיה
          </button>
          <button
            className={styles.navBtn}
            style={{ marginTop: '16px' }}
            onClick={() => navigate('/home')}>
            <span>←</span> חזרה לאתר
          </button>
        </nav>

        <div className={styles.sidebarBottom} />
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.topBar}>
          <h1 className={styles.pageTitle}>
            {TABS.find(t => t.id === tab)?.icon} {TABS.find(t => t.id === tab)?.label}
          </h1>
          <div className={styles.userChip}>👤 {user?.firstName} {user?.lastName}</div>
        </div>

        {/* ── STATS ── */}
        {tab === 'stats' && (
          <div className={styles.content}>
            <div className={styles.statsGrid}>
              {[
                { label: 'סה"כ מוצרים',   value: products.length,              icon: '📦', color: '#e8a87c' },
                { label: 'משתמשים רשומים', value: users.length,                 icon: '👥', color: '#6ee7b7' },
                { label: 'הזמנות שהתקבלו', value: orders.length,                icon: '📋', color: '#93c5fd' },
                { label: 'סה"כ הכנסות',   value: `₪${totalRevenue.toLocaleString()}`, icon: '💰', color: '#fcd34d' },
                { label: 'ממוצע להזמנה',  value: `₪${avgOrder}`,              icon: '📈', color: '#f9a8d4' },
                { label: 'מוצר מוביל',    value: topProduct,                   icon: '🏆', color: '#c4b5fd' },
              ].map(s => (
                <div key={s.label} className={styles.statCard} style={{ borderTopColor: s.color }}>
                  <div className={styles.statIcon}>{s.icon}</div>
                  <div className={styles.statVal}>{s.value}</div>
                  <div className={styles.statLbl}>{s.label}</div>
                </div>
              ))}
            </div>

            <p className={styles.secTitle}>🕐 הזמנות אחרונות</p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr><th>#</th><th>לקוח</th><th>סכום</th><th>תאריך</th><th>סטטוס</th></tr>
                </thead>
                <tbody>
                  {orders.slice(0, 8).map(o => (
                    <tr key={o.id}>
                      <td><code style={{ color: '#c8622a', fontSize: '12px' }}>#{String(o.id).slice(-6)}</code></td>
                      <td>{o.shipping?.firstName ? `${o.shipping.firstName} ${o.shipping.lastName}` : `משתמש ${o.userId}`}</td>
                      <td><strong>₪{(o.total || 0).toLocaleString()}</strong></td>
                      <td style={{ color: '#9ca3af', fontSize: '12px' }}>{o.date || '—'}</td>
                      <td><span className={`${styles.badge} ${styles[o.status] || styles.pending}`}>{o.status || 'ממתין'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {tab === 'products' && (
          <div className={styles.content}>
            <div className={styles.toolbar}>
              <input className={styles.search} placeholder="🔍 חיפוש לפי שם או קטגוריה..."
                value={searchProduct} onChange={e => setSearchProduct(e.target.value)} />
              <span className={styles.count}>{filteredProducts.length} מוצרים</span>
              <button className={styles.addBtn} onClick={() => navigate('/add-product')}>➕ הוסף מוצר</button>
            </div>

            {editProduct && (
              <div className={styles.overlay}>
                <div className={styles.editCard}>
                  <h3 style={{ margin: '0 0 18px', color: '#3b1a08' }}>✏️ עריכת מוצר: {editProduct.name}</h3>
                  <div className={styles.editGrid}>
                    {[
                      { key: 'name',     label: 'שם המוצר' },
                      { key: 'category', label: 'קטגוריה' },
                      { key: 'price',    label: 'מחיר (₪)', type: 'number' },
                      { key: 'stock',    label: 'מלאי',     type: 'number' },
                      { key: 'image',    label: 'קישור תמונה (URL)', full: true },
                    ].map(({ key, label, type = 'text', full }) => (
                      <div key={key} style={{ gridColumn: full ? '1/-1' : 'auto' }}>
                        <label className={styles.label}>{label}</label>
                        <input type={type} className={styles.input} value={editProduct[key] || ''}
                          onChange={e => setEditProduct(p => ({ ...p, [key]: type === 'number' ? +e.target.value : e.target.value }))} />
                      </div>
                    ))}
                    <div style={{ gridColumn: '1/-1' }}>
                      <label className={styles.label}>תיאור</label>
                      <textarea className={styles.textarea} value={editProduct.description || ''}
                        onChange={e => setEditProduct(p => ({ ...p, description: e.target.value }))} />
                    </div>
                    {editProduct.image && (
                      <div style={{ gridColumn: '1/-1' }}>
                        <img src={editProduct.image} alt="" className={styles.imgPreview}
                          onError={e => e.target.style.display = 'none'} />
                      </div>
                    )}
                  </div>
                  <div className={styles.editActions}>
                    <button className={styles.cancelBtn} onClick={() => setEditProduct(null)}>ביטול</button>
                    <button className={styles.saveBtn} onClick={saveProduct}>💾 שמור שינויים</button>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr><th>תמונה</th><th>שם המוצר</th><th>קטגוריה</th><th>מחיר</th><th>מלאי</th><th>נמכר</th><th>פעולות</th></tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id}>
                      <td><img src={p.image} alt={p.name} className={styles.thumb} onError={e => e.target.src = 'https://via.placeholder.com/44'} /></td>
                      <td><strong>{p.name}</strong></td>
                      <td><span className={styles.catBadge}>{p.category}</span></td>
                      <td>₪{p.price}</td>
                      <td>
                        <span className={p.stock > 10 ? styles.inStock : p.stock > 0 ? styles.lowStock : styles.outStock}>
                          {p.stock} יח'
                        </span>
                      </td>
                      <td style={{ color: '#9ca3af' }}>{p.sold || 0}</td>
                      <td className={styles.actions}>
                        <button className={styles.editBtn} onClick={() => setEditProduct({ ...p })}>✏️ ערוך</button>
                        <button className={styles.deleteBtn} onClick={() => deleteProduct(p.id)}>🗑️ מחק</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div className={styles.content}>
            <div className={styles.toolbar}>
              <input className={styles.search} placeholder="🔍 חיפוש לפי שם או אימייל..."
                value={searchUser} onChange={e => setSearchUser(e.target.value)} />
              <span className={styles.count}>{filteredUsers.length} משתמשים</span>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr><th>משתמש</th><th>אימייל</th><th>טלפון</th><th>כתובת</th><th>תפקיד</th><th>פעולות</th></tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div className={styles.userCell}>
                          <div className={styles.avatar}>{u.firstName?.[0]}{u.lastName?.[0]}</div>
                          <span><strong>{u.firstName} {u.lastName}</strong></span>
                        </div>
                      </td>
                      <td style={{ color: '#6b7280', fontSize: '12px' }}>{u.email}</td>
                      <td style={{ color: '#6b7280', fontSize: '12px' }}>{u.phone || '—'}</td>
                      <td style={{ color: '#6b7280', fontSize: '12px' }}>{u.address || '—'}</td>
                      <td>
                        <span className={u.isAdmin ? styles.adminTag : styles.userTag}>
                          {u.isAdmin ? '👑 מנהל' : '👤 משתמש'}
                        </span>
                      </td>
                      <td className={styles.actions}>
                        <button className={styles.editBtn} onClick={() => toggleAdmin(u)}>
                          {u.isAdmin ? '👤 הסר מנהל' : '👑 הפוך למנהל'}
                        </button>
                        {u.id !== user?.id && (
                          <button className={styles.deleteBtn} onClick={() => deleteUser(u.id)}>🗑️ מחק</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === 'orders' && (
          <div className={styles.content}>
            <div className={styles.toolbar}>
              <span className={styles.count}>
                📋 {orders.length} הזמנות &nbsp;|&nbsp; 💰 סה"כ הכנסות: <strong>₪{totalRevenue.toLocaleString()}</strong>
              </span>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr><th>#</th><th>לקוח</th><th>כתובת משלוח</th><th>פריטים</th><th>סכום</th><th>תאריך</th><th>סטטוס</th></tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td><code style={{ color: '#c8622a', fontSize: '12px' }}>#{String(o.id).slice(-6)}</code></td>
                      <td><strong>{o.shipping?.firstName ? `${o.shipping.firstName} ${o.shipping.lastName}` : `משתמש ${o.userId}`}</strong></td>
                      <td style={{ fontSize: '12px', color: '#6b7280' }}>{o.shipping?.address ? `${o.shipping.address}, ${o.shipping.city}` : '—'}</td>
                      <td style={{ color: '#6b7280' }}>{(o.items || []).length} פריטים</td>
                      <td><strong style={{ color: '#c8622a' }}>₪{(o.total || 0).toLocaleString()}</strong></td>
                      <td style={{ fontSize: '12px', color: '#9ca3af' }}>{o.date || '—'}</td>
                      <td>
                        <select className={styles.statusSelect}
                          value={o.status || 'התקבלה'}
                          onChange={e => updateOrderStatus(o.id, e.target.value)}>
                          <option value="התקבלה">✅ התקבלה</option>
                          <option value="בדרך">🚚 בדרך</option>
                          <option value="נמסרה">📦 נמסרה</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CATEGORIES ── */}
        {tab === 'categories' && (
          <div className={styles.content}>
            <div className={styles.toolbar}>
              <span className={styles.count}>{categories.length} קטגוריות</span>
              <button className={styles.addBtn} onClick={() => setEditCat({ _new: true, name: '', emoji: '', desc: '', img: '', featured: false })}>➕ הוסף קטגוריה</button>
            </div>

            {editCat && (
              <div className={styles.overlay}>
                <div className={styles.editCard}>
                  <h3 style={{ margin: '0 0 18px', color: '#3b1a08' }}>
                    {editCat._new ? '➕ קטגוריה חדשה' : `✏️ עריכת קטגוריה: ${editCat.name}`}
                  </h3>
                  <div className={styles.editGrid}>
                    {[
                      { key: 'name',  label: 'שם הקטגוריה' },
                      { key: 'emoji', label: 'אמוג\'י' },
                      { key: 'desc',  label: 'תיאור' },
                      { key: 'img',   label: 'תמונה (URL)', full: true },
                    ].map(({ key, label, full }) => (
                      <div key={key} style={{ gridColumn: full ? '1/-1' : 'auto' }}>
                        <label className={styles.label}>{label}</label>
                        <input className={styles.input} value={editCat[key] || ''}
                          onChange={e => setEditCat(c => ({ ...c, [key]: e.target.value }))} />
                      </div>
                    ))}
                    <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input type="checkbox" id="featuredChk" checked={!!editCat.featured}
                        onChange={e => setEditCat(c => ({ ...c, featured: e.target.checked }))} />
                      <label htmlFor="featuredChk" className={styles.label} style={{ margin: 0 }}>מוצג בקטגוריות מובלטות (Featured)</label>
                    </div>
                    {editCat.img && (
                      <div style={{ gridColumn: '1/-1' }}>
                        <img src={editCat.img} alt="" className={styles.imgPreview} onError={e => e.target.style.display='none'} />
                      </div>
                    )}
                  </div>
                  <div className={styles.editActions}>
                    <button className={styles.cancelBtn} onClick={() => setEditCat(null)}>ביטול</button>
                    <button className={styles.saveBtn} onClick={async () => {
                      if (!editCat.name.trim()) return showToast('יש להזין שם קטגוריה', 'error');
                      try {
                        if (editCat._new) {
                          const { _new, ...catData } = editCat;
                          const res = await categoriesAPI.addCategory(catData);
                          setCategories(prev => [...prev, res.data.category]);
                          showToast('קטגוריה נוספה ✅');
                        } else {
                          await categoriesAPI.updateCategory(editCat.id, editCat);
                          setCategories(prev => prev.map(c => c.id === editCat.id ? editCat : c));
                          showToast('קטגוריה עודכנה ✅');
                        }
                        setEditCat(null);
                      } catch { showToast('שגיאה', 'error'); }
                    }}>💾 שמור</button>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr><th>תמונה</th><th>שם</th><th>אמוג'י</th><th>תיאור</th><th>מוצרים</th><th>מובלט</th><th>פעולות</th></tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id}>
                      <td>
                        {cat.img
                          ? <img src={cat.img} alt={cat.name} className={styles.thumb} onError={e => e.target.style.display='none'} />
                          : <span style={{ fontSize: '28px' }}>{cat.emoji || '🗂️'}</span>
                        }
                      </td>
                      <td><strong>{cat.name}</strong></td>
                      <td style={{ fontSize: '22px' }}>{cat.emoji}</td>
                      <td style={{ color: '#6b7280', fontSize: '13px' }}>{cat.desc || '—'}</td>
                      <td style={{ color: '#c8622a', fontWeight: '600' }}>
                        {products.filter(p => p.category === cat.name).length}
                      </td>
                      <td>{cat.featured ? '⭐ כן' : '—'}</td>
                      <td className={styles.actions}>
                        <button className={styles.editBtn} onClick={() => setEditCat({ ...cat })}>✏️ ערוך</button>
                        <button className={styles.deleteBtn} onClick={async () => {
                          const count = products.filter(p => p.category === cat.name).length;
                          if (!window.confirm(`למחוק את הקטגוריה "${cat.name}"?\nפעולה זו תמחק גם ${count} מוצרים!`)) return;
                          try {
                            await categoriesAPI.deleteCategory(cat.id);
                            setCategories(prev => prev.filter(c => c.id !== cat.id));
                            setProducts(prev => prev.filter(p => p.category !== cat.name));
                            showToast(`קטגוריה נמחקה (${count} מוצרים הוסרו)`);
                          } catch { showToast('שגיאה', 'error'); }
                        }}>🗑️ מחק</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── DESIGN ── */}
        {tab === 'design' && (
          <div className={styles.content}>
            <div className={styles.designGrid}>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>🦸 Hero — עמוד הבית</h3>
                <label className={styles.label}>אמוג'י</label>
                <input className={styles.input} value={settings.heroEmoji}
                  onChange={e => setSettings(s => ({ ...s, heroEmoji: e.target.value }))} />
                <label className={styles.label}>כותרת ראשית</label>
                <input className={styles.input} value={settings.heroTitle}
                  onChange={e => setSettings(s => ({ ...s, heroTitle: e.target.value }))} />
                <label className={styles.label}>תת-כותרת</label>
                <input className={styles.input} value={settings.heroSubtitle}
                  onChange={e => setSettings(s => ({ ...s, heroSubtitle: e.target.value }))} />
                <label className={styles.label}>YouTube Video ID</label>
                <input className={styles.input} value={settings.heroVideoId}
                  onChange={e => setSettings(s => ({ ...s, heroVideoId: e.target.value }))} placeholder="Lcyeu2hUOeY" />
                <p className={styles.hint}>רק ה-ID מהקישור: youtube.com/watch?v=<strong>ID</strong></p>
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>🎨 צבעי האתר</h3>
                {[
                  { key: 'primaryColor',   label: 'צבע ראשי — כפתורים ואלמנטים מרכזיים' },
                  { key: 'secondaryColor', label: 'צבע משני — כותרות ורקעים כהים' },
                  { key: 'accentColor',    label: 'צבע הדגשה — hover ופרטים' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className={styles.label}>{label}</label>
                    <div className={styles.colorRow}>
                      <input type="color" value={settings[key]}
                        onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                        className={styles.colorPicker} />
                      <input className={styles.input} value={settings[key]}
                        onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))} />
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>🗂️ כותרות קטגוריות</h3>
                <label className={styles.label}>כותרת הסקשן</label>
                <input className={styles.input} value={settings.categoriesTitle}
                  onChange={e => setSettings(s => ({ ...s, categoriesTitle: e.target.value }))} />
                <label className={styles.label}>תת-כותרת</label>
                <input className={styles.input} value={settings.categoriesSubtitle}
                  onChange={e => setSettings(s => ({ ...s, categoriesSubtitle: e.target.value }))} />
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>👁️ תצוגה מקדימה</h3>
                <div style={{
                  background: `linear-gradient(135deg,${settings.secondaryColor}cc,${settings.primaryColor}99)`,
                  borderRadius: '14px', padding: '28px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '44px' }}>{settings.heroEmoji}</div>
                  <h2 style={{ color: 'white', fontSize: '22px', margin: '8px 0', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                    {settings.heroTitle}
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.85)', margin: '0 0 18px', fontSize: '13px' }}>{settings.heroSubtitle}</p>
                  <button style={{
                    background: `linear-gradient(135deg,${settings.accentColor},${settings.primaryColor})`,
                    color: 'white', border: 'none', padding: '9px 24px',
                    borderRadius: '50px', fontWeight: '700', cursor: 'pointer', fontSize: '13px',
                  }}>צפה בתפריט →</button>
                </div>
                <div style={{ marginTop: '14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {['primaryColor', 'secondaryColor', 'accentColor'].map(k => (
                    <div key={k} style={{ width: '32px', height: '32px', borderRadius: '50%', background: settings[k], border: '3px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} title={settings[k]} />
                  ))}
                  <span style={{ fontSize: '12px', color: '#9ca3af', marginRight: '4px' }}>צבעי האתר הנוכחיים</span>
                </div>
              </div>
            </div>

            <div className={styles.saveBar}>
              <button className={styles.resetBtn} onClick={() => setSettings(savedSettings)}>↺ בטל שינויים</button>
              <button className={styles.saveBtn} onClick={saveSettings} disabled={saving}>
                {saving ? '⏳ שומר...' : '💾 שמור הגדרות'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
