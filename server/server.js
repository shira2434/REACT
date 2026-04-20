const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID;
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;

const readOrders = async () => {
  try {
    const res = await axios.get(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
      headers: { 'X-Master-Key': JSONBIN_API_KEY }
    });
    return res.data.record.orders || [];
  } catch { return []; }
};

const writeOrders = async (orders) => {
  await axios.put(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, { orders }, {
    headers: { 'X-Master-Key': JSONBIN_API_KEY, 'Content-Type': 'application/json' }
  });
};

const app = express();

// הגדרת פורט דינמי עבור Render
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'coffee-shop-secret-key-2024';

// הגדרות CORS מעודכנות לחיבור עם Vercel
app.use(cors({
  origin: [
    'https://shira-fullstack-project.vercel.app', 
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// נתיב לקובץ הנתונים - ודאי שהקובץ db.json נמצא בתיקייה הראשית ב-GitHub
const dbPath = path.join(__dirname, 'db.json');

const readData = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading db.json:", err);
    return { users: [], products: [], reviews: [] };
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing to db.json:", err);
  }
};

// ── Middlewares ──────────────────────────────────────────────────────────────

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
    : password === user.password;

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
    id: data.users.length > 0 ? Math.max(...data.users.map(u => u.id)) + 1 : 1,
    firstName, lastName, email,
    password: hashedPassword,
    phone, address, isAdmin: false
  };

  data.users.push(newUser);
  writeData(data);
  res.json({ success: true, message: 'הרשמה הושלמה בהצלחה' });
});

// ── Products ──────────────────────────────────────────────────────────────────

app.get('/api/products', (req, res) => {
  const { search, category, page = 1, limit = 20 } = req.query;
  const data = readData();
  let products = data.products || [];

  if (search) {
    const s = search.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(s) || 
      p.description.toLowerCase().includes(s)
    );
  }
  if (category) products = products.filter(p => p.category === category);

  const startIndex = (page - 1) * limit;
  const paginatedProducts = products.slice(startIndex, startIndex + parseInt(limit));

  res.json({ 
    products: paginatedProducts, 
    total: products.length, 
    hasMore: startIndex + parseInt(limit) < products.length 
  });
});

app.get('/api/products/:id', (req, res) => {
  const data = readData();
  const product = data.products.find(p => p.id === parseInt(req.params.id));
  product ? res.json(product) : res.status(404).json({ message: 'מוצר לא נמצא' });
});

app.post('/api/products', authMiddleware, adminMiddleware, (req, res) => {
  const data = readData();
  const newProduct = { 
    id: data.products.length > 0 ? Math.max(...data.products.map(p => p.id)) + 1 : 1, 
    ...req.body 
  };
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

app.get('/api/products/:id/reviews', (req, res) => {
  const data = readData();
  const reviews = (data.reviews || [])
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
    id: (data.reviews || []).length > 0 ? Math.max(...data.reviews.map(r => r.id)) + 1 : 1,
    ...req.body,
    date: new Date().toISOString().split('T')[0]
  };
  if(!data.reviews) data.reviews = [];
  data.reviews.push(newReview);
  
  const product = data.products.find(p => p.id === newReview.productId);
  if (product) product.sold = (product.sold || 0) + 1;
  
  writeData(data);
  res.json({ success: true, review: newReview });
});

// ── Orders ───────────────────────────────────────────────────────────────────

app.get('/api/orders', authMiddleware, async (req, res) => {
  const orders = await readOrders();
  res.json(orders.filter(o => o.userId === req.user.id));
});

app.post('/api/orders', authMiddleware, async (req, res) => {
  const orders = await readOrders();
  const newOrder = { ...req.body, userId: req.user.id };
  orders.unshift(newOrder);
  await writeOrders(orders);
  res.json({ success: true, order: newOrder });
});

// ── Server Start ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});