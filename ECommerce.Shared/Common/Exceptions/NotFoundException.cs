using System.Net;

namespace ECommerce.Shared.Common.Exceptions
{
    public class NotFoundException : BaseException
    {
        public NotFoundException(string message) 
            : base(message, HttpStatusCode.NotFound)
        {
        }

        public NotFoundException(string message, string details) 
            : base(message, HttpStatusCode.NotFound, details)
        {
        }

        public NotFoundException(string entityName, object key) 
            : base($"{entityName} with key '{key}' was not found.", HttpStatusCode.NotFound)
        {
        }
    }
}