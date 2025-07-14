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
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full">
            {/* Image Container - Fixed aspect ratio */}
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={getImageUrl()}
                    alt={product.altText || product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop';
                    }}
                />
                
                {/* Badges */}
                {product.addBadge && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        New
                    </span>
                )}
                {product.discount && product.discount > 0 && (
                    <span className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        -{product.discount}%
                    </span>
                )}
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Content Container - Flexible grow */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Product Name - Fixed height */}
                <div className="mb-4 h-12 flex items-start">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-tight">
                        {product.name}
                    </h3>
                </div>

                {/* Price and Button Container - Push to bottom */}
                <div className="mt-auto">
                    {/* Price Section */}
                    <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xl font-bold text-indigo-600">
                                ${product.unitPrice?.toFixed(2)}
                            </span>
                            {product.oldPrice && product.oldPrice > product.unitPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                    ${product.oldPrice.toFixed(2)}
                                </span>
                            )}
                        </div>
                        
                        {/* Stock info */}
                        <div className="text-xs text-gray-500">
                            {product.unitInStock && product.unitInStock > 0 ? (
                                <span className="text-green-600">In Stock ({product.unitInStock})</span>
                            ) : (
                                <span className="text-red-600">Out of Stock</span>
                            )}
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={!product.unitInStock || product.unitInStock <= 0}
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        {product.unitInStock && product.unitInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
};
