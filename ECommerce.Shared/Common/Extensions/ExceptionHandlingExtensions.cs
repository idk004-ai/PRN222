using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using ECommerce.Shared.Common.Handlers;

namespace ECommerce.Shared.Common.Extensions
{
    public static class ExceptionHandlingExtensions
    {
        public static IServiceCollection AddGlobalExceptionHandling(this IServiceCollection services)
        {
            services.AddExceptionHandler<GlobalExceptionHandler>();
            services.AddProblemDetails();
            return services;
        }

        public static IApplicationBuilder UseGlobalExceptionHandling(this IApplicationBuilder app)
        {
            app.UseExceptionHandler();
            return app;
        }
    }
}