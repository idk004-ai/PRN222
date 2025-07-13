using ECommerce.Shared.IRepositories;
using ECommerce.Shared.IServices;
using ECommerce.Shared.Mappings;
using ECommerce.Shared.Repositories;
using ECommerce.Shared.Services;
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
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<ISupplierRepository, SupplierRepository>();
            services.AddScoped<ISubCategoryRepository, SubCategoryRepository>();
            
            return services;
        }

        /// <summary>
        /// Add business services to the service collection
        /// </summary>
        /// <param name="services"></param>
        /// <returns></returns>
        public static IServiceCollection AddBusinessServices(this IServiceCollection services)
        {
            // Register business logic services
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IAuthService, AuthService>();
            // services.AddScoped<ISupplierService, SupplierService>();
            // services.AddScoped<ISubCategoryService, SubCategoryService>();

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
            services.AddAutoMapperProfiles();
            return services;
        }

        /// <summary>
        /// Add AutoMapper configurations
        /// </summary>
        /// <param name="services"></param>
        /// <returns></returns>
        public static IServiceCollection AddAutoMapperProfiles(this IServiceCollection services)
        {
            // Đăng ký tất cả profiles trong assembly
            services.AddAutoMapper(typeof(ProductMappingProfile).Assembly);

            return services;
        }
    }
}
