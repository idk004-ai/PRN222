using ECommerce.Shared.Models;

namespace ECommerce.Shared.DTOs.Product
{
    public class ProductResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal? OldPrice { get; set; }
        public decimal? Discount { get; set; }
        public int Stock { get; set; }
        public int? UnitOnOrder { get; set; }
        public bool? ProductAvailable { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
        // Category info
        public int? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        
        // SubCategory info
        public int? SubCategoryId { get; set; }
        public string? SubCategoryName { get; set; }
        
        // Supplier info
        public int? SupplierId { get; set; }
        public string? SupplierName { get; set; }
    }
}
