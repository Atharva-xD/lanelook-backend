import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Thunks for backend wishlist API
export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/api/wishlist`, { withCredentials: true });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch wishlist');
  }
});

export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async ({ productId }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/api/wishlist`, { productId }, { withCredentials: true });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add to wishlist');
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async (productId, { rejectWithValue }) => {
  try {
    const res = await axios.delete(`${API_URL}/api/wishlist`, { data: { productId }, withCredentials: true });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to remove from wishlist');
  }
});

export const clearWishlist = createAsyncThunk('wishlist/clearWishlist', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.delete(`${API_URL}/api/wishlist/clear`, { withCredentials: true });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to clear wishlist');
  }
});

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(clearWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { clearError } = wishlistSlice.actions;
export default wishlistSlice.reducer; 