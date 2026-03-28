'use client';

import { useIMask } from 'react-imask';
import clsx from 'clsx';

interface PhoneInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  value: string;
  onValueChange: (phone: string) => void;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function PhoneInput({ label, error, icon, value, onValueChange, className }: PhoneInputProps) {
  const { ref } = useIMask(
    {
      mask: '+{998} (00) 000 00 00',
      lazy: false,
      overwrite: 'shift',
    },
    {
      onAccept: (maskedValue) => {
        const digits = maskedValue.replace(/\D/g, '');
        onValueChange(digits.length > 0 ? '+' + digits : '+998');
      },
    },
  );

  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            {icon}
          </div>
        )}
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          type="tel"
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
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
