using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.Shared.Models
{
    [Table("SubCategory")]
    public class SubCategory
    {
        public SubCategory()
        {
            Products = new HashSet<Product>();
        }

        [Key]
        public int SubCategoryID { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [Required]
        public int CategoryID { get; set; }

        [StringLength(500)]
        public string? Picture1 { get; set; }

        [StringLength(500)]
        public string? Picture2 { get; set; }

        public bool? IsActive { get; set; }

        // Navigation properties
        [ForeignKey("CategoryID")]
        public virtual Category Category { get; set; } = null!;

        public virtual ICollection<Product> Products { get; set; }
    }
}
