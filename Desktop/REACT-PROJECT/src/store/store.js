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

export const { loginUser, logoutUser, updateUser, setLoading } = userSlice.actions;

const store = configureStore({
  reducer: {
    user: userSlice.reducer
  }
});

export default store;