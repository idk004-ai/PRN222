import React from 'react';
import { ShoppingBag, Heart, User, Star } from 'lucide-react';

interface DashboardStatsProps {
    orderCount: number;
    wishlistCount: number;
    reviewCount: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
    orderCount,
    wishlistCount,
    reviewCount
}) => {

    const stats = [
        {
            title: 'Đơn hàng của tôi',
            value: orderCount,
            icon: ShoppingBag,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            href: '#orders'
        },
        {
            title: 'Danh sách yêu thích',
            value: wishlistCount,
            icon: Heart,
            color: 'bg-pink-500',
            bgColor: 'bg-pink-50',
            textColor: 'text-pink-600',
            href: '#wishlist'
        },
        {
            title: 'Đánh giá của tôi',
            value: reviewCount,
            icon: Star,
            color: 'bg-yellow-500',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-600',
            href: '#reviews'
        },
        {
            title: 'Thông tin cá nhân',
            value: '1',
            icon: User,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
            href: '#profile'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                    <a
                        key={stat.title}
                        href={stat.href}
                        className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                    >
                        <div className="flex items-center">
                            <div className={`flex-shrink-0 ${stat.bgColor} p-3 rounded-lg`}>
                                <IconComponent className={`w-6 h-6 ${stat.textColor}`} />
                            </div>
                            <div className="ml-4 flex-1">
                                <h3 className="text-sm font-medium text-gray-500 truncate">
                                    {stat.title}
                                </h3>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </a>
                );
            })}
        </div>
    );
};
