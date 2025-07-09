using System.ComponentModel.DataAnnotations;

namespace ECommerce.Shared.Models
{
    public class ProductVariant
    {
        public int VariantID { get; set; }

        [Required]
        public int ProductID { get; set; }

        [Required]
        [StringLength(100)]
        public string VariantName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string VariantType { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string VariantValue { get; set; } = string.Empty;

        public decimal? AdditionalPrice { get; set; } = 0;

        public int? StockQuantity { get; set; } = 0;

        [StringLength(50)]
        public string? VariantSKU { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public DateTime? ModifiedDate { get; set; }

        // Navigation property
        public virtual Product? Product { get; set; }
    }
}
