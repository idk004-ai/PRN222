import axios from 'axios';
import type { Category, CreateCategoryFormData, UpdateCategoryFormData } from '../types/product';

const API_BASE_URL = import.meta.env.VITE_BASE_API || 'http://localhost:5214/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Define functions before using them in the exported object
const getAllCategories = async (): Promise<Category[]> => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

const getCategoryById = async (id: number): Promise<Category | null> => {
    try {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching category:', error);
        return null;
    }
};

const getPaginatedCategories = async (
    pageNumber: number = 1,
    pageSize: number = 10,
    searchTerm?: string
): Promise<{
    data: Category[];
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}> => {
    try {
        const params = new URLSearchParams();
        params.append('pageNumber', pageNumber.toString());
        params.append('pageSize', pageSize.toString());

        if (searchTerm) {
            params.append('searchTerm', searchTerm);
        }

        const response = await api.get(`/categories/paged?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching paginated categories:', error);
        throw error;
    }
};

const createCategory = async (categoryData: CreateCategoryFormData): Promise<Category> => {
    try {
        const response = await api.post('/categories', categoryData);
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

const updateCategory = async (id: number, categoryData: UpdateCategoryFormData): Promise<Category> => {
    try {
        const response = await api.put(`/categories/${id}`, categoryData);
        return response.data;
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};

const deleteCategory = async (id: number): Promise<boolean> => {
    try {
        await api.delete(`/categories/${id}`);
        return true;
    } catch (error) {
        console.error('Error deleting category:', error);
        return false;
    }
};

const getCategoriesForDropdown = async (): Promise<{ value: number; text: string }[]> => {
    try {
        const categories = await getAllCategories();
        return categories.map((category: Category) => ({
            value: category.categoryID,
            text: category.name
        }));
    } catch (error) {
        console.error('Error fetching categories for dropdown:', error);
        return [];
    }
};

export const categoryService = {
    getAllCategories,
    getCategoryById,
    getPaginatedCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoriesForDropdown
};
