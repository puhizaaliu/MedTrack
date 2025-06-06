using MedTrack.API.Config;
using MedTrack.API.MongoModels;
using MedTrack.API.Repositories.Interfaces;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Repositories.Implementations
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly IMongoCollection<NotificationDocument> _collection;

        public NotificationRepository(
            IMongoClient client,
            IOptions<MongoDBSettings> settings)
        {
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _collection = database.GetCollection<NotificationDocument>("Notifications");
        }

        public async Task<IEnumerable<NotificationDocument>> GetAllAsync()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<NotificationDocument?> GetByIdAsync(string id)
        {
            return await _collection
                .Find(n => n.Id == id)
                .FirstOrDefaultAsync();
        }

        public async Task CreateAsync(NotificationDocument notification)
        {
            await _collection.InsertOneAsync(notification);
        }

        public async Task UpdateAsync(string id, NotificationDocument notification)
        {
            await _collection.ReplaceOneAsync(
                filter: n => n.Id == id,
                replacement: notification);
        }

        public async Task DeleteAsync(string id)
        {
            await _collection.DeleteOneAsync(n => n.Id == id);
        }

        public async Task<IEnumerable<NotificationDocument>> GetByUserIdAsync(int userId)
        {
            return await _collection
                .Find(n => n.UserId == userId)
                .ToListAsync();
        }
    }
}
