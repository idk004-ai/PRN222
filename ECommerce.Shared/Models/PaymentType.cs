using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.Shared.Models
{
    [Table("PaymentTypes")]
    public class PaymentType
    {
        public PaymentType()
        {
            Payments = new HashSet<Payment>();
        }

        [Key]
        public int PayTypeID { get; set; }

        [Required]
        [StringLength(100)]
        public string TypeName { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        // Navigation properties
        public virtual ICollection<Payment> Payments { get; set; }
    }
}
