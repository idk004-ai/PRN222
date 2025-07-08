using ECommerce.Shared.Models;

namespace ECommerce.Shared.DTOs.Product
{
    public class ProductResponseDto
    {
        public int ProductId { get; set; }
        
        public string Name { get; set; } = string.Empty;
        public string? QuantityPerUnit { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal? OldPrice { get; set; }

        public string? UnitWeight { get; set; }

        public string? Size { get; set; }

        public decimal? Discount { get; set; }

        public int? UnitInStock { get; set; }

        public int? UnitOnOrder { get; set; }

        public bool? ProductAvailable { get; set; }

        public string? ImageUrl { get; set; }

        public string? AltText { get; set; }

        public bool? AddBadge { get; set; }

        public string? OfferTitle { get; set; }

        public string? OfferBadgeClass { get; set; }

        public string? ShortDescription { get; set; }

        public string? LongDescription { get; set; }

        public string? Picture1 { get; set; }

        public string? Picture2 { get; set; }

        public string? Picture3 { get; set; }

        public string? Picture4 { get; set; }

        public string? Note { get; set; }

        // Category info
        public int? CategoryId { get; set; }
        public string? CategoryName { get; set; }

        // SubCategory info
        public int? SubCategoryId { get; set; }
        public string? SubCategoryName { get; set; }

        // Supplier info
        public int? SupplierId { get; set; }
        public string? CompanyName { get; set; }
    }
}
