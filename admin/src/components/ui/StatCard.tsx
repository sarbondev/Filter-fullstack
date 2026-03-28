import { Card } from './Card';
import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
}

const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
  purple: 'bg-purple-50 text-purple-600',
};

export function StatCard({ title, value, icon, trend, color = 'blue' }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          {trend && <p className="mt-1 text-xs text-green-600">{trend}</p>}
        </div>
        <div className={clsx('rounded-xl p-3', colorMap[color])}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
