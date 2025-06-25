using System;
using System.Collections.Generic;

namespace ECommerce.Shared.Models;

public partial class Supplier
{
    public int SupplierId { get; set; }

    public string CompanyName { get; set; } = null!;

    public string? ContactName { get; set; }

    public string? ContactTitle { get; set; }

    public string? Address { get; set; }

    public string? Mobile { get; set; }

    public string Phone { get; set; } = null!;

    public string? Fax { get; set; }

    public string Email { get; set; } = null!;

    public string? City { get; set; }

    public string? Country { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
