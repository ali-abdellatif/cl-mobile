// NOTE: Scaffolded by setup. Exposes state.favourites.items used across the Main app.
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FavItem {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
}

interface FavState {
  items: FavItem[];
}

const initialState: FavState = {
  items: [],
};

const favSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    toggleFav: (state, action: PayloadAction<FavItem>) => {
      const idx = state.items.findIndex(i => i.id === action.payload.id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(action.payload);
      }
    },
    clearFavs: state => {
      state.items = [];
    },
  },
});

export const { toggleFav, clearFavs } = favSlice.actions;
export default favSlice.reducer;
