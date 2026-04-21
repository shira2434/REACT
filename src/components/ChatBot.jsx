import { useState, useRef, useEffect } from 'react';

const PRIMARY = '#c8622a';

const faqs = [
  { keywords: ['שלום', 'היי', 'הי', 'בוקר', 'ערב'], answer: 'שלום! ברוך הבא ללה קוצ\'ינה 👋 איך אוכל לעזור לך?' },
  { keywords: ['שעות', 'פתוח', 'סגור', 'מתי'], answer: 'אנחנו פתוחים ראשון-חמישי 08:00-22:00, שישי 08:00-15:00 ☕' },
  { keywords: ['משלוח', '배달', 'מביאים', 'לבית'], answer: 'כן! אנחנו מספקים משלוחים לכל הארץ 🚚 זמן משלוח עד 48 שעות.' },
  { keywords: ['מחיר', 'עולה', 'כמה', 'תשלום', 'עלות'], answer: 'המחירים שלנו מתחילים מ-₪14 לשתייה ועד ₪95 למגשים מיוחדים. תוכלי לראות את כל המחירים בתפריט 😊' },
  { keywords: ['חלבי', 'גלאט', 'כשר', 'כשרות'], answer: 'כן! אנחנו מסעדה חלבית כשרה למהדרין 🧀✨' },
  { keywords: ['פיצה', 'פיצות'], answer: 'יש לנו 6 סוגי פיצות מדהימות! מרגריטה, 4 גבינות, פסטו, ירקות צלויים ועוד 🍕 תסתכלי בקטגוריית פיצות בתפריט.' },
  { keywords: ['פסטה', 'פסטות'], answer: 'יש לנו פסטות איטלקיות קלאסיות: קרבונרה, פסטו, ארבע גבינות, לזניה, ניוקי ועוד 🍝' },
  { keywords: ['בוקר', 'ברנץ', 'בראנץ'], answer: 'ארוחות הבוקר שלנו מדהימות! שקשוקה, פנקייק, וופל בלגי, אבוקדו טוסט ועוד 🥞' },
  { keywords: ['קינוח', 'קינוחים', 'מתוק', 'עוגה'], answer: 'יש לנו קינוחים איטלקיים מפנקים: טירמיסו, פנה קוטה, ג\'לטו, עוגת גבינה ועוד 🍰' },
  { keywords: ['קפה', 'אספרסו', 'לאטה', 'קפוצינו'], answer: 'הקפה שלנו מפולי קפה איטלקי נבחר ☕ יש לנו אספרסו, לאטה, קפוצ\'ינו ועוד!' },
  { keywords: ['הזמנה', 'להזמין', 'איך מזמינים'], answer: 'פשוט מאוד! בחרי מוצרים מהתפריט → הוסיפי לסל → לחצי על סל הקניות → שלמי 🛒' },
  { keywords: ['ביטול', 'לבטל', 'החזר'], answer: 'לביטול הזמנה צרי קשר איתנו בהקדם האפשרי. ניתן לבטל עד 24 שעות לפני האירוע 📞' },
  { keywords: ['אלרגיה', 'אלרגן', 'גלוטן', 'לקטוז'], answer: 'אנחנו מסעדה חלבית — כל המנות מכילות מוצרי חלב. לשאלות על אלרגנים ספציפיים צרי קשר ישירות 🌿' },
  { keywords: ['כתובת', 'איפה', 'מיקום', 'נמצאים'], answer: 'אנחנו ממוקמים בתל אביב 📍 לפרטים מדויקים צרי קשר בטלפון.' },
  { keywords: ['טלפון', 'ליצור קשר', 'צור קשר', 'מספר'], answer: 'ניתן ליצור קשר דרך האתר או בדוא"ל 📧 נשמח לעזור!' },
  { keywords: ['תודה', 'תודה רבה', 'תנקיו'], answer: 'בשמחה! 😊 אם יש עוד שאלות אני כאן.' },
  { keywords: ['ביי', 'להתראות', 'שלום'], answer: 'להתראות! מקווים לראותך בקרוב 👋☕' },
];

const getAnswer = (input) => {
  const lower = input.toLowerCase();
  for (const faq of faqs) {
    if (faq.keywords.some(k => lower.includes(k.toLowerCase()))) {
      return faq.answer;
    }
  }
  return 'מצטערת, לא הבנתי את השאלה 😅 נסי לשאול על: תפריט, שעות פתיחה, משלוח, מחירים, כשרות או הזמנות.';
};

const suggestions = ['שעות פתיחה', 'יש משלוח?', 'מה יש בתפריט?', 'האם כשר?'];

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'שלום! אני הבוט של לה קוצ\'ינה ☕ איך אוכל לעזור?' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text: msg }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: 'bot', text: getAnswer(msg) }]);
    }, 800);
  };

  return (
    <>
      {/* כפתור פתיחה */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: '28px', left: '28px', zIndex: 1000,
          width: '60px', height: '60px', borderRadius: '50%',
          background: `linear-gradient(135deg, #e8a87c, ${PRIMARY})`,
          border: 'none', cursor: 'pointer', fontSize: '28px',
          boxShadow: '0 8px 24px rgba(200,98,42,0.45)',
          transition: 'transform 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open ? '✕' : '💬'}
      </button>

      {/* חלון צ'אט */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '100px', left: '28px', zIndex: 1000,
          width: '340px', height: '480px', background: 'white',
          borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          border: '2px solid #f0e0cc',
          animation: 'slideUp 0.25s ease',
        }}>

          {/* header */}
          <div style={{
            background: `linear-gradient(135deg, #3b1a08, ${PRIMARY})`,
            padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '20px',
            }}>☕</div>
            <div>
              <div style={{ color: 'white', fontWeight: '700', fontSize: '15px' }}>בוט לה קוצ'ינה</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>● מחובר</div>
            </div>
          </div>

          {/* הודעות */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.from === 'user' ? 'flex-start' : 'flex-end',
              }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: '18px',
                  fontSize: '14px', lineHeight: '1.5',
                  background: msg.from === 'user' ? '#f0e0cc' : `linear-gradient(135deg, #e8a87c, ${PRIMARY})`,
                  color: msg.from === 'user' ? '#3b1a08' : 'white',
                  borderBottomLeftRadius: msg.from === 'user' ? '4px' : '18px',
                  borderBottomRightRadius: msg.from === 'bot' ? '4px' : '18px',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  background: `linear-gradient(135deg, #e8a87c, ${PRIMARY})`,
                  padding: '10px 16px', borderRadius: '18px', borderBottomRightRadius: '4px',
                  fontSize: '18px', letterSpacing: '2px', color: 'white',
                }}>
                  <span style={{ animation: 'blink 1s infinite' }}>•••</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* הצעות */}
          <div style={{ padding: '0 12px 8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {suggestions.map(s => (
              <button key={s} onClick={() => sendMessage(s)} style={{
                padding: '5px 10px', borderRadius: '50px', border: `1px solid ${PRIMARY}`,
                background: 'white', color: PRIMARY, fontSize: '12px', cursor: 'pointer',
                fontWeight: '600',
              }}>{s}</button>
            ))}
          </div>

          {/* input */}
          <div style={{
            padding: '12px 16px', borderTop: '2px solid #f0e0cc',
            display: 'flex', gap: '8px',
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="כתבי שאלה..."
              style={{
                flex: 1, padding: '10px 14px', borderRadius: '50px',
                border: '2px solid #e8d5c4', outline: 'none', fontSize: '14px',
                background: '#fdf6f0',
              }}
            />
            <button onClick={() => sendMessage()} style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: `linear-gradient(135deg, #e8a87c, ${PRIMARY})`,
              border: 'none', cursor: 'pointer', fontSize: '18px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(200,98,42,0.3)',
            }}>→</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </>
  );
};

export default ChatBot;
