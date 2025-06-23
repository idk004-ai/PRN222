using ECommerce.Shared.Data;
using ECommerce.Shared.IRepositories;
using ECommerce.Shared.Models;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Shared.Repositories
{
    public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(ECommerceDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Category>> GetActiveCategoriesAsync()
        {
            return await _dbSet
                .Where(c => c.IsActive == true)
                .OrderBy(c => c.Name)
                .ToListAsync();
        }
    }
}
