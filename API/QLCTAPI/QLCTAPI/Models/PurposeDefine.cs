using System;
using System.Collections.Generic;

namespace QLCTAPI.Models;

public partial class PurposeDefine
{
    public string Code { get; set; } = null!;

    public string? PurposeName { get; set; }

    public bool? IsActive { get; set; }
}
