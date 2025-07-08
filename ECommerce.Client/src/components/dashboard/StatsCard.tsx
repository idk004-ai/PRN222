import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export const StatsCard = ({ title, value, icon: Icon, trend, className = '' }: StatsCardProps) => {
    return (
        <div className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 ${className}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <div className="flex items-center mt-2">
                            <span
                                className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {trend.isPositive ? '+' : ''}{trend.value}%
                            </span>
                            <span className="text-sm text-gray-500 ml-1">vs last month</span>
                        </div>
                    )}
                </div>
                <div className="bg-blue-50 p-3 rounded-full">
                    <Icon className="w-6 h-6 text-blue-600" />
                </div>
            </div>
        </div>
    );
};
