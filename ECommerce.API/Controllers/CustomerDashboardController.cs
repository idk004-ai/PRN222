using Microsoft.AspNetCore.Mvc;
using ECommerce.Shared.IServices;
using ECommerce.Shared.DTOs;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomerDashboardController : ControllerBase
{
    private readonly ICustomerDashboardService _customerDashboardService;

    public CustomerDashboardController(ICustomerDashboardService customerDashboardService)
    {
        _customerDashboardService = customerDashboardService;
    }

    [HttpGet("{customerId}/dashboard")]
    public async Task<ActionResult<CustomerDashboardDto>> GetCustomerDashboard(int customerId)
    {
        try
        {
            var dashboard = await _customerDashboardService.GetCustomerDashboardAsync(customerId);
            return Ok(dashboard);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("{customerId}/stats")]
    public async Task<ActionResult<CustomerDashboardStatsDto>> GetCustomerStats(int customerId)
    {
        try
        {
            var stats = await _customerDashboardService.GetCustomerStatsAsync(customerId);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("{customerId}/recent-orders")]
    public async Task<ActionResult<List<RecentOrderDto>>> GetRecentOrders(int customerId, [FromQuery] int limit = 5)
    {
        try
        {
            var orders = await _customerDashboardService.GetRecentOrdersAsync(customerId, limit);
            return Ok(orders);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("{customerId}/profile")]
    public async Task<ActionResult<CustomerProfileDto>> GetCustomerProfile(int customerId)
    {
        try
        {
            var profile = await _customerDashboardService.GetCustomerProfileAsync(customerId);
            return Ok(profile);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
