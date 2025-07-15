export interface CartItem {
    productId: number;
    name: string;
    unitPrice: number;
    quantity: number;
    imageUrl?: string | null;
    altText?: string | null;
    unitInStock?: number | null;
    size?: string | null;
    maxQuantity?: number;
}

export interface Cart {
    items: CartItem[];
    totalAmount: number;
    totalItems: number;
}

export interface CartSummary {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
}
