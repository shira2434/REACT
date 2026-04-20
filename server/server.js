const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'coffee-shop-secret-key-2024';

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'db.json');
const readData = () => JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const writeData = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// JWT middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'אין הרשאה' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'טוקן לא תקין' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user?.isAdmin) return res.status(403).json({ message: 'אין הרשאת מנהל' });
  next();
};

// ── Auth ──────────────────────────────────────────────────────────────────────

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const data = readData();
  const user = data.users.find(u => u.email === email);
  if (!user) return res.status(401).json({ success: false, message: 'אימייל או סיסמה שגויים' });

  const isValid = user.password.startsWith('$2')
    ? await bcrypt.compare(password, user.password)
    : password === user.password; // תמיכה בסיסמאות ישנות

  if (!isValid) return res.status(401).json({ success: false, message: 'אימייל או סיסמה שגויים' });

  const { password: _, ...userWithoutPassword } = user;
  const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, user: userWithoutPassword, token });
});

app.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, password, phone, address } = req.body;
  const data = readData();

  if (data.users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'משתמש עם אימייל זה כבר קיים' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Math.max(...data.users.map(u => u.id)) + 1,
    firstName, lastName, email,
    password: hashedPassword,
    phone, address, isAdmin: false
  };

  data.users.push(newUser);
  writeData(data);
  res.json({ success: true, message: 'הרשמה הושלמה בהצלחה' });
});

// ── Products ──────────────────────────────────────────────────────────────────

app.get('/api/products', authMiddleware, (req, res) => {
  const { search, category, page = 1, limit = 20 } = req.query;
  const data = readData();
  let products = data.products;

  if (search) products = products.filter(p => p.name.includes(search) || p.description.includes(search));
  if (category) products = products.filter(p => p.category === category);

  const startIndex = (page - 1) * limit;
  const paginatedProducts = products.slice(startIndex, startIndex + parseInt(limit));

  res.json({ products: paginatedProducts, total: products.length, hasMore: startIndex + parseInt(limit) < products.length });
});

app.get('/api/products/:id', authMiddleware, (req, res) => {
  const data = readData();
  const product = data.products.find(p => p.id === parseInt(req.params.id));
  product ? res.json(product) : res.status(404).json({ message: 'מוצר לא נמצא' });
});

app.post('/api/products', authMiddleware, adminMiddleware, (req, res) => {
  const data = readData();
  const newProduct = { id: Math.max(...data.products.map(p => p.id)) + 1, ...req.body };
  data.products.push(newProduct);
  writeData(data);
  res.json({ success: true, product: newProduct });
});

app.delete('/api/products/:id', authMiddleware, adminMiddleware, (req, res) => {
  const data = readData();
  const idx = data.products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'מוצר לא נמצא' });
  data.products.splice(idx, 1);
  writeData(data);
  res.json({ success: true });
});

// ── Reviews ───────────────────────────────────────────────────────────────────

app.get('/api/products/:id/reviews', authMiddleware, (req, res) => {
  const data = readData();
  const reviews = data.reviews
    .filter(r => r.productId === parseInt(req.params.id))
    .map(review => {
      const user = data.users.find(u => u.id === review.userId);
      return { ...review, userName: user ? `${user.firstName} ${user.lastName}` : 'משתמש לא ידוע' };
    });
  res.json(reviews);
});

app.post('/api/reviews', authMiddleware, (req, res) => {
  const data = readData();
  const newReview = {
    id: Math.max(...data.reviews.map(r => r.id), 0) + 1,
    ...req.body,
    date: new Date().toISOString().split('T')[0]
  };
  data.reviews.push(newReview);
  const product = data.products.find(p => p.id === newReview.productId);
  if (product) product.sold = (product.sold || 0) + 1;
  writeData(data);
  res.json({ success: true, review: newReview });
});

app.delete('/api/reviews/:id', authMiddleware, (req, res) => {
  const data = readData();
  const idx = data.reviews.findIndex(r => r.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'חוות דעת לא נמצאה' });

  // רק הבעלים יכול למחוק
  if (data.reviews[idx].userId !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ message: 'אין הרשאה' });
  }

  data.reviews.splice(idx, 1);
  writeData(data);
  res.json({ success: true });
});

// ── Users ─────────────────────────────────────────────────────────────────────

app.put('/api/users/:id', authMiddleware, async (req, res) => {
  if (req.user.id !== parseInt(req.params.id)) {
    return res.status(403).json({ message: 'אין הרשאה לעדכן משתמש אחר' });
  }

  const data = readData();
  const idx = data.users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'משתמש לא נמצא' });

  const { password, ...updates } = req.body;
  data.users[idx] = { ...data.users[idx], ...updates };
  writeData(data);

  const { password: _, ...userWithoutPassword } = data.users[idx];
  res.json({ success: true, user: userWithoutPassword });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
