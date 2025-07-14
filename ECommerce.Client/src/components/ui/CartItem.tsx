import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import type { CartItem } from '../../types/cart';

interface CartItemProps {
    item: CartItem;
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onRemoveItem: (productId: number) => void;
}

export const CartItemComponent: React.FC<CartItemProps> = ({
    item,
    onUpdateQuantity,
    onRemoveItem
}) => {
    const getImageUrl = () => {
        if (item.imageUrl) {
            if (item.imageUrl.startsWith('http')) {
                return item.imageUrl;
            }
            return `http://localhost:5214${item.imageUrl}`;
        }
        return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop';
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1) return;
        if (item.maxQuantity && newQuantity > item.maxQuantity) return;
        onUpdateQuantity(item.productId, newQuantity);
    };

    const subtotal = item.unitPrice * item.quantity;

    return (
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            {/* Product Image */}
            <div className="flex-shrink-0">
                <img
                    src={getImageUrl()}
                    alt={item.altText || item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop';
                    }}
                />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                    {item.name}
                </h3>
                {item.size && (
                    <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>
                )}
                <p className="text-lg font-semibold text-indigo-600 mt-2">
                    ${item.unitPrice.toFixed(2)}
                </p>
                {item.unitInStock && item.unitInStock <= 5 && (
                    <p className="text-sm text-orange-600 mt-1">
                        Only {item.unitInStock} left in stock
                    </p>
                )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                        onClick={() => handleQuantityChange(item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 text-center min-w-[3rem] font-medium">
                        {item.quantity}
                    </span>
                    <button
                        onClick={() => handleQuantityChange(item.quantity + 1)}
                        disabled={item.maxQuantity ? item.quantity >= item.maxQuantity : false}
                        className="p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            {/* Subtotal */}
            <div className="text-right min-w-[6rem]">
                <p className="text-lg font-semibold text-gray-900">
                    ${subtotal.toFixed(2)}
                </p>
            </div>

            {/* Remove Button */}
            <button
                onClick={() => onRemoveItem(item.productId)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Remove item"
            >
                <Trash2 size={20} />
            </button>
        </div>
    );
};
