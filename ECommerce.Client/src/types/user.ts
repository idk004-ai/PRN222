export interface Product {
    productId: number;
    name: string;
    quantityPerUnit?: string | null;
    unitPrice: number;
    oldPrice?: number | null;
    unitWeight?: string | null;
    size?: string | null;
    discount?: number | null;
    unitInStock?: number | null;
    unitOnOrder?: number | null;
    productAvailable?: boolean;
    imageUrl?: string | null;
    altText?: string | null;
    addBadge?: boolean;
    offerTitle?: string | null;
    offerBadgeClass?: string | null;
    shortDescription?: string | null;
    longDescription?: string | null;
    picture1?: string | null;
    picture2?: string | null;
    picture3?: string | null;
    picture4?: string | null;
    note?: string | null;
    categoryId?: number;
    categoryName?: string;
    subCategoryId?: number;
    subCategoryName?: string;
    supplierId?: number;
    companyName?: string;
}

export interface Banner {
    mainSliderId: number;
    imageUrl?: string;
    altText?: string;
    offerTag?: string;
    title?: string;
    description?: string;
    btnText?: string;
}
