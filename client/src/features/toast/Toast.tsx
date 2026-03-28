'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/shared/hooks';
import { removeToast } from '@/store/toastSlice';

const icons = {
  success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
};

export function ToastContainer() {
  const toasts = useAppSelector((s) => s.toast.toasts);
  const dispatch = useAppDispatch();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} id={toast.id} message={toast.message} type={toast.type} onDismiss={() => dispatch(removeToast(toast.id))} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ id, message, type, onDismiss }: { id: string; message: string; type: 'success' | 'error' | 'info'; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-lg border border-slate-200 min-w-[300px]"
    >
      {icons[type]}
      <p className="flex-1 text-sm font-medium text-slate-900">{message}</p>
      <button onClick={onDismiss} className="text-slate-400 hover:text-slate-600">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
