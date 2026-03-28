import type { HTMLAttributes } from 'react';
import clsx from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: boolean;
}

export function Card({ children, className, padding = true, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-slate-200 bg-white shadow-sm',
        padding && 'p-6',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('mb-4 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={clsx('text-lg font-semibold text-slate-900', className)} {...props}>
      {children}
    </h3>
  );
}
