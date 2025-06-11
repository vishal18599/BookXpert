using BookXpert.API.Models;

namespace BookXpert.API.Interfaces
{
    public interface IStateRepository
    {
        Task<IEnumerable<State>> GetAllAsync();
    }
}
