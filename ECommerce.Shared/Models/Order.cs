using System;
using System.Collections.Generic;

namespace ECommerce.Shared.Models;

public partial class Order
{
    public int OrderId { get; set; }

    public int CustomerId { get; set; }

    public int? PaymentId { get; set; }

    public int? ShippingId { get; set; }

    public int? Discount { get; set; }

    public int? Taxes { get; set; }

    public int? TotalAmount { get; set; }

    public bool? IsCompleted { get; set; }

    public DateTime? OrderDate { get; set; }

    public bool? Dispatched { get; set; }

    public DateTime? DispatchedDate { get; set; }

    public bool? Shipped { get; set; }

    public DateTime? ShippingDate { get; set; }

    public bool? Deliver { get; set; }

    public DateTime? DeliveryDate { get; set; }

    public string? Notes { get; set; }

    public bool? CancelOrder { get; set; }

    public virtual Customer Customer { get; set; } = null!;

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

    public virtual Payment? Payment { get; set; }

    public virtual ShippingDetail? Shipping { get; set; }
}
