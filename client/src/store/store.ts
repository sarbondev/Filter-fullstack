import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import toastReducer from './toastSlice';
import authReducer from './authSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      cart: cartReducer,
      wishlist: wishlistReducer,
      toast: toastReducer,
      auth: authReducer,
    },
    middleware: (getDefault) => getDefault().concat(baseApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
