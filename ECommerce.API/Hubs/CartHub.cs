using Microsoft.AspNetCore.SignalR;

namespace ECommerce.API.Hubs
{
    public class CartHub : Hub
    {
        public async Task JoinCartGroup(string userId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"cart_{userId}");
        }

        public async Task LeaveCartGroup(string userId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"cart_{userId}");
        }

        public async Task UpdateCartItem(string userId, object cartItem)
        {
            // Broadcast to all users in the cart group (could be multiple devices)
            await Clients.Group($"cart_{userId}").SendAsync("CartItemUpdated", cartItem);
        }

        public async Task RemoveCartItem(string userId, int productId)
        {
            await Clients.Group($"cart_{userId}").SendAsync("CartItemRemoved", productId);
        }

        public async Task ClearCart(string userId)
        {
            await Clients.Group($"cart_{userId}").SendAsync("CartCleared");
        }

        public async Task UpdateCartCount(string userId, int count)
        {
            await Clients.Group($"cart_{userId}").SendAsync("CartCountUpdated", count);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // Clean up when user disconnects
            await base.OnDisconnectedAsync(exception);
        }
    }
}
