using System;
using System.Collections.Generic;

namespace ECommerce.Shared.Models;

public partial class ShippingDetail
{
    public int ShippingId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Mobile { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string? Province { get; set; }

    public string? City { get; set; }

    public string? PostCode { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
