import { useState, useEffect } from 'react';
import { Plus, Grid, List, Package } from 'lucide-react';

import { ProductCard } from '../components/products/ProductCard';
import { ProductFilters } from '../components/products/ProductFilters';
import { AddProductModal } from '../components/products/AddProductModal';
import { Pagination } from '../components/common/Pagination';

import { productService } from '../services/productService';
import { usePagination } from '../hooks/usePagination';
import type { Product, ProductFilter, ProductFormData } from '../types/product';

export const Products = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [filters, setFilters] = useState<ProductFilter>({});
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Use pagination hook
    const {
        data: products,
        pagination,
        loading,
        error,
        handlePageChange,
        handlePageSizeChange,
        refresh
    } = usePagination<Product>({
        initialPageSize: 10,
        onLoadData: async (page, pageSize) => {
            return await productService.getProducts(page, pageSize, filters);
        },
        dependencies: [filters]
    });

    // Load categories separately
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categoriesData = await productService.getCategories();
                setCategories(categoriesData.map(cat => cat.name));
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        };
        loadCategories();
    }, []);

    // Handle add product
    const handleAddProduct = async (productData: ProductFormData) => {
        try {
            const newProduct = await productService.createProduct(productData);
            if (newProduct) {
                // Refresh current page to show new product
                refresh();
            }
        } catch (error) {
            console.error('Error creating product:', error);
            // Here you would typically show a toast/notification
        }
    };

    const handleEditProduct = (product: Product) => {
        console.log('Edit product:', product);
        // TODO: Implement edit functionality
    };

    const handleDeleteProduct = async (product: Product) => {
        if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
            try {
                await productService.deleteProduct(product.productId);
                // Refresh current page to reflect changes
                refresh();
            } catch (error) {
                console.error('Error deleting product:', error);
                // Here you would typically show a toast/notification
            }
        }
    };

    const handleViewProduct = (product: Product) => {
        console.log('View product:', product);
        // TODO: Implement view functionality (navigate to product detail page)
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
                <button 
                    onClick={refresh}
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600 mt-1">
                        Manage your product inventory ({pagination.totalRecords} total, showing {products.length} on page {pagination.pageNumber})
                    </p>
                </div>

                <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                    {/* View Mode Toggle */}
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 ${viewMode === 'grid'
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 ${viewMode === 'list'
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Add Product Button */}
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Product</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <ProductFilters
                filters={filters}
                onFiltersChange={setFilters}
                categories={categories}
            />

            {/* Products Grid/List */}
            {products.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 mb-4">
                        {Object.keys(filters).length > 0
                            ? 'Try adjusting your filters or search terms.'
                            : 'Get started by adding your first product.'}
                    </p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                        Add Product
                    </button>
                </div>
            ) : (
                <>
                    <div className={`
                        ${viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                            : 'space-y-4'
                        }
                    `}>
                        {products.map((product) => (
                            <ProductCard
                                key={product.productId}
                                product={product}
                                onEdit={handleEditProduct}
                                onDelete={handleDeleteProduct}
                                onView={handleViewProduct}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <Pagination
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        pageSizeOptions={[6, 10, 12, 24, 48]}
                        className="mt-8"
                    />
                </>
            )}

            {/* Add Product Modal */}
            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddProduct}
            />
        </div>
    );
};
