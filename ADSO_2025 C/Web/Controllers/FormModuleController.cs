using Business.Interfaces;
using Data.Services;
using Entity.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    public class FormModuleController : GenericController<FormModuleDto>
    {
        private readonly FormModuleRepository _extendedService;
        public FormModuleController(IGenericService<FormModuleDto> service, FormModuleRepository extendedService) : base(service)
        {
            _extendedService = extendedService;
        }

        [HttpGet]
        public override async Task<IActionResult> GetAll()
        {
            var result = await _extendedService.GetAllJoinAsync();
            return Ok(result);
        }
    }
}
