import type { RecentOrder } from '../../types/dashboard';

interface RecentOrdersProps {
    orders: RecentOrder[];
    className?: string;
}

const getStatusColor = (status: RecentOrder['status']) => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'processing':
            return 'bg-blue-100 text-blue-800';
        case 'shipped':
            return 'bg-purple-100 text-purple-800';
        case 'delivered':
            return 'bg-green-100 text-green-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export const RecentOrders = ({ orders, className = '' }: RecentOrdersProps) => {
    return (
        <div className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 ${className}`}>
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <p className="text-sm text-gray-600">Latest customer orders</p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Order ID</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Customer</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Date</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Status</th>
                            <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm font-medium text-gray-900">#{order.id}</td>
                                <td className="py-3 px-4 text-sm text-gray-700">{order.customerName}</td>
                                <td className="py-3 px-4 text-sm text-gray-700">{order.date}</td>
                                <td className="py-3 px-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                                    ${order.total.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All Orders →
                </button>
            </div>
        </div>
    );
};
