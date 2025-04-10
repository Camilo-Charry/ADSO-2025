using Business.Interfaces;
using Entity.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    [Route("api/[controller]")]

    public class UserController : GenericController<UserDto>
    {
        public UserController(IGenericService<UserDto> service) : base(service)
        {
        }
    }

}
