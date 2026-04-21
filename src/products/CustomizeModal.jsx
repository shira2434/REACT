import { useState } from 'react';

const PRIMARY = '#c8622a';

const customizationOptions = {
  'פסטות': {
    sections: [
      {
        title: 'סוג פסטה',
        key: 'pasta',
        required: true,
        options: ['ספגטי', 'פנה', 'ריגטוני', 'פרפרים', 'טליאטלה', 'ניוקי'],
      },
      {
        title: 'רוטב',
        key: 'sauce',
        required: true,
        options: ['עגבניות קלאסי', 'שמנת', 'פסטו', 'ארביאטה', 'רוזה', 'שמן זית ושום'],
      },
      {
        title: 'גבינה',
        key: 'cheese',
        required: false,
        options: ['פרמזן', 'מוצרלה', 'גורגונזולה', 'ריקוטה', 'ללא גבינה'],
      },
      {
        title: 'תוספות',
        key: 'extras',
        required: false,
        multi: true,
        options: ['פטריות', 'זיתים', 'עגבניות מיובשות', 'ברוקולי', 'תרד', 'בצל מקורמל', 'צנוברים'],
      },
    ],
  },
  'פיצות': {
    sections: [
      {
        title: 'בסיס',
        key: 'base',
        required: true,
        options: ['רוטב עגבניות', 'שמנת', 'פסטו', 'שמן זית'],
      },
      {
        title: 'גבינה',
        key: 'cheese',
        required: true,
        options: ['מוצרלה', '4 גבינות', 'פטה', 'גורגונזולה', 'ריקוטה'],
      },
      {
        title: 'תוספות',
        key: 'extras',
        required: false,
        multi: true,
        options: ['פטריות', 'זיתים', 'פלפלים', 'בצל סגול', 'עגבניות שרי', 'ברוקולי', 'תירס', 'ביצה'],
      },
      {
        title: 'גודל',
        key: 'size',
        required: true,
        options: ['אישית (26 ס"מ)', 'משפחתית (32 ס"מ)', 'ענקית (40 ס"מ)'],
      },
    ],
  },
  'סושי': {
    sections: [
      {
        title: 'סוג',
        key: 'type',
        required: true,
        options: ['מאקי', 'אוראמאקי', 'נגירי', 'סשימי', 'טמפורה רול'],
      },
      {
        title: 'דג/מילוי',
        key: 'filling',
        required: true,
        options: ['סלמון', 'טונה', 'שרימפס', 'אבוקדו', 'מלפפון', 'גבינת שמנת'],
      },
      {
        title: 'רוטב',
        key: 'sauce',
        required: false,
        options: ['סויה', 'ספיסי מיונז', 'טריאקי', 'פונזו', 'ללא רוטב'],
      },
      {
        title: 'תוספות',
        key: 'extras',
        required: false,
        multi: true,
        options: ['אבוקדו', 'מלפפון', 'גזר', 'בצל ירוק', 'שומשום', 'טמפורה פלייקס'],
      },
    ],
  },
  'סלטים': {
    sections: [
      {
        title: 'בסיס ירקות',
        key: 'base',
        required: true,
        options: ['חסה', 'תרד', 'רוקט', 'קייל', 'מיקס ירוקים'],
      },
      {
        title: 'רוטב',
        key: 'sauce',
        required: true,
        options: ['לימון שמן זית', 'ויניגרט', 'דבש חרדל', 'טחינה', 'בלסמי', 'יוגורט עשבים'],
      },
      {
        title: 'תוספות חלביות',
        key: 'dairy',
        required: false,
        options: ['פטה', 'מוצרלה', 'גבינת עיזים', 'פרמזן', 'ללא גבינה'],
      },
      {
        title: 'תוספות נוספות',
        key: 'extras',
        required: false,
        multi: true,
        options: ['אגוזי מלך', 'צנוברים', 'קרוטונים', 'זיתים', 'עגבניות שרי', 'מלפפון', 'אבוקדו'],
      },
    ],
  },
};

const CustomizeModal = ({ product, onClose, onAddToCart }) => {
  const options = customizationOptions[product.category];
  const [selections, setSelections] = useState({});
  const [error, setError] = useState('');

  if (!options) return null;

  const handleSelect = (key, value, multi) => {
    if (multi) {
      setSelections(prev => {
        const current = prev[key] || [];
        return {
          ...prev,
          [key]: current.includes(value) ? current.filter(v => v !== value) : [...current, value],
        };
      });
    } else {
      setSelections(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleAdd = () => {
    const missing = options.sections.filter(s => s.required && !selections[s.key]);
    if (missing.length) {
      setError(`יש לבחור: ${missing.map(s => s.title).join(', ')}`);
      return;
    }
    const customText = options.sections
      .filter(s => selections[s.key])
      .map(s => `${s.title}: ${Array.isArray(selections[s.key]) ? selections[s.key].join(', ') : selections[s.key]}`)
      .join(' | ');
    onAddToCart({ ...product, customization: customText, name: `${product.name} (מותאם)` });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(4px)', padding: '20px',
    }}>
      <div style={{
        background: 'white', borderRadius: '24px', width: '100%', maxWidth: '560px',
        maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 60px rgba(0,0,0,0.25)', animation: 'scaleIn 0.25s ease',
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, #3b1a08, ${PRIMARY})`,
          padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '800', margin: '0 0 4px' }}>
              🎨 התאם אישית
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: 0 }}>{product.name}</p>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
            width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px',
          }}>✕</button>
        </div>

        {/* Content */}
        <div style={{ overflowY: 'auto', padding: '24px 28px', flex: 1 }}>
          {options.sections.map(section => (
            <div key={section.key} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#3b1a08', margin: 0 }}>
                  {section.title}
                </h3>
                {section.required && (
                  <span style={{ fontSize: '11px', background: '#fde8d8', color: PRIMARY, padding: '2px 8px', borderRadius: '50px', fontWeight: '600' }}>
                    חובה
                  </span>
                )}
                {section.multi && (
                  <span style={{ fontSize: '11px', background: '#e8f5e9', color: '#2e7d32', padding: '2px 8px', borderRadius: '50px', fontWeight: '600' }}>
                    ניתן לבחור כמה
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {section.options.map(opt => {
                  const selected = section.multi
                    ? (selections[section.key] || []).includes(opt)
                    : selections[section.key] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelect(section.key, opt, section.multi)}
                      style={{
                        padding: '8px 16px', borderRadius: '50px', fontSize: '14px', cursor: 'pointer',
                        border: `2px solid ${selected ? PRIMARY : '#e8d5c4'}`,
                        background: selected ? `linear-gradient(135deg, #e8a87c, ${PRIMARY})` : 'white',
                        color: selected ? 'white' : '#3b1a08',
                        fontWeight: selected ? '700' : '400',
                        transition: 'all 0.15s',
                        transform: selected ? 'scale(1.05)' : 'scale(1)',
                      }}
                    >
                      {selected && '✓ '}{opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px 14px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px' }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 28px', borderTop: '2px solid #f0e0cc', display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid #e8d5c4',
            background: 'white', color: '#6b3a1f', fontSize: '15px', fontWeight: '600', cursor: 'pointer',
          }}>ביטול</button>
          <button onClick={handleAdd} style={{
            flex: 2, padding: '12px', borderRadius: '12px', border: 'none',
            background: `linear-gradient(135deg, #e8a87c, ${PRIMARY})`,
            color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(200,98,42,0.35)',
          }}>
            🛒 הוסף לסל
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeModal;
