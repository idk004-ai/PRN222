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

        public async Task<ProductResponseDto?> GetProductByIdAsync(int id)
        {
            var product = await _unitOfWork.ProductRepository.GetByIdAsync(id);
            return _mapper.Map<ProductResponseDto>(product);
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
            var createdProduct = await _unitOfWork.ProductRepository.GetByIdAsync(product.ProductID);
            return _mapper.Map<ProductResponseDto>(createdProduct);
        }

        public async Task<IEnumerable<object>> GetCategoriesForDropdownAsync()
        {
            var categories = await _unitOfWork.CategoryRepository.GetActiveCategoriesAsync();
            return categories.Select(c => new { Value = c.CategoryID, Text = c.Name });
        }

        public async Task<IEnumerable<object>> GetSubCategoriesForDropdownAsync()
        {
            var subCategories = await _unitOfWork.SubCategoryRepository.GetActiveSubCategoriesAsync();
            return subCategories.Select(sc => new { Value = sc.SubCategoryID, Text = sc.Name });
        }

        public async Task<IEnumerable<object>> GetSuppliersForDropdownAsync()
        {
            var suppliers = await _unitOfWork.SupplierRepository.GetActiveSuppliersAsync();
            return suppliers.Select(s => new { Value = s.SupplierID, Text = s.CompanyName });
        }
    }
}