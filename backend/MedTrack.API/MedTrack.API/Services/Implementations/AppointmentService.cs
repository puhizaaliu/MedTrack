using AutoMapper;
using MedTrack.API.DTOs.Appointments;
using MedTrack.API.DTOs.Notification;
using MedTrack.API.Models;
using MedTrack.API.MongoModels;
using MedTrack.API.Repositories.Interfaces;
using MedTrack.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace MedTrack.API.Services.Implementations
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IMapper _mapper;
        private readonly INotificationService _notificationService;
        private readonly IUserRepository _userRepository;

        public AppointmentService(IAppointmentRepository appointmentRepository, IMapper mapper, INotificationService notificationService, IUserRepository userRepository)
        {
            _appointmentRepository = appointmentRepository;
            _mapper = mapper;
            _notificationService = notificationService;
            _userRepository = userRepository;

        }

        public async Task<IEnumerable<AppointmentDTO>> GetAllAppointmentsAsync()
        {
            var appointments = await _appointmentRepository.GetAllAppointmentsAsync();
            return _mapper.Map<IEnumerable<AppointmentDTO>>(appointments);
        }

        public async Task<AppointmentDTO?> GetAppointmentByIdAsync(int id)
        {
            var appointment = await _appointmentRepository.GetAppointmentByIdAsync(id);
            return appointment == null ? null : _mapper.Map<AppointmentDTO>(appointment);
        }

        public async Task AddAppointmentAsync(CreateAppointmentDTO appointmentDto)
        {
            var appointment = _mapper.Map<Appointment>(appointmentDto);
            appointment.Status = AppointmentStatus.Kerkese;
            await _appointmentRepository.AddAppointmentAsync(appointment);

            var createdAppointment = await _appointmentRepository.GetAppointmentByIdAsync(appointment.AppointmentId);

            try
            {
                var receptionists = await _userRepository.GetByRoleAsync(UserRole.Receptionist);

                foreach (var r in receptionists)
                {
                    var createDto = new CreateNotificationDTO
                    {
                        UserId = r.UserId,
                        Type = NotificationType.AppointmentRequested,
                        Message = $"Kërkesë e re për termin nga {createdAppointment.Patient.User.Name} {createdAppointment.Patient.User.Surname}.",
                        AppointmentId = createdAppointment.AppointmentId
                    };

                    await _notificationService.CreateAsync(createDto);

                    Console.WriteLine($"Notification created: {createDto.Message}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending notification to receptionist: {ex.Message}");
            }
        }

        public async Task UpdateAppointmentAsync(int id, UpdateAppointmentDTO appointmentDto)
        {
            var existingAppointment = await _appointmentRepository.GetAppointmentByIdAsync(id);
            if (existingAppointment == null) throw new Exception("Appointment not found");

            // Parse Date and Time
            if (!string.IsNullOrEmpty(appointmentDto.Date))
                existingAppointment.Date = DateOnly.Parse(appointmentDto.Date);

            if (!string.IsNullOrEmpty(appointmentDto.Time))
                existingAppointment.Time = TimeOnly.Parse(appointmentDto.Time);

            // Prevent double booking if confirming
            if (appointmentDto.Status == AppointmentStatus.Konfirmuar)
            {
                var doctorId = existingAppointment.DoctorId;
                var date = existingAppointment.Date;
                var time = existingAppointment.Time;

                var conflict = await _appointmentRepository.AppointmentExistsAsync(doctorId, date, time, id);
                if (conflict)
                    throw new Exception("Doctor is already booked at that date and time.");
            }

            // Save new status
            existingAppointment.Status = appointmentDto.Status;
            await _appointmentRepository.UpdateAppointmentAsync(existingAppointment);

            var updatedAppointment = await _appointmentRepository.GetAppointmentByIdAsync(id);

            // Notify patient when confirmed
            if (appointmentDto.Status == AppointmentStatus.Konfirmuar)
            {
                try
                {
                    await _notificationService.CreateAsync(new CreateNotificationDTO
                    {
                        UserId = updatedAppointment.Patient.UserId,
                        Type = NotificationType.AppointmentConfirmed,
                        Message = $"Termini juaj është konfirmuar për {updatedAppointment.Date:dd.MM.yyyy} në ora {updatedAppointment.Time:hh\\:mm}.",
                        AppointmentId = updatedAppointment.AppointmentId
                    });
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"❌ Error sending confirmation notification to patient: {ex.Message}");
                }
            }

            // Notify doctor when appointment moves to NeProces
            if (appointmentDto.Status == AppointmentStatus.NeProces)
            {
                try
                {
                    var patientName = updatedAppointment.Patient.User.Name;
                    var patientSurname = updatedAppointment.Patient.User.Surname;

                    await _notificationService.CreateAsync(new CreateNotificationDTO
                    {
                        UserId = updatedAppointment.Doctor.UserId,
                        Type = NotificationType.AppointmentInProcess, // You may need to add this in your enum
                        Message = $"Pacienti {patientName} {patientSurname} është në pritje, fillo terminin.",
                        AppointmentId = updatedAppointment.AppointmentId
                    });
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"❌ Error sending in-process notification to doctor: {ex.Message}");
                }
            }
        }
  

public async Task DeleteAppointmentAsync(int id)
        {
            await _appointmentRepository.DeleteAppointmentAsync(id);
        }

        public async Task<IEnumerable<AppointmentDTO>> GetAppointmentsByDoctorIdAsync(int doctorId)
        {
            var appointments = await _appointmentRepository.GetAppointmentsByDoctorIdAsync(doctorId);
            return _mapper.Map<IEnumerable<AppointmentDTO>>(appointments);
        }

        public async Task<IEnumerable<AppointmentDTO>> GetAppointmentsByPatientIdAsync(int patientId)
        {
            var appointments = await _appointmentRepository.GetAppointmentsByPatientIdAsync(patientId);
            return _mapper.Map<IEnumerable<AppointmentDTO>>(appointments);
        }

        public async Task<IEnumerable<AppointmentDTO>> GetAppointmentsByStatusAsync(AppointmentStatus status)
        {
            var appointments = await _appointmentRepository.GetAppointmentsByStatusAsync(status);
            return _mapper.Map<IEnumerable<AppointmentDTO>>(appointments);
        }
    }
}

