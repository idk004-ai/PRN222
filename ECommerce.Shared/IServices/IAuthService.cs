using ECommerce.Shared.DTOs;

namespace ECommerce.Shared.IServices;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(string userName, string password);
    Task<LoginResponse?> LoginCustomerAsync(string userName, string password);
    Task<bool> ValidateTokenAsync(string token);
}
