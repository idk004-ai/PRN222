import Cookies from 'js-cookie';
import type { Cart } from '../types/cart';

const CART_COOKIE_KEY = 'ecommerce_cart';
const COOKIE_EXPIRES_DAYS = 7; // Cookie expires in 7 days

export const cartCookieService = {
    // Save cart to cookie
    saveCart: (cart: Cart): void => {
        try {
            const cartData = {
                items: cart.items,
                totalAmount: cart.totalAmount,
                totalItems: cart.totalItems
            };

            Cookies.set(CART_COOKIE_KEY, JSON.stringify(cartData), {
                expires: COOKIE_EXPIRES_DAYS,
                secure: window.location.protocol === 'https:',
                sameSite: 'strict'
            });
        } catch (error) {
            console.error('Failed to save cart to cookie:', error);
        }
    },

    // Load cart from cookie
    loadCart: (): Cart | null => {
        try {
            const cartCookie = Cookies.get(CART_COOKIE_KEY);

            if (!cartCookie) {
                return null;
            }

            const cartData = JSON.parse(cartCookie);

            // Validate cart data structure
            if (!cartData.items || !Array.isArray(cartData.items)) {
                return null;
            }

            return {
                items: cartData.items,
                totalAmount: cartData.totalAmount || 0,
                totalItems: cartData.totalItems || 0
            };
        } catch (error) {
            console.error('Failed to load cart from cookie:', error);
            return null;
        }
    },

    // Clear cart cookie
    clearCart: (): void => {
        try {
            Cookies.remove(CART_COOKIE_KEY);
        } catch (error) {
            console.error('Failed to clear cart cookie:', error);
        }
    }
};
