using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECommerce.Client.Models;
using ECommerce.Shared.Data;
using ECommerce.Shared.Models;

namespace ECommerce.Client.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly ECommerceDbContext _context;

    public HomeController(ILogger<HomeController> logger, ECommerceDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task<IActionResult> Index()
    {
        var menProducts = await _context.Products
            .Include(p => p.Category)
            .Where(x => x.Category.Name.Equals("Men"))
            .ToListAsync();

        var womenProducts = await _context.Products
            .Include(p => p.Category)
            .Where(x => x.Category.Name.Equals("Women"))
            .ToListAsync();

        var sportsProducts = await _context.Products
            .Include(p => p.Category)
            .Where(x => x.Category.Name.Equals("Sports"))
            .ToListAsync();

        var electronicsProducts = await _context.Products
            .Include(p => p.Category)
            .Where(x => x.Category.Name.Equals("Electronics"))
            .ToListAsync();

        ViewBag.MenProduct = menProducts;
        ViewBag.WomenProduct = womenProducts;
        ViewBag.SportsProduct = sportsProducts;
        ViewBag.ElectronicsProduct = electronicsProducts;

        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
