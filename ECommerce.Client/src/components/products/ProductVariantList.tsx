import { Tag, Package } from 'lucide-react';
import type { ProductVariant } from '../../types/product';

interface ProductVariantCardProps {
    variant: ProductVariant;
    isSelected: boolean;
    onSelect: (variant: ProductVariant) => void;
}

export const ProductVariantCard = ({ variant, isSelected, onSelect }: ProductVariantCardProps) => {
    const isAvailable = variant.isActive && (variant.stockQuantity || 0) > 0;

    return (
        <button
            onClick={() => onSelect(variant)}
            disabled={!isAvailable}
            className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : isAvailable
                    ? 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                    : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
            }`}
        >
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className={`font-medium text-sm ${
                        isSelected ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                        {variant.variantType}
                    </span>
                </div>
                {!isAvailable && (
                    <span className="text-xs text-red-500 font-medium">
                        Out of Stock
                    </span>
                )}
            </div>

            <div className="space-y-1">
                <h4 className={`font-semibold text-sm ${
                    isSelected ? 'text-blue-800' : 'text-gray-800'
                }`}>
                    {variant.variantValue}
                </h4>
                
                {variant.variantName !== variant.variantValue && (
                    <p className="text-xs text-gray-500 truncate">
                        {variant.variantName}
                    </p>
                )}

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Package className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                            Stock: {variant.stockQuantity || 0}
                        </span>
                    </div>
                    {variant.additionalPrice && variant.additionalPrice > 0 && (
                        <span className="text-xs font-medium text-green-600">
                            +${variant.additionalPrice.toFixed(2)}
                        </span>
                    )}
                </div>

                {variant.variantSKU && (
                    <p className="text-xs text-gray-400 font-mono">
                        SKU: {variant.variantSKU}
                    </p>
                )}
            </div>
        </button>
    );
};

interface ProductVariantListProps {
    variants: ProductVariant[];
    selectedVariant: ProductVariant | null;
    onVariantSelect: (variant: ProductVariant) => void;
}

export const ProductVariantList = ({ variants, selectedVariant, onVariantSelect }: ProductVariantListProps) => {
    if (!variants || variants.length === 0) {
        return null;
    }

    // Group variants by type
    const variantGroups = variants.reduce((acc: Record<string, ProductVariant[]>, variant) => {
        if (!acc[variant.variantType]) {
            acc[variant.variantType] = [];
        }
        acc[variant.variantType].push(variant);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Available Variants</h3>
            
            {Object.entries(variantGroups).map(([variantType, typeVariants]) => (
                <div key={variantType} className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                        {variantType} ({typeVariants.length} options)
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {typeVariants.map((variant) => (
                            <ProductVariantCard
                                key={variant.variantID}
                                variant={variant}
                                isSelected={selectedVariant?.variantID === variant.variantID}
                                onSelect={onVariantSelect}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
