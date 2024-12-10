using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLCTAPI.Controllers.Category;
using QLCTAPI.DTOs;
using QLCTAPI.Models;
using Quartz;
using System.Security.Claims;

namespace QLCTAPI.Controllers.Schedule
{
    [Route("schedules/")]
    [ApiController]
    public class SchedulesController : ControllerBase
    {
        private readonly QuanLyChiTieuContext _context;

        public SchedulesController(QuanLyChiTieuContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        [CustomAuthorize]
        public async Task<ActionResult> GetAllSchedules()
        {
            var useID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(useID, out var uId))
            {
                var schedules = await _context.Schedules.Where(x => x.UserId == uId).ToListAsync();

                if (schedules.Count > 0)
                {
                    return Ok(new { ErrorCode = ErrorCode.GETDATASUCCESS, Data = schedules });
                }
                return BadRequest(new { ErrorCode = ErrorCode.NODATA });

            }
            else
            {
                return BadRequest(new { ErrorCode = ErrorCode.GETDATAFAIL });
            }
        }

        [HttpGet("get")]
        [CustomAuthorize]
        public async Task<ActionResult> GetById([FromQuery] int id)
        {
            var useID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(useID, out var uId))
            {
                var schedule = await _context.Schedules.Where(x => x.UserId == uId && x.Id == id)
                    .Select(x => new
                    {
                        UserId = uId,
                        CategoryCustomId = x.CategoryCustomId,
                        FrequencyId = x.FrequencyId,
                        Name = x.Name,
                        Type = x.Type,
                        Money = x.Money,
                        StartDate = x.StartDate,
                        EndDate = x.EndDate,
                        Note = x.Note,
                    })
                    .FirstOrDefaultAsync();

                var category = await _context.UserCategoryCustoms.Where(ucc => ucc.CategoryId == schedule.CategoryCustomId)
                    .Select(x => new
                    {
                        CategoryId = x.CategoryId,
                        ImgSrc = _context.CategoryDefines.Where(cd => cd.Id == x.CategoryId).Select(y => y.ImgSrc).FirstOrDefault(),
                        Name = x.CategoryName,
                        Color = x.CategoryColor
                    })
                    .FirstOrDefaultAsync();

                var frequency = await _context.FrequencyDefines.Where(fd => fd.FrequencyId == schedule.FrequencyId)
                    .Select(x => new
                    {
                        Id = x.FrequencyId,
                        Name = x.FrequencyName,
                    })
                    .FirstOrDefaultAsync();

                var data = new
                {
                    UserId = uId,
                    Category = category,
                    Frequency = frequency,
                    Name = schedule.Name,
                    Type = schedule.Type,
                    Money = schedule.Money,
                    StartDate = schedule.StartDate,
                    EndDate = schedule.EndDate,
                    Note = schedule.Note,
                };

                if (schedule != null)
                {
                    return Ok(new { ErrorCode = ErrorCode.GETDATASUCCESS, Data = data });
                }
                return BadRequest(new { ErrorCode = ErrorCode.NODATA });

            }
            else
            {
                return BadRequest(new { ErrorCode = ErrorCode.GETDATAFAIL });
            }
        }

        [HttpPost("add")]
        [CustomAuthorize]
        public async Task<ActionResult> AddSchedule([FromBody] ScheduleRequest request)
        {
            var useID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(useID, out var uId))
            {
                var schedule = new Models.Schedule
                {
                    UserId = uId,
                    CategoryCustomId = request.CategoryCustomId,
                    FrequencyId = request.FrequencyId,
                    Name = request.Name,
                    Type = request.Type,
                    Money = request.Money,
                    StartDate = DateTime.ParseExact(request.StartDate, "yyyy-MM-dd HH:mm", null),
                    EndDate = request.EndDate != null ? DateOnly.ParseExact(request.EndDate, "yyyy-MM-dd", null) : (DateOnly?)null,
                    Note = request.Note,
                };

                _context.Schedules.Add(schedule);

                await _context.SaveChangesAsync();

                var notification = new Notification
                {
                    Id = request.NotificationId,
                    UserId = uId,
                    ScheduleId = schedule.Id,
                    DateNotificate = schedule.StartDate,
                    Status = "A"
                };

                _context.Notifications.Add(notification);

                await _context.SaveChangesAsync();

                return Ok(new { ErrorCode = ErrorCode.CREATEDATASUCCESS });
            }
            else
            {
                return BadRequest(new { ErrorCode = ErrorCode.CREATEDATAFAIL });
            }
        }

        [HttpPost("add/notification")]
        [CustomAuthorize]
        public async Task<ActionResult> AddNotification([FromBody] NotificationRequest request)
        {
            var useID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(useID, out var uId))
            {
                var notification = new Models.Notification
                {
                    Id = request.NotificationId,
                    UserId = uId,
                    ScheduleId = request.ScheduleId,
                    DateNotificate = request.DateNotificate,
                    Status = "A"
                };

                _context.Notifications.Add(notification);

                await _context.SaveChangesAsync();

                return Ok(new { ErrorCode = ErrorCode.CREATEDATASUCCESS });
            }
            else
            {
                return BadRequest(new { ErrorCode = ErrorCode.CREATEDATAFAIL });
            }
        }

        [HttpPut("update")]
        [CustomAuthorize]
        public async Task<ActionResult> UpdateSchedule([FromQuery] int id, [FromBody] ScheduleRequest request)
        {
            var useID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(useID, out var uId))
            {
                var schedule = await _context.Schedules.Where(s => s.Id == id).FirstOrDefaultAsync();

                schedule.CategoryCustomId = request.CategoryCustomId;
                schedule.FrequencyId = request.FrequencyId;
                schedule.Name = request.Name;
                schedule.Type = request.Type;
                schedule.Money = request.Money;
                schedule.StartDate = DateTime.ParseExact(request.StartDate, "yyyy-MM-dd HH:mm", null);
                schedule.EndDate = request.EndDate != null ? DateOnly.ParseExact(request.EndDate, "yyyy-MM-dd", null) : (DateOnly?)null;
                schedule.Note = request.Note;

                await _context.SaveChangesAsync();

                var notification = new Notification
                {
                    Id = request.NotificationId,
                    UserId = uId,
                    ScheduleId = schedule.Id,
                    DateNotificate = schedule.StartDate,
                    Status = "A"
                };

                _context.Notifications.Add(notification);

                var oldNotification = await _context.Notifications
                    .Where(x => x.UserId == uId && x.ScheduleId == schedule.Id && x.Status == "A" || x.Status == "I")
                    .OrderByDescending(x => x.DateNotificate)
                    .FirstOrDefaultAsync();

                if (oldNotification != null)
                {
                    oldNotification.Status = "C";
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    ErrorCode = ErrorCode.UPDATEDATASUCCESS,
                    Data = new
                    {
                        NotificationId = oldNotification != null ? oldNotification.Id : "",
                    }
                });
            }
            else
            {
                return BadRequest(new { ErrorCode = ErrorCode.UPDATEDATAFAIL });
            }
        }

        [HttpGet("refresh")]
        public async Task<ActionResult> RefreshSchedule()
        {
            var notificationsA = await _context.Notifications.Where(x => x.Status == "A").ToListAsync();
            if (notificationsA.Any())
            {
                foreach (var notification in notificationsA)
                {
                    if (notification.DateNotificate <= DateTime.Now)
                    {
                        notification.Status = "S";
                    }
                }
                await _context.SaveChangesAsync();
            }

            return Ok(new { ErrorCode = ErrorCode.UPDATEDATASUCCESS });
        }

        [HttpPost("refresh-notifications")]
        [CustomAuthorize]
        public async Task<ActionResult> RefreshNotifications()
        {
            var useID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(useID, out var uId))
            {
                var notificationsA = await _context.Notifications
                    .Where(x => x.Status == "S" && x.UserId == uId)
                    .GroupBy(x => new { x.UserId, x.ScheduleId })
                    .Select(g => g.OrderByDescending(x => x.DateNotificate).FirstOrDefault())
                    .ToListAsync();

                var noti = notificationsA
                    .Join(_context.Schedules,
                        notification => notification.ScheduleId,
                        schedule => schedule.Id,
                        (notification, schedule) => new { notification, schedule })
                    .Select(x => new
                    {
                        NotificationId = x.notification.Id,
                        ScheduleId = x.notification.ScheduleId,
                        FrequencyId = x.schedule.FrequencyId,
                        Name = x.schedule.Name,
                        EndDate = x.schedule.EndDate,
                        IsActive = x.schedule.IsActive,
                        DateNotificate = x.notification.DateNotificate,
                    })
                    .ToList();

                var data = new List<dynamic>();

                if (noti.Any())
                {
                    foreach (var notification in noti)
                    {
                        var no = notificationsA
                            .Where(x => x.Id == notification.NotificationId)
                            .FirstOrDefault();

                        var dateNotification = await new Common().GetDateNotification((DateTime)notification.DateNotificate, notification.FrequencyId);
                        if (dateNotification <= notification.EndDate.Value.ToDateTime(TimeOnly.MinValue))
                        {
                            Notification newNoti = new Notification
                            {
                                UserId = uId,
                                ScheduleId = notification.ScheduleId.Value,
                                DateNotificate = dateNotification,
                                Status = "A"
                            };

                            await _context.Notifications.AddAsync(newNoti);
                            data.Add(new
                            {
                                ScheduleId = newNoti.ScheduleId,
                                DateNotificate = dateNotification,
                                Name = notification.Name,
                            });
                        }
                        else
                        {
                            no.Status = "I";
                        }
                    }
                    await _context.SaveChangesAsync();
                    return Ok(new { ErrorCode = ErrorCode.UPDATEDATASUCCESS, Data = data });
                }
            }
            return BadRequest(new { ErrorCode = ErrorCode.TOKENINVALID });
        }

        [HttpPut("toggleactive")]
        [CustomAuthorize]
        public async Task<ActionResult> ChangeActive([FromQuery] int id)
        {
            var useID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(useID, out var uId))
            {
                var schedule = await _context.Schedules.Where(s => s.Id == id && s.UserId == uId).FirstOrDefaultAsync();

                if (schedule == null)
                {
                    return NotFound(new { ErrorCode = ErrorCode.NOTFOUND });
                }

                var notification = new Notification();
                if ((bool)schedule.IsActive)
                {
                    notification = await _context.Notifications
                        .Where(x => x.UserId == uId && x.ScheduleId == schedule.Id && x.Status == "A")
                        .OrderByDescending(x => x.DateNotificate)
                        .FirstOrDefaultAsync();

                    notification.Status = "I";

                    schedule.IsActive = !schedule.IsActive;

                    await _context.SaveChangesAsync();

                    return Ok(new
                    {
                        ErrorCode = ErrorCode.UPDATEDATASUCCESS,
                        Data = new
                        {
                            NotificationId = notification != null ? notification.Id : "",
                        }
                    });
                }
                else
                {
                    notification = await _context.Notifications
                        .Where(x => x.UserId == uId && x.ScheduleId == schedule.Id && x.Status == "I")
                        .OrderByDescending(x => x.DateNotificate)
                        .FirstOrDefaultAsync();

                    schedule.IsActive = !schedule.IsActive;

                    await _context.SaveChangesAsync();

                    return Ok(new
                    {
                        ErrorCode = ErrorCode.UPDATEDATASUCCESS,
                        Data = new
                        {
                            Notification = notification,
                            Schedule = schedule,
                        }
                    });
                }
            }
            else
            {
                return BadRequest(new { ErrorCode = ErrorCode.UPDATEDATAFAIL });
            }
        }

        [HttpDelete("delete")]
        [CustomAuthorize]
        public async Task<ActionResult> Delete([FromQuery] int id)
        {
            var useID = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(useID, out var uId))
            {
                var schedule = await _context.Schedules.Where(s => s.Id == id && s.UserId == uId).FirstOrDefaultAsync();

                if (schedule == null)
                {
                    return NotFound(new { ErrorCode = ErrorCode.NOTFOUND });
                }

                _context.Schedules.Remove(schedule);

                var notifications = await _context.Notifications.Where(x => x.UserId == uId && x.ScheduleId == schedule.Id).ToListAsync();
                var notificationId = notifications.OrderByDescending(x => x.DateNotificate).FirstOrDefault()?.Id ?? "";

                _context.Notifications.RemoveRange(notifications);

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    ErrorCode = ErrorCode.DELETEDATASUCCESS,
                    Data = new
                    {
                        NotificationId = notificationId,
                    }
                });
            }
            else
            {
                return BadRequest(new { ErrorCode = ErrorCode.DELETEDATAFAIL });
            }
        }
    }
}
