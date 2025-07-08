import type { TopProduct } from '../../types/dashboard';
import { Package } from 'lucide-react';

interface TopProductsProps {
    products: TopProduct[];
    className?: string;
}

export const TopProducts = ({ products, className = '' }: TopProductsProps) => {
    return (
        <div className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 ${className}`}>
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
                <p className="text-sm text-gray-600">Best performing products this month</p>
            </div>

            <div className="space-y-4">
                {products.map((product, index) => (
                    <div key={product.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                        </div>

                        <div className="flex-shrink-0">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Package className="w-6 h-6 text-gray-400" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                                {product.soldQuantity} sold
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                                ${product.revenue.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">revenue</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 text-center border-t border-gray-200 pt-4">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All Products →
                </button>
            </div>
        </div>
    );
};
