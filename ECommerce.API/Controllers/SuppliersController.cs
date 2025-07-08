using ECommerce.Shared.DTOs.Supplier;
using ECommerce.Shared.IRepositories;
using ECommerce.Shared.Mappings;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SuppliersController : ControllerBase
    {
        private readonly ISupplierRepository _supplierRepository;

        public SuppliersController(ISupplierRepository supplierRepository)
        {
            _supplierRepository = supplierRepository;
        }

        /// <summary>
        /// Get all active suppliers
        /// </summary>
        /// <returns>List of active suppliers</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SupplierDto>>> GetSuppliers()
        {
            var suppliers = await _supplierRepository.GetAllAsync();
            var supplierDtos = suppliers.ToDtos();
            return Ok(supplierDtos);
        }

        /// <summary>
        /// Get supplier by ID
        /// </summary>
        /// <param name="id">Supplier ID</param>
        /// <returns>Supplier details</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<SupplierDto>> GetSupplier(int id)
        {
            var supplier = await _supplierRepository.GetByIdAsync(id);
            if (supplier == null)
            {
                return NotFound();
            }
            return Ok(supplier.ToDto());
        }
    }
}
