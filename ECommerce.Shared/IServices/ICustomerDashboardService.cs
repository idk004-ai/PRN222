using ECommerce.Shared.DTOs;

namespace ECommerce.Shared.IServices;

public interface ICustomerDashboardService
{
    Task<CustomerDashboardDto> GetCustomerDashboardAsync(int customerId);
    Task<CustomerDashboardStatsDto> GetCustomerStatsAsync(int customerId);
    Task<List<RecentOrderDto>> GetRecentOrdersAsync(int customerId, int limit = 5);
    Task<CustomerProfileDto> GetCustomerProfileAsync(int customerId);
}
