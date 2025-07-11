using ECommerce.Shared.IRepositories;
using ECommerce.Shared.Models;
using Microsoft.EntityFrameworkCore.Storage;

namespace ECommerce.Shared.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly KahreedoContext _context;
        private IDbContextTransaction? _transaction;
        private IProductRepository? _productRepository;
        private IProductVariantRepository? _productVariantRepository;
        private ICategoryRepository? _categoryRepository;
        private ISubCategoryRepository? _subCategoryRepository;
        private ISupplierRepository? _supplierRepository;
        private bool _disposed = false;

        public IProductRepository ProductRepository => _productRepository ??= new ProductRepository(_context);
        public IProductVariantRepository ProductVariantRepository => _productVariantRepository ??= new ProductVariantRepository(_context);
        public ICategoryRepository CategoryRepository => _categoryRepository ??= new CategoryRepository(_context);
        public ISubCategoryRepository SubCategoryRepository => _subCategoryRepository ??= new SubCategoryRepository(_context);
        public ISupplierRepository SupplierRepository => _supplierRepository ??= new SupplierRepository(_context);

        public UnitOfWork(KahreedoContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task BeginTransactionAsync()
        {
            if (_transaction != null)
                throw new InvalidOperationException("Transaction already started.");

            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            if (_transaction == null)
                throw new InvalidOperationException("No transaction to commit.");

            try
            {
                await _transaction.CommitAsync();
            }
            catch (System.Exception)
            {
                await RollbackTransactionAsync();
                throw;
            }
            finally
            {
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _transaction?.Dispose();
                    _context.Dispose();
                }
                _disposed = true;
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction == null)
                throw new InvalidOperationException("No transaction to rollback.");

            try
            {
                await _transaction.RollbackAsync();
            }
            finally
            {
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public int SaveChanges()
        {
            try
            {
                return _context.SaveChanges();
            }
            catch (System.Exception)
            {
                throw;
            }
        }

        public async Task<int> SaveChangesAsync()
        {
            try
            {
                return await _context.SaveChangesAsync();
            }
            catch (System.Exception)
            {
                throw;
            }
        }
    }
}