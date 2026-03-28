import clsx from 'clsx';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'primary' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-600',
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  danger: 'bg-red-50 text-red-600',
  primary: 'bg-primary/10 text-primary',
  info: 'bg-blue-50 text-blue-600',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', variantStyles[variant], className)}>
      {children}
    </span>
  );
}
