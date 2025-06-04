using AutoMapper;
using MedTrack.API.DTOs;
using MedTrack.API.Models;

namespace MedTrack.API.Config
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User
            CreateMap<User, UserDTO>().ReverseMap();
            CreateMap<CreateUserDTO, User>();
            CreateMap<UpdateUserDTO, User>();

            // Doctor
            CreateMap<Doctor, DoctorDTO>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.User.Name))
                .ForMember(dest => dest.Surname, opt => opt.MapFrom(src => src.User.Surname))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.User.Phone))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.SpecializationName, opt => opt.MapFrom(src => src.Specialization.Name));
            CreateMap<UpdateDoctorDTO, Doctor>();

            // Patient
            CreateMap<Patient, PatientDTO>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.User.Name))
                .ForMember(dest => dest.Surname, opt => opt.MapFrom(src => src.User.Surname))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.User.Phone))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.User.Address))
                .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.User.DateOfBirth))
                .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.User.Gender));
            // medical info dhe family history (si liste) mapohen direkt 

            // MedicalInfo
            CreateMap<MedicalInfo, MedicalInfoDTO>().ReverseMap();
            CreateMap<CreateMedicalInfoDTO, MedicalInfo>();
            CreateMap<UpdateMedicalInfoDTO, MedicalInfo>();

            // FamilyHistory
            CreateMap<FamilyHistory, FamilyHistoryDTO>().ReverseMap();
            CreateMap<CreateFamilyHistoryDTO, FamilyHistory>();
            CreateMap<UpdateFamilyHistoryDTO, FamilyHistory>();

            // Appointment
            CreateMap<Appointment, AppointmentDTO>()
                .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src => src.Patient.User.Name))
                .ForMember(dest => dest.PatientSurname, opt => opt.MapFrom(src => src.Patient.User.Surname))
                .ForMember(dest => dest.DoctorName, opt => opt.MapFrom(src => src.Doctor.User.Name))
                .ForMember(dest => dest.DoctorSurname, opt => opt.MapFrom(src => src.Doctor.User.Surname))
                .ForMember(dest => dest.ServiceName, opt => opt.MapFrom(src => src.Service.Name));
            CreateMap<CreateAppointmentDTO, Appointment>();
            CreateMap<UpdateAppointmentDTO, Appointment>();

            // Invoice
            CreateMap<Invoice, InvoiceDTO>()
                .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src => src.Appointment.Patient.User.Name))
                .ForMember(dest => dest.DoctorName, opt => opt.MapFrom(src => src.Appointment.Doctor.User.Name));
            CreateMap<CreateInvoiceDTO, Invoice>();
            CreateMap<UpdateInvoiceDTO, Invoice>();

            // Service
            CreateMap<Service, ServiceDTO>().ReverseMap();

            // Specialization
            CreateMap<Specialization, SpecializationDTO>().ReverseMap();

            // Për mapping e SpecializationService
            CreateMap<SpecializationService, SpecializationServiceDTO>()
                .ForMember(dest => dest.ServiceName, opt => opt.MapFrom(src => src.Service.Name));

        }
    }
}
