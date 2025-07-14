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
    mode: 'onBlur', // Validate on blur to show immediate feedback
    defaultValues: {
      name: '',
      supplierID: 0,
      categoryID: 0,
      subCategoryID: undefined,
      quantityPerUnit: '',
      unitPrice: 0,
      oldPrice: undefined,
      unitWeight: '',
      size: '',
      discount: 0,
      unitInStock: 0,
      unitOnOrder: 0,
      productAvailable: true,
      addBadge: false,
      offerTitle: '',
      offerBadgeClass: '',
      shortDescription: '',
      longDescription: '',
      altText: '',
      note: '',
      imageFile: null,
      picture1File: null,
      picture2File: null,
      picture3File: null,
      picture4File: null,
    }
  });

  // Watch specific fields for conditional logic
  const watchCategoryID = watch('categoryID');
  const watchAddBadge = watch('addBadge');

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
      setValue('subCategoryID', undefined);
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
        console.log('Category data: ', categoriesData)
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

      await onSubmit(data);
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

  // Helper function to get input className with validation state
  const getInputClassName = (fieldName: keyof ProductFormSchema, baseClassName: string = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2") => {
    const hasError = errors[fieldName];
    const errorClasses = hasError
      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500";
    return `${baseClassName} ${errorClasses}`;
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

          <FormField label="Product Name" required error={errors.name?.message}>
            <input
              {...register('name')}
              type="text"
              className={getInputClassName('name')}
              placeholder="Enter product name"
            />
          </FormField>

          <FormField label="Supplier" required error={errors.supplierID?.message}>
            <select
              {...register('supplierID', { valueAsNumber: true })}
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

          <FormField label="Category" required error={errors.categoryID?.message}>
            <select
              {...register('categoryID', { valueAsNumber: true })}
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

          <FormField label="Sub Category" error={errors.subCategoryID?.message}>
            <select
              {...register('subCategoryID', {
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

          <FormField label="Unit Price" required error={errors.unitPrice?.message}>
            <input
              {...register('unitPrice', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className={getInputClassName('unitPrice')}
              placeholder="0.00"
            />
          </FormField>

          <FormField label="Old Price" error={errors.oldPrice?.message}>
            <input
              {...register('oldPrice', {
                setValueAs: (value) => value === '' ? undefined : Number(value)
              })}
              type="number"
              step="0.01"
              className={getInputClassName('oldPrice')}
              placeholder="0.00"
            />
          </FormField>

          <FormField label="Discount (%)" error={errors.discount?.message}>
            <input
              {...register('discount', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className={getInputClassName('discount')}
              placeholder="0"
            />
          </FormField>

          <FormField label="Units in Stock" error={errors.unitInStock?.message}>
            <input
              {...register('unitInStock', { valueAsNumber: true })}
              type="number"
              className={getInputClassName('unitInStock')}
              placeholder="0"
            />
          </FormField>

          <FormField label="Units on Order" error={errors.unitOnOrder?.message}>
            <input
              {...register('unitOnOrder', { valueAsNumber: true })}
              type="number"
              className={getInputClassName('unitOnOrder')}
              placeholder="0"
            />
          </FormField>

          <FormField label="Quantity per Unit" error={errors.quantityPerUnit?.message}>
            <input
              {...register('quantityPerUnit')}
              type="text"
              className={getInputClassName('quantityPerUnit')}
              placeholder="e.g., 10 boxes x 20 bags"
            />
          </FormField>

          {/* Product Details */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-gray-900 mb-4 mt-6">Product Details</h4>
          </div>

          <FormField label="Unit Weight" error={errors.unitWeight?.message}>
            <input
              {...register('unitWeight')}
              type="text"
              className={getInputClassName('unitWeight')}
              placeholder="e.g., 2.5 kg"
            />
          </FormField>

          <FormField label="Size" error={errors.size?.message}>
            <input
              {...register('size')}
              type="text"
              className={getInputClassName('size')}
              placeholder="e.g., L, XL, 42"
            />
          </FormField>

          <FormField label="Short Description" error={errors.shortDescription?.message}>
            <textarea
              {...register('shortDescription')}
              rows={3}
              className={getInputClassName('shortDescription')}
              placeholder="Brief product description"
            />
          </FormField>

          <FormField label="Long Description" error={errors.longDescription?.message}>
            <textarea
              {...register('longDescription')}
              rows={3}
              className={getInputClassName('longDescription')}
              placeholder="Detailed product description"
            />
          </FormField>

          {/* Offer/Badge Settings */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-gray-900 mb-4 mt-6">Offer & Badge Settings</h4>
          </div>

          <div className="flex items-center">
            <input
              {...register('addBadge')}
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
              {...register('productAvailable')}
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
              <FormField label="Offer Title" error={errors.offerTitle?.message}>
                <input
                  {...register('offerTitle')}
                  type="text"
                  className={getInputClassName('offerTitle')}
                  placeholder="e.g., HOT, NEW, SALE"
                />
              </FormField>

              <FormField label="Offer Badge Class" error={errors.offerBadgeClass?.message}>
                <input
                  {...register('offerBadgeClass')}
                  type="text"
                  className={getInputClassName('offerBadgeClass')}
                  placeholder="CSS class for badge styling"
                />
              </FormField>
            </>
          )}

          {/* Images */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-gray-900 mb-4 mt-6">Product Images</h4>
          </div>

          <FileUploadField label="Main Image" field="imageFile" />
          <FileUploadField label="Picture 1" field="picture1File" />
          <FileUploadField label="Picture 2" field="picture2File" />
          <FileUploadField label="Picture 3" field="picture3File" />

          <FormField label="Alt Text" error={errors.altText?.message}>
            <input
              {...register('altText')}
              type="text"
              className={getInputClassName('altText')}
              placeholder="Alternative text for images"
            />
          </FormField>

          <FormField label="Note" error={errors.note?.message}>
            <textarea
              {...register('note')}
              rows={2}
              className={getInputClassName('note')}
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
