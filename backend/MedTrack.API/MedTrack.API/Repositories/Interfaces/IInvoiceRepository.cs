using MedTrack.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Repositories.Interfaces
{
    public interface IInvoiceRepository
    {
        Task<IEnumerable<Invoice>> GetAllInvoicesAsync();
        Task<Invoice?> GetInvoiceByIdAsync(int id);
        Task AddInvoiceAsync(Invoice invoice);
        Task UpdateInvoiceAsync(Invoice invoice);
        Task DeleteInvoiceAsync(int id);

        Task<IEnumerable<Invoice>> GetInvoicesByPatientIdAsync(int patientId);
        Task<IEnumerable<Invoice>> GetPaidInvoicesAsync();
        Task<IEnumerable<Invoice>> GetUnpaidInvoicesAsync();
    }
}
