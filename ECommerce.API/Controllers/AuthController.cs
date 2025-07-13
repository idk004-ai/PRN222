using Microsoft.AspNetCore.Mvc;
using ECommerce.Shared.DTOs;
using ECommerce.Shared.IServices;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var result = await _authService.LoginAsync(request.UserName, request.Password);
            
            if (result == null || !result.Success)
            {
                return Unauthorized(new { message = result?.Message ?? "Invalid username or password" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login-customer")]
    public async Task<IActionResult> LoginCustomer([FromBody] LoginRequest request)
    {
        try
        {
            var result = await _authService.LoginCustomerAsync(request.UserName, request.Password);
            
            if (result == null || !result.Success)
            {
                return Unauthorized(new { message = result?.Message ?? "Invalid username or password" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        // Clear any server-side session if needed
        return Ok(new { message = "Logged out successfully" });
    }

    [HttpGet("me")]
    public IActionResult GetCurrentUser()
    {
        try
        {
            // This would require JWT token validation
            // For now, return placeholder
            return Ok(new { message = "User info endpoint" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
