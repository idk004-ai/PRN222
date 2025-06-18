using System.Net;

namespace ECommerce.Shared.Common.Exceptions
{
    public class ValidationException : BaseException
    {
        public Dictionary<string, string[]> ValidationErrors { get; }

        public ValidationException(string message) 
            : base(message, HttpStatusCode.BadRequest)
        {
            ValidationErrors = new Dictionary<string, string[]>();
        }

        public ValidationException(Dictionary<string, string[]> validationErrors) 
            : base("One or more validation errors occurred.", HttpStatusCode.BadRequest)
        {
            ValidationErrors = validationErrors;
        }

        public ValidationException(string field, string error) 
            : base("Validation error occurred.", HttpStatusCode.BadRequest)
        {
            ValidationErrors = new Dictionary<string, string[]>
            {
                { field, new[] { error } }
            };
        }
    }
}