import { useIMask } from 'react-imask';
import clsx from 'clsx';

interface PhoneInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  value: string;
  onValueChange: (phone: string) => void;
}

export function PhoneInput({ label, error, icon, onValueChange }: PhoneInputProps) {
  const { ref } = useIMask(
    {
      mask: '+{998} (00) 000 00 00',
      lazy: false,
      overwrite: 'shift',
    },
    {
      onAccept: (value) => {
        // value is the full masked string like "+998 (90) 123 45 67"
        // extract only digits from it
        const digits = value.replace(/\D/g, '');
        // always send as +digits
        onValueChange(digits.length > 0 ? '+' + digits : '+998');
      },
    },
  );

  const inputId = label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            {icon}
          </div>
        )}
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          id={inputId}
          type="tel"
          className={clsx(
            'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors',
            'placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
            icon && 'pl-10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          )}
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
