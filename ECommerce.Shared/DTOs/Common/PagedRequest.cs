namespace ECommerce.Shared.DTOs.Common
{
    public class PagedRequest
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SearchTerm { get; set; }
        public string? SortBy { get; set; }
        public bool SortDescending { get; set; } = false;

        // Validation
        public int ValidPageNumber => PageNumber < 1 ? 1 : PageNumber;
        public int ValidPageSize => PageSize < 1 ? 10 : (PageSize > 100 ? 100 : PageSize);
    }
}
