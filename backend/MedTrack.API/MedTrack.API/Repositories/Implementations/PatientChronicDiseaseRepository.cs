using MedTrack.API.Data;
using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MedTrack.API.Repositories.Implementations
{
    public class PatientChronicDiseaseRepository : IPatientChronicDiseaseRepository
    {
        private readonly AppDbContext _ctx;
        public PatientChronicDiseaseRepository(AppDbContext ctx) => _ctx = ctx;

        public async Task<IEnumerable<PatientChronicDisease>> GetByPatientIdAsync(int patientId) =>
            await _ctx.PatientChronicDiseases
                .Include(x => x.Disease)
                .Where(x => x.PatientId == patientId)
                .ToListAsync();

        public async Task AddAsync(PatientChronicDisease link)
        {
            var entity = new PatientChronicDisease
            {
                PatientId = link.PatientId,
                DiseaseId = link.DiseaseId,
                OtherText = link.OtherText
            };

            await _ctx.PatientChronicDiseases.AddAsync(entity);
            await _ctx.SaveChangesAsync();
        }

        public async Task UpdateAsync(PatientChronicDisease link)
        {
            _ctx.PatientChronicDiseases.Update(link);
            await _ctx.SaveChangesAsync();
        }

        public async Task RemoveAsync(int patientId, int diseaseId)
        {
            var link = await _ctx.PatientChronicDiseases
                .FindAsync(patientId, diseaseId);
            if (link != null)
            {
                _ctx.PatientChronicDiseases.Remove(link);
                await _ctx.SaveChangesAsync();
            }
        }

        public async Task DeleteAllByPatientIdAsync(int patientId)
        {
            var toDelete = _ctx.PatientChronicDiseases.Where(x => x.PatientId == patientId);
            _ctx.PatientChronicDiseases.RemoveRange(toDelete);
            await _ctx.SaveChangesAsync();
        }

    }
}
