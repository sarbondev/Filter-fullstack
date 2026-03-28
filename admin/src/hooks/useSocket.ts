import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from './store';
import { incrementNotifications } from '@/store/authSlice';
import { baseApi } from '@/store/api/baseApi';

export function useSocket() {
  const token = useAppSelector((s) => s.auth.token);
  const dispatch = useAppDispatch();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket = io('/', { auth: { token } });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('order:new', () => {
      dispatch(incrementNotifications());
      dispatch(baseApi.util.invalidateTags(['Order', 'Dashboard']));
    });

    socket.on('order:statusUpdated', () => {
      dispatch(baseApi.util.invalidateTags(['Order', 'Dashboard']));
    });

    socket.on('order:paymentUpdated', () => {
      dispatch(baseApi.util.invalidateTags(['Order', 'Dashboard']));
    });

    return () => {
      socket.disconnect();
    };
  }, [token, dispatch]);

  return socketRef;
}
