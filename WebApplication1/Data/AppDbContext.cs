using Microsoft.EntityFrameworkCore;
using WebApplication1.Model; // Assure-toi que le namespace de Voiture est bon

namespace WebApplication1.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Voiture> Voitures { get; set; }
    }
}