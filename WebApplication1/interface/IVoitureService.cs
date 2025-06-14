// IVoitureService.cs
using WebApplication1.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebApplication1.Services
{
    public interface IVoitureService
    {
        Task<List<Voiture>> GetAllVoituresAsync();
        Task<Voiture> GetVoitureByIdAsync(int id);
        Task<Voiture> CreateVoitureAsync(Voiture voiture);
        Task<Voiture> UpdateVoitureAsync(int id, Voiture voiture);
        Task<bool> DeleteVoitureAsync(int id);
    }
}