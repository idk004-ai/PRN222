using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace ECommerce.Shared.DTOs.Product
{
    public class UpdateProductDto
    {
        public int ProductID { get; set; }

        [Required(ErrorMessage = "Product name is required")]
        [StringLength(255, ErrorMessage = "Product name cannot exceed 255 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Supplier is required")]
        public int SupplierID { get; set; }

        [Required(ErrorMessage = "Category is required")]
        public int CategoryID { get; set; }

        public int? SubCategoryID { get; set; }

        [StringLength(100)]
        public string? QuantityPerUnit { get; set; }

        [Required(ErrorMessage = "Unit price is required")]
        [Range(0, double.MaxValue, ErrorMessage = "Unit price must be greater than 0")]
        public decimal UnitPrice { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Old price must be greater than 0")]
        public decimal? OldPrice { get; set; }

        [StringLength(50)]
        public string? UnitWeight { get; set; }

        [StringLength(50)]
        public string? Size { get; set; }

        [Range(0, 100, ErrorMessage = "Discount must be between 0 and 100")]
        public decimal? Discount { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Stock must be greater than or equal to 0")]
        public int? UnitInStock { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Unit on order must be greater than or equal to 0")]
        public int? UnitOnOrder { get; set; }

        public bool ProductAvailable { get; set; } = true;

        public bool AddBadge { get; set; } = false;

        [StringLength(100)]
        public string? OfferTitle { get; set; }

        [StringLength(50)]
        public string? OfferBadgeClass { get; set; }

        [StringLength(1000)]
        public string? ShortDescription { get; set; }
        
        public string? LongDescription { get; set; }

        [StringLength(255)]
        public string? AltText { get; set; }

        public string? Note { get; set; }

        // File upload properties - these will be converted to URLs after upload
        public IFormFile? ImageFile { get; set; }
        public IFormFile? Picture1File { get; set; }
        public IFormFile? Picture2File { get; set; }
        public IFormFile? Picture3File { get; set; }
        public IFormFile? Picture4File { get; set; }

        // These properties will be populated automatically after file upload
        // (not displayed in form but used internally)
        public string? ImageURL { get; set; }
        public string? Picture1 { get; set; }
        public string? Picture2 { get; set; }
        public string? Picture3 { get; set; }
        public string? Picture4 { get; set; }

        public override string ToString()
        {
            return $"Product ID: {ProductID}\n" +
                   $"Name: {Name}\n" +
                   $"Supplier ID: {SupplierID}\n" +
                   $"Category ID: {CategoryID}\n" +
                   $"SubCategory ID: {SubCategoryID}\n" +
                   $"Quantity Per Unit: {QuantityPerUnit}\n" +
                   $"Unit Price: {UnitPrice}\n" +
                   $"Old Price: {OldPrice}\n" +
                   $"Unit Weight: {UnitWeight}\n" +
                   $"Size: {Size}\n" +
                   $"Discount: {Discount}\n" +
                   $"Units In Stock: {UnitInStock}\n" +
                   $"Units On Order: {UnitOnOrder}\n" +
                   $"Product Available: {ProductAvailable}\n" +
                   $"Add Badge: {AddBadge}\n" +
                   $"Offer Title: {OfferTitle}\n" +
                   $"Offer Badge Class: {OfferBadgeClass}\n" +
                   $"Short Description: {ShortDescription}\n" +
                   $"Long Description: {LongDescription}\n" +
                   $"Alt Text: {AltText}\n" +
                   $"Note: {Note}\n" +
                   $"Image URL: {ImageURL}\n" +
                   $"Picture1: {Picture1}\n" +
                   $"Picture2: {Picture2}\n" +
                   $"Picture3: {Picture3}\n" +
                   $"Picture4: {Picture4}";
        }
    }
}
