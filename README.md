# ☕ Coffee Shop

קישור לאתר:https://shira-fullstack-project.vercel.app/login
אפליקציית חנות קפה מלאה עם צד לקוח ב-React וצד שרת ב-Node.js/Express.

---

## 🛠️ טכנולוגיות

**Frontend**
- React 19, React Router, Redux Toolkit
- Formik + Yup (טפסים ואימות)
- Tailwind CSS + SCSS
- Axios

**Backend**
- Node.js + Express
- db.json (מסד נתונים מקומי)

---

## 📁 מבנה הפרויקט

```
├── src/
│   ├── api/          # קריאות API
│   ├── auth/         # התחברות והרשמה
│   ├── cart/         # עגלת קניות ותשלום
│   ├── components/   # קומפוננטות משותפות
│   ├── layout/       # Navbar
│   ├── products/     # רשימת מוצרים, פרטים, הוספה
│   ├── profile/      # פרופיל משתמש
│   ├── reviews/      # ביקורות
│   ├── routes/       # ניתוב
│   └── store/        # Redux store
└── server/           # שרת Express
```

---

## 🚀 הפעלה

### 1. התקנת תלויות

```bash
# Frontend
npm install

# Backend
cd server
npm install
```

### 2. הפעלת השרת

```bash
cd server
npm run dev
```

> השרת רץ על `http://localhost:3000`

### 3. הפעלת הלקוח

```bash
npm run dev
```

> האפליקציה רצה על `http://localhost:5173`

---

## ✨ פיצ'רים

- הרשמה והתחברות משתמשים
- צפייה ברשימת מוצרים
- הוספת מוצרים לעגלה ותשלום
- הוספת ביקורות
- ניהול פרופיל אישי
