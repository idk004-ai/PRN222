import React from 'react';
import type { Product } from '../../types/user';

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onAddToCart
}) => {
    const handleAddToCart = () => {
        if (onAddToCart) {
            onAddToCart(product);
        }
    };

    const getImageUrl = () => {
        if (product.imageUrl) {
            // Nếu imageUrl bắt đầu bằng http thì dùng trực tiếp
            if (product.imageUrl.startsWith('http')) {
                return product.imageUrl;
            }
            // Nếu là path tương đối thì thêm base URL của API
            return `http://localhost:5214${product.imageUrl}`;
        }
        // Fallback image
        return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop';
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
            <div className="relative">
                <img
                    src={getImageUrl()}
                    alt={product.altText || product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.addBadge && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        New
                    </span>
                )}
                {product.discount && product.discount > 0 && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        -{product.discount}%
                    </span>
                )}
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                </h3>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-indigo-600">
                            ${product.unitPrice}
                        </span>
                        {product.oldPrice && product.oldPrice > product.unitPrice && (
                            <span className="text-sm text-gray-500 line-through">
                                ${product.oldPrice}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};
