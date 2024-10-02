namespace QLCTAPI.Controllers.Transaction
{
    public class Response
    {
    }
    public class SummaryByTypeResponse
    {
        public int? CategoryCustomId { get; set; }
        public string ImgSrc { get; set; }
        public string Color { get; set; }
        public string CategoryName { get; set; }
        public decimal? Budget { get; set; }
    }
}
