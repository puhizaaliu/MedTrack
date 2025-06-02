using MedTrack.API.Data;
using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace MedTrack.API.Repositories.Implementations
{
    public class MedicalInfoRepository : IMedicalInfoRepository
    {
        private readonly AppDbContext _context;

        public MedicalInfoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<MedicalInfo?> GetMedicalInfoByPatientIdAsync(int patientId)
        {
            return await _context.MedicalInfos
                .FirstOrDefaultAsync(m => m.UserId == patientId);
        }

        public async Task AddMedicalInfoAsync(MedicalInfo medicalInfo)
        {
            await _context.MedicalInfos.AddAsync(medicalInfo);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateMedicalInfoAsync(MedicalInfo medicalInfo)
        {
            _context.MedicalInfos.Update(medicalInfo);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteMedicalInfoAsync(int id)
        {
            var medicalInfo = await _context.MedicalInfos.FindAsync(id);
            if (medicalInfo != null)
            {
                _context.MedicalInfos.Remove(medicalInfo);
                await _context.SaveChangesAsync();
            }
        }
    }
}
