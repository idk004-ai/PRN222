using System;
using System.Collections.Generic;

namespace ECommerce.Shared.Models;

public partial class Customer
{
    public int CustomerId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string UserName { get; set; } = null!;

    public string Password { get; set; } = null!;

    public int? Age { get; set; }

    public string? Gender { get; set; }

    public DateOnly? DateofBirth { get; set; }

    public string? Organization { get; set; }

    public string? Country { get; set; }

    public string? State { get; set; }

    public string? City { get; set; }

    public string? PostalCode { get; set; }

    public string? Email { get; set; }

    public string? AltEmail { get; set; }

    public string? Phone1 { get; set; }

    public string? Phone2 { get; set; }

    public string? Mobile1 { get; set; }

    public string? Mobile2 { get; set; }

    public string? Address1 { get; set; }

    public string? Address2 { get; set; }

    public string? Picture { get; set; }

    public string? Status { get; set; }

    public DateTime? LastLogin { get; set; }

    public DateOnly? Created { get; set; }

    public string? Notes { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<RecentlyView> RecentlyViews { get; set; } = new List<RecentlyView>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
}
