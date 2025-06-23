using ECommerce.Shared.Models;

namespace ECommerce.Shared.IRepositories
{
    public interface ICategoryRepository : IGenericRepository<Category>
    {
        Task<IEnumerable<Category>> GetActiveCategoriesAsync();
    }
}
