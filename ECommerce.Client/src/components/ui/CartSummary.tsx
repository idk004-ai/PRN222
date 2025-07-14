import React from 'react';
import { Button } from './Button';
import type { CartSummary as CartSummaryType } from '../../types/cart';

interface CartSummaryProps {
    summary: CartSummaryType;
    isLoading?: boolean;
    onCheckout: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
    summary,
    isLoading = false,
    onCheckout
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
            </h2>

            <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${summary.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                        {summary.shipping === 0 ? 'Free' : `$${summary.shipping.toFixed(2)}`}
                    </span>
                </div>

                <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${summary.tax.toFixed(2)}</span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${summary.total.toFixed(2)}</span>
                </div>
            </div>

            <div className="mt-6 space-y-3">
                <Button
                    onClick={onCheckout}
                    loading={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-3 text-base font-medium"
                    size="lg"
                >
                    Proceed to Checkout
                </Button>

                <button className="w-full text-indigo-600 hover:text-indigo-800 text-sm font-medium py-2 transition-colors">
                    Continue Shopping
                </button>
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
                <p>Secure checkout with SSL encryption</p>
                <p className="mt-1">Free shipping on orders over $50</p>
            </div>
        </div>
    );
};
