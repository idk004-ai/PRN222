import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { SalesData } from '../../types/dashboard';

interface SalesChartProps {
    data: SalesData[];
    className?: string;
}

export const SalesChart = ({ data, className = '' }: SalesChartProps) => {
    return (
        <div className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 ${className}`}>
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
                <p className="text-sm text-gray-600">Monthly sales and orders</p>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            className="text-sm"
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            className="text-sm"
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="sales"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: '#3b82f6' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="orders"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: '#10b981' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="flex justify-center mt-4 space-x-6">
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Sales ($)</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Orders</span>
                </div>
            </div>
        </div>
    );
};
