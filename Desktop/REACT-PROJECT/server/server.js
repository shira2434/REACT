const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'db.json');

const readData = () => {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const data = readData();
  
  const user = data.users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } else {
    res.status(401).json({ success: false, message: 'אימייל או סיסמה שגויים' });
  }
});

app.post('/api/register', (req, res) => {
  const { firstName, lastName, email, password, phone, address } = req.body;
  const data = readData();
  
  if (data.users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'משתמש עם אימייל זה כבר קיים' });
  }
  
  const newUser = {
    id: Math.max(...data.users.map(u => u.id)) + 1,
    firstName,
    lastName,
    email,
    password,
    phone,
    address,
    isAdmin: false
  };
  
  data.users.push(newUser);
  writeData(data);
  
  res.json({ success: true, message: 'הרשמה הושלמה בהצלחה' });
});

app.get('/api/products', (req, res) => {
  const { search, category, page = 1, limit = 20 } = req.query;
  const data = readData();
  let products = data.products;
  
  if (search) {
    products = products.filter(p => 
      p.name.includes(search) || 
      p.description.includes(search)
    );
  }
  
  if (category) {
    products = products.filter(p => p.category === category);
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = products.slice(startIndex, endIndex);
  
  res.json({
    products: paginatedProducts,
    total: products.length,
    hasMore: endIndex < products.length
  });
});

app.get('/api/products/:id', (req, res) => {
  const data = readData();
  const product = data.products.find(p => p.id === parseInt(req.params.id));
  
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'מוצר לא נמצא' });
  }
});

app.post('/api/products', (req, res) => {
  const data = readData();
  const newProduct = {
    id: Math.max(...data.products.map(p => p.id)) + 1,
    ...req.body
  };
  
  data.products.push(newProduct);
  writeData(data);
  
  res.json({ success: true, product: newProduct });
});

app.delete('/api/products/:id', (req, res) => {
  const data = readData();
  const productIndex = data.products.findIndex(p => p.id === parseInt(req.params.id));
  
  if (productIndex !== -1) {
    data.products.splice(productIndex, 1);
    writeData(data);
    res.json({ success: true });
  } else {
    res.status(404).json({ message: 'מוצר לא נמצא' });
  }
});

app.get('/api/products/:id/reviews', (req, res) => {
  const data = readData();
  const reviews = data.reviews
    .filter(r => r.productId === parseInt(req.params.id))
    .map(review => {
      const user = data.users.find(u => u.id === review.userId);
      return {
        ...review,
        userName: user ? `${user.firstName} ${user.lastName}` : 'משתמש לא ידוע'
      };
    });
  
  res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
  const data = readData();
  const newReview = {
    id: Math.max(...data.reviews.map(r => r.id), 0) + 1,
    ...req.body,
    date: new Date().toISOString().split('T')[0]
  };
  
  data.reviews.push(newReview);
  
  const product = data.products.find(p => p.id === newReview.productId);
  if (product) {
    product.sold = (product.sold || 0) + 1;
  }
  
  writeData(data);
  
  res.json({ success: true, review: newReview });
});

app.delete('/api/reviews/:id', (req, res) => {
  const data = readData();
  const reviewIndex = data.reviews.findIndex(r => r.id === parseInt(req.params.id));
  
  if (reviewIndex !== -1) {
    data.reviews.splice(reviewIndex, 1);
    writeData(data);
    res.json({ success: true });
  } else {
    res.status(404).json({ message: 'חוות דעת לא נמצאה' });
  }
});

app.put('/api/users/:id', (req, res) => {
  const data = readData();
  const userIndex = data.users.findIndex(u => u.id === parseInt(req.params.id));
  
  if (userIndex !== -1) {
    data.users[userIndex] = { ...data.users[userIndex], ...req.body };
    writeData(data);
    
    const { password: _, ...userWithoutPassword } = data.users[userIndex];
    res.json({ success: true, user: userWithoutPassword });
  } else {
    res.status(404).json({ message: 'משתמש לא נמצא' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});