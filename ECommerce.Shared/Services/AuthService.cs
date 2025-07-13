using Microsoft.EntityFrameworkCore;
using ECommerce.Shared.IServices;
using ECommerce.Shared.Models;
using ECommerce.Shared.DTOs;

namespace ECommerce.Shared.Services;

public class AuthService : IAuthService
{
    private readonly KahreedoContext _context;

    public AuthService(KahreedoContext context)
    {
        _context = context;
    }

    public async Task<LoginResponse?> LoginAsync(string userName, string password)
    {
        try
        {
            // Check admin login first
            var adminLogin = await _context.AdminLogins
                .Include(a => a.Emp)
                .FirstOrDefaultAsync(a => a.UserName == userName && a.Password == password);

            if (adminLogin != null)
            {
                return new LoginResponse
                {
                    Success = true,
                    Token = GenerateToken(adminLogin.LoginId.ToString(), "admin"),
                    User = new UserInfo
                    {
                        Id = adminLogin.LoginId,
                        UserName = adminLogin.UserName,
                        FirstName = adminLogin.Emp?.FirstName ?? "",
                        LastName = adminLogin.Emp?.LastName ?? "",
                        Role = "admin",
                        RoleType = adminLogin.RoleType ?? 1
                    }
                };
            }

            return new LoginResponse
            {
                Success = false,
                Message = "Invalid credentials"
            };
        }
        catch (Exception ex)
        {
            return new LoginResponse
            {
                Success = false,
                Message = $"Login failed: {ex.Message}"
            };
        }
    }

    public async Task<LoginResponse?> LoginCustomerAsync(string userName, string password)
    {
        try
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.UserName == userName && c.Password == password);

            if (customer != null)
            {
                return new LoginResponse
                {
                    Success = true,
                    Token = GenerateToken(customer.CustomerId.ToString(), "user"),
                    User = new UserInfo
                    {
                        Id = customer.CustomerId,
                        UserName = customer.UserName,
                        FirstName = customer.FirstName,
                        LastName = customer.LastName,
                        Role = "user",
                        RoleType = 2
                    }
                };
            }

            return new LoginResponse
            {
                Success = false,
                Message = "Invalid credentials"
            };
        }
        catch (Exception ex)
        {
            return new LoginResponse
            {
                Success = false,
                Message = $"Login failed: {ex.Message}"
            };
        }
    }

    public Task<bool> ValidateTokenAsync(string token)
    {
        // Implement JWT token validation logic here
        // For now, return true for any non-empty token
        return Task.FromResult(!string.IsNullOrEmpty(token));
    }

    private string GenerateToken(string userId, string role)
    {
        // For demo purposes, create a simple token
        // In production, use proper JWT token generation
        var tokenData = $"{userId}:{role}:{DateTime.UtcNow:yyyy-MM-dd-HH-mm-ss}";
        return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(tokenData));
    }
}
