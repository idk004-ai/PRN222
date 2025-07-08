import { useEffect, useState } from 'react';
import {
    ShoppingCart,
    DollarSign,
    Users,
    Package,
    AlertCircle,
    TrendingUp
} from 'lucide-react';

import { StatsCard } from '../components/dashboard/StatsCard';
import { SalesChart } from '../components/dashboard/SalesChart';
import { RecentOrders } from '../components/dashboard/RecentOrders';
import { TopProducts } from '../components/dashboard/TopProducts';
import { LowStockAlert } from '../components/dashboard/LowStockAlert';

import { dashboardService } from '../services/dashboardService';
import type {
    DashboardStats,
    SalesData,
    TopProduct,
    RecentOrder,
    LowStockProduct
} from '../types/dashboard';

export const Dashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [salesData, setSalesData] = useState<SalesData[]>([]);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [
                    statsData,
                    salesChartData,
                    topProductsData,
                    recentOrdersData,
                    lowStockData
                ] = await Promise.all([
                    dashboardService.getDashboardStats(),
                    dashboardService.getSalesData(),
                    dashboardService.getTopProducts(),
                    dashboardService.getRecentOrders(),
                    dashboardService.getLowStockProducts()
                ]);

                setStats(statsData);
                setSalesData(salesChartData);
                setTopProducts(topProductsData);
                setRecentOrders(recentOrdersData);
                setLowStockProducts(lowStockData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome back, Admin!</h2>
                <p className="text-blue-100">
                    Here's what's happening with your store today.
                </p>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Orders"
                        value={stats.totalOrders.toLocaleString()}
                        icon={ShoppingCart}
                        trend={{ value: 12, isPositive: true }}
                    />
                    <StatsCard
                        title="Total Revenue"
                        value={`$${stats.totalRevenue.toLocaleString()}`}
                        icon={DollarSign}
                        trend={{ value: 8, isPositive: true }}
                    />
                    <StatsCard
                        title="Total Customers"
                        value={stats.totalCustomers.toLocaleString()}
                        icon={Users}
                        trend={{ value: 15, isPositive: true }}
                    />
                    <StatsCard
                        title="Total Products"
                        value={stats.totalProducts.toLocaleString()}
                        icon={Package}
                        trend={{ value: 3, isPositive: false }}
                    />
                </div>
            )}

            {/* Alert Cards */}
            {stats && (stats.pendingOrders > 0 || stats.lowStockProducts > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stats.pendingOrders > 0 && (
                        <StatsCard
                            title="Pending Orders"
                            value={stats.pendingOrders}
                            icon={AlertCircle}
                            className="border-yellow-200 bg-yellow-50"
                        />
                    )}
                    {stats.lowStockProducts > 0 && (
                        <StatsCard
                            title="Low Stock Alerts"
                            value={stats.lowStockProducts}
                            icon={TrendingUp}
                            className="border-red-200 bg-red-50"
                        />
                    )}
                </div>
            )}

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2">
                    <SalesChart data={salesData} />
                </div>

                {/* Recent Orders */}
                <div className="lg:col-span-2">
                    <RecentOrders orders={recentOrders} />
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <TopProducts products={topProducts} />

                {/* Low Stock Alert */}
                <LowStockAlert products={lowStockProducts} />
            </div>
        </div>
    );
};
