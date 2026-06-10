// NOTE: Scaffolded by setup. Replace/extend with your real store if you have one.
import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import favReducer from './slices/favSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    cart: cartReducer,
    favourites: favReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
