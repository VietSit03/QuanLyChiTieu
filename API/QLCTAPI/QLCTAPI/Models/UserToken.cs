using System;
using System.Collections.Generic;

namespace QLCTAPI.Models;

public partial class UserToken
{
    public Guid UserId { get; set; }

    public string? Token { get; set; }

    public DateTime? ExpiredDate { get; set; }
}
