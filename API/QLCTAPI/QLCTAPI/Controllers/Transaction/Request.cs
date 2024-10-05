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
        public DateTime CreateAt { get; set; }
        public string Note { get; set; }
        public List<string> ImgSrc { get; set; }
    }
}
