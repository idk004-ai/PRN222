using System;
using System.Collections.Generic;

namespace ECommerce.Shared.Models;

public partial class RecentlyView
{
    public int RviewId { get; set; }

    public int CustomerId { get; set; }

    public int ProductId { get; set; }

    public DateTime ViewDate { get; set; }

    public string? Note { get; set; }

    public virtual Customer Customer { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
