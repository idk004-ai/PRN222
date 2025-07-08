export interface DashboardStats {
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    totalProducts: number;
    pendingOrders: number;
    lowStockProducts: number;
}

export interface SalesData {
    month: string;
    sales: number;
    orders: number;
}

export interface TopProduct {
    id: number;
    name: string;
    soldQuantity: number;
    revenue: number;
    image?: string;
}

export interface RecentOrder {
    id: number;
    customerName: string;
    date: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
}

export interface LowStockProduct {
    id: number;
    name: string;
    currentStock: number;
    minStock: number;
    category: string;
}
