using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.Shared.Models
{
    [Table("AdminLogins")]
    public class AdminLogin
    {
        [Key]
        public int LoginID { get; set; }

        [Required]
        public int EmpID { get; set; }

        [Required]
        [StringLength(50)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string Password { get; set; } = string.Empty;

        public int? RoleType { get; set; }

        public string? Notes { get; set; }

        // Navigation properties
        [ForeignKey("EmpID")]
        public virtual AdminEmployee AdminEmployee { get; set; } = null!;

        [ForeignKey("RoleType")]
        public virtual Role? Role { get; set; }
    }
}
