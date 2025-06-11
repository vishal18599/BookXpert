using Microsoft.AspNetCore.Mvc;
using BookXpert.API.Interfaces;
using BookXpert.API.Models;

namespace BookXpert.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeRepository _repo;
        public EmployeeController(IEmployeeRepository repo) => _repo = repo;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _repo.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var emp = await _repo.GetByIdAsync(id);
            return emp == null ? NotFound() : Ok(emp);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Employee employee)
        {
            if (await _repo.IsDuplicateAsync(employee.Name))
                return BadRequest("Duplicate name not allowed");

            var created = await _repo.CreateAsync(employee);
            return Ok(created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Employee employee)
        {
            var updated = await _repo.UpdateAsync(id, employee);
            return updated == null ? NotFound() : Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return await _repo.DeleteAsync(id) ? Ok() : NotFound();
        }

        [HttpPost("delete-multiple")]
        public async Task<IActionResult> DeleteMultiple([FromBody] List<int> ids)
        {
            await _repo.DeleteMultipleAsync(ids);
            return Ok();
        }
    }
}
