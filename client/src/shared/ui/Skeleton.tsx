import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'animate-pulse rounded-xl bg-slate-200',
        className,
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
