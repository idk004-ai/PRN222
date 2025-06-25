using ECommerce.Shared.DTOs.SubCategory;
using ECommerce.Shared.IRepositories;
using ECommerce.Shared.Mappings;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubCategoriesController : ControllerBase
    {
        private readonly ISubCategoryRepository _subCategoryRepository;

        public SubCategoriesController(ISubCategoryRepository subCategoryRepository)
        {
            _subCategoryRepository = subCategoryRepository;
        }

        /// <summary>
        /// Get subcategories by category ID
        /// </summary>
        /// <param name="categoryId">Category ID</param>
        /// <returns>List of subcategories</returns>
        [HttpGet("by-category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<SubCategoryDto>>> GetSubCategoriesByCategory(int categoryId)
        {
            var subCategories = await _subCategoryRepository.GetSubCategoriesByCategoryIdAsync(categoryId);
            var subCategoryDtos = subCategories.ToDtos();
            return Ok(subCategoryDtos);
        }

        /// <summary>
        /// Get all subcategories
        /// </summary>
        /// <returns>List of subcategories</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubCategoryDto>>> GetSubCategories()
        {
            var subCategories = await _subCategoryRepository.GetAllAsync();
            var subCategoryDtos = subCategories.ToDtos();
            return Ok(subCategoryDtos);
        }

        /// <summary>
        /// Get subcategory by ID
        /// </summary>
        /// <param name="id">SubCategory ID</param>
        /// <returns>SubCategory details</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<SubCategoryDto>> GetSubCategory(int id)
        {
            var subCategory = await _subCategoryRepository.GetByIdAsync(id);
            if (subCategory == null)
            {
                return NotFound();
            }
            return Ok(subCategory.ToDto());
        }
    }
}
