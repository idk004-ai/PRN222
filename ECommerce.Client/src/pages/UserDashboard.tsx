import React from 'react';
import type { Product } from '../types/user';
import { UserHeader } from '../components/layout/UserHeader';
import { Banner } from '../components/ui/Banner';
import { ProductSection } from '../components/user/ProductSection';
import { useUserDashboardData } from '../hooks/useUserDashboardData';

export const UserDashboard: React.FC = () => {
    const { products, banners, loading } = useUserDashboardData();

    const handleAddToCart = (product: Product) => {
        console.log('Adding to cart:', product);
        // TODO: Implement add to cart functionality
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <UserHeader />

            {banners.length > 0 && (
                <Banner banner={banners[0]} />
            )}

            <ProductSection
                products={products}
                loading={loading}
                onAddToCart={handleAddToCart}
            />
        </div>
    );
};
