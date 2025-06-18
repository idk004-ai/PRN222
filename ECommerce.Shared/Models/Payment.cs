using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.Shared.Models
{
    [Table("Payments")]
    public class Payment
    {
        public Payment()
        {
            Orders = new HashSet<Order>();
        }

        [Key]
        public int PaymentID { get; set; }

        [Required]
        public int Type { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? CreditAmount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? DebitAmount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Balance { get; set; }

        public DateTime? PaymentDateTime { get; set; }

        // Navigation properties
        [ForeignKey("Type")]
        public virtual PaymentType PaymentType { get; set; } = null!;

        public virtual ICollection<Order> Orders { get; set; }
    }
}
