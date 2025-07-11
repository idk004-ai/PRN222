import { useState, useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../ui/Modal';
import { FormField } from '../ui/FormField';
import { Button } from '../ui/Button';
import { Upload } from 'lucide-react';
import type { UpdateCategoryFormData } from '../../types/product';
import { categoryService } from '../../services/categoryService';
import { updateCategorySchema, type UpdateCategoryFormSchema } from '../../schemas/categorySchema';

interface EditCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: UpdateCategoryFormData) => Promise<void>;
    categoryId: number | null;
}

export const EditCategoryModal = ({ isOpen, onClose, onSubmit, categoryId }: EditCategoryModalProps) => {
    // React Hook Form setup
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<UpdateCategoryFormSchema>({
        resolver: zodResolver(updateCategorySchema) as Resolver<UpdateCategoryFormSchema>,
        mode: 'onBlur', // Validate on blur to show immediate feedback
    });

    const [loadingCategory, setLoadingCategory] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    // Helper function to get input className with validation state
    const getInputClassName = (fieldName: keyof UpdateCategoryFormSchema, baseClassName: string = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2") => {
        const hasError = errors[fieldName];
        const errorClasses = hasError
            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500";
        return `${baseClassName} ${errorClasses}`;
    };

    // Load category data when modal opens
    useEffect(() => {
        if (isOpen && categoryId) {
            loadCategoryData();
        } else {
            // Reset form when modal closes
            resetForm();
        }
    }, [isOpen, categoryId]);

    const loadCategoryData = async () => {
        if (!categoryId) return;

        setLoadingCategory(true);
        try {
            const categoryData = await categoryService.getCategoryById(categoryId);
            if (categoryData) {
                console.log('Category data loaded:', categoryData); // Debug log

                // Set form values using reset to populate all fields at once
                reset({
                    categoryID: categoryData.categoryID,
                    name: categoryData.name || '',
                    description: categoryData.description || '',
                    isActive: categoryData.isActive ?? true,
                    existingPicture1: categoryData.picture1 || '',
                    existingPicture2: categoryData.picture2 || '',
                    picture1File: null, // Files start as null
                    picture2File: null,
                });
            }
        } catch (error) {
            console.error('Error loading category:', error);
            setServerError('Failed to load category data');
        } finally {
            setLoadingCategory(false);
        }
    };

    const resetForm = () => {
        reset();
        setServerError(null);
    };

    const handleFileChange = (field: keyof UpdateCategoryFormSchema, file: File | null) => {
        setValue(field as any, file);
    };

    const onFormSubmit = async (data: UpdateCategoryFormSchema) => {
        try {
            setServerError(null);
            await onSubmit(data);
            onClose();
            resetForm();
        } catch (error: any) {
            console.error('Error updating category:', error);

            if (error.response?.data?.message) {
                setServerError(error.response.data.message);
            } else {
                setServerError('An unexpected error occurred. Please try again.');
            }
        }
    };

    // Component for file upload fields
    const FileUploadField = ({ label, field, required = false }: {
        label: string;
        field: keyof UpdateCategoryFormSchema;
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

    if (loadingCategory) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Edit Category" size="lg">
                <div className="flex items-center justify-center py-8">
                    <div className="text-gray-500">Loading category data...</div>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Category" size="lg">
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                {/* General Error Display */}
                {serverError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="text-red-800 text-sm">{serverError}</div>
                    </div>
                )}

                {/* Hidden CategoryID field */}
                <input type="hidden" {...register('categoryID', { valueAsNumber: true })} />
                <input type="hidden" {...register('existingPicture1')} />
                <input type="hidden" {...register('existingPicture2')} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Basic Information */}
                    <div className="md:col-span-2">
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                    </div>

                    <FormField label="Category Name" required error={errors.name?.message}>
                        <input
                            {...register('name')}
                            type="text"
                            className={getInputClassName('name')}
                            placeholder="Enter category name"
                        />
                    </FormField>

                    <div className="flex items-center">
                        <input
                            {...register('isActive')}
                            type="checkbox"
                            id="isActive"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                            Active Category
                        </label>
                    </div>

                    <div className="md:col-span-2">
                        <FormField label="Description" error={errors.description?.message}>
                            <textarea
                                {...register('description')}
                                rows={3}
                                className={getInputClassName('description')}
                                placeholder="Category description (optional)"
                            />
                        </FormField>
                    </div>

                    {/* Images */}
                    <div className="md:col-span-2">
                        <h4 className="text-lg font-medium text-gray-900 mb-4 mt-6">Category Images</h4>
                    </div>

                    <FileUploadField label="Picture 1" field="picture1File" />
                    <FileUploadField label="Picture 2" field="picture2File" />
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
                        Update Category
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
