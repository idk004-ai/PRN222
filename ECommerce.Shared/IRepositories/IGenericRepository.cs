using System.Linq.Expressions;
using ECommerce.Shared.DTOs.Common;

namespace ECommerce.Shared.IRepositories
{
    public interface IGenericRepository<T> where T : class
    {
        /// <summary>
        /// Retrieves a collection of entities based on the specified filter, order, and included properties.
        /// </summary>
        /// <param name="filter"></param>
        /// <param name="orderBy"></param>
        /// <param name="includeProperties"></param>
        /// <returns></returns>
        Task<IEnumerable<T>> Get(
            Expression<Func<T, bool>>? filter = null,
            Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
            string includeProperties = ""
        );

        /// <summary>
        /// Retrieves an entity by its unique identifier asynchronously. This method 
        /// also checks if the id is valid and throws an exception if it is not.
        /// </summary>
        /// <param name="id">The unique identifier of the entity to retrieve.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the entity found, or null if no entity is found.</returns>
        /// <exception cref="ArgumentException">Thrown when the id parameter is invalid.</exception>
        Task<T> GetByIdAsync(int id);
        
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> AddAsync(T entity);
        Task<T> UpdateAsync(T entity);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<T>> FindByAsync(Func<T, bool> predicate);
        
        /// <summary>
        /// Retrieves a paginated collection of entities based on the specified request parameters.
        /// </summary>
        /// <param name="request">The pagination request containing page number, page size, search term, and sort options.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the paginated entities.</returns>
        Task<IEnumerable<T>> GetPaginatedAsync(PagedRequest request);
        
        /// <summary>
        /// Gets the total count of entities matching the specified search term.
        /// </summary>
        /// <param name="searchTerm">The search term to filter entities. If null or empty, returns total count of all entities.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the total count.</returns>
        Task<int> GetCountAsync(string? searchTerm = null);
        
        /// <summary>
        /// Gets the first entity that matches the specified predicate, or null if no entity is found.
        /// </summary>
        /// <param name="predicate">The predicate to filter entities.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the first matching entity or null.</returns>
        Task<T?> GetFirstOrDefaultAsync(Expression<Func<T, bool>> predicate);
    }
}