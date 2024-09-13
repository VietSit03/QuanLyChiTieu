using System;
using System.Collections.Generic;

namespace QLCTAPI.Models;

public partial class User
{
    public Guid Id { get; set; }

    public string? Username { get; set; }

    public string? Password { get; set; }

    public string? Name { get; set; }

    public bool? IsActive { get; set; }

    public string? CurrencyCode { get; set; }

    public decimal? Balance { get; set; }

    public int? NumLoginFail { get; set; }
}
