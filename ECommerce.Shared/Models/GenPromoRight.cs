using System;
using System.Collections.Generic;

namespace ECommerce.Shared.Models;

public partial class GenPromoRight
{
    public int PromoRightId { get; set; }

    public int CategoryId { get; set; }

    public string? ImageUrl { get; set; }

    public string? AltText { get; set; }

    public string? OfferTag { get; set; }

    public string? Title { get; set; }

    public bool? IsDeleted { get; set; }

    public virtual Category Category { get; set; } = null!;
}
