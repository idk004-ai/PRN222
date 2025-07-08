﻿using System;
using System.Collections.Generic;

namespace ECommerce.Shared.Models;

public partial class Wishlist
{
    public int WishlistId { get; set; }

    public int CustomerId { get; set; }

    public int ProductId { get; set; }

    public bool? IsActive { get; set; }

    public virtual Customer Customer { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
