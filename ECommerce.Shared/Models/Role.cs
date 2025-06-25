using System;
using System.Collections.Generic;

namespace ECommerce.Shared.Models;

public partial class Role
{
    public int RoleId { get; set; }

    public string RoleName { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<AdminLogin> AdminLogins { get; set; } = new List<AdminLogin>();
}
