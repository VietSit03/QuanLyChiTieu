using QLCTAPI.DTOs;

namespace QLCTAPI.Controllers.Currency
{
    public class ListCurrencyResponse
    {
        public string ErrorCode { get; set; }
        public List<CurrencyDTO> Data { get; set; }
    }
    public class ExchangeCurrencyResponse
    {
        public string ErrorCode { get; set; }
        public ExchangeCurrencyDTO Data { get; set; }
    }
}
