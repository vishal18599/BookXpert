using BookXpert.API.Models;

namespace BookXpert.API.Interfaces
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<Employee>> GetAllAsync();
        Task<Employee?> GetByIdAsync(int id);
        Task<Employee> CreateAsync(Employee employee);
        Task<Employee?> UpdateAsync(int id, Employee employee);
        Task<bool> DeleteAsync(int id);
        Task DeleteMultipleAsync(List<int> ids);
        Task<bool> IsDuplicateAsync(string name);

    }
}
