using MedTrack.API.DTOs.Appointments;
using MedTrack.API.DTOs.Doctor;
using MedTrack.API.DTOs.Patient;

namespace MedTrack.API.DTOs.MedicalReport
{
    public class MedicalReportDetailDTO
    {
        public MedicalReportDTO Report { get; set; } = null!;
        public AppointmentDTO Appointment { get; set; } = null!;
        public PatientDTO Patient { get; set; } = null!;
        public DoctorDTO Doctor { get; set; } = null!;
    }
}
