using AutoMapper;
using ECommerce.Shared.DTOs.Common;

namespace ECommerce.Shared.Mappings
{
    public class CommonMappingProfile : Profile
    {
        public CommonMappingProfile()
        {
            CreateMap(typeof(IEnumerable<>), typeof(PagedResponse<>));
        }
    }
}