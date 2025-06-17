using MedTrack.API.Data;
using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MedTrack.API.Repositories.Implementations
{
    public class ChronicDiseaseRepository : IChronicDiseaseRepository
    {
        private readonly AppDbContext _context;
        public ChronicDiseaseRepository(AppDbContext context) => _context = context;

        public async Task<IEnumerable<ChronicDisease>> GetAllAsync() =>
            await _context.ChronicDiseases.ToListAsync();

        public async Task<ChronicDisease?> GetByIdAsync(int id) =>
            await _context.ChronicDiseases.FindAsync(id);

        public async Task AddAsync(ChronicDisease entity)
        {
            await _context.ChronicDiseases.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(ChronicDisease entity)
        {
            _context.ChronicDiseases.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var e = await _context.ChronicDiseases.FindAsync(id);
            if (e != null)
            {
                _context.ChronicDiseases.Remove(e);
                await _context.SaveChangesAsync();
            }
        }
    }
}
