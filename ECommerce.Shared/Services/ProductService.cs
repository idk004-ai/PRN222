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
            // Normalize product name for comparison
            var normalizedName = request.Name.Trim().ToUpperInvariant();
            
            // Check if a product with the same name already exists
            var existingProduct = await _unitOfWork.ProductRepository
                .GetFirstOrDefaultAsync(p => p.Name.Trim().ToUpper() == normalizedName && p.IsMainProduct);

            if (existingProduct != null && !string.IsNullOrEmpty(request.VariantType) && !string.IsNullOrEmpty(request.VariantValue))
            {
                // Product exists and this is a variant - check if variant already exists
                var existingVariant = await _unitOfWork.ProductVariantRepository
                    .GetFirstOrDefaultAsync(v => v.ProductID == existingProduct.ProductId && 
                                              v.VariantType.ToLower() == request.VariantType.ToLower() && 
                                              v.VariantValue.ToLower() == request.VariantValue.ToLower());

            if (existingVariant != null)
            {
                // Variant already exists, add stock quantity instead of creating duplicate
                var previousStock = existingVariant.StockQuantity;
                var additionalStock = request.VariantStockQuantity ?? request.UnitInStock ?? 0;
                
                if (additionalStock > 0)
                {
                    existingVariant.StockQuantity += additionalStock;
                    existingVariant.ModifiedDate = DateTime.Now;
                    
                    await _unitOfWork.ProductVariantRepository.UpdateAsync(existingVariant);
                    await _unitOfWork.SaveChangesAsync();
                    
                    // Log or optionally return message about stock update
                    Console.WriteLine($"Stock updated for variant {existingVariant.VariantValue}: {previousStock} → {existingVariant.StockQuantity} (+{additionalStock})");
                }
                
                // Return the existing product with updated stock
                var existingProductWithVariants = await _unitOfWork.ProductRepository.GetByIdAsync(existingProduct.ProductId);
                return _mapper.Map<ProductResponseDto>(existingProductWithVariants);
            }

                // Create new variant for existing product
                var variant = new ProductVariant
                {
                    ProductID = existingProduct.ProductId,
                    VariantName = $"{request.VariantValue} {existingProduct.Name}",
                    VariantType = request.VariantType,
                    VariantValue = request.VariantValue,
                    AdditionalPrice = request.VariantAdditionalPrice ?? 0,
                    StockQuantity = request.VariantStockQuantity ?? request.UnitInStock ?? 0,
                    VariantSKU = request.VariantSKU,
                    IsActive = true,
                    CreatedDate = DateTime.Now
                };

                await _unitOfWork.ProductVariantRepository.AddAsync(variant);
                await _unitOfWork.SaveChangesAsync();

                // Return the existing product with updated info
                var updatedProduct = await _unitOfWork.ProductRepository.GetByIdAsync(existingProduct.ProductId);
                return _mapper.Map<ProductResponseDto>(updatedProduct);
            }
            else
            {
                // Create new main product
                var product = _mapper.Map<Product>(request);
                product.IsMainProduct = true;
                product.ProductGroup = normalizedName;
                
                await _unitOfWork.ProductRepository.AddAsync(product);
                await _unitOfWork.SaveChangesAsync();
                
                // If variant info is provided, create the first variant
                if (!string.IsNullOrEmpty(request.VariantType) && !string.IsNullOrEmpty(request.VariantValue))
                {
                    var variant = new ProductVariant
                    {
                        ProductID = product.ProductId,
                        VariantName = $"{request.VariantValue} {product.Name}",
                        VariantType = request.VariantType,
                        VariantValue = request.VariantValue,
                        AdditionalPrice = request.VariantAdditionalPrice ?? 0,
                        StockQuantity = request.VariantStockQuantity ?? request.UnitInStock ?? 0,
                        VariantSKU = request.VariantSKU,
                        IsActive = true,
                        CreatedDate = DateTime.Now
                    };

                    await _unitOfWork.ProductVariantRepository.AddAsync(variant);
                    await _unitOfWork.SaveChangesAsync();
                }
                
                // Load navigation properties for response
                var createdProduct = await _unitOfWork.ProductRepository.GetByIdAsync(product.ProductId);
                return _mapper.Map<ProductResponseDto>(createdProduct);
            }
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

        /// <summary>
        /// Get all variants for a specific product
        /// </summary>
        /// <param name="productId">Product ID</param>
        /// <returns>List of product variants</returns>
        public async Task<IEnumerable<ProductVariantDto>> GetProductVariantsAsync(int productId)
        {
            var variants = await _unitOfWork.ProductVariantRepository.GetVariantsByProductIdAsync(productId);
            return _mapper.Map<IEnumerable<ProductVariantDto>>(variants);
        }

        /// <summary>
        /// Create a new variant for an existing product
        /// </summary>
        /// <param name="productId">Product ID</param>
        /// <param name="variantDto">Variant creation data</param>
        /// <returns>Created variant</returns>
        public async Task<ProductVariantDto?> CreateProductVariantAsync(int productId, CreateProductVariantDto variantDto)
        {
            // Check if product exists
            var product = await _unitOfWork.ProductRepository.GetByIdAsync(productId);
            if (product == null)
            {
                return null;
            }

            // Check if variant with same type and value already exists
            var existingVariant = await _unitOfWork.ProductVariantRepository
                .GetFirstOrDefaultAsync(v => v.ProductID == productId && 
                                          v.VariantType == variantDto.VariantType && 
                                          v.VariantValue == variantDto.VariantValue);
            
            if (existingVariant != null)
            {
                // Variant already exists, add stock quantity instead of creating duplicate
                var previousStock = existingVariant.StockQuantity;
                
                if (variantDto.StockQuantity > 0)
                {
                    existingVariant.StockQuantity += variantDto.StockQuantity;
                    existingVariant.ModifiedDate = DateTime.Now;
                    
                    // Optionally update additional price if provided and different
                    if (variantDto.AdditionalPrice != existingVariant.AdditionalPrice)
                    {
                        existingVariant.AdditionalPrice = variantDto.AdditionalPrice;
                    }
                    
                    await _unitOfWork.ProductVariantRepository.UpdateAsync(existingVariant);
                    await _unitOfWork.SaveChangesAsync();
                    
                    // Log stock update
                    Console.WriteLine($"Stock updated for variant {existingVariant.VariantValue}: {previousStock} → {existingVariant.StockQuantity} (+{variantDto.StockQuantity})");
                }
                
                return _mapper.Map<ProductVariantDto>(existingVariant);
            }

            // Create new variant
            var variant = new ProductVariant
            {
                ProductID = productId,
                VariantName = $"{variantDto.VariantValue} {product.Name}",
                VariantType = variantDto.VariantType,
                VariantValue = variantDto.VariantValue,
                AdditionalPrice = variantDto.AdditionalPrice,
                StockQuantity = variantDto.StockQuantity,
                VariantSKU = variantDto.VariantSKU,
                IsActive = true,
                CreatedDate = DateTime.Now
            };

            await _unitOfWork.ProductVariantRepository.AddAsync(variant);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<ProductVariantDto>(variant);
        }
    }
}