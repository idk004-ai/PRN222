import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Package, Tag, Truck, Shield, Minus, Plus } from 'lucide-react';
import { productService } from '../services/productService';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/Toast';
import { ProductVariantList, AddProductVariantModal } from '../components/products';
import type { ProductDetail as ProductDetailType, ProductVariant, CreateProductVariant } from '../types/product';

export const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toasts, removeToast, success } = useToast();
    
    const [product, setProduct] = useState<ProductDetailType | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddVariantModalOpen, setIsAddVariantModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            loadProductDetail(parseInt(id));
        }
    }, [id]);

    const loadProductDetail = async (productId: number) => {
        try {
            setLoading(true);
            setError(null);
            
            const productDetail = await productService.getProductDetail(productId);
            if (productDetail) {
                setProduct(productDetail);
                setSelectedImage(productDetail.imageUrl || productDetail.picture1 || '');
                
                // Auto-select first variant if available
                if (productDetail.variants && productDetail.variants.length > 0) {
                    setSelectedVariant(productDetail.variants[0]);
                }
            } else {
                setError('Product not found');
            }
        } catch (err) {
            console.error('Error loading product detail:', err);
            setError('Failed to load product details');
        } finally {
            setLoading(false);
        }
    };

    const handleVariantSelect = (variant: ProductVariant) => {
        setSelectedVariant(variant);
    };

    const handleQuantityChange = (delta: number) => {
        const newQuantity = quantity + delta;
        const maxStock = selectedVariant?.stockQuantity || product?.unitInStock || 0;
        
        if (newQuantity >= 1 && newQuantity <= maxStock) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;
        
        const variantText = selectedVariant ? ` (${selectedVariant.variantValue})` : '';
        success('Added to Cart', `${product.name}${variantText} x${quantity} added to cart`);
    };

    // Handle create variant
    const handleCreateVariant = async (variantData: CreateProductVariant) => {
        if (!product) return;
        
        try {
            const newVariant = await productService.createProductVariant(product.productId, variantData);
            if (newVariant) {
                // Add the new variant to the existing list immediately for better UX
                setProduct(prev => prev ? {
                    ...prev,
                    variants: [...(prev.variants || []), newVariant]
                } : null);
                
                // Auto-select the new variant
                setSelectedVariant(newVariant);
                
                success('Variant Created', `New variant "${newVariant.variantValue}" has been added successfully.`);
            }
        } catch (error: any) {
            console.error('Error creating variant:', error);
            throw error; // Let the modal handle the error display
        }
    };

    // const handleAddToWishlist = () => {
    //     if (!product) return;
        
    //     success('Added to Wishlist', `${product.name} added to wishlist`);
    // };

    // const handleShare = () => {
    //     if (navigator.share) {
    //         navigator.share({
    //             title: product?.name,
    //             text: product?.shortDescription,
    //             url: window.location.href,
    //         });
    //     } else {
    //         navigator.clipboard.writeText(window.location.href);
    //         success('Link Copied', 'Product link copied to clipboard');
    //     }
    // };

    const getImages = () => {
        if (!product) return [];
        
        return [
            product.imageUrl,
            product.picture1,
            product.picture2,
            product.picture3,
            product.picture4,
        ].filter(Boolean) as string[];
    };

    const getCurrentPrice = () => {
        if (!product) return 0;
        
        if (selectedVariant) {
            return product.unitPrice + (selectedVariant.additionalPrice || 0);
        }
        
        return product.unitPrice;
    };

    const getAvailableStock = () => {
        if (selectedVariant) {
            return selectedVariant.stockQuantity || 0;
        }
        return product?.unitInStock || 0;
    };

    const isInStock = () => {
        return getAvailableStock() > 0 && (product?.productAvailable ?? false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-red-600 text-xl mb-4">{error || 'Product not found'}</div>
                <button
                    onClick={() => navigate('/products')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Back to Products
                </button>
            </div>
        );
    }

    const images = getImages();
    const currentPrice = getCurrentPrice();
    const availableStock = getAvailableStock();

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                <button
                    onClick={() => navigate('/admin/products')}
                    className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Products</span>
                </button>
                <span>/</span>
                <span>{product.categoryName}</span>
                <span>/</span>
                <span className="text-gray-900">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-16 h-16 text-gray-400" />
                            </div>
                        )}
                    </div>

                    {/* Thumbnail Images */}
                    {images.length > 1 && (
                        <div className="flex space-x-2">
                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(image)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                                        selectedImage === image
                                            ? 'border-blue-500'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                                    />
                                ))}
                                <span className="text-sm text-gray-600 ml-2">(4.5) 123 reviews</span>
                            </div>
                            {/* Only show wish list and share feature with user having USER role */}
                            {/* <div className="flex items-center space-x-2">
                                <button
                                    onClick={handleAddToWishlist}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Add to Wishlist"
                                >
                                    <Heart className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                                    title="Share"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div> */}
                        </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                            <span className="text-3xl font-bold text-blue-600">
                                ${currentPrice.toFixed(2)}
                            </span>
                            {product.oldPrice && product.oldPrice > currentPrice && (
                                <span className="text-lg text-gray-500 line-through">
                                    ${product.oldPrice.toFixed(2)}
                                </span>
                            )}
                            {product.discount && (
                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                                    -{product.discount}% OFF
                                </span>
                            )}
                        </div>
                        {selectedVariant && selectedVariant.additionalPrice && selectedVariant.additionalPrice > 0 && (
                            <p className="text-sm text-gray-600">
                                Base price: ${product.unitPrice.toFixed(2)} + ${selectedVariant.additionalPrice.toFixed(2)} for {selectedVariant.variantValue}
                            </p>
                        )}
                    </div>

                    {/* Variants */}
                    <div className="space-y-3">
                        {product.variants && product.variants.length > 0 ? (
                            <>
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => setIsAddVariantModalOpen(true)}
                                        className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors flex items-center space-x-1"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add Variant</span>
                                    </button>
                                </div>
                                <ProductVariantList
                                    variants={product.variants}
                                    selectedVariant={selectedVariant}
                                    onVariantSelect={handleVariantSelect}
                                />
                            </>
                        ) : (
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="flex items-center space-x-2">
                                    <Package className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-600">No variants available</span>
                                </div>
                                <button
                                    onClick={() => setIsAddVariantModalOpen(true)}
                                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add First Variant</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center space-x-2">
                        <Package className="w-5 h-5 text-gray-400" />
                        <span className={`text-sm font-medium ${
                            isInStock() ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {isInStock() 
                                ? `In Stock (${availableStock} available)` 
                                : 'Out of Stock'
                            }
                        </span>
                    </div>

                    {/* Quantity and Add to Cart */}
                    {isInStock() && (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                        className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-4 py-2 text-lg font-medium">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= availableStock}
                                        className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                <span>Add to Cart</span>
                            </button>
                        </div>
                    )}

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                        <div className="flex items-center space-x-3">
                            <Truck className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-gray-600">Free Shipping</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Shield className="w-5 h-5 text-blue-600" />
                            <span className="text-sm text-gray-600">1 Year Warranty</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Package className="w-5 h-5 text-purple-600" />
                            <span className="text-sm text-gray-600">Easy Returns</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Tag className="w-5 h-5 text-orange-600" />
                            <span className="text-sm text-gray-600">Best Price</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Description */}
            {(product.shortDescription || product.longDescription) && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        {product.shortDescription && (
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Overview</h3>
                                <p className="text-gray-600">{product.shortDescription}</p>
                            </div>
                        )}
                        {product.longDescription && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Details</h3>
                                <div className="text-gray-600 whitespace-pre-wrap">{product.longDescription}</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Product Specifications */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {[
                            { label: 'Category', value: product.categoryName },
                            { label: 'Brand', value: product.companyName },
                            { label: 'Weight', value: product.unitWeight },
                            { label: 'Size', value: product.size },
                            { label: 'Quantity Per Unit', value: product.quantityPerUnit },
                            { label: 'Units on Order', value: product.unitOnOrder },
                        ].filter(spec => spec.value).map((spec, index) => (
                            <div
                                key={spec.label}
                                className={`px-6 py-4 ${
                                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                }`}
                            >
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-900">{spec.label}:</span>
                                    <span className="text-gray-600">{spec.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Toast notifications */}
            <ToastContainer toasts={toasts} onDismiss={removeToast} />

            {/* Add Product Variant Modal */}
            {product && (
                <AddProductVariantModal
                    isOpen={isAddVariantModalOpen}
                    onClose={() => setIsAddVariantModalOpen(false)}
                    onSubmit={handleCreateVariant}
                    productId={product.productId}
                    productName={product.name}
                />
            )}
        </div>
    );
};
