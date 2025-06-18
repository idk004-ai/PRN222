using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.Shared.Models
{
    [Table("AdminEmployees")]
    public class AdminEmployee
    {
        public AdminEmployee()
        {
            AdminLogins = new HashSet<AdminLogin>();
        }

        [Key]
        public int EmpID { get; set; }

        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;

        public int? Age { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(10)]
        public string? Gender { get; set; }

        [Required]
        [StringLength(255)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Address { get; set; }

        [StringLength(20)]
        public string? Phone { get; set; }

        [StringLength(20)]
        public string? Mobile { get; set; }

        [StringLength(500)]
        public string? PhotoPath { get; set; }

        // Navigation properties
        public virtual ICollection<AdminLogin> AdminLogins { get; set; }
    }
}
