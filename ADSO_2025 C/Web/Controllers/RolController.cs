using Business.Interfaces;
using Entity.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    [Route("api/[controller]")]

    public class RolController : GenericController<rolDto>
    {
        public RolController(IGenericService<rolDto> service) : base(service)
        {
        }
    }
}
