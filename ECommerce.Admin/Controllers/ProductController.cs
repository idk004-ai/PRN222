using ECommerce.Shared.Common.Constants;
using ECommerce.Shared.DTOs.Common;
using ECommerce.Shared.DTOs.Product;
using ECommerce.Shared.IServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace ECommerce.Admin.Controllers
{    public class ProductController : Controller
    {
        private readonly IProductService _productService;
        private readonly IWebHostEnvironment _environment;

        public ProductController(IProductService productService, IWebHostEnvironment environment)
        {
            _productService = productService;
            _environment = environment;
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

            // Pass search and sort info to ViewBag
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

        /// <summary>
        /// GET: Product/Create - Show create product form
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> Create()
        {
            await PopulateViewBagData();
            return View();
        }

        /// <summary>
        /// POST: Product/Create - Handle create product form submission
        /// </summary>
        /// <param name="model">Create product data</param>
        /// <returns></returns>        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CreateProductDto model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    // Process file uploads
                    await ProcessImageUploads(model);

                    var result = await _productService.CreateProductAsync(model);
                    TempData[FieldConstant.SUCCESS_MESSAGE] = ProductConstant.PRODUCT_CREATED_SUCCESSFULLY;
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", $"Error creating product: {ex.Message}");
                }
            }

            await PopulateViewBagData();
            return View(model);
        }

        /// <summary>
        /// Private method to populate dropdown data for ViewBag
        /// </summary>
        /// <returns></returns>
        private async Task PopulateViewBagData()
        {
            var suppliers = await _productService.GetSuppliersForDropdownAsync();
            var categories = await _productService.GetCategoriesForDropdownAsync();
            var subCategories = await _productService.GetSubCategoriesForDropdownAsync();

            ViewBag.SupplierID = new SelectList(suppliers, "Value", "Text");
            ViewBag.CategoryID = new SelectList(categories, "Value", "Text");
            ViewBag.SubCategoryID = new SelectList(subCategories, "Value", "Text");
        }

        // Các actions khác như Edit, Delete bạn sẽ implement sau
        /*
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
        {            // Implementation here
        }
        */

        #region File Upload Helper Methods

        /// <summary>
        /// Process uploaded image files and save them to the server
        /// </summary>
        /// <param name="model">Product model containing file uploads</param>
        private async Task ProcessImageUploads(CreateProductDto model)
        {
            // Process main image
            if (model.ImageFile != null)
            {
                model.ImageURL = await SaveImageFile(model.ImageFile, "main");
            }

            // Process additional pictures
            if (model.Picture1File != null)
            {
                model.Picture1 = await SaveImageFile(model.Picture1File, "pic1");
            }

            if (model.Picture2File != null)
            {
                model.Picture2 = await SaveImageFile(model.Picture2File, "pic2");
            }

            if (model.Picture3File != null)
            {
                model.Picture3 = await SaveImageFile(model.Picture3File, "pic3");
            }

            if (model.Picture4File != null)
            {
                model.Picture4 = await SaveImageFile(model.Picture4File, "pic4");
            }
        }

        /// <summary>
        /// Save uploaded image file to the server
        /// </summary>
        /// <param name="file">The uploaded file</param>
        /// <param name="prefix">File name prefix</param>
        /// <returns>Relative path to the saved file</returns>
        private async Task<string> SaveImageFile(IFormFile file, string prefix)
        {
            if (file == null || file.Length == 0)
                return string.Empty;

            // Create uploads directory if it doesn't exist
            var uploadsFolder = Path.Combine(_environment.WebRootPath, "images", "products");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // Generate unique filename
            var fileExtension = Path.GetExtension(file.FileName);
            var fileName = $"{prefix}_{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            // Save file
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            // Return relative path for storing in database
            return $"/images/products/{fileName}";
        }

        #endregion
    }
}
