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
        
        // Các methods khác bạn tự implement sau
        // Task<ProductResponseDto> CreateProductAsync(CreateProductDto request);
        // Task<ProductResponseDto> UpdateProductAsync(int id, UpdateProductDto request);
        // Task<bool> DeleteProductAsync(int id);
    }
}
