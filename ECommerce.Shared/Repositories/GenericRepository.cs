using System.Linq.Expressions;
using ECommerce.Shared.Common.Exceptions;
using ECommerce.Shared.Data;
using ECommerce.Shared.DTOs.Common;
using ECommerce.Shared.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Shared.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly ECommerceDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public GenericRepository(ECommerceDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public virtual async Task<T> AddAsync(T entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            await _dbSet.AddAsync(entity);
            return entity;
        }

        public virtual async Task DeleteAsync(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity == null)
                throw new NotFoundException(nameof(T), id);
            _dbSet.Remove(entity);
        }

        public virtual async Task<bool> ExistsAsync(int id)
        {
            return await _dbSet.FindAsync(id) != null;
        }

        public virtual async Task<IEnumerable<T>> FindByAsync(Func<T, bool> predicate)
        {
            return await Task.FromResult(_dbSet.Where(predicate));
        }

        public virtual async Task<IEnumerable<T>> Get(
            Expression<Func<T, bool>>? filter = null,
            Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
            string includeProperties = ""
        )
        {
            IQueryable<T> query = _dbSet;
            if (filter != null)
            {
                query = query.Where(filter);
            }

            foreach (var includeProperty in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }

            if (orderBy != null)
            {
                return await orderBy(query).ToListAsync();
            }
            else
            {
                return await query.ToListAsync();
            }
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public virtual async Task<T> GetByIdAsync(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity == null)
                throw new NotFoundException(nameof(T), id);
            return entity;
        }

        public virtual async Task<T> UpdateAsync(T entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            _dbSet.Update(entity);
            return await Task.FromResult(entity);
        }

        public virtual async Task<IEnumerable<T>> GetPaginatedAsync(PagedRequest request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            IQueryable<T> query = _dbSet;

            // Apply search filter if provided
            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                query = ApplySearchFilter(query, request.SearchTerm);
            }

            // Apply sorting
            if (!string.IsNullOrWhiteSpace(request.SortBy))
            {
                query = ApplySorting(query, request.SortBy, request.SortDescending);
            }

            // Apply pagination
            var result = await query
                .Skip((request.ValidPageNumber - 1) * request.ValidPageSize)
                .Take(request.ValidPageSize)
                .ToListAsync();

            return result;
        }

        public virtual async Task<int> GetCountAsync(string? searchTerm = null)
        {
            IQueryable<T> query = _dbSet;

            // Apply search filter if provided
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = ApplySearchFilter(query, searchTerm);
            }

            return await query.CountAsync();
        }

        /// <summary>
        /// Virtual method to apply search filtering. Override in derived classes for entity-specific search logic.
        /// </summary>
        /// <param name="query">The base query</param>
        /// <param name="searchTerm">The search term</param>
        /// <returns>Filtered query</returns>
        protected virtual IQueryable<T> ApplySearchFilter(IQueryable<T> query, string searchTerm)
        {
            // Default implementation - no filtering
            // Override in specific repositories (e.g., ProductRepository) to implement search logic
            return query;
        }

        /// <summary>
        /// Virtual method to apply sorting. Override in derived classes for entity-specific sort logic.
        /// </summary>
        /// <param name="query">The base query</param>
        /// <param name="sortBy">The field to sort by</param>
        /// <param name="sortDescending">Sort direction</param>
        /// <returns>Sorted query</returns>
        protected virtual IQueryable<T> ApplySorting(IQueryable<T> query, string sortBy, bool sortDescending)
        {
            // Default implementation - sort by first property
            // Override in specific repositories for proper sorting
            return query;
        }
    }
}