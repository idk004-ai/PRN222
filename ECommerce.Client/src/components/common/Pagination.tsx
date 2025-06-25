import React from 'react';

export interface PaginationInfo {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

interface PaginationProps {
    pagination: PaginationInfo;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    pageSizeOptions?: number[];
    className?: string;
    showPageSizeSelector?: boolean;
    showPageInfo?: boolean;
    maxVisiblePages?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
    pagination,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [6, 12, 24, 48],
    className = '',
    showPageSizeSelector = true,
    showPageInfo = true,
    maxVisiblePages = 5
}) => {
    // Don't render if there's only one page
    if (pagination.totalPages <= 1) {
        return null;
    }

    // Render page numbers with ellipsis
    const renderPageNumbers = () => {
        const pages = [];
        const currentPage = pagination.pageNumber;
        const totalPages = pagination.totalPages;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Add ellipsis at the beginning if needed
        if (startPage > 1) {
            pages.push(
                <button
                    key={1}
                    onClick={() => onPageChange(1)}
                    className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(
                    <span key="ellipsis-start" className="px-2 text-gray-500">
                        ...
                    </span>
                );
            }
        }

        // Add page number buttons
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`px-3 py-2 text-sm rounded transition-colors ${
                        i === currentPage
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    {i}
                </button>
            );
        }

        // Add ellipsis at the end if needed
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <span key="ellipsis-end" className="px-2 text-gray-500">
                        ...
                    </span>
                );
            }
            pages.push(
                <button
                    key={totalPages}
                    onClick={() => onPageChange(totalPages)}
                    className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className={`flex flex-col items-center space-y-4 ${className}`}>
            {/* Page Size Selector */}
            {showPageSizeSelector && (
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Show:</span>
                    <select
                        value={pagination.pageSize}
                        onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
                        className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {pageSizeOptions.map(size => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                    <span className="text-sm text-gray-600">items per page</span>
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex items-center space-x-1">
                {/* First Page */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={pagination.pageNumber === 1}
                    className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                    title="First Page"
                >
                    ««
                </button>

                {/* Previous Page */}
                <button
                    onClick={() => onPageChange(pagination.pageNumber - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                    title="Previous Page"
                >
                    ‹ Previous
                </button>

                {/* Page Numbers */}
                {renderPageNumbers()}

                {/* Next Page */}
                <button
                    onClick={() => onPageChange(pagination.pageNumber + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                    title="Next Page"
                >
                    Next ›
                </button>

                {/* Last Page */}
                <button
                    onClick={() => onPageChange(pagination.totalPages)}
                    disabled={pagination.pageNumber === pagination.totalPages}
                    className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                    title="Last Page"
                >
                    »»
                </button>
            </div>

            {/* Page Info */}
            {showPageInfo && (
                <div className="text-sm text-gray-600">
                    Page {pagination.pageNumber} of {pagination.totalPages}
                    {pagination.totalRecords > 0 && (
                        <span> ({pagination.totalRecords.toLocaleString()} total items)</span>
                    )}
                </div>
            )}
        </div>
    );
};
