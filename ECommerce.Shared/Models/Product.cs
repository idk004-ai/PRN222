using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.Shared.Models
{
    [Table("Products")]
    public class Product
    {
        public Product()
        {
            OrderDetails = new HashSet<OrderDetail>();
            Reviews = new HashSet<Review>();
            Wishlists = new HashSet<Wishlist>();
        }

        [Key]
        public int ProductID { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public int SupplierID { get; set; }

        [Required]
        public int CategoryID { get; set; }

        public int? SubCategoryID { get; set; }

        [StringLength(100)]
        public string? QuantityPerUnit { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? OldPrice { get; set; }

        [StringLength(50)]
        public string? UnitWeight { get; set; }

        [StringLength(50)]
        public string? Size { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? Discount { get; set; }

        public int? UnitInStock { get; set; }

        public int? UnitOnOrder { get; set; }

        public bool? ProductAvailable { get; set; }

        [StringLength(500)]
        public string? ImageURL { get; set; }

        [StringLength(255)]
        public string? AltText { get; set; }

        public bool? AddBadge { get; set; }

        [StringLength(100)]
        public string? OfferTitle { get; set; }

        [StringLength(50)]
        public string? OfferBadgeClass { get; set; }

        [StringLength(1000)]
        public string? ShortDescription { get; set; }

        public string? LongDescription { get; set; }

        [StringLength(500)]
        public string? Picture1 { get; set; }

        [StringLength(500)]
        public string? Picture2 { get; set; }

        [StringLength(500)]
        public string? Picture3 { get; set; }

        [StringLength(500)]
        public string? Picture4 { get; set; }

        public string? Note { get; set; }

        // Navigation properties
        [ForeignKey("CategoryID")]
        public virtual Category Category { get; set; } = null!;

        [ForeignKey("SubCategoryID")]
        public virtual SubCategory? SubCategory { get; set; }

        [ForeignKey("SupplierID")]
        public virtual Supplier Supplier { get; set; } = null!;

        public virtual ICollection<OrderDetail> OrderDetails { get; set; }
        public virtual ICollection<Review> Reviews { get; set; }
        public virtual ICollection<Wishlist> Wishlists { get; set; }
    }
}
