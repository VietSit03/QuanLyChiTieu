using System;
using System.Collections.Generic;

namespace QLCTAPI.Models;

public partial class VerifyCode
{
    public string Email { get; set; } = null!;

    public string? Code { get; set; }

    public bool? IsVerify { get; set; }

    public DateTime? ExpiredDate { get; set; }
}
