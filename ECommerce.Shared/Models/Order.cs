using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.Shared.Models
{
    [Table("Orders")]
    public class Order
    {
        public Order()
        {
            OrderDetails = new HashSet<OrderDetail>();
        }

        [Key]
        public int OrderID { get; set; }

        [Required]
        public int CustomerID { get; set; }

        public int? PaymentID { get; set; }

        public int? ShippingID { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Discount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Taxes { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? TotalAmount { get; set; }

        public DateTime? OrderDate { get; set; }

        public bool? IsDispatched { get; set; }

        public DateTime? DispatchedDate { get; set; }

        public bool? Shipped { get; set; }

        public DateTime? ShippingDate { get; set; }

        public bool? Delivered { get; set; }

        public DateTime? DeliveryDate { get; set; }

        public string? Notes { get; set; }

        public bool? CancelOrder { get; set; }

        // Navigation properties
        [ForeignKey("CustomerID")]
        public virtual Customer Customer { get; set; } = null!;

        [ForeignKey("PaymentID")]
        public virtual Payment? Payment { get; set; }

        [ForeignKey("ShippingID")]
        public virtual ShippingDetail? ShippingDetail { get; set; }

        public virtual ICollection<OrderDetail> OrderDetails { get; set; }
    }
}
