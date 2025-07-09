using ECommerce.Shared.IRepositories;
using ECommerce.Shared.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace ECommerce.Shared.Repositories
{
    public class ProductVariantRepository : IProductVariantRepository
    {
        private readonly DbContext _context;

        public ProductVariantRepository(DbContext context)
        {
            _context = context;
        }

        public async Task<ProductVariant?> GetByIdAsync(int id)
        {
            return await _context.Set<ProductVariant>()
                .Include(v => v.Product)
                .FirstOrDefaultAsync(v => v.VariantID == id);
        }

        public async Task<IEnumerable<ProductVariant>> GetByProductIdAsync(int productId)
        {
            return await _context.Set<ProductVariant>()
                .Where(v => v.ProductID == productId)
                .OrderBy(v => v.VariantType)
                .ThenBy(v => v.VariantValue)
                .ToListAsync();
        }

        public async Task<IEnumerable<ProductVariant>> GetActiveByProductIdAsync(int productId)
        {
            return await _context.Set<ProductVariant>()
                .Where(v => v.ProductID == productId && v.IsActive)
                .OrderBy(v => v.VariantType)
                .ThenBy(v => v.VariantValue)
                .ToListAsync();
        }

        public async Task AddAsync(ProductVariant variant)
        {
            await _context.Set<ProductVariant>().AddAsync(variant);
        }

        public Task UpdateAsync(ProductVariant variant)
        {
            variant.ModifiedDate = DateTime.Now;
            _context.Set<ProductVariant>().Update(variant);
            return Task.CompletedTask;
        }

        public async Task DeleteAsync(int id)
        {
            var variant = await GetByIdAsync(id);
            if (variant != null)
            {
                _context.Set<ProductVariant>().Remove(variant);
            }
        }

        public async Task<bool> ExistsAsync(int productId, string variantType, string variantValue)
        {
            return await _context.Set<ProductVariant>()
                .AnyAsync(v => v.ProductID == productId 
                          && v.VariantType.ToLower() == variantType.ToLower()
                          && v.VariantValue.ToLower() == variantValue.ToLower());
        }

        public async Task<IEnumerable<ProductVariant>> GetVariantsByProductIdAsync(int productId)
        {
            return await _context.Set<ProductVariant>()
                .Where(v => v.ProductID == productId)
                .OrderBy(v => v.VariantType)
                .ThenBy(v => v.VariantValue)
                .ToListAsync();
        }

        public async Task<ProductVariant?> GetFirstOrDefaultAsync(Expression<Func<ProductVariant, bool>> predicate)
        {
            return await _context.Set<ProductVariant>()
                .FirstOrDefaultAsync(predicate);
        }
    }
}
