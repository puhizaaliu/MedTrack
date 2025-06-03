using AutoMapper;
using MedTrack.API.DTOs;
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
            return invoice == null ? null : _mapper.Map<InvoiceDTO>(invoice);
        }

        public async Task AddInvoiceAsync(CreateInvoiceDTO invoiceDto)
        {
            var invoice = _mapper.Map<Invoice>(invoiceDto);
            invoice.PaymentStatus = false; // default e pa paguar
            await _invoiceRepository.AddInvoiceAsync(invoice);
        }

        public async Task UpdateInvoiceAsync(int id, UpdateInvoiceDTO invoiceDto)
        {
            var existingInvoice = await _invoiceRepository.GetInvoiceByIdAsync(id);
            if (existingInvoice == null) throw new Exception("Invoice not found");

            _mapper.Map(invoiceDto, existingInvoice);
            await _invoiceRepository.UpdateInvoiceAsync(existingInvoice);
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
