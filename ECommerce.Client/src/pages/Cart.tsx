import React, { useState } from 'react';
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react';
import { CartItemComponent } from '../components/ui/CartItem';
import { CartSummary } from '../components/ui/CartSummary';
import { EmptyCart } from '../components/ui/EmptyCart';
import { Button } from '../components/ui/Button';
import type { CartItem, CartSummary as CartSummaryType } from '../types/cart';

export const Cart: React.FC = () => {
    // Mock data - trong thực tế sẽ lấy từ context hoặc API
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            productId: 1,
            name: "Premium Wireless Headphones",
            unitPrice: 299.99,
            quantity: 1,
            imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
            altText: "Wireless headphones",
            unitInStock: 15,
            size: "One Size",
            maxQuantity: 5
        },
        {
            productId: 2,
            name: "Smart Watch Series X",
            unitPrice: 399.99,
            quantity: 2,
            imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
            altText: "Smart watch",
            unitInStock: 3,
            size: "42mm",
            maxQuantity: 3
        },
        {
            productId: 3,
            name: "Wireless Bluetooth Speaker",
            unitPrice: 149.99,
            quantity: 1,
            imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
            altText: "Bluetooth speaker",
            unitInStock: 8,
            maxQuantity: 10
        }
    ]);

    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

    const handleUpdateQuantity = (productId: number, quantity: number) => {
        setCartItems(items =>
            items.map(item =>
                item.productId === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const handleRemoveItem = (productId: number) => {
        setCartItems(items => items.filter(item => item.productId !== productId));
    };

    const handleCheckout = async () => {
        setIsCheckoutLoading(true);
        // Simulate API call
        setTimeout(() => {
            alert('Checkout functionality will be implemented later!');
            setIsCheckoutLoading(false);
        }, 2000);
    };

    const handleContinueShopping = () => {
        // Navigate back to products page
        window.history.back();
    };

    // Calculate cart summary
    const subtotal = cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const shipping = subtotal >= 50 ? 0 : 9.99; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    const cartSummary: CartSummaryType = {
        subtotal,
        shipping,
        tax,
        total
    };

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    if (cartItems.length === 0) {
        return <EmptyCart onContinueShopping={handleContinueShopping} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={handleContinueShopping}
                        className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4 transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Continue Shopping
                    </button>

                    <div className="flex items-center gap-3">
                        <ShoppingCart size={32} className="text-indigo-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Shopping Cart
                            </h1>
                            <p className="text-gray-600">
                                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <CartItemComponent
                                    key={item.productId}
                                    item={item}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemoveItem={handleRemoveItem}
                                />
                            ))}
                        </div>

                        {/* Actions below cart items */}
                        <div className="mt-6 flex flex-col sm:flex-row gap-4">
                            <Button
                                variant="secondary"
                                onClick={handleContinueShopping}
                                className="flex-1 sm:flex-none"
                            >
                                Continue Shopping
                            </Button>

                            <button
                                onClick={() => setCartItems([])}
                                className="flex-1 sm:flex-none px-4 py-2 text-red-600 hover:text-red-800 border border-red-300 hover:border-red-500 rounded-md transition-colors"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* Cart Summary */}
                    <div className="lg:col-span-1">
                        <CartSummary
                            summary={cartSummary}
                            isLoading={isCheckoutLoading}
                            onCheckout={handleCheckout}
                        />
                    </div>
                </div>

                {/* Additional Information */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="p-4">
                        <div className="w-12 h-12 mx-auto mb-3 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Package size={24} className="text-indigo-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
                        <p className="text-sm text-gray-600">On orders over $50</p>
                    </div>

                    <div className="p-4">
                        <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                            <ShoppingCart size={24} className="text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Easy Returns</h3>
                        <p className="text-sm text-gray-600">30-day return policy</p>
                    </div>

                    <div className="p-4">
                        <div className="w-12 h-12 mx-auto mb-3 bg-yellow-100 rounded-full flex items-center justify-center">
                            <span className="text-yellow-600 font-bold">24/7</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
                        <p className="text-sm text-gray-600">Round-the-clock assistance</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
