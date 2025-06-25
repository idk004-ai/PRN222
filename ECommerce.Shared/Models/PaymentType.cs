using System;
using System.Collections.Generic;

namespace ECommerce.Shared.Models;

public partial class PaymentType
{
    public int PayTypeId { get; set; }

    public string TypeName { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
