using BookXpert.API.Data;
using BookXpert.API.Interfaces;
using BookXpert.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BookXpert.API.Repositories
{
    public class StateRepository : IStateRepository
    {
        private readonly ApplicationDbContext _context;
        public StateRepository(ApplicationDbContext context) => _context = context;

        public async Task<IEnumerable<State>> GetAllAsync() => await _context.States.ToListAsync();
    }
}
