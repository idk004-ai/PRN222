import axios from 'axios';

const API_BASE_URL = 'http://localhost:5214/api';

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
    private getCustomerId(): number | null {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const parsedUser = JSON.parse(user);
                return parsedUser.id || null;
            } catch {
                return null;
            }
        }
        return null;
    }

    async getDashboardData(): Promise<DashboardData> {
        try {
            const customerId = this.getCustomerId();
            if (!customerId) {
                throw new Error('Customer ID not found');
            }

            const response = await axios.get(`${API_BASE_URL}/CustomerDashboard/${customerId}/dashboard`);
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw error;
        }
    }

    async getStats(): Promise<DashboardStats> {
        try {
            const customerId = this.getCustomerId();
            if (!customerId) {
                throw new Error('Customer ID not found');
            }

            const response = await axios.get(`${API_BASE_URL}/CustomerDashboard/${customerId}/stats`);
            return response.data;
        } catch (error) {
            console.error('Error fetching stats:', error);
            throw error;
        }
    }

    async getRecentOrders(limit: number = 5): Promise<Order[]> {
        try {
            const customerId = this.getCustomerId();
            if (!customerId) {
                throw new Error('Customer ID not found');
            }

            const response = await axios.get(`${API_BASE_URL}/CustomerDashboard/${customerId}/recent-orders?limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching recent orders:', error);
            throw error;
        }
    }

    async getProfile(): Promise<CustomerProfile> {
        try {
            const customerId = this.getCustomerId();
            if (!customerId) {
                throw new Error('Customer ID not found');
            }

            const response = await axios.get(`${API_BASE_URL}/CustomerDashboard/${customerId}/profile`);
            return response.data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    }
}

export const customerDashboardService = new CustomerDashboardService();
