using ECommerce.Shared.Models;

namespace ECommerce.Shared.IRepositories
{
    public interface ISubCategoryRepository : IGenericRepository<SubCategory>
    {
        Task<IEnumerable<SubCategory>> GetSubCategoriesByCategoryIdAsync(int categoryId);
        Task<IEnumerable<SubCategory>> GetActiveSubCategoriesAsync();
    }
}
