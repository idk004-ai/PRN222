import React from 'react';
import { Package, ShoppingBag } from 'lucide-react';
import { Button } from './Button';

interface EmptyCartProps {
    onContinueShopping: () => void;
}

export const EmptyCart: React.FC<EmptyCartProps> = ({ onContinueShopping }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center py-16 px-4">
                <div className="relative mb-8">
                    <Package size={120} className="mx-auto text-gray-200" />
                    <ShoppingBag size={40} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-300" />
                </div>

                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Your cart is empty
                </h2>

                <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                    Looks like you haven't added any items to your cart yet.
                    Start shopping to fill it up!
                </p>

                <Button
                    onClick={onContinueShopping}
                    size="lg"
                    className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 px-8 py-4 text-lg"
                >
                    Start Shopping
                </Button>

                <div className="mt-8 text-sm text-gray-500">
                    <p>💡 Pro tip: Browse our featured products to get started</p>
                </div>
            </div>
        </div>
    );
};
