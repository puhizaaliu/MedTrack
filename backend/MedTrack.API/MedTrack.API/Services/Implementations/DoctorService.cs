using AutoMapper;
using MedTrack.API.DTOs.Doctor;
using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using MedTrack.API.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Implementations
{
    public class DoctorService : IDoctorService
    {
        private readonly IDoctorRepository _doctorRepository;
        private readonly IMapper _mapper;

        public DoctorService(IDoctorRepository doctorRepository, IMapper mapper)
        {
            _doctorRepository = doctorRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<DoctorDTO>> GetAllDoctorsAsync()
        {
            var doctors = await _doctorRepository.GetAllDoctorsAsync();
            return _mapper.Map<IEnumerable<DoctorDTO>>(doctors);
        }

        public async Task<DoctorDTO?> GetDoctorByIdAsync(int id)
        {
            var doctor = await _doctorRepository.GetDoctorByIdAsync(id);
            return doctor == null ? null : _mapper.Map<DoctorDTO>(doctor);
        }

        // Krijon doctor për një user ekzistues (p.sh. userId është pacient që bëhet doktor)
        public async Task AddDoctorAsync(int userId, int specializationId)
        {
            var doctor = new Doctor
            {
                UserId = userId,
                SpecializationId = specializationId
            };
            await _doctorRepository.AddDoctorAsync(doctor);
        }

        public async Task UpdateDoctorAsync(int id, UpdateDoctorDTO doctorDto)
        {
            var existingDoctor = await _doctorRepository.GetDoctorByIdAsync(id);
            if (existingDoctor == null) throw new Exception("Doctor not found");

            _mapper.Map(doctorDto, existingDoctor);
            await _doctorRepository.UpdateDoctorAsync(existingDoctor);
        }

        public async Task DeleteDoctorAsync(int id)
        {
            await _doctorRepository.DeleteDoctorAsync(id);
        }

        public async Task<IEnumerable<DoctorDTO>> GetDoctorsBySpecializationIdAsync(int specializationId)
        {
            var doctors = await _doctorRepository.GetDoctorsBySpecializationIdAsync(specializationId);
            return _mapper.Map<IEnumerable<DoctorDTO>>(doctors);
        }
    }
}
