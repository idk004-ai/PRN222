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
        /// Create new product
        /// </summary>
        /// <param name="request">Create product request</param>
        /// <returns>Created product details</returns>
        Task<ProductResponseDto> CreateProductAsync(CreateProductDto request);
        
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
    }
}
