import { useState, useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../ui/Modal';
import { FormField } from '../ui/FormField';
import { Button } from '../ui/Button';
import { Upload } from 'lucide-react';
import type { CreateProductFormData, Supplier, Category, SubCategory } from '../../types/product';
import { productService } from '../../services/productService';
import { productSchema, type ProductFormSchema } from '../../schemas/productSchema';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductFormData) => Promise<void>;
}

export const AddProductModal = ({ isOpen, onClose, onSubmit }: AddProductModalProps) => {
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ProductFormSchema>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormSchema>,
    defaultValues: {
      Name: '',
      SupplierID: 0,
      CategoryID: 0,
      SubCategoryID: undefined,
      QuantityPerUnit: '',
      UnitPrice: 0,
      OldPrice: undefined,
      UnitWeight: '',
      Size: '',
      Discount: 0,
      UnitInStock: 0,
      UnitOnOrder: 0,
      ProductAvailable: true,
      AddBadge: false,
      OfferTitle: '',
      OfferBadgeClass: '',
      ShortDescription: '',
      LongDescription: '',
      AltText: '',
      Note: '',
      ImageFile: null,
      Picture1File: null,
      Picture2File: null,
      Picture3File: null,
      Picture4File: null,
    }
  });

  // Watch specific fields for conditional logic
  const watchCategoryID = watch('CategoryID');
  const watchAddBadge = watch('AddBadge');

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Load suppliers and categories when modal opens
  useEffect(() => {
    if (isOpen) {
      loadFormData();
    } else {
      // Reset form when modal closes
      resetForm();
    }
  }, [isOpen]);

  // Load subcategories when category changes
  useEffect(() => {
    if (watchCategoryID && watchCategoryID > 0) {
      loadSubCategories(watchCategoryID);
    } else {
      // Clear subcategories if no category selected
      setSubCategories([]);
      setValue('SubCategoryID', undefined);
    }
  }, [watchCategoryID, setValue]);

  const loadFormData = async () => {
    // Load suppliers and categories in parallel
    const loadPromises = [];

    // Load suppliers
    setLoadingSuppliers(true);
    const loadSuppliersPromise = productService.getSuppliers()
      .then(suppliersData => {
        setSuppliers(suppliersData);
      })
      .catch(error => {
        console.error('Error loading suppliers:', error);
        setSuppliers([]);
      })
      .finally(() => {
        setLoadingSuppliers(false);
      });

    // Load categories
    setLoadingCategories(true);
    const loadCategoriesPromise = productService.getCategories()
      .then(categoriesData => {
        console.log('Category data: ' , categoriesData)
        setCategories(categoriesData);
      })
      .catch(error => {
        console.error('Error loading categories:', error);
        setCategories([]);
      })
      .finally(() => {
        setLoadingCategories(false);
      });

    // Wait for both to complete
    loadPromises.push(loadSuppliersPromise, loadCategoriesPromise);
    await Promise.all(loadPromises);
  };

  // const loadSubCategories = async (categoryId: number) => {
  //   setLoadingSubCategories(true);
  //   try {
  //     const subCategoriesData = await productService.getSubCategories(categoryId);
  //     console.log('Subcategories data: ', subCategoriesData)
  //     setSubCategories(subCategoriesData);
  //   } catch (error) {
  //     console.error('Error loading subcategories:', error);
  //     setSubCategories([]);
  //   } finally {
  //     setLoadingSubCategories(false);
  //   }
  // };

  const loadSubCategories = async (categoryId: number) => {
    setLoadingSubCategories(true);
    try {
      const subCategoriesData = await productService.getSubCategories(categoryId);
      console.log('Subcategories data: ', subCategoriesData)
      setSubCategories(subCategoriesData);
    } catch (error) {
      console.error('Error loading subcategories:', error);
      setSubCategories([]);
    } finally {
      setLoadingSubCategories(false);
    }
  };

  const resetForm = () => {
    reset();
    setSuppliers([]);
    setCategories([]);
    setSubCategories([]);
    setServerError(null);
  };

  const handleFileChange = (field: keyof ProductFormSchema, file: File | null) => {
    setValue(field as any, file);
  };

  const onFormSubmit = async (data: ProductFormSchema) => {
    try {
      setServerError(null);
      
      // Data is already in PascalCase format from schema, no conversion needed
      const formData: CreateProductFormData = {
        Name: data.Name,
        SupplierID: data.SupplierID,
        CategoryID: data.CategoryID,
        SubCategoryID: data.SubCategoryID,
        QuantityPerUnit: data.QuantityPerUnit,
        UnitPrice: data.UnitPrice,
        OldPrice: data.OldPrice,
        UnitWeight: data.UnitWeight,
        Size: data.Size,
        Discount: data.Discount,
        UnitInStock: data.UnitInStock,
        UnitOnOrder: data.UnitOnOrder,
        ProductAvailable: data.ProductAvailable,
        AddBadge: data.AddBadge,
        OfferTitle: data.OfferTitle,
        OfferBadgeClass: data.OfferBadgeClass,
        ShortDescription: data.ShortDescription,
        LongDescription: data.LongDescription,
        AltText: data.AltText,
        Note: data.Note,
        ImageFile: data.ImageFile,
        Picture1File: data.Picture1File,
        Picture2File: data.Picture2File,
        Picture3File: data.Picture3File,
        Picture4File: data.Picture4File,
      };

      await onSubmit(formData);
      onClose();
      resetForm();
    } catch (error: any) {
      console.error('Error creating product:', error);

      if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const FileUploadField = ({ label, field, required = false }: { 
    label: string; 
    field: keyof ProductFormSchema; 
    required?: boolean 
  }) => {
    const fieldValue = watch(field);
    
    return (
      <FormField label={label} required={required} error={errors[field]?.message?.toString()}>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
            className="hidden"
            id={field}
          />
          <label htmlFor={field} className="cursor-pointer">
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Click to upload image</p>
            {fieldValue && (
              <p className="text-xs text-blue-600 mt-1">{(fieldValue as File).name}</p>
            )}
          </label>
        </div>
      </FormField>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Product" size="xl">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* General Error Display */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-800 text-sm">{serverError}</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
          </div>

          <FormField label="Product Name" required error={errors.Name?.message}>
            <input
              {...register('Name')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product name"
            />
          </FormField>

          <FormField label="Supplier" required error={errors.SupplierID?.message}>
            <select
              {...register('SupplierID', { valueAsNumber: true })}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${loadingSuppliers ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              disabled={loadingSuppliers}
            >
              <option value={0}>
                {loadingSuppliers ? 'Loading suppliers...' : 'Select a supplier'}
              </option>
              {suppliers.map(supplier => (
                <option key={supplier.supplierID} value={supplier.supplierID}>
                  {supplier.companyName}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Category" required error={errors.CategoryID?.message}>
            <select
              {...register('CategoryID', { valueAsNumber: true })}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${loadingCategories ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              disabled={loadingCategories}
            >
              <option value={0}>
                {loadingCategories ? 'Loading categories...' : 'Select a category'}
              </option>
              {categories.map(category => (
                <option key={category.categoryID} value={category.categoryID}>
                  {category.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Sub Category">
            <select
              {...register('SubCategoryID', { 
                setValueAs: (value) => value === '0' || value === '' ? undefined : Number(value)
              })}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${(!watchCategoryID || loadingSubCategories) ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              disabled={!watchCategoryID || loadingSubCategories}
            >
              <option value="">
                {loadingSubCategories
                  ? 'Loading subcategories...'
                  : !watchCategoryID || watchCategoryID === 0
                    ? 'Select a category first'
                    : 'Select a sub category (optional)'
                }
              </option>
              {subCategories.map(subCategory => (
                <option key={subCategory.subCategoryID} value={subCategory.subCategoryID}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </FormField>

          {/* Pricing */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-gray-900 mb-4 mt-6">Pricing & Stock</h4>
          </div>

          <FormField label="Unit Price" required error={errors.UnitPrice?.message}>
            <input
              {...register('UnitPrice', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
          </FormField>

          <FormField label="Old Price" error={errors.OldPrice?.message}>
            <input
              {...register('OldPrice', { 
                setValueAs: (value) => value === '' ? undefined : Number(value)
              })}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
          </FormField>

          <FormField label="Discount (%)" error={errors.Discount?.message}>
            <input
              {...register('Discount', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </FormField>

          <FormField label="Units in Stock" error={errors.UnitInStock?.message}>
            <input
              {...register('UnitInStock', { valueAsNumber: true })}
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </FormField>

          <FormField label="Units on Order" error={errors.UnitOnOrder?.message}>
            <input
              {...register('UnitOnOrder', { valueAsNumber: true })}
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </FormField>

          <FormField label="Quantity per Unit" error={errors.QuantityPerUnit?.message}>
            <input
              {...register('QuantityPerUnit')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 10 boxes x 20 bags"
            />
          </FormField>

          {/* Product Details */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-gray-900 mb-4 mt-6">Product Details</h4>
          </div>

          <FormField label="Unit Weight" error={errors.UnitWeight?.message}>
            <input
              {...register('UnitWeight')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 2.5 kg"
            />
          </FormField>

          <FormField label="Size" error={errors.Size?.message}>
            <input
              {...register('Size')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., L, XL, 42"
            />
          </FormField>

          <FormField label="Short Description" error={errors.ShortDescription?.message}>
            <textarea
              {...register('ShortDescription')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief product description"
            />
          </FormField>

          <FormField label="Long Description" error={errors.LongDescription?.message}>
            <textarea
              {...register('LongDescription')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Detailed product description"
            />
          </FormField>

          {/* Offer/Badge Settings */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-gray-900 mb-4 mt-6">Offer & Badge Settings</h4>
          </div>

          <div className="flex items-center">
            <input
              {...register('AddBadge')}
              type="checkbox"
              id="addBadge"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="addBadge" className="ml-2 block text-sm text-gray-900">
              Add Badge
            </label>
          </div>

          <div className="flex items-center">
            <input
              {...register('ProductAvailable')}
              type="checkbox"
              id="productAvailable"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="productAvailable" className="ml-2 block text-sm text-gray-900">
              Product Available
            </label>
          </div>

          {watchAddBadge && (
            <>
              <FormField label="Offer Title" error={errors.OfferTitle?.message}>
                <input
                  {...register('OfferTitle')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., HOT, NEW, SALE"
                />
              </FormField>

              <FormField label="Offer Badge Class" error={errors.OfferBadgeClass?.message}>
                <input
                  {...register('OfferBadgeClass')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="CSS class for badge styling"
                />
              </FormField>
            </>
          )}

          {/* Images */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-gray-900 mb-4 mt-6">Product Images</h4>
          </div>

          <FileUploadField label="Main Image" field="ImageFile" />
          <FileUploadField label="Picture 1" field="Picture1File" />
          <FileUploadField label="Picture 2" field="Picture2File" />
          <FileUploadField label="Picture 3" field="Picture3File" />

          <FormField label="Alt Text" error={errors.AltText?.message}>
            <input
              {...register('AltText')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Alternative text for images"
            />
          </FormField>

          <FormField label="Note" error={errors.Note?.message}>
            <textarea
              {...register('Note')}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Additional notes"
            />
          </FormField>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Create Product
          </Button>
        </div>
      </form>
    </Modal>
  );
};
