namespace QLCTAPI.DTOs
{
    public class CurrencyDTO
    {
        public string CurrencyCode { get; set; } = null!;

        public string? CurrencyName { get; set; }

        public string? Symbol { get; set; }

        public decimal? BuyRate { get; set; }

        public decimal? SellRate { get; set; }
    }
    public class ExchangeCurrencyDTO
    {
        public string FromCurrencyCode { get; set; } = null!;

        public string ToCurrencyCode { get; set; } = null!;

        public decimal? FromMoney { get; set; }

        public decimal? ToMoney { get; set; }
    }
}
