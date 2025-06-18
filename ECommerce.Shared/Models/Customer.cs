using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerce.Shared.Models
{
    [Table("Customers")]
    public class Customer
    {
        public Customer()
        {
            Reviews = new HashSet<Review>();
            Wishlists = new HashSet<Wishlist>();
            Orders = new HashSet<Order>();
        }

        [Key]
        public int CustomerID { get; set; }

        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string Password { get; set; } = string.Empty;

        public int? Age { get; set; }

        [StringLength(10)]
        public string? Gender { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(255)]
        public string? Organization { get; set; }

        [StringLength(100)]
        public string? Country { get; set; }

        [StringLength(100)]
        public string? State { get; set; }

        [StringLength(100)]
        public string? City { get; set; }

        [StringLength(20)]
        public string? PostalCode { get; set; }

        [Required]
        [StringLength(255)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [StringLength(255)]
        [EmailAddress]
        public string? AltEmail { get; set; }

        [StringLength(20)]
        public string? Phone1 { get; set; }

        [StringLength(20)]
        public string? Phone2 { get; set; }

        [StringLength(20)]
        public string? Mobile1 { get; set; }

        [StringLength(20)]
        public string? Mobile2 { get; set; }

        [StringLength(500)]
        public string? Address1 { get; set; }

        [StringLength(500)]
        public string? Address2 { get; set; }

        [StringLength(500)]
        public string? Picture { get; set; }

        [StringLength(50)]
        public string? Status { get; set; }

        public DateTime? LastLogin { get; set; }

        public DateTime? Created { get; set; }

        public string? Notes { get; set; }

        // Navigation properties
        public virtual ICollection<Review> Reviews { get; set; }
        public virtual ICollection<Wishlist> Wishlists { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
    }
}
