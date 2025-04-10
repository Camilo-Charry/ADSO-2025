using Business.Interfaces;
using Entity.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    public class FormControllerPrueba : GenericController<FormDto>
    {
        public FormControllerPrueba(IGenericService<FormDto> service) : base(service)
        {
        }
    }
}
