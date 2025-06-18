using System.Net;

namespace ECommerce.Shared.Common.Exceptions
{
    public class UnauthorizedException : BaseException
    {
        public UnauthorizedException(string message) 
            : base(message, HttpStatusCode.Unauthorized)
        {
        }

        public UnauthorizedException() 
            : base("You are not authorized to access this resource.", HttpStatusCode.Unauthorized)
        {
        }
    }
}