using ECommerce.Shared.Models;

namespace ECommerce.Shared.IRepositories
{
    public interface ISupplierRepository : IGenericRepository<Supplier>
    {
        Task<IEnumerable<Supplier>> GetActiveSuppliersAsync();
    }
}
