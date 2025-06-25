import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { FormField } from '../ui/FormField';
import { Button } from '../ui/Button';
import { Upload } from 'lucide-react';
import type { ProductFormData, Supplier, Category, SubCategory } from '../../types/product';
import { productService } from '../../services/productService';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
}

export const AddProductModal = ({ isOpen, onClose, onSubmit }: AddProductModalProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
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
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load suppliers and categories when modal opens
  useEffect(() => {
    if (isOpen) {
      loadFormData();
    }
  }, [isOpen]);

  // Load subcategories when category changes
  useEffect(() => {
    if (formData.categoryID && formData.categoryID > 0) {
      loadSubCategories(formData.categoryID);
    } else {
      // Clear subcategories if no category selected
      setSubCategories([]);
      setFormData(prev => ({
        ...prev,
        subCategoryID: undefined
      }));
    }
  }, [formData.categoryID]);

  const loadFormData = async () => {
    setLoadingSuppliers(true);
    setLoadingCategories(true);
    
    try {
      // Load suppliers
      try {
        const suppliersData = await productService.getSuppliers();
        setSuppliers(suppliersData);
      } catch (error) {
        console.error('Error loading suppliers:', error);
        setSuppliers([]);
      } finally {
        setLoadingSuppliers(false);
      }

      // Load categories
      try {
        const categoriesData = await productService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    } catch (error) {
      console.error('Error loading form data:', error);
      setLoadingSuppliers(false);
      setLoadingCategories(false);
    }
  };

  const loadSubCategories = async (categoryId: number) => {
    setLoadingSubCategories(true);
    try {
      const subCategoriesData = await productService.getSubCategories(categoryId);
      setSubCategories(subCategoriesData);
    } catch (error) {
      console.error('Error loading subcategories:', error);
      setSubCategories([]);
    } finally {
      setLoadingSubCategories(false);
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // If category changes, reset subcategory
      if (field === 'categoryID') {
        newData.subCategoryID = undefined;
      }
      
      return newData;
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileChange = (field: keyof ProductFormData, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.supplierID) {
      newErrors.supplierID = 'Supplier is required';
    }
    if (!formData.categoryID) {
      newErrors.categoryID = 'Category is required';
    }
    if (formData.unitPrice <= 0) {
      newErrors.unitPrice = 'Unit price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
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
    });
    setErrors({});
  };

  const FileUploadField = ({ label, field, required = false }: { label: string; field: keyof ProductFormData; required?: boolean }) => (
    <FormField label={label} required={required} error={errors[field]}>
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
          {formData[field] as File && (
            <p className="text-xs text-blue-600 mt-1">{(formData[field] as File).name}</p>
          )}
        </label>
      </div>
    </FormField>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Product" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
          </div>

          <FormField label="Product Name" required error={errors.name}>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product name"
            />
          </FormField>

          <FormField label="Supplier" required error={errors.supplierID}>
            <select
              value={formData.supplierID}
              onChange={(e) => handleInputChange('supplierID', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={loadingSuppliers}
            >
              <option value={0}>
                {loadingSuppliers ? 'Loading suppliers...' : 'Select a supplier'}
              </option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Category" required error={errors.categoryID}>
            <select
              value={formData.categoryID}
              onChange={(e) => handleInputChange('categoryID', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={loadingCategories}
            >
              <option value={0}>
                {loadingCategories ? 'Loading categories...' : 'Select a category'}
              </option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Sub Category">
            <select
              value={formData.subCategoryID || 0}
              onChange={(e) => handleInputChange('subCategoryID', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={!formData.categoryID || loadingSubCategories}
            >
              <option value={0}>
                {loadingSubCategories 
                  ? 'Loading subcategories...' 
                  : !formData.categoryID 
                    ? 'Select a category first' 
                    : 'Select a sub category'
                }
              </option>
              {subCategories.map(subCategory => (
                <option key={subCategory.id} value={subCategory.id}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </FormField>

          {/* Pricing */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-gray-900 mb-4 mt-6">Pricing & Stock</h4>
          </div>

          <FormField label="Unit Price" required error={errors.unitPrice}>
            <input
              type="number"
              step="0.01"
              value={formData.unitPrice}
              onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
          </FormField>

          <FormField label="Old Price">
            <input
              type="number"
              step="0.01"
              value={formData.oldPrice || ''}
              onChange={(e) => handleInputChange('oldPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
          </FormField>

          <FormField label="Discount (%)">
            <input
              type="number"
              step="0.01"
              value={formData.discount}
              onChange={(e) => handleInputChange('discount', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </FormField>

          <FormField label="Units in Stock">
            <input
              type="number"
              value={formData.unitInStock}
              onChange={(e) => handleInputChange('unitInStock', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </FormField>

          <FormField label="Units on Order">
            <input
              type="number"
              value={formData.unitOnOrder}
              onChange={(e) => handleInputChange('unitOnOrder', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </FormField>

          <FormField label="Quantity per Unit">
            <input
              type="text"
              value={formData.quantityPerUnit}
              onChange={(e) => handleInputChange('quantityPerUnit', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 10 boxes x 20 bags"
            />
          </FormField>

          {/* Product Details */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-gray-900 mb-4 mt-6">Product Details</h4>
          </div>

          <FormField label="Unit Weight">
            <input
              type="text"
              value={formData.unitWeight}
              onChange={(e) => handleInputChange('unitWeight', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 2.5 kg"
            />
          </FormField>

          <FormField label="Size">
            <input
              type="text"
              value={formData.size}
              onChange={(e) => handleInputChange('size', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., L, XL, 42"
            />
          </FormField>

          <FormField label="Short Description">
            <textarea
              value={formData.shortDescription}
              onChange={(e) => handleInputChange('shortDescription', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief product description"
            />
          </FormField>

          <FormField label="Long Description">
            <textarea
              value={formData.longDescription}
              onChange={(e) => handleInputChange('longDescription', e.target.value)}
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
              type="checkbox"
              id="addBadge"
              checked={formData.addBadge}
              onChange={(e) => handleInputChange('addBadge', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="addBadge" className="ml-2 block text-sm text-gray-900">
              Add Badge
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="productAvailable"
              checked={formData.productAvailable}
              onChange={(e) => handleInputChange('productAvailable', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="productAvailable" className="ml-2 block text-sm text-gray-900">
              Product Available
            </label>
          </div>

          {formData.addBadge && (
            <>
              <FormField label="Offer Title">
                <input
                  type="text"
                  value={formData.offerTitle}
                  onChange={(e) => handleInputChange('offerTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., HOT, NEW, SALE"
                />
              </FormField>

              <FormField label="Offer Badge Class">
                <input
                  type="text"
                  value={formData.offerBadgeClass}
                  onChange={(e) => handleInputChange('offerBadgeClass', e.target.value)}
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

          <FileUploadField label="Main Image" field="imageFile" />
          <FileUploadField label="Picture 1" field="picture1File" />
          <FileUploadField label="Picture 2" field="picture2File" />
          <FileUploadField label="Picture 3" field="picture3File" />

          <FormField label="Alt Text">
            <input
              type="text"
              value={formData.altText}
              onChange={(e) => handleInputChange('altText', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Alternative text for images"
            />
          </FormField>

          <FormField label="Note">
            <textarea
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
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
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Create Product
          </Button>
        </div>
      </form>
    </Modal>
  );
};
