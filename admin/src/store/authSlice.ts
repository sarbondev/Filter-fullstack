import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser } from '@/lib/types';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  notifications: number;
}

const stored = localStorage.getItem('auth');
const parsed = stored ? JSON.parse(stored) as { token: string; user: AuthUser } : null;

const initialState: AuthState = {
  token: parsed?.token ?? null,
  user: parsed?.user ?? null,
  notifications: 0,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; user: AuthUser }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('auth', JSON.stringify(action.payload));
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.notifications = 0;
      localStorage.removeItem('auth');
    },
    updateUser(state, action: PayloadAction<Partial<AuthUser>>) {
      if (state.user) {
        Object.assign(state.user, action.payload);
        localStorage.setItem('auth', JSON.stringify({ token: state.token, user: state.user }));
      }
    },
    incrementNotifications(state) {
      state.notifications += 1;
    },
    clearNotifications(state) {
      state.notifications = 0;
    },
  },
});

export const { setCredentials, updateUser, logout, incrementNotifications, clearNotifications } = authSlice.actions;
export default authSlice.reducer;
