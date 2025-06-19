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
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.Category.CategoryID));

            
        }
    }
}