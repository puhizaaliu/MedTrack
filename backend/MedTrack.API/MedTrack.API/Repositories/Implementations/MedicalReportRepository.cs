using MedTrack.API.Config;
using MedTrack.API.MongoModels;
using MedTrack.API.Repositories.Interfaces;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Repositories.Implementations
{
    public class MedicalReportRepository : IMedicalReportRepository
    {
        private readonly IMongoCollection<MedicalReport> _collection;

        public MedicalReportRepository(IMongoClient client, IOptions<MongoDBSettings> settings)
        {
            var database = client.GetDatabase(settings.Value.DatabaseName);

            _collection = database.GetCollection<MedicalReport>("MedicalReports");
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
