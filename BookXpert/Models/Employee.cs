using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookXpert.API.Models
{
    public class Employee
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; }

        [Required, MaxLength(100)]
        public string Designation { get; set; }

        [Required]
        public DateTime DateOfJoining { get; set; }

        [Required, Column(TypeName = "decimal(18,2)")]
        public decimal Salary { get; set; }

        [Required]
        public string Gender { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        public int Age { get; set; }

        [ForeignKey("State")]
        public int StateId { get; set; }

        public virtual State State { get; set; }
    }
}
