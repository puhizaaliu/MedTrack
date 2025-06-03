using AutoMapper;
using MedTrack.API.DTOs;
using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using MedTrack.API.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Implementations
{
    public class PatientService : IPatientService
    {
        private readonly IPatientRepository _patientRepository;
        private readonly IMapper _mapper;

        public PatientService(IPatientRepository patientRepository, IMapper mapper)
        {
            _patientRepository = patientRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PatientDTO>> GetAllPatientsAsync()
        {
            var patients = await _patientRepository.GetAllPatientsAsync();
            return _mapper.Map<IEnumerable<PatientDTO>>(patients);
        }

        public async Task<PatientDTO?> GetPatientByIdAsync(int id)
        {
            var patient = await _patientRepository.GetPatientByIdAsync(id);
            return patient == null ? null : _mapper.Map<PatientDTO>(patient);
        }

        // Pacienti zakonisht krijohet si User, pastaj thjesht lidhet te tabela Patient
        public async Task AddPatientAsync(int userId)
        {
            var patient = new Patient
            {
                UserId = userId
            };
            await _patientRepository.AddPatientAsync(patient);
        }

        // Pacienti zakonisht nuk ka shume fusha per update ne vetvete, vetem lidhet me User
        public async Task UpdatePatientAsync(int id)
        {
            // Më shpesh Update bëhet për User (jo për tabelën Patient vetë)
            // Mund ta implementosh ose ta lësh bosh
            return;
        }

        public async Task DeletePatientAsync(int id)
        {
            await _patientRepository.DeletePatientAsync(id);
        }
    }
}
