using System;
using System.Collections.Generic;

namespace QLCTAPI.Models;

public partial class TransactionImage
{
    public int Id { get; set; }

    public int? TransactionId { get; set; }

    public string? ImgSrc { get; set; }
}
