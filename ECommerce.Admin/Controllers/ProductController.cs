using ECommerce.Shared.Common.Constants;
using ECommerce.Shared.DTOs.Common;
using ECommerce.Shared.IServices;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Admin.Controllers
{
    public class ProductController : Controller
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        /// <summary>
        /// GET: Product/Index - Display paginated products list
        /// </summary>
        /// <param name="pageNumber">Current page number</param>
        /// <param name="pageSize">Number of items per page</param>
        /// <param name="searchTerm">Search keyword</param>
        /// <param name="sortBy">Sort field (Name, Price, CreatedAt, etc.)</param>
        /// <param name="sortDesc">Sort direction (true for descending)</param>
        /// <returns></returns>
        public async Task<IActionResult> Index(
            int pageNumber = 1,
            int pageSize = 10,
            string? searchTerm = null,
            string? sortBy = "CreatedAt",
            bool sortDesc = true)
        {
            var request = new PagedRequest
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                SearchTerm = searchTerm,
                SortBy = sortBy,
                SortDescending = sortDesc
            };

            var result = await _productService.GetProductsAsync(request);

            // Pass pagination info to ViewBag for pagination controls
            ViewBag.CurrentPage = result.PageNumber;
            ViewBag.TotalPages = result.TotalPages;
            ViewBag.PageSize = result.PageSize;
            ViewBag.TotalRecords = result.TotalRecords;
            ViewBag.HasPreviousPage = result.HasPreviousPage;
            ViewBag.HasNextPage = result.HasNextPage;
            ViewBag.SearchTerm = searchTerm;
            ViewBag.SortBy = sortBy;
            ViewBag.SortDesc = sortDesc;

            return View(result);
        }

        /// <summary>
        /// GET: Product/Details/5 - Display single product details
        /// </summary>
        /// <param name="id">Product ID</param>
        /// <returns></returns>
        public async Task<IActionResult> Details(int id)
        {
            try
            {
                var product = await _productService.GetProductByIdAsync(id);

                if (product == null)
                {
                    TempData[FieldConstant.ERROR_MESSAGE] = ProductConstant.PRODUCT_NOT_FOUND;
                    return RedirectToAction(nameof(Index));
                }

                return View(product);
            }
            catch (Exception)
            {
                // Log error here
                TempData[FieldConstant.ERROR_MESSAGE] = CommonConstant.CAN_NOT_LOAD_DATA;
                return RedirectToAction(nameof(Index));
            }
        }

        /// <summary>
        /// AJAX endpoint for getting products data (for DataTables or similar)
        /// </summary>
        /// <param name="request">Pagination request</param>
        /// <returns>JSON response</returns>
        [HttpPost]
        public async Task<IActionResult> GetProductsData([FromBody] PagedRequest request)
        {
            try
            {
                var result = await _productService.GetProductsAsync(request);

                return Json(new
                {
                    success = true,
                    data = result.Data,
                    pagination = new
                    {
                        pageNumber = result.PageNumber,
                        pageSize = result.PageSize,
                        totalRecords = result.TotalRecords,
                        totalPages = result.TotalPages,
                        hasPreviousPage = result.HasPreviousPage,
                        hasNextPage = result.HasNextPage
                    }
                });
            }
            catch (Exception)
            {
                // Log error here
                return Json(new
                {
                    success = false,
                    message = CommonConstant.CAN_NOT_LOAD_DATA
                });
            }
        }

        // Các actions khác như Create, Edit, Delete bạn sẽ implement sau
        /*
        public async Task<IActionResult> Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CreateProductDto model)
        {
            // Implementation here
        }

        public async Task<IActionResult> Edit(int id)
        {
            // Implementation here
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, UpdateProductDto model)
        {
            // Implementation here
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            // Implementation here
        }
        */
    }
}
