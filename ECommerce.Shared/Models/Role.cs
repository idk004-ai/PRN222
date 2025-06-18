using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.Shared.Models
{
    [Table("Roles")]
    public class Role
    {
        public Role()
        {
            AdminLogins = new HashSet<AdminLogin>();
        }

        [Key]
        public int RoleID { get; set; }

        [Required]
        [StringLength(100)]
        public string RoleName { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        // Navigation properties
        public virtual ICollection<AdminLogin> AdminLogins { get; set; }
    }
}
