// VoituresController.cs
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Model;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VoituresController : ControllerBase
    {
        private readonly IVoitureService _voitureService;

        // Injection du service dans le contrôleur
        public VoituresController(IVoitureService voitureService)
        {
            _voitureService = voitureService;
        }

        // GET: api/voitures
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Voiture>>> GetVoitures()
        {
            var voitures = await _voitureService.GetAllVoituresAsync();
            return Ok(voitures);
        }

        // GET: api/voitures/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Voiture>> GetVoiture(int id)
        {
            var voiture = await _voitureService.GetVoitureByIdAsync(id);

            if (voiture == null)
            {
                return NotFound();
            }

            return voiture;
        }

        // POST: api/voitures
        [HttpPost]
        public async Task<ActionResult<Voiture>> PostVoiture(Voiture voiture)
        {
            var createdVoiture = await _voitureService.CreateVoitureAsync(voiture);
            return CreatedAtAction(nameof(GetVoiture), new { id = createdVoiture.Id }, createdVoiture);
        }

        // PUT: api/voitures/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVoiture(int id, Voiture voiture)
        {
            var updatedVoiture = await _voitureService.UpdateVoitureAsync(id, voiture);

            if (updatedVoiture == null)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/voitures/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVoiture(int id)
        {
            var success = await _voitureService.DeleteVoitureAsync(id);

            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
