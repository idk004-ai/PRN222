namespace ECommerce.Shared.DTOs.Product
{
    public class ProductVariantResponseDto : ProductVariantDto
    {
        public string? Message { get; set; }
        public bool IsStockUpdated { get; set; }
        public int? PreviousStock { get; set; }
        public int? AddedStock { get; set; }
    }
}
