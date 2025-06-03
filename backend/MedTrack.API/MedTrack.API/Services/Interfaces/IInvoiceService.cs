using MedTrack.API.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Interfaces
{
    public interface IInvoiceService
    {
        Task<IEnumerable<InvoiceDTO>> GetAllInvoicesAsync();
        Task<InvoiceDTO?> GetInvoiceByIdAsync(int id);
        Task AddInvoiceAsync(CreateInvoiceDTO invoiceDto);
        Task UpdateInvoiceAsync(int id, UpdateInvoiceDTO invoiceDto);
        Task DeleteInvoiceAsync(int id);

        Task<IEnumerable<InvoiceDTO>> GetInvoicesByPatientIdAsync(int patientId);
        Task<IEnumerable<InvoiceDTO>> GetPaidInvoicesAsync();
        Task<IEnumerable<InvoiceDTO>> GetUnpaidInvoicesAsync();
    }
}
