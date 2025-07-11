namespace ECommerce.Shared.DTOs.Product
{
    public class ProductVariantDto
    {
        public int VariantID { get; set; }
        public int ProductID { get; set; }
        public string VariantName { get; set; } = string.Empty;
        public string VariantType { get; set; } = string.Empty;
        public string VariantValue { get; set; } = string.Empty;
        public decimal? AdditionalPrice { get; set; }
        public int? StockQuantity { get; set; }
        public string? VariantSKU { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? ProductName { get; set; }
        public decimal BasePrice { get; set; }
        public decimal TotalPrice { get; set; }
    }

    public class CreateProductVariantDto
    {
        public int ProductID { get; set; }
        public string VariantName { get; set; } = string.Empty;
        public string VariantType { get; set; } = string.Empty;
        public string VariantValue { get; set; } = string.Empty;
        public decimal? AdditionalPrice { get; set; } = 0;
        public int? StockQuantity { get; set; } = 0;
        public string? VariantSKU { get; set; }
    }

    public class ProductWithVariantsDto
    {
        public int ProductID { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public string? ImageURL { get; set; }
        public string? ShortDescription { get; set; }
        public bool ProductAvailable { get; set; }
        public List<ProductVariantDto> Variants { get; set; } = new List<ProductVariantDto>();
    }
}
