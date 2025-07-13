import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, ShoppingBag, Heart, Settings, LogOut, ChevronDown } from 'lucide-react';

interface Product {
  productId: number;
  name: string;
  unitPrice: number;
  oldPrice?: number;
  imageUrl?: string;
  altText?: string;
  discount?: number;
  addBadge?: boolean;
}

interface Banner {
  mainSliderId: number;
  imageUrl?: string;
  altText?: string;
  offerTag?: string;
  title?: string;
  description?: string;
  btnText?: string;
}

export const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch products and banners
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await fetch('http://localhost:5214/api/products');
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData.slice(0, 12)); // Limit to 12 products
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

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">
                ECommerce
              </h1>
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.firstName} {user?.lastName}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">@{user?.userName}</p>
                    </div>

                    {/* Menu Items */}
                    <a
                      href="#profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4 mr-3" />
                      User Profile
                    </a>
                    <a
                      href="#orders"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ShoppingBag className="w-4 h-4 mr-3" />
                      My Orders
                    </a>
                    <a
                      href="#wishlist"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Heart className="w-4 h-4 mr-3" />
                      Wishlist
                    </a>
                    <a
                      href="#settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </a>
                    
                    <div className="border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Banner Section */}
      <section className="relative">
        {banners.length > 0 && (
          <div className="relative h-96 bg-gradient-to-r from-indigo-500 to-purple-600 overflow-hidden">
            <img
              src={banners[0].imageUrl}
              alt={banners[0].altText}
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                {banners[0].offerTag && (
                  <span className="inline-block bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    {banners[0].offerTag}
                  </span>
                )}
                <h2 className="text-4xl md:text-6xl font-bold mb-4">
                  {banners[0].title}
                </h2>
                <p className="text-lg md:text-xl mb-8 max-w-2xl">
                  {banners[0].description}
                </p>
                {banners[0].btnText && (
                  <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    {banners[0].btnText}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
          <p className="text-gray-600">Discover our best-selling items</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.productId} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
                <div className="relative">
                  <img
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop'}
                    alt={product.altText || product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.addBadge && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      New
                    </span>
                  )}
                  {product.discount && product.discount > 0 && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-indigo-600">
                        ${product.unitPrice}
                      </span>
                      {product.oldPrice && product.oldPrice > product.unitPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.oldPrice}
                        </span>
                      )}
                    </div>
                    
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products available at the moment.</p>
          </div>
        )}
      </section>
    </div>
  );
};
