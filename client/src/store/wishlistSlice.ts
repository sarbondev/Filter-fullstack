import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface WishlistState {
  ids: string[];
}

function loadWishlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function saveWishlist(ids: string[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('wishlist', JSON.stringify(ids));
  }
}

const initialState: WishlistState = { ids: [] };

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    initWishlist(state) {
      state.ids = loadWishlist();
    },
    toggleWishlist(state, action: PayloadAction<string>) {
      const idx = state.ids.indexOf(action.payload);
      if (idx >= 0) {
        state.ids.splice(idx, 1);
      } else {
        state.ids.push(action.payload);
      }
      saveWishlist(state.ids);
    },
  },
});

export const { initWishlist, toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
