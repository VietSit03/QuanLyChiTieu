namespace QLCTAPI.DTOs
{
    public class TransactionDTO
    {
        public Guid? UserId { get; set; }

        public int? CategoryCustomId { get; set; }

        public string? Type { get; set; }

        public decimal? Money { get; set; }

        public string? CurrencyCode { get; set; }

        public DateTime? CreateAt { get; set; }

        public string? Note { get; set; }

        public string? Status { get; set; }
    }
}
