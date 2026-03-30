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
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
          {icon}
        </div>
      )}
      <input
        ref={ref}
        className={clsx(
          'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm',
          'text-slate-900 placeholder:text-slate-400',
          'border-slate-200',
          'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15',
          'transition-colors duration-150',
          icon && 'pl-10',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-500/15',
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  ),
);
Input.displayName = 'Input';
