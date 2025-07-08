namespace ECommerce.Shared.DTOs.SubCategory
{
    public class SubCategoryDto
    {
        public int SubCategoryID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int CategoryID { get; set; }
        public string? CategoryName { get; set; }
        public string? Picture1 { get; set; }
        public string? Picture2 { get; set; }
        public bool? IsActive { get; set; }
        
        // Navigation properties
        public int ProductCount { get; set; }
    }
}
