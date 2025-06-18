using System.Net;

namespace ECommerce.Shared.Common.Exceptions
{
    public abstract class BaseException : Exception
    {
        public HttpStatusCode StatusCode { get; }
        public string? Details { get; }

        protected BaseException(string message, HttpStatusCode statusCode, string? details = null) 
            : base(message)
        {
            StatusCode = statusCode;
            Details = details;
        }

        protected BaseException(string message, HttpStatusCode statusCode, Exception innerException, string? details = null) 
            : base(message, innerException)
        {
            StatusCode = statusCode;
            Details = details;
        }
    }
}