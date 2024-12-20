﻿using System;
using System.Collections.Generic;

namespace QLCTAPI.Models;

public partial class FrequencyDefine
{
    public string FrequencyId { get; set; } = null!;

    public string? FrequencyName { get; set; }

    public bool? IsActive { get; set; }

    public int? Order { get; set; }
}
