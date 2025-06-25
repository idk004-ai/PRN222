using System;
using System.Collections.Generic;

namespace ECommerce.Shared.Models;

public partial class Category
{
    public int CategoryId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string? Picture1 { get; set; }

    public string? Picture2 { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<GenPromoRight> GenPromoRights { get; set; } = new List<GenPromoRight>();

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    public virtual ICollection<SubCategory> SubCategories { get; set; } = new List<SubCategory>();
}
