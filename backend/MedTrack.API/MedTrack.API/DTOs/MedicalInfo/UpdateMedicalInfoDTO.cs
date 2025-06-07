namespace MedTrack.API.DTOs.MedicalInfo
{
    public class UpdateMedicalInfoDTO
    {
        public string Allergies { get; set; } = string.Empty;
        public string Medications { get; set; } = string.Empty;
        public bool Smoking { get; set; }
        public bool Alcohol { get; set; }
        public string PhysicalActivity { get; set; } = string.Empty;
    }
}
