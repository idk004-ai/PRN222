import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { FormField } from '../ui/FormField';
import { Button } from '../ui/Button';
import type { CreateProductVariant } from '../../types/product';
import { createProductVariantSchema, type CreateProductVariantFormSchema } from '../../schemas/productVariantSchema';
import { productService } from '../../services/productService';

interface AddProductVariantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateProductVariant) => Promise<void>;
    productId: number;
    productName: string;
}

export const AddProductVariantModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    productId, 
    productName 
}: AddProductVariantModalProps) => {
    const [variantTypes, setVariantTypes] = useState<string[]>([]);
    const [customVariantType, setCustomVariantType] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<CreateProductVariantFormSchema>({
        resolver: zodResolver(createProductVariantSchema) as Resolver<CreateProductVariantFormSchema>,
        mode: 'onBlur',
        defaultValues: {
            additionalPrice: 0,
            stockQuantity: 0,
        }
    });

    // Load variant types when modal opens
    useEffect(() => {
        if (isOpen) {
            loadVariantTypes();
        }
    }, [isOpen]);

    const loadVariantTypes = async () => {
        try {
            const types = await productService.getVariantTypes();
            setVariantTypes(types);
        } catch (error) {
            console.error('Error loading variant types:', error);
            // Use fallback types
            setVariantTypes(['Color', 'Size', 'Material', 'Style', 'Pattern']);
        }
    };

    // Watch variantType and variantValue to auto-generate variantName
    const variantType = watch('variantType');
    const variantValue = watch('variantValue');

    // Helper function to get input className with validation state
    const getInputClassName = (fieldName: keyof CreateProductVariantFormSchema, baseClassName: string = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2") => {
        const hasError = errors[fieldName];
        const errorClasses = hasError
            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500";
        return `${baseClassName} ${errorClasses}`;
    };

    // Generate suggested variant name
    const getSuggestedVariantName = () => {
        if (variantType && variantValue) {
            return `${variantValue} ${productName}`;
        }
        return '';
    };

    // Handle form submission
    const handleFormSubmit = async (data: CreateProductVariantFormSchema) => {
        try {
            // Auto-generate variant name if not provided
            const variantName = data.variantName || getSuggestedVariantName();
            
            const variantData: CreateProductVariant = {
                productID: productId,
                variantName,
                variantType: data.variantType,
                variantValue: data.variantValue,
                additionalPrice: data.additionalPrice || 0,
                stockQuantity: data.stockQuantity || 0,
                variantSKU: data.variantSKU || undefined,
            };

            await onSubmit(variantData);
            reset();
            setShowCustomInput(false);
            setCustomVariantType('');
            onClose();
        } catch (error) {
            console.error('Error submitting variant:', error);
        }
    };

    // Handle modal close
    const handleClose = () => {
        reset();
        setShowCustomInput(false);
        setCustomVariantType('');
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={`Add Variant for "${productName}"`}
            size="md"
        >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                {/* Variant Type */}
                <FormField
                    label="Variant Type"
                    required
                    error={errors.variantType?.message}
                >
                    <div className="space-y-3">
                        <select
                            className={getInputClassName('variantType')}
                            {...register('variantType')}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === 'custom') {
                                    setShowCustomInput(true);
                                    setValue('variantType', '');
                                } else {
                                    setShowCustomInput(false);
                                    setValue('variantType', value);
                                }
                            }}
                        >
                            <option value="">Select variant type...</option>
                            {variantTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                            <option value="custom">Other (Custom)</option>
                        </select>
                        
                        {showCustomInput && (
                            <input
                                type="text"
                                placeholder="Enter custom variant type"
                                className={getInputClassName('variantType')}
                                value={customVariantType}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setCustomVariantType(value);
                                    setValue('variantType', value);
                                }}
                            />
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Type of variation (e.g., Color, Size, Material)
                    </p>
                </FormField>

                {/* Variant Value */}
                <FormField
                    label="Variant Value"
                    required
                    error={errors.variantValue?.message}
                >
                    <input
                        type="text"
                        placeholder="e.g., Red, Large, Cotton"
                        className={getInputClassName('variantValue')}
                        {...register('variantValue')}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Specific value for this variant (e.g., Red, Large, Cotton)
                    </p>
                </FormField>

                {/* Variant Name (auto-suggested) */}
                <FormField
                    label="Variant Name"
                    error={errors.variantName?.message}
                >
                    <input
                        type="text"
                        placeholder={getSuggestedVariantName() || "Variant display name"}
                        className={getInputClassName('variantName')}
                        {...register('variantName')}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Leave empty to auto-generate: "{getSuggestedVariantName()}"
                    </p>
                </FormField>

                {/* Additional Price */}
                <FormField
                    label="Additional Price"
                    error={errors.additionalPrice?.message}
                >
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className={getInputClassName('additionalPrice')}
                        {...register('additionalPrice', { valueAsNumber: true })}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Extra cost for this variant (0 for same price as base product)
                    </p>
                </FormField>

                {/* Stock Quantity */}
                <FormField
                    label="Stock Quantity"
                    error={errors.stockQuantity?.message}
                >
                    <input
                        type="number"
                        min="0"
                        placeholder="0"
                        className={getInputClassName('stockQuantity')}
                        {...register('stockQuantity', { valueAsNumber: true })}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Available stock for this specific variant
                    </p>
                </FormField>

                {/* Variant SKU */}
                <FormField
                    label="Variant SKU"
                    error={errors.variantSKU?.message}
                >
                    <input
                        type="text"
                        placeholder="Optional SKU for this variant"
                        className={getInputClassName('variantSKU')}
                        {...register('variantSKU')}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Unique identifier for inventory tracking (optional)
                    </p>
                </FormField>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        loading={isSubmitting}
                    >
                        Add Variant
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
