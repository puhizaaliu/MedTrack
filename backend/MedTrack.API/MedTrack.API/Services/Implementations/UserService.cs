using AutoMapper;
using BCrypt.Net;
using MedTrack.API.DTOs.User;
using MedTrack.API.Models;
using MedTrack.API.Repositories.Implementations;
using MedTrack.API.Repositories.Interfaces;
using MedTrack.API.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace MedTrack.API.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IDoctorRepository _doctorRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepository, IDoctorRepository doctorRepository, IPatientRepository patientRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _doctorRepository = doctorRepository;
            _patientRepository = patientRepository;
            _mapper = mapper;

        }

        public async Task<IEnumerable<UserDTO>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllUsersAsync();
            return _mapper.Map<IEnumerable<UserDTO>>(users);
        }

        public async Task<UserDTO?> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            return user == null ? null : _mapper.Map<UserDTO>(user);
        }

        public async Task<UserDTO?> GetUserByEmailAsync(string email)
        {
            var user = await _userRepository.GetUserByEmailAsync(email);
            return user == null ? null : _mapper.Map<UserDTO>(user);
        }

        public async Task AddUserAsync(CreateUserDTO userDto)
        {
            var user = _mapper.Map<User>(userDto);

            // Krijo hash-in e fjalëkalimit
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

            await _userRepository.AddUserAsync(user);
        }

        public async Task UpdateUserAsync(int id, UpdateUserDTO userDto)
        {
            var existingUser = await _userRepository.GetUserByIdAsync(id);
            if (existingUser == null) throw new Exception("User not found");

            // Përditëso entitetin ekzistues me të dhënat nga DTO
            _mapper.Map(userDto, existingUser);
            await _userRepository.UpdateUserAsync(existingUser);
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null) return false;

            if (user.Role == UserRole.Doctor)
            {
                await _doctorRepository.DeleteDoctorByUserIdAsync(id);
            }
            if (user.Role == UserRole.Patient)
            {
                await _patientRepository.DeletePatientByUserIdAsync(id);
            }

            await _userRepository.DeleteUserAsync(id);
            return true;
        }

    }
}
