import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  color?: 'blue' | 'green' | 'red' | 'yellow';
}

const colorMap = {
  blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
  green: 'bg-green-50 dark:bg-green-900/20 text-green-600',
  red: 'bg-red-50 dark:bg-red-900/20 text-red-600',
  yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600',
};

export default function StatCard({ title, value, icon: Icon, trend, color = 'blue' }: StatCardProps) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {trend && (
            <p className={clsx('text-xs mt-1', trend.positive ? 'text-green-600' : 'text-red-600')}>
              {trend.value}
            </p>
          )}
        </div>
        <div className={clsx('p-3 rounded-lg', colorMap[color])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
