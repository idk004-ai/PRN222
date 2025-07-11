import { z } from 'zod';

export const createProductVariantSchema = z.object({
    variantName: z.string()
        .min(1, 'Variant name is required')
        .max(100, 'Variant name must be less than 100 characters'),
    variantType: z.string()
        .min(1, 'Variant type is required')
        .max(50, 'Variant type must be less than 50 characters'),
    variantValue: z.string()
        .min(1, 'Variant value is required')
        .max(50, 'Variant value must be less than 50 characters'),
    additionalPrice: z.number()
        .min(0, 'Additional price must be 0 or greater')
        .optional()
        .default(0),
    stockQuantity: z.number()
        .int('Stock quantity must be a whole number')
        .min(0, 'Stock quantity must be 0 or greater')
        .optional()
        .default(0),
    variantSKU: z.string()
        .max(50, 'SKU must be less than 50 characters')
        .optional()
});

export type CreateProductVariantFormSchema = z.infer<typeof createProductVariantSchema>;
