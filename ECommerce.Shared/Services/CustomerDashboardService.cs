using ECommerce.Shared.Models;
using ECommerce.Shared.DTOs;
using ECommerce.Shared.IServices;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Shared.Services;

public class CustomerDashboardService : ICustomerDashboardService
{
    private readonly KahreedoContext _context;

    public CustomerDashboardService(KahreedoContext context)
    {
        _context = context;
    }

    public async Task<CustomerDashboardDto> GetCustomerDashboardAsync(int customerId)
    {
        var customer = await _context.Customers
            .Include(c => c.Orders)
            .ThenInclude(o => o.OrderDetails)
            .FirstOrDefaultAsync(c => c.CustomerId == customerId);

        if (customer == null)
        {
            throw new Exception("Customer not found");
        }

        var completedOrders = customer.Orders.Where(o => o.IsCompleted == true).ToList();
        var pendingOrders = customer.Orders.Where(o => o.IsCompleted == false).ToList();

        var stats = new CustomerDashboardStatsDto
        {
            TotalOrders = completedOrders.Count,
            TotalSpent = completedOrders.Sum(o => o.TotalAmount ?? 0),
            PendingOrders = pendingOrders.Count
        };

        var profile = new CustomerProfileDto
        {
            CustomerId = customer.CustomerId,
            FullName = $"{customer.FirstName} {customer.LastName}",
            Email = customer.Email ?? "",
            JoinDate = customer.Created?.ToString("yyyy-MM-dd") ?? DateTime.Now.ToString("yyyy-MM-dd"),
            TotalOrders = completedOrders.Count,
            Avatar = customer.Picture
        };

        var recentOrders = customer.Orders
            .OrderByDescending(o => o.OrderDate)
            .Take(5)
            .Select(o => new RecentOrderDto
            {
                OrderId = o.OrderId,
                OrderDate = o.OrderDate?.ToString("yyyy-MM-dd") ?? "",
                TotalAmount = o.TotalAmount ?? 0,
                Status = GetOrderStatus(o),
                ItemCount = o.OrderDetails.Count
            })
            .ToList();

        return new CustomerDashboardDto
        {
            Stats = stats,
            Profile = profile,
            RecentOrders = recentOrders
        };
    }

    public async Task<CustomerDashboardStatsDto> GetCustomerStatsAsync(int customerId)
    {
        var customer = await _context.Customers
            .Include(c => c.Orders)
            .FirstOrDefaultAsync(c => c.CustomerId == customerId);

        if (customer == null)
        {
            throw new Exception("Customer not found");
        }

        var completedOrders = customer.Orders.Where(o => o.IsCompleted == true).ToList();
        var pendingOrders = customer.Orders.Where(o => o.IsCompleted == false).ToList();

        return new CustomerDashboardStatsDto
        {
            TotalOrders = completedOrders.Count,
            TotalSpent = completedOrders.Sum(o => o.TotalAmount ?? 0),
            PendingOrders = pendingOrders.Count
        };
    }

    public async Task<List<RecentOrderDto>> GetRecentOrdersAsync(int customerId, int limit = 5)
    {
        var orders = await _context.Orders
            .Where(o => o.CustomerId == customerId)
            .Include(o => o.OrderDetails)
            .OrderByDescending(o => o.OrderDate)
            .Take(limit)
            .Select(o => new RecentOrderDto
            {
                OrderId = o.OrderId,
                OrderDate = o.OrderDate!.Value.ToString("yyyy-MM-dd"),
                TotalAmount = o.TotalAmount ?? 0,
                Status = GetOrderStatus(o),
                ItemCount = o.OrderDetails.Sum(od => od.Quantity ?? 0)
            })
            .ToListAsync();

        return orders;
    }

    public async Task<CustomerProfileDto> GetCustomerProfileAsync(int customerId)
    {
        var customer = await _context.Customers
            .Include(c => c.Orders)
            .FirstOrDefaultAsync(c => c.CustomerId == customerId);

        if (customer == null)
        {
            throw new Exception("Customer not found");
        }

        var completedOrders = customer.Orders.Where(o => o.IsCompleted == true).Count();

        return new CustomerProfileDto
        {
            CustomerId = customer.CustomerId,
            FullName = $"{customer.FirstName} {customer.LastName}",
            Email = customer.Email ?? "",
            JoinDate = customer.Created?.ToString("yyyy-MM-dd") ?? "",
            TotalOrders = completedOrders,
            Avatar = customer.Picture
        };
    }

    private static string GetOrderStatus(Order order)
    {
        if (order.CancelOrder == true)
            return "Cancelled";
        
        if (order.Deliver == true)
            return "Delivered";
        
        if (order.Shipped == true)
            return "Shipped";
        
        if (order.Dispatched == true)
            return "Dispatched";
        
        if (order.IsCompleted == true)
            return "Completed";
        
        return "Processing";
    }
}
