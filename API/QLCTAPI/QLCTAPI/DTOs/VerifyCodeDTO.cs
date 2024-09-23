namespace QLCTAPI.DTOs
{
    public class VerifyCodeDTO
    {
        public string Email { get; set; }
        public string Code { get; set; }
        public DateTime? ExpiredDate { get; set; }
    }
}
