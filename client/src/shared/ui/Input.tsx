'use client';

import { forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, error, className, ...props }, ref) => (
    <div className="relative">
      {icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
          {icon}
        </div>
      )}
      <input
        ref={ref}
        className={clsx(
          'w-full rounded-xl border bg-white px-4 py-3 text-sm',
          'text-slate-900 placeholder:text-slate-400',
          'border-slate-200',
          'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
          'transition-all duration-200',
          icon && 'pl-11',
          error && 'border-red-500 focus:ring-red-500/20',
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  ),
);
Input.displayName = 'Input';
