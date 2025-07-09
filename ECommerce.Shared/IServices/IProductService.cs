using ECommerce.Shared.DTOs.Common;
using ECommerce.Shared.DTOs.Product;

namespace ECommerce.Shared.IServices
{
    public interface IProductService
    {
        /// <summary>
        /// Get paginated products with search and sort functionality
        /// </summary>
        /// <param name="request">Pagination request parameters</param>
        /// <returns>Paginated product response</returns>
        Task<PagedResponse<ProductResponseDto>> GetProductsAsync(PagedRequest request);
        
        /// <summary>
        /// Get single product by ID
        /// </summary>
        /// <param name="id">Product ID</param>
        /// <returns>Product details</returns>
        Task<ProductResponseDto?> GetProductByIdAsync(int id);
        
        /// <summary>
        /// Get product by ID for editing (with full details)
        /// </summary>
        /// <param name="id">Product ID</param>
        /// <returns>Product details for editing</returns>
        Task<UpdateProductDto?> GetProductForEditAsync(int id);
        
        /// <summary>
        /// Create new product
        /// </summary>
        /// <param name="request">Create product request</param>
        /// <returns>Created product details</returns>
        Task<ProductResponseDto> CreateProductAsync(CreateProductDto request);
        
        /// <summary>
        /// Update existing product
        /// </summary>
        /// <param name="id">Product ID</param>
        /// <param name="request">Update product request</param>
        /// <returns>Updated product details</returns>
        Task<ProductResponseDto> UpdateProductAsync(int id, UpdateProductDto request);
        
        /// <summary>
        /// Delete product by ID
        /// </summary>
        /// <param name="id">Product ID</param>
        /// <returns>Success status</returns>
        Task<bool> DeleteProductAsync(int id);
        
        /// <summary>
        /// Get categories for dropdown
        /// </summary>
        /// <returns>List of categories</returns>
        Task<IEnumerable<object>> GetCategoriesForDropdownAsync();
        
        /// <summary>
        /// Get subcategories for dropdown
        /// </summary>
        /// <returns>List of subcategories</returns>
        Task<IEnumerable<object>> GetSubCategoriesForDropdownAsync();
        
        /// <summary>
        /// Get suppliers for dropdown
        /// </summary>
        /// <returns>List of suppliers</returns>
        Task<IEnumerable<object>> GetSuppliersForDropdownAsync();
        
        /// <summary>
        /// Get subcategories for dropdown by category
        /// </summary>
        /// <param name="categoryId">Category ID to filter subcategories</param>
        /// <returns>Subcategories dropdown data</returns>
        Task<IEnumerable<object>> GetSubCategoriesByCategoryAsync(int categoryId);
        
        /// <summary>
        /// Get all variants for a specific product
        /// </summary>
        /// <param name="productId">Product ID</param>
        /// <returns>List of product variants</returns>
        Task<IEnumerable<ProductVariantDto>> GetProductVariantsAsync(int productId);
        
        /// <summary>
        /// Create a new variant for an existing product
        /// </summary>
        /// <param name="productId">Product ID</param>
        /// <param name="variantDto">Variant creation data</param>
        /// <returns>Created variant</returns>
        Task<ProductVariantDto?> CreateProductVariantAsync(int productId, CreateProductVariantDto variantDto);
    }
}
