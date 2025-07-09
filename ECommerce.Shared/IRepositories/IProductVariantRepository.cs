using ECommerce.Shared.Models;
using System.Linq.Expressions;

namespace ECommerce.Shared.IRepositories
{
    public interface IProductVariantRepository
    {
        Task<ProductVariant?> GetByIdAsync(int id);
        Task<IEnumerable<ProductVariant>> GetByProductIdAsync(int productId);
        Task<IEnumerable<ProductVariant>> GetVariantsByProductIdAsync(int productId);
        Task<IEnumerable<ProductVariant>> GetActiveByProductIdAsync(int productId);
        Task<ProductVariant?> GetFirstOrDefaultAsync(Expression<Func<ProductVariant, bool>> predicate);
        Task AddAsync(ProductVariant variant);
        Task UpdateAsync(ProductVariant variant);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int productId, string variantType, string variantValue);
    }
}
