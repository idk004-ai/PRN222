using ECommerce.Shared.DTOs.Category;
using ECommerce.Shared.Models;

namespace ECommerce.Shared.Mappings
{
    public static class CategoryMappingExtensions
    {
        public static CategoryDto ToDto(this Category category)
        {
            return new CategoryDto
            {
                CategoryID = category.CategoryId,
                Name = category.Name,
                Description = category.Description,
                Picture1 = category.Picture1,
                Picture2 = category.Picture2,
                IsActive = category.IsActive,
                ProductCount = category.Products?.Count ?? 0,
                SubCategoryCount = category.SubCategories?.Count ?? 0
            };
        }

        public static IEnumerable<CategoryDto> ToDtos(this IEnumerable<Category> categories)
        {
            return categories.Select(c => c.ToDto());
        }
    }
}
