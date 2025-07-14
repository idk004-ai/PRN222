import { useState, useEffect } from 'react';
import type { Product, Banner } from '../types/user';

export const useUserDashboardData = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch products
                const productsResponse = await fetch('http://localhost:5214/api/products');
                if (productsResponse.ok) {
                    const responseData = await productsResponse.json();
                    console.log('API Response:', responseData); // Debug log
                    // API trả về { data: [...], pageNumber, pageSize, ... }
                    const productsData = responseData.data || [];
                    console.log('Products Data:', productsData); // Debug log
                    // setProducts(productsData.slice(0, 12)); // Limit to 12 products
                    setProducts(productsData);
                } else {
                    console.error('Failed to fetch products:', productsResponse.status);
                }

                // Mock banners data (since we don't have slider API yet)
                setBanners([
                    {
                        mainSliderId: 1,
                        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
                        altText: 'Special Offer',
                        offerTag: 'SALE UP TO 50%',
                        title: 'Summer Collection',
                        description: 'Discover our latest summer collection with amazing discounts',
                        btnText: 'Shop Now'
                    },
                    {
                        mainSliderId: 2,
                        imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=400&fit=crop',
                        altText: 'New Arrivals',
                        offerTag: 'NEW ARRIVALS',
                        title: 'Fashion Trends 2025',
                        description: 'Stay ahead with the latest fashion trends',
                        btnText: 'Explore'
                    }
                ]);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { products, banners, loading };
};
