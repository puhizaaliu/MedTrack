using MedTrack.API.Config;
using MedTrack.API.Data;
using MedTrack.API.MongoModels;
using MedTrack.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Repositories.Implementations
{
    public class MedicalReportRepository : IMedicalReportRepository
    {
        private readonly IMongoCollection<MedicalReport> _collection;
        private readonly AppDbContext _context;

        public MedicalReportRepository(IMongoClient client, IOptions<MongoDBSettings> settings, AppDbContext context)
        {
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _collection = database.GetCollection<MedicalReport>("MedicalReports");
            _context = context;
        }

        public async Task<IEnumerable<MedicalReport>> GetAllAsync()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<MedicalReport?> GetByIdAsync(string id)
        {
            return await _collection
                .Find(mr => mr.Id == id)
                .FirstOrDefaultAsync();
        }
        public async Task<IEnumerable<MedicalReport>> GetByPatientIdAsync(int patientId)
        {
            var appointmentIds = await _context.Appointments
                .Where(a => a.PatientId == patientId)
                .Select(a => a.AppointmentId)
                .ToListAsync();

            var reports = await _collection
                .Find(r => appointmentIds.Contains(r.AppointmentId))
                .ToListAsync();

            return reports;
        }

        public async Task<IEnumerable<MedicalReport>> GetByDoctorIdAsync(int doctorId)
        {
            var appointmentIds = await _context.Appointments
                .Where(a => a.DoctorId == doctorId)
                .Select(a => a.AppointmentId)
                .ToListAsync();

            var reports = await _collection
                .Find(r => appointmentIds.Contains(r.AppointmentId))
                .ToListAsync();

            return reports;
        }

        public async Task CreateAsync(MedicalReport report)
        {
            await _collection.InsertOneAsync(report);
        }

        public async Task UpdateAsync(string id, MedicalReport report)
        {
            await _collection.ReplaceOneAsync(
                filter: mr => mr.Id == id,
                replacement: report);
        }

        public async Task DeleteAsync(string id)
        {
            await _collection.DeleteOneAsync(mr => mr.Id == id);
        }
    }
}
