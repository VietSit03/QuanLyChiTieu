using System;
using System.Collections.Generic;

namespace QLCTAPI.Models;

public partial class CurrencyDefine
{
    public string CurrencyCode { get; set; } = null!;

    public string? CurrencyName { get; set; }

    public string? Symbol { get; set; }

    public decimal? BuyRate { get; set; }

    public decimal? SellRate { get; set; }

    public bool? IsActive { get; set; }
}
