import { useState, useEffect } from 'react';
import { customerDashboardService } from '../services/customerDashboardService';
import type { DashboardData, DashboardStats, Order, CustomerProfile } from '../services/customerDashboardService';

export const useDashboard = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // For development, use mock data
            // In production, uncomment the line below and remove mock data
            // const data = await customerDashboardService.getDashboardData();
            const data = customerDashboardService.getMockDashboardData();

            setDashboardData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const refreshData = () => {
        fetchDashboardData();
    };

    return {
        dashboardData,
        stats: dashboardData?.stats || null,
        recentOrders: dashboardData?.recentOrders || [],
        profile: dashboardData?.profile || null,
        loading,
        error,
        refreshData
    };
};

export const useStats = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);

        // Mock data for development
        const mockStats = {
          totalOrders: 12,
          totalSpent: 2650000,
          pendingOrders: 2
        };

                setStats(mockStats);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { stats, loading, error };
};

export const useRecentOrders = (limit: number = 5) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);

                // Mock data for development
                const mockOrders = [
                    {
                        orderId: 1001,
                        orderDate: '2024-01-15',
                        totalAmount: 450000,
                        status: 'Delivered',
                        itemCount: 3
                    },
                    {
                        orderId: 1002,
                        orderDate: '2024-01-20',
                        totalAmount: 320000,
                        status: 'Shipped',
                        itemCount: 2
                    },
                    {
                        orderId: 1003,
                        orderDate: '2024-01-22',
                        totalAmount: 180000,
                        status: 'Processing',
                        itemCount: 1
                    },
                    {
                        orderId: 1004,
                        orderDate: '2024-01-25',
                        totalAmount: 650000,
                        status: 'Pending',
                        itemCount: 4
                    }
                ].slice(0, limit);

                setOrders(mockOrders);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [limit]);

    return { orders, loading, error };
};

export const useCustomerProfile = () => {
    const [profile, setProfile] = useState<CustomerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);

                // Mock data for development
        // Mock data for development
        const mockProfile = {
          customerId: 1,
          fullName: 'Nguyễn Văn An',
          email: 'nguyenvanan@email.com',
          joinDate: '2023-06-15',
          totalOrders: 12
        };
                setProfile(mockProfile);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return { profile, loading, error };
};
