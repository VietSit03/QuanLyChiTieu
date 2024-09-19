namespace QLCTAPI.DTOs
{
    public class MailDTO
    {
        public string Email { get; set; }
        public string? TemplateID { get; set; }
        public string? Name { get; set; }
        public Dictionary<string, string>? Params { get; set; }
    }
}
