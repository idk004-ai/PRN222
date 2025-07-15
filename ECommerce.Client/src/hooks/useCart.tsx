import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Cart } from '../types/cart';
import { cartSignalRService } from '../services/cartSignalRService';
import { cartCookieService } from '../services/cartCookieService';

interface CartContextType {
    cart: Cart;
    addToCart: (product: any) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    isLoading: boolean;
    isConnected: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    // Initialize cart from cookie or use mock data
    const [cart, setCart] = useState<Cart>(() => {
        const savedCart = cartCookieService.loadCart();

        if (savedCart) {
            return savedCart;
        }

        // Fallback to mock data if no saved cart
        return {
            items: [
                // Mock data for demo
                {
                    productId: 1,
                    name: "Premium Wireless Headphones",
                    unitPrice: 299.99,
                    quantity: 1,
                    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
                    altText: "Wireless headphones",
                    unitInStock: 15,
                    size: "One Size",
                    maxQuantity: 5
                },
                {
                    productId: 2,
                    name: "Smart Watch Series X",
                    unitPrice: 399.99,
                    quantity: 2,
                    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
                    altText: "Smart watch",
                    unitInStock: 3,
                    size: "42mm",
                    maxQuantity: 3
                },
                {
                    productId: 3,
                    name: "Wireless Bluetooth Speaker",
                    unitPrice: 149.99,
                    quantity: 1,
                    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
                    altText: "Bluetooth speaker",
                    unitInStock: 8,
                    maxQuantity: 10
                }
            ],
            totalAmount: 0,
            totalItems: 0
        };
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    // Calculate totals whenever cart items change
    useEffect(() => {
        const totalAmount = cart.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

        setCart(prev => ({
            ...prev,
            totalAmount,
            totalItems
        }));
    }, [cart.items]);

    // Save cart to cookie whenever cart changes
    useEffect(() => {
        cartCookieService.saveCart(cart);
    }, [cart]);



    // Initialize SignalR connection
    useEffect(() => {
        let isComponentMounted = true;
        const initializeSignalR = async () => {
            if (!isComponentMounted) return;
            try {
                await cartSignalRService.startConnection();
                setIsConnected(true);

                // Mock user ID - in real app, get from auth context
                const userId = "user123";
                await cartSignalRService.joinCartGroup(userId);

                // Set up event listeners
                cartSignalRService.onCartItemUpdated((cartItem) => {
                    console.log('Cart item updated via SignalR:', cartItem);
                    // Update local cart state
                });

                cartSignalRService.onCartItemRemoved((productId) => {
                    console.log('Cart item removed via SignalR:', productId);
                    setCart(prev => ({
                        ...prev,
                        items: prev.items.filter(item => item.productId !== productId)
                    }));
                });

                cartSignalRService.onCartCleared(() => {
                    console.log('Cart cleared via SignalR');
                    setCart(prev => ({
                        ...prev,
                        items: []
                    }));
                });

                cartSignalRService.onCartCountUpdated((count) => {
                    console.log('Cart count updated via SignalR:', count);
                });

            } catch (error) {
                console.error('Failed to initialize SignalR:', error);
                setIsConnected(false);
            }
        };

        initializeSignalR();

        return () => {
            isComponentMounted = false;
            cartSignalRService.stopConnection();
        };
    }, []);

    const addToCart = (product: any) => {
        setIsLoading(true);
        try {
            const existingItem = cart.items.find(item => item.productId === product.productId);

            if (existingItem) {
                updateQuantity(product.productId, existingItem.quantity + 1);
            } else {
                const newItem: CartItem = {
                    productId: product.productId,
                    name: product.name,
                    unitPrice: product.unitPrice,
                    quantity: 1,
                    imageUrl: product.imageUrl,
                    altText: product.altText,
                    unitInStock: product.unitInStock,
                    size: product.size,
                    maxQuantity: product.unitInStock || 10
                };

                setCart(prev => ({
                    ...prev,
                    items: [...prev.items, newItem]
                }));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const updateQuantity = (productId: number, quantity: number) => {
        setCart(prev => ({
            ...prev,
            items: prev.items.map(item =>
                item.productId === productId
                    ? { ...item, quantity }
                    : item
            )
        }));
    };

    const removeFromCart = (productId: number) => {
        setCart(prev => ({
            ...prev,
            items: prev.items.filter(item => item.productId !== productId)
        }));
    };

    const clearCart = () => {
        setCart(prev => ({
            ...prev,
            items: []
        }));
        cartCookieService.clearCart();
    };

    const contextValue: CartContextType = {
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isLoading,
        isConnected
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
