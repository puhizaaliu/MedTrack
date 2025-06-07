using AutoMapper;
using MedTrack.API.DTOs.Notification;
using MedTrack.API.MongoModels;
using MedTrack.API.Repositories.Interfaces;
using MedTrack.API.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Implementations
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _repository;
        private readonly IMapper _mapper;

        public NotificationService(
            INotificationRepository repository,
            IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<NotificationDTO>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<NotificationDTO>>(entities);
        }

        public async Task<NotificationDTO?> GetByIdAsync(string id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null)
                return null;
            return _mapper.Map<NotificationDTO>(entity);
        }

        public async Task<IEnumerable<NotificationDTO>> GetByUserIdAsync(int userId)
        {
            var entities = await _repository.GetByUserIdAsync(userId);
            return _mapper.Map<IEnumerable<NotificationDTO >>(entities);
        }

        public async Task<string> CreateAsync(CreateNotificationDTO dto)
        {
            var entity = _mapper.Map<NotificationDocument>(dto);
            entity.CreatedAt = DateTime.UtcNow;
            entity.IsRead = false;
            await _repository.CreateAsync(entity);
            return entity.Id;
        }

        public async Task UpdateAsync(string id, UpdateNotificationDTO dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new KeyNotFoundException($"Notification me Id = {id} nuk u gjet.");

            _mapper.Map(dto, existing);
            if (dto.IsRead == true && existing.ReadAt == null)
            {
                existing.ReadAt = DateTime.UtcNow;
            }
            await _repository.UpdateAsync(id, existing);
        }

        public async Task DeleteAsync(string id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
