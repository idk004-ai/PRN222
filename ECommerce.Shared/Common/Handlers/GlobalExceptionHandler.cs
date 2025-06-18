using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using ECommerce.Shared.Common.Exceptions;
using ECommerce.Shared.Common.Models;
using System.Net;
using System.Text.Json;

namespace ECommerce.Shared.Common.Handlers
{
    public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
    {
        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };

        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext, 
            Exception exception, 
            CancellationToken cancellationToken)
        {
            var traceId = httpContext.TraceIdentifier;
            var instance = httpContext.Request.Path.Value;

            var (statusCode, response) = exception switch
            {
                ValidationException validationEx => (
                    (int)HttpStatusCode.BadRequest,
                    CreateValidationErrorResponse(validationEx, traceId, instance)
                ),
                NotFoundException notFoundEx => (
                    (int)HttpStatusCode.NotFound,
                    CreateErrorResponse(notFoundEx, traceId, instance)
                ),
                BusinessLogicException businessEx => (
                    (int)HttpStatusCode.UnprocessableEntity,
                    CreateErrorResponse(businessEx, traceId, instance)
                ),
                UnauthorizedException unauthorizedEx => (
                    (int)HttpStatusCode.Unauthorized,
                    CreateErrorResponse(unauthorizedEx, traceId, instance)
                ),
                BaseException baseEx => (
                    (int)baseEx.StatusCode,
                    CreateErrorResponse(baseEx, traceId, instance)
                ),
                _ => (
                    (int)HttpStatusCode.InternalServerError,
                    CreateInternalServerErrorResponse(exception, traceId, instance)
                )
            };

            // Log exception with appropriate level
            LogException(exception, traceId);

            // Set response
            httpContext.Response.StatusCode = statusCode;
            httpContext.Response.ContentType = "application/json";

            var jsonResponse = JsonSerializer.Serialize(response, JsonOptions);
            await httpContext.Response.WriteAsync(jsonResponse, cancellationToken);

            return true;
        }

        private static ValidationErrorResponse CreateValidationErrorResponse(
            ValidationException exception, 
            string traceId, 
            string? instance)
        {
            return new ValidationErrorResponse
            {
                StatusCode = (int)HttpStatusCode.BadRequest,
                Message = exception.Message,
                Details = exception.Details,
                ValidationErrors = exception.ValidationErrors,
                TraceId = traceId,
                Instance = instance
            };
        }

        private static ErrorResponse CreateErrorResponse(
            BaseException exception, 
            string traceId, 
            string? instance)
        {
            return new ErrorResponse
            {
                StatusCode = (int)exception.StatusCode,
                Message = exception.Message,
                Details = exception.Details,
                TraceId = traceId,
                Instance = instance
            };
        }

        private static ErrorResponse CreateInternalServerErrorResponse(
            Exception exception, 
            string traceId, 
            string? instance)
        {
            return new ErrorResponse
            {
                StatusCode = (int)HttpStatusCode.InternalServerError,
                Message = "An internal server error occurred.",
                Details = "Please contact support if the problem persists.",
                TraceId = traceId,
                Instance = instance
            };
        }

        private void LogException(Exception exception, string traceId)
        {
            var logLevel = exception switch
            {
                ValidationException => LogLevel.Warning,
                NotFoundException => LogLevel.Warning,
                BusinessLogicException => LogLevel.Warning,
                UnauthorizedException => LogLevel.Warning,
                BaseException => LogLevel.Error,
                _ => LogLevel.Error
            };

            logger.Log(logLevel, exception, 
                "Exception occurred. TraceId: {TraceId}, Type: {ExceptionType}, Message: {Message}",
                traceId, exception.GetType().Name, exception.Message);
        }
    }
}