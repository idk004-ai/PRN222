import axios from 'axios';
import type { DashboardStats, SalesData, TopProduct, RecentOrder, LowStockProduct } from '../types/dashboard';

const API_BASE_URL = 'https://localhost:7066/api'; // Adjust based on your API port

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const dashboardService = {
    // Get dashboard statistics
    getDashboardStats: async (): Promise<DashboardStats> => {
        try {
            // Mock data for now - replace with actual API call
            return {
                totalOrders: 1250,
                totalRevenue: 125000,
                totalCustomers: 580,
                totalProducts: 320,
                pendingOrders: 25,
                lowStockProducts: 8,
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    },

    // Get sales data for charts
    getSalesData: async (): Promise<SalesData[]> => {
        try {
            // Mock data for now - replace with actual API call
            return [
                { month: 'Jan', sales: 15000, orders: 120 },
                { month: 'Feb', sales: 18000, orders: 140 },
                { month: 'Mar', sales: 22000, orders: 180 },
                { month: 'Apr', sales: 19000, orders: 160 },
                { month: 'May', sales: 25000, orders: 200 },
                { month: 'Jun', sales: 28000, orders: 220 },
            ];
        } catch (error) {
            console.error('Error fetching sales data:', error);
            throw error;
        }
    },

    // Get top selling products
    getTopProducts: async (): Promise<TopProduct[]> => {
        try {
            // Mock data for now - replace with actual API call
            return [
                { id: 1, name: 'Summer Dress', soldQuantity: 125, revenue: 12500 },
                { id: 2, name: 'Casual T-Shirt', soldQuantity: 98, revenue: 2940 },
                { id: 3, name: 'Denim Jeans', soldQuantity: 76, revenue: 5320 },
                { id: 4, name: 'Sports Shoes', soldQuantity: 65, revenue: 6500 },
                { id: 5, name: 'Winter Jacket', soldQuantity: 45, revenue: 6750 },
            ];
        } catch (error) {
            console.error('Error fetching top products:', error);
            throw error;
        }
    },

    // Get recent orders
    getRecentOrders: async (): Promise<RecentOrder[]> => {
        try {
            // Mock data for now - replace with actual API call
            return [
                { id: 1001, customerName: 'John Doe', date: '2024-01-15', status: 'pending', total: 150.00 },
                { id: 1002, customerName: 'Jane Smith', date: '2024-01-15', status: 'processing', total: 275.50 },
                { id: 1003, customerName: 'Mike Johnson', date: '2024-01-14', status: 'shipped', total: 89.99 },
                { id: 1004, customerName: 'Sarah Wilson', date: '2024-01-14', status: 'delivered', total: 320.00 },
                { id: 1005, customerName: 'David Brown', date: '2024-01-13', status: 'pending', total: 199.99 },
            ];
        } catch (error) {
            console.error('Error fetching recent orders:', error);
            throw error;
        }
    },

    // Get low stock products
    getLowStockProducts: async (): Promise<LowStockProduct[]> => {
        try {
            // Mock data for now - replace with actual API call
            return [
                { id: 1, name: 'Summer Dress - Size M', currentStock: 3, minStock: 10, category: 'Dresses' },
                { id: 2, name: 'Blue Jeans - 32W', currentStock: 2, minStock: 8, category: 'Jeans' },
                { id: 3, name: 'White Sneakers - Size 9', currentStock: 1, minStock: 5, category: 'Shoes' },
                { id: 4, name: 'Black T-Shirt - XL', currentStock: 4, minStock: 12, category: 'T-Shirts' },
            ];
        } catch (error) {
            console.error('Error fetching low stock products:', error);
            throw error;
        }
    },
};
