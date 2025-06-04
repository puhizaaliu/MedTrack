using AutoMapper;
using MedTrack.API.DTOs;
using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using MedTrack.API.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Implementations
{
    public class SpecializationServiceService : ISpecializationServiceService
    {
        private readonly ISpecializationServiceRepository _repository;
        private readonly IMapper _mapper;

        public SpecializationServiceService(ISpecializationServiceRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // Kthen listën e shërbimeve të specializimit në formë DTO
        public async Task<IEnumerable<SpecializationServiceDTO>> GetServicesBySpecializationAsync(int specializationId)
        {
            var services = await _repository.GetServicesBySpecializationAsync(specializationId);

            // Përdor AutoMapper për ta kthyer në DTO dhe shto specializationId
            var servicesDto = services.Select(s => new SpecializationServiceDTO
            {
                ServiceId = s.ServiceId,
                ServiceName = s.Name,
                SpecializationId = specializationId
            });

            return servicesDto;
        }

        public async Task AddServiceToSpecializationAsync(int specializationId, int serviceId)
        {
            await _repository.AddServiceToSpecializationAsync(specializationId, serviceId);
        }

        public async Task RemoveServiceFromSpecializationAsync(int specializationId, int serviceId)
        {
            await _repository.RemoveServiceFromSpecializationAsync(specializationId, serviceId);
        }
    }
}
