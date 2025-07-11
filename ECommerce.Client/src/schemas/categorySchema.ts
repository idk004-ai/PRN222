import { z } from 'zod';

// Schema for creating category
export const categorySchema = z.object({
    name: z
        .string()
        .min(1, 'Category name is required')
        .max(255, 'Category name cannot exceed 255 characters'),

    description: z
        .string()
        .max(1000, 'Description cannot exceed 1000 characters')
        .optional(),

    isActive: z.boolean().default(true),

    // File fields - with basic validation
    picture1File: z
        .any()
        .optional()
        .refine((file) => {
            if (!file) return true; // Optional field
            return file instanceof File && file.type.startsWith('image/');
        }, 'Please select a valid image file'),

    picture2File: z
        .any()
        .optional()
        .refine((file) => {
            if (!file) return true; // Optional field
            return file instanceof File && file.type.startsWith('image/');
        }, 'Please select a valid image file'),
});

export type CategoryFormSchema = z.infer<typeof categorySchema>

// Schema for updating category - same as create but with categoryID
export const updateCategorySchema = z.object({
    categoryID: z.number(),
    name: z
        .string()
        .min(1, 'Category name is required')
        .max(255, 'Category name cannot exceed 255 characters'),

    description: z
        .string()
        .max(1000, 'Description cannot exceed 1000 characters')
        .optional(),

    isActive: z.boolean().default(true),

    // File fields - with basic validation
    picture1File: z
        .any()
        .optional()
        .refine((file) => {
            if (!file) return true; // Optional field
            return file instanceof File && file.type.startsWith('image/');
        }, 'Please select a valid image file'),

    picture2File: z
        .any()
        .optional()
        .refine((file) => {
            if (!file) return true; // Optional field
            return file instanceof File && file.type.startsWith('image/');
        }, 'Please select a valid image file'),

    // For keeping existing images
    existingPicture1: z.string().optional(),
    existingPicture2: z.string().optional(),
});

export type UpdateCategoryFormSchema = z.infer<typeof updateCategorySchema>
