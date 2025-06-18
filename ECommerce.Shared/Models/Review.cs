using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.Shared.Models
{
    [Table("Reviews")]
    public class Review
    {
        [Key]
        public int ReviewID { get; set; }

        public int? CustomerID { get; set; }

        public int? ProductID { get; set; }

        [StringLength(100)]
        public string? Name { get; set; }

        [StringLength(255)]
        [EmailAddress]
        public string? Email { get; set; }

        public string? ReviewText { get; set; }

        [Range(1, 5)]
        public int? Rate { get; set; }

        public DateTime? DateTime { get; set; }

        public bool? IsDeleted { get; set; }

        // Navigation properties
        [ForeignKey("CustomerID")]
        public virtual Customer? Customer { get; set; }

        [ForeignKey("ProductID")]
        public virtual Product? Product { get; set; }
    }
}
