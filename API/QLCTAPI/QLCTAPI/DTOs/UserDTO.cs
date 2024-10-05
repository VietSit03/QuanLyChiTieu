namespace QLCTAPI.DTOs
{
    public class UserDTO
    {
        public Guid Id {  get; set; }
        public string Name { get; set; }
        public string CurrencyCode { get; set; }
        public string CurrencySymbol { get; set; }
    }
}
