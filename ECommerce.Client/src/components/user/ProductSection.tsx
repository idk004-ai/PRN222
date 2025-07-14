import React from 'react';
import type { Product } from '../../types/user';
import { ProductGrid } from '../ui/ProductGrid';

interface ProductSectionProps {
    products: Product[];
    loading: boolean;
    onAddToCart?: (product: Product) => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
    products,
    loading,
    onAddToCart
}) => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover our best-selling items carefully curated for you</p>
            </div>

            <ProductGrid
                products={products}
                loading={loading}
                onAddToCart={onAddToCart}
            />
        </section>
    );
};
