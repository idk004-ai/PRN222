using ECommerce.Shared.DTOs.Category;
using ECommerce.Shared.DTOs.Common;

namespace ECommerce.Shared.IServices
{
    public interface ICategoryService
    {
        Task<PagedResponse<CategoryDto>> GetCategoriesAsync(PagedRequest request);
        Task<CategoryDto?> GetCategoryByIdAsync(int id);
        Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createDto);
        Task<CategoryDto> UpdateCategoryAsync(int id, UpdateCategoryDto updateDto);
        Task<bool> DeleteCategoryAsync(int id);
        Task<IEnumerable<CategoryDto>> GetActiveCategoriesAsync();
    }
}
