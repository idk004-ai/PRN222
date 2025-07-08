import axios from 'axios';
import type { Product, ProductListResponse, ProductFilter, ProductFormData, CreateProductFormData, Supplier, Category, SubCategory, LegacyProduct } from '../types/product';

const API_BASE_URL = import.meta.env.VITE_BASE_API || 'http://localhost:5214/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const productService = {
    // Get all products with filtering and pagination
    getProducts: async (page = 1, pageSize = 10, filters?: ProductFilter): Promise<ProductListResponse> => {
        try {
            // Build query parameters
            const params = new URLSearchParams();
            params.append('pageNumber', page.toString());
            params.append('pageSize', pageSize.toString());

            if (filters?.search) {
                params.append('searchTerm', filters.search);
            }
            if (filters?.category) {
                params.append('categoryId', filters.category);
            }
            if (filters?.minPrice) {
                params.append('minPrice', filters.minPrice.toString());
            }
            if (filters?.maxPrice) {
                params.append('maxPrice', filters.maxPrice.toString());
            }
            if (filters?.sortBy) {
                params.append('sortBy', filters.sortBy);
            }
            if (filters?.sortOrder) {
                params.append('sortDesc', filters.sortOrder === 'desc' ? 'true' : 'false');
            }

            const response = await api.get(`/products?${params.toString()}`);
            return response.data as ProductListResponse;
        } catch (error) {
            console.error('Error fetching products:', error);
            // Return mock data structure on error
            return {
                data: [],
                pageNumber: 1,
                pageSize: 10,
                totalRecords: 0,
                totalPages: 0,
                hasPreviousPage: false,
                hasNextPage: false
            };
        }
    },

    // Get single product by ID
    getProductById: async (id: number): Promise<Product | null> => {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            return null;
        }
    },

    // Transform Product to LegacyProduct for backward compatibility
    transformToLegacyProduct: (product: Product): LegacyProduct => {
        return {
            id: product.productId,
            name: product.name,
            description: product.shortDescription || product.longDescription || '',
            price: product.unitPrice,
            stock: product.unitInStock || 0,
            category: product.categoryName || 'Uncategorized',
            brand: product.companyName,
            image: product.imageUrl || product.picture1 || `https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=${encodeURIComponent(product.name)}`,
            sku: `SKU${product.productId}`,
            status: product.productAvailable ? 'active' : 'inactive',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    },

    // Get products in legacy format for backward compatibility
    getLegacyProducts: async (filters?: ProductFilter): Promise<LegacyProduct[]> => {
        try {
            const response = await productService.getProducts(1, 100, filters);
            return response.data.map(productService.transformToLegacyProduct);
        } catch (error) {
            console.error('Error fetching legacy products:', error);
            return [];
        }
    },

    // Create new product
    createProduct: async (productData: CreateProductFormData): Promise<Product | null> => {
        try {
            const response = await api.post('/products', productData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    // Update existing product
    updateProduct: async (id: number, productData: Partial<ProductFormData>): Promise<Product | null> => {
        try {
            const response = await api.put(`/products/${id}`, productData);
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    // Delete product
    deleteProduct: async (id: number): Promise<boolean> => {
        try {
            await api.delete(`/products/${id}`);
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            return false;
        }
    },

    // Upload product image
    uploadProductImage: async (file: File): Promise<string | null> => {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await api.post('/products/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data.imageUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    },

    // Get categories
    getCategories: async (): Promise<Category[]> => {
        try {
            const response = await api.get('/categories');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    },

    // Get subcategories
    getSubCategories: async (categoryId?: number): Promise<SubCategory[]> => {
        try {
            const url = categoryId ? `/subcategories/by-category/${categoryId}` : '/subcategories';
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching subcategories:', error);
            return [];
        }
    },

    // Get suppliers
    getSuppliers: async (): Promise<Supplier[]> => {
        try {
            const response = await api.get('/suppliers');
            return response.data;
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            return [];
        }
    },

    // Helper function to format price
    formatPrice: (price: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    },

    // Helper function to get product status display text
    getStatusDisplay: (product: Product): string => {
        if (!product.productAvailable) return 'Hết hàng';
        if ((product.unitInStock || 0) === 0) return 'Tạm hết';
        if ((product.unitInStock || 0) < 10) return 'Sắp hết';
        return 'Còn hàng';
    },

    // Helper function to check if product has discount
    hasDiscount: (product: Product): boolean => {
        return !!(product.discount && product.discount > 0) || !!(product.oldPrice && product.oldPrice > product.unitPrice);
    },

    // Helper function to calculate discount percentage
    getDiscountPercentage: (product: Product): number => {
        if (product.discount && product.discount > 0) {
            return product.discount;
        }
        if (product.oldPrice && product.oldPrice > product.unitPrice) {
            return Math.round((1 - product.unitPrice / product.oldPrice) * 100);
        }
        return 0;
    },

    // Helper function to get primary image URL
    getPrimaryImageUrl: (product: Product): string => {
        return product.imageUrl ||
            product.picture1 ||
            `https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=${encodeURIComponent(product.name)}`;
    },

    // Helper function to get all product images
    getAllImages: (product: Product): string[] => {
        const images: string[] = [];
        if (product.imageUrl) images.push(product.imageUrl);
        if (product.picture1) images.push(product.picture1);
        if (product.picture2) images.push(product.picture2);
        if (product.picture3) images.push(product.picture3);
        if (product.picture4) images.push(product.picture4);

        // If no images, return placeholder
        if (images.length === 0) {
            images.push(`https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=${encodeURIComponent(product.name)}`);
        }

        return images;
    }
};

export default productService;
