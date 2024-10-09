namespace QLCTAPI.Controllers.Transaction
{
    public class Request
    {
    }
    public class AddRequest
    {
        public int CategoryId { get; set; }
        public string Type { get; set; }
        public decimal Money { get; set; }
        public string? CurrencyCode { get; set; }
        public string CreateAt { get; set; }
        public string Note { get; set; }
        public List<string> ImgSrc { get; set; }
    }

    public class SearchTransRequest
    {
        public string Type { get; set; }
        public string Key { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
    }
}
