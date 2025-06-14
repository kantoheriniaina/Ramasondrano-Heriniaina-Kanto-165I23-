// VoitureService.cs
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebApplication1.Services
{
    public class VoitureService : IVoitureService
    {
        private readonly AppDbContext _context;

        public VoitureService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Voiture>> GetAllVoituresAsync()
        {
            return await _context.Voitures.ToListAsync();
        }

        public async Task<Voiture> GetVoitureByIdAsync(int id)
        {
            return await _context.Voitures.FindAsync(id);
        }

        public async Task<Voiture> CreateVoitureAsync(Voiture voiture)
        {
            _context.Voitures.Add(voiture);
            await _context.SaveChangesAsync();
            return voiture;
        }

        public async Task<Voiture> UpdateVoitureAsync(int id, Voiture voiture)
        {
            if (id != voiture.Id) return null;

            _context.Entry(voiture).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return voiture;
        }

        public async Task<bool> DeleteVoitureAsync(int id)
        {
            var voiture = await _context.Voitures.FindAsync(id);
            if (voiture == null) return false;

            _context.Voitures.Remove(voiture);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}