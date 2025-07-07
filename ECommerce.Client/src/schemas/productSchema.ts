import { z } from 'zod';

export const productSchema = z.object({
  Name: z
    .string()
    .min(1, 'Product name is required')
    .max(255, 'Product name cannot exceed 255 characters'),
  
  SupplierID: z
    .number()
    .min(1, 'Supplier is required'),
  
  CategoryID: z
    .number()
    .min(1, 'Category is required'),
  
  SubCategoryID: z
    .number()
    .optional(),
  
  QuantityPerUnit: z
    .string()
    .max(100, 'Quantity per unit cannot exceed 100 characters')
    .optional(),
  
  UnitPrice: z
    .number()
    .min(0.1, 'Unit price must be greater than 0'),
  
  OldPrice: z
    .number()
    .min(0, 'Old price must be greater than 0')
    .optional(),
  
  UnitWeight: z
    .string()
    .max(50, 'Unit weight cannot exceed 50 characters')
    .optional(),
  
  Size: z
    .string()
    .max(50, 'Size cannot exceed 50 characters')
    .optional(),
  
  Discount: z
    .number()
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot exceed 100%')
    .optional()
    .default(0),
  
  UnitInStock: z
    .number()
    .min(0, 'Stock cannot be negative')
    .optional()
    .default(0),
  
  UnitOnOrder: z
    .number()
    .min(0, 'Units on order cannot be negative')
    .optional()
    .default(0),
  
  ProductAvailable: z.boolean().default(true),
  
  AddBadge: z.boolean().default(false),
  
  OfferTitle: z
    .string()
    .max(100, 'Offer title cannot exceed 100 characters')
    .optional(),
  
  OfferBadgeClass: z
    .string()
    .max(50, 'Offer badge class cannot exceed 50 characters')
    .optional(),
  
  ShortDescription: z
    .string()
    .max(1000, 'Short description cannot exceed 1000 characters')
    .optional(),
  
  LongDescription: z
    .string()
    .optional(),
  
  AltText: z
    .string()
    .max(255, 'Alt text cannot exceed 255 characters')
    .optional(),
  
  Note: z
    .string()
    .optional(),
  
  // File fields
  ImageFile: z
    .any()
    .optional(),
  
  Picture1File: z
    .any()
    .optional(),
  
  Picture2File: z
    .any()
    .optional(),
  
  Picture3File: z
    .any()
    .optional(),
  
  Picture4File: z
    .any()
    .optional(),
});

export type ProductFormSchema = z.infer<typeof productSchema>;
