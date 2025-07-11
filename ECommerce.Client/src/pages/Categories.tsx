import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Package, Grid, List } from 'lucide-react';

import { categoryService } from '../services/categoryService';
import { useToast } from '../hooks/useToast';
import { usePagination } from '../hooks/usePagination';
import { ToastContainer } from '../components/ui/Toast';
import { Pagination } from '../components/common/Pagination';
import { AddCategoryModal, EditCategoryModal } from '../components/categories';
import type { Category, CreateCategoryFormData, UpdateCategoryFormData } from '../types/product';

export const Categories = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // Toast notifications
    const { toasts, removeToast, success, error: showError } = useToast();

    // Use pagination hook
    const {
        data: categories,
        pagination,
        loading,
        error,
        handlePageChange,
        handlePageSizeChange,
        refresh
    } = usePagination<Category>({
        initialPageSize: 12,
        onLoadData: async (page, pageSize) => {
            return await categoryService.getPaginatedCategories(page, pageSize, searchTerm);
        },
        dependencies: [searchTerm]
    });

    // Handle delete category
    const handleDeleteCategory = async (category: Category) => {
        if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
            try {
                const result = await categoryService.deleteCategory(category.categoryID);
                if (result) {
                    refresh();
                    success('Category Deleted', `"${category.name}" has been successfully deleted.`);
                } else {
                    showError('Delete Failed', 'Failed to delete category. Please try again.');
                }
            } catch (error: any) {
                console.error('Error deleting category:', error);
                showError(
                    'Delete Failed',
                    error.response?.data?.message || 'An unexpected error occurred. Please try again.'
                );
            }
        }
    };

    // Handle edit category
    const handleEditCategory = (category: Category) => {
        setSelectedCategory(category);
        setIsEditModalOpen(true);
    };

    // Handle add category
    const handleAddCategory = async (data: CreateCategoryFormData) => {
        try {
            const result = await categoryService.createCategory(data);
            if (result) {
                refresh();
                setIsAddModalOpen(false);
                success('Category Created', `"${data.name}" has been successfully created.`);
            } else {
                showError('Create Failed', 'Failed to create category. Please try again.');
            }
        } catch (error: any) {
            console.error('Error creating category:', error);
            showError(
                'Create Failed',
                error.response?.data?.message || 'An unexpected error occurred. Please try again.'
            );
        }
    };

    // Handle update category
    const handleUpdateCategory = async (data: UpdateCategoryFormData) => {
        if (!selectedCategory) return;

        try {
            const result = await categoryService.updateCategory(selectedCategory.categoryID, data);
            if (result) {
                refresh();
                setIsEditModalOpen(false);
                setSelectedCategory(null);
                success('Category Updated', `"${data.name}" has been successfully updated.`);
            } else {
                showError('Update Failed', 'Failed to update category. Please try again.');
            }
        } catch (error: any) {
            console.error('Error updating category:', error);
            showError(
                'Update Failed',
                error.response?.data?.message || 'An unexpected error occurred. Please try again.'
            );
        }
    };

    // Handle close modals
    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedCategory(null);
    };

    // Render category card
    const renderCategoryCard = (category: Category) => (
        <div key={category.categoryID} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                {category.picture1 ? (
                    <img
                        src={category.picture1}
                        alt={category.name}
                        className="w-full h-48 object-cover"
                    />
                ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                        <Package className="w-16 h-16 text-gray-400" />
                    </div>
                )}
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{category.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${category.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>

                {category.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{category.description}</p>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                    <span>{category.productCount || 0} products</span>
                    <span>{category.subCategoryCount || 0} subcategories</span>
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => handleEditCategory(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit category"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDeleteCategory(category)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete category"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    // Render category row (list view)
    const renderCategoryRow = (category: Category) => (
        <tr key={category.categoryID} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    {category.picture1 ? (
                        <img
                            src={category.picture1}
                            alt={category.name}
                            className="w-10 h-10 object-cover rounded"
                        />
                    ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                        </div>
                    )}
                    <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        {category.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">{category.description}</div>
                        )}
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {category.productCount || 0}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {category.subCategoryCount || 0}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => handleEditCategory(category)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit category"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDeleteCategory(category)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete category"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Category</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex-1 min-w-0">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="text-red-800">
                        Error loading categories: {error}
                    </div>
                </div>
            )}

            {/* Categories content */}
            {!loading && !error && (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {categories.map(renderCategoryCard)}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Products
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Subcategories
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {categories.map(renderCategoryRow)}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Empty state */}
                    {categories.length === 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                            <p className="text-gray-500 mb-4">
                                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first category.'}
                            </p>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Add Category
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {categories.length > 0 && (
                        <div className="mt-6">
                            <Pagination
                                pagination={pagination}
                                onPageChange={handlePageChange}
                                onPageSizeChange={handlePageSizeChange}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Toast notifications */}
            <ToastContainer toasts={toasts} onDismiss={removeToast} />

            {/* Add Category Modal */}
            <AddCategoryModal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                onSubmit={handleAddCategory}
            />

            {/* Edit Category Modal */}
            <EditCategoryModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSubmit={handleUpdateCategory}
                categoryId={selectedCategory?.categoryID || null}
            />
        </div>
    );
};
