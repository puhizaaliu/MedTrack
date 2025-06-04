using MedTrack.API.DTOs;
using MedTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;

        public InvoiceController(IInvoiceService invoiceService)
        {
            _invoiceService = invoiceService;
        }

        // GET: api/Invoice
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoiceDTO>>> GetAll()
        {
            var invoices = await _invoiceService.GetAllInvoicesAsync();
            return Ok(invoices);
        }

        // GET: api/Invoice/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceDTO>> GetById(int id)
        {
            var invoice = await _invoiceService.GetInvoiceByIdAsync(id);
            if (invoice == null)
                return NotFound();
            return Ok(invoice);
        }

        // GET: api/Invoice/patient/5
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<InvoiceDTO>>> GetByPatient(int patientId)
        {
            var invoices = await _invoiceService.GetInvoicesByPatientIdAsync(patientId);
            return Ok(invoices);
        }

        // GET: api/Invoice/paid
        [HttpGet("paid")]
        public async Task<ActionResult<IEnumerable<InvoiceDTO>>> GetPaid()
        {
            var paidInvoices = await _invoiceService.GetPaidInvoicesAsync();
            return Ok(paidInvoices);
        }

        // GET: api/Invoice/unpaid
        [HttpGet("unpaid")]
        public async Task<ActionResult<IEnumerable<InvoiceDTO>>> GetUnpaid()
        {
            var unpaidInvoices = await _invoiceService.GetUnpaidInvoicesAsync();
            return Ok(unpaidInvoices);
        }

        // POST: api/Invoice
        [HttpPost]
        public async Task<ActionResult<InvoiceDTO>> Create([FromBody] CreateInvoiceDTO createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _invoiceService.AddInvoiceAsync(createDto);
            // Optionally, you could retrieve the newly created invoice DTO here and return it.
            return StatusCode(201);
        }

        // PUT: api/Invoice/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] UpdateInvoiceDTO updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                await _invoiceService.UpdateInvoiceAsync(id, updateDto);
            }
            catch (Exception)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/Invoice/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _invoiceService.DeleteInvoiceAsync(id);
            return NoContent();
        }
    }
}
