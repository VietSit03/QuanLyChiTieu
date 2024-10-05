using System;
using System.Collections.Generic;

namespace QLCTAPI.Models;

public partial class Schedule
{
    public int Id { get; set; }

    public Guid? UserId { get; set; }

    public int? CategoryCustomId { get; set; }

    public string? Name { get; set; }

    public string? Type { get; set; }

    public decimal? Money { get; set; }

    public string? FrequencyId { get; set; }

    public DateTime? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public string? Note { get; set; }

    public bool? IsActive { get; set; }
}
