namespace ECommerce.Shared.DTOs;

public class CustomerDashboardStatsDto
{
    public int TotalOrders { get; set; }
    public decimal TotalSpent { get; set; }
    public int PendingOrders { get; set; }
}

public class CustomerProfileDto
{
    public int CustomerId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string JoinDate { get; set; } = string.Empty;
    public int TotalOrders { get; set; }
    public string? Avatar { get; set; }
}

public class RecentOrderDto
{
    public int OrderId { get; set; }
    public string OrderDate { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public int ItemCount { get; set; }
}

public class CustomerDashboardDto
{
    public CustomerDashboardStatsDto Stats { get; set; } = new();
    public CustomerProfileDto Profile { get; set; } = new();
    public List<RecentOrderDto> RecentOrders { get; set; } = new();
}
