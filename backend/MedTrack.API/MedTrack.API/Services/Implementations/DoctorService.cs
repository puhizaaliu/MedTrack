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
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public DoctorService(IDoctorRepository doctorRepository, IUserRepository userRepository, IMapper mapper)
        {
            _doctorRepository = doctorRepository;
            _userRepository = userRepository;
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

        public async Task AddDoctorAsync(CreateDoctorDTO dto)
        {
            // 1. Create User
            var user = new User
            {
                Name = dto.Name,
                Surname = dto.Surname,
                ParentName = dto.ParentName,
                Email = dto.Email,
                Phone = dto.Phone,
                Address = dto.Address,
                DateOfBirth = dto.DateOfBirth,
                Gender = dto.Gender,
                PersonalNumber = dto.PersonalNumber,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = UserRole.Doctor
            };
            await _userRepository.AddUserAsync(user);

            // 2. Create Doctor
            var doctor = new Doctor
            {
                UserId = user.UserId, // now set!
                SpecializationId = dto.SpecializationId
            };
            await _doctorRepository.AddDoctorAsync(doctor);
        }

        public async Task UpdateDoctorAsync(int userId, UpdateDoctorDTO dto)
        {
            // 1. Update User info
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null) throw new Exception("User not found");
            user.Name = dto.Name;
            user.Surname = dto.Surname;
            user.ParentName = dto.ParentName;
            user.Email = dto.Email;
            user.Phone = dto.Phone;
            user.Address = dto.Address;
            user.DateOfBirth = dto.DateOfBirth;
            user.Gender = dto.Gender;
            user.PersonalNumber = dto.PersonalNumber;
            await _userRepository.UpdateUserAsync(user);

            // 2. Update Doctor info
            var doctor = await _doctorRepository.GetDoctorByIdAsync(userId);
            if (doctor == null) throw new Exception("Doctor not found");
            doctor.SpecializationId = dto.SpecializationId;
            await _doctorRepository.UpdateDoctorAsync(doctor);
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

        public async Task<List<DoctorDTO>> GetDoctorsByServiceAsync(int serviceId)
        {
            return await _doctorRepository.GetDoctorsByServiceAsync(serviceId);
        }

    }
}
