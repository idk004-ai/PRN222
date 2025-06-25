export interface Product {
    productId: number;
    name: string;
    supplierId: number;
    categoryId: number;
    subCategoryId?: number;
    quantityPerUnit?: string;
    unitPrice: number;
    oldPrice?: number;
    unitWeight?: string;
    size?: string;
    discount?: number;
    unitInStock?: number;
    unitOnOrder?: number;
    productAvailable?: boolean;
    imageUrl?: string;
    altText?: string;
    addBadge?: boolean;
    offerTitle?: string;
    offerBadgeClass?: string;
    shortDescription?: string;
    longDescription?: string;
    picture1?: string;
    picture2?: string;
    picture3?: string;
    picture4?: string;
    note?: string;
    // Navigation properties
    categoryName?: string;
    subCategoryName?: string;
    companyName?: string;
}

export interface ProductListResponse {
    data: Product[];
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

// Keep the legacy Product interface for backward compatibility
export interface LegacyProduct {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    brand?: string;
    image?: string;
    sku: string;
    status: 'active' | 'inactive' | 'out_of_stock';
    createdAt: string;
    updatedAt: string;
}

export interface ProductFilter {
    search?: string;
    category?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    priceRange?: {
        min: number;
        max: number;
    };
    sortBy?: 'name' | 'price' | 'stock' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export interface ProductFormData {
    name: string;
    supplierID: number;
    categoryID: number;
    subCategoryID?: number;
    quantityPerUnit?: string;
    unitPrice: number;
    oldPrice?: number;
    unitWeight?: string;
    size?: string;
    discount?: number;
    unitInStock?: number;
    unitOnOrder?: number;
    productAvailable: boolean;
    addBadge: boolean;
    offerTitle?: string;
    offerBadgeClass?: string;
    shortDescription?: string;
    longDescription?: string;
    altText?: string;
    note?: string;
    imageFile?: File | null;
    picture1File?: File | null;
    picture2File?: File | null;
    picture3File?: File | null;
    picture4File?: File | null;
}

export interface Supplier {
    id: number;
    name: string;
    contactName?: string;
    phone?: string;
    email?: string;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
    parentCategoryID?: number;
}

export interface SubCategory {
    id: number;
    name: string;
    categoryID: number;
    description?: string;
}
