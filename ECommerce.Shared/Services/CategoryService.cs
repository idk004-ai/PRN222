using ECommerce.Shared.DTOs.Category;
using ECommerce.Shared.DTOs.Common;
using ECommerce.Shared.IRepositories;
using ECommerce.Shared.IServices;
using ECommerce.Shared.Mappings;
using ECommerce.Shared.Models;

namespace ECommerce.Shared.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CategoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<PagedResponse<CategoryDto>> GetCategoriesAsync(PagedRequest request)
        {
            var categories = await _unitOfWork.CategoryRepository.GetPaginatedAsync(request);
            var totalCount = await _unitOfWork.CategoryRepository.GetCountAsync(request.SearchTerm);

            var categoryDtos = categories.ToDtos();

            return new PagedResponse<CategoryDto>
            {
                Data = categoryDtos.ToList(),
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalRecords = totalCount
            };
        }

        public async Task<CategoryDto?> GetCategoryByIdAsync(int id)
        {
            var category = await _unitOfWork.CategoryRepository.GetByIdAsync(id);
            return category?.ToDto();
        }

        public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createDto)
        {
            var category = new Category
            {
                Name = createDto.Name,
                Description = createDto.Description,
                Picture1 = createDto.Picture1?.FileName, // Handle file upload properly
                Picture2 = createDto.Picture2?.FileName, // Handle file upload properly
                IsActive = createDto.IsActive
            };

            var createdCategory = await _unitOfWork.CategoryRepository.AddAsync(category);
            await _unitOfWork.SaveChangesAsync();

            return createdCategory.ToDto();
        }

        public async Task<CategoryDto> UpdateCategoryAsync(int id, UpdateCategoryDto updateDto)
        {
            var category = await _unitOfWork.CategoryRepository.GetByIdAsync(id);
            if (category == null)
            {
                throw new KeyNotFoundException($"Category with ID {id} not found");
            }

            category.Name = updateDto.Name;
            category.Description = updateDto.Description;
            category.Picture1 = updateDto.Picture1?.FileName; // Handle file upload properly
            category.Picture2 = updateDto.Picture2?.FileName; // Handle file upload properly
            category.IsActive = updateDto.IsActive;

            var updatedCategory = await _unitOfWork.CategoryRepository.UpdateAsync(category);
            await _unitOfWork.SaveChangesAsync();

            return updatedCategory.ToDto();
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var exists = await _unitOfWork.CategoryRepository.ExistsAsync(id);
            if (!exists)
            {
                return false;
            }

            await _unitOfWork.CategoryRepository.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<CategoryDto>> GetActiveCategoriesAsync()
        {
            var categories = await _unitOfWork.CategoryRepository.GetActiveCategoriesAsync();
            return categories.ToDtos();
        }
    }
}
