using System.ComponentModel.DataAnnotations;

namespace BookXpert.API.Models
{
    public class State
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; }
    }
}
