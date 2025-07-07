using ECommerce.Shared.Common.Constants;
using ECommerce.Shared.DTOs.Common;
using ECommerce.Shared.DTOs.Product;
using ECommerce.Shared.IServices;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IWebHostEnvironment _environment;

        public ProductsController(IProductService productService, IWebHostEnvironment environment)
        {
            _productService = productService;
            _environment = environment;
        }

        /// <summary>
        /// Get paginated products list
        /// </summary>
        /// <param name="pageNumber">Current page number</param>
        /// <param name="pageSize">Number of items per page</param>
        /// <param name="searchTerm">Search keyword</param>
        /// <param name="sortBy">Sort field (Name, Price, CreatedAt, etc.)</param>
        /// <param name="sortDesc">Sort direction (true for descending)</param>
        /// <returns>Paginated products response</returns>
        [HttpGet]
        public async Task<ActionResult<PagedResponse<ProductResponseDto>>> GetProducts(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? sortBy = "CreatedAt",
            [FromQuery] bool sortDesc = true)
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
            return Ok(result);
        }


        /// <summary>
        /// Get single product by ID
        /// </summary>
        /// <param name="id">Product ID</param>
        /// <returns>Product details</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductResponseDto>> GetProduct(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);

            if (product == null)
            {
                return NotFound(new { message = ProductConstant.PRODUCT_NOT_FOUND });
            }

            return Ok(product);
        }

        /// <summary>
        /// Create a new product
        /// </summary>
        /// <param name="model">Product creation data</param>
        /// <returns>Created product</returns>
        [HttpPost]
        public async Task<ActionResult<ProductResponseDto>> CreateProduct([FromForm] CreateProductDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Process file uploads
            await ProcessImageUploads(model);

            var result = await _productService.CreateProductAsync(model);
            return CreatedAtAction(nameof(GetProduct), new { id = result.ProductId }, result);
        }

        /// <summary>
        /// Update an existing product
        /// </summary>
        /// <param name="id">Product ID</param>
        /// <param name="model">Product update data</param>
        /// <returns>Updated product</returns>
        [HttpPut("{id}")]
        public async Task<ActionResult<ProductResponseDto>> UpdateProduct(int id, [FromForm] UpdateProductDto model)
        {
            if (id != model.ProductID)
            {
                return BadRequest(new { message = CommonConstant.ID_INVALID });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Process file uploads for update
            await ProcessImageUploadsForUpdate(model);

            var result = await _productService.UpdateProductAsync(id, model);
            return Ok(result);
        }

        /// <summary>
        /// Delete a product
        /// </summary>
        /// <param name="id">Product ID</param>
        /// <returns>Success response</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound(new { message = ProductConstant.PRODUCT_NOT_FOUND });
            }

            await _productService.DeleteProductAsync(id);
            return Ok(new { message = ProductConstant.PRODUCT_DELETED_SUCCESSFULLY });
        }

        /// <summary>
        /// Get product for editing
        /// </summary>
        /// <param name="id">Product ID</param>
        /// <returns>Product update model</returns>
        [HttpGet("{id}/edit")]
        public async Task<ActionResult<UpdateProductDto>> GetProductForEdit(int id)
        {
            var updateModel = await _productService.GetProductForEditAsync(id);
            if (updateModel == null)
            {
                return NotFound(new { message = ProductConstant.PRODUCT_NOT_FOUND });
            }

            return Ok(updateModel);
        }

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
        /// Process uploaded image files for update and save them to the server
        /// </summary>
        /// <param name="model">Product model containing file uploads</param>
        private async Task ProcessImageUploadsForUpdate(UpdateProductDto model)
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
