using Business.Interfaces;
using Entity.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    [Route("api/[controller]")]

    public class PermissionController : GenericController<PermissionDto>
    {
        public PermissionController(IGenericService<PermissionDto> service) : base(service)
        {
        }
    }
}
