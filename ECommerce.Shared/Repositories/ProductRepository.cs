using ECommerce.Shared.Data;
using ECommerce.Shared.DTOs;
using ECommerce.Shared.IRepositories;
using ECommerce.Shared.Models;

namespace ECommerce.Shared.Repositories
{
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        public ProductRepository(ECommerceDbContext context) : base(context)
        {
        } 
    }
}