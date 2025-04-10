

using Business.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GenericController<TDto> : ControllerBase where TDto : class
    {
        private readonly IGenericService<TDto> _service;

        public GenericController(IGenericService<TDto> service)
        {
            _service = service;
        }

        [HttpGet]
        public virtual async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public virtual async Task<IActionResult> GetById(int id) => Ok(await _service.GetByIdAsync(id));

        [HttpPost]
        public virtual async Task<IActionResult> Create([FromBody] TDto dto) => Ok(await _service.CreateAsync(dto));

        [HttpPut]
        public virtual async Task<IActionResult> Update([FromBody] TDto dto) => Ok(await _service.UpdateAsync(dto));

        [HttpDelete("{id}")]
        public virtual async Task<IActionResult> Delete(int id) => Ok(await _service.DeleteAsync(id));

        [HttpDelete("logic/{id}")]
        public virtual async Task<IActionResult> DeleteLogic(int id)
        {
            var result = await _service.DeleteAsyncLogic(id);
            return result ? Ok() : NotFound();
        }
    }
}
