using AutoMapper;
using MedTrack.API.DTOs.Service;
using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using MedTrack.API.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Implementations
{
    public class ServiceService : IServiceService
    {
        private readonly IServiceRepository _serviceRepository;
        private readonly IMapper _mapper;

        public ServiceService(IServiceRepository serviceRepository, IMapper mapper)
        {
            _serviceRepository = serviceRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ServiceDTO>> GetAllServicesAsync()
        {
            var services = await _serviceRepository.GetAllServicesAsync();
            return _mapper.Map<IEnumerable<ServiceDTO>>(services);
        }

        public async Task<ServiceDTO?> GetServiceByIdAsync(int id)
        {
            var service = await _serviceRepository.GetServiceByIdAsync(id);
            return service == null ? null : _mapper.Map<ServiceDTO>(service);
        }

        public async Task AddServiceAsync(ServiceDTO serviceDto)
        {
            var service = _mapper.Map<Service>(serviceDto);
            await _serviceRepository.AddServiceAsync(service);
        }

        public async Task UpdateServiceAsync(int id, ServiceDTO serviceDto)
        {
            var existingService = await _serviceRepository.GetServiceByIdAsync(id);
            if (existingService == null) throw new Exception("Service not found");

            _mapper.Map(serviceDto, existingService);
            await _serviceRepository.UpdateServiceAsync(existingService);
        }

        public async Task DeleteServiceAsync(int id)
        {
            await _serviceRepository.DeleteServiceAsync(id);
        }
    }
}
