using AutoMapper;
using ECommerce.Shared.DTOs.Common;
using ECommerce.Shared.DTOs.Product;
using ECommerce.Shared.IRepositories;
using ECommerce.Shared.IServices;
using ECommerce.Shared.Models;

namespace ECommerce.Shared.Services
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ProductService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        /// <summary>
        /// Get single product by ID
        /// </summary>
        /// <param name="id">Product ID</param>
        /// <returns>Product details</returns>
        public async Task<ProductResponseDto?> GetProductByIdAsync(int id)
        {
            var product = await _unitOfWork.ProductRepository.GetByIdAsync(id);
            return product != null ? _mapper.Map<ProductResponseDto>(product) : null;
        }

        /// <summary>
        /// Get product by ID for editing (with full details)
        /// </summary>
        /// <param name="id">Product ID</param>
        /// <returns>Product details for editing</returns>
        public async Task<UpdateProductDto?> GetProductForEditAsync(int id)
        {
            var product = await _unitOfWork.ProductRepository.GetByIdAsync(id);
            return product != null ? _mapper.Map<UpdateProductDto>(product) : null;
        }

        public async Task<PagedResponse<ProductResponseDto>> GetProductsAsync(PagedRequest request)
        {
            var pagedProducts = await _unitOfWork.ProductRepository.GetPaginatedAsync(request);
            var totalRecords = await _unitOfWork.ProductRepository.GetCountAsync(request.SearchTerm);
            var productDtos = _mapper.Map<IEnumerable<ProductResponseDto>>(pagedProducts);
            return new PagedResponse<ProductResponseDto>(productDtos, request.ValidPageNumber, request.ValidPageSize, totalRecords);
        }

        public async Task<ProductResponseDto> CreateProductAsync(CreateProductDto request)
        {
            var product = _mapper.Map<Product>(request);
            
            await _unitOfWork.ProductRepository.AddAsync(product);
            await _unitOfWork.SaveChangesAsync();
            
            // Load navigation properties for response
            var createdProduct = await _unitOfWork.ProductRepository.GetByIdAsync(product.ProductId);
            return _mapper.Map<ProductResponseDto>(createdProduct);
        }

        public async Task<IEnumerable<object>> GetCategoriesForDropdownAsync()
        {
            var categories = await _unitOfWork.CategoryRepository.GetActiveCategoriesAsync();
            return categories.Select(c => new { Value = c.CategoryId, Text = c.Name });
        }

        public async Task<IEnumerable<object>> GetSubCategoriesForDropdownAsync()
        {
            var subCategories = await _unitOfWork.SubCategoryRepository.GetActiveSubCategoriesAsync();
            return subCategories.Select(sc => new { Value = sc.SubCategoryId, Text = sc.Name });
        }        public async Task<IEnumerable<object>> GetSuppliersForDropdownAsync()
        {
            var suppliers = await _unitOfWork.SupplierRepository.GetActiveSuppliersAsync();
            return suppliers.Select(s => new { Value = s.SupplierId, Text = s.CompanyName });
        }

        public async Task<ProductResponseDto> UpdateProductAsync(int id, UpdateProductDto request)
        {
            var product = await _unitOfWork.ProductRepository.GetByIdAsync(id);
            if (product == null)
            {
                throw new ArgumentException($"Product with ID {id} not found");
            }

            // Update the product entity with new data
            _mapper.Map(request, product);

            await _unitOfWork.ProductRepository.UpdateAsync(product);
            await _unitOfWork.SaveChangesAsync();

            // Return updated product as DTO
            return _mapper.Map<ProductResponseDto>(product);
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _unitOfWork.ProductRepository.GetByIdAsync(id);
            if (product == null)
            {
                return false;
            }

            await _unitOfWork.ProductRepository.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<object>> GetSubCategoriesByCategoryAsync(int categoryId)
        {
            var subCategories = await _unitOfWork.SubCategoryRepository.GetSubCategoriesByCategoryIdAsync(categoryId);
            return subCategories.Select(sc => new { Value = sc.SubCategoryId, Text = sc.Name });
        }
    }
}