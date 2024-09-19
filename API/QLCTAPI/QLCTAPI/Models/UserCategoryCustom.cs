using System;
using System.Collections.Generic;

namespace QLCTAPI.Models;

public partial class UserCategoryCustom
{
    public int Id { get; set; }

    public Guid? UserId { get; set; }

    public int? CategoryId { get; set; }

    public string? Type { get; set; }

    public string? CategoryName { get; set; }

    public string? CategoryColor { get; set; }

    public int? CategoryOrder { get; set; }

    public bool? IsDefault { get; set; }
}
