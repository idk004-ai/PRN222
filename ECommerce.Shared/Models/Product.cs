using System;
using System.Collections.Generic;

namespace ECommerce.Shared.Models;

public partial class Product
{
    public int ProductId { get; set; }

    public string Name { get; set; } = null!;

    public int SupplierId { get; set; }

    public int CategoryId { get; set; }

    public int? SubCategoryId { get; set; }

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

    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

    public virtual ICollection<RecentlyView> RecentlyViews { get; set; } = new List<RecentlyView>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual SubCategory? SubCategory { get; set; }

    public virtual Supplier Supplier { get; set; } = null!;

    public virtual ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
}
