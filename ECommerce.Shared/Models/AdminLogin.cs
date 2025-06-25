using System;
using System.Collections.Generic;

namespace ECommerce.Shared.Models;

public partial class AdminLogin
{
    public int LoginId { get; set; }

    public int EmpId { get; set; }

    public string UserName { get; set; } = null!;

    public string Password { get; set; } = null!;

    public int? RoleType { get; set; }

    public string? Notes { get; set; }

    public virtual AdminEmployee Emp { get; set; } = null!;

    public virtual Role? RoleTypeNavigation { get; set; }
}
