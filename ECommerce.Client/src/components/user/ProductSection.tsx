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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
                <p className="text-gray-600">Discover our best-selling items</p>
            </div>

            <ProductGrid
                products={products}
                loading={loading}
                onAddToCart={onAddToCart}
            />
        </section>
    );
};
