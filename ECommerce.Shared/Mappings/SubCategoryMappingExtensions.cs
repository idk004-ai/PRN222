using ECommerce.Shared.DTOs.SubCategory;
using ECommerce.Shared.Models;

namespace ECommerce.Shared.Mappings
{
    public static class SubCategoryMappingExtensions
    {
        public static SubCategoryDto ToDto(this SubCategory subCategory)
        {
            return new SubCategoryDto
            {
                SubCategoryID = subCategory.SubCategoryId,
                Name = subCategory.Name,
                Description = subCategory.Description,
                CategoryID = subCategory.CategoryId,
                CategoryName = subCategory.Category?.Name,
                Picture1 = subCategory.Picture1,
                Picture2 = subCategory.Picture2,
                IsActive = subCategory.IsActive,
                ProductCount = subCategory.Products?.Count ?? 0
            };
        }

        public static IEnumerable<SubCategoryDto> ToDtos(this IEnumerable<SubCategory> subCategories)
        {
            return subCategories.Select(sc => sc.ToDto());
        }
    }
}
