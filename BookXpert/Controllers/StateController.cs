using Microsoft.AspNetCore.Mvc;
using BookXpert.API.Interfaces;

namespace BookXpert.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StateController : ControllerBase
    {
        private readonly IStateRepository _repo;
        public StateController(IStateRepository repo) => _repo = repo;

        [HttpGet]
        public async Task<IActionResult> Get() => Ok(await _repo.GetAllAsync());
    }
}