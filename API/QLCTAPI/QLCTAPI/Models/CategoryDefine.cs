using System;
using System.Collections.Generic;

namespace QLCTAPI.Models;

public partial class CategoryDefine
{
    public int Id { get; set; }

    public string? PurposeCode { get; set; }

    public string? ImgSrc { get; set; }

    public string? Type { get; set; }
}
