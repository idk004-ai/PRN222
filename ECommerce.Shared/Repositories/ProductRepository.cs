using ECommerce.Shared.DTOs;
using ECommerce.Shared.DTOs.Common;
using ECommerce.Shared.IRepositories;
using ECommerce.Shared.Models;
using ECommerce.Shared.Common.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Shared.Repositories
{
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        public ProductRepository(KahreedoContext context) : base(context)
        {
        }

        public override async Task<IEnumerable<Product>> GetPaginatedAsync(PagedRequest request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            IQueryable<Product> query = _dbSet
                .Include(p => p.Category)
                .Include(p => p.SubCategory)
                .Include(p => p.Supplier)
                .Include(p => p.ProductVariants);

            if (!string.IsNullOrEmpty(request.SearchTerm))
            {
                query = ApplySearchFilter(query, request.SearchTerm);
            }

            if (!string.IsNullOrEmpty(request.SortBy))
            {
                query = ApplySorting(query, request.SortBy, request.SortDescending);
            }

            return await query
                .Skip((request.ValidPageNumber - 1) * request.ValidPageSize)
                .Take(request.ValidPageSize)
                .ToListAsync();
        }

        protected override IQueryable<Product> ApplySearchFilter(IQueryable<Product> query, string searchTerm)
        {
            return query.Where(p => 
                p.Name.Contains(searchTerm) || 
                p.Category.Name.Contains(searchTerm) ||
                p.SubCategory != null && p.SubCategory.Name.Contains(searchTerm) ||
                p.Supplier.CompanyName.Contains(searchTerm)
                );
        }

        protected override IQueryable<Product> ApplySorting(IQueryable<Product> query, string sortBy, bool sortDescending)
        {
            return sortBy.ToLower() switch
            {
                "name" => sortDescending ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name),
                "price" => sortDescending ? query.OrderByDescending(p => p.UnitPrice) : query.OrderBy(p => p.UnitPrice),
                _ => query.OrderByDescending(p => p.ProductId) // Default sorting by Id
            };
        }
    }
}