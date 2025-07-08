using System;
using System.Collections.Generic;

namespace ECommerce.Shared.Models;

public partial class AdminEmployee
{
    public int EmpId { get; set; }

    public string FirstName { get; set; } = null!;

    public string? LastName { get; set; }

    public int? Age { get; set; }

    public DateOnly? DateofBirth { get; set; }

    public string? Gender { get; set; }

    public string? Email { get; set; }

    public string? Address { get; set; }

    public string? Phone { get; set; }

    public string Mobile { get; set; } = null!;

    public string? PhotoPath { get; set; }

    public virtual ICollection<AdminLogin> AdminLogins { get; set; } = new List<AdminLogin>();
}
