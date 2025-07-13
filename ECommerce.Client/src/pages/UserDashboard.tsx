import React from 'react';
import type { Product } from '../types/user';
import { UserHeader } from '../components/layout/UserHeader';
import { Banner } from '../components/ui/Banner';
import { CustomerStats } from '../components/user/CustomerStats';
import { RecentOrders } from '../components/user/RecentOrders';
import { ProfileQuickView } from '../components/user/ProfileQuickView';
import { ProductSection } from '../components/user/ProductSection';
import { SessionTimer } from '../components/user/SessionTimer';
import { useUserDashboardData } from '../hooks/useUserDashboardData';
import { useDashboard } from '../hooks/useDashboard';

export const UserDashboard: React.FC = () => {
    const { products, banners, loading: productsLoading } = useUserDashboardData();
    const { stats, recentOrders, profile, loading: dashboardLoading, error, refreshData } = useDashboard();

    const handleAddToCart = (product: Product) => {
        console.log('Adding to cart:', product);
        // TODO: Implement add to cart functionality
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <UserHeader />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Có lỗi xảy ra: {error}</p>
                        <button
                            onClick={refreshData}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <UserHeader />
            <SessionTimer />

            {banners.length > 0 && (
                <Banner banner={banners[0]} />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-gray-600">Chào mừng bạn quay trở lại!</p>
                </div>

                {/* Stats Section */}
                <div className="mb-8">
                    <CustomerStats stats={stats} loading={dashboardLoading} />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Recent Orders - Takes 2 columns on large screens */}
                    <div className="lg:col-span-2">
                        <RecentOrders orders={recentOrders} loading={dashboardLoading} />
                    </div>

                    {/* Profile Quick View - Takes 1 column */}
                    <div>
                        <ProfileQuickView profile={profile} loading={dashboardLoading} />
                    </div>
                </div>

                {/* Products Section */}
                <div className="mb-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Sản phẩm nổi bật</h2>
                        <p className="text-gray-600">Khám phá những sản phẩm mới nhất và hot nhất</p>
                    </div>
                    <ProductSection
                        products={products}
                        loading={productsLoading}
                        onAddToCart={handleAddToCart}
                    />
                </div>
            </div>
        </div>
    );
};
