import React from 'react';

export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'file';
  value?: string | number | boolean;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string | number; label: string }[];
  rows?: number;
  accept?: string;
  multiple?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onFileChange?: (files: FileList | null) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  placeholder,
  required = false,
  min,
  max,
  step,
  options,
  rows = 3,
  accept,
  multiple = false,
  error,
  disabled = false,
  className = '',
  onChange,
  onFileChange
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onFileChange) {
      onFileChange(e.target.files);
    }
  };

  const baseInputClasses = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
    error ? 'border-red-500' : 'border-gray-300'
  } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} ${className}`;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={name}
            name={name}
            value={value as string || ''}
            placeholder={placeholder}
            required={required}
            rows={rows}
            disabled={disabled}
            className={baseInputClasses}
            onChange={onChange}
          />
        );

      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value as string | number || ''}
            required={required}
            disabled={disabled}
            className={baseInputClasses}
            onChange={onChange}
          >
            <option value="">Select {label}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={name}
              name={name}
              checked={value as boolean || false}
              disabled={disabled}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              onChange={onChange}
            />
            <label htmlFor={name} className="ml-2 text-sm text-gray-700">
              {label}
            </label>
          </div>
        );

      case 'file':
        return (
          <input
            type="file"
            id={name}
            name={name}
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            className={`${baseInputClasses} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
            onChange={handleFileChange}
          />
        );

      default:
        return (
          <input
            type={type}
            id={name}
            name={name}
            value={value as string | number || ''}
            placeholder={placeholder}
            required={required}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className={baseInputClasses}
            onChange={onChange}
          />
        );
    }
  };

  if (type === 'checkbox') {
    return (
      <div className="mb-4">
        {renderInput()}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
