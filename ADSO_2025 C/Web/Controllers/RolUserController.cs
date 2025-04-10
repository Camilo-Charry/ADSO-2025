using Business.Interfaces;
using Entity.DTOs;
using Microsoft.AspNetCore.Mvc;
using Web.Controllers;
using Business.Services;
using Data.Services;

[Route("api/[controller]")]
public class RolUserController : GenericController<RolUserDto>
{
    private readonly RolUserRepository _extendedService;

    public RolUserController(IGenericService<RolUserDto> service, RolUserRepository extendedService)
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
