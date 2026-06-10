// NOTE: Scaffolded by setup. Exposes state.auth.isLoggedIn used by AppNavigator.
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: state => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
