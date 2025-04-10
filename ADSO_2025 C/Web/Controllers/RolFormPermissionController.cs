using Business.Interfaces;
using Data.Services;
using Entity.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{

    [Route("api/[controller]")]
    public class RolFormPermissionController : GenericController<RolFormPermissionDto>
    {
        private readonly RolFormPermissionRepository _extendedService;
        public RolFormPermissionController(IGenericService<RolFormPermissionDto> service, RolFormPermissionRepository extendedService) 
            : base(service)
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
