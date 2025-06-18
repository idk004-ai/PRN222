namespace ECommerce.Shared.Common.Models
{
    public class ValidationErrorResponse : ErrorResponse
    {
        public Dictionary<string, string[]> ValidationErrors { get; set; } = new();
    }
}