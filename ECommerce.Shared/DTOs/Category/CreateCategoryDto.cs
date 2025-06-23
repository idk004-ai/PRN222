using System.ComponentModel.DataAnnotations;

namespace ECommerce.Shared.DTOs.Category
{
    public class CreateCategoryDto
    {
        [Required(ErrorMessage = "Category name is required")]
        [StringLength(255, ErrorMessage = "Category name cannot exceed 255 characters")]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; }

        public IFormFile? Picture1 { get; set; }
        public IFormFile? Picture2 { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
