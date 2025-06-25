using ECommerce.Shared.IRepositories;
using ECommerce.Shared.Models;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Shared.Repositories
{
    public class SubCategoryRepository : GenericRepository<SubCategory>, ISubCategoryRepository
    {
        public SubCategoryRepository(KahreedoContext context) : base(context)
        {
        }

        public async Task<IEnumerable<SubCategory>> GetSubCategoriesByCategoryIdAsync(int categoryId)
        {
            return await _dbSet
                .Where(sc => sc.CategoryId == categoryId && sc.IsActive == true)
                .OrderBy(sc => sc.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<SubCategory>> GetActiveSubCategoriesAsync()
        {
            return await _dbSet
                .Where(sc => sc.IsActive == true)
                .Include(sc => sc.Category)
                .OrderBy(sc => sc.Category.Name)
                .ThenBy(sc => sc.Name)
                .ToListAsync();
        }
    }
}
