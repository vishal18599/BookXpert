using Microsoft.EntityFrameworkCore;
using BookXpert.API.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace BookXpert.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<State> States { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<State>().HasData(
                new State { Id = 1, Name = "California" },
                new State { Id = 2, Name = "Texas" },
                new State { Id = 3, Name = "New York" }
            );
        }
    }
}
