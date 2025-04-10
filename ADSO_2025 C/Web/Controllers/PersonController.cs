using Business.Interfaces;
using Entity.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    [Route("api/[controller]")]

    public class PersonController : GenericController<PersonDto>
    {
        public PersonController(IGenericService<PersonDto> service) : base(service)
        {
        }
    }
}
