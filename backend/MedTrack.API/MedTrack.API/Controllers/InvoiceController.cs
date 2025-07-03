using MedTrack.API.Attributes;
using MedTrack.API.DTOs.Invoice;
using MedTrack.API.Models;
using MedTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedTrack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;

        public InvoiceController(IInvoiceService invoiceService)
        {
            _invoiceService = invoiceService;
        }

        // GET: api/Invoice
        [HttpGet]
        [AuthorizeRoles(UserRole.Receptionist, UserRole.Admin)]
        public async Task<ActionResult<IEnumerable<InvoiceDTO>>> GetAll()
        {
            var invoices = await _invoiceService.GetAllInvoicesAsync();
            return Ok(invoices);
        }

        // GET: api/Invoice/5
        [HttpGet("{id}")]
        [AuthorizeRoles(UserRole.Receptionist, UserRole.Admin, UserRole.Patient)]
        public async Task<ActionResult<InvoiceDTO>> GetById(int id)
        {
            var invoice = await _invoiceService.GetInvoiceByIdAsync(id);
            if (invoice == null)
                return NotFound();
            return Ok(invoice);
        }

        // GET: api/Invoice/patient/5
        [HttpGet("patient/{patientId}")]
        [AuthorizeRoles(UserRole.Receptionist, UserRole.Admin, UserRole.Patient)]
        public async Task<ActionResult<IEnumerable<InvoiceDTO>>> GetByPatient(int patientId)
        {
            var invoices = await _invoiceService.GetInvoicesByPatientIdAsync(patientId);
            return Ok(invoices);
        }

        // GET: api/Invoice/paid
        [HttpGet("paid")]
        [AuthorizeRoles(UserRole.Receptionist, UserRole.Admin)]
        public async Task<ActionResult<IEnumerable<InvoiceDTO>>> GetPaid()
        {
            var paidInvoices = await _invoiceService.GetPaidInvoicesAsync();
            return Ok(paidInvoices);
        }

        // GET: api/Invoice/unpaid
        [HttpGet("unpaid")]
        [AuthorizeRoles(UserRole.Receptionist, UserRole.Admin)]
        public async Task<ActionResult<IEnumerable<InvoiceDTO>>> GetUnpaid()
        {
            var unpaidInvoices = await _invoiceService.GetUnpaidInvoicesAsync();
            return Ok(unpaidInvoices);
        }

        // POST: api/Invoice
        [HttpPost]
        [AuthorizeRoles(UserRole.Receptionist)]
        public async Task<ActionResult<InvoiceDTO>> Create([FromBody] CreateInvoiceDTO createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var invoice = await _invoiceService.AddInvoiceAsync(createDto);
                return CreatedAtAction(nameof(GetById), new { id = invoice.InvoiceId }, invoice);
            }
            catch (Exception ex)
            {
                // Log ex.ToString() here!
                return StatusCode(500, ex.ToString());
            }
        }

        // PUT: api/Invoice/5
        [HttpPut("{id}")]
        [AuthorizeRoles(UserRole.Receptionist, UserRole.Admin)]
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
        [AuthorizeRoles(UserRole.Admin)]
        public async Task<ActionResult> Delete(int id)
        {
            await _invoiceService.DeleteInvoiceAsync(id);
            return NoContent();
        }
    }
}
