using ECommerce.Shared.DTOs.Supplier;
using ECommerce.Shared.Models;

namespace ECommerce.Shared.Mappings
{
    public static class SupplierMappingExtensions
    {
        public static SupplierDto ToDto(this Supplier supplier)
        {
            return new SupplierDto
            {
                SupplierID = supplier.SupplierId,
                CompanyName = supplier.CompanyName,
                ContactName = supplier.ContactName,
                ContactTitle = supplier.ContactTitle,
                Address = supplier.Address,
                Mobile = supplier.Mobile,
                Phone = supplier.Phone,
                Fax = supplier.Fax,
                Email = supplier.Email,
                City = supplier.City,
                Country = supplier.Country,
                ProductCount = supplier.Products?.Count ?? 0
            };
        }

        public static IEnumerable<SupplierDto> ToDtos(this IEnumerable<Supplier> suppliers)
        {
            return suppliers.Select(s => s.ToDto());
        }
    }
}
