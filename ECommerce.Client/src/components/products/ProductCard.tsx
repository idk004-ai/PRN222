import { Edit, Trash2, Eye } from 'lucide-react';
import { productService } from '../../services/productService';
import type { Product } from '../../types/product';

interface ProductCardProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    onView: (product: Product) => void;
}

const getStatusColor = (product: Product) => {
    if (!product.productAvailable) {
        return 'bg-red-100 text-red-800';
    }
    if (!product.unitInStock || product.unitInStock === 0) {
        return 'bg-red-100 text-red-800';
    }
    if (product.unitInStock < 10) {
        return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-green-100 text-green-800';
};

const getStockStatus = (product: Product) => {
    if (!product.productAvailable) {
        return { text: 'Ngừng bán', color: 'text-red-600' };
    }
    if (!product.unitInStock || product.unitInStock === 0) {
        return { text: 'Hết hàng', color: 'text-red-600' };
    }
    if (product.unitInStock < 10) {
        return { text: 'Sắp hết', color: 'text-yellow-600' };
    }
    return { text: 'Còn hàng', color: 'text-green-600' };
};

export const ProductCard = ({ product, onEdit, onDelete, onView }: ProductCardProps) => {
    const stockStatus = getStockStatus(product);
    const imageUrl = productService.getPrimaryImageUrl(product);
    const hasDiscount = productService.hasDiscount(product);
    const discountPercentage = productService.getDiscountPercentage(product);

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Product Image */}
            <div className="aspect-square relative">
                <img
                    src={imageUrl}
                    alt={product.altText || product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=${encodeURIComponent(product.name)}`;
                    }}
                />

                {/* Discount Badge */}
                {hasDiscount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        -{discountPercentage}%
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product)}`}>
                        {stockStatus.text}
                    </span>
                </div>

                {/* Offer Badge */}
                {product.addBadge && product.offerTitle && (
                    <div className={`absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-bold ${product.offerBadgeClass?.includes('sale') ? 'bg-green-500 text-white' :
                            product.offerBadgeClass?.includes('sold-out') ? 'bg-gray-500 text-white' :
                                'bg-blue-500 text-white'
                        }`}>
                        {product.offerTitle}
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4">
                <div className="mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-600 truncate">
                        {product.shortDescription || product.longDescription}
                    </p>
                </div>

                <div className="mb-3">
                    <div className="flex items-center space-x-2">
                        <p className="text-xl font-bold text-gray-900">
                            {productService.formatPrice(product.unitPrice)}
                        </p>
                        {product.oldPrice && product.oldPrice > product.unitPrice && (
                            <p className="text-sm text-gray-500 line-through">
                                {productService.formatPrice(product.oldPrice)}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-500">ID: {product.productId}</span>
                        <span className={`text-sm font-medium ${stockStatus.color}`}>
                            {stockStatus.text}
                        </span>
                    </div>
                </div>

                <div className="mb-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Tồn kho: {product.unitInStock || 0}</span>
                        <span>{product.categoryName}</span>
                    </div>
                    {product.subCategoryName && (
                        <p className="text-sm text-gray-500 mt-1">
                            Phân loại: {product.subCategoryName.trim()}
                        </p>
                    )}
                    {product.companyName && (
                        <p className="text-sm text-gray-500 mt-1">
                            Nhà cung cấp: {product.companyName}
                        </p>
                    )}
                    {product.quantityPerUnit && (
                        <p className="text-sm text-gray-500 mt-1">
                            Đơn vị: {product.quantityPerUnit}
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => onView(product)}
                        className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center"
                    >
                        <Eye className="w-4 h-4 mr-1" />
                        Xem
                    </button>
                    <button
                        onClick={() => onEdit(product)}
                        className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-green-100 transition-colors flex items-center justify-center"
                    >
                        <Edit className="w-4 h-4 mr-1" />
                        Sửa
                    </button>
                    <button
                        onClick={() => onDelete(product)}
                        className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center"
                    >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
};
