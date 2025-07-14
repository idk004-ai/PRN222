import React from 'react';
import { ShoppingBag, CreditCard, Clock } from 'lucide-react';

interface DashboardStatsData {
    totalOrders: number;
    totalSpent: number;
    pendingOrders: number;
}

interface CustomerStatsProps {
    stats: DashboardStatsData | null;
    loading?: boolean;
}

export const CustomerStats: React.FC<CustomerStatsProps> = ({ stats, loading }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-pulse">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded w-16"></div>
                            </div>
                            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    const statsData = [
        {
            label: 'Tổng đơn hàng',
            value: stats.totalOrders.toString(),
            icon: ShoppingBag,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            label: 'Tổng chi tiêu',
            value: formatCurrency(stats.totalSpent),
            icon: CreditCard,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            label: 'Đang xử lý',
            value: stats.pendingOrders.toString(),
            icon: Clock,
            color: 'bg-yellow-500',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-600'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statsData.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                            <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
