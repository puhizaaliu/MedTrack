using AutoMapper;
using MedTrack.API.DTOs.Invoice;
using MedTrack.API.Models;
using MedTrack.API.Repositories.Interfaces;
using MedTrack.API.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Services.Implementations
{
    public class InvoiceService : IInvoiceService
    {
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly IMapper _mapper;

        public InvoiceService(IInvoiceRepository invoiceRepository, IMapper mapper)
        {
            _invoiceRepository = invoiceRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<InvoiceDTO>> GetAllInvoicesAsync()
        {
            var invoices = await _invoiceRepository.GetAllInvoicesAsync();
            return _mapper.Map<IEnumerable<InvoiceDTO>>(invoices);
        }

        public async Task<InvoiceDTO?> GetInvoiceByIdAsync(int id)
        {
            var invoice = await _invoiceRepository.GetInvoiceByIdAsync(id);
            if (invoice == null) return null;
            return _mapper.Map<InvoiceDTO>(invoice);
        }

        public async Task<InvoiceDTO> AddInvoiceAsync(CreateInvoiceDTO createDto)
        {
            // 1. Map DTO to entity
            var invoice = _mapper.Map<Invoice>(createDto);
            invoice.PaymentStatus = true;

            // 2. Save to database
            await _invoiceRepository.AddInvoiceAsync(invoice);

            // 3. Fetch the full invoice with details (assumes the repository saves and sets InvoiceId)
            var created = await _invoiceRepository.GetInvoiceByIdAsync(invoice.InvoiceId);

            // 4. Map to DTO and return
            var invoiceDto = _mapper.Map<InvoiceDTO>(created);
            return invoiceDto;
        }


        public async Task UpdateInvoiceAsync(int id, UpdateInvoiceDTO updateDto)
        {
            var existing = await _invoiceRepository.GetInvoiceByIdAsync(id);
            if (existing == null)
                throw new KeyNotFoundException($"Invoice with ID {id} not found.");

            // Përditëso fushat sipas UpdateInvoiceDTO
            existing.Method = updateDto.Method;
            existing.PaymentStatus = updateDto.PaymentStatus;
            // Nëse doni të ndryshoni edhe amount:
            // existing.Amount = updateDto.Amount;

            await _invoiceRepository.UpdateInvoiceAsync(existing);
        }

        public async Task DeleteInvoiceAsync(int id)
        {
            await _invoiceRepository.DeleteInvoiceAsync(id);
        }

        public async Task<IEnumerable<InvoiceDTO>> GetInvoicesByPatientIdAsync(int patientId)
        {
            var invoices = await _invoiceRepository.GetInvoicesByPatientIdAsync(patientId);
            return _mapper.Map<IEnumerable<InvoiceDTO>>(invoices);
        }

        public async Task<IEnumerable<InvoiceDTO>> GetPaidInvoicesAsync()
        {
            var invoices = await _invoiceRepository.GetPaidInvoicesAsync();
            return _mapper.Map<IEnumerable<InvoiceDTO>>(invoices);
        }

        public async Task<IEnumerable<InvoiceDTO>> GetUnpaidInvoicesAsync()
        {
            var invoices = await _invoiceRepository.GetUnpaidInvoicesAsync();
            return _mapper.Map<IEnumerable<InvoiceDTO>>(invoices);
        }
    }
}
