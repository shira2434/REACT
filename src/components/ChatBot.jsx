import { useState, useRef, useEffect } from 'react';

const PRIMARY = '#c8622a';

const faqs = [
  // ברכות
  { keywords: ['שלום', 'היי', 'הי', 'בוקר טוב', 'ערב טוב', 'צהריים'], answer: 'שלום! ברוך הבא ללה קוצ\'ינה 👋 איך אוכל לעזור לך היום?' },
  { keywords: ['מה שלומך', 'מה נשמע', 'איך אתה'], answer: 'מצוין תודה! מוכן לעזור לך עם כל שאלה 😊' },

  // שעות ומיקום
  { keywords: ['שעות', 'פתוח', 'סגור', 'מתי פתוח', 'שעות פתיחה'], answer: 'אנחנו פתוחים:\nראשון-חמישי: 08:00-22:00\nשישי: 08:00-15:00\nשבת: סגור ☕' },
  { keywords: ['כתובת', 'איפה', 'מיקום', 'נמצאים', 'איך מגיעים'], answer: 'אנחנו ממוקמים בתל אביב 📍 לפרטי הכתובת המדויקת צרי קשר בטלפון.' },
  { keywords: ['חניה', 'לחנות', 'פארקינג'], answer: 'יש חניה ציבורית בסמוך למסעדה 🚗' },

  // משלוח
  { keywords: ['משלוח', 'מביאים', 'לבית', 'דליברי', 'שליח'], answer: 'כן! אנחנו מספקים משלוחים לכל הארץ 🚚\nזמן משלוח: עד 48 שעות\nמשלוח חינם על הזמנה מעל ₪500!' },
  { keywords: ['זמן משלוח', 'כמה זמן', 'מתי יגיע'], answer: 'זמן המשלוח הוא עד 48 שעות מרגע אישור ההזמנה 📦' },
  { keywords: ['מינימום הזמנה', 'מינימום'], answer: 'אין מינימום הזמנה! אבל על הזמנה מעל ₪500 המשלוח חינם 🎁' },

  // מחירים
  { keywords: ['מחיר', 'עולה', 'כמה עולה', 'תשלום', 'עלות', 'תמחור'], answer: 'המחירים שלנו:\n☕ שתייה: מ-₪14\n🥗 סלטים: מ-₪38\n🍕 פיצות: מ-₪68\n🍝 פסטות: מ-₪54\n🍣 סושי: מ-₪46\n🍰 קינוחים: מ-₪28' },
  { keywords: ['הנחה', 'קופון', 'מבצע', 'הטבה'], answer: 'יש לנו מבצעים עונתיים! עקבי אחרינו לעדכונים 🎉 משלוח חינם על הזמנה מעל ₪500.' },

  // כשרות ואלרגיות
  { keywords: ['חלבי', 'גלאט', 'כשר', 'כשרות', 'תעודת כשרות'], answer: 'כן! אנחנו מסעדה חלבית כשרה למהדרין 🧀✨\nיש לנו תעודת כשרות מהדרין.' },
  { keywords: ['אלרגיה', 'אלרגן', 'גלוטן', 'לקטוז', 'אגוזים'], answer: 'אנחנו מסעדה חלבית — רוב המנות מכילות מוצרי חלב.\nלשאלות על אלרגנים ספציפיים אנא צרי קשר ישירות עם הצוות שלנו 🌿' },
  { keywords: ['טבעוני', 'וגן', 'צמחוני'], answer: 'יש לנו מגוון מנות צמחוניות! 🌱 חלק מהמנות ניתנות להתאמה. צרי קשר לפרטים.' },

  // תפריט - קטגוריות
  { keywords: ['תפריט', 'מה יש', 'מה אתם מגישים', 'קטגוריות'], answer: 'התפריט שלנו כולל:\n🥗 סלטים\n🍕 פיצות\n🥙 כריכים ולחמים\n🍝 פסטות\n🧀 מנות גבינות\n🥞 בוקר ובראנץ\'\n🍰 קינוחים\n🥤 שתייה\n🍣 סושי\n\nלחצי על "צפה בכל התפריט" לפרטים!' },
  { keywords: ['פיצה', 'פיצות'], answer: 'יש לנו 8 סוגי פיצות מדהימות! 🍕\n• מרגריטה (₪68)\n• 4 גבינות (₪78)\n• פסטו ושמש (₪74)\n• ירקות צלויים (₪72)\n• ברוקולי ושום (₪70)\n• ביצה ותרד (₪74)\n• זיתים ובצל (₪70)\n• תירס (₪68)' },
  { keywords: ['פסטה', 'פסטות', 'קרבונרה', 'פסטו', 'לזניה', 'ניוקי'], answer: 'הפסטות שלנו 🍝\n• קרבונרה (₪62)\n• פסטו (₪58)\n• ארבע גבינות (₪66)\n• לזניה ירקות (₪72)\n• פומודורו (₪54)\n• ניוקי גורגונזולה (₪68)\n• רוזה (₪60)\n• פטריות (₪62)' },
  { keywords: ['סושי', 'מאקי', 'סשימי', 'נגירי', 'רולים'], answer: 'הסושי שלנו 🍣\n• סשי מיקס 8 יח\' (₪58)\n• רולים קליפורניה (₪52)\n• סשימי סלמון (₪48)\n• מאקי טונה (₪46)\n• נגירי סלמון (₪54)\n• פלטה משפחתית 40 יח\' (₪120)' },
  { keywords: ['סלט', 'סלטים', 'קפרזה', 'יווני', 'ניסואז'], answer: 'הסלטים שלנו 🥗\n• קפרזה (₪48)\n• יווני (₪42)\n• ספינץ\' ואגוזים (₪46)\n• פסטה צבעוני (₪44)\n• ניסואז (₪52)\n• קינואה ירקות (₪50)\n• טבולה (₪40)\n• חומוס מסבחה (₪38)' },
  { keywords: ['קינוח', 'קינוחים', 'מתוק', 'עוגה', 'טירמיסו', 'גלידה', 'ג\'לטו'], answer: 'הקינוחים שלנו 🍰\n• טירמיסו (₪38)\n• פנה קוטה (₪34)\n• קנולי סיציליאני (₪28)\n• עוגת גבינה ניו יורק (₪42)\n• ג\'לטו 3 כדורים (₪32)\n• בראוניז שוקולד (₪30)\n• מוס שוקולד לבן (₪36)\n• עוגת שוקולד (₪36)\n• סופלה שוקולד (₪38)' },
  { keywords: ['קפה', 'אספרסו', 'לאטה', 'קפוצינו', 'שתייה', 'משקה'], answer: 'השתייה שלנו ☕\n• אספרסו (₪14)\n• לאטה (₪18)\n• קפוצ\'ינו (₪17)\n• שייק תות וניל (₪26)\n• לימונדה ביתית (₪18)\n• תה צמחים (₪14)\n• סמוזי ירוק (₪28)\n• הוט צ\'וקולט (₪20)\n• מוחיטו ורוד (₪24)\n• מיץ תפוזים (₪20)\n• אייס תה אפרסק (₪18)' },
  { keywords: ['בוקר', 'ברנץ', 'בראנץ', 'שקשוקה', 'פנקייק', 'וופל', 'אבוקדו'], answer: 'ארוחות הבוקר שלנו 🥞\n• ארוחת בוקר מלאה (₪58)\n• פנקייק אמריקאי (₪48)\n• וופל בלגי (₪44)\n• שקשוקה גבינות (₪52)\n• אבוקדו טוסט (₪46)\n• גרנולה יוגורט (₪36)\n• בייגל ירושלמי (₪18)\n• שקשוקה קלאסית (₪48)' },
  { keywords: ['גבינה', 'גבינות', 'בורקס', 'קיש', 'פונדו', 'ריקוטה'], answer: 'מנות הגבינות שלנו 🧀\n• מגש גבינות איטלקי (₪95)\n• בורקס גבינה (₪28)\n• קיש לורן (₪55)\n• ריקוטה עם דבש (₪38)\n• פונדו גבינות (₪88)\n• פלטת גבינות קטנה (₪72)\n• אצבעות גבינה מטוגנות (₪44)' },
  { keywords: ['כריך', 'לחם', 'פוקצה', 'טוסט'], answer: 'הכריכים והלחמים שלנו 🥙\n• כריך בריאות (₪38)\n• פוקצ\'ה איטלקית (₪32)\n• כריך קפרזה חם (₪42)\n• לחם שום חמאה (₪24)\n• כריך טונה מלט (₪36)\n• טוסט גבינות (₪30)\n• כריך חביתה (₪34)' },

  // הזמנות
  { keywords: ['הזמנה', 'להזמין', 'איך מזמינים', 'תהליך הזמנה'], answer: 'להזמנה:\n1️⃣ בחרי מוצרים מהתפריט\n2️⃣ הוסיפי לסל 🛒\n3️⃣ לחצי על סל הקניות\n4️⃣ מלאי פרטי משלוח\n5️⃣ שלמי בכרטיס אשראי\n✅ תקבלי אישור במייל!' },
  { keywords: ['ביטול', 'לבטל', 'החזר', 'ביטול הזמנה'], answer: 'לביטול הזמנה:\n• ניתן לבטל עד 24 שעות לפני האירוע\n• צרי קשר בהקדם האפשרי\n• ההחזר יינתן תוך 3-5 ימי עסקים 💳' },
  { keywords: ['תשלום', 'אשראי', 'ויזה', 'מאסטרקארד', 'ביט', 'פייפל'], answer: 'אנחנו מקבלים:\n💳 כרטיסי אשראי (ויזה, מאסטרקארד)\n📱 ביט\n💻 פייפל\nהתשלום מאובטח ומוצפן 🔒' },
  { keywords: ['חשבונית', 'קבלה', 'אישור'], answer: 'אישור הזמנה וחשבונית ישלחו אוטומטית למייל שלך לאחר התשלום 📧' },

  // קייטרינג ואירועים
  { keywords: ['קייטרינג', 'אירוע', 'חתונה', 'בר מצווה', 'מסיבה', 'אירועים'], answer: 'אנחנו מתמחים בקייטרינג חלבי לאירועים! 🎉\n• חתונות\n• בר/בת מצווה\n• אירועי חברה\n• ימי הולדת\n\nצרי קשר לקבלת הצעת מחיר מותאמת אישית 📞' },
  { keywords: ['כמה אנשים', 'כמות', 'מינימום אנשים'], answer: 'אנחנו מתאימים לאירועים מכל גודל! מ-10 אנשים ועד מאות אורחים 🎊 צרי קשר לפרטים.' },

  // התאמה אישית
  { keywords: ['התאמה אישית', 'לשנות', 'בלי', 'להוסיף', 'מותאם'], answer: 'כן! ניתן להתאים אישית מנות רבות 🎨\nבעמוד המוצר לחצי על "התאם אישית" לבחירת:\n• סוג פסטה/רוטב/גבינה\n• תוספות לפיצה\n• מילויים לסושי\n• רוטב לסלט' },

  // פופולרי
  { keywords: ['פופולרי', 'מומלץ', 'הכי טוב', 'מה להזמין', 'המלצה'], answer: 'המנות הכי פופולריות שלנו 🔥\n1. גלידת ג\'לטו (280 הזמנות!)\n2. קפה אספרסו (450 הזמנות!)\n3. עוגת גבינה ניו יורק\n4. פיצה מרגריטה\n5. טירמיסו\n\nכולן מדהימות! 😍' },
  { keywords: ['חדש', 'חדשות', 'מה חדש'], answer: 'הכי חדש אצלנו 🆕\n🍣 קטגוריית סושי חדשה!\n🎨 אפשרות התאמה אישית למנות\n🚚 משלוח חינם מעל ₪500' },

  // יצירת קשר
  { keywords: ['טלפון', 'ליצור קשר', 'צור קשר', 'מספר', 'איש קשר'], answer: 'ניתן ליצור קשר:\n📧 דוא"ל דרך האתר\n💬 בצ\'אט הזה\nנשמח לעזור! 😊' },

  // סיום
  { keywords: ['תודה', 'תודה רבה', 'תנקיו', 'אחלה', 'מעולה'], answer: 'בשמחה! 😊 אם יש עוד שאלות אני כאן תמיד.' },
  { keywords: ['ביי', 'להתראות', 'שלום', 'יום טוב'], answer: 'להתראות! מקווים לראותך בקרוב 👋☕\nתהיה לך ארוחה מעולה!' },
];

const getAnswer = (input) => {
  const lower = input.toLowerCase();
  for (const faq of faqs) {
    if (faq.keywords.some(k => lower.includes(k.toLowerCase()))) {
      return faq.answer;
    }
  }
  return 'מצטערת, לא הבנתי את השאלה 😅\nנסי לשאול על:\n• תפריט ומחירים\n• שעות פתיחה\n• משלוח\n• כשרות ואלרגיות\n• הזמנות וביטולים\n• קייטרינג לאירועים';
};

const suggestions = ['מה יש בתפריט?', 'שעות פתיחה', 'יש משלוח?', 'מה פופולרי?', 'קייטרינג לאירוע'];

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'שלום! אני הבוט של לה קוצ\'ינה ☕\nאיך אוכל לעזור לך היום?' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (!open && messages.length > 1) setUnread(u => u + 1);
  }, [messages]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text: msg, time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: 'bot', text: getAnswer(msg), time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) }]);
    }, 800);
  };

  return (
    <>
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
        {!open && unread > 0 && (
          <span style={{
            position: 'absolute', top: '-4px', right: '-4px',
            background: '#ef4444', color: 'white', borderRadius: '50%',
            width: '20px', height: '20px', fontSize: '11px', fontWeight: '700',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{unread}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: '100px', left: '28px', zIndex: 1000,
          width: '360px', height: '520px', background: 'white',
          borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          border: '2px solid #f0e0cc', animation: 'slideUp 0.25s ease',
        }}>
          <div style={{
            background: `linear-gradient(135deg, #3b1a08, ${PRIMARY})`,
            padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '22px',
              border: '2px solid rgba(255,255,255,0.3)',
            }}>☕</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'white', fontWeight: '700', fontSize: '15px' }}>בוט לה קוצ'ינה</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                מחובר • עונה מיד
              </div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.from === 'user' ? 'flex-start' : 'flex-end' }}>
                <div style={{
                  maxWidth: '85%', padding: '10px 14px', borderRadius: '18px',
                  fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-line',
                  background: msg.from === 'user' ? '#f0e0cc' : `linear-gradient(135deg, #e8a87c, ${PRIMARY})`,
                  color: msg.from === 'user' ? '#3b1a08' : 'white',
                  borderBottomLeftRadius: msg.from === 'user' ? '4px' : '18px',
                  borderBottomRightRadius: msg.from === 'bot' ? '4px' : '18px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}>
                  {msg.text}
                </div>
                {msg.time && (
                  <span style={{ fontSize: '11px', color: '#9ca3af', marginTop: '3px', paddingRight: '4px', paddingLeft: '4px' }}>
                    {msg.time}
                  </span>
                )}
              </div>
            ))}
            {typing && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  background: `linear-gradient(135deg, #e8a87c, ${PRIMARY})`,
                  padding: '10px 16px', borderRadius: '18px', borderBottomRightRadius: '4px',
                  color: 'white', fontSize: '16px', letterSpacing: '3px',
                }}>
                  <span style={{ animation: 'blink 1s infinite' }}>•••</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: '8px 12px', display: 'flex', gap: '6px', flexWrap: 'wrap', borderTop: '1px solid #f0e0cc' }}>
            {suggestions.map(s => (
              <button key={s} onClick={() => sendMessage(s)} style={{
                padding: '5px 10px', borderRadius: '50px', border: `1px solid ${PRIMARY}`,
                background: 'white', color: PRIMARY, fontSize: '12px', cursor: 'pointer', fontWeight: '600',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.target.style.background = PRIMARY; e.target.style.color = 'white'; }}
                onMouseLeave={e => { e.target.style.background = 'white'; e.target.style.color = PRIMARY; }}
              >{s}</button>
            ))}
          </div>

          <div style={{ padding: '12px 16px', borderTop: '2px solid #f0e0cc', display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="כתבי שאלה..."
              style={{
                flex: 1, padding: '10px 14px', borderRadius: '50px',
                border: '2px solid #e8d5c4', outline: 'none', fontSize: '14px',
                background: '#fdf6f0', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = PRIMARY}
              onBlur={e => e.target.style.borderColor = '#e8d5c4'}
            />
            <button onClick={() => sendMessage()} style={{
              width: '42px', height: '42px', borderRadius: '50%',
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
