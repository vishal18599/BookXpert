using BookXpert.API.Data;
using BookXpert.API.Interfaces;
using BookXpert.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BookXpert.API.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly ApplicationDbContext _context;
        public EmployeeRepository(ApplicationDbContext context) => _context = context;

        public async Task<IEnumerable<Employee>> GetAllAsync() => await _context.Employees.Include(e => e.State).ToListAsync();

        public async Task<Employee?> GetByIdAsync(int id) => await _context.Employees.Include(e => e.State).FirstOrDefaultAsync(e => e.Id == id);

        public async Task<Employee> CreateAsync(Employee employee)
        {
            employee.Age = DateTime.Now.Year - employee.DateOfBirth.Year;
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return employee;
        }

        public async Task<Employee?> UpdateAsync(int id, Employee employee)
        {
            var emp = await _context.Employees.FindAsync(id);
            if (emp == null) return null;

            emp.Name = employee.Name;
            emp.Designation = employee.Designation;
            emp.DateOfJoining = employee.DateOfJoining;
            emp.Salary = employee.Salary;
            emp.Gender = employee.Gender;
            emp.StateId = employee.StateId;
            emp.DateOfBirth = employee.DateOfBirth;
            emp.Age = DateTime.Now.Year - employee.DateOfBirth.Year;

            await _context.SaveChangesAsync();
            return emp;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var emp = await _context.Employees.FindAsync(id);
            if (emp == null) return false;
            _context.Employees.Remove(emp);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task DeleteMultipleAsync(List<int> ids)
        {
            var emps = _context.Employees.Where(e => ids.Contains(e.Id));
            _context.Employees.RemoveRange(emps);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> IsDuplicateAsync(string name) => await _context.Employees.AnyAsync(e => e.Name == name);
    }
}
