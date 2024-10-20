using System;
using System.Collections.Generic;

namespace QLCTAPI.Models;

public partial class Notification
{
    public string Id { get; set; } = null!;

    public Guid? UserId { get; set; }

    public int? ScheduleId { get; set; }

    public DateTime? DateNotificate { get; set; }

    public string? Status { get; set; }
}
