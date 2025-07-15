using ECommerce.Shared.Models;

namespace ECommerce.Shared.DTOs.Product
{
    class ProductCartDto
    {
        public int ProductId { get; set; }
        public string? Name { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public string? ImageUrl { get; set; }
        public string? AltText { get; set; }
        public int UnitInStock { get; set; }
        public int Size { get; set; }
        public int? MaxQuantity { get; set; }
    }
}