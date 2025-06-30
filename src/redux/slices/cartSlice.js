import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Thunks for backend cart API
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/api/cart`, { withCredentials: true });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity = 1 }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/api/cart`, { productId, quantity }, { withCredentials: true });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add to cart');
  }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${API_URL}/api/cart`, { productId, quantity }, { withCredentials: true });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update cart item');
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId, { rejectWithValue }) => {
  try {
    const res = await axios.delete(`${API_URL}/api/cart`, { data: { productId }, withCredentials: true });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to remove from cart');
  }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.delete(`${API_URL}/api/cart/clear`, { withCredentials: true });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to clear cart');
  }
});

const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.total = action.payload.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = action.payload.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = action.payload.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = action.payload.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = 0;
      });
  },
});

export default cartSlice.reducer; 