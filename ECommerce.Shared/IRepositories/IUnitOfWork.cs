namespace ECommerce.Shared.IRepositories
{
    public interface IUnitOfWork : IDisposable
    {
        IProductRepository ProductRepository { get; }


        Task<int> SaveChangesAsync();
        int SaveChanges();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}