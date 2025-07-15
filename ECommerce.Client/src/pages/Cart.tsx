import React from 'react';
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react';
import { CartItemComponent } from '../components/ui/CartItem';
import { CartSummary } from '../components/ui/CartSummary';
import { EmptyCart } from '../components/ui/EmptyCart';
import { Button } from '../components/ui/Button';
import { useCart } from '../hooks/useCart';
import type { CartSummary as CartSummaryType } from '../types/cart';

export const Cart: React.FC = () => {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
    const [isCheckoutLoading, setIsCheckoutLoading] = React.useState(false);

    const handleUpdateQuantity = (productId: number, quantity: number) => {
        updateQuantity(productId, quantity);
    };

    const handleRemoveItem = (productId: number) => {
        removeFromCart(productId);
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
    const subtotal = cart.totalAmount;
    const shipping = subtotal >= 50 ? 0 : 9.99; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    const cartSummary: CartSummaryType = {
        subtotal,
        shipping,
        tax,
        total
    };

    if (cart.items.length === 0) {
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
                    </button>            <div className="flex items-center gap-3">
                        <ShoppingCart size={32} className="text-indigo-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Shopping Cart
                            </h1>
                            <p className="text-gray-600">
                                {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            {cart.items.map((item) => (
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
                                onClick={() => clearCart()}
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
