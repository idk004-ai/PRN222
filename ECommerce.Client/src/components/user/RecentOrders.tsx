import React from 'react';
import { Package, Eye, ArrowRight } from 'lucide-react';

interface Order {
    orderId: number;
    orderDate: string;
    totalAmount: number;
    status: string;
    itemCount: number;
}

interface RecentOrdersProps {
    orders: Order[];
    loading?: boolean;
}

export const RecentOrders: React.FC<RecentOrdersProps> = ({ orders, loading }) => {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'pending':
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng gần đây</h2>
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex space-x-4">
                            <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h2>
                <a
                    href="#orders"
                    className="flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                    Xem tất cả
                    <ArrowRight className="w-4 h-4 ml-1" />
                </a>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có đơn hàng nào</p>
                    <a
                        href="#products"
                        className="inline-block mt-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition-colors"
                    >
                        Mua sắm ngay
                    </a>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                        <div
                            key={order.orderId}
                            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <Package className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Đơn hàng #{order.orderId}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(order.orderDate)} • {order.itemCount} sản phẩm
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">
                                        {formatCurrency(order.totalAmount)}
                                    </p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <button className="text-indigo-600 hover:text-indigo-700 p-1">
                                    <Eye className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
