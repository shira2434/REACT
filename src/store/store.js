import { configureStore, createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    isLoggedIn: false,
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

export const { loginUser, logoutUser, updateUser, setLoading } = userSlice.actions;
export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    cart: cartSlice.reducer
  }
});

export default store;