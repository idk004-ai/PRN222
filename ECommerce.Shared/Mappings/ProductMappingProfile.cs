using AutoMapper;
using ECommerce.Shared.DTOs.Product;
using ECommerce.Shared.Models;

namespace ECommerce.Shared.Mappings
{
    public class ProductMappingProfile : Profile
    {
        public ProductMappingProfile()
        {
            CreateMap<Product, ProductResponseDto>()
                .ForMember(dest => dest.CompanyName, opt => opt.MapFrom(src => src.Supplier.CompanyName))
                .ForMember(dest => dest.SupplierId, opt => opt.MapFrom(src => src.SupplierId))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.Category.CategoryId));            // Mapping from CreateProductDto to Product
            CreateMap<CreateProductDto, Product>()
                .ForMember(dest => dest.ProductId, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore())
                .ForMember(dest => dest.SubCategory, opt => opt.Ignore())
                .ForMember(dest => dest.Supplier, opt => opt.Ignore())
                .ForMember(dest => dest.OrderDetails, opt => opt.Ignore())
                .ForMember(dest => dest.Reviews, opt => opt.Ignore())
                .ForMember(dest => dest.Wishlists, opt => opt.Ignore());            // Mapping from Product to UpdateProductDto (for editing)
            CreateMap<Product, UpdateProductDto>()
                .ForMember(dest => dest.ProductID, opt => opt.MapFrom(src => src.ProductId))
                .ForMember(dest => dest.ImageFile, opt => opt.Ignore())
                .ForMember(dest => dest.Picture1File, opt => opt.Ignore())
                .ForMember(dest => dest.Picture2File, opt => opt.Ignore())
                .ForMember(dest => dest.Picture3File, opt => opt.Ignore())
                .ForMember(dest => dest.Picture4File, opt => opt.Ignore());

            // Mapping from UpdateProductDto to Product
            CreateMap<UpdateProductDto, Product>()
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.ProductID))
                .ForMember(dest => dest.Category, opt => opt.Ignore())
                .ForMember(dest => dest.SubCategory, opt => opt.Ignore())
                .ForMember(dest => dest.Supplier, opt => opt.Ignore())
                .ForMember(dest => dest.OrderDetails, opt => opt.Ignore())
                .ForMember(dest => dest.Reviews, opt => opt.Ignore())
                .ForMember(dest => dest.Wishlists, opt => opt.Ignore());

            // ProductVariant mappings
            CreateMap<ProductVariant, ProductVariantDto>();
            CreateMap<CreateProductVariantDto, ProductVariant>()
                .ForMember(dest => dest.VariantId, opt => opt.Ignore())
                .ForMember(dest => dest.ProductId, opt => opt.Ignore())
                .ForMember(dest => dest.VariantName, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedDate, opt => opt.Ignore())
                .ForMember(dest => dest.ModifiedDate, opt => opt.Ignore())
                .ForMember(dest => dest.Product, opt => opt.Ignore());
        }
    }
}