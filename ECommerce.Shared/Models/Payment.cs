using System;
using System.Collections.Generic;

namespace ECommerce.Shared.Models;

public partial class Payment
{
    public int PaymentId { get; set; }

    public int Type { get; set; }

    public decimal? CreditAmount { get; set; }

    public decimal? DebitAmount { get; set; }

    public decimal? Balance { get; set; }

    public DateTime? PaymentDateTime { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual PaymentType TypeNavigation { get; set; } = null!;
}
