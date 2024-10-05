using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLCTAPI.Controllers.Category;
using QLCTAPI.DTOs;
using QLCTAPI.Models;
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

                return Ok(new { ErrorCode = ErrorCode.UPDATEDATASUCCESS });
            }
            else
            {
                return BadRequest(new { ErrorCode = ErrorCode.UPDATEDATAFAIL });
            }
        }

        [HttpPut("toggle-active")]
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

                schedule.IsActive = !schedule.IsActive;

                await _context.SaveChangesAsync();

                return Ok(new { ErrorCode = ErrorCode.UPDATEDATASUCCESS });
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

                await _context.SaveChangesAsync();

                return Ok(new { ErrorCode = ErrorCode.DELETEDATASUCCESS });
            }
            else
            {
                return BadRequest(new { ErrorCode = ErrorCode.DELETEDATAFAIL });
            }
        }
    }
}
