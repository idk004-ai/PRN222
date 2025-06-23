using System.ComponentModel.DataAnnotations;

namespace ECommerce.Shared.DTOs.Category
{
    public class UpdateCategoryDto
    {
        public int CategoryID { get; set; }

        [Required(ErrorMessage = "Category name is required")]
        [StringLength(255, ErrorMessage = "Category name cannot exceed 255 characters")]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; }

        public IFormFile? Picture1 { get; set; }
        public IFormFile? Picture2 { get; set; }

        // Existing image paths (to keep if no new images uploaded)
        public string? ExistingPicture1 { get; set; }
        public string? ExistingPicture2 { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
