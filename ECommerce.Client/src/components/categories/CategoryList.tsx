import { useState, useEffect } from 'react';
import { Package, RefreshCw } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../types/product';

interface CategoryListProps {
    onCategorySelect?: (category: Category) => void;
    selectedCategoryId?: number;
    showCount?: boolean;
    className?: string;
}

export const CategoryList: React.FC<CategoryListProps> = ({
    onCategorySelect,
    selectedCategoryId,
    showCount = true,
    className = ''
}) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const categoriesData = await categoryService.getAllCategories();
            setCategories(categoriesData);
        } catch (err) {
            console.error('Error loading categories:', err);
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleCategoryClick = (category: Category) => {
        if (onCategorySelect) {
            onCategorySelect(category);
        }
    };

    const handleRefresh = () => {
        loadCategories();
    };

    if (loading) {
        return (
            <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Categories</h3>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Categories</h3>
                    <button
                        onClick={handleRefresh}
                        className="p-1 text-gray-500 hover:text-gray-700 rounded"
                        title="Refresh categories"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-center py-4">
                    <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">{error}</p>
                    <button
                        onClick={handleRefresh}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Categories</h3>
                <button
                    onClick={handleRefresh}
                    className="p-1 text-gray-500 hover:text-gray-700 rounded"
                    title="Refresh categories"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            {categories.length === 0 ? (
                <div className="text-center py-4">
                    <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No categories found</p>
                </div>
            ) : (
                <div className="space-y-1">
                    {categories.map((category) => (
                        <button
                            key={category.categoryID}
                            onClick={() => handleCategoryClick(category)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategoryId === category.categoryID
                                    ? 'bg-blue-100 text-blue-800 font-medium'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="truncate">{category.name}</span>
                                {showCount && (
                                    <span className="text-xs text-gray-500 ml-2">
                                        {category.productCount || 0}
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryList;
