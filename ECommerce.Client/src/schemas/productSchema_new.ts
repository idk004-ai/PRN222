import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(255, 'Product name cannot exceed 255 characters'),
  
  supplierID: z
    .number()
    .min(1, 'Supplier is required'),
  
  categoryID: z
    .number()
    .min(1, 'Category is required'),
  
  subCategoryID: z
    .number()
    .optional(),
  
  quantityPerUnit: z
    .string()
    .max(100, 'Quantity per unit cannot exceed 100 characters')
    .optional(),
  
  unitPrice: z
    .number()
    .min(0.1, 'Unit price must be greater than 0'),
  
  oldPrice: z
    .number()
    .min(0, 'Old price must be greater than 0')
    .optional(),
  
  unitWeight: z
    .string()
    .max(50, 'Unit weight cannot exceed 50 characters')
    .optional(),
  
  size: z
    .string()
    .max(50, 'Size cannot exceed 50 characters')
    .optional(),
  
  discount: z
    .number()
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount must be between 0 and 100')
    .optional()
    .default(0),
  
  unitInStock: z
    .number()
    .min(0, 'Stock must be greater than or equal to 0')
    .optional()
    .default(0),
  
  unitOnOrder: z
    .number()
    .min(0, 'Unit on order must be greater than or equal to 0')
    .optional()
    .default(0),
  
  productAvailable: z.boolean().default(true),
  
  addBadge: z.boolean().default(false),
  
  offerTitle: z
    .string()
    .max(100, 'Offer title cannot exceed 100 characters')
    .optional(),
  
  offerBadgeClass: z
    .string()
    .max(50, 'Offer badge class cannot exceed 50 characters')
    .optional(),
  
  shortDescription: z
    .string()
    .max(1000, 'Short description cannot exceed 1000 characters')
    .optional(),
  
  longDescription: z
    .string()
    .optional(),
  
  altText: z
    .string()
    .max(255, 'Alt text cannot exceed 255 characters')
    .optional(),
  
  note: z
    .string()
    .optional(),
  
  // File fields - with basic validation
  imageFile: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true; // Optional field
      return file instanceof File && file.type.startsWith('image/');
    }, 'Please select a valid image file'),
  
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
  
  picture3File: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true; // Optional field
      return file instanceof File && file.type.startsWith('image/');
    }, 'Please select a valid image file'),
  
  picture4File: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true; // Optional field
      return file instanceof File && file.type.startsWith('image/');
    }, 'Please select a valid image file'),
});

export type ProductFormSchema = z.infer<typeof productSchema>

// Schema for updating product - same as create but with productID
export const updateProductSchema = z.object({
  productID: z.number(),
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(255, 'Product name cannot exceed 255 characters'),
  
  supplierID: z
    .number()
    .min(1, 'Supplier is required'),
  
  categoryID: z
    .number()
    .min(1, 'Category is required'),
  
  subCategoryID: z
    .number()
    .optional(),
  
  quantityPerUnit: z
    .string()
    .max(100, 'Quantity per unit cannot exceed 100 characters')
    .optional(),
  
  unitPrice: z
    .number()
    .min(0.1, 'Unit price must be greater than 0'),
  
  oldPrice: z
    .number()
    .min(0, 'Old price must be greater than 0')
    .optional(),
  
  unitWeight: z
    .string()
    .max(50, 'Unit weight cannot exceed 50 characters')
    .optional(),
  
  size: z
    .string()
    .max(50, 'Size cannot exceed 50 characters')
    .optional(),
  
  discount: z
    .number()
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount must be between 0 and 100')
    .optional()
    .default(0),
  
  unitInStock: z
    .number()
    .min(0, 'Stock must be greater than or equal to 0')
    .optional()
    .default(0),
  
  unitOnOrder: z
    .number()
    .min(0, 'Unit on order must be greater than or equal to 0')
    .optional()
    .default(0),
  
  productAvailable: z.boolean().default(true),
  
  addBadge: z.boolean().default(false),
  
  offerTitle: z
    .string()
    .max(100, 'Offer title cannot exceed 100 characters')
    .optional(),
  
  offerBadgeClass: z
    .string()
    .max(50, 'Offer badge class cannot exceed 50 characters')
    .optional(),
  
  shortDescription: z
    .string()
    .max(1000, 'Short description cannot exceed 1000 characters')
    .optional(),
  
  longDescription: z
    .string()
    .optional(),
  
  altText: z
    .string()
    .max(255, 'Alt text cannot exceed 255 characters')
    .optional(),
  
  note: z
    .string()
    .optional(),
  
  // File fields - with basic validation
  imageFile: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true; // Optional field
      return file instanceof File && file.type.startsWith('image/');
    }, 'Please select a valid image file'),
  
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
  
  picture3File: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true; // Optional field
      return file instanceof File && file.type.startsWith('image/');
    }, 'Please select a valid image file'),
  
  picture4File: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true; // Optional field
      return file instanceof File && file.type.startsWith('image/');
    }, 'Please select a valid image file'),
});

export type UpdateProductFormSchema = z.infer<typeof updateProductSchema>
