import axios from 'axios';

const API_BASE_URL = 'https://localhost:7162/api';

export interface DashboardStats {
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
}

export interface Order {
    orderId: number;
    orderDate: string;
    totalAmount: number;
    status: string;
    itemCount: number;
}

export interface CustomerProfile {
  customerId: number;
  fullName: string;
  email: string;
  joinDate: string;
  totalOrders: number;
  avatar?: string;
}

export interface DashboardData {
    stats: DashboardStats;
    recentOrders: Order[];
    profile: CustomerProfile;
}

class CustomerDashboardService {
    private getAuthToken(): string | null {
        return localStorage.getItem('authToken');
    }

    private getAuthHeaders() {
        const token = this.getAuthToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    async getDashboardData(): Promise<DashboardData> {
        try {
            const response = await axios.get(`${API_BASE_URL}/customer/dashboard`, {
                headers: this.getAuthHeaders()
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw error;
        }
    }

    async getStats(): Promise<DashboardStats> {
        try {
            const response = await axios.get(`${API_BASE_URL}/customer/stats`, {
                headers: this.getAuthHeaders()
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching stats:', error);
            throw error;
        }
    }

    async getRecentOrders(limit: number = 5): Promise<Order[]> {
        try {
            const response = await axios.get(`${API_BASE_URL}/customer/orders/recent`, {
                params: { limit },
                headers: this.getAuthHeaders()
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching recent orders:', error);
            throw error;
        }
    }

    async getProfile(): Promise<CustomerProfile> {
        try {
            const response = await axios.get(`${API_BASE_URL}/customer/profile`, {
                headers: this.getAuthHeaders()
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    }

    // Mock data for development
    getMockDashboardData(): DashboardData {
        return {
      stats: {
        totalOrders: 12,
        totalSpent: 2650000,
        pendingOrders: 2
      },
            recentOrders: [
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
            ],
      profile: {
        customerId: 1,
        fullName: 'Nguyễn Văn An',
        email: 'nguyenvanan@email.com',
        joinDate: '2023-06-15',
        totalOrders: 12
      }
        };
    }
}

export const customerDashboardService = new CustomerDashboardService();
