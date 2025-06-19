using AutoMapper;
using ECommerce.Shared.DTOs.Common;
using ECommerce.Shared.DTOs.Product;
using ECommerce.Shared.IRepositories;
using ECommerce.Shared.IServices;

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
    }
}