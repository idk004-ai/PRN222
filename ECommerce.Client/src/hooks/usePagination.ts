import { useState, useEffect } from 'react';
import type { PaginationInfo } from '../components/common/Pagination';

interface UsePaginationOptions<T> {
    initialPageSize?: number;
    onLoadData: (page: number, pageSize: number, ...args: any[]) => Promise<{
        data: T[];
        pageNumber: number;
        pageSize: number;
        totalRecords: number;
        totalPages: number;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
    }>;
    dependencies?: any[];
}

interface UsePaginationReturn<T> {
    data: T[];
    pagination: PaginationInfo;
    loading: boolean;
    error: string | null;
    loadData: (page?: number, pageSize?: number, ...args: any[]) => Promise<void>;
    handlePageChange: (page: number) => void;
    handlePageSizeChange: (pageSize: number) => void;
    refresh: () => void;
}

export function usePagination<T>({
    initialPageSize = 10,
    onLoadData,
    dependencies = []
}: UsePaginationOptions<T>): UsePaginationReturn<T> {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationInfo>({
        pageNumber: 1,
        pageSize: initialPageSize,
        totalRecords: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false
    });

    const loadData = async (page = 1, pageSize?: number, ...args: any[]) => {
        try {
            setLoading(true);
            setError(null);

            const currentPageSize = pageSize || pagination.pageSize;
            const response = await onLoadData(page, currentPageSize, ...args);

            setData(response.data);
            setPagination({
                pageNumber: response.pageNumber,
                pageSize: response.pageSize,
                totalRecords: response.totalRecords,
                totalPages: response.totalPages,
                hasPreviousPage: response.hasPreviousPage,
                hasNextPage: response.hasNextPage
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        loadData(newPage);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        loadData(1, newPageSize);
    };

    const refresh = () => {
        loadData(pagination.pageNumber);
    };

    // Load initial data and when dependencies change
    useEffect(() => {
        loadData();
    }, dependencies);

    return {
        data,
        pagination,
        loading,
        error,
        loadData,
        handlePageChange,
        handlePageSizeChange,
        refresh
    };
}
