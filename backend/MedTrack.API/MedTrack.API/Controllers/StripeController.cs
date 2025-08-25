using Microsoft.AspNetCore.Mvc;
using Stripe;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace MedTrack.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StripeController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public StripeController(IConfiguration configuration)
        {
            _configuration = configuration;
            StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"];
        }

        public class CreatePaymentIntentRequest
        {
            public int Amount { get; set; } // In cents
            public int? AppointmentId { get; set; }
        }

        [HttpPost("CreatePaymentIntent")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] CreatePaymentIntentRequest request)
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = request.Amount,
                Currency = "eur",
                PaymentMethodTypes = new List<string> { "card" },
                Metadata = new Dictionary<string, string>
                {
                    { "appointmentId", request.AppointmentId?.ToString() ?? "N/A" }
                }
            };

            var service = new PaymentIntentService();
            var intent = await service.CreateAsync(options);

            return Ok(new { clientSecret = intent.ClientSecret });
        }
    }
}
