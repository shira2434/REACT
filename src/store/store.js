import { configureStore, createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: JSON.parse(localStorage.getItem('user') || 'null'),
    isLoggedIn: !!localStorage.getItem('user'),
    loading: false
  },
  reducers: {
    loginUser: (state, action) => {
      state.currentUser = action.payload;
      state.isLoggedIn = true;
      state.loading = false;
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.isLoggedIn = false;
      state.loading = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    updateUser: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: JSON.parse(localStorage.getItem('cart') || '[]') },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
    }
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: JSON.parse(localStorage.getItem('wishlist') || '[]') },
  reducers: {
    toggleWishlist: (state, action) => {
      const idx = state.items.findIndex(i => i.id === action.payload.id);
      if (idx !== -1) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('wishlist');
    }
  }
});

const getOrdersForUser = (userId) => {
  const all = JSON.parse(localStorage.getItem('orders') || '{}');
  return all[userId] || [];
};

const saveOrdersForUser = (userId, list) => {
  const all = JSON.parse(localStorage.getItem('orders') || '{}');
  all[userId] = list;
  localStorage.setItem('orders', JSON.stringify(all));
};

const currentUserId = JSON.parse(localStorage.getItem('user') || 'null')?.id;

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { list: currentUserId ? getOrdersForUser(currentUserId) : [] },
  reducers: {
    addOrder: (state, action) => {
      state.list.unshift(action.payload);
      saveOrdersForUser(action.payload.userId, state.list);
    },
    loadOrders: (state, action) => {
      state.list = getOrdersForUser(action.payload);
    },
    clearOrders: (state) => {
      state.list = [];
    }
  }
});

const toastSlice = createSlice({
  name: 'toast',
  initialState: { toasts: [] },
  reducers: {
    addToast: (state, action) => {
      state.toasts.push({
        id: Date.now(),
        type: 'info',
        duration: 3000,
        ...action.payload
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    }
  }
});

export const { loginUser, logoutUser, updateUser, setLoading } = userSlice.actions;
export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export const { addOrder, clearOrders, loadOrders } = ordersSlice.actions;
export const { addToast, removeToast } = toastSlice.actions;

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    cart: cartSlice.reducer,
    wishlist: wishlistSlice.reducer,
    orders: ordersSlice.reducer,
    toast: toastSlice.reducer,
  }
});

export default store;
