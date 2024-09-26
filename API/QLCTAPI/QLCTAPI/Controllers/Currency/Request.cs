using QLCTAPI.DTOs;

namespace QLCTAPI.Controllers.Currency
{
    public class Request
    {
    }
    public class ExchangeCurrencyRequest
    {
        public decimal Money { get; set; }
        public string FromCurrencyCode { get; set; }
        public string ToCurrencyCode { get; set; }
    }
}
