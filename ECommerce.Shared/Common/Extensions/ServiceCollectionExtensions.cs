using ECommerce.Shared.IRepositories;
using ECommerce.Shared.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.Shared.Common.Extensions
{
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Add repositories and Unit of Work to the service collection
        /// </summary>
        /// <param name="services"></param>
        /// <returns></returns>
        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            // Register Unit of Work
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            
            // Register individual repositories (optional - since they're accessible via UnitOfWork)
            services.AddScoped<IProductRepository, ProductRepository>();
            
            return services;
        }
        
        /// <summary>
        /// Add business services to the service collection
        /// </summary>
        /// <param name="services"></param>
        /// <returns></returns>
        public static IServiceCollection AddBusinessServices(this IServiceCollection services)
        {
            // Register business logic services here when you create them
            // services.AddScoped<IProductService, ProductService>();
            // services.AddScoped<IOrderService, OrderService>();
            
            return services;
        }
        
        /// <summary>
        /// Add all ECommerce services (repositories + business services)
        /// </summary>
        /// <param name="services"></param>
        /// <returns></returns>
        public static IServiceCollection AddECommerceServices(this IServiceCollection services)
        {
            services.AddRepositories();
            services.AddBusinessServices();
            
            return services;
        }
    }
}
