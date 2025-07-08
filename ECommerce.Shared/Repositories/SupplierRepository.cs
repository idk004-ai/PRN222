using ECommerce.Shared.IRepositories;
using ECommerce.Shared.Models;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Shared.Repositories
{
    public class SupplierRepository : GenericRepository<Supplier>, ISupplierRepository
    {
        public SupplierRepository(KahreedoContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Supplier>> GetActiveSuppliersAsync()
        {
            return await _dbSet
                .OrderBy(s => s.CompanyName)
                .ToListAsync();
        }
    }
}
