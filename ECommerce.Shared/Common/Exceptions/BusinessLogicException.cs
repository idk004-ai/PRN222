using System.Net;

namespace ECommerce.Shared.Common.Exceptions
{
    public class BusinessLogicException : BaseException
    {
        public BusinessLogicException(string message) 
            : base(message, HttpStatusCode.UnprocessableEntity)
        {
        }

        public BusinessLogicException(string message, string details) 
            : base(message, HttpStatusCode.UnprocessableEntity, details)
        {
        }
    }
}