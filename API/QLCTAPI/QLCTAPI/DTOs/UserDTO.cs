namespace QLCTAPI.DTOs
{
    public class UserDTO
    {
        public Guid Id {  get; set; }
        public string Email { get; set; }
        public decimal? Balance { get; set; }
        public string Name { get; set; }
        public string CurrencyCode { get; set; }
        public string CurrencySymbol { get; set; }
    }
}
