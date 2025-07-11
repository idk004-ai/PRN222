using System;
using System.Collections.Generic;

namespace ECommerce.Shared.Models;

public partial class ProductVariant
{
    public int VariantId { get; set; }

    public int ProductId { get; set; }

    public string VariantName { get; set; } = null!;

    public string VariantType { get; set; } = null!;

    public string VariantValue { get; set; } = null!;

    public decimal? AdditionalPrice { get; set; }

    public int? StockQuantity { get; set; }

    public string? VariantSku { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public virtual Product Product { get; set; } = null!;
}
