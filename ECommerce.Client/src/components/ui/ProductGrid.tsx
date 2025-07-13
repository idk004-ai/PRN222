import React from 'react';
import type { Product } from '../../types/user';
import { ProductCard } from './ProductCard';
import { LoadingSpinner } from './LoadingSpinner';

interface ProductGridProps {
    products: Product[];
    loading: boolean;
    onAddToCart?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    loading,
    onAddToCart
}) => {
    if (loading) {
        return <LoadingSpinner />;
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No products available at the moment.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard
                    key={product.productId}
                    product={product}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
};
