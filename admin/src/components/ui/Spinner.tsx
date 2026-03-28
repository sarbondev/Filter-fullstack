import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className={clsx('animate-spin text-blue-600', sizeMap[size], className)} />
    </div>
  );
}
