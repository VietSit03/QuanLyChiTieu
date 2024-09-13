using System;
using System.Collections.Generic;

namespace QLCTAPI.Models;

public partial class Transaction
{
    public int Id { get; set; }

    public Guid? UserId { get; set; }

    public int? CategoryCustomId { get; set; }

    public string? Type { get; set; }

    public decimal? Money { get; set; }

    public string? CurrencyCode { get; set; }

    public DateTime? CreateAt { get; set; }

    public string? Note { get; set; }
}
