import type { LowStockProduct } from '../../types/dashboard';
import { AlertTriangle } from 'lucide-react';

interface LowStockAlertProps {
    products: LowStockProduct[];
    className?: string;
}

export const LowStockAlert = ({ products, className = '' }: LowStockAlertProps) => {
    return (
        <div className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 ${className}`}>
            <div className="mb-4">
                <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
                </div>
                <p className="text-sm text-gray-600">Products running low on inventory</p>
            </div>

            <div className="space-y-3">
                {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-600">{product.category}</p>
                        </div>

                        <div className="text-right">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-semibold text-red-600">
                                    {product.currentStock}
                                </span>
                                <span className="text-xs text-gray-500">
                                    / {product.minStock} min
                                </span>
                            </div>

                            <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                                <div
                                    className="bg-red-500 h-2 rounded-full"
                                    style={{
                                        width: `${Math.min((product.currentStock / product.minStock) * 100, 100)}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 && (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <AlertTriangle className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600">All products are well stocked!</p>
                </div>
            )}

            {products.length > 0 && (
                <div className="mt-4 text-center border-t border-red-200 pt-4">
                    <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                        Manage Inventory →
                    </button>
                </div>
            )}
        </div>
    );
};
